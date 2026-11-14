import type { Reader } from '@/data/readers';
import { lunaImageUrl, kaiImageUrl } from '@/config/readerImages';

const imageUrls: Record<Reader['id'], string> = {
  luna: lunaImageUrl,
  kai: kaiImageUrl,
};

const sharedDefs = `
<defs>
  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2a1d5c"/>
    <stop offset="45%" stop-color="#1c1240"/>
    <stop offset="100%" stop-color="#0a0618"/>
  </linearGradient>
  <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0%" stop-color="#f5e6c4" stop-opacity="0.85"/>
    <stop offset="45%" stop-color="#ead196" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#f5e6c4" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="backlight" cx="0.5" cy="0.42" r="0.55">
    <stop offset="0%" stop-color="#9d7fe0" stop-opacity="0.5"/>
    <stop offset="60%" stop-color="#7c5cd6" stop-opacity="0.15"/>
    <stop offset="100%" stop-color="#7c5cd6" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="robeFade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0a0618" stop-opacity="0"/>
    <stop offset="100%" stop-color="#0a0618" stop-opacity="0.85"/>
  </linearGradient>
  <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#fbeadb"/>
    <stop offset="100%" stop-color="#eAC4a8"/>
  </linearGradient>
  <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="2.2" result="blur"/>
    <feMerge>
      <feMergeNode in="blur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>`;

interface ReaderVisual {
  hair: string;
  hairLight: string;
  hairBack: string | null;
  robeOuter: string;
  robeMid: string;
  robeInner: string;
  accent: string;
  eye: string;
  lip: string;
  hairStyle: 'bun' | 'swept';
  lashes: boolean;
}

const visuals: Record<Reader['id'], ReaderVisual> = {
  luna: {
    hair: '#241a33',
    hairLight: '#4d3a68',
    hairBack: '#372848',
    robeOuter: '#4a3585',
    robeMid: '#32236b',
    robeInner: '#221650',
    accent: '#ead196',
    eye: '#7a55b5',
    lip: '#c96a72',
    hairStyle: 'bun',
    lashes: true,
  },
  kai: {
    hair: '#16121f',
    hairLight: '#3a3352',
    hairBack: null,
    robeOuter: '#2f2168',
    robeMid: '#221650',
    robeInner: '#140d33',
    accent: '#d9b96a',
    eye: '#4a6fa5',
    lip: '#b06a5a',
    hairStyle: 'swept',
    lashes: false,
  },
};

function Particles({ seed }: { seed: number }) {
  const dots: Array<[number, number, number, number]> = [];
  for (let i = 0; i < 26; i++) {
    const x = ((i * 37 + seed * 13) % 96) + 2;
    const y = ((i * 53 + seed * 29) % 88) + 2;
    const r = 0.35 + ((i * 7 + seed) % 5) * 0.16;
    const o = 0.25 + ((i * 3 + seed) % 6) * 0.11;
    dots.push([x, y, r, o]);
  }
  return (
    <g fill="#f5e6c4">
      {dots.map(([x, y, r, o], i) => (
        <circle key={i} cx={x} cy={y} r={r} opacity={o} />
      ))}
      <path
        d={`M${78 - seed * 4} 12 l0.9 2.2 2.2 0.9 -2.2 0.9 -0.9 2.2 -0.9 -2.2 -2.2 -0.9 2.2 -0.9z`}
        fill="#f5e6c4"
        opacity="0.95"
      />
    </g>
  );
}

