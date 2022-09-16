import { getMoviesMarkup } from './js/templates';
import genres from './js/genres';
import { readMovies, createMovies, updateMovies } from './js/crud';
import { Loader } from './js/loader';
import { showMessage } from './js/showMessage';

import {
  API_KEY,
  BASE_URL,
  BASE_IMG,
  WATCHED_KEY,
  QUEUE_KEY,
} from './js/constants';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyC4TFBFQRWUVazSJUXo0Z29XqKQGw3CwAA',
  authDomain: 'filmoteka-29d04.firebaseapp.com',
  projectId: 'filmoteka-29d04',
  storageBucket: 'filmoteka-29d04.appspot.com',
  messagingSenderId: '839332022784',
  appId: '1:839332022784:web:20cca0e4887dab354326e5',
  measurementId: 'G-8B53C0FEKF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const refs = {
  form: document.querySelector('form.header__form'),
  gallery: document.querySelector('.movies-gallery'),
  loadMoreBtn: document.querySelector('.js-load-more-btn'),
  backdrop: document.querySelector('.backdrop'),
  modal: document.querySelector('.js-modal'),
  modalCloseBtn: document.querySelector('button.js-modal-close'),
  watchedBtn: document.querySelector('.js-watched-btn'),
  queueBtn: document.querySelector('.js-queue-btn'),
  loginBtn: document.querySelector('.js-login-btn'),
  logoutBtn: document.querySelector('.js-logout-btn'),
  loginModal: document.querySelector('.js-login-modal'),
  loginModalCloseBtn: document.querySelector('.js-login-close'),
  loginForm: document.querySelector('.js-login-form'),
  libraryLink: document.querySelector('.js-library-item'),
};

let items = [];
let page = 1;
let query = '';
let currentResult = 0;
let totalResults = 0;
let searchByQuery = false;
let isAuthorized = false;
const loader = new Loader();

const showButton = () => {
  refs.loadMoreBtn.classList.remove('hidden');
};
const hideButton = () => {
  refs.loadMoreBtn.classList.add('hidden');
};

const onBackdropClick = e => {
  if (e.target.classList.contains('backdrop')) {
    hideModal();
    hideLogin();
  }
};

const onKeyPress = e => {
  if (e.code === 'Escape') {
    hideModal();
    hideLogin();
  }
};

const showModal = () => {
  refs.modal.classList.remove('is-hidden');
  refs.backdrop.classList.remove('is-hidden');

  refs.backdrop.addEventListener('click', onBackdropClick);
  document.body.addEventListener('keydown', onKeyPress);
};
const hideModal = () => {
  refs.backdrop.classList.add('is-hidden');
  setTimeout(() => {
    refs.modal.classList.add('is-hidden');
  }, 200);
  refs.backdrop.removeEventListener('click', onBackdropClick);
  document.body.removeEventListener('keydown', onKeyPress);
};

const showLogin = e => {
  refs.loginModal.classList.remove('is-hidden');
  refs.backdrop.classList.remove('is-hidden');
  refs.backdrop.addEventListener('click', onBackdropClick);
  document.body.addEventListener('keydown', onKeyPress);
};

const hideLogin = e => {
  refs.backdrop.classList.add('is-hidden');
  setTimeout(() => {
    refs.loginModal.classList.add('is-hidden');
  }, 200);
  refs.backdrop.removeEventListener('click', onBackdropClick);
  document.body.removeEventListener('keydown', onKeyPress);
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
    `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&page=${page}`
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
  if (isAuthorized) {
    refs.queueBtn.classList.remove('is-hidden');
    refs.watchedBtn.classList.remove('is-hidden');
  } else {
    refs.queueBtn.classList.add('is-hidden');
    refs.watchedBtn.classList.add('is-hidden');
  }
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
  const queueMovies = readMovies(QUEUE_KEY);
  if (
    watchedMovies?.find(({ id }) => id === Number(movieId)) ||
    queueMovies?.find(({ id }) => id === Number(movieId))
  ) {
    showMessage({
      type: 'failure',
      message: `'${movieData.title}' has already been added to Library`,
    });
    hideModal();
    return;
  }
  if (!watchedMovies) {
    createMovies(WATCHED_KEY, movieData);
    showMessage({
      type: 'success',
      message: `'${movieData.title}' is added to 'Watched'`,
    });
    hideModal();
    return;
  }

  updateMovies(WATCHED_KEY, movieData);
  showMessage({
    type: 'success',
    message: `'${movieData.title}' is added to 'Watched'`,
  });
  hideModal();
};

const onQueueBtnClick = e => {
  const movieId = e.currentTarget.closest('.js-modal').dataset.id;
  const movieData = items.find(({ id }) => id === Number(movieId));

  const queueMovies = readMovies(QUEUE_KEY);
  const watchedMovies = readMovies(WATCHED_KEY);
  if (
    queueMovies?.find(({ id }) => id === Number(movieId)) ||
    watchedMovies?.find(({ id }) => id === Number(movieId))
  ) {
    showMessage({
      type: 'failure',
      message: `'${movieData.title}' has already been added to Library`,
    });
    hideModal();
    return;
  }
  if (!queueMovies) {
    createMovies(QUEUE_KEY, movieData);
    showMessage({
      type: 'success',
      message: `'${movieData.title}' is added to 'Queue'`,
    });
    hideModal();
    return;
  }

  updateMovies(QUEUE_KEY, movieData);
  showMessage({
    type: 'success',
    message: `'${movieData.title}' is added to 'Queue'`,
  });
  hideModal();
};

const onLoginSubmit = async e => {
  e.preventDefault();
  const { email, password, method } = e.currentTarget.elements;
  console.log(method.value);
  if (method.value === 'sign-up') {
    await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    ).catch(error => {
      console.log(error.code);
      console.log(error.message);
    });
  } else if (method.value === 'sign-in') {
    await signInWithEmailAndPassword(auth, email.value, password.value).catch(
      error => {
        console.log(error.code);
        console.log(error.message);
      }
    );
  }
  hideLogin();
  e.target.reset();
};

const onLogOut = e => {
  auth.signOut();
};

onAuthStateChanged(auth, user => {
  if (user) {
    isAuthorized = true;
    refs.loginBtn.classList.add('is-hidden');
    refs.logoutBtn.classList.remove('is-hidden');
  } else {
    isAuthorized = false;
    refs.logoutBtn.classList.add('is-hidden');
    refs.loginBtn.classList.remove('is-hidden');
  }
});

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.gallery.addEventListener('click', onGalleryClick);
refs.modalCloseBtn.addEventListener('click', hideModal);
refs.watchedBtn.addEventListener('click', onWatchedBtnClick);
refs.queueBtn.addEventListener('click', onQueueBtnClick);
refs.loginBtn.addEventListener('click', showLogin);
refs.logoutBtn.addEventListener('click', onLogOut);
refs.loginModalCloseBtn.addEventListener('click', hideLogin);
refs.loginForm.addEventListener('submit', onLoginSubmit);

loadTrendingMovies().then(renderItems);
