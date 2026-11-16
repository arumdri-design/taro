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

const ARC_SPAN = 48; // 전체 부채꼴 각도 (도)
const ARC_DROP = 14; // 가장자리 카드가 내려가는 깊이 (px)

export default function FanSpread({ deck, picked, disabled, onPick }: FanSpreadProps) {
  const slots = useMemo(() => {
    const count = deck.length; // 78장 전체
    return deck.map((item, deckIndex) => ({
      item,
      deckIndex,
      slot: deckIndex,
      total: count,
    }));
  }, [deck]);

  return (
    <div className="mt-4 w-full select-none">
      <p className="mb-2 text-center text-[11px] text-mystic-300/75">
        좌우로 스크롤하며 마음이 끌리는 카드 3장을 눌러 선택해 주세요 ({deck.length}장)
      </p>

      {/* 가로 스크롤 가능한 부채꼴 영역 */}
      <div
        className="relative w-full overflow-x-auto overflow-y-visible py-4 scrollbar-thin"
        style={{ minHeight: 'clamp(225px, 56vw, 290px)' }}
      >
        <div
          className="relative flex items-end"
          style={{
            // 카드 간격을 28px로 둬서 78장 전체를 좌우로 스크롤하며 넉넉히 클릭 가능
            width: `${Math.max(slots.length * 28 + 90, 320)}px`,
            minWidth: '100%',
            height: 'clamp(210px, 54vw, 275px)',
          }}
        >
          {slots.map(({ deckIndex, slot, total }) => {
            const t = total > 1 ? slot / (total - 1) : 0.5; // 0..1
            const mid = (t - 0.5) * 2; // -1..1
            const angle = mid * (ARC_SPAN / 2);
            const drop = Math.abs(mid) * ARC_DROP;
            const leftPx = slot * 28 + 12;

            const pickIdx = picked.indexOf(deckIndex);
            const revealed = pickIdx !== -1;
            const isMaxPicked = picked.length >= 3 && !revealed;

            return (
              <div
                key={`${deckIndex}-${slot}`}
                className="absolute bottom-3 transition-transform duration-200"
                style={{
                  left: `${leftPx}px`,
                  width: 'clamp(72px, 19vw, 92px)',
                  transform: `translateY(${revealed ? -16 : drop}px) rotate(${
                    revealed ? 0 : angle
                  }deg)`,
                  transformOrigin: 'bottom center',
                  zIndex: revealed ? 60 + pickIdx : 10 + slot,
                }}
                onMouseEnter={(e) => {
                  if (!revealed) {
                    (e.currentTarget as HTMLElement).style.zIndex = '55';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!revealed) {
                    (e.currentTarget as HTMLElement).style.zIndex = `${10 + slot}`;
                  }
                }}
              >
                <div
                  className={`transition-transform duration-200 ${
                    !disabled && !isMaxPicked && !revealed ? 'hover:-translate-y-3' : ''
                  }`}
                >
                  <TarotCardView
                    card={deck[deckIndex].card}
                    reversed={deck[deckIndex].reversed}
                    revealed={revealed}
                    selected={revealed}
                    disabled={disabled || isMaxPicked}
                    label={revealed ? POSITIONS[pickIdx] : undefined}
                    index={slot}
                    onClick={() => onPick(deckIndex)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
