export type SajuGender = 'male' | 'female';
export type SajuCalendar = 'kai' | 'lunar';

export interface SajuInput {
  name: string;
  gender: SajuGender;
  calendar: SajuCalendar;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour?: number;
}
