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
const PER_REQUEST_TIMEOUT_MS = 8000;

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

function extractGenerateContentText(data: Record<string, unknown>): string {
  const candidates = Array.isArray(data.candidates) ? data.candidates : [];
  const chunks: string[] = [];

  for (const cand of candidates) {
    if (!cand || typeof cand !== 'object') continue;
    const content = (cand as Record<string, unknown>).content;
    if (!content || typeof content !== 'object') continue;
    const parts = Array.isArray((content as Record<string, unknown>).parts)
      ? ((content as Record<string, unknown>).parts as unknown[])
      : [];
    for (const part of parts) {
      if (part && typeof part === 'object') {
        const text = (part as Record<string, unknown>).text;
        if (typeof text === 'string' && text.trim()) {
          chunks.push(text);
        }
      }
    }
  }

  return chunks.join('\n').trim();
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timer);
  }
}

async function callInteractions(
  model: string,
  prompt: string,
  cleanKey: string
): Promise<{ ok: true; text: string } | { ok: false; status: number; detail: string }> {
  const response = await fetchWithTimeout(
    'https://generativelanguage.googleapis.com/v1beta/interactions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': cleanKey,
      },
      body: JSON.stringify({ model, input: prompt }),
    },
    PER_REQUEST_TIMEOUT_MS
  );

  if (response.ok) {
    const data = (await response.json()) as Record<string, unknown>;
    const text = extractInteractionText(data);
    return text ? { ok: true, text } : { ok: false, status: 200, detail: '빈 응답' };
  }

  let detail = '';
  try {
    const errJson = await response.json();
    detail = errJson?.error?.message || '';
  } catch {
    // ignore
  }

  return { ok: false, status: response.status, detail };
}

async function callGenerateContent(
  model: string,
  prompt: string,
  cleanKey: string
): Promise<{ ok: true; text: string } | { ok: false; status: number; detail: string }> {
  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': cleanKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
    PER_REQUEST_TIMEOUT_MS
  );

  if (response.ok) {
    const data = (await response.json()) as Record<string, unknown>;
    const text = extractGenerateContentText(data);
    return text ? { ok: true, text } : { ok: false, status: 200, detail: '빈 응답' };
  }

  let detail = '';
  try {
    const errJson = await response.json();
    detail = errJson?.error?.message || '';
  } catch {
    // ignore
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

  try {
    // 1순위: gemini-3.8-flash (Interactions API)
    const primary = await callInteractions('gemini-3.8-flash', prompt, cleanKey);
    if (primary.ok) return primary.text;

    if (primary.status === 400 || primary.status === 403) {
      throw new Error(
        `API 키가 올바르지 않거나 권한이 없습니다. (${primary.detail || primary.status})`
      );
    }

    // 2순위: gemini-flash-latest (generateContent, 1회만 대체 호출)
    const fallback = await callGenerateContent('gemini-flash-latest', prompt, cleanKey);
    if (fallback.ok) return fallback.text;

    if (primary.status === 429 || fallback.status === 429) {
      throw new Error(
        '잠시 요청이 몰려 무료 호출 한도에 도달했어요. 1분 정도 뒤에 다시 시도해 주세요.'
      );
    }

    throw new Error(
      `별들의 목소리를 듣지 못했어요. 잠시 후 다시 시도해 주세요. (${primary.status}/${fallback.status})`
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('응답이 지연되고 있어요. 잠시 후 다시 시도해 주세요.');
    }
    throw error;
  }
}
