import { getCardMarkup } from './js/templates';

const refs = {
  form: document.querySelector('form.header__form'),
  gallery: document.querySelector('.movies-gallery'),
  loadMoreBtn: document.querySelector('.js-load-more-btn'),
};

const KEY = '21a38995d1a0d82c48e261b573f88f7b';
const BASE_URL = 'https://api.themoviedb.org/3';

let items = [];
let page = 1;
let query = '';
let currentResult = 0;
let totalResults = 0;
let searchByQuery = false;

const reset = () => {
  page = 1;
  query = '';
  currentResult = 0;
  totalResults = 0;
  items = [];
  refs.loadMoreBtn.classList.remove('hidden');
};
const hideButton = () => {
  refs.loadMoreBtn.classList.add('hidden');
};
const loadTrendingMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/trending/movie/day?api_key=${KEY}&page=${page}`
  );
  const data = await res.json();
  console.log(data);
  items = [...items, ...data.results];
};

const loadMoviesByQuery = async () => {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${KEY}&query=${query}&page=${page}`
  );
  const data = await res.json();
  currentResult += data.results.length;
  totalResults = data.total_results;
  if (currentResult === totalResults) {
    hideButton();
  }
  items = [...items, ...data.results];
};

const renderItems = () => {
  const markup = items.map(getCardMarkup).join('\n');
  refs.gallery.innerHTML = markup;
};

const onFormSubmit = e => {
  e.preventDefault();
  reset();
  searchByQuery = true;
  query = e.currentTarget.elements.query.value;
  if (query) {
    onLoadMore();
  }
};

const onLoadMore = async () => {
  if (searchByQuery) {
    await loadMoviesByQuery();

    page += 1;
  } else {
    page += 1;
    await loadTrendingMovies();
  }
  renderItems();
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

loadTrendingMovies().then(renderItems);
