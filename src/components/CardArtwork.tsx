import type { TarotCard } from '@/data/tarotCards';

// 메이저 아르카나 22장: 현실에서 알아볼 수 있는 사물·풍경 장면
const majorScenes: Record<string, { label: string; scene: JSX.Element }> = {
  'the-fool': {
    label: '새로운 길 위의 나그네',
    scene: (
      <g>
        {/* 언덕과 좁은 길 */}
        <path d="M-16 8 Q0 2 16 10 L16 14 L-16 14 Z" fill="#2f2168" />
        <path d="M-6 14 Q0 4 3 -2" stroke="#ead196" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeDasharray="2 2" />
        {/* 나그네 */}
        <circle cx="3" cy="-6" r="2.2" fill="#f5ddc8" />
        <path d="M3 -3.8 L3 0 M3 -2.5 L0.5 -0.5 M3 -2.5 L5.5 -4.5" stroke="#ead196" strokeWidth="1.1" strokeLinecap="round" />
        {/* 지팡이와 떠나는 가방 */}
        <line x1="6.5" y1="-8" x2="7.5" y2="0" stroke="#d98e4a" strokeWidth="1" strokeLinecap="round" />
        <circle cx="7.8" cy="0.8" r="1.2" fill="#a8833a" />
      </g>
    ),
  },
  'the-magician': {
    label: '무한의 의자 위의 지팡이',
    scene: (
      <g>
        {/* 탁자 */}
        <rect x="-12" y="2" width="24" height="1.8" rx="0.9" fill="#a8833a" />
        <line x1="-9" y1="3.8" x2="-9" y2="9" stroke="#a8833a" strokeWidth="1.2" />
        <line x1="9" y1="3.8" x2="9" y2="9" stroke="#a8833a" strokeWidth="1.2" />
        {/* 하늘로 향한 지팡이 */}
        <line x1="8" y1="2" x2="12" y2="-10" stroke="#d9b96a" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="12.5" cy="-11" r="1.6" fill="#f5e6c4" opacity="0.9" />
        {/* 컵과 동전 */}
        <path d="M-8 2 L-6 -2 L-4 2 Z" fill="#d9b96a" />
        <circle cx="-1" cy="0" r="1.8" fill="none" stroke="#d9b96a" strokeWidth="1" />
        {/* 무한 심볼 */}
        <path d="M-3 -8 q2 -2 4 0 q2 2 4 0 q2 -2 -1 -1.5 q-3 0.5 -3 1.5" fill="none" stroke="#ead196" strokeWidth="0.9" />
      </g>
    ),
  },
  'the-high-priestess': {
    label: '두 기둥 사이의 베일',
    scene: (
      <g>
        <rect x="-14" y="-10" width="4" height="22" fill="#3a2b6e" />
        <rect x="10" y="-10" width="4" height="22" fill="#3a2b6e" />
        <rect x="-14.8" y="-11.5" width="5.6" height="2.4" rx="0.6" fill="#d9b96a" />
        <rect x="9.2" y="-11.5" width="5.6" height="2.4" rx="0.6" fill="#d9b96a" />
        <path d="M-8 -9 Q0 -6 8 -9 L8 12 L-8 12 Z" fill="#7c5cd6" opacity="0.35" />
        <circle cx="0" cy="0" r="3.5" fill="#ead196" opacity="0.85" />
        <path d="M0 -12 L1 0 L0 12" stroke="#ead196" strokeWidth="0.7" fill="none" opacity="0.7" />
      </g>
    ),
  },
  'the-empress': {
    label: '황금 밀밭과 왕관',
    scene: (
      <g>
        {/* 밀 이삭 */}
        {[-10, -6, -2, 2, 6, 10].map((x, i) => (
          <g key={i} stroke="#d9b96a" strokeWidth="1" fill="none" strokeLinecap="round">
            <line x1={x} y1="12" x2={x} y2={i % 2 === 0 ? 0 : 3} />
            <ellipse cx={x} cy={i % 2 === 0 ? -1.5 : 1.5} rx="1.2" ry="2.6" fill="#d9b96a" fillOpacity="0.5" stroke="none" />
          </g>
        ))}
        {/* 왕관 */}
        <path d="M-7 -8 L-7 -13 L-3 -9.5 L0 -14.5 L3 -9.5 L7 -13 L7 -8 Z" fill="#ead196" stroke="#a8833a" strokeWidth="0.5" strokeLinejoin="round" />
        <circle cx="0" cy="-16" r="0.9" fill="#f5e6c4" />
      </g>
    ),
  },
  'the-emperor': {
    label: '돌좌 위의 왕관과 홀',
    scene: (
      <g>
        <rect x="-11" y="-2" width="22" height="5" rx="1.5" fill="#4a3585" />
        <rect x="-9" y="-10" width="5" height="8" rx="1" fill="#3a2b6e" />
        <rect x="4" y="-10" width="5" height="8" rx="1" fill="#3a2b6e" />
        <path d="M-4 -5 L-4 -10 L-1.5 -7.5 L0 -11 L1.5 -7.5 L4 -10 L4 -5 Z" fill="#ead196" stroke="#a8833a" strokeWidth="0.4" strokeLinejoin="round" />
        <line x1="8" y1="-11" x2="8" y2="3" stroke="#d9b96a" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="0" cy="-2.2" r="1" fill="#a8833a" />
      </g>
    ),
  },
  'the-hierophant': {
    label: '교회 스테인드글라스 창',
    scene: (
      <g>
        <path d="M0 -13 C6 -13 8 -7 8 -2 L8 8 L-8 8 L-8 -2 C-8 -7 -6 -13 0 -13 Z" fill="#3a2b6e" stroke="#d9b96a" strokeWidth="0.9" />
        <path d="M0 -9 C3.5 -9 5 -5.5 5 -2 L5 5 L-5 5 L-5 -2 C-5 -5.5 -3.5 -9 0 -9 Z" fill="#7c5cd6" opacity="0.5" />
        <line x1="0" y1="-9" x2="0" y2="5" stroke="#ead196" strokeWidth="0.7" opacity="0.8" />
        <line x1="-5" y1="-2" x2="5" y2="-2" stroke="#ead196" strokeWidth="0.7" opacity="0.8" />
        <rect x="-4" y="8" width="8" height="1.6" fill="#d9b96a" opacity="0.8" />
      </g>
    ),
  },
  'the-lovers': {
    label: '두 개의 잔과 맺힌 하트',
    scene: (
      <g>
        <path
          d="M0 8 C-8 2 -10 -3 -7.5 -6.5 C-5.5 -9 -2 -8 0 -4.5 C2 -8 5.5 -9 7.5 -6.5 C10 -3 8 2 0 8 Z"
          fill="#c96a72"
          opacity="0.75"
        />
        <path d="M-11 12 L-9 8 L-7 12 L-9.5 12 Z M9 12 L11 8 L13 12 L10.5 12 Z" fill="#d9b96a" opacity="0.9" />
        <path d="M-6 -11 q6 3 12 0" stroke="#ead196" strokeWidth="0.8" fill="none" opacity="0.6" />
      </g>
    ),
  },
  'the-chariot': {
    label: '별빛 아래 달리는 전차',
    scene: (
      <g>
        <path d="M-9 2 L9 2 L7 8 L-7 8 Z" fill="#4a3585" stroke="#d9b96a" strokeWidth="0.7" />
        <circle cx="-5" cy="10" r="2.2" fill="none" stroke="#d9b96a" strokeWidth="1" />
        <circle cx="5" cy="10" r="2.2" fill="none" stroke="#d9b96a" strokeWidth="1" />
        <path d="M0 2 L0 -9 M0 -9 L5 -4 M0 -9 L-5 -4" stroke="#ead196" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="0" cy="-10.5" r="1.1" fill="#f5e6c4" />
        {/* 바람결 */}
        <path d="M-13 -6 q3 1.5 6 0 M7 -6 q3 1.5 6 0" stroke="#7c5cd6" strokeWidth="0.8" fill="none" opacity="0.6" />
      </g>
    ),
  },
  strength: {
    label: '사자와 함께 꽃을 든 손',
    scene: (
      <g>
        <circle cx="0" cy="-2" r="6.5" fill="#d98e4a" opacity="0.75" />
        <path d="M-6.5 -2 q-2.5 -2 -2 -4.5 M6.5 -2 q2.5 -2 2 -4.5" stroke="#d98e4a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="-1.8" cy="-3" r="0.7" fill="#16121f" />
        <circle cx="1.8" cy="-3" r="0.7" fill="#16121f" />
        <path d="M-1 -0.5 q1 0.8 2 0" stroke="#16121f" strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <path d="M-9 6 q4 -3 9 -3 q5 0 9 3" stroke="#ead196" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <circle cx="-9" cy="6.5" r="1.4" fill="#f5ddc8" />
        <circle cx="9" cy="6.5" r="1.4" fill="#f5ddc8" />
      </g>
    ),
  },
  'the-hermit': {
    label: '홀로 켠 등불',
    scene: (
      <g>
        {/* 등불 */}
        <path d="M-3 2 C-3 -5 3 -5 3 2 Z" fill="#f5e6c4" opacity="0.9" />
        <rect x="-3.8" y="2" width="7.6" height="1.4" rx="0.7" fill="#a8833a" />
        <line x1="0" y1="-5" x2="0" y2="-7.5" stroke="#a8833a" strokeWidth="1" strokeLinecap="round" />
        <circle cx="0" cy="0" r="1.1" fill="#d9b96a" />
        {/* 빛 확산 */}
        <circle cx="0" cy="-1" r="8" fill="#f5e6c4" opacity="0.12" />
        <circle cx="0" cy="-1" r="12" fill="#f5e6c4" opacity="0.06" />
        {/* 돌길 */}
        <path d="M-12 12 L-2 8 L12 11" stroke="#3a2b6e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
    ),
  },
  'wheel-of-fortune': {
    label: '별이 돌아가는 수레바퀴',
    scene: (
      <g>
        <circle cx="0" cy="0" r="11" fill="#221650" stroke="#d9b96a" strokeWidth="1.3" />
        <circle cx="0" cy="0" r="7.5" fill="none" stroke="#d9b96a" strokeWidth="0.7" opacity="0.7" />
        <circle cx="0" cy="0" r="2.4" fill="#ead196" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1="0"
            y1="0"
            x2={11 * Math.cos((deg * Math.PI) / 180)}
            y2={11 * Math.sin((deg * Math.PI) / 180)}
            stroke="#d9b96a"
            strokeWidth="0.7"
            opacity="0.65"
          />
        ))}
        <path d="M13 -8 l0.8 2 2 0.8 -2 0.8 -0.8 2 -0.8 -2 -2 -0.8 2 -0.8z" fill="#f5e6c4" />
      </g>
    ),
  },
  justice: {
    label: '저울과 검',
    scene: (
      <g stroke="#ead196" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <line x1="0" y1="-11" x2="0" y2="8" />
        <line x1="-9" y1="-8" x2="9" y2="-8" />
        <path d="M-9 -8 L-11 -3 A3 3 0 0 0 -5 -3 Z" fill="#ead196" fillOpacity="0.3" />
        <path d="M9 -8 L7 -3 A3 3 0 0 0 13 -3 Z" fill="#ead196" fillOpacity="0.3" />
        <line x1="5" y1="8" x2="9" y2="8" />
      </g>
    ),
  },
  'the-hanged-man': {
    label: '나무에 매달린 가지',
    scene: (
      <g>
        <line x1="-12" y1="-11" x2="12" y2="-11" stroke="#6b4a2a" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="0" y1="-11" x2="0" y2="-5" stroke="#a8833a" strokeWidth="0.9" />
        <circle cx="0" cy="-2.5" r="2.4" fill="#f5ddc8" />
        <path d="M-2 -0.5 L-5 4 M2 -0.5 L5 4 M-5 4 L-4.2 4.6 M5 4 L4.2 4.6" stroke="#ead196" strokeWidth="1.1" strokeLinecap="round" />
        {/* 나뭇잎 */}
        <ellipse cx="-8" cy="-12.5" rx="2.2" ry="1" fill="#3f7d5c" transform="rotate(-20 -8 -12.5)" />
        <ellipse cx="8" cy="-12.5" rx="2.2" ry="1" fill="#3f7d5c" transform="rotate(20 8 -12.5)" />
      </g>
    ),
  },
  death: {
    label: '지평선 너머로 지는 해',
    scene: (
      <g>
        <line x1="-14" y1="4" x2="14" y2="4" stroke="#2a1d5c" strokeWidth="1.4" />
        <path d="M-5 4 A5 5 0 0 1 5 4 Z" fill="#d98e4a" opacity="0.85" />
        <path d="M-8 8 Q0 5 8 8 L8 12 L-8 12 Z" fill="#3a2b6e" />
        {/* 떠나는 물결 */}
        <path d="M-12 9 q2 -1.2 4 0 M8 9.5 q2 -1.2 4 0" stroke="#7c5cd6" strokeWidth="0.8" fill="none" opacity="0.6" />
        <path d="M12 -10 l0.9 2.2 2.2 0.9 -2.2 0.9 -0.9 2.2 -0.9 -2.2 -2.2 -0.9 2.2 -0.9z" fill="#f5e6c4" opacity="0.85" />
      </g>
    ),
  },
  temperance: {
    label: '두 잔 사이로 흐르는 물',
    scene: (
      <g>
        <path d="M-12 -8 L-7 -8 L-9.5 -2 Z" fill="#6aa8d9" opacity="0.85" />
        <path d="M7 -8 L12 -8 L9.5 -2 Z" fill="#6aa8d9" opacity="0.85" />
        <path d="M-8 -2 Q0 2 8 -2" stroke="#6aa8d9" strokeWidth="1.1" fill="none" strokeDasharray="2 1.5" strokeLinecap="round" />
        <path d="M-10 10 Q0 6 10 10" stroke="#6aa8d9" strokeWidth="1" fill="none" opacity="0.5" strokeLinecap="round" />
        <circle cx="0" cy="-11" r="1.6" fill="#f5e6c4" opacity="0.85" />
      </g>
    ),
  },
  'the-devil': {
    label: '사슬에 묶인 쇠사슬',
    scene: (
      <g>
        <path d="M-8 10 L-8 -4 C-8 -10 -3 -13 0 -13 C3 -13 8 -10 8 -4 L8 10" fill="#4a1f3d" opacity="0.8" />
        <path d="M-4 -4 C-4 -8 4 -8 4 -4" stroke="#d9b96a" strokeWidth="1" fill="none" />
        {[[-6, 2], [-2, 5], [2, 5], [6, 2], [0, 8]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.7" fill="none" stroke="#a8b2c4" strokeWidth="0.9" />
        ))}
        <circle cx="-2.2" cy="-6" r="0.8" fill="#f5e6c4" />
        <circle cx="2.2" cy="-6" r="0.8" fill="#f5e6c4" />
      </g>
    ),
  },
  'the-tower': {
    label: '번개를 맞은 오래된 탑',
    scene: (
      <g>
        <rect x="-4.5" y="-6" width="9" height="18" rx="1" fill="#4a3585" />
        <rect x="-5.5" y="-9" width="11" height="3" rx="1" fill="#3a2b6e" />
        <rect x="-1.5" y="-12" width="3" height="3" fill="#3a2b6e" />
        <rect x="-2.8" y="-1" width="2" height="3" rx="0.8" fill="#16121f" />
        <rect x="1" y="4" width="2" height="3" rx="0.8" fill="#16121f" />
        <path d="M6 -14 L2 -6 L5 -6 L-1 6 L1 -2 L-3 -2 L4 -13 Z" fill="#f5e6c4" opacity="0.95" />
        <path d="M-9 -8 l1.4 3.4 3.4 1.4 -3.4 1.4 -1.4 3.4 -1.4 -3.4 -3.4 -1.4 3.4 -1.4z" fill="#ead196" opacity="0.7" />
      </g>
    ),
  },
  'the-star': {
    label: '샘물에 빛나는 큰 별',
    scene: (
      <g>
        <path d="M0 -12 L2.6 -4.4 10.5 -4.4 4 0.4 6.6 8 0 3.2 -6.6 8 -4 0.4 -10.5 -4.4 -2.6 -4.4 Z" fill="#f5e6c4" opacity="0.95" />
        <path d="M-11 -9 l0.7 1.8 1.8 0.7 -1.8 0.7 -0.7 1.8 -0.7 -1.8 -1.8 -0.7 1.8 -0.7z" fill="#ead196" />
        <path d="M11 -9 l0.7 1.8 1.8 0.7 -1.8 0.7 -0.7 1.8 -0.7 -1.8 -1.8 -0.7 1.8 -0.7z" fill="#ead196" />
        <path d="M-8 10 q8 -4 16 0" stroke="#6aa8d9" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.75" />
        <path d="M-5 12.5 q5 -2.4 10 0" stroke="#6aa8d9" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
      </g>
    ),
  },
  'the-moon': {
    label: '물구덩이에 비친 달',
    scene: (
      <g>
        <path d="M3 -10 A8 8 0 1 0 3 4 A6.2 6.2 0 1 1 3 -10 Z" fill="#ead196" opacity="0.95" />
        <circle cx="-9" cy="-9" r="1" fill="#ead196" opacity="0.7" />
        <path d="M-12 8 Q-6 5 0 8 Q6 11 12 8" stroke="#6aa8d9" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M-8 11.5 Q-3 9.5 2 11.5 Q6 13 10 11.5" stroke="#6aa8d9" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.6" />
        <ellipse cx="0" cy="8.6" rx="3" ry="0.9" fill="#ead196" opacity="0.4" />
      </g>
    ),
  },
  'the-sun': {
    label: '구름 위에 뜬 태양',
    scene: (
      <g>
        <circle cx="0" cy="-4" r="5.5" fill="#f5c96a" opacity="0.9" />
        <circle cx="0" cy="-4" r="8" fill="#f5c96a" opacity="0.18" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1={8.6 * Math.cos((deg * Math.PI) / 180)}
            y1={-4 + 8.6 * Math.sin((deg * Math.PI) / 180)}
            x2={11 * Math.cos((deg * Math.PI) / 180)}
            y2={-4 + 11 * Math.sin((deg * Math.PI) / 180)}
            stroke="#f5c96a"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
        <path d="M-9 8 q4 -3.5 8 0 q3 -3 7 0 q2.5 -2.4 5 0" stroke="#d9c9a8" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.85" />
      </g>
    ),
  },
  judgement: {
    label: '하늘에서 울리는 나팔',
    scene: (
      <g>
        <path d="M-11 -10 L3 2" stroke="#d9b96a" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M-12.5 -12.5 L-9.5 -7.5 M-13 -9 L-7.5 -11.5" stroke="#f5e6c4" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="-11" cy="-11" r="1.6" fill="#f5e6c4" opacity="0.9" />
        <path d="M-6 4 L6 4 L3 8 L-3 8 Z" fill="#7c5cd6" opacity="0.6" />
        <path d="M-9 11 q4 -3 9 -3 q5 0 9 3" stroke="#ead196" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.8" />
      </g>
    ),
  },
  'the-world': {
    label: '달륜 가운데 축제의 화환',
    scene: (
      <g>
        <ellipse cx="0" cy="0" rx="7.5" ry="11.5" fill="none" stroke="#3f7d5c" strokeWidth="2.2" />
        <ellipse cx="0" cy="0" rx="7.5" ry="11.5" fill="none" stroke="#d9b96a" strokeWidth="0.7" strokeDasharray="2 3" />
        <path d="M0 -13 l0.9 2.2 2.2 0.9 -2.2 0.9 -0.9 2.2 -0.9 -2.2 -2.2 -0.9 2.2 -0.9z" fill="#f5e6c4" />
        <path d="M0 10 l0.7 1.7 1.7 0.7 -1.7 0.7 -0.7 1.7 -0.7 -1.7 -1.7 -0.7 1.7 -0.7z" fill="#ead196" opacity="0.8" />
        <circle cx="0" cy="0" r="2.2" fill="#ead196" opacity="0.85" />
      </g>
    ),
  },
};

