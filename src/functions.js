// src/functions.js
// Набор чистых функций: часть 1 задания.
// Используются деструктуризация, spread и функции высшего порядка
// (map / filter / reduce) там, где это уместно.

/**
 * Возвращает массив без повторяющихся значений.
 * @param {Array} arr
 * @returns {Array}
 */
export function unique(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('unique: аргумент должен быть массивом');
  }
  // Set сам по себе не хранит дубликаты, spread превращает его обратно в массив
  return [...new Set(arr)];
}

/**
 * Группирует элементы массива по ключу, вычисляемому функцией keyFn.
 * @param {Array} arr
 * @param {(item: any) => string|number} keyFn
 * @returns {Object<string, Array>}
 */
export function groupBy(arr, keyFn) {
  if (!Array.isArray(arr)) {
    throw new TypeError('groupBy: первый аргумент должен быть массивом');
  }
  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    // Деструктуризация с default-значением: берём уже накопленную
    // группу по этому ключу, либо пустой массив, если её ещё не было
    const { [key]: existing = [] } = groups;
    return { ...groups, [key]: [...existing, item] };
  }, {});
}

/**
 * Разбивает массив на подмассивы фиксированного размера.
 * @param {Array} arr
 * @param {number} size
 * @returns {Array<Array>}
 */
export function chunk(arr, size) {
  if (!Array.isArray(arr)) {
    throw new TypeError('chunk: первый аргумент должен быть массивом');
  }
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError('chunk: size должен быть положительным целым числом');
  }
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Глубокая копия объекта/массива без JSON.parse(JSON.stringify()).
 * Работает рекурсивно, отдельно обрабатывает Date.
 * @param {*} value
 * @returns {*}
 */
export function deepClone(value) {
  if (value === null || typeof value !== 'object') {
    return value; // примитивы копировать не нужно
  }
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  const clonedEntries = Object.entries(value).map(([key, val]) => [
    key,
    deepClone(val),
  ]);
  return Object.fromEntries(clonedEntries);
}

/**
 * Кэширует результаты вызовов fn по набору аргументов.
 * Кэш живёт в замыкании и недоступен снаружи напрямую.
 * @param {Function} fn
 * @returns {Function}
 */
export function memoize(fn) {
  const cache = new Map(); // приватное состояние, видно только внутри замыкания

  return function memoized(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Фабрика счётчика. Каждый вызов counter() создаёт свою независимую
 * переменную count, "спрятанную" в замыкании.
 * @param {number} [start=0]
 * @returns {{ inc: Function, dec: Function, value: Function }}
 */
export function counter(start = 0) {
  let count = start;

  return {
    inc: (step = 1) => (count += step),
    dec: (step = 1) => (count -= step),
    value: () => count,
  };
}
