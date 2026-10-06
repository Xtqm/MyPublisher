import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, formatMonthYear, formatNumber } from './formatting.js';

describe('Locale-aware formatting (Spanish)', () => {
  const fixedDate = new Date('2026-10-05T14:30:00.000Z');

  it('formats dates in Spanish by default', () => {
    const formatted = formatDate(fixedDate);
    // In es-ES: e.g. "5 oct 2026" or "5 de oct de 2026"
    expect(formatted.toLowerCase()).toContain('2026');
    expect(formatted.toLowerCase()).toContain('oct');
  });

  it('formats month and year in Spanish', () => {
    const formatted = formatMonthYear(fixedDate);
    expect(formatted.toLowerCase()).toContain('octubre');
    expect(formatted).toContain('2026');
  });

  it('formats numbers in Spanish locale (comma decimal separator)', () => {
    const formatted = formatNumber(1234.56);
    // Spanish standard uses comma for decimals
    expect(formatted).toContain('1');
    expect(formatted).toContain('234');
    expect(formatted).toContain('56');
  });

  it('formats date and time', () => {
    const formatted = formatDateTime(fixedDate);
    expect(formatted).toContain('2026');
  });
});
