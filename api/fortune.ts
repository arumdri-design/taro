import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 허용 (필요한 경우)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server API Key not configured' });
  }

  try {
    const { type, payload, reader } = req.body;
    // type: 'tarot' 또는 'saju'
    // payload: 타로 카드 정보 또는 사주 입력 정보
    // reader: 점술가 페르소나 정보

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'tarot') {
      const { question, cards } = payload;
      const cardDescriptions = cards
        .map((c: any, idx: number) => {
          const dir = c.reversed ? '역방향' : '정방향';
          const meaning = c.reversed ? c.card.reversed.meaning : c.card.upright.meaning;
          return `${idx + 1}번째 카드: ${c.card.nameKo} (${c.card.nameEn}) - ${dir} / 핵심의미: ${meaning}`;
        })
        .join('\n');

      systemPrompt = `당신은 '${reader.name}'(${reader.nameEn})이라는 이름의 타로 점술가입니다. 성격 및 말투: ${reader.personality}`;
      userPrompt = `내담자의 고민: "${question}"\n\n뽑힌 3장의 카드:\n${cardDescriptions}\n\n위 페르소나와 말투를 유지하여 따뜻하고 깊이 있는 타로 해석을 들려주세요. 반드시 아래의 대괄호 소제목 형식을 포함해 주세요:\n[카드가 보여주는 현재의 흐름]\n[카드별 세부 해석]\n[${reader.name}의 조언]`;
    } else if (type === 'saju') {
      const { name, gender, birthYear, birthMonth, birthDay, birthHour, calendar } = payload;
      const genderText = gender === 'male' ? '남성' : '여성';
      const calText = calendar === 'solar' ? '양력' : '음력';
      const hourText = birthHour !== undefined ? `${birthHour}시` : '태어난 시간 모름';

      systemPrompt = `당신은 '${reader.name}'(${reader.nameEn})이라는 이름의 사주 명리학 및 운세 전문가입니다. 성격 및 말투: ${reader.personality}`;
      userPrompt = `내담자 정보:\n- 이름: ${name}\n- 성별: ${genderText}\n- 생년월일: ${birthYear}년 ${birthMonth}월 ${birthDay}일 (${calText})\n- 태어난 시간: ${hourText}\n\n사주 명식의 오행과 기운, 성격적 강점, 올해의 운세 흐름을 다정하고 통찰력 있게 풀이해 주세요. 반드시 아래의 대괄호 소제목 형식을 포함해 주세요:\n[${name}님의 타고난 사주 기운]\n[올해의 운세와 흐름]\n[재물·연애·직업운 조언]\n[${reader.name}의 개운 메시지]`;
    } else {
      return res.status(400).json({ error: 'Invalid request type' });
    }

    // OpenAI API 호출 (gpt-4o-mini)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API Error');
    }

    const resultText = data.choices[0].message.content.trim();
    return res.status(200).json({ result: resultText });
  } catch (err: any) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