// 마이너 아르카나: 완드=나무/횃불, 컵=잔과 물, 소드=칼과 나침반, 펜타클=황금 동전
const suitPalette: Record<string, { main: string; deep: string }> = {
  wands: { main: '#d98e4a', deep: '#8a5a2a' },
  cups: { main: '#6aa8d9', deep: '#3a6a9e' },
  swords: { main: '#a8b2c4', deep: '#5a6a8a' },
  pentacles: { main: '#d9b96a', deep: '#a8833a' },
};

function WandScene() {
  return (
    <g>
      {/* 흙과 나무 */}
      <path d="M-13 9 Q0 5 13 10 L13 13 L-13 13 Z" fill="#3a2b6e" />
      <path d="M-2 9 C-1.5 2 0 -4 1 -10" stroke="#8a5a2a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M-0.5 2 L-6 -1 M0.5 -3 L5.5 -6" stroke="#8a5a2a" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="-6.6" cy="-1.8" rx="2" ry="1" fill="#3f7d5c" transform="rotate(-24 -6.6 -1.8)" />
      <ellipse cx="6" cy="-6.6" rx="2" ry="1" fill="#3f7d5c" transform="rotate(-30 6 -6.6)" />
      <ellipse cx="1.2" cy="-10.6" rx="1.7" ry="0.9" fill="#3f7d5c" transform="rotate(-10 1.2 -10.6)" />
    </g>
  );
}

