'use strict';

const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const search = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
const cities = [];

// fetch returns a promise
// the data that comes back, but doesnt know what kind of data it is yet
// must convert the raw data into JSON
fetch(endpoint)
// returns another promise
  .then(res => res.json())
  .then(data => cities.push(...data));
// data is an array of 1000 items, so push will push an array of 1000 items into an empty array
// result will be an array within an array 
// to avoid this, use es6's spread to spread into the push method

function findMatches(wordToMatch, citiesArray) {
  return citiesArray.filter(place => {
    // need to figure out if the city or state matches what was searched

    // g is for global, looks through entire string
    // i is for insensitive, matches both upper and lower case
    const regex = new RegExp(wordToMatch, 'gi');
    return place.city.match(regex) || place.state.match(regex);
    // return place.city.includes(wordToMatch) || place.state.includes(wordToMatch);
  });
};

function displayMatches(e) {
  const matchArray = findMatches(e.target.value, cities);
  const matchedElements = matchArray.map(place => {
    // why wont this work unless its an arrow function
    const regex = new RegExp(e.target.value, 'gi');
    const cityName = place.city.replace(regex, `<span class="highlight">${e.target.value}</span>`);
    const stateName = place.state.replace(regex, `<span class="highlight">${e.target.value}</span>`);
    return `
      <li>
        <span class="name">${cityName}, ${stateName}</span>
        <span class="population">${numberWithCommas(place.population)}<span>
      </li>
    `;
  }).join('');
  suggestions.innerHTML = matchedElements;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

search.addEventListener('input', e => e.target.value === '' ? suggestions.innerHTML = `<li>Filter for a City or State</li>` : displayMatches(e)); 