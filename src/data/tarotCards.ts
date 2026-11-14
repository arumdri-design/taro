export interface TarotCard {
  id: string;
  name: string;
  nameKo: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  keywords: string[];
}

const majorArcana: Array<[string, string, string[]]> = [
  ['The Fool', '바보', ['새로운 시작', '자유', '모험', '순수']],
  ['The Magician', '마법사', ['창의력', '의지력', '실현', '능력']],
  ['The High Priestess', '여사제', ['직관', '내면의 목소리', '비밀', '신비']],
  ['The Empress', '여황제', ['풍요', '모성', '자연', '창조력']],
  ['The Emperor', '황제', ['권위', '안정', '리더십', '질서']],
  ['The Hierophant', '교황', ['전통', '가르침', '신념', '조언']],
  ['The Lovers', '연인', ['사랑', '조화', '선택', '연결']],
  ['The Chariot', '전차', ['승리', '의지', '전진', '결단']],
  ['Strength', '힘', ['용기', '인내', '부드러운 힘', '자기통제']],
  ['The Hermit', '은둔자', ['성찰', '고독', '지혜', '내면 탐구']],
  ['Wheel of Fortune', '운명의 수레바퀴', ['순환', '운명', '전환점', '변화']],
  ['Justice', '정의', ['공정', '균형', '진실', '책임']],
  ['The Hanged Man', '매달린 사람', ['관점 전환', '기다림', '희생', '통찰']],
  ['Death', '죽음', ['끝과 시작', '탈피', '변화', '재탄생']],
  ['Temperance', '절제', ['조화', '균형', '인내', '치유']],
  ['The Devil', '악마', ['집착', '유혹', '속박', '그림자']],
  ['The Tower', '탑', ['급변', '붕괴', '충격', '새로운 진실']],
  ['The Star', '별', ['희망', '영감', '치유', '긍정']],
  ['The Moon', '달', ['불확실성', '환상', '무의식', '직관']],
  ['The Sun', '태양', ['성공', '기쁨', '활력', '명료함']],
  ['Judgement', '심판', ['부활', '결론', '각성', '평가']],
  ['The World', '세계', ['완성', '성취', '여정의 끝', '통합']],
];

const suits: Array<{
  suit: TarotCard['suit'];
  suitKo: string;
  element: string;
  rankKeywords: string[][];
}> = [
  {
    suit: 'wands',
    suitKo: '완드',
    element: '열정과 행동',
    rankKeywords: [
      ['창조', '시작', '잠재력'],      // Ace
      ['계획', '미래지향', '결정'],    // 2
      ['확장', '예견', '협력'],        // 3
      ['축하', '안정', '가정'],        // 4
      ['경쟁', '갈등', '압박'],        // 5
      ['인정', '승리', '자신감'],      // 6
      ['방어', '고집', '확신'],        // 7
      ['속도', '기세', '변화'],        // 8
      ['회복 탄력성', '경계심', '피로'], // 9
      ['짐', '책임', '압도'],          // 10
      ['모험', '자유', '에너지'],      // Page
      ['매력', '열정', '자신감'],      // Knight
      ['비전', '리더십', '추진력'],    // Queen
      ['카리스마', '결단', '활력'],    // King
    ],
  },
  {
    suit: 'cups',
    suitKo: '컵',
    element: '감정과 사랑',
    rankKeywords: [
      ['새로운 사랑', '감정', '마음의 시작'],
      ['연결', '파트너십', '매력'],
      ['우정', '축하', '공동체'],
      ['무료함', '성찰', '새로운 기회'],
      ['상실', '슬픔', '수용'],
      ['향수', '추억', '순수한 기쁨'],
      ['선택의 갈등', '환상', '기회'],
      ['이별', '벗어남', '지친 마음'],
      ['만족', '소망 성취', '안정'],
      ['조화', '가정의 행복', '평온'],
      ['상상력', '감수성', '마음의 소리'],
      ['낭만', '이상주의', '추구'],
      ['공감', '치유', '따뜻한 마음'],
      ['감정의 성숙', '관대함', '평화'],
    ],
  },
  {
    suit: 'swords',
    suitKo: '소드',
    element: '생각과 갈등',
    rankKeywords: [
      ['명료함', '진실', '순간의 깨달음'],
      ['망설임', '선택', '교착 상태'],
      ['상처', '슬픔', '해소'],
      ['휴식', '회복', '재정비'],
      ['패배', '갈등', '교훈'],
      ['전환', '이동', '변화의 시작'],
      ['책략', '은밀함', '주의'],
      ['스스로를 가둠', '제한', '해방의 실마리'],
      ['불안', '걱정', '밤의 고뇌'],
      ['끝', '하락', '최악의 지나감'],
      ['호기심', '경계', '새로운 소식'],
      ['직행', '급박', '결단력'],
      ['독립', '경험', '명석함'],
      ['논리', '권위', '원칙'],
    ],
  },
  {
    suit: 'pentacles',
    suitKo: '펜타클',
    element: '현실과 물질',
    rankKeywords: [
      ['기회', '재물의 씨앗', '실용성'],
      ['균형', '융통성', '조절'],
      ['협업', '기술', '실력 쌓기'],
      ['안정', '저축', '여유'],
      ['빈곤감', '나홀로', '회복'],
      ['나눔', '관용', '성공의 재분배'],
      ['인내', '평가', '기다림'],
      ['숙련', '노력', '완성도'],
      ['독립', '번영', '절제된 풍요'],
      ['유산', '안정', '장기적 성공'],
      ['학습', '진지함', '꾸준함'],
      ['성실', '신뢰', '느리지만 확실'],
      ['현실감각', '풍요', '자연의 축복'],
      ['성취', '압도적 성공', '관리능력'],
    ],
  },
];

const rankNames: Array<[string, string]> = [
  ['Ace', '에이스'],
  ['Two', '2'],
  ['Three', '3'],
  ['Four', '4'],
  ['Five', '5'],
  ['Six', '6'],
  ['Seven', '7'],
  ['Eight', '8'],
  ['Nine', '9'],
  ['Ten', '10'],
  ['Page', '페이지'],
  ['Knight', '기사'],
  ['Queen', '여왕'],
  ['King', '왕'],
];

export const tarotCards: TarotCard[] = [
  ...majorArcana.map(([name, nameKo, keywords]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    nameKo,
    arcana: 'major' as const,
    keywords,
  })),
  ...suits.flatMap(({ suit, suitKo, element, rankKeywords }) =>
    rankKeywords.map((keywords, rankIndex) => {
      const [rankEn, rankKo] = rankNames[rankIndex];
      return {
        id: `${rankEn.toLowerCase()}-${suit}`,
        name: `${rankEn} of ${suit!.charAt(0).toUpperCase()}${suit!.slice(1)}`,
        nameKo: `${suitKo} ${rankKo}`,
        arcana: 'minor' as const,
        suit: suit!,
        keywords: [...keywords, element],
      };
    })
  ),
];
