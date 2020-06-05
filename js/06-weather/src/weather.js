'use strict';

global.fetch = require('node-fetch');

/**
 * @typedef {object} TripItem Город, который является частью маршрута.
 * @property {number} geoid Идентификатор города
 * @property {number} day Порядковое число дня маршрута
 */

const URL = 'https://api.weather.yandex.ru/v1/forecast?&limit=7&hours=false&geoid=';

function getWeatherType(weather) {
  if (weather === 'clear' || weather === 'partly-cloudy') {
    return 'sunny';
  }
  if (weather === 'cloudy' || weather === 'overcast') {
    return 'cloudy';
  }

  return 'unknown';
}
async function getWeather(geoid) {
  const response = await global
    .fetch(`${URL}${geoid}`, { method: 'get' })
    .then(res => res.json())
    .catch(console.error);

  return {
    weather: response.forecasts.map(date => getWeatherType(date.parts.day_short.condition)),
    geoid: geoid
  };
}

class TripBuilder {
  constructor(geoIds) {
    this.geoIds = geoIds;
    this.maxDays = 7;
    this.way = [];
  }
  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества солнечных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `clear`;
   * * `partly-cloudy`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  sunny(daysCount) {
    for (let i = 0; i < daysCount; ++i) {
      this.way.push('sunny');
    }

    return this;
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества пасмурных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `cloudy`;
   * * `overcast`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  cloudy(daysCount) {
    for (let i = 0; i < daysCount; ++i) {
      this.way.push('cloudy');
    }

    return this;
  }

  /**
   * Метод, добавляющий условие максимального количества дней.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  max(daysCount) {
    this.maxDays = daysCount;

    return this;
  }
  tripBuilder(weatherData, day, visitCounter, currentTrip) {
    if (day === this.way.length) {
      return currentTrip;
    }
    const wantedWeather = this.way[day];
    let goodWeatherIds = weatherData
      .filter(description => description.weather[day] === wantedWeather)
      .map(description => description.geoid);
    //    .filter(description => description[0] in visitCounter && visitCounter[description[0]] < this.maxDays);
    const lastId = day === 0 ? null : currentTrip[day - 1];
    if (lastId !== null && goodWeatherIds.includes(lastId) && visitCounter[lastId] < this.maxDays) {
      const newTrip = currentTrip;
      newTrip.push({ geoid: lastId, day: day + 1 });

      visitCounter[lastId] += 1;
      const fullTrip = this.tripBuilder(weatherData, day + 1, visitCounter, newTrip);
      if (fullTrip) {
        return fullTrip;
      }
      visitCounter[lastId] -= 1;
    }
    goodWeatherIds = goodWeatherIds.filter(geoid => visitCounter[geoid] === 0);
    for (const geoid of goodWeatherIds) {
      const newTrip = currentTrip;
      newTrip.push({ geoid: geoid, day: day + 1 });

      visitCounter[geoid] += 1;
      const fullTrip = this.tripBuilder(weatherData, day + 1, visitCounter, newTrip);
      if (fullTrip) {
        return fullTrip;
      }
      visitCounter[geoid] -= 1;
    }

    return null;
  }

  /**
   * Метод, возвращающий Promise с планируемым маршрутом.
   * @returns {Promise<TripItem[]>} Список городов маршрута
   */
  async build() {
    const weatherData = await Promise.all(this.geoIds.map(geoid => getWeather(geoid)));
    const visitCounter = {};
    weatherData.forEach(geo => (visitCounter[geo.geoid] = 0));
    const res = this.tripBuilder(weatherData, 0, visitCounter, []);
    if (res) {
      return res;
    }
    throw new Error('Не могу построить маршрут!');
  }
}

/**
 * Фабрика для получения планировщика маршрута.
 * Принимает на вход список идентификаторов городов, а
 * возвращает планировщик маршрута по данным городам.
 *
 * @param {number[]} geoids Список идентификаторов городов
 * @returns {TripBuilder} Объект планировщика маршрута
 * @see https://yandex.ru/dev/xml/doc/dg/reference/regions-docpage/
 */
function planTrip(geoids) {
  return new TripBuilder(geoids);
}

module.exports = {
  planTrip
};
