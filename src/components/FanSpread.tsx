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
  const radiusPercent = 40; // 가로 꽉 찬 원형 궤도 반지름 (%)

  return (
    <div className="w-full flex items-center justify-center select-none overflow-hidden">
      <div className="relative w-full aspect-square rounded-full border border-gold-500/20 bg-night-950/45 shadow-inner shadow-black/50 flex items-center justify-center">
        {/* 원형 중앙 장식 */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-gold-500/25 bg-night-900/65 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] font-serif tracking-widest text-gold-400/80">
            ARCANA
          </span>
          <span className="text-sm font-serif font-bold text-gold-200 mt-0.5">
            {Math.max(0, total - picked.length)}장
          </span>
        </div>

        {/* 12시 방향을 확실히 비우고(약 35도 간격) 325도를 균등하게 채우는 원형 배치 */}
        {validDeck.map(({ item, index }, idx) => {
          const revealed = picked.includes(index);
          const isMaxPicked = picked.length >= 3 && !revealed;
          const isLocked = Boolean(disabled || isMaxPicked || revealed);
          const isHovered = hoveredIndex === index && !isLocked;

          // 전체 360도 중 약 325도만 사용하고, 상단 12시(-90도)를 기점으로 양옆에 빈 공간 확보
          const spreadAngle = (Math.PI * 2 * 325) / 360; 
          const startAngle = -Math.PI / 2 - spreadAngle / 2;
          const angleRad =
            total > 1
              ? startAngle + (idx / (total - 1)) * spreadAngle
              : -Math.PI / 2;

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
              className={`absolute w-9 sm:w-11 transition-transform duration-200 focus:outline-none ${
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
