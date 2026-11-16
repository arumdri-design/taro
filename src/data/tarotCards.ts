export interface TarotDirectionMeaning {
  keywords: string[];
  meaning: string;
}

export interface TarotCard {
  id: string;
  number: number;
  name: string;
  nameKo: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  image: string; // public/cards/*.png 경로
  keywords: string[]; // 기존 코드 호환용 (정방향 키워드)
  upright: TarotDirectionMeaning;
  reversed: TarotDirectionMeaning;
}

export const CARD_BACK_IMAGE = '/images/card-back.png';

const majorArcana: Array<{
  number: number;
  name: string;
  nameKo: string;
  image: string;
  upright: TarotDirectionMeaning;
  reversed: TarotDirectionMeaning;
}> = [
  {
    number: 0,
    name: 'The Fool',
    nameKo: '바보',
    image: '/cards/major-00.png',
    upright: {
      keywords: ['새로운 시작', '자유', '모험', '순수'],
      meaning: '과거의 틀을 벗어나 낯설지만 자유로운 첫걸음을 내딛는 흐름입니다.',
    },
    reversed: {
      keywords: ['무모함', '준비 부족', '현실 도피', '부주의'],
      meaning: '충분한 점검 없이 성급히 움직이거나 현실적인 책임을 미루고 있을 수 있습니다.',
    },
  },
  {
    number: 1,
    name: 'The Magician',
    nameKo: '마법사',
    image: '/cards/major-01.png',
    upright: {
      keywords: ['창의력', '의지력', '실현', '능력'],
      meaning: '목표를 이루기 위한 도구와 역량이 이미 손에 쥐어져 있으니 실행에 옮길 때입니다.',
    },
    reversed: {
      keywords: ['우유부단', '재능 낭비', '속임수', '공허한 계획'],
      meaning: '아이디어만 많고 실행력이 부족하거나, 주변을 설득하려다 진심이 흐려질 수 있습니다.',
    },
  },
  {
    number: 2,
    name: 'The High Priestess',
    nameKo: '여사제',
    image: '/cards/major-02.png',
    upright: {
      keywords: ['직관', '내면의 목소리', '비밀', '신비'],
      meaning: '겉으로 드러난 행동보다 조용히 상황을 지켜보며 내면의 직관을 따르는 것이 유리합니다.',
    },
    reversed: {
      keywords: ['폐쇄성', '불안', '직관 무시', '숨겨진 의도'],
      meaning: '감정을 지나치게 억누르거나, 보이지 않는 변수 때문에 판단이 흐려질 수 있습니다.',
    },
  },
  {
    number: 3,
    name: 'The Empress',
    nameKo: '여황제',
    image: '/cards/major-03.png',
    upright: {
      keywords: ['풍요', '모성', '자연', '창조력'],
      meaning: '정성껏 돌본 일이 결실을 맺고, 따뜻하고 풍요로운 환경이 마련되는 시기입니다.',
    },
    reversed: {
      keywords: ['과잉보호', '나태함', '의존', '창작 막힘'],
      meaning: '스스로를 돌보지 못한 채 지치거나, 과도한 간섭과 안일함으로 흐름이 무뎌질 수 있습니다.',
    },
  },
  {
    number: 4,
    name: 'The Emperor',
    nameKo: '황제',
    image: '/cards/major-04.png',
    upright: {
      keywords: ['권위', '안정', '리더십', '질서'],
      meaning: '명확한 기준과 책임감을 바탕으로 흔들리는 상황을 단단히 세울 수 있는 힘입니다.',
    },
    reversed: {
      keywords: ['경직됨', '독단', '통제 욕구', '불안정한 기반'],
      meaning: '고집이 세져 주변과 마찰이 생기거나, 반대로 중심을 잡지 못해 흔들릴 수 있습니다.',
    },
  },
  {
    number: 5,
    name: 'The Hierophant',
    nameKo: '교황',
    image: '/cards/major-05.png',
    upright: {
      keywords: ['전통', '가르침', '신념', '조언'],
      meaning: '검증된 원칙이나 경험 많은 조언자의 말에 귀를 기울이면 해답이 보입니다.',
    },
    reversed: {
      keywords: ['형식주의', '고정관념', '반발', '맹신'],
      meaning: '낡은 규칙에 갇혀 변화를 막거나, 반대로 기본 원칙을 무시해 실수가 생길 수 있습니다.',
    },
  },
  {
    number: 6,
    name: 'The Lovers',
    nameKo: '연인',
    image: '/cards/major-06.png',
    upright: {
      keywords: ['사랑', '조화', '선택', '연결'],
      meaning: '마음이 통하는 관계의 발전과 더불어, 가치관에 맞는 중요한 선택이 다가옵니다.',
    },
    reversed: {
      keywords: ['갈등', '선택 회피', '가치관 충돌', '불균형'],
      meaning: '관계의 거리감이나 결정 장애로 인해 마음이 흔들리고 있을 수 있습니다.',
    },
  },
  {
    number: 7,
    name: 'The Chariot',
    nameKo: '전차',
    image: '/cards/major-07.png',
    upright: {
      keywords: ['승리', '의지', '전진', '결단'],
      meaning: '상반된 감정을 하나로 묶어 목표를 향해 강하게 돌파해 나가는 추진력입니다.',
    },
    reversed: {
      keywords: ['폭주', '방향 상실', '조급함', '통제 불능'],
      meaning: '속도만 내다가 방향을 놓치거나, 감정 기복 때문에 계획이 어긋날 수 있습니다.',
    },
  },
  {
    number: 8,
    name: 'Strength',
    nameKo: '힘',
    image: '/cards/major-08.png',
    upright: {
      keywords: ['용기', '인내', '부드러운 힘', '자기통제'],
      meaning: '강압이 아닌 따뜻한 인내와 평정심으로 어려운 상황을 다독여 이겨내는 힘입니다.',
    },
    reversed: {
      keywords: ['자신감 저하', '의심', '감정 폭발', '포기'],
      meaning: '스스로에 대한 의심이 커지거나, 인내심이 바닥나 조급해질 수 있습니다.',
    },
  },
  {
    number: 9,
    name: 'The Hermit',
    nameKo: '은둔자',
    image: '/cards/major-09.png',
    upright: {
      keywords: ['성찰', '고독', '지혜', '내면 탐구'],
      meaning: '외부의 소음을 끄고 혼자만의 시간 속에서 본질적인 답을 찾는 시기입니다.',
    },
    reversed: {
      keywords: ['고립', '외로움', '현실 회피', '폐쇄적 태도'],
      meaning: '혼자만의 시간에 갇혀 주변의 도움까지 거부하고 있을 수 있습니다.',
    },
  },
  {
    number: 10,
    name: 'Wheel of Fortune',
    nameKo: '운명의 수레바퀴',
    image: '/cards/major-10.png',
    upright: {
      keywords: ['순환', '운명', '전환점', '변화'],
      meaning: '멈춰 있던 흐름이 움직이며 새로운 기회와 전환점이 찾아오는 시점입니다.',
    },
    reversed: {
      keywords: ['지연', '변화 저항', '예상치 못한 변수', '정체'],
      meaning: '흐름을 거스르려다 오히려 피로가 쌓이거나, 타이밍이 어긋날 수 있습니다.',
    },
  },
  {
    number: 11,
    name: 'Justice',
    nameKo: '정의',
    image: '/cards/major-11.png',
    upright: {
      keywords: ['공정', '균형', '진실', '책임'],
      meaning: '감정을 덜어내고 사실과 원칙에 입각해 공정한 결론을 내려야 할 때입니다.',
    },
    reversed: {
      keywords: ['편견', '불공정', '책임 회피', '불균형'],
      meaning: '한쪽으로 치우친 판단이나, 내 선택의 결과를 외면하려는 태도를 경계해야 합니다.',
    },
  },
  {
    number: 12,
    name: 'The Hanged Man',
    nameKo: '매달린 사람',
    image: '/cards/major-12.png',
    upright: {
      keywords: ['관점 전환', '기다림', '희생', '통찰'],
      meaning: '당장 밀어붙이기보다 멈춰 서서 상황을 거꾸로 바라볼 때 새로운 해법이 열립니다.',
    },
    reversed: {
      keywords: ['무의미한 희생', '정체', '집착', '멈춤의 지연'],
      meaning: '기다림이 길어지면서 무기력해지거나, 불필요한 인내를 이어가고 있을 수 있습니다.',
    },
  },
  {
    number: 13,
    name: 'Death',
    nameKo: '죽음',
    image: '/cards/major-13.png',
    upright: {
      keywords: ['끝과 시작', '탈피', '변화', '재탄생'],
      meaning: '오래된 한 챕터가 마무리되고, 전혀 다른 새로운 국면이 시작되는 전환입니다.',
    },
    reversed: {
      keywords: ['변화 거부', '미련', '정체된 끝', '두려움'],
      meaning: '이미 끝난 인연이나 방식에 매달려 다음 단계로 넘어가지 못하고 있습니다.',
    },
  },
  {
    number: 14,
    name: 'Temperance',
    nameKo: '절제',
    image: '/cards/major-14.png',
    upright: {
      keywords: ['조화', '균형', '인내', '치유'],
      meaning: '서로 다른 요소들을 알맞게 섞어 조화를 이루며 천천히 회복해 나가는 흐름입니다.',
    },
    reversed: {
      keywords: ['불균형', '과잉', '조급함', '조율 실패'],
      meaning: '생활 리듬이나 감정 균형이 깨져 한쪽으로 치우친 상태입니다.',
    },
  },
  {
    number: 15,
    name: 'The Devil',
    nameKo: '악마',
    image: '/cards/major-15.png',
    upright: {
      keywords: ['집착', '유혹', '속박', '그림자'],
      meaning: '눈앞의 이익이나 익숙한 습관에 묶여 스스로를 제한하고 있는지 돌아볼 때입니다.',
    },
    reversed: {
      keywords: ['해방', '집착 내려놓기', '각성', '벗어남'],
      meaning: '억누르던 굴레나 나쁜 패턴에서 벗어나려는 의지가 싹트고 있습니다.',
    },
  },
  {
    number: 16,
    name: 'The Tower',
    nameKo: '탑',
    image: '/cards/major-16.png',
    upright: {
      keywords: ['급변', '붕괴', '충격', '새로운 진실'],
      meaning: '예상치 못한 충격으로 기존의 틀이 흔들리지만, 그 끝에 진짜 진실이 드러납니다.',
    },
    reversed: {
      keywords: ['변화 회피', '내적 갈등', '지연된 충격', '불안'],
      meaning: '문제를 외면하며 버티고 있지만, 근본적인 정리를 피하기 어렵습니다.',
    },
  },
  {
    number: 17,
    name: 'The Star',
    nameKo: '별',
    image: '/cards/major-17.png',
    upright: {
      keywords: ['희망', '영감', '치유', '긍정'],
      meaning: '어두운 밤이 지나고 잔잔한 희망과 치유의 빛이 스며드는 따뜻한 흐름입니다.',
    },
    reversed: {
      keywords: ['낙담', '기대 상실', '냉소', '방향 흔들림'],
      meaning: '지친 마음 때문에 희망을 품기 어렵거나, 이상과 현실의 괴리를 느낄 수 있습니다.',
    },
  },
  {
    number: 18,
    name: 'The Moon',
    nameKo: '달',
    image: '/cards/major-18.png',
    upright: {
      keywords: ['불확실성', '환상', '무의식', '직관'],
      meaning: '아직 모든 것이 명확하지 않으니 성급한 단정 대신 차분히 안개가 걷히길 기다리세요.',
    },
    reversed: {
      keywords: ['오해 해소', '불안 완화', '진실 드러남', '착각 깨짐'],
      meaning: '막연했던 두려움이 걷히거나, 숨겨져 있던 사실이 수면 위로 드러납니다.',
    },
  },
  {
    number: 19,
    name: 'The Sun',
    nameKo: '태양',
    image: '/cards/major-19.png',
    upright: {
      keywords: ['성공', '기쁨', '활력', '명료함'],
      meaning: '숨김없이 드러나는 밝은 에너지와 기쁨, 노력에 대한 명쾌한 결실이 찾아옵니다.',
    },
    reversed: {
      keywords: ['과신', '지연된 기쁨', '에너지 소진', '시야 흐림'],
      meaning: '좋은 흐름이 와도 지나친 낙관이나 피로 때문에 온전히 누리지 못할 수 있습니다.',
    },
  },
  {
    number: 20,
    name: 'Judgement',
    nameKo: '심판',
    image: '/cards/major-20.png',
    upright: {
      keywords: ['부활', '결론', '각성', '평가'],
      meaning: '과거의 경험을 바탕으로 깊이 깨닫고, 새로운 부름에 응답해 다시 일어서는 시기입니다.',
    },
    reversed: {
      keywords: ['자기비판', '결정 미룸', '과거 후회', '각성 지연'],
      meaning: '지나간 일을 자책하느라 중요한 결단을 미루고 있을 수 있습니다.',
    },
  },
  {
    number: 21,
    name: 'The World',
    nameKo: '세계',
    image: '/cards/major-21.png',
    upright: {
      keywords: ['완성', '성취', '여정의 끝', '통합'],
      meaning: '한 주기의 여정이 원만하게 마무리되고, 다음 단계로 나아갈 온전한 균형을 이룹니다.',
    },
    reversed: {
      keywords: ['미완성', '마무리 지연', '성취감 부족', '반복'],
      meaning: '거의 다 왔지만 마지막 마무리가 아쉬워 다음 단계로 완전히 넘어가기 전입니다.',
    },
  },
];

