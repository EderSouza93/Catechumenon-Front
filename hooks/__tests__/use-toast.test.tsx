import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { reducer, toast, useToast } from '@/hooks/use-toast';

describe('reducer', () => {
  const baseToast = { id: '1', open: true, title: 'A' };

  it('ADD_TOAST adiciona respeitando o limite (1)', () => {
    const state = reducer({ toasts: [] }, { type: 'ADD_TOAST', toast: baseToast });
    expect(state.toasts).toHaveLength(1);
    const next = reducer(state, { type: 'ADD_TOAST', toast: { ...baseToast, id: '2' } });
    expect(next.toasts).toHaveLength(1);
    expect(next.toasts[0].id).toBe('2');
  });

  it('UPDATE_TOAST mescla campos no toast existente', () => {
    const state = reducer(
      { toasts: [baseToast] },
      { type: 'UPDATE_TOAST', toast: { id: '1', title: 'B' } },
    );
    expect(state.toasts[0].title).toBe('B');
  });

  it('DISMISS_TOAST marca open=false do toast indicado', () => {
    const state = reducer(
      { toasts: [baseToast] },
      { type: 'DISMISS_TOAST', toastId: '1' },
    );
    expect(state.toasts[0].open).toBe(false);
  });

  it('DISMISS_TOAST sem id desmonta todos', () => {
    const initial = { toasts: [baseToast, { id: '2', open: true }] };
    const state = reducer(initial, { type: 'DISMISS_TOAST' });
    expect(state.toasts.every((t) => t.open === false)).toBe(true);
  });

  it('REMOVE_TOAST sem id limpa a lista', () => {
    const state = reducer(
      { toasts: [baseToast] },
      { type: 'REMOVE_TOAST', toastId: undefined },
    );
    expect(state.toasts).toEqual([]);
  });

  it('REMOVE_TOAST por id remove apenas aquele', () => {
    const state = reducer(
      { toasts: [baseToast, { id: '2', open: true }] },
      { type: 'REMOVE_TOAST', toastId: '1' },
    );
    expect(state.toasts.map((t) => t.id)).toEqual(['2']);
  });
});

describe('useToast hook', () => {
  it('toast() adiciona um toast no estado compartilhado', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      toast({ title: 'Olá' });
    });
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Olá');
  });

  it('dismiss(id) marca open=false', () => {
    const { result } = renderHook(() => useToast());
    let id = '';
    act(() => {
      id = toast({ title: 'X' }).id;
    });
    act(() => result.current.dismiss(id));
    expect(result.current.toasts[0].open).toBe(false);
  });
});
