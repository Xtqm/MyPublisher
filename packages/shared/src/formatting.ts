/**
 * Locale-aware date and number formatting helpers.
 * Default locale is Spanish (es-ES).
 */

export const DEFAULT_LOCALE = 'es-ES';

export function toDate(input: Date | string | number): Date {
  if (input instanceof Date) return input;
  return new Date(input);
}

export function formatDate(
  input: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
  locale = DEFAULT_LOCALE,
): string {
  const date = toDate(input);
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatDateTime(
  input: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' },
  locale = DEFAULT_LOCALE,
): string {
  const date = toDate(input);
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatMonthYear(input: Date | string | number, locale = DEFAULT_LOCALE): string {
  const date = toDate(input);
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
}

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}
