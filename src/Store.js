// src/Store.js
// Часть 2 задания: класс с приватными полями, геттером, статическим
// методом и наследником, который переопределяет один метод через super.

export class Store {
  #items; // приватное поле — доступно только внутри этого класса
  #idKey;

  constructor(items = [], idKey = 'id') {
    this.#items = [...items];
    this.#idKey = idKey;
  }

  /** Добавляет элемент, возвращает this для чейнинга. */
  add(item) {
    this.#items.push(item);
    return this;
  }

  /** Удаляет элемент по значению ключа idKey. */
  remove(id) {
    this.#items = this.#items.filter((item) => item[this.#idKey] !== id);
    return this;
  }

  /** Находит первый элемент с совпадающим id. */
  find(id) {
    return this.#items.find((item) => item[this.#idKey] === id);
  }

  /** Геттер: количество элементов в хранилище. */
  get total() {
    return this.#items.length;
  }

  /** Геттер: копия внутреннего массива (чтобы не отдавать сам #items). */
  get items() {
    return [...this.#items];
  }

  /** Статический метод — фабрика, создающая Store из готового массива. */
  static from(items = [], idKey = 'id') {
    return new Store(items, idKey);
  }
}

/**
 * SortedStore — наследник Store.
 * Переопределяет геттер items: возвращает элементы отсортированными
 * с помощью переданной compareFn, при этом переиспользует родительскую
 * логику через super.items вместо того, чтобы дублировать код.
 */
export class SortedStore extends Store {
  #compareFn;

  constructor(items = [], compareFn = (a, b) => (a.id ?? a) - (b.id ?? b), idKey = 'id') {
    super(items, idKey);
    this.#compareFn = compareFn;
  }

  // Переопределённый метод (геттер) — показывает super
  get items() {
    return super.items.sort(this.#compareFn);
  }
}
