import { describe, expect, it } from 'vitest';
import { escapeRegex } from '@/utils/searchUtils';

describe('escapeRegex', () => {
  it('escapa metacaracteres de regex', () => {
    expect(escapeRegex('a.b*c+')).toBe('a\\.b\\*c\\+');
  });

  it('mantém strings sem caracteres especiais inalteradas', () => {
    expect(escapeRegex('graca de Deus')).toBe('graca de Deus');
  });

  it('escapa parênteses, colchetes e chaves', () => {
    expect(escapeRegex('(a)[b]{c}')).toBe('\\(a\\)\\[b\\]\\{c\\}');
  });

  it('escapa âncoras, pipe e barra invertida', () => {
    expect(escapeRegex('^foo|bar$\\')).toBe('\\^foo\\|bar\\$\\\\');
  });

  it('produz um padrão que casa literalmente após escape', () => {
    const raw = 'glorificar a Deus.';
    const re = new RegExp(escapeRegex(raw));
    expect(re.test(`...${raw}..`)).toBe(true);
  });

  it('retorna string vazia para entrada vazia', () => {
    expect(escapeRegex('')).toBe('');
  });
});
