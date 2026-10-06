import { describe, it, expect } from 'vitest';
import i18n from './lib/i18n.js';

describe('Web App i18n and Configuration', () => {
  it('loads Spanish as default language with expected translations', () => {
    expect(i18n.language).toBe('es');
    expect(i18n.t('app.name')).toBe('MyPublisher');
    expect(i18n.t('nav.home')).toBe('Inicio');
    expect(i18n.t('nav.reports')).toBe('Informes');
    expect(i18n.t('nav.schedules')).toBe('Programas');
    expect(i18n.t('nav.publishers')).toBe('Publicadores');
    expect(i18n.t('health.title')).toBe('Estado del sistema');
  });
});
