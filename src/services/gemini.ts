import type { TarotCard } from '@/data/tarotCards';
import type { Reader } from '@/data/readers';

export interface DrawnCard {
  card: TarotCard;
  reversed: boolean;
}

interface ReadingRequest {
  question: string;
  cards: DrawnCard[];
  reader: Reader;
}

const POSITIONS = ['과거', '현재', '미래'] as const;
const MODEL = 'gemini-3.8-flash';
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractInteractionText(data: Record<string, unknown>): string {
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text;
  }

  const outputs = Array.isArray(data.outputs) ? data.outputs : [];
  const chunks: string[] = [];

  for (const item of outputs) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    if (typeof record.text === 'string' && record.text.trim()) {
      chunks.push(record.text);
    }
    if (Array.isArray(record.content)) {
      for (const part of record.content) {
        if (part && typeof part === 'object') {
          const partRecord = part as Record<string, unknown>;
          if (typeof partRecord.text === 'string' && partRecord.text.trim()) {
            chunks.push(partRecord.text);
          }
        }
      }
    }
  }

  return chunks.join('\n').trim();
}

export async function getTarotReading(
  { question, cards, reader }: ReadingRequest,
  apiKey: string
): Promise<string> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    throw new Error('Gemini API 키가 비어 있습니다. 키를 다시 입력해 주세요.');
  }

  const cardSummary = cards
    .map(
      (c, idx) =>
        `${POSITIONS[idx]}: ${c.card.nameKo} (${c.card.nameEn}) - ${
          c.reversed ? '역방향' : '정방향'
        }`
    )
    .join('\n');

  const prompt = `당신은 타로 점술가 "${reader.name}"입니다.
성격과 말투: ${reader.promptStyle || reader.trait}

사용자 고민: "${question}"

뽑힌 3장의 카드:
${cardSummary}

위 세 장의 카드를 바탕으로 [카드 총평], [과거의 흐름], [현재의 상황], [미래의 조언] 소제목을 대괄호([ ])로 구분하여 따뜻하고 깊이 있게 해석해 주세요.`;

  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/interactions';

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': cleanKey,
      },
      body: JSON.stringify({
        model: MODEL,
        input: prompt,
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as Record<string, unknown>;
      const text = extractInteractionText(data);

      if (!text) {
        throw new Error('해석 결과를 받아오지 못했습니다. 다시 시도해 주세요.');
      }
      return text;
    }

    let detail = '';
    try {
      const errJson = await response.json();
      detail = errJson?.error?.message || '';
    } catch {
      // ignore json parse error
    }

    // 503(서버 폭주) 또는 429(일시적 한도)는 잠시 대기 후 재시도
    if ((response.status === 503 || response.status === 429) && attempt < MAX_RETRIES) {
      await sleep(1500 * Math.pow(2, attempt));
      continue;
    }

    if (response.status === 400 || response.status === 403) {
      throw new Error(`API 키가 올바르지 않거나 권한이 없습니다. (${detail || response.status})`);
    }
    if (response.status === 429) {
      throw new Error(`API 호출 한도를 초과했습니다. 잠시 후 다시 시도해 주세요. (${detail})`);
    }
    throw new Error(
      `별들의 목소리를 듣지 못했어요. (${response.status}${detail ? `: ${detail}` : ''})`
    );
  }

  throw new Error('별들의 목소리를 듣지 못했어요. 잠시 후 다시 시도해 주세요.');
}
