import { getCardMarkup } from './js/templates';

const refs = {
  form: document.querySelector('form.header__form'),
  gallery: document.querySelector('.movies-gallery'),
};

const KEY = '21a38995d1a0d82c48e261b573f88f7b';
const BASE_URL = 'https://api.themoviedb.org/3';

const items = [];

const render = () => {
  const markup = items.map(getCardMarkup).join('\n');
  console.log(markup);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
};

fetch(`${BASE_URL}/trending/movie/day?api_key=${KEY}`)
  .then(res => res.json())
  .then(({ results }) => items.push(...results))
  .then(() => {
    console.log(items);
    render();
  });
