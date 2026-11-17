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
const PER_REQUEST_TIMEOUT_MS = 7000;

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

function getDirectionInfo(card: TarotCard, reversed: boolean) {
  const dir = reversed ? card.reversed : card.upright;
  const keywords =
    dir?.keywords?.slice(0, 3).join(', ') ||
    card.keywords?.slice(0, 3).join(', ') ||
    '전환, 흐름';
  const meaning =
    dir?.meaning ||
    '새로운 국면과 내면의 신호가 함께 움직이는 시점입니다.';
  return { keywords, meaning };
}

// 점술가 캐릭터(reader) 성향에 따라 도입·마무리 톤을 달리하는 로컬 폴백 해석기
function buildLocalFallbackReading({ question, cards, reader }: ReadingRequest): string {
  const [past, present, future] = cards;

  const pastInfo = getDirectionInfo(past.card, past.reversed);
  const presentInfo = getDirectionInfo(present.card, present.reversed);
  const futureInfo = getDirectionInfo(future.card, future.reversed);

  const isKai =
    reader.id?.toLowerCase().includes('kai') ||
    reader.name?.includes('카이');

  const introLine = isKai
    ? `밤공기가 가라앉은 자리에서 "${question}"에 대한 세 장의 흐름을 차분히 읽어보았어. 감정에 휩쓸리기보다 카드가 가리키는 핵심부터 짚어보자.`
    : `조용한 밤하늘 아래 "${question}"라는 마음을 품고 골라주신 세 장의 카드를 가만히 들여다보았어요. 카드들이 건네는 이야기를 함께 들어볼까요?`;

  const pastDir = past.reversed ? '역방향' : '정방향';
  const presentDir = present.reversed ? '역방향' : '정방향';
  const futureDir = future.reversed ? '역방향' : '정방향';

  const pastBody = isKai
    ? `지난 흐름에서는 [${past.card.nameKo}(${pastDir})] 카드가 자리 잡았어. 핵심 키워드는 (${pastInfo.keywords})이고, ${pastInfo.meaning} 지금까지 쌓여온 경험과 선택이 지금의 출발선을 만들었어.`
    : `지나온 자리에는 [${past.card.nameKo}(${pastDir})] 카드가 놓여 있어요. (${pastInfo.keywords})라는 기운 속에서, ${pastInfo.meaning} 그 시간들이 있었기에 지금의 고민도 깊어졌을 거예요.`;

  const presentBody = isKai
    ? `지금 네가 서 있는 자리는 [${present.card.nameKo}(${presentDir})]가 보여주고 있어. (${presentInfo.keywords})와 맞닿아 있는데, ${presentInfo.meaning} 지금은 상황을 정확히 파악하고 중심을 잡는 것이 우선이야.`
    : `현재의 마음을 비추는 카드는 [${present.card.nameKo}(${presentDir})]예요. (${presentInfo.keywords})의 결이 느껴지며, ${presentInfo.meaning} 스스로에게 조금 더 다정한 시선을 보내도 괜찮아요.`;

  const futureBody = isKai
    ? `앞으로의 방향은 [${future.card.nameKo}(${futureDir})] 쪽으로 열려 있어. (${futureInfo.keywords})를 기억해 둬. ${futureInfo.meaning} 네가 내리는 작은 선택 하나가 다음 장면을 바꿀 거야.`
    : `다가올 흐름은 [${future.card.nameKo}(${futureDir})] 카드가 조용히 밝혀주고 있어요. (${futureInfo.keywords})의 빛을 따라가 보세요. ${futureInfo.meaning} 서두르지 않아도 괜찮으니 마음이 이끄는 쪽을 믿어보세요.`;

  const outroLine = isKai
    ? `답은 이미 네 안에 있어. 오늘 나온 세 카드의 키워드(${pastInfo.keywords.split(',')[0]}, ${presentInfo.keywords.split(',')[0]}, ${futureInfo.keywords.split(',')[0]})를 떠올리며 한 걸음씩 움직여 봐.`
    : `오늘 뽑힌 카드들이 당신의 밤에 작은 등불이 되었으면 해요. 언제든 마음이 무거워질 때 다시 별빛 아래에서 이야기 나누어요.`;

  return [
    `[카드 총평]\n${introLine}\n\n${outroLine}`,
    `[과거의 흐름]\n${pastBody}`,
    `[현재의 상황]\n${presentBody}`,
    `[미래의 조언]\n${futureBody}`,
  ].join('\n\n');
}

export async function getTarotReading(
  req: ReadingRequest,
  apiKey: string
): Promise<string> {
  const { question, cards, reader } = req;
  const cleanKey = apiKey.trim();

  // API 키가 없으면 즉시 로컬 폴백 해석 제공
  if (!cleanKey) {
    return buildLocalFallbackReading(req);
  }

  const cardSummary = cards
    .map(
      (c, idx) =>
        `${POSITIONS[idx]}: ${c.card.nameKo} (${c.nameEn ?? c.card.name}) - ${
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

    // 2순위: gemini-flash-latest (generateContent, 1회만 대체 호출)
    const fallback = await callGenerateContent('gemini-flash-latest', prompt, cleanKey);
    if (fallback.ok) return fallback.text;

    // 429/503/빈응답 등 외부 API 실패 시 로컬 폴백으로 즉시 전환
    return buildLocalFallbackReading(req);
  } catch {
    // 네트워크 오류나 타임아웃 발생 시에도 멈추지 않고 로컬 폴백으로 전환
    return buildLocalFallbackReading(req);
  }
}
