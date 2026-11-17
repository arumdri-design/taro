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

type ApiStyle = 'interactions' | 'generateContent';

interface ModelRoute {
  model: string;
  style: ApiStyle;
}

const POSITIONS = ['과거', '현재', '미래'] as const;

// 최신 모델 우선 → 문제 시 순차 대체할 후보군
const MODEL_ROUTES: ModelRoute[] = [
  { model: 'gemini-3.8-flash', style: 'interactions' },
  { model: 'gemini-3.8-flash-lite', style: 'interactions' },
  { model: 'gemini-3.0-flash', style: 'generateContent' },
  { model: 'gemini-2.5-flash', style: 'generateContent' },
];

const PER_REQUEST_TIMEOUT_MS = 4500;
const TOTAL_BUDGET_MS = 9000;

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

async function callRoute(
  route: ModelRoute,
  prompt: string,
  cleanKey: string
): Promise<{ ok: true; text: string } | { ok: false; status: number; detail: string }> {
  const url =
    route.style === 'interactions'
      ? 'https://generativelanguage.googleapis.com/v1beta/interactions'
      : `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          route.model
        )}:generateContent`;

  const body =
    route.style === 'interactions'
      ? { model: route.model, input: prompt }
      : {
          contents: [{ parts: [{ text: prompt }] }],
        };

  const response = await fetchWithTimeout(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': cleanKey,
      },
      body: JSON.stringify(body),
    },
    PER_REQUEST_TIMEOUT_MS
  );

  if (response.ok) {
    const data = (await response.json()) as Record<string, unknown>;
    const text =
      route.style === 'interactions'
        ? extractInteractionText(data)
        : extractGenerateContentText(data);

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

  const startedAt = Date.now();
  const attemptedModels: string[] = [];

  for (const route of MODEL_ROUTES) {
    if (Date.now() - startedAt > TOTAL_BUDGET_MS) {
      break;
    }

    attemptedModels.push(route.model);

    for (let retry = 0; retry < 2; retry++) {
      if (Date.now() - startedAt > TOTAL_BUDGET_MS) {
        break;
      }

      try {
        const result = await callRoute(route, prompt, cleanKey);

        if (result.ok) {
          return result.text;
        }

        // 키 자체 오류는 다른 모델로 넘어가도 동일하게 실패
        if (result.status === 400 || result.status === 403) {
          throw new Error(
            `API 키가 올바르지 않거나 권한이 없습니다. (${result.detail || result.status})`
          );
        }

        // 모델 미지원은 즉시 다음 후보 모델로 이동
        if (result.status === 404) {
          break;
        }

        // 일시적 서버 과부하/한도는 1회만 짧게 재시도 후 다음 모델로 이동
        if ((result.status === 503 || result.status === 429) && retry === 0) {
          await sleep(600);
          continue;
        }

        break;
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message.startsWith('API 키가 올바르지 않거나') ||
            error.message.includes('400') ||
            error.message.includes('403'))
        ) {
          throw error;
        }

        if (error instanceof DOMException && error.name === 'AbortError' && retry === 0) {
          await sleep(600);
          continue;
        }
        break;
      }
    }
  }

  throw new Error(
    `별들의 목소리를 듣지 못했어요. 잠시 후 다시 시도해 주세요. (시도 모델: ${attemptedModels.join(
      ' → '
    )})`
  );
}
