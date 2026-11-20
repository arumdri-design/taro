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

function getCardMeaningSafe(card: TarotCard | undefined, reversed: boolean): string {
  if (!card) {
    return '새로운 흐름과 내면의 신호가 교차하는 시점입니다.';
  }

  const anyCard = card as unknown as Record<string, unknown>;
  const dirObj = reversed
    ? (anyCard.reversed as { meaning?: unknown } | undefined)
    : (anyCard.upright as { meaning?: unknown } | undefined);
  const altObj = reversed
    ? (anyCard.upright as { meaning?: unknown } | undefined)
    : (anyCard.reversed as { meaning?: unknown } | undefined);

  if (typeof dirObj?.meaning === 'string' && dirObj.meaning.trim()) {
    return dirObj.meaning.trim();
  }
  if (typeof altObj?.meaning === 'string' && altObj.meaning.trim()) {
    return altObj.meaning.trim();
  }

  const directMeaning = reversed
    ? anyCard.reversedMeaning ?? anyCard.meaningReversed
    : anyCard.uprightMeaning ?? anyCard.meaningUpright ?? anyCard.meaning;

  if (typeof directMeaning === 'string' && directMeaning.trim()) {
    return directMeaning.trim();
  }

  return '새로운 흐름과 내면의 신호가 교차하는 시점입니다.';
}

function withTimeout<T>(promise: Promise<T>, ms = 30000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('응답 시간이 초과되었습니다. 다시 시도해 주세요.')),
        ms
      )
    ),
  ]);
}

async function callFortuneApi(body: Record<string, unknown>): Promise<string> {
  const response = await withTimeout(
    fetch('/api/fortune', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }),
    30000
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const serverMsg =
      typeof data?.error === 'string'
        ? data.error
        : `서버 응답 오류 (${response.status})`;
    throw new Error(serverMsg);
  }

  const text =
    data?.result || data?.reading || data?.text || data?.message || data?.content;
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

  const formattedCards = cards.map((c) => {
    const meaning = getCardMeaningSafe(c.card, c.reversed);
    const nameKo = c.card?.nameKo ?? '이름 미상 카드';
    const nameEn = c.card?.nameEn ?? c.card?.name ?? '';

    return {
      reversed: c.reversed,
      meaning,
      card: {
        ...(c.card ?? {}),
        nameKo,
        nameEn,
        upright: {
          ...((c.card as any)?.upright ?? {}),
          meaning:
            (c.card as any)?.upright?.meaning ??
            (!c.reversed ? meaning : '정방향의 흐름'),
        },
        reversed: {
          ...((c.card as any)?.reversed ?? {}),
          meaning:
            (c.card as any)?.reversed?.meaning ??
            (c.reversed ? meaning : '역방향의 흐름'),
        },
      },
    };
  });

  const readerPayload = {
    id: reader.id,
    name: reader.name,
    nameEn: reader.nameEn,
    personality: reader.personality,
    greeting: reader.greeting,
  };

  return await callFortuneApi({
    type: 'tarot',
    reader: readerPayload,
    payload: {
      question,
      cards: formattedCards,
      reader: readerPayload,
    },
  });
}

export async function getSajuReading(
  input: SajuInput,
  reader: Reader,
  _apiKey?: string
): Promise<string> {
  const readerPayload = {
    id: reader.id,
    name: reader.name,
    nameEn: reader.nameEn,
    personality: reader.personality,
    greeting: reader.greeting,
  };

  return await callFortuneApi({
    type: 'saju',
    reader: readerPayload,
    payload: {
      ...input,
      reader: readerPayload,
    },
  });
}
