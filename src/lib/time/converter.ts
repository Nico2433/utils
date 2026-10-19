// Average Gregorian year, so 12 months === 1 year
const DAYS_PER_YEAR = 365.25;
const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const MS_PER_WEEK = 7 * MS_PER_DAY;
const MS_PER_MONTH = DAYS_PER_MONTH * MS_PER_DAY;
const MS_PER_YEAR = DAYS_PER_YEAR * MS_PER_DAY;

// *---------- BASIC ----------* //

export const yearsToMonths = (years: number): number => years * 12;

export const monthsToWeeks = (months: number): number =>
  (months * DAYS_PER_MONTH) / 7;

export const weeksToDays = (weeks: number): number => weeks * 7;

export const daysToHours = (days: number): number => days * 24;

export const hoursToMinutes = (hours: number): number => hours * 60;

export const minutesToSeconds = (minutes: number): number => minutes * 60;

export const secondsToMs = (seconds: number): number => seconds * MS_PER_SECOND;

export const yearsToDays = (years: number): number => years * DAYS_PER_YEAR;

// *---------- TO MS ----------* //

export const yearsToMs = (years: number): number => years * MS_PER_YEAR;

export const monthsToMs = (months: number): number => months * MS_PER_MONTH;

export const weeksToMs = (weeks: number): number => weeks * MS_PER_WEEK;

export const daysToMs = (days: number): number => days * MS_PER_DAY;

export const hoursToMs = (hours: number): number => hours * MS_PER_HOUR;

export const minutesToMs = (minutes: number): number => minutes * MS_PER_MINUTE;