function CupScene() {
  return (
    <g>
      {/* 물결 */}
      <path d="M-13 8 Q-8 5.5 -3 8 Q2 10.5 7 8 Q10 6.5 13 8" stroke="#6aa8d9" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M-13 11.5 Q-8 9 -3 11.5 Q2 14 7 11.5" stroke="#6aa8d9" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* 잔 */}
      <path d="M-6 -4 L6 -4 C6 2 3.5 6 0 6 C-3.5 6 -6 2 -6 -4 Z" fill="#6aa8d9" opacity="0.4" stroke="#d9b96a" strokeWidth="1.2" />
      <line x1="0" y1="6" x2="0" y2="10" stroke="#d9b96a" strokeWidth="1.2" />
      <line x1="-4" y1="10" x2="4" y2="10" stroke="#d9b96a" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="0" cy="-4" rx="6" ry="1.1" fill="#a8d0f0" opacity="0.7" />
    </g>
  );
}

function SwordScene() {
  return (
    <g>
      {/* 칼 */}
      <path d="M-1 -13 L1 -13 L1.6 2 L-1.6 2 Z" fill="#c4cedd" />
      <line x1="0" y1="-13" x2="0" y2="2" stroke="#eef2f8" strokeWidth="0.5" opacity="0.7" />
      <rect x="-4.5" y="2" width="9" height="1.6" rx="0.8" fill="#d9b96a" />
      <line x1="0" y1="3.6" x2="0" y2="8" stroke="#a8833a" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="0" cy="9" r="1" fill="#d9b96a" />
      {/* 나침반 */}
      <circle cx="8" cy="7" r="4" fill="#221650" stroke="#d9b96a" strokeWidth="0.9" />
      <path d="M8 4.4 L9 7.8 L8 7 L7 7.8 Z" fill="#ead196" />
    </g>
  );
}

