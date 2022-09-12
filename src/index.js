import { getMoviesMarkup } from './js/templates';
import genres from './js/genres';
import { readMovies, createMovies, updateMovies } from './js/crud';
import { Loader } from './js/loader';
import { Notify } from 'notiflix';

import {
  API_KEY,
  BASE_URL,
  BASE_IMG,
  WATCHED_KEY,
  QUEUE_KEY,
} from './js/constants';

const refs = {
  form: document.querySelector('form.header__form'),
  gallery: document.querySelector('.movies-gallery'),
  loadMoreBtn: document.querySelector('.js-load-more-btn'),
  backdrop: document.querySelector('.backdrop'),
  modalCloseBtn: document.querySelector('button.js-modal-close'),
  watchedBtn: document.querySelector('.js-watched-btn'),
  queueBtn: document.querySelector('.js-queue-btn'),
};

let items = [];
let page = 1;
let query = '';
let currentResult = 0;
let totalResults = 0;
let searchByQuery = false;
const loader = new Loader();

const showButton = () => {
  refs.loadMoreBtn.classList.remove('hidden');
};
const hideButton = () => {
  refs.loadMoreBtn.classList.add('hidden');
};

const showModal = () => {
  refs.backdrop.classList.remove('is-hidden');
};
const hideModal = () => {
  refs.backdrop.classList.add('is-hidden');
};
const showMessage = ({ type, message }) => {
  Notify[type](message);
};
const reset = () => {
  page = 1;
  query = '';
  currentResult = 0;
  totalResults = 0;
  items = [];
  showButton();
};

const loadTrendingMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`
  );
  const data = await res.json();
  currentResult += data.results.length;
  totalResults = data.total_results;
  if (currentResult === totalResults) {
    hideButton();
  }
  items = [...items, ...data.results];
};

const loadMoviesByQuery = async () => {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
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
  const markup = getMoviesMarkup(items);
  refs.gallery.innerHTML = markup;
};

const renderModal = idMovie => {
  const {
    poster_path,
    title,
    vote_average,
    vote_count,
    popularity,
    original_title,
    genre_ids,
    overview,
    id,
  } = items.find(({ id }) => id === Number(idMovie));
  refs.backdrop.querySelector('.js-img').src = poster_path
    ? `${BASE_IMG}${poster_path}`
    : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
  refs.backdrop.querySelector('.js-title').textContent = title;
  refs.backdrop.querySelector('.js-rating').textContent =
    vote_average.toFixed(2);
  refs.backdrop.querySelector('.js-votes').textContent = vote_count;
  refs.backdrop.querySelector('.js-popularity').textContent =
    popularity.toFixed(2);
  refs.backdrop.querySelector('.js-original').textContent = original_title;
  refs.backdrop.querySelector('.js-genre').textContent =
    genre_ids.length !== 0
      ? genre_ids
          .map(idGenre => genres.find(({ id }) => id === idGenre).name)
          .join(', ')
      : 'No information';
  refs.backdrop.querySelector('.js-text').textContent = overview;
  refs.backdrop.querySelector('.js-modal').dataset.id = id;
};

const onFormSubmit = async e => {
  e.preventDefault();
  reset();
  searchByQuery = true;
  query = e.currentTarget.elements.query.value;
  if (query) {
    await onLoadMore();
  }
};

const onLoadMore = async () => {
  loader.show();
  if (searchByQuery) {
    await loadMoviesByQuery();

    page += 1;
  } else {
    page += 1;
    await loadTrendingMovies();
  }
  loader.hide();
  renderItems();
};

const onGalleryClick = e => {
  const element = e.target;
  const id = element.closest('li').dataset.id;
  renderModal(id);
  showModal();
};

const onWatchedBtnClick = e => {
  const movieId = e.currentTarget.closest('.js-modal').dataset.id;
  const movieData = items.find(({ id }) => id === Number(movieId));

  const watchedMovies = readMovies(WATCHED_KEY);
  if (!watchedMovies) {
    createMovies(WATCHED_KEY, movieData);
    showMessage({
      type: 'success',
      message: `${movieData.title} is added to 'Watched'`,
    });
    return;
  }
  if (watchedMovies.find(({ id }) => id === Number(movieId))) {
    showMessage({
      type: 'failure',
      message: `${movieData.title} has already been added to 'Watched'`,
    });
    return;
  }
  updateMovies(WATCHED_KEY, movieData);
  showMessage({
    type: 'success',
    message: `${movieData.title} is added to 'Watched'`,
  });
};

const onQueueBtnClick = e => {
  const movieId = e.currentTarget.closest('.js-modal').dataset.id;
  const movieData = items.find(({ id }) => id === Number(movieId));

  const queueMovies = readMovies(QUEUE_KEY);
  if (!queueMovies) {
    createMovies(QUEUE_KEY, movieData);
    showMessage({
      type: 'success',
      message: `${movieData.title} is added to 'Queue'`,
    });
    return;
  }
  if (queueMovies.find(({ id }) => id === Number(movieId))) {
    showMessage({
      type: 'failure',
      message: `${movieData.title} has already been added to 'Queue'`,
    });
    return;
  }
  updateMovies(QUEUE_KEY, movieData);
  showMessage({
    type: 'success',
    message: `${movieData.title} is added to 'Queue'`,
  });
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.gallery.addEventListener('click', onGalleryClick);
refs.modalCloseBtn.addEventListener('click', hideModal);
refs.watchedBtn.addEventListener('click', onWatchedBtnClick);
refs.queueBtn.addEventListener('click', onQueueBtnClick);

loadTrendingMovies().then(renderItems);
