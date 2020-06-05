'use strict';

/**
 * Флаг решения дополнительной задачи
 * @see README.md
 */
const isExtraTaskSolved = true;
const minutesInHour = 60;
const hoursInDay = 24;
const days = { ПН: 0, ВТ: 1, СР: 2, ЧТ: 3, ПТ: 4, СБ: 5, ВС: 6 };
const daysList = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
  let moments = [];

  function parseDate(date) {
    const day = date.substr(0, 2);
    const minutes = toMinutes(date.substr(3));

    return minutes + days[day] * hoursInDay * minutesInHour;
  }

  function insertMoment(moment) {
    const mfrom = moment.from;
    const mto = moment.to;
    const goodMoments = [];
    for (const interval of moments) {
      if (
        !(interval.from >= mfrom && interval.to <= mto) &&
        (interval.to <= mfrom || interval.from >= mto)
      ) {
        goodMoments.push(interval);
      }
      if (interval.from <= mfrom && interval.to > mfrom) {
        goodMoments.push({ from: interval.from, to: mfrom });
      }
      if (interval.from < mto && interval.to > mto) {
        goodMoments.push({ from: mto, to: interval.to });
      }
    }
    moments = goodMoments;
  }

  function toMinutes(date) {
    const hh = Number.parseInt(date.substr(0, 2));
    const mm = Number.parseInt(date.substr(3, 2));
    const tz = Number.parseInt(date.substr(6));

    return (hh - tz) * minutesInHour + mm;
  }

  for (let i = 0; i < 3; ++i) {
    moments.push({
      from: toMinutes(workingHours.from) + i * hoursInDay * minutesInHour,
      to: toMinutes(workingHours.to) + i * hoursInDay * minutesInHour
    });
  }

  for (const sched of Object.values(schedule)) {
    for (const moment of sched) {
      insertMoment({ from: parseDate(moment.from), to: parseDate(moment.to) });
    }
  }

  moments = moments.filter(interval => interval.to - interval.from >= duration);

  return {
    /**
     * Найдено ли время
     * @returns {boolean}
     */
    exists() {
      return moments.length !== 0;
    },

    /**
     * Возвращает отформатированную строку с часами
     * для ограбления во временной зоне банка
     *
     * @param {string} template
     * @returns {string}
     *
     * @example
     * ```js
     * getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
     * ```
     */
    format(template) {
      if (!this.exists()) {
        return '';
      }
      const tz = Number.parseInt(workingHours.from.substr(6));
      let m = moments[0].from + tz * minutesInHour;
      const dd = Math.floor(m / (minutesInHour * hoursInDay));
      m -= dd * (minutesInHour * hoursInDay);
      const hh = Math.floor(m / minutesInHour);
      m -= hh * minutesInHour;
      const mm = m;

      return template
        .replace('%HH', ('0' + hh).slice(-2))
        .replace('%MM', ('0' + mm).slice(-2))
        .replace('%DD', daysList[dd]);
    },

    /**
     * Попробовать найти часы для ограбления позже [*]
     * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
     * @returns {boolean}
     */
    tryLater() {
      if (
        moments.length === 0 ||
        (moments.length === 1 && moments[0].to - (moments[0].from + 30) < duration)
      ) {
        return false;
      }
      if (moments[0].to - (moments[0].from + 30) >= duration) {
        moments[0].from += 30;
      } else {
        moments.shift();
      }

      return true;
    }
  };
}

module.exports = {
  getAppropriateMoment,

  isExtraTaskSolved
};
