import type { TarotCard } from '@/data/tarotCards';
import CardArtwork from '@/components/CardArtwork';
import { Sparkles } from 'lucide-react';

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
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`tarot-card relative w-full h-full rounded-xl transition-all duration-300 focus:outline-none ${
        onClick && !disabled ? 'cursor-pointer hover:-translate-y-1' : ''
      } ${selected ? 'scale-105' : ''} ${
        disabled && !selected ? 'opacity-30' : ''
      }`}
      style={{ animationDelay: `${index * 20}ms` }}
      aria-label={revealed ? `${card.nameKo}` : '뒷면 카드'}
    >
      <div
        className="tarot-card-inner relative w-full h-full"
        style={{ transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* 뒷면 (아직 안 보임) */}
        <div className="tarot-card-face absolute inset-0 rounded-xl overflow-hidden border border-gold-500/40 shadow-lg shadow-black/50 bg-gradient-to-br from-night-800 via-night-900 to-night-950">
          <div className="absolute inset-1.5 rounded-lg border border-gold-500/25" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/2 aspect-square rounded-full border border-gold-400/50 flex items-center justify-center animate-spin-slow">
              <div className="w-3/4 aspect-square rounded-full border border-gold-400/30 flex items-center justify-center">
                <Sparkles className="w-1/3 h-1/3 text-gold-400/80" strokeWidth={1} />
              </div>
            </div>
          </div>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-gold-500/60 text-[8px] tracking-[0.3em]">
          ✦ ✦ ✦
          </div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-gold-500/60 text-[8px] tracking-[0.3em]">
            ✦ ✦ ✦
          </div>
        </div>

        {/* 앞면 (뒤집힌 상태) - 카드 일러스트 */}
        {revealed && (
          <div
            className="absolute inset-0"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="absolute inset-0">
              <CardArtwork card={card} />
              {reversed && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'rgba(10, 6, 24, 0.35)' }}
                >
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-400/20 text-rose-200 border border-rose-300/40 backdrop-blur-sm">
                    역방향
                  </span>
                </div>
              )}
              {label && (
                <div className="absolute top-1.5 right-1.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold-500/25 text-gold-200 border border-gold-400/40">
                    {label}
                </span>
                </div>
              )}
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