const suits: Array<{
  suit: NonNullable<TarotCard['suit']>;
  suitKo: string;
  element: string;
  uprightList: TarotDirectionMeaning[];
  reversedList: TarotDirectionMeaning[];
}> = [
  {
    suit: 'wands',
    suitKo: '완드',
    element: '열정과 행동',
    uprightList: [
      { keywords: ['창조', '시작', '잠재력'], meaning: '새로운 열정과 아이디어가 싹트는 활기찬 시작입니다.' },
      { keywords: ['계획', '미래지향', '결정'], meaning: '현재 위치에서 더 넓은 미래를 바라보며 방향을 잡는 시기입니다.' },
      { keywords: ['확장', '예견', '협력'], meaning: '준비한 일이 바깥으로 확장되고 든든한 동료가 생깁니다.' },
      { keywords: ['축하', '안정', '가정'], meaning: '노력의 결실을 함께 나누며 따뜻한 안정감을 누리는 때입니다.' },
      { keywords: ['경쟁', '갈등', '압박'], meaning: '의견 충돌이나 경쟁 속에서 각자의 주장이 부딪칠 수 있습니다.' },
      { keywords: ['인정', '승리', '자신감'], meaning: '노력이 인정받고 당당한 자신감을 되찾는 긍정적인 흐름입니다.' },
      { keywords: ['방어', '고집', '확신'], meaning: '어려운 환경에서도 내 자리를 지키며 버텨내는 끈기입니다.' },
      { keywords: ['속도', '기세', '변화'], meaning: '소식과 상황이 빠르게 전개되며 흐름이 한 번에 바뀝니다.' },
      { keywords: ['회복 탄력성', '경계심', '피로'], meaning: '지친 몸과 마음을 추스르며 마지막 고비를 지키는 상태입니다.' },
      { keywords: ['짐', '책임', '압도'], meaning: '혼자 감당하는 책임과 일정이 무겁게 느껴질 수 있습니다.' },
      { keywords: ['모험', '자유', '에너지'], meaning: '호기심 어린 새로운 소식이나 작은 모험의 기회가 열립니다.' },
      { keywords: ['매력', '열정', '자신감'], meaning: '뜨거운 열정과 행동력으로 상황을 밀어붙이는 에너지입니다.' },
      { keywords: ['비전', '리더십', '추진력'], meaning: '주변을 밝게 이끌고 자신의 비전을 당당히 실현하는 힘입니다.' },
      { keywords: ['카리스마', '결단', '활력'], meaning: '풍부한 경험과 카리스마로 판을 주도하는 성숙한 리더십입니다.' },
    ],
    reversedList: [
      { keywords: ['시작 지연', '의욕 저하', '불씨 꺼짐'], meaning: '시작하려는 마음이 주춤하거나 동력이 약해진 상태입니다.' },
      { keywords: ['두려움', '우유부단', '시야 협소'], meaning: '변화가 두려워 한 발짝 내딛지 못하고 망설이고 있습니다.' },
      { keywords: ['소통 단절', '기대 어긋남', '지연'], meaning: '계획한 확장이 늦어지거나 협력 과정에서 엇갈림이 생깁니다.' },
      { keywords: ['불안정한 기반', '소홀함', '과도한 여유'], meaning: '가까운 관계나 기반을 챙기지 못해 흔들릴 수 있습니다.' },
      { keywords: ['내분', '회피', '소모전'], meaning: '불필요한 다툼에 지쳐 피하거나, 반대로 갈등이 길어집니다.' },
      { keywords: ['자만', '인정 갈구', '기복'], meaning: '남의 시선에 과도하게 흔들리거나 방심할 수 있습니다.' },
      { keywords: ['포기', '압도됨', '방어 실패'], meaning: '버티기 힘들어 주도권을 놓치거나 위축된 상태입니다.' },
      { keywords: ['성급함', '소식 지연', '혼선'], meaning: '예상과 다르게 일정이 꼬이거나 조급함이 앞섭니다.' },
      { keywords: ['고집', '완고함', '과로'], meaning: '도움을 거절한 채 혼자 버티다 한계에 다다를 수 있습니다.' },
      { keywords: ['과부하', '위임 실패', '번아웃'], meaning: '일을 나누지 못해 지쳤으니 불필요한 짐을 내려놓아야 합니다.' },
      { keywords: ['산만함', '무책임', '소식 없음'], meaning: '흥미만 쫓다 마무리가 흐트러질 수 있습니다.' },
      { keywords: ['충동', '조급함', '성격 급함'], meaning: '감정이 앞서서 일을 그르치기 쉬우니 한 템포 쉬어가세요.' },
      { keywords: ['질투', '예민함', '주도권 다툼'], meaning: '자신감이 흔들려 주변을 경계하거나 예민해질 수 있습니다.' },
      { keywords: ['독선', '완고함', '권위 남용'], meaning: '내 방식만 고집하다 주변의 지지를 잃을 위험이 있습니다.' },
    ],
  },
  {
    suit: 'cups',
    suitKo: '컵',
    element: '감정과 사랑',
    uprightList: [
      { keywords: ['새로운 사랑', '감정', '마음의 시작'], meaning: '따뜻한 감정과 새로운 인연, 마음의 설렘이 시작됩니다.' },
      { keywords: ['연결', '파트너십', '매력'], meaning: '서로 마음을 나누고 깊은 신뢰를 쌓는 조화로운 관계입니다.' },
      { keywords: ['우정', '축하', '공동체'], meaning: '좋은 사람들과 함께 기쁨을 나누고 어울리는 즐거운 시간입니다.' },
      { keywords: ['무료함', '성찰', '새로운 기회'], meaning: '익숙한 일상에 권태를 느끼며 내면을 돌아보는 시점입니다.' },
      { keywords: ['상실', '슬픔', '수용'], meaning: '아쉬움이나 상실감이 있지만, 남은 희망을 바라보며 추스르는 과정입니다.' },
      { keywords: ['향수', '추억', '순수한 기쁨'], meaning: '과거의 따뜻한 기억이나 순수한 마음이 위로가 되어줍니다.' },
      { keywords: ['선택의 갈등', '환상', '기회'], meaning: '여러 선택지 앞에서 마음이 흔들리니 현실과 환상을 구분해야 합니다.' },
      { keywords: ['이별', '벗어남', '지친 마음'], meaning: '더는 맞지 않는 자리나 관계를 떠나 새로운 길을 찾는 결단입니다.' },
      { keywords: ['만족', '소망 성취', '안정'], meaning: '마음속으로 바라던 소원이 이루어지며 깊은 만족감을 느낍니다.' },
      { keywords: ['조화', '가정의 행복', '평온'], meaning: '가족이나 가까운 이들과 정서적 안정을 이루는 행복한 상태입니다.' },
      { keywords: ['상상력', '감수성', '마음의 소리'], meaning: '섬세한 감성과 직관, 의외의 따뜻한 소식이 찾아옵니다.' },
      { keywords: ['낭만', '이상주의', '추구'], meaning: '마음이 이끄는 방향을 향해 낭만적이고 진심 어린 걸음을 내딛습니다.' },
      { keywords: ['공감', '치유', '따뜻한 마음'], meaning: '깊은 공감력과 포용력으로 주변과 나 자신을 치유하는 에너지입니다.' },
      { keywords: ['감정의 성숙', '관대함', '평화'], meaning: '감정을 휘두르지 않고 따뜻하고 평화롭게 조율하는 성숙함입니다.' },
    ],
    reversedList: [
      { keywords: ['감정 억압', '식어버린 마음', '공허함'], meaning: '마음을 열기 어렵거나 감정적 교류가 잠시 멈춘 상태입니다.' },
      { keywords: ['불협화음', '이별', '오해'], meaning: '관계의 균형이 깨져 거리감이나 서운함이 생길 수 있습니다.' },
      { keywords: ['소외감', '과음·과식', '관계 피로'], meaning: '사람들과의 자리에서 오히려 공허함이나 피로를 느낄 수 있습니다.' },
      { keywords: ['고립', '기회 놓침', '무기력'], meaning: '다가오는 손길을 외면한 채 무기력 속에 머물러 있을 수 있습니다.' },
      { keywords: ['집착', '과거에 갇힘', '회복 지연'], meaning: '지나간 상처나 후회에 묶여 앞을 보지 못하고 있습니다.' },
      { keywords: ['과거 집착', '현실 도피', '미성숙'], meaning: '추억에만 기대어 현재의 현실을 마주하기 어려워할 수 있습니다.' },
      { keywords: ['현실 감각 상실', '결단 회피', '혼란'], meaning: '헛된 기대나 망상에 빠져 현실적인 판단을 미루고 있습니다.' },
      { keywords: ['두려움으로 머무름', '미련', '회피'], meaning: '떠나야 할 때임을 알면서도 두려움 때문에 머뭇거리고 있습니다.' },
      { keywords: ['불만족', '허영', '과도한 욕심'], meaning: '겉으로는 괜찮아 보여도 내면의 허전함이나 욕심이 남아 있습니다.' },
      { keywords: ['가정 불화', '가치관 충돌', '소통 부재'], meaning: '가까운 사이일수록 말하지 못한 서운함이 쌓여 있을 수 있습니다.' },
      { keywords: ['감정 기복', '현실성 부족', '소심함'], meaning: '사소한 말에 마음이 크게 흔들리거나 예민해질 수 있습니다.' },
      { keywords: ['변덕', '비현실적 기대', '실망'], meaning: '감정의 높낮이가 커서 상대나 상황에 실망하기 쉽습니다.' },
      { keywords: ['감정 소진', '의존', '경계 흐림'], meaning: '남을 챙기느라 내 마음이 바닥났거나 경계가 무너졌습니다.' },
      { keywords: ['냉담함', '감정 조작', '불안정'], meaning: '따뜻함을 잃고 차갑게 굴거나 내면의 불안을 감추고 있습니다.' },
    ],
  },
  {
    suit: 'swords',
    suitKo: '소드',
    element: '생각과 갈등',
    uprightList: [
      { keywords: ['명료함', '진실', '순간의 깨달음'], meaning: '복잡하던 생각이 정리되고 핵심 진실이 선명하게 드러납니다.' },
      { keywords: ['망설임', '선택', '교착 상태'], meaning: '두 가지 선택지 사이에서 신중하게 저울질하는 중립 상태입니다.' },
      { keywords: ['상처', '슬픔', '해소'], meaning: '마음 아픈 일이 드러나며 오히려 억눌렸던 감정을 털어내게 됩니다.' },
      { keywords: ['휴식', '회복', '재정비'], meaning: '치열했던 생각과 긴장을 멈추고 조용히 에너지를 충전할 때입니다.' },
      { keywords: ['패배', '갈등', '교훈'], meaning: '이겨도 상처가 남는 다툼이 있으니 승패보다 교훈을 챙기세요.' },
      { keywords: ['전환', '이동', '변화의 시작'], meaning: '힘든 구간을 지나 조금씩 평온한 곳으로 옮겨가는 전환기입니다.' },
      { keywords: ['책략', '은밀함', '주의'], meaning: '직접 부딪치기보다 전략적으로 움직이거나 주변을 살필 때입니다.' },
      { keywords: ['스스로를 가둠', '제한', '해방의 실마리'], meaning: '상황이 막힌 것처럼 보이지만, 생각을 바꾸면 빠져나올 길이 보입니다.' },
      { keywords: ['불안', '걱정', '밤의 고뇌'], meaning: '아직 일어나지 않은 일까지 끌어안고 밤잠을 설치는 불안입니다.' },
      { keywords: ['끝', '하락', '최악의 지나감'], meaning: '한 국면이 완전히 끝나며, 바닥을 찍고 다시 시작할 준비가 됩니다.' },
      { keywords: ['호기심', '경계', '새로운 소식'], meaning: '예리한 관찰력과 새로운 정보, 솔직한 대화의 신호입니다.' },
      { keywords: ['직행', '급박', '결단력'], meaning: '망설임 없이 곧장 움직여 문제를 돌파하는 빠르고 날카로운 에너지입니다.' },
      { keywords: ['독립', '경험', '명석함'], meaning: '감정에 휘둘리지 않고 냉철하고 명확하게 상황을 분석하는 지성입니다.' },
      { keywords: ['논리', '권위', '원칙'], meaning: '공정한 기준과 논리적인 판단으로 상황을 정리하는 리더십입니다.' },
    ],
    reversedList: [
      { keywords: ['혼란', '오해', '잔인한 말'], meaning: '말이나 생각이 날카롭게 엇나가 오해가 생기기 쉬운 상태입니다.' },
      { keywords: ['거짓말', '정보 부족', '결단 지연'], meaning: '중요한 사실을 보지 못했거나 결정을 미루고 있습니다.' },
      { keywords: ['용서', '상처 치유', '자기연민'], meaning: '아픔을 인정하고 털어내려 하거나, 반대로 상처에 머물러 있습니다.' },
      { keywords: ['강제 휴식', '고립', '불안한 쉼'], meaning: '쉬어야 하는데도 머릿속 생각이 멈추지 않아 개운하지 않습니다.' },
      { keywords: ['뒷감당', '화해 시도', '비겁함'], meaning: '갈등의 여파를 수습하거나, 책임을 회피하려는 태도가 보입니다.' },
      { keywords: ['미련', '정체', '이동 지연'], meaning: '떠나야 할 자리에서 발이 떨어지지 않거나 변화가 미뤄집니다.' },
      { keywords: ['양심의 가책', '비밀 발각', '자멸'], meaning: '숨기려던 일이 드러나거나 스스로를 옭아매는 행동이 문제 됩니다.' },
      { keywords: ['새로운 시각', '자기해방', '피해의식'], meaning: '스스로 만든 한계를 깨닫고 벗어나거나, 피해의식에 빠질 수 있습니다.' },
      { keywords: ['두려움 극복', '죄책감', '과도한 스트레스'], meaning: '막연한 공포에서 벗어나려 애쓰고 있거나 스트레스가 극에 달했습니다.' },
      { keywords: ['회복 시작', '미련 정리', '외상'], meaning: '가장 힘든 고비를 넘기고 천천히 다시 일어서려는 회복기입니다.' },
      { keywords: ['냉소', '가십', '방어적 태도'], meaning: '말실수나 가벼운 수군거림, 방어적인 태도를 조심해야 합니다.' },
      { keywords: ['무모함', '성급한 말', '통제 불능'], meaning: '생각보다 말이 먼저 나가 상처를 줄 수 있으니 신중하세요.' },
      { keywords: ['냉혹함', '잔인함', '편견'], meaning: '지나치게 차갑고 계산적인 태도가 관계를 멀어지게 할 수 있습니다.' },
      { keywords: ['독선', '조작', '불공정'], meaning: '원칙을 내세워 상대를 몰아세우거나 편견에 빠질 위험이 있습니다.' },
    ],
  },
  {
    suit: 'pentacles',
    suitKo: '펜타클',
    element: '현실과 물질',
    uprightList: [
      { keywords: ['기회', '재물의 씨앗', '실용성'], meaning: '일·재물·건강 면에서 실질적인 새 출발의 씨앗이 열립니다.' },
      { keywords: ['균형', '융통성', '조절'], meaning: '바쁜 일정과 현실적인 균형을 유연하게 맞춰가는 시기입니다.' },
      { keywords: ['협업', '기술', '실력 쌓기'], meaning: '함께 일하는 사람들과 호흡을 맞추며 탄탄하게 실력을 쌓습니다.' },
      { keywords: ['안정', '저축', '여유'], meaning: '지금 가진 것을 지키며 안정적인 기반을 다지는 상태입니다.' },
      { keywords: ['빈곤감', '나홀로', '회복'], meaning: '형편이나 마음이 팍팍하게 느껴지지만, 곁의 도움을 알아볼 때입니다.' },
      { keywords: ['나눔', '관용', '성공의 재분배'], meaning: '주고받는 균형이 맞으며, 베푼 만큼 다시 돌아오는 흐름입니다.' },
      { keywords: ['인내', '평가', '기다림'], meaning: '심어둔 노력의 중간 점검을 하며 차분히 결실을 기다리는 때입니다.' },
      { keywords: ['숙련', '노력', '완성도'], meaning: '묵묵히 한 가지 일에 몰두해 전문성과 완성도를 높이는 시기입니다.' },
      { keywords: ['독립', '번영', '절제된 풍요'], meaning: '스스로의 힘으로 일군 풍요와 여유, 단단한 자립을 보여줍니다.' },
      { keywords: ['유산', '안정', '장기적 성공'], meaning: '오랜 시간 쌓아온 신뢰와 기반이 든든한 결실로 이어집니다.' },
      { keywords: ['학습', '진지함', '꾸준함'], meaning: '새로운 기술을 배우거나 현실적인 목표를 차근차근 준비합니다.' },
      { keywords: ['성실', '신뢰', '느리지만 확실'], meaning: '화려하진 않지만 한 걸음씩 끝까지 해내는 성실한 에너지입니다.' },
      { keywords: ['현실감각', '풍요', '자연의 축복'], meaning: '현실적인 감각과 따뜻한 돌봄으로 풍요를 일구는 역량입니다.' },
      { keywords: ['성취', '압도적 성공', '관리능력'], meaning: '현실적인 목표를 성공적으로 이끄는 안정적이고 유능한 리더십입니다.' },
    ],
    reversedList: [
      { keywords: ['기회 상실', '계획 부족', '탐욕'], meaning: '눈앞의 실속 있는 기회를 놓치거나 준비가 부족할 수 있습니다.' },
      { keywords: ['균형 붕괴', '무리한 일정', '재정 압박'], meaning: '일과 생활의 밸런스가 깨져 체력이나 지출 관리가 흔들립니다.' },
      { keywords: ['협업 불화', '질 낮은 결과', '고집'], meaning: '팀워크가 어긋나거나 기본기를 소홀히 해 수정이 필요할 수 있습니다.' },
      { keywords: ['집착', '인색함', '정체'], meaning: '잃을까 봐 움켜쥐기만 하다가 새로운 흐름을 막고 있습니다.' },
      { keywords: ['고립 심화', '재정 악화', '도움 거부'], meaning: '어려움을 혼자 떠안고 주변의 손길마저 닫아버린 상태입니다.' },
      { keywords: ['불공평한 거래', '빚·의존', '생색'], meaning: '주고받는 관계가 기울었거나 조건부 호의에 마음이 상할 수 있습니다.' },
      { keywords: ['조급함', '노력 낭비', '성과 부족'], meaning: '기다리지 못하고 서두르거나, 방향이 어긋난 노력에 지칩니다.' },
      { keywords: ['완벽주의 강박', '단순 반복', '무기력'], meaning: '의미 없이 바쁘기만 하거나 열정이 식어 기계적으로 일하고 있습니다.' },
      { keywords: ['의존', '겉치레', '불안정한 자립'], meaning: '스스로 서는 힘이 부족하거나 겉모습만 그럴듯해 보일 수 있습니다.' },
      { keywords: ['가정 재정 갈등', '전통 충돌', '불안정'], meaning: '현실적인 문제나 가족 간 이해관계로 갈등이 생길 수 있습니다.' },
      { keywords: ['게으름', '집중력 저하', '기회 놓침'], meaning: '계획만 세우고 실천이 뒤따르지 않아 흐름을 놓치기 쉽습니다.' },
      { keywords: ['나태함', '고집', '정체'], meaning: '움직여야 할 때 움직이지 않거나 융통성이 떨어져 막혀 있습니다.' },
      { keywords: ['자기방치', '물질 집착', '불안'], meaning: '스스로를 돌보지 못하고 현실적인 걱정이나 집착에 매여 있습니다.' },
      { keywords: ['탐욕', '독선', '현실 감각 상실'], meaning: '결과나 물질에 집착해 주변을 돌아보지 못할 위험이 있습니다.' },
    ],
  },
];

