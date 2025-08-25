// src/utils/dateUtils.ts
import { format } from "date-fns";

/**
 * Combines a date string and a time string into a single Date object.
 * @param date - The date string (e.g., "2025-03-08").
 * @param time - The time string (e.g., "17:30:00").
 * @returns A Date object representing the combined date and time.
 */
export const getFullDateTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}`);
};

/**
 * Formats a full date-time string into a readable date format.
 * @param date - The date string (e.g., "2025-03-08").
 * @param time - The time string (e.g., "17:30:00").
 * @param dateFormat - The desired date format (e.g., "MMM d, yyyy").
 * @returns A formatted date string.
 */
export const formatDateTime = (
  date: string,
  time: string,
  dateFormat: string
): string => {
  const fullDateTime = getFullDateTime(date, time);
  return format(fullDateTime, dateFormat);
};