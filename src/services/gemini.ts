import { GoogleGenerativeAI } from '@google/generative-ai';
import type { TarotCard } from '@/data/tarotCards';
import type { Reader } from '@/data/readers';
import type { SajuInput } from '@/data/sajuTypes';

export interface DrawnCard {
  card: TarotCard;
  reversed: boolean;
}

export interface TarotReadingParams {
  question: string;
  cards: DrawnCard[];
  reader: Reader;
}

// 공통 Gemini 인스턴스 헬퍼
function getGeminiModel(apiKey: string) {
  const trimmedKey = typeof apiKey === 'string' ? apiKey.trim() : '';
  if (!trimmedKey) {
    throw new Error('Gemini API 키가 유효하지 않습니다. 설정에서 키를 확인해 주세요.');
  }
  const genAI = new GoogleGenerativeAI(trimmedKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

// 1. 타로 해석 함수
export async function getTarotReading(
  params: TarotReadingParams,
  apiKey: string
): Promise<string> {
  if (!params || !params.question || !params.cards || params.cards.length === 0) {
    throw new Error('타로 상담 정보가 올바르지 않습니다.');
  }

  try {
    const model = getGeminiModel(apiKey);

    const cardsDescription = params.cards
      .map(
        (c, i) =>
          `${i + 1}번째 카드: ${c.card.nameKo} (${c.card.name}) - ${
            c.reversed ? '역방향' : '정방향'
          }`
      )
      .join('\n');

    const prompt = `
당신은 깊은 통찰력과 신비로운 지혜를 지닌 타로 마스터이자 상담가인 ${params.reader.name}(${params.reader.nameEn})입니다.
내담자의 고민과 뽑은 세 장의 타로 카드를 바탕으로, 마음을 울리는 깊이 있고 따뜻한 타로 리딩을 작성해 주세요.

[상담가 프로필 및 성향]
- 이름: ${params.reader.name} (${params.reader.nameEn})
- 성향 및 말투: ${params.reader.trait}
- 인사말: "${params.reader.greeting}"

[내담자 고민]
"${params.question}"

[선택된 카드]
${cardsDescription}

[작성 가이드라인]
1. 상담가 고유의 말투와 분위기를 살려 신뢰감 있고 몰입감 있게 작성해 주세요.
2. 대괄호 형식의 소제목(예: [첫 번째 흐름], [마음의 깊은 이면], [상담가의 따뜻한 조언])을 포함하여 가독성 있게 구성해 주세요.
3. 마크다운 형식으로 풍부하고 정성스럽게 작성해 주세요.
`.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || typeof text !== 'string') {
      throw new Error('AI로부터 유효한 타로 응답을 받지 못했습니다.');
    }

    return text;
  } catch (err: unknown) {
    if (err instanceof Error) throw new Error(err.message);
    throw new Error('타로 해석 중 알 수 없는 시스템 오류가 발생했습니다.');
  }
}

// 2. 사주 해석 함수
export async function getSajuReading(
  input: SajuInput,
  reader: Reader,
  apiKey: string
): Promise<string> {
  if (!input || !input.name || !input.birthYear) {
    throw new Error('사주 입력 정보가 올바르지 않습니다.');
  }

  try {
    const model = getGeminiModel(apiKey);

    const genderText = input.gender === 'male' ? '남성' : '여성';
    const calendarText = input.calendar === 'solar' ? '양력' : '음력';
    const hourText = input.birthHour !== undefined ? `${input.birthHour}시 경` : '시간 미상';

    const prompt = `
당신은 깊은 통찰력과 신비로운 지혜를 지닌 전문 점성술사이이자 명리학자이며, 밤하늘 타로 상담소의 파트너 ${reader.name}(${reader.nameEn})입니다.
아래 내담자의 사주 명식 및 생년월일시 정보를 바탕으로 정성스럽고 깊이 있는 사주팔자·점성술 운세 풀이를 작성해 주세요.

[내담자 정보]
- 이름(또는 닉네임): ${input.name}
- 성별: ${genderText}
- 생년월일: ${input.birthYear}년 ${input.birthMonth}월 ${input.birthDay}일 (${calendarText})
- 태어난 시간: ${hourText}
- 전담 상담가: ${reader.name} (${reader.trait})

[작성 가이드라인]
1. 상담가 고유의 말투와 신비롭고 따뜻한 분위기를 담아 신뢰감 있게 작성해 주세요.
2. 대괄호 형식의 소제목(예: [타고난 천성과 기운], [올해의 운세 흐름], [재물과 성공의 길], [인연과 인간관계], [상담가의 따뜻한 조언])을 포함하여 가독성 있게 구성해 주세요.
3. 명리학적·점성술적 통찰을 일상에서 실천할 수 있는 지혜로운 조언과 함께 풀어주세요.
4. 마크다운 형식으로 풍부하고 몰입감 있게 작성해 주세요.
`.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || typeof text !== 'string') {
      throw new Error('AI로부터 유효한 운세 응답을 받지 못했습니다.');
    }

    return text;
  } catch (err: unknown) {
    if (err instanceof Error) throw new Error(err.message);
    throw new Error('사주 및 운세 풀이 중 알 수 없는 시스템 오류가 발생했습니다.');
  }
}
