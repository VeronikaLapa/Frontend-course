'use strict';
let data;
const SUGGEST_COUNT = 6;
const DEBOUNCE_WAIT = 300;
fetch('airports.json')
  .then(response => response.json())
  .then(res => {
    data = Object.values(res).filter(x => x.iata !== '');
  });
let currentFocus = -1;

function debounce(func, wait, immediate) {
  let timeout;

  return function(...args) {
    const context = this;
    const later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

function deleteAllSuggests() {
  document.getElementById('suggests').innerHTML = '';
}

function getSuggests(text) {
  const resInclude = [];
  const resStarts = [];
  data.forEach(x => {
    if (resStarts.length < SUGGEST_COUNT) {
      if (
        (x.iata !== null && x.iata.toLowerCase().startsWith(text)) ||
        (x.city !== null && x.city.toLowerCase().startsWith(text)) ||
        (x.name !== null && x.name.toLowerCase().startsWith(text))
      ) {
        resStarts.push(x);
      }
      if (
        (x.city !== null && x.city.toLowerCase().includes(text, 1)) ||
        (x.name !== null && x.name.toLowerCase().includes(text, 1))
      ) {
        resInclude.push(x);
      }
    }
  });

  return [...resStarts, ...resInclude];
}

function createField(field, text) {
  if (field.toLowerCase().includes(text)) {
    const start = field.toLowerCase().indexOf(text);
    const end = start + text.length;
    field = [
      field.slice(0, start),
      '<span class="found">',
      field.slice(start, end),
      '</span>',
      field.slice(end)
    ].join('');
  }

  return field;
}

function addSuggests(suggests, text) {
  const search = document.getElementById('airportInput');
  const list = document.getElementById('suggests');
  for (const suggest of suggests) {
    const newItem = document.createElement('div');
    newItem.className = 'line';
    const iata = createField(suggest.iata, text);
    const name = createField(suggest.name, text);
    const city = createField(suggest.city, text);

    newItem.innerHTML = `${iata}, ${name}, ${city}`;
    list.appendChild(newItem);
    newItem.addEventListener('click', e => {
      search.value = e.target.textContent;
      deleteAllSuggests();
    });
  }
}

const findSuggests = debounce(() => {
  deleteAllSuggests();
  currentFocus = -1;
  const search = document.getElementById('airportInput');
  const text = search.value.toLowerCase();
  const suggests = getSuggests(text);
  addSuggests(suggests, text);
}, DEBOUNCE_WAIT);

function handleArrowDown() {
  const suggests = document.getElementsByClassName('line');
  if (currentFocus !== -1) {
    suggests[currentFocus].classList.remove('line_checked');
  }
  currentFocus = (currentFocus + 1) % suggests.length;
  suggests[currentFocus].classList.add('line_checked');
}

function handleArrowUp() {
  const suggests = document.getElementsByClassName('line');
  if (currentFocus !== -1) {
    suggests[currentFocus].classList.remove('line_checked');
  }
  currentFocus = currentFocus - 1;
  if (currentFocus < 0) {
    currentFocus = suggests.length - 1;
  }
  suggests[currentFocus].classList.add('line_checked');
}

function handleEnter(e) {
  const suggests = document.getElementsByClassName('line');
  e.preventDefault();
  suggests[currentFocus].click();
}

function onKeydownFun(e) {
  const suggests = document.getElementsByClassName('line');
  if (e.key === 'ArrowDown') {
    handleArrowDown();
  } else if (e.key === 'ArrowUp') {
    handleArrowUp();
  } else if (e.key === 'Enter') {
    handleEnter(e);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('airportInput');
  searchInput.addEventListener('input', findSuggests);
  searchInput.addEventListener('keydown', onKeydownFun);
});
