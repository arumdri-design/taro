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

// 503 폭주 시 순서대로 시도할 모델 후보군
const MODEL_CANDIDATES = [
  'gemini-3.8-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
] as const;

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';

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

async function callModel(
  model: string,
  prompt: string,
  cleanKey: string
): Promise<{ ok: true; text: string } | { ok: false; status: number; detail: string }> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': cleanKey,
    },
    body: JSON.stringify({
      model,
      input: prompt,
    }),
  });

  if (response.ok) {
    const data = (await response.json()) as Record<string, unknown>;
    const text = extractInteractionText(data);
    if (!text) {
      return { ok: false, status: 200, detail: '빈 응답' };
    }
    return { ok: true, text };
  }

  let detail = '';
  try {
    const errJson = await response.json();
    detail = errJson?.error?.message || '';
  } catch {
    // ignore json parse error
  }

  return { ok: false, status: response.status, detail };
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

  const failures: string[] = [];

  for (let round = 0; round < 2; round++) {
    if (round > 0) {
      await sleep(1200);
    }

    for (const model of MODEL_CANDIDATES) {
      const result = await callModel(model, prompt, cleanKey);

      if (result.ok) {
        return result.text;
      }

      // 400/403은 키 자체의 권한/형식 문제이므로 다른 모델로 돌려도 똑같이 실패함
      if (result.status === 400 || result.status === 403) {
        throw new Error(
          `API 키가 올바르지 않거나 권한이 없습니다. (${result.detail || result.status})`
        );
      }

      failures.push(`${model}: ${result.status}`);
    }
  }

  throw new Error(
    `모든 모델이 일시적으로 응답하지 않아요. 잠시 후 다시 시도해 주세요. (${failures
      .slice(-4)
      .join(', ')})`
  );
}
