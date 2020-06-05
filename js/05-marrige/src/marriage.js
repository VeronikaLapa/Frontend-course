'use strict';

const friendsComparator = (first, second) => first.name.localeCompare(second.name);
/**
 * @typedef {Object} Friend
 * @property {string} name Имя
 * @property {'male' | 'female'} gender Пол
 * @property {boolean} best Лучший ли друг?
 * @property {string[]} friends Список имён друзей
 */

/**
 * Итератор по друзьям
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 */
function Iterator(friends, filter, maxLevel = Infinity) {
  if (!(filter instanceof Filter)) {
    throw new TypeError('Second argument should be a Filter');
  }

  this.index = 0;
  let levelCount = maxLevel;
  const usedFriends = new Set();
  const guests = [];
  let currentLevelGuests = friends.filter(friend => friend.best).sort(friendsComparator);
  while (currentLevelGuests.length > 0 && levelCount > 0) {
    levelCount--;
    currentLevelGuests.forEach(friend => usedFriends.add(friend.name));
    guests.push(...currentLevelGuests);
    const nextLevelGuestsNames = currentLevelGuests
      .reduce((a, b) => a.concat(b.friends), [])
      .filter(name => !usedFriends.has(name));
    currentLevelGuests = friends
      .filter(friend => nextLevelGuestsNames.includes(friend.name))
      .sort(friendsComparator);
  }
  this.invited = guests.filter(filter.test);
}
Iterator.prototype.done = function() {
  return this.index >= this.invited.length;
};
Iterator.prototype.next = function() {
  return this.done() ? null : this.invited[this.index++];
};
/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 * @param {Number} maxLevel Максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
  Iterator.call(this, friends, filter, maxLevel);
}
LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
  this.test = () => true;
}

/**
 * Фильтр друзей-парней
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
  const maleFilter = Object.create(Filter.prototype);
  maleFilter.test = friend => friend.gender === 'male';

  return maleFilter;
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
  const femaleFilter = Object.create(Filter.prototype);
  femaleFilter.test = friend => friend.gender === 'female';

  return femaleFilter;
}

module.exports = {
  Iterator,
  LimitedIterator,
  Filter,
  MaleFilter,
  FemaleFilter
};
