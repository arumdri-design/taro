import type { TarotCard } from '@/data/tarotCards';
import type { Reader } from '@/data/readers';
import type { SajuInput } from '@/data/sajuTypes';

export interface DrawnCard {
  card: TarotCard;
  reversed: boolean;
}

export interface TarotRequest {
  question: string;
  cards: DrawnCard[];
  reader: Reader;
}

// 지정된 시간(기본 25초) 내에 응답이 없으면 타임아웃 발생
function withTimeout<T>(promise: Promise<T>, ms = 25000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('응답 시간이 초과되었습니다. 다시 시도해 주세요.')), ms)
    ),
  ]);
}

// Vercel 서버리스 백엔드(/api/fortune) 호출 함수
async function callFortuneApi(payload: Record<string, unknown>): Promise<string> {
  const response = await withTimeout(
    fetch('/api/fortune', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }),
    25000
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const serverMsg =
      typeof data?.error === 'string'
        ? data.error
        : `서버 응답 오류 (${response.status})`;
    throw new Error(serverMsg);
  }

  const text = data?.reading || data?.result || data?.text || data?.message;
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('AI 응답 본문이 비어 있습니다.');
  }

  return text.trim();
}

export async function getTarotReading(
  req: TarotRequest,
  _apiKey?: string
): Promise<string> {
  const { question, cards, reader } = req;

  const cardDescriptions = cards
    .map((c, idx) => {
      const dir = c.reversed ? '역방향' : '정방향';
      const meaning = c.reversed ? c.card.reversed.meaning : c.card.upright.meaning;
      return `${idx + 1}번째 카드: ${c.card.nameKo} (${c.card.nameEn}) - ${dir} / 핵심의미: ${meaning}`;
    })
    .join('\n');

  const prompt = `당신은 '${reader.name}'(${reader.nameEn})이라는 이름의 타로 점술가입니다.
성격 및 말투: ${reader.personality}
인사말 스타일: "${reader.greeting}"

내담자의 고민: "${question}"

뽑힌 3장의 카드:
${cardDescriptions}

위 페르소나와 말투를 완벽히 유지하여 내담자에게 따뜻하고 깊이 있는 타로 해석을 들려주세요.
반드시 아래의 대괄호 소제목 형식을 포함해서 작성해 주세요:
[카드가 보여주는 현재의 흐름]
[카드별 세부 해석]
[${reader.name}의 조언]`;

  return await callFortuneApi({
    type: 'tarot',
    prompt,
    question,
    cards: cards.map((c) => ({
      nameKo: c.card.nameKo,
      nameEn: c.card.nameEn,
      reversed: c.reversed,
      meaning: c.reversed ? c.card.reversed.meaning : c.card.upright.meaning,
    })),
    reader: {
      id: reader.id,
      name: reader.name,
      nameEn: reader.nameEn,
      personality: reader.personality,
      greeting: reader.greeting,
    },
  });
}

export async function getSajuReading(
  input: SajuInput,
  reader: Reader,
  _apiKey?: string
): Promise<string> {
  const genderText = input.gender === 'male' ? '남성' : '여성';
  const calText = input.calendar === 'solar' ? '양력' : '음력';
  const hourText = input.birthHour !== undefined ? `${input.birthHour}시` : '태어난 시간 모름';

  const prompt = `당신은 '${reader.name}'(${reader.nameEn})이라는 이름의 사주 명리학 및 운세 전문가입니다.
성격 및 말투: ${reader.personality}
인사말 스타일: "${reader.greeting}"

내담자 정보:
- 이름: ${input.name}
- 성별: ${genderText}
- 생년월일: ${input.birthYear}년 ${input.birthMonth}월 ${input.birthDay}일 (${calText})
- 태어난 시간: ${hourText}

위 정보를 바탕으로 사주 명식의 오행과 기운, 성격적 강점, 올해의 운세 흐름(재물운, 연애/대인운, 직업운)을 '${reader.name}'의 말투로 다정하고 통찰력 있게 풀이해 주세요.
반드시 아래의 대괄호 소제목 형식을 포함해서 작성해 주세요:
[${input.name}님의 타고난 사주 기운]
[올해의 운세와 흐름]
[재물·연애·직업운 조언]
[${reader.name}의 개운 메시지]`;

  return await callFortuneApi({
    type: 'saju',
    prompt,
    input,
    reader: {
      id: reader.id,
      name: reader.name,
      nameEn: reader.nameEn,
      personality: reader.personality,
      greeting: reader.greeting,
    },
  });
}
