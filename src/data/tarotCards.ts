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
  {
    id: 3,
    name: 'The Empress',
    nameKo: '여황제',
    arcana: 'major',
    image: '/images/cards/03-empress.png',
    upright: {
      keywords: ['풍요', '돌봄', '결실'],
      meaning: '정성 들여 가꾼 일이 풍성한 열매와 따뜻한 안정으로 돌아옵니다.',
    },
    reversed: {
      keywords: ['과잉보호', '게으름', '정체'],
      meaning: '안주하거나 지나친 집착으로 흐름이 막혀 있을 수 있습니다.',
    },
  },
  {
    id: 4,
    name: 'The Emperor',
    nameKo: '황제',
    arcana: 'major',
    image: '/images/cards/04-emperor.png',
    upright: {
      keywords: ['책임', '질서', '리더십'],
      meaning: '명확한 기준과 단단한 의지로 상황을 주도해 나갈 때입니다.',
    },
    reversed: {
      keywords: ['고집', '통제', '경직'],
      meaning: '융통성이 부족해 주변과 마찰이 생길 수 있으니 한 걸음 물러나 보세요.',
    },
  },
  {
    id: 5,
    name: 'The Hierophant',
    nameKo: '교황',
    arcana: 'major',
    image: '/images/cards/05-hierophant.png',
    upright: {
      keywords: ['조언', '가치관', '전통'],
      meaning: '신뢰할 수 있는 조언이나 기본 원칙을 따를 때 해답이 보입니다.',
    },
    reversed: {
      keywords: ['형식주의', '갈등', '고정관념'],
      meaning: '틀에 갇힌 생각에서 벗어나 나만의 방식을 찾아야 할 시점입니다.',
    },
  },
  {
    id: 6,
    name: 'The Lovers',
    nameKo: '연인',
    arcana: 'major',
    image: '/images/cards/06-lovers.png',
    upright: {
      keywords: ['조화', '선택', '인연'],
      meaning: '마음이 끌리는 방향과 가치관이 일치하는 중요한 선택의 순간입니다.',
    },
    reversed: {
      keywords: ['망설임', '불협화음', '유혹'],
      meaning: '감정과 현실 사이에서 갈등하거나 관계의 균형이 흔들릴 수 있습니다.',
    },
  },
  {
    id: 7,
    name: 'The Chariot',
    nameKo: '전차',
    arcana: 'major',
    image: '/images/cards/07-chariot.png',
    upright: {
      keywords: ['돌파', '승리', '추진력'],
      meaning: '흔들리는 마음을 다잡고 목표를 향해 거침없이 나아갈 수 있습니다.',
    },
    reversed: {
      keywords: ['폭주', '방향 상실', '조급함'],
      meaning: '속도만 내다 중심을 잃기 쉬우니 호흡을 고르며 방향을 점검하세요.',
    },
  },
  {
    id: 8,
    name: 'Strength',
    nameKo: '힘',
    arcana: 'major',
    image: '/images/cards/08-strength.png',
    upright: {
      keywords: ['인내', '부드러운 힘', '용기'],
      meaning: '강압이 아닌 따뜻한 인내와 자기 신뢰로 상황을 풀어낼 수 있습니다.',
    },
    reversed: {
      keywords: ['자신감 하락', '조바심', '소진'],
      meaning: '스스로를 몰아세우기보다 지친 마음을 다독이는 시간이 필요합니다.',
    },
  },
  {
    id: 9,
    name: 'The Hermit',
    nameKo: '은둔자',
    arcana: 'major',
    image: '/images/cards/09-hermit.png',
    upright: {
      keywords: ['성찰', '탐구', '고독'],
      meaning: '외부의 소음을 잠시 끄고 내면의 답을 차분히 들여다볼 때입니다.',
    },
    reversed: {
      keywords: ['고립', '회피', '외로움'],
      meaning: '혼자만의 시간에 너무 갇혀 주변과의 연결을 놓치고 있을 수 있습니다.',
    },
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    nameKo: '운명의 수레바퀴',
    arcana: 'major',
    image: '/images/cards/10-wheel-of-fortune.png',
    upright: {
      keywords: ['전환점', '기회', '순환'],
      meaning: '멈춰 있던 흐름이 새롭게 회전하며 예상치 못한 기회가 찾아옵니다.',
    },
    reversed: {
      keywords: ['지연', '변화 저항', '타이밍 어긋남'],
      meaning: '아직 때가 무르익지 않았으니 흐름을 억지로 바꾸려 하지 마세요.',
    },
  },
  {
    id: 11,
    name: 'Justice',
    nameKo: '정의',
    arcana: 'major',
    image: '/images/cards/11-justice.png',
    upright: {
      keywords: ['균형', '진실', '책임'],
      meaning: '뿌린 대로 거두는 시점이며, 객관적이고 공정한 판단이 필요합니다.',
    },
    reversed: {
      keywords: ['불균형', '편견', '회피'],
      meaning: '감정에 치우친 판단이나 책임 미루기가 문제를 키울 수 있습니다.',
    },
  },
  {
    id: 12,
    name: 'The Hanged Man',
    nameKo: '매달린 사람',
    arcana: 'major',
    image: '/images/cards/12-hanged-man.png',
    upright: {
      keywords: ['관점 전환', '기다림', '수용'],
      meaning: '당장 움직이지 않고 시선을 달리할 때 뜻밖의 깨달음이 옵니다.',
    },
    reversed: {
      keywords: ['무의미한 희생', '정체', '집착'],
      meaning: '끝난 흐름을 붙잡고 있지는 않은지 내려놓을 지점을 살펴보세요.',
    },
  },
  {
    id: 13,
    name: 'Death',
    nameKo: '죽음',
    arcana: 'major',
    image: '/images/cards/13-death.png',
    upright: {
      keywords: ['끝과 시작', '변화', '정리'],
      meaning: '오래된 한 챕터가 끝나고 완전히 새로운 국면으로 넘어가는 문턱입니다.',
    },
    reversed: {
      keywords: ['미련', '변화 두려움', '미루기'],
      meaning: '끝내야 할 일을 미루면 새로운 시작도 함께 지연됩니다.',
    },
  },
  {
    id: 14,
    name: 'Temperance',
    nameKo: '절제',
    arcana: 'major',
    image: '/images/cards/14-temperance.png',
    upright: {
      keywords: ['조율', '균형', '회복'],
      meaning: '서로 다른 요소들이 조화롭게 섞이며 안정적인 리듬을 되찾습니다.',
    },
    reversed: {
      keywords: ['불균형', '과도함', '조급함'],
      meaning: '한쪽으로 치우친 생활이나 감정 기복을 다스릴 필요가 있습니다.',
    },
  },
  {
    id: 15,
    name: 'The Devil',
    nameKo: '악마',
    arcana: 'major',
    image: '/images/cards/15-devil.png',
    upright: {
      keywords: ['집착', '유혹', '속박'],
      meaning: '스스로를 묶고 있는 습관이나 집착이 무엇인지 직면할 때입니다.',
    },
    reversed: {
      keywords: ['해방', '각성', '벗어남'],
      meaning: '불건강한 고리를 끊어내고 자유를 되찾기 시작하는 신호입니다.',
    },
  },
  {
    id: 16,
    name: 'The Tower',
    nameKo: '탑',
    arcana: 'major',
    image: '/images/cards/16-tower.png',
    upright: {
      keywords: ['충격', '각성', '재구성'],
      meaning: '흔들리던 기반이 무너지며 진실이 드러나고 새로운 토대가 마련됩니다.',
    },
    reversed: {
      keywords: ['외면', '여진', '변화 회피'],
      meaning: '균열을 외면하기보다 지금 드러난 신호를 정면으로 마주해야 합니다.',
    },
  },
  {
    id: 17,
    name: 'The Star',
    nameKo: '별',
    arcana: 'major',
    image: '/images/cards/17-star.png',
    upright: {
      keywords: ['희망', '치유', '영감'],
      meaning: '어두운 밤 뒤로 잔잔한 희망의 별빛이 비치며 마음이 맑아집니다.',
    },
    reversed: {
      keywords: ['낙담', '현실 괴리', '기력 저하'],
      meaning: '기대가 컸던 만큼 실망할 수 있으니 작은 것부터 회복해 보세요.',
    },
  },
  {
    id: 18,
    name: 'The Moon',
    nameKo: '달',
    arcana: 'major',
    image: '/images/cards/18-moon.png',
    upright: {
      keywords: ['불안', '직관', '모호함'],
      meaning: '아직 모든 것이 선명하지 않으니 성급한 결론보다 관망이 유리합니다.',
    },
    reversed: {
      keywords: ['오해 해소', '혼란 진정', '진실 드러남'],
      meaning: '안개가 걷히면서 막연했던 불안의 실체가 조금씩 보이기 시작합니다.',
    },
  },
  {
    id: 19,
    name: 'The Sun',
    nameKo: '태양',
    arcana: 'major',
    image: '/images/cards/19-sun.png',
    upright: {
      keywords: ['성공', '기쁨', '명확함'],
      meaning: '숨김없이 빛나는 긍정적인 에너지와 기분 좋은 소식이 함께합니다.',
    },
    reversed: {
      keywords: ['과열', '지연된 기쁨', '자만'],
      meaning: '좋은 흐름이지만 방심하지 말고 디테일을 한 번 더 확인하세요.',
    },
  },
  {
    id: 20,
    name: 'Judgement',
    nameKo: '심판',
    arcana: 'major',
    image: '/images/cards/20-judgement.png',
    upright: {
      keywords: ['각성', '부활', '결단'],
      meaning: '과거의 경험을 바탕으로 새로운 부름에 응답할 결정적 시점입니다.',
    },
    reversed: {
      keywords: ['자기비판', '결정 회피', '과거 연연'],
      meaning: '지난 선택을 자책하기보다 지금 할 수 있는 작은 결정에 집중하세요.',
    },
  },
  {
    id: 21,
    name: 'The World',
    nameKo: '세계',
    arcana: 'major',
    image: '/images/cards/21-world.png',
    upright: {
      keywords: ['완성', '성취', '조화'],
      meaning: '한 주기가 온전히 완성되며 다음 단계로 나아갈 준비가 끝났습니다.',
    },
    reversed: {
      keywords: ['마무리 부족', '미완성', '여운'],
      meaning: '거의 다 왔지만 마지막 마침표를 찍기 위한 작은 정리가 남아 있습니다.',
    },
  },
];
