import { describe, it, expect, vi } from 'vitest';
import { unique, groupBy, chunk, deepClone, memoize, counter } from '../src/functions.js';

describe('unique', () => {
  it('убирает повторяющиеся значения', () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it('пустой массив на входе даёт пустой массив (edge case)', () => {
    expect(unique([])).toEqual([]);
  });

  it('бросает ошибку при неправильном типе (edge case)', () => {
    expect(() => unique('не массив')).toThrow(TypeError);
  });
});

describe('groupBy', () => {
  it('группирует объекты по вычисляемому ключу', () => {
    const users = [
      { name: 'Айгерим', role: 'admin' },
      { name: 'Нурлан', role: 'user' },
      { name: 'Дана', role: 'admin' },
    ];
    const grouped = groupBy(users, (u) => u.role);
    expect(grouped.admin).toHaveLength(2);
    expect(grouped.user).toHaveLength(1);
  });

  it('пустой массив даёт пустой объект (edge case)', () => {
    expect(groupBy([], (x) => x)).toEqual({});
  });
});

describe('chunk', () => {
  it('режет массив на части заданного размера', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('если size больше длины массива — один кусок', () => {
    expect(chunk([1, 2], 10)).toEqual([[1, 2]]);
  });

  it('бросает ошибку при size === 0 (edge case)', () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow(RangeError);
  });
});

describe('deepClone', () => {
  it('создаёт независимую копию вложенной структуры', () => {
    const original = { a: 1, nested: { b: [1, 2, { c: 3 }] } };
    const clone = deepClone(original);
    clone.nested.b[2].c = 999;
    expect(original.nested.b[2].c).toBe(3);
    expect(clone).not.toBe(original);
  });

  it('примитивы возвращаются как есть (edge case)', () => {
    expect(deepClone(5)).toBe(5);
    expect(deepClone(null)).toBe(null);
  });
});

describe('memoize', () => {
  it('вызывает оригинальную функцию один раз на одинаковые аргументы', () => {
    const spy = vi.fn((x) => x * 2);
    const memoized = memoize(spy);
    expect(memoized(4)).toBe(8);
    expect(memoized(4)).toBe(8);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('ноль тоже нормально кэшируется (edge case)', () => {
    const spy = vi.fn((x) => x + 1);
    const memoized = memoize(spy);
    memoized(0);
    memoized(0);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('counter', () => {
  it('inc/dec работают и каждый counter() независим (замыкание)', () => {
    const a = counter();
    const b = counter(10);
    a.inc();
    a.inc();
    b.dec();
    expect(a.value()).toBe(2);
    expect(b.value()).toBe(9);
  });
});
