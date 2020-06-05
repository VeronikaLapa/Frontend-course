'use strict';

/**
 * Сделано дополнительное задание: реализованы методы several и through.
 */
const isExtraTaskSolved = true;

/**
 * Получение нового Emitter'а
 * @returns {Object}
 */
function getEmitter() {
  const events = [];

  function addEvent(event, context, handler, type, value) {
    if (!(event in events)) {
      events[event] = [];
    }
    events[event].push({ context, handler, type, count: 0, value });
  }

  return {
    /**
     * Подписка на событие
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     */
    on: function(event, context, handler) {
      addEvent(event, context, handler, 'norm');

      return this;
    },

    /**
     * Отписка от события
     * @param {string} event
     * @param {Object} context
     */
    off: function(event, context) {
      const foundEvents = Object.keys(events).filter(
        key => key.startsWith(`${event}.`) || key === event
      );
      for (const currentEvent of foundEvents) {
        events[currentEvent] = events[currentEvent].filter(e => e.context !== context);
      }

      return this;
    },

    /**
     * Уведомление о событии
     * @param {string} event
     */
    emit: function(event) {
      while (event !== '') {
        if (event in events) {
          for (const currentEvent of events[event]) {
            if (
              currentEvent.type === 'norm' ||
              (currentEvent.type === 'several' && currentEvent.count < currentEvent.value) ||
              (currentEvent.type === 'through' && currentEvent.count % currentEvent.value === 0)
            ) {
              currentEvent.handler.call(currentEvent.context);
            }
            currentEvent.count++;
          }
        }
        event = event.substr(0, event.lastIndexOf('.'));
      }

      return this;
    },

    /**
     * Подписка на событие с ограничением по количеству отправляемых уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} times Сколько раз отправить уведомление
     */
    several: function(event, context, handler, times) {
      if (times <= 0) {
        addEvent(event, context, handler, 'norm');
      } else {
        addEvent(event, context, handler, 'several', times);
      }

      return this;
    },

    /**
     * Подписка на событие с ограничением по частоте отправки уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} frequency Как часто уведомлять
     */
    through: function(event, context, handler, frequency) {
      if (frequency <= 0) {
        addEvent(event, context, handler, 'norm');
      } else {
        addEvent(event, context, handler, 'through', frequency);
      }

      return this;
    }
  };
}

module.exports = {
  getEmitter,

  isExtraTaskSolved
};
