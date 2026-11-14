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

// 부채꼴 각도 범위와 들림 높이
const ARC_SPAN = 100; // degrees
const MAX_ROTATION = ARC_SPAN / 2;
const ARC_DROP = 26; // px, 가장자리 카드가 가운데보다 내려가는 깊이
const MAX_VISIBLE = 26; // 한 화면에 펼쳐지는 최대 카드 수

export default function FanSpread({ deck, picked, disabled, onPick }: FanSpreadProps) {
  // 78장 전체가 아니라 균등하게 샘플링한 카드를 한 화면에 펼침
  const slots = useMemo(() => {
    const count = Math.min(deck.length, MAX_VISIBLE);
    const indices: number[] = [];
    for (let i = 0; i < count; i++) {
      indices.push(Math.round((i * (deck.length - 1)) / (count - 1)));
    }
    return indices.map((deckIndex, i) => ({ deckIndex, slot: i, total: count }));
  }, [deck]);

  return (
    <div className="relative w-full select-none" style={{ height: 'clamp(200px, 52vw, 280px)' }}>
      {slots.map(({ deckIndex, slot, total }) => {
        const t = total > 1 ? slot / (total - 1) : 0.5; // 0..1
        const angle = (t - 0.5) * ARC_SPAN;
        const mid = (t - 0.5) * 2; // -1..1
        const drop = Math.abs(mid) * ARC_DROP;
        const pickIdx = picked.indexOf(deckIndex);
        const revealed = pickIdx !== -1;
        const isHighlighted = revealed;
        const cardWidth = 'clamp(64px, 18vw, 92px)';
        return (
          <div
            key={deckIndex}
            className="absolute left-1/2 bottom-4"
            style={{
              width: cardWidth,
              height: 'calc(1.6 * clamp(64px, 18vw, 92px))',
              transform: `translateX(-50%) rotate(${angle}deg) translateY(${drop}px)`,
              transformOrigin: 'bottom center',
              zIndex: isHighlighted ? 60 : 10 + slot,
              transition: 'transform 0.3s ease, z-index 0s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.zIndex = '80';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.zIndex = isHighlighted ? '60' : `${10 + slot}`;
            }}
          >
            <div className="absolute inset-x-0 bottom-0 hover:-translate-y-4 transition-transform duration-300">
              <TarotCardView
                card={deck[deckIndex].card}
                reversed={deck[deckIndex].reversed}
                revealed={revealed}
                selected={revealed}
                disabled={disabled || (picked.length >= 3 && !revealed)}
                label={revealed ? POSITIONS[pickIdx] : undefined}
                index={slot}
                onClick={() => onPick(deckIndex)}
              />
            </div>
          </div>
        );
      })}
      {/* 테이블 느낌의 부드러운 그림자 아치 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-2 w-4/5 h-6 rounded-full bg-black/50 blur-md pointer-events-none"
        aria-hidden
      />
    </div>
  );
}
