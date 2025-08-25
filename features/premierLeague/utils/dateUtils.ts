import { format, isSaturday, isSunday, nextSaturday } from 'date-fns';

/**
 * Get the date for the upcoming weekend (Saturday), or today's date if it's already the weekend.
 * @returns {string} Formatted date string "yyyy-MM-dd"
 */
export function getWeekendDate(): string {
  const today = new Date();

  if (isSaturday(today) || isSunday(today)) {
    // If today is Sat/Sun, return today's date
    return format(today, 'yyyy-MM-dd');
  }

  // Otherwise, return the next Saturday
  const nextSat = nextSaturday(today);
  return format(nextSat, 'yyyy-MM-dd');
}
