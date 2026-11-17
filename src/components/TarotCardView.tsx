import { useEffect, useState } from 'react';
import type { TarotCard } from '@/data/tarotCards';

interface TarotCardViewProps {
  card: TarotCard;
  reversed: boolean;
  revealed: boolean;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
  index?: number;
  fit?: 'cover' | 'contain';
}

const DEFAULT_CARD_BACK = '/images/card-back.png';

export default function TarotCardView({
  card,
  reversed,
  revealed,
  selected,
  onClick,
  disabled,
  label,
  index = 0,
  fit = 'cover',
}: TarotCardViewProps) {
  const [backSrc, setBackSrc] = useState(DEFAULT_CARD_BACK);
  const [frontSrc, setFrontSrc] = useState(card.image || DEFAULT_CARD_BACK);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setFrontSrc(card.image || DEFAULT_CARD_BACK);
    setImgFailed(false);
  }, [card.image, card.id]);

  const imgFitClass =
    fit === 'contain' ? 'object-contain p-1 bg-night-950' : 'object-cover';

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      {...(onClick ? { type: 'button' as const, onClick, disabled } : {})}
      className={`tarot-card relative w-full aspect-[2/3] rounded-xl transition-all duration-300 focus:outline-none ${
        onClick && !disabled ? 'cursor-pointer hover:-translate-y-1' : ''
      } ${selected ? 'scale-105' : ''} ${
        disabled && !selected ? 'opacity-30' : ''
      }`}
      style={{ animationDelay: `${index * 20}ms`, perspective: '1000px' }}
      aria-label={
        revealed
          ? `${card.nameKo} (${reversed ? '역방향' : '정방향'})`
          : '뒷면 카드'
      }
    >
      <div
        className="tarot-card-inner relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* 뒷면 */}
        <div
          className="tarot-card-face absolute inset-0 rounded-xl overflow-hidden border border-gold-500/40 shadow-lg shadow-black/50 bg-night-900"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img
            src={backSrc}
            alt="타로 카드 뒷면"
            onError={() => {
              if (backSrc !== DEFAULT_CARD_BACK) {
                setBackSrc(DEFAULT_CARD_BACK);
              }
            }}
            className="w-full h-full object-cover block select-none"
            draggable={false}
          />
        </div>

        {/* 앞면 */}
        {revealed && (
          <div
            className="absolute inset-0 rounded-xl overflow-hidden border border-gold-400/60 shadow-xl bg-night-950 flex flex-col justify-between"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {!imgFailed ? (
              <img
                src={frontSrc}
                alt={`${card.nameKo} (${card.name})`}
                onError={() => {
                  const paddedNum = String(card.id ?? 0).padStart(2, '0');
                  const fallback =
                    card.arcana === 'major'
                      ? `/cards/major-${paddedNum}.png`
                      : `/cards/${card.suit ?? 'wands'}-${paddedNum}.png`;
                  if (frontSrc !== fallback && !frontSrc.startsWith('/cards/')) {
                    setFrontSrc(fallback);
                  } else {
                    setImgFailed(true);
                  }
                }}
                className={`w-full h-full ${imgFitClass} block select-none transition-transform duration-500 ${
                  reversed ? 'rotate-180' : ''
                }`}
                draggable={false}
              />
            ) : (
              <div
                className={`w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-b from-night-800 to-night-950 ${
                  reversed ? 'rotate-180' : ''
                }`}
              >
                <span className="text-[10px] text-gold-400/80 font-serif">
                  {card.arcana === 'major' ? 'MAJOR' : (card.suit ?? '').toUpperCase()}
                </span>
                <span className="mt-1 text-xs font-serif font-bold text-gold-200">
                  {card.nameKo}
                </span>
                <span className="mt-0.5 text-[9px] text-mystic-300/70">
                  {card.name}
                </span>
              </div>
            )}

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
    </Wrapper>
  );
}
