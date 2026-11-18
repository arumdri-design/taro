import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Reader } from '@/data/readers';
import type { SajuInput } from '@/data/sajuTypes';

export async function getSajuReading(
  input: SajuInput,
  reader: Reader,
  apiKey: string
):- Promise<string> {
  if (!apiKey) {
    throw new Error('Gemini API 키가 필요합니다.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const hourText = input.birthHour !== undefined ? `${input.birthHour}시` : '시간 미상';
  const calendarText = input.calendar === 'solar' ? '양력' : '음력';
  const genderText = input.gender === 'male' ? '남성' : '여성';

  const prompt = `
당신은 깊은 통찰력을 지닌 신비로운 사주 명리 및 운세 전문가이자, 밤하늘 타로 상담소의 파트너 ${reader.name}(${reader.nameEn})입니다.
아래 내담자의 사주 정보를 바탕으로 정성스럽고 깊이 있는 사주풀이(총운, 성향, 올해의 운세, 조언)를 작성해 주세요.

[내담자 사주 정보]
- 성별: ${genderText}
- 생년월일: ${input.birthYear}년 ${input.birthMonth}월 ${input.birthDay}일 (${calendarText})
- 태어난 시간: ${hourText}
- 담당 상담가: ${reader.name} (${reader.trait})

[작성 지침]
1. 상담가의 고유한 말투와 분위기를 살려 신뢰감 있고 따뜻하게 작성해 주세요.
2. 대괄호 형식(예: [총운과 기운], [타고난 성향과 본질], [올해의 흐름과 조언])으로 섹션을 나누어 가독성 있게 구성해 주세요.
3. 사주 명리학적 해석을 현대적인 삶의 지혜와 조화롭게 풀어주세요.
4. 마크다운 형식으로 풍부하고 몰입감 있게 작성해 주세요.
`.trim();

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (!text) throw new Error('응답을 생성하지 못했어요.');
    return text;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : '사주 해석 중 오류가 발생했어요.');
  }
}