const rankMeta: Array<{
  rankEn: string;
  rankKo: string;
  fileNum: string;
}> = [
  { rankEn: 'Ace', rankKo: '에이스', fileNum: '01' },
  { rankEn: 'Two', rankKo: '2', fileNum: '02' },
  { rankEn: 'Three', rankKo: '3', fileNum: '03' },
  { rankEn: 'Four', rankKo: '4', fileNum: '04' },
  { rankEn: 'Five', rankKo: '5', fileNum: '05' },
  { rankEn: 'Six', rankKo: '6', fileNum: '06' },
  { rankEn: 'Seven', rankKo: '7', fileNum: '07' },
  { rankEn: 'Eight', rankKo: '8', fileNum: '08' },
  { rankEn: 'Nine', rankKo: '9', fileNum: '09' },
  { rankEn: 'Ten', rankKo: '10', fileNum: '10' },
  { rankEn: 'Page', rankKo: '페이지', fileNum: '11' },
  { rankEn: 'Knight', rankKo: '기사', fileNum: '12' },
  { rankEn: 'Queen', rankKo: '여왕', fileNum: '13' },
  { rankEn: 'King', rankKo: '왕', fileNum: '14' },
];

export const tarotCards: TarotCard[] = [
  ...majorArcana.map((card) => {
    const paddedNum = String(card.number).padStart(2, '0');
    return {
      id: card.name.toLowerCase().replace(/\s+/g, '-'),
      number: card.number,
      name: card.name,
      nameKo: card.nameKo,
      arcana: 'major' as const,
      image: card.image || `/cards/major-${paddedNum}.png`,
      keywords: card.upright.keywords,
      upright: card.upright,
      reversed: card.reversed,
    };
  }),
  ...suits.flatMap(({ suit, suitKo, element, uprightList, reversedList }) =>
    rankMeta.map(({ rankEn, rankKo, fileNum }, rankIndex) => {
      const uprightKeywords = [...uprightList[rankIndex].keywords, element];
      const reversedKeywords = [...reversedList[rankIndex].keywords, element];

      return {
        id: `${rankEn.toLowerCase()}-${suit}`,
        number: rankIndex + 1,
        name: `${rankEn} of ${suit.charAt(0).toUpperCase()}${suit.slice(1)}`,
        nameKo: `${suitKo} ${rankKo}`,
        arcana: 'minor' as const,
        suit,
        image: `/cards/${suit}-${fileNum}.png`,
        keywords: uprightKeywords,
        upright: {
          keywords: uprightKeywords,
          meaning: uprightList[rankIndex].meaning,
        },
        reversed: {
          keywords: reversedKeywords,
          meaning: reversedList[rankIndex].meaning,
        },
      };
    })
  ),
];
