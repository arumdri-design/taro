import { useMemo } from 'react';
import type { DrawnCard } from '@/services/gemini';
import TarotCardView from '@/components/TarotCardView';

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

  const renderRow = (rows: Array<{ item: DrawnCard; index: number }>, rowOffset: number) => {
    const count = rows.length;
    if (count === 0) return null;

    return (
      <div className="relative w-full h-24 sm:h-28">
        {rows.map(({ item, index }, idx) => {
          const revealed = picked.includes(index);
          const isMaxPicked = picked.length >= 3 && !revealed;
          const isLocked = Boolean(disabled || isMaxPicked || revealed);

          // 카드 폭(약 44px~52px)을 제외한 가용 폭(0% ~ 86%) 안에 모든 카드가 한 화면에 들어오도록 배치
          const leftPercent = count > 1 ? (idx / (count - 1)) * 86 : 43;

          return (
            <button
              key={`${index}-${rowOffset + idx}`}
              type="button"
              disabled={isLocked}
              onClick={() => onPick(index)}
              style={{
                left: `${leftPercent}%`,
                zIndex: revealed ? 1 : idx + 1,
              }}
              aria-label={`타로 카드 ${rowOffset + idx + 1}`}
              className={`absolute top-0 w-11 sm:w-14 transition-all duration-200 focus:outline-none ${
                revealed
                  ? 'opacity-0 pointer-events-none scale-75'
                  : isLocked
                  ? 'opacity-45 cursor-not-allowed'
                  : 'hover:-translate-y-2 active:-translate-y-2 cursor-pointer'
              }`}
            >
              <TarotCardView
                card={item.card}
                reversed={item.reversed}
                revealed={false}
                selected={false}
                disabled={isLocked}
                index={rowOffset + idx}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-center select-none overflow-hidden">
      <div className="w-full rounded-2xl border border-gold-500/20 bg-night-950/50 px-2 py-3 overflow-hidden">
        <div className="flex flex-col gap-3 w-full">
          {renderRow(topRow, 0)}
          {renderRow(bottomRow, topRow.length)}
        </div>
      </div>
    </div>
  );
}