function PentacleScene() {
  return (
    <g>
      {/* 동전 주머니 */}
      <path d="M-6 6 C-11 6 -12 -1 -8 -4 C-4 -7 4 -7 8 -4 C12 -1 11 6 6 6 Z" fill="#8a5a2a" />
      <path d="M-3 -6.5 Q0 -9 3 -6.5" stroke="#8a5a2a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* 황금 동전들 */}
      <g>
        <circle cx="0" cy="-8" r="4.2" fill="#d9b96a" stroke="#a8833a" strokeWidth="0.7" />
        <path d="M0 -11.2 L1.5 -8.8 4 -8.8 2.3 -7.2 3 -4.8 0 -6.4 -3 -4.8 -2.3 -7.2 -4 -8.8 -1.5 -8.8 Z" fill="#a8833a" opacity="0.55" transform="translate(0, -1.2) scale(0.9)" />
      </g>
      <circle cx="-9" cy="0.5" r="2.4" fill="#d9b96a" stroke="#a8833a" strokeWidth="0.5" />
      <circle cx="9" cy="0.5" r="2.4" fill="#d9b96a" stroke="#a8833a" strokeWidth="0.5" />
    </g>
  );
}

function CourtScene({ suit, rank }: { suit: string; rank: string }) {
  const p = suitPalette[suit] ?? suitPalette.wands;
  const isKing = rank === 'king';
  const isQueen = rank === 'queen';
  const isKnight = rank === 'knight';
  return (
    <g>
      {/* 옥좌/의자 */}
      <rect x="-10" y="-4" width="20" height="4" rx="1.2" fill="#3a2b6e" />
      <rect x="-9" y="-12" width="3.4" height="9" rx="1" fill="#32236b" />
      <rect x="5.6" y="-12" width="3.4" height="9" rx="1" fill="#32236b" />
      {/* 인물 */}
      <circle cx="0" cy={isKing || isQueen ? -7 : -6} r="2.6" fill="#f5ddc8" />
      {isKing && (
        <path d="M-2.6 -8.4 L-2.6 -10.6 L-1.2 -9.4 L0 -11 L1.2 -9.4 L2.6 -10.6 L2.6 -8.4 Z" fill="#ead196" />
      )}
      {isQueen && (
        <>
          <circle cx="0" cy="-10.6" r="1.3" fill="#ead196" />
          <path d="M-2.8 -8.6 q2.8 -2 5.6 0" stroke="#241a33" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </>
      )}
      {isKnight && (
        <path d="M-2.4 -7.6 L-4 -4.6 L4 -4.6 L2.4 -7.6 Z" fill={p.main} />
      )}
      {!isKnight && (
        <path d="M-3 -4.4 C-3 -1.5 3 -1.5 3 -4.4 Z" fill={p.main} />
      )}
      {/* 손에 든 문양 */}
      {suit === 'wands' && <line x1="6" y1="-8" x2="7" y2="0" stroke={p.main} strokeWidth="1.2" strokeLinecap="round" />}
      {suit === 'cups' && <path d="M5.5 -3 L8.5 -3 C8.5 -0.5 7.5 0.5 7 0.5 C6.5 0.5 5.5 -0.5 5.5 -3 Z" fill={p.main} opacity="0.85" />}
      {suit === 'swords' && <line x1="6.5" y1="-9" x2="6.5" y2="-2" stroke="#c4cedd" strokeWidth="1.1" strokeLinecap="round" />}
      {suit === 'pentacles' && <circle cx="6.8" cy="-5.5" r="2" fill={p.main} stroke="#a8833a" strokeWidth="0.5" />}
      {/* 발판 */}
      <path d="M-10 4 L10 4 L8 8 L-8 8 Z" fill="#221650" />
    </g>
  );
}

