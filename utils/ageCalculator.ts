import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInWeeks,
  addYears,
  setYear,
  isAfter,
  format,
} from 'date-fns';

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthday: string;
  nextBirthdayIn: number;
}

export interface DateDiffResult {
  years: number;
  months: number;
  weeks: number;
  days: number;
  totalDays: number;
}

export const calculateAge = (birthDate: Date): AgeResult => {
  const now = new Date();
  const years = differenceInYears(now, birthDate);
  const afterYears = addYears(birthDate, years);
  const months = differenceInMonths(now, afterYears);
  const afterMonths = new Date(afterYears);
  afterMonths.setMonth(afterMonths.getMonth() + months);
  const days = differenceInDays(now, afterMonths);
  const totalDays = differenceInDays(now, birthDate);

  // Next birthday
  let next = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (!isAfter(next, now)) {
    next = new Date(now.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }
  const nextBirthdayIn = differenceInDays(next, now);
  const nextBirthday = format(next, 'MMMM d, yyyy');

  return { years, months, days, totalDays, nextBirthday, nextBirthdayIn };
};

export const calculateDateDiff = (from: Date, to: Date): DateDiffResult => {
  const start = from < to ? from : to;
  const end = from < to ? to : from;

  const years = differenceInYears(end, start);
  const afterYears = addYears(start, years);
  const months = differenceInMonths(end, afterYears);
  const weeks = differenceInWeeks(end, start);
  const totalDays = differenceInDays(end, start);
  const days = totalDays - weeks * 7;

  return { years, months, weeks, days, totalDays };
};
