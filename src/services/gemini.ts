import type { TarotCard } from '@/data/tarotCards';
import type { Reader } from '@/data/readers';

export interface DrawnCard {
  card: TarotCard;
  reversed: boolean;
}

export interface ReadingInput {
  question: string;
  cards: DrawnCard[];
  reader: Reader;
}

const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function getTarotReading(
  input: ReadingInput,
  apiKey: string
): Promise<string> {
  const cardDescription = input.cards
    .map((drawn, index) => {
      const positions = ['과거', '현재', '미래'];
      const position = positions[index];
      const direction = drawn.reversed ? '역방향' : '정방향';
      return `${position}: ${drawn.card.nameKo} (${drawn.card.name}) - ${direction}, 키워드: ${drawn.card.keywords.join(', ')}`;
    })
    .join('\n');

  const prompt = `당신은 타로 해석을 제공하는 AI입니다. 아래의 점술가 캐릭터 설정을 완벽하게 연기하며, 그 캐릭터가 된 것처럼 해석해 주세요.

[점술가 캐릭터 설정 - 반드시 이 설정대로 말투와 태도를 유지할 것]
${input.reader.persona}
이름: ${input.reader.name}

[상담자의 고민]
${input.question}

[뽑힌 카드]
${cardDescription}

[작성 지침]
- 반드시 한국어로 작성할 것
- 점술가 캐릭터의 이름과 성격을 유지한 채, 그 캐릭터만의 말투와 어조로 해석할 것
- 세 장의 카드를 과거-현재-미래의 흐름으로 자연스럽게 연결지어 해석할 것
- 정방향과 역방향의 의미를 구분하여 해석할 것
- 마지막에 상담자에게 전하는 따뜻한 조언과 격려를 담을 것
- 소제목을 활용해 다음 구조로 작성할 것: "카드의 흐름" (전체 요약), 과거/현재/미래 각각의 해석, "전하는 마음" (조언과 격려)
- 마크다운 별표(**)나 특수 기호는 사용하지 말고, 소제목은 [소제목] 형태로만 구분할 것
- 너무 길지 않게, 읽기 편한 문단으로 나눌 것`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2048,
    },
  };

  let response: Response;
  try {
    response = await fetch(`${API_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('네트워크에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.');
  }

  if (!response.ok) {
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      throw new Error('API 키가 올바르지 않아요. 키를 다시 확인해 주세요.');
    }
    if (response.status === 429) {
      throw new Error('요청이 너무 많아요. 잠시 후 다시 시도해 주세요.');
    }
    throw new Error('별들의 목소리를 듣지 못했어요. 잠시 후 다시 시도해 주세요.');
  }

  const data = await response.json();

  const text: string | undefined = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? '')
    .join('')
    .trim();

  if (!text) {
    throw new Error('해석 결과를 받지 못했어요. 다시 시도해 주세요.');
  }

  return text;
}
