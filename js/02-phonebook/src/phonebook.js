'use strict';

/**
 * Если вы решили сделать дополнительное задание и реализовали функцию importFromDsv,
 * то выставьте значение переменной isExtraTaskSolved в true.
 */
const isExtraTaskSolved = true;

/**
 * Телефонная книга
 */
const phoneBook = {};

function isString(str) {
  return typeof str === 'string';
}

function checkInput(phone, name, email) {
  return (
    isString(phone) &&
    isString(name) &&
    name.length > 0 &&
    (email === undefined || isString(email)) &&
    /^\d{10}$/.test(phone)
  );
}

/**
 * Добавление записи в телефонную книгу
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */
function add(phone, name, email) {
  if (!checkInput(phone, name, email) || name === undefined || phone in phoneBook) {
    return false;
  }
  phoneBook[phone] = [name, email];

  return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */
function update(phone, name, email) {
  if (!checkInput(phone, name, email) || !(phone in phoneBook)) {
    return false;
  }
  phoneBook[phone] = [name, email];

  return true;
}

function checkQuery(query, phone, name, email) {
  return (
    query === '*' ||
    phone.includes(query) ||
    name.includes(query) ||
    (email !== undefined && email.includes(query))
  );
}

function phoneFormat(phone) {
  return phone.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4');
}
/**
 * Поиск записей по запросу в телефонной книге
 * @param {string} query
 * @returns {string[]}
 */
function find(query) {
  if (!isString(query)) {
    return [];
  }
  if (query === '') {
    return [];
  }
  const found = [];
  for (const [phone, [name, email]] of Object.entries(phoneBook)) {
    if (checkQuery(query, phone, name, email)) {
      found.push([name, phoneFormat(phone), email].filter(el => el !== undefined).join(', '));
    }
  }

  return found.sort();
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {string} query
 * @returns {number}
 */
function findAndRemove(query) {
  if (!isString(query) || query === '') {
    return 0;
  }
  let cnt = 0;
  for (const [phone, [name, email]] of Object.entries(phoneBook)) {
    if (checkQuery(query, phone, name, email)) {
      delete phoneBook[phone];
      cnt++;
    }
  }

  return cnt;
}

/**
 * Импорт записей из dsv-формата
 * @param {string} dsv
 * @returns {number} Количество добавленных и обновленных записей
 */
function importFromDsv(dsv) {
  if (!isString(dsv)) {
    return 0;
  }
  const info = dsv
    .replace('\r', '')
    .split('\n')
    .map(function(line) {
      return line.split(';');
    });
  let cnt = 0;
  for (const data of info) {
    if (add(data[1], data[0], data[2]) || update(data[1], data[0], data[2])) {
      cnt++;
    }
  }

  return cnt;
}

module.exports = {
  add,
  update,
  find,
  findAndRemove,
  importFromDsv,

  isExtraTaskSolved
};
