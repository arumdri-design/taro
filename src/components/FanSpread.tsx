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

// 한 화면에 겹쳐서 펼칠 카드 수 (78장을 한 줄에 욱여넣지 않도록 15장 샘플링)
const MAX_VISIBLE = 15;
const ARC_SPAN = 64; // 부채꼴 전체 각도 (도)
const ARC_DROP = 18; // 가장자리 카드가 내려가는 깊이 (px)

export default function FanSpread({ deck, picked, disabled, onPick }: FanSpreadProps) {
  const slots = useMemo(() => {
    if (!deck.length) return [];
    const count = Math.min(deck.length, MAX_VISIBLE);
    const indices: number[] = [];

    if (count === 1) {
      indices.push(0);
    } else {
      for (let i = 0; i < count; i++) {
        indices.push(Math.round((i * (deck.length - 1)) / (count - 1)));
      }
    }

    return indices.map((deckIndex, slot) => ({
      deckIndex,
      slot,
      total: count,
    }));
  }, [deck]);

  return (
    <div className="mt-4 w-full select-none">
      {/* 카드 선택 안내 */}
      <p className="mb-3 text-center text-[11px] text-mystic-300/75">
        마음이 끌리는 카드 3장을 눌러 선택해 주세요
      </p>

      {/* 부채꼴 카드 스프레드 영역 */}
      <div
        className="relative mx-auto w-full overflow-x-auto overflow-y-visible py-3"
        style={{ minHeight: 'clamp(220px, 56vw, 290px)' }}
      >
        <div
          className="relative mx-auto flex items-end justify-center"
          style={{
            width: '100%',
            minWidth: '320px',
            height: 'clamp(210px, 54vw, 275px)',
          }}
        >
          {slots.map(({ deckIndex, slot, total }) => {
            const t = total > 1 ? slot / (total - 1) : 0.5; // 0..1
            const mid = (t - 0.5) * 2; // -1..1
            const angle = mid * (ARC_SPAN / 2);
            const drop = Math.abs(mid) * ARC_DROP;
            // 중앙 기준으로 가로 간격을 넉넉히 배분해 카드 뒷면이 선처럼 찌그러지지 않게 함
            const spreadX = mid * 118;

            const pickIdx = picked.indexOf(deckIndex);
            const revealed = pickIdx !== -1;
            const isMaxPicked = picked.length >= 3 && !revealed;

            return (
              <div
                key={`${deckIndex}-${slot}`}
                className="absolute bottom-3 left-1/2 transition-all duration-300"
                style={{
                  width: 'clamp(72px, 19vw, 94px)',
                  transform: `translateX(calc(-50% + ${spreadX}px)) translateY(${
                    revealed ? -14 : drop
                  }px) rotate(${revealed ? 0 : angle}deg)`,
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

        {/* 테이블 위 은은한 그림자 */}
        <div
          className="pointer-events-none mx-auto -mt-2 h-5 w-4/5 rounded-full bg-black/55 blur-md"
          aria-hidden
        />
      </div>
    </div>
  );
}
