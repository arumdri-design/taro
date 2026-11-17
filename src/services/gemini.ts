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
const PER_REQUEST_TIMEOUT_MS = 6000;
const TOTAL_BUDGET_MS = 14000;

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

async function callInteractions(
  model: string,
  prompt: string,
  cleanKey: string
): Promise<{ ok: true; text: string } | { ok: false; reason: string; fatal?: boolean }> {
  try {
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
      return text ? { ok: true, text } : { ok: false, reason: '빈응답' };
    }

    let detail = '';
    try {
      const errJson = await response.json();
      detail = errJson?.error?.message || '';
    } catch {
      // ignore
    }

    if (response.status === 400 || response.status === 403) {
      return {
        ok: false,
        reason: `API 키가 올바르지 않거나 권한이 없습니다. (${detail || response.status})`,
        fatal: true,
      };
    }

    return { ok: false, reason: `${response.status}` };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, reason: '시간초과' };
    }
    return { ok: false, reason: '네트워크오류' };
  }
}

async function callGenerateContent(
  model: string,
  prompt: string,
  cleanKey: string
): Promise<{ ok: true; text: string } | { ok: false; reason: string; fatal?: boolean }> {
  try {
    const cleanModel = model.replace(/^models\//, '');
    const response = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        cleanModel
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
      return text ? { ok: true, text } : { ok: false, reason: '빈응답' };
    }

    let detail = '';
    try {
      const errJson = await response.json();
      detail = errJson?.error?.message || '';
    } catch {
      // ignore
    }

    if (response.status === 400 || response.status === 403) {
      return {
        ok: false,
        reason: `API 키가 올바르지 않거나 권한이 없습니다. (${detail || response.status})`,
        fatal: true,
      };
    }

    return { ok: false, reason: `${response.status}` };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, reason: '시간초과' };
    }
    return { ok: false, reason: '네트워크오류' };
  }
}

// 현재 API 키로 실제 호출 가능한 Flash 모델 목록 자동 조회
async function fetchAvailableFlashModels(cleanKey: string): Promise<string[]> {
  try {
    const response = await fetchWithTimeout(
      'https://generativelanguage.googleapis.com/v1beta/models',
      {
        method: 'GET',
        headers: {
          'x-goog-api-key': cleanKey,
        },
      },
      4000
    );

    if (!response.ok) return [];

    const data = (await response.json()) as {
      models?: Array<{
        name?: string;
        supportedGenerationMethods?: string[];
      }>;
    };

    const models = Array.isArray(data.models) ? data.models : [];

    return models
      .filter((m) => {
        const name = (m.name || '').toLowerCase();
        const methods = m.supportedGenerationMethods || [];
        return (
          name.includes('flash') &&
          !name.includes('thinking') &&
          !name.includes('audio') &&
          !name.includes('image') &&
          methods.includes('generateContent')
        );
      })
      .map((m) => (m.name || '').replace(/^models\//, ''))
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a)); // 최신 버전 번호가 먼저 오도록 정렬
  } catch {
    return [];
  }
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
  const logs: string[] = [];

  // 1순위: gemini-3.8-flash (Interactions API)
  const primary = await callInteractions('gemini-3.8-flash', prompt, cleanKey);
  if (primary.ok) return primary.text;
  if (primary.fatal) throw new Error(primary.reason);
  logs.push(`gemini-3.8-flash(${primary.reason})`);

  // 2순위: 현재 API 키에서 실제 사용 가능한 Flash 모델 목록 조회 후 순차 시도
  const availableModels = await fetchAvailableFlashModels(cleanKey);

  if (availableModels.length === 0) {
    await sleep(800);
    const retryPrimary = await callInteractions('gemini-3.8-flash', prompt, cleanKey);
    if (retryPrimary.ok) return retryPrimary.text;
    logs.push(`재시도(${retryPrimary.reason})`);
  }

  for (const model of availableModels) {
    if (Date.now() - startedAt > TOTAL_BUDGET_MS) break;

    const res = await callGenerateContent(model, prompt, cleanKey);
    if (res.ok) return res.text;
    if (res.fatal) throw new Error(res.reason);
    logs.push(`${model}(${res.reason})`);
  }

  throw new Error(
    `별들의 목소리를 듣지 못했어요. 잠시 후 다시 시도해 주세요. [${logs.join(', ')}]`
  );
}
