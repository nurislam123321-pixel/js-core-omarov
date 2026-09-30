import { describe, it, expect } from 'vitest';
import { Store, SortedStore } from '../src/Store.js';

describe('Store', () => {
  it('add() добавляет элементы, total их считает', () => {
    const store = new Store();
    store.add({ id: 1, name: 'Чай' });
    store.add({ id: 2, name: 'Кофе' });
    expect(store.total).toBe(2);
  });

  it('total === 0 для только что созданного хранилища (edge case)', () => {
    const store = new Store();
    expect(store.total).toBe(0);
  });

  it('find() находит элемент по id', () => {
    const store = new Store([{ id: 1, name: 'Чай' }]);
    expect(store.find(1).name).toBe('Чай');
  });

  it('find() возвращает undefined, если ничего не найдено (edge case)', () => {
    const store = new Store();
    expect(store.find(999)).toBeUndefined();
  });

  it('remove() удаляет элемент по id', () => {
    const store = new Store([{ id: 1 }, { id: 2 }]);
    store.remove(1);
    expect(store.total).toBe(1);
    expect(store.find(1)).toBeUndefined();
  });

  it('статический метод Store.from создаёт готовое хранилище', () => {
    const store = Store.from([{ id: 1 }]);
    expect(store).toBeInstanceOf(Store);
    expect(store.total).toBe(1);
  });

  it('приватное поле #items не торчит наружу', () => {
    const store = new Store([{ id: 1 }]);
    // Обратиться к store['#items'] нельзя — это не то же самое,
    // что настоящее приватное поле, и оно всегда undefined
    expect(store['#items']).toBeUndefined();
  });
});

describe('SortedStore (наследование)', () => {
  it('items() возвращает элементы отсортированными по переданной функции', () => {
    const sorted = new SortedStore(
      [{ id: 3 }, { id: 1 }, { id: 2 }],
      (a, b) => a.id - b.id
    );
    expect(sorted.items.map((i) => i.id)).toEqual([1, 2, 3]);
  });

  it('total и find унаследованы от Store без изменений', () => {
    const sorted = new SortedStore([{ id: 1 }]);
    expect(sorted.total).toBe(1);
    expect(sorted.find(1)).toBeTruthy();
  });
});
