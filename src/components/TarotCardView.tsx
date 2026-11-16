import { useState } from 'react';
import { CARD_BACK_IMAGE, type TarotCard } from '@/data/tarotCards';

interface TarotCardViewProps {
  card: TarotCard;
  reversed: boolean;
  revealed: boolean;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
  index?: number;
}

export default function TarotCardView({
  card,
  reversed,
  revealed,
  selected,
  onClick,
  disabled,
  label,
  index = 0,
}: TarotCardViewProps) {
  const [backSrc, setBackSrc] = useState(CARD_BACK_IMAGE);
  const [frontSrc, setFrontSrc] = useState(card.image);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`tarot-card relative w-full aspect-[2/3.5] rounded-xl transition-all duration-300 focus:outline-none ${
        onClick && !disabled ? 'cursor-pointer hover:-translate-y-1' : ''
      } ${selected ? 'scale-105' : ''} ${
        disabled && !selected ? 'opacity-30' : ''
      }`}
      style={{ animationDelay: `${index * 20}ms` }}
      aria-label={
        revealed
          ? `${card.nameKo} (${reversed ? '역방향' : '정방향'})`
          : '뒷면 카드'
      }
    >
      <div
        className="tarot-card-inner relative w-full h-full transition-transform duration-500"
        style={{ transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* 뒷면 (아직 안 보임) */}
        <div className="tarot-card-face absolute inset-0 rounded-xl overflow-hidden border border-gold-500/40 shadow-lg shadow-black/50 bg-night-900">
          <img
            src={backSrc}
            alt="타로 카드 뒷면"
            onError={() => {
              if (backSrc !== '/images/card-back.png') {
                setBackSrc('/images/card-back.png');
              }
            }}
            className="w-full h-full object-cover block select-none"
            draggable={false}
          />
        </div>

        {/* 앞면 (뒤집힌 상태) - 라이더-웨이트 정통 일러스트 */}
        {revealed && (
          <div
            className="absolute inset-0 rounded-xl overflow-hidden border border-gold-400/60 shadow-xl bg-night-950"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <img
              src={frontSrc}
              alt={`${card.nameKo} (${card.name})`}
              onError={() => {
                const paddedNum = String(card.number).padStart(2, '0');
                const fallback =
                  card.arcana === 'major'
                    ? `/cards/major-${paddedNum}.png`
                    : `/cards/${card.suit}-${paddedNum}.png`;
                if (frontSrc !== fallback) {
                  setFrontSrc(fallback);
                }
              }}
              className={`w-full h-full object-cover block select-none transition-transform duration-500 ${
                reversed ? 'rotate-180' : ''
              }`}
              draggable={false}
            />

            {reversed && (
              <div className="absolute inset-0 flex items-center justify-center bg-night-950/30 pointer-events-none">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-200 border border-rose-300/40 backdrop-blur-sm">
                  역방향
                </span>
              </div>
            )}

            {label && (
              <div className="absolute top-1.5 right-1.5 pointer-events-none">
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-night-950/75 text-gold-200 border border-gold-400/40">
                  {label}
                </span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night-950/90 via-night-950/60 to-transparent px-1.5 py-1.5 text-center pointer-events-none">
              <p className="text-[10px] font-serif font-bold text-gold-200 truncate">
                {card.nameKo}
                {reversed ? ' (역)' : ''}
              </p>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="absolute -inset-0.5 rounded-xl ring-2 ring-gold-400 pointer-events-none" />
      )}
    </button>
  );
}