function MinorScene({ card }: { card: TarotCard }) {
  const rank = card.id.split('-')[0];
  if (['page', 'knight', 'queen', 'king'].includes(rank)) {
    return <CourtScene suit={card.suit!} rank={rank} />;
  }
  const num = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].indexOf(rank) + 1;
  // 에이스~10: 대표 장면 + 문양 개수 표시
  return (
    <g>
      {card.suit === 'wands' && <WandScene />}
      {card.suit === 'cups' && <CupScene />}
      {card.suit === 'swords' && <SwordScene />}
      {card.suit === 'pentacles' && <PentacleScene />}
      {num > 1 && (
        <g>
          {Array.from({ length: Math.min(num - 1, 4) }, (_, i) => (
            <circle
              key={i}
              cx={-11 + (i % 4) * 7}
              cy={-12}
              r="1.1"
              fill={suitPalette[card.suit!].main}
              opacity="0.75"
            />
          ))}
        </g>
      )}
    </g>
  );
}

export default function CardArtwork({ card }: { card: TarotCard }) {
  const majorIndex = card.arcana === 'major'
    ? [
        'the-fool', 'the-magician', 'the-high-priestess', 'the-empress', 'the-emperor',
        'the-hierophant', 'the-lovers', 'the-chariot', 'strength', 'the-hermit',
        'wheel-of-fortune', 'justice', 'the-hanged-man', 'death', 'temperance',
        'the-devil', 'the-tower', 'the-star', 'the-moon', 'the-sun', 'judgement', 'the-world',
      ].indexOf(card.id)
    : -1;
  const scene = card.arcana === 'major' ? majorScenes[card.id]?.scene : <MinorScene card={card} />;
  const sceneLabel = card.arcana === 'major' ? majorScenes[card.id]?.label : undefined;
  const number = card.arcana === 'major' ? String(majorIndex === 0 ? 0 : majorIndex) : String(
    ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'page', 'knight', 'queen', 'king'].indexOf(
      card.id.split('-')[0]
    ) + 1
  );
  const suitKo: Record<string, string> = {
    wands: '완드',
    cups: '컵',
    swords: '소드',
    pentacles: '펜타클',
  };

  return (
    <div className="tarot-card-face absolute inset-0 rounded-xl overflow-hidden border border-gold-500/40 bg-gradient-to-b from-night-700 via-night-800 to-night-950 shadow-lg shadow-black/40">
      {/* 골드 이중 테두리 */}
      <div className="absolute inset-1 rounded-lg border border-gold-500/50" />
      <div className="absolute inset-2 rounded-md border border-gold-500/25" />

      {/* 상단: 번호 + 카드 이름 */}
      <div className="absolute top-2.5 left-0 right-0 px-2 text-center">
        <div className="flex items-center justify-center gap-1">
          <span className="text-gold-300 font-serif text-[9px] font-bold border border-gold-500/40 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center shrink-0">
            {number}
          </span>
          <p className="text-[9px] sm:text-[10px] font-bold text-gold-200 font-serif leading-tight truncate">
            {card.nameKo}
          </p>
        </div>
        <p className="text-[5.5px] text-gold-400/70 tracking-wider truncate mt-0.5">
          {card.arcana === 'major' ? sceneLabel ?? card.name : `${suitKo[card.suit!]} · ${card.name}`}
        </p>
      </div>

      {/* 중앙: 현실적 사물/풍경 일러스트 */}
      <div className="absolute inset-0 flex items-center justify-center pt-7 pb-5">
        <svg viewBox="-17 -17 34 34" className="h-full aspect-square">
          <defs>
            <radialGradient id={`sceneGlow-${card.id}`} cx="0.5" cy="0.45" r="0.6">
              <stop offset="0%" stopColor="#ead196" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#ead196" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="0" cy="0" r="15.5" fill={`url(#sceneGlow-${card.id})`} />
          <circle cx="0" cy="0" r="13.5" fill="none" stroke="#d9b96a" strokeOpacity="0.3" strokeWidth="0.4" strokeDasharray="1 2" />
          {scene}
        </svg>
      </div>

      {/* 하단 별 장식 */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 text-gold-400/50 text-[6px]">
        ✦ · ✦
      </div>
    </div>
  );
}
