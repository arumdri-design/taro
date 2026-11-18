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

export async function getTarotReading(req: TarotRequest): Promise<string> {
  const response = await fetch('/api/fortune', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'tarot',
      payload: { question: req.question, cards: req.cards },
      reader: req.reader,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || '타로 해석을 불러오는 중 오류가 발생했습니다.');
  }
  return data.result;
}

export async function getSajuReading(input: SajuInput, reader: Reader): Promise<string> {
  const response = await fetch('/api/fortune', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'saju',
      payload: input,
      reader: reader,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || '사주 풀이를 불러오는 중 오류가 발생했습니다.');
  }
  return data.result;
}
