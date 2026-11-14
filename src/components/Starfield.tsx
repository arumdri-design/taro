import { useMemo } from 'react';

interface Star {
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
}

export default function Starfield({ starCount = 70 }: { starCount?: number }) {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: starCount }, (_, i) => ({
        top: `${(i * 37.7 + 13) % 100}%`,
        left: `${(i * 53.3 + 7) % 100}%`,
        size: 1 + ((i * 7) % 3) * 0.8,
        delay: `${(i % 12) * 0.4}s`,
        duration: `${2.5 + (i % 5) * 0.7}s`,
      })),
    [starCount]
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold-200 animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}
