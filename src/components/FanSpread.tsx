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
    <div className="flex items-center px-3">
      {rows.map(({ item, index }, idx) => {
        const pickIdx = picked.indexOf(index);
        const revealed = pickIdx !== -1;
        const isMaxPicked = picked.length >= 3 && !revealed;

        return (
          <div
            key={`${index}-${rowOffset + idx}`}
            className={`w-16 sm:w-20 shrink-0 transition-transform duration-200 ${
              idx === 0 ? 'ml-0' : '-ml-7 sm:-ml-8'
            } ${
              !disabled && !isMaxPicked && !revealed
                ? 'hover:-translate-y-2 hover:z-30'
                : ''
            }`}
            style={{
              zIndex: revealed ? 40 + pickIdx : idx + 1,
            }}
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
      {/* 선택한 카드 3장 전용 표시 영역 */}
      <div className="mb-4 rounded-2xl border border-gold-500/30 bg-night-900/70 p-3">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="font-serif text-gold-300">선택한 카드</span>
          <span className="text-mystic-300/70">{picked.length} / 3장</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {POSITIONS.map((pos, slotIdx) => {
            const deckIndex = picked[slotIdx];
            const drawn = deckIndex !== undefined ? deck[deckIndex] : undefined;

            return (
              <div
                key={pos}
                className="flex flex-col items-center rounded-xl border border-gold-500/20 bg-night-950/60 p-2"
              >
                <span className="mb-1.5 text-[10px] font-serif text-gold-400">{pos}</span>

                {drawn ? (
                  <div className="w-16 sm:w-20">
                    <TarotCardView
                      card={drawn.card}
                      reversed={drawn.reversed}
                      revealed={true}
                      selected={true}
                      disabled={true}
                      index={slotIdx}
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[2/3.5] w-16 sm:w-20 items-center justify-center rounded-xl border border-dashed border-mystic-500/35 bg-night-900/40 text-[10px] text-mystic-300/45">
                    빈 슬롯
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 안내 문구 */}
      <p className="mb-2 text-center text-[11px] text-mystic-300/75">
        좌우로 스크롤하며 마음이 끌리는 카드 3장을 눌러 선택해 주세요 ({deck.length}장)
      </p>

      {/* 2줄 겹침 스프레드 영역 */}
      <div className="w-full overflow-x-auto overflow-y-visible py-3 rounded-2xl border border-gold-500/20 bg-night-950/50">
        <div className="inline-flex flex-col gap-3 min-w-full">
          {renderRow(topRow, 0)}
          {renderRow(bottomRow, topRow.length)}
        </div>
      </div>
    </div>
  );
}
