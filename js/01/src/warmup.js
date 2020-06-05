'use strict';

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
  if (
    typeof a !== 'number' ||
    typeof b !== 'number' ||
    !Number.isInteger(a) ||
    !Number.isInteger(b)
  ) {
    throw new TypeError(`${a} or ${b} is not an integer Number`);
  }
  return a + b;
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
  if (typeof year !== 'number') {
    throw new TypeError(`${year} is not a Number`);
  }
  if (year <= 0 || !Number.isInteger(year)) {
    throw new RangeError(`${year} should be  > 0`);
  }
  return Math.ceil(year / 100);
}

/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
  if (typeof hexColor !== 'string') {
    throw new TypeError(`${hexColor} is not a string`);
  }
  if (!(/^#[0-9A-Fa-f]{6}$/.test(hexColor) || /^#[0-9A-Fa-f]{3}$/.test(hexColor))) {
    throw new RangeError(`${hexColor} should have '#FFF' or '#FFFFFF' format`);
  }
  let r, g, b;
  if (hexColor.length === 4) {
    r = parseInt(hexColor[1].repeat(2), 16);
    g = parseInt(hexColor[2].repeat(2), 16);
    b = parseInt(hexColor[3].repeat(2), 16);
  } else {
    r = parseInt(hexColor.substr(1, 2), 16);
    g = parseInt(hexColor.substr(3, 2), 16);
    b = parseInt(hexColor.substr(5, 2), 16);
  }
  return `(${r}, ${g}, ${b})`;
}

/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
  if (typeof n !== 'number') {
    throw new TypeError(`${n} is not a Number`);
  }
  if (n <= 0 || !Number.isInteger(n)) {
    throw new RangeError(`${n} should be > 0`);
  }
  let a = 0;
  let b = 1;
  let c = 0;
  for (let i = 0; i < n; ++i) {
    c = a + b;
    a = b;
    b = c;
  }
  return a;
}

/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0 || !matrix.every(Array.isArray)) {
    throw new TypeError('${matrix} is not an array');
  }
  const len = matrix[0].length;
  for (let i = 0; i < matrix.length; ++i) {
    if (len === 0 || matrix[i].length !== len) {
      throw new TypeError('${matrix} is not a matrix');
    }
  }
  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
  if (typeof n !== 'number' || typeof targetNs !== 'number') {
    throw new TypeError(`${n} or ${targetNs} is not a Number`);
  }
  if (targetNs < 2 || targetNs > 36 || !Number.isInteger(targetNs)) {
    throw new RangeError(`${targetNs} should be between 2 ond 36`);
  }
  return n.toString(targetNs);
}

/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
  if (typeof phoneNumber !== 'string') {
    throw new TypeError(`${phoneNumber} is not a string`);
  }
  return /^8-800-\d{3}-\d{2}-\d{2}$/.test(phoneNumber);
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
  if (!(typeof text === 'string' || text instanceof String)) {
    throw new TypeError(`${text} is not a string`);
  }
  return (text.match(/:-\)|\(-:/g) || []).length;
}

/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
  function check(ch) {
    for (let i = 0; i < 3; ++i) {
      if (
        (field[i][0] === ch && field[i][0] === field[i][1] && field[i][1] === field[i][2]) ||
        (field[0][i] === ch && field[0][i] === field[1][i] && field[1][i] === field[2][i])
      ) {
        return true;
      }
    }
    return (
      (field[0][0] === ch && field[0][0] === field[1][1] && field[1][1] === field[2][2]) ||
      (field[0][2] === ch && field[0][2] === field[1][1] && field[1][1] === field[2][0])
    );
  }

  if (!Array.isArray(field) || field.length !== 3) {
    throw new TypeError('${field} is not an array');
  }
  for (let i = 0; i < 3; ++i) {
    if (!Array.isArray(field[i]) || field[i].length !== 3) {
      throw new TypeError('${field} is not an array');
    }
  }
  if (check('x')) {
    return 'x';
  }
  if (check('o')) {
    return 'o';
  }
  return 'draw';
}

module.exports = {
  abProblem,
  centuryByYearProblem,
  colorsProblem,
  fibonacciProblem,
  matrixProblem,
  numberSystemProblem,
  phoneProblem,
  smilesProblem,
  ticTacToeProblem
};
