import { useMemo } from 'react';
import type { DrawnCard } from '@/services/gemini';
import TarotCardView from '@/components/TarotCardView';

const POSITIONS = ['과거', '현재', '미래'] as const;

interface FanSpreadProps {
  deck: DrawnCard[];
  picked: number[];
  disabled?: boolean;
  onPick: (index: number) => void;
}

export default function FanSpread({ deck, picked, disabled, onPick }: FanSpreadProps) {
  const { topRow, bottomRow } = useMemo(() => {
    const mid = Math.ceil(deck.length / 2);
    return {
      topRow: deck.map((item, index) => ({ item, index })).slice(0, mid),
      bottomRow: deck.map((item, index) => ({ item, index })).slice(mid),
    };
  }, [deck]);

  const renderRow = (rows: Array<{ item: DrawnCard; index: number }>, rowOffset: number) => (
    <div className="flex items-center gap-2.5 px-2">
      {rows.map(({ item, index }, idx) => {
        const pickIdx = picked.indexOf(index);
        const revealed = pickIdx !== -1;
        const isMaxPicked = picked.length >= 3 && !revealed;

        return (
          <div
            key={`${index}-${rowOffset + idx}`}
            className="w-16 sm:w-20 shrink-0 transition-transform duration-200"
          >
            <TarotCardView
              card={item.card}
              reversed={item.reversed}
              revealed={revealed}
              selected={revealed}
              disabled={disabled || isMaxPicked}
              label={revealed ? POSITIONS[pickIdx] : undefined}
              index={rowOffset + idx}
              onClick={() => onPick(index)}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="mt-4 w-full select-none">
      <p className="mb-2 text-center text-[11px] text-mystic-300/75">
        좌우로 스크롤하며 마음이 끌리는 카드 3장을 눌러 선택해 주세요 ({deck.length}장)
      </p>

      <div className="w-full overflow-x-auto overflow-y-hidden py-3 rounded-2xl border border-gold-500/20 bg-night-950/50">
        <div className="inline-flex flex-col gap-3 min-w-full">
          {renderRow(topRow, 0)}
          {renderRow(bottomRow, topRow.length)}
        </div>
      </div>
    </div>
  );
}
