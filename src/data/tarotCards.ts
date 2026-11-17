export interface CardDirectionMeaning {
  keywords: string[];
  meaning: string;
}

export interface TarotCard {
  id: number;
  name: string;
  nameKo: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  image: string;
  upright: CardDirectionMeaning;
  reversed: CardDirectionMeaning;
}

export const tarotCards: TarotCard[] = [
  {
    id: 0,
    name: 'The Fool',
    nameKo: '바보',
    arcana: 'major',
    image: '/images/cards/00-fool.png',
    upright: {
      keywords: ['새로운 시작', '순수함', '모험'],
      meaning: '두려움 없이 첫걸음을 내딛는 순수한 출발의 에너지입니다.',
    },
    reversed: {
      keywords: ['무모함', '망설임', '준비 부족'],
      meaning: '앞만 보고 달리다 주변을 놓치거나 결정을 미루고 있을 수 있습니다.',
    },
  },
  {
    id: 1,
    name: 'The Magician',
    nameKo: '마법사',
    arcana: 'major',
    image: '/images/cards/01-magician.png',
    upright: {
      keywords: ['창조력', '의지', '실행'],
      meaning: '원하는 것을 현실로 만들 수 있는 도구와 역량이 이미 손에 있습니다.',
    },
    reversed: {
      keywords: ['산만함', '기회 낭비', '불확실성'],
      meaning: '재능은 충분하지만 집중력이 흐트러져 결과가 지연될 수 있습니다.',
    },
  },
  {
    id: 2,
    name: 'The High Priestess',
    nameKo: '고위 여사제',
    arcana: 'major',
    image: '/images/cards/02-high-priestess.png',
    upright: {
      keywords: ['직관', '지혜', '내면의 소리'],
      meaning: '겉으로 드러난 행동보다 조용히 내면의 직관에 귀 기울일 때입니다.',
    },
    reversed: {
      keywords: ['비밀', '혼란', '직관 무시'],
      meaning: '숨겨진 진실이 있거나 스스로의 감정을 외면하고 있을 수 있습니다.',
    },
  },
];