export default function ReaderAvatar({
  readerId,
  className = '',
}: {
  readerId: Reader['id'];
  className?: string;
}) {
  const imageUrl = imageUrls[readerId];

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={readerId === 'luna' ? '점술가 루나' : '점술가 카이'}
        className={`${className} object-cover`}
        draggable={false}
      />
    );
  }

  const v = visuals[readerId];
  const isLuna = readerId === 'luna';

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} block`}
      role="img"
      aria-label={isLuna ? '점술가 루나' : '점술가 카이'}
      preserveAspectRatio="xMidYMid slice"
    >
      {sharedDefs}

      {/* 배경: 밤하늘 + 달 + 백라이트 글로우 */}
      <rect width="100" height="100" fill="url(#skyGrad)" />
      <circle cx="80" cy="16" r="18" fill="url(#moonGlow)" />
      <circle cx="80" cy="16" r="6.5" fill="#f8ecd0" opacity="0.95" />
      <circle cx="77.4" cy="14" r="1.2" fill="#d9c9a8" opacity="0.5" />
      <circle cx="82.2" cy="17.6" r="0.9" fill="#d9c9a8" opacity="0.45" />
      <circle cx="79.6" cy="19.4" r="0.7" fill="#d9c9a8" opacity="0.4" />
      <ellipse cx="50" cy="46" rx="46" ry="44" fill="url(#backlight)" />
      <Particles seed={isLuna ? 1 : 2} />

      {/* 로브 - 레이어드 겹천 그리기 (바깥 로브 → 중간 로브) */}
      <path
        d="M50 60 C30 60 17 74 13 100 L87 100 C83 74 70 60 50 60 Z"
        fill={v.robeOuter}
      />
      <path
        d="M50 60 C34 60 23 72 19.5 100 L80.5 100 C77 72 66 60 50 60 Z"
        fill={v.robeMid}
      />
      {/* 안쪽 로브 V넥 라인 */}
      <path
        d="M50 63 L41 100 L59 100 Z"
        fill={v.robeInner}
      />
      {/* 로브 골드 테두리 라인 */}
      <path
        d="M50 60 C33 60 22.5 71 19 97"
        fill="none"
        stroke={v.accent}
        strokeWidth="0.7"
        opacity="0.55"
      />
      <path
        d="M50 60 C67 60 77.5 71 81 97"
        fill="none"
        stroke={v.accent}
        strokeWidth="0.7"
        opacity="0.55"
      />
      {/* 중앙 단추와 장식 */}
      <line x1="50" y1="66" x2="50" y2="100" stroke={v.accent} strokeWidth="0.6" opacity="0.6" />
      <circle cx="50" cy="73" r="1" fill={v.accent} opacity="0.95" />
      <circle cx="50" cy="81" r="1" fill={v.accent} opacity="0.95" />
      <circle cx="50" cy="89" r="1" fill={v.accent} opacity="0.95" />
      {/* 별 브로치 */}
      <path
        d="M50 60.5 l1.1 2.6 2.6 1.1 -2.6 1.1 -1.1 2.6 -1.1 -2.6 -2.6 -1.1 2.6 -1.1z"
        fill={v.accent}
        filter="url(#softGlow)"
      />
      {/* 어깨 별빛 파티클 */}
      <circle cx="29" cy="76" r="0.7" fill={v.accent} opacity="0.85" />
      <circle cx="71" cy="78" r="0.7" fill={v.accent} opacity="0.85" />
      <circle cx="24" cy="90" r="0.5" fill={v.accent} opacity="0.55" />
      <circle cx="76" cy="92" r="0.5" fill={v.accent} opacity="0.55" />
      <circle cx="35" cy="86" r="0.45" fill="#f5e6c4" opacity="0.5" />
      <circle cx="65" cy="88" r="0.45" fill="#f5e6c4" opacity="0.5" />

      {/* 목 */}
      <rect x="45.6" y="51" width="8.8" height="11" rx="3.6" fill="url(#skinGrad)" />
      <path d="M45.6 54 C47.5 56.5 52.5 56.5 54.4 54 L54.4 52 L45.6 52 Z" fill="#d9ab8c" opacity="0.4" />

      {/* 머리 뒤 (루나) */}
      {v.hairBack && (
        <path
          d="M50 15 C32 15 25 30 26 47 C26.5 56 29 62 31.5 67 L40 62.5 C35.5 54 34.5 44 35.5 35 C40 39.5 60 39.5 64.5 35 C65.5 44 64.5 54 60 62.5 L68.5 67 C71 62 73.5 56 74 47 C75 30 68 15 50 15 Z"
          fill={v.hairBack}
        />
      )}
      {/* 루나의 올린 머리(번 모양) */}
      {isLuna && (
        <>
          <circle cx="69" cy="23" r="4.6" fill={v.hair} />
          <circle cx="69" cy="23" r="4.6" fill="none" stroke={v.accent} strokeWidth="0.6" opacity="0.75" />
          <circle cx="69" cy="23" r="1.4" fill={v.accent} opacity="0.9" />
        </>
      )}

      {/* 얼굴 */}
      <path
        d="M50 19 C37.5 19 32.5 28.5 33 40 C33.5 50.5 40.5 58.5 50 58.5 C59.5 58.5 66.5 50.5 67 40 C67.5 28.5 62.5 19 50 19 Z"
        fill="url(#skinGrad)"
      />
      {/* 볼터치 그림자 */}
      <ellipse cx="40" cy="47.5" rx="2.6" ry="1.7" fill="#e8a8a0" opacity="0.4" />
      <ellipse cx="60" cy="47.5" rx="2.6" ry="1.7" fill="#e8a8a0" opacity="0.4" />
      {/* 귀 + 귀걸이 */}
      <ellipse cx="33.2" cy="42.5" rx="2" ry="3.2" fill="url(#skinGrad)" />
      <ellipse cx="66.8" cy="42.5" rx="2" ry="3.2" fill="url(#skinGrad)" />
      <circle cx="33.4" cy="47" r="1" fill={v.accent} filter="url(#softGlow)" />
      <circle cx="66.6" cy="47" r="1" fill={v.accent} filter="url(#softGlow)" />

      {/* 앞머리 */}
      {isLuna ? (
        <path
          d="M50 16.5 C36.5 16.5 31 26 32 36.5 C35.5 34.5 37.8 30 39.3 26 C43 30 57 30 60.7 26 C62.2 30 64.5 34.5 68 36.5 C69 26 63.5 16.5 50 16.5 Z"
          fill={v.hair}
        />
      ) : (
        <path
          d="M50 16.5 C35.5 16.5 30.5 27 32 38.5 C32.5 40.5 33.6 41.4 34.6 40.8 C33.5 33 37.5 27 44 26 C50.5 25 60.5 25.8 65.5 33 C67 35.6 67.6 38.6 67.4 40.8 C68.6 41.4 69.3 39.6 69.5 37 C70.3 25.5 63.5 16.5 50 16.5 Z"
          fill={v.hair}
        />
      )}
      {/* 머리카락 하이라이트 */}
      <path
        d={isLuna
          ? 'M40 19.5 C36.5 21.5 34.5 25.5 34 30'
          : 'M39 19.5 C35.5 22 34 26.5 33.8 31'}
        fill="none"
        stroke={v.hairLight}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d={isLuna
          ? 'M60 19.5 C63.5 21.5 65.5 25.5 66 30'
          : 'M61 19.5 C64.5 22 66 26.5 66.2 31'}
        fill="none"
        stroke={v.hairLight}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* 눈썹 */}
      <path d="M38.5 37.5 q3.5 -2.4 7 -0.6" fill="none" stroke={v.hair} strokeWidth="0.85" strokeLinecap="round" opacity="0.85" />
      <path d="M54.5 36.9 q3.5 -1.8 7 0.6" fill="none" stroke={v.hair} strokeWidth="0.85" strokeLinecap="round" opacity="0.85" />

      {/* 눈 */}
      {v.lashes && (
        <>
          <path d="M38.5 39.5 l-1.6 -1" stroke={v.hair} strokeWidth="0.6" strokeLinecap="round" />
          <path d="M61.5 39.5 l1.6 -1" stroke={v.hair} strokeWidth="0.6" strokeLinecap="round" />
        </>
      )}
      <path d="M39 40.5 q3 -2.8 6 0" fill="none" stroke={v.hair} strokeWidth="1.15" strokeLinecap="round" />
      <path d="M55 40.5 q3 -2.8 6 0" fill="none" stroke={v.hair} strokeWidth="1.15" strokeLinecap="round" />
      <ellipse cx="42" cy="43.4" rx="1.75" ry="2.2" fill={v.eye} />
      <ellipse cx="58" cy="43.4" rx="1.75" ry="2.2" fill={v.eye} />
      <circle cx="41.4" cy="42.6" r="0.6" fill="#ffffff" opacity="0.95" />
      <circle cx="57.4" cy="42.6" r="0.6" fill="#ffffff" opacity="0.95" />
      <circle cx="42.8" cy="44.4" r="0.35" fill="#ffffff" opacity="0.7" />
      <circle cx="58.8" cy="44.4" r="0.35" fill="#ffffff" opacity="0.7" />

      {/* 코와 입 */}
      <path d="M50 46.5 l-0.9 2.1 1.8 0" fill="none" stroke="#d9ab8c" strokeWidth="0.55" strokeLinejoin="round" opacity="0.8" />
      {isLuna ? (
        <path d="M46.8 51.4 q3.2 2.4 6.4 0" fill="none" stroke={v.lip} strokeWidth="1.05" strokeLinecap="round" />
      ) : (
        <path d="M47 51.4 q3 1.5 6 0" fill="none" stroke={v.lip} strokeWidth="0.95" strokeLinecap="round" />
      )}

      {/* 하단 그라데이션 페이드 */}
      <rect y="82" width="100" height="18" fill="url(#robeFade)" />
    </svg>
  );
}
