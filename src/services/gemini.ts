import { GoogleGenerativeAI } from '@google/generative-ai';
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

// 지정된 시간(기본 15초) 내에 응답이 없으면 강제로 타임아웃을 발생시키는 유틸리티
function withTimeout<T>(promise: Promise<T>, ms = 15000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), ms)
    ),
  ]);
}

function getGeminiModel(apiKey: string) {
  const trimmedKey = typeof apiKey === 'string' ? apiKey.trim() : '';
  if (!trimmedKey) {
    throw new Error('NO_API_KEY');
  }
  const genAI = new GoogleGenerativeAI(trimmedKey);
  return genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
}

// 타로 응답 지연/에러 시 보여줄 임시(폴백) 해석 생성
function getFallbackTarotReading(req: TarotRequest): string {
  const { question, cards, reader } = req;
  const c1 = cards[0];
  const c2 = cards[1];
  const c3 = cards[2];

  return `[${reader.name}의 별빛 메시지]
"${question}"에 대한 별들의 흐름을 읽어보았습니다. 잠시 별빛의 연결이 고르지 못해 핵심 기운을 먼저 전해드려요.

[첫 번째 카드 - ${c1.card.nameKo} (${c1.reversed ? '역방향' : '정방향'})]
${c1.reversed ? c1.card.reversed.meaning : c1.card.upright.meaning}
현재 당신의 마음속에는 변화에 대한 기대와 조심스러움이 함께 자리 잡고 있습니다.

[두 번째 카드 - ${c2.card.nameKo} (${c2.reversed ? '역방향' : '정방향'})]
${c2.reversed ? c2.card.reversed.meaning : c2.card.upright.meaning}
지금 마주한 상황에서는 서두르기보다 한 걸음 물러서서 주변의 신호를 살피는 지혜가 필요합니다.

[세 번째 카드 - ${c3.card.nameKo} (${c3.reversed ? '역방향' : '정방향'})]
${c3.reversed ? c3.card.reversed.meaning : c3.card.upright.meaning}
조만간 막혀 있던 흐름이 서서히 풀리며 긍정적인 단서가 찾아올 것입니다.

[${reader.name}의 따뜻한 조언]
가장 중요한 열쇠는 이미 당신 안에 있습니다. 오늘 뽑은 세 장의 카드가 전하는 직감을 믿고 편안한 마음으로 한 걸음 내디뎌 보세요.`;
}

// 사주 응답 지연/에러 시 보여줄 임시(폴백) 해석 생성
function getFallbackSajuReading(input: SajuInput, reader: Reader): string {
  const genderText = input.gender === 'male' ? '남성' : '여성';
  const calText = input.calendar === 'solar' ? '양력' : '음력';
  const hourText = input.birthHour !== undefined ? `${input.birthHour}시경` : '시간 미상';

  return `[${input.name}님의 타고난 기운]
${input.birthYear}년 ${input.birthMonth}월 ${input.birthDay}일 (${calText}, ${hourText}, ${genderText})의 명식을 살펴보았습니다.
기본적으로 내면의 심지가 굳고, 한 번 마음을 정하면 끝까지 밀고 나가는 단단한 기운을 지니고 계십니다.

[올해와 다가오는 운의 흐름]
주변 환경에 작은 변화들이 찾아오면서 새로운 기회를 엿볼 수 있는 시기입니다. 당장 눈에 보이는 결과에 조급해하기보다는, 지금 쌓아가는 경험과 인연이 곧 든든한 밑거름이 될 것입니다.

[재물과 인연운]
크게 무리한 투자나 급격한 변화보다는 안정적인 흐름을 유지할 때 복이 따릅니다. 대인관계에서는 진심을 다해 소통하는 태도가 귀인을 불러오는 열쇠가 됩니다.

[${reader.name}의 개운 조언]
운명은 정해진 틀이 아니라 내가 어떻게 가꾸느냐에 따라 빛깔이 달라집니다. 스스로를 믿고 차분히 나아가신다면 머지않아 만족스러운 결실을 맺으실 거예요.`;
}

export async function getTarotReading(
  req: TarotRequest,
  apiKey: string
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

  try {
    const model = getGeminiModel(apiKey);
    const result = await withTimeout(model.generateContent(prompt), 15000);
    const text = result.response.text();
    return text?.trim() || getFallbackTarotReading(req);
  } catch (err) {
    console.warn('Gemini 타로 호출 지연 또는 오류로 임시 해석을 반환합니다:', err);
    return getFallbackTarotReading(req);
  }
}

export async function getSajuReading(
  input: SajuInput,
  reader: Reader,
  apiKey: string
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

  try {
    const model = getGeminiModel(apiKey);
    const result = await withTimeout(model.generateContent(prompt), 15000);
    const text = result.response.text();
    return text?.trim() || getFallbackSajuReading(input, reader);
  } catch (err) {
    console.warn('Gemini 사주 호출 지연 또는 오류로 임시 해석을 반환합니다:', err);
    return getFallbackSajuReading(input, reader);
  }
}
