export type SajuGender = 'male' | 'female';
export type SajuCalendar = 'solar' | 'lunar';

export interface SajuInput {
  name: string;
  gender: SajuGender;
  calendar: SajuCalendar;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour?: number; // 모를 경우 선택 안 함
}
