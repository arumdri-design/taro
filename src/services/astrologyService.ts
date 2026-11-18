import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Reader } from '@/data/readers';
import type { SajuInput } from '@/data/sajuTypes';

export async function getSajuReading(
  input: SajuInput,
  reader: Reader,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error('Gemini API 키가 필요합니다.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const genderText = input.gender === 'male' ? '남성' : '여성';
  const calendarText = input.calendar === 'solar' ? '양력' : '음력';
  const hourText = input.birthHour !== undefined ? `${input.birthHour}시 경` : '시간 미상';

  const prompt = `
당신은 깊은 통찰력과 신비로운 지혜를 지닌 전문 점성술사이자 명리학자이며, 밤하늘 타로 상담소의 파트너 ${reader.name}(${reader.nameEn})입니다.
아래 내담자의 사주 명식 및 생년월일시 정보를 바탕으로 정성스럽고 깊이 있는 사주팔자·점성술 운세 풀이를 작성해 주세요.

[내담자 정보]
- 이름(또는 닉네임): ${input.name}
- 성별: ${genderText}
- 생년월일: ${input.birthYear}년 ${input.birthMonth}월 ${input.birthDay}일 (${calendarText})
- 태어난 시간: ${hourText}
- 전담 상담가: ${reader.name} (${reader.trait})

[작성 가이드라인]
1. 상담가 고유의 말투와 신비롭고 따뜻한 분위기를 담아 신뢰감 있게 작성해 주세요.
2. 대괄호 형식의 소제목(예: [타고난 천성과 기운], [올해의 운세 흐름], [재물과 성공의 길], [인연과 인간관계], [상담가의 따뜻한 조언])을 포함하여 가독성 있게 구성해 주세요.
3. 명리학적·점성술적 통찰을 일상에서 실천할 수 있는 지혜로운 조언과 함께 풀어주세요.
4. 마크다운 형식으로 풍부하고 몰입감 있게 작성해 주세요.
`.trim();

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  if (!text) {
    throw new Error('AI로부터 운세 응답을 생성하지 못했어요.');
  }
  
  return text;
}
