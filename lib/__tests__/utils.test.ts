import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('combina múltiplas classes em uma única string', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('ignora valores falsy', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('aplica twMerge resolvendo conflitos do Tailwind', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-sm text-red-500', 'text-lg')).toBe('text-red-500 text-lg');
  });

  it('aceita arrays e objetos no estilo clsx', () => {
    expect(cn(['a', 'b'], { c: true, d: false })).toBe('a b c');
  });
});
