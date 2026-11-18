import { useMemo, useState } from 'react';
import type { DrawnCard } from '@/services/gemini';
import TarotCardView from '@/components/TarotCardView';

interface FanSpreadProps {
  deck: DrawnCard[];
  picked: number[];
  disabled?: boolean;
  onPick: (index: number) => void;
}

export default function FanSpread({ deck, picked, disabled, onPick }: FanSpreadProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const validDeck = useMemo(
    () =>
      deck
        .map((item, index) => ({ item, index }))
        .filter((entry): entry is { item: DrawnCard; index: number } =>
          Boolean(entry.item && entry.item.card)
        ),
    [deck]
  );

  const total = validDeck.length;
  const radiusPercent = 37; // 원형 궤도 반지름 (%)

  return (
    <div className="w-full h-full flex items-center justify-center select-none overflow-hidden py-1">
      <div className="relative h-full max-h-[340px] aspect-square rounded-full border border-gold-500/20 bg-night-950/45 shadow-inner shadow-black/50 flex items-center justify-center">
        {/* 원형 중앙 장식 */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-gold-500/25 bg-night-900/60 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] font-serif tracking-widest text-gold-400/80">
            ARCANA
          </span>
          <span className="text-xs font-serif font-bold text-gold-200 mt-0.5">
            {Math.max(0, total - picked.length)}장
          </span>
        </div>

        {/* 원형 궤도에 배치된 카드들 */}
        {validDeck.map(({ item, index }, idx) => {
          const revealed = picked.includes(index);
          const isMaxPicked = picked.length >= 3 && !revealed;
          const isLocked = Boolean(disabled || isMaxPicked || revealed);
          const isHovered = hoveredIndex === index && !isLocked;

          // 12시 방향(-90도)부터 시계 방향으로 360도 균등 분배
          const angleRad = (idx / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
          const angleDeg = (angleRad * 180) / Math.PI;
          const leftPercent = 50 + radiusPercent * Math.cos(angleRad);
          const topPercent = 50 + radiusPercent * Math.sin(angleRad);

          return (
            <button
              key={`${index}-${idx}`}
              type="button"
              disabled={isLocked}
              onClick={() => onPick(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: `translate(-50%, -50%) rotate(${angleDeg + 90}deg) scale(${
                  isHovered ? 1.25 : 1
                })`,
                zIndex: isHovered ? 100 : revealed ? 1 : idx + 1,
              }}
              aria-label={`타로 카드 ${idx + 1}`}
              className={`absolute w-7 sm:w-9 transition-transform duration-200 focus:outline-none ${
                revealed
                  ? 'opacity-0 pointer-events-none scale-75'
                  : isLocked
                  ? 'opacity-35 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              <TarotCardView
                card={item.card}
                reversed={item.reversed}
                revealed={false}
                selected={false}
                disabled={isLocked}
                index={idx}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
