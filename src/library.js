import { readMovies, deleteMovie, createMovies } from './js/crud';
import { getMoviesMarkup } from './js/templates';
import { WATCHED_KEY, QUEUE_KEY, BASE_IMG } from './js/constants';
import genres from './js/genres';
import { Loader } from './js/loader';
import { showMessage } from './js/showMessage';
import isEmail from 'validator/lib/isEmail';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyC4TFBFQRWUVazSJUXo0Z29XqKQGw3CwAA',
  authDomain: 'filmoteka-29d04.firebaseapp.com',
  projectId: 'filmoteka-29d04',
  storageBucket: 'filmoteka-29d04.appspot.com',
  messagingSenderId: '839332022784',
  appId: '1:839332022784:web:20cca0e4887dab354326e5',
  measurementId: 'G-8B53C0FEKF',
  databaseURL:
    'https://filmoteka-29d04-default-rtdb.europe-west1.firebasedatabase.app',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const refs = {
  watchedBtn: document.querySelector('.js-watched-btn'),
  queueBtn: document.querySelector('.js-queue-btn'),
  gallery: document.querySelector('.js-gallery'),
  backdrop: document.querySelector('.backdrop'),
  modal: document.querySelector('.js-modal'),
  modalCloseBtn: document.querySelector('.js-modal-close'),
  addToWatchedBtn: document.querySelector('.js-add-to-watched-btn'),
  addToQueueBtn: document.querySelector('.js-add-to-queue-btn'),
  loginBtn: document.querySelector('.js-login-btn'),
  logoutBtn: document.querySelector('.js-logout-btn'),
  loginModal: document.querySelector('.js-login-modal'),
  loginModalCloseBtn: document.querySelector('.js-login-close'),
  loginForm: document.querySelector('.js-login-form'),
};

let items = [];
let currentPage;
const loader = new Loader();

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
const changeBtnView = page => {
  if (page === 'watched') {
    refs.addToQueueBtn.textContent = 'add to queue';
    refs.addToWatchedBtn.textContent = 'remove';
  }
  if (page === 'queue') {
    refs.addToQueueBtn.textContent = 'remove';
    refs.addToWatchedBtn.textContent = 'add to watched';
  }
};

const renderItems = () => {
  if (items.length === 0) {
    showMessage({ type: 'info', message: 'There is no movies yet' });
  }
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
  changeBtnView(currentPage);
};

const onWatchedBtnClick = async e => {
  refs.watchedBtn.classList.add('active');
  refs.queueBtn.classList.remove('active');
  if (currentPage === 'watched') {
    return;
  }
  currentPage = 'watched';

  loader.show();

  items = await readMovies({
    database,
    key: WATCHED_KEY,
    uid: auth.currentUser.uid,
  });
  loader.hide();
  renderItems();
};
const onQueueBtnClick = async e => {
  refs.queueBtn.classList.add('active');
  refs.watchedBtn.classList.remove('active');

  if (currentPage === 'queue') {
    return;
  }
  currentPage = 'queue';
  loader.show();
  items = await readMovies({
    database,
    key: QUEUE_KEY,
    uid: auth?.currentUser?.uid,
  });
  loader.hide();

  renderItems();
};
const onGalleryClick = e => {
  const element = e.target;
  const id = element.closest('li').dataset.id;
  renderModal(id);
  showModal();
};

const onAddToWatchedBtnClick = async e => {
  const id = e.currentTarget.closest('.js-modal').dataset.id;
  const movieData = items.find(({ id: movieId }) => movieId === Number(id));
  loader.show();
  if (currentPage === 'queue') {
    await createMovies({
      database,
      key: WATCHED_KEY,
      uid: auth.currentUser.uid,
      data: [movieData],
    });
    await deleteMovie({
      database,
      key: QUEUE_KEY,
      uid: auth.currentUser.uid,
      idToDelete: id,
    });
    items = await readMovies({
      database,
      key: QUEUE_KEY,
      uid: auth.currentUser.uid,
    });
    showMessage({
      type: 'success',
      message: `'${movieData.title}' is moved to 'Watched'`,
    });
  }
  if (currentPage === 'watched') {
    await deleteMovie({
      database,
      key: WATCHED_KEY,
      uid: auth.currentUser.uid,
      idToDelete: id,
    });
    items = await readMovies({
      database,
      key: WATCHED_KEY,
      uid: auth.currentUser.uid,
    });
    showMessage({
      type: 'success',
      message: `'${movieData.title}' is deleted`,
    });
  }
  loader.hide();
  hideModal();

  renderItems();
};

const onAddToQueueBtn = async e => {
  const id = e.currentTarget.closest('.js-modal').dataset.id;
  const movieData = items.find(({ id: movieId }) => movieId === Number(id));
  if (currentPage === 'watched') {
    await createMovies({
      database,
      key: QUEUE_KEY,
      uid: auth.currentUser.uid,
      data: [movieData],
    });
    await deleteMovie({
      database,
      key: WATCHED_KEY,
      uid: auth.currentUser.uid,
      idToDelete: id,
    });
    items = await readMovies({
      database,
      key: WATCHED_KEY,
      uid: auth.currentUser.uid,
    });
    showMessage({
      type: 'success',
      message: `'${movieData.title}' is moved to 'Queue'`,
    });
  }
  if (currentPage === 'queue') {
    await deleteMovie({
      database,
      key: QUEUE_KEY,
      uid: auth.currentUser.uid,
      idToDelete: id,
    });
    items = await readMovies({
      database,
      key: QUEUE_KEY,
      uid: auth.currentUser.uid,
    });
    showMessage({
      type: 'success',
      message: `'${movieData.title}' is deleted`,
    });
  }
  hideModal();

  renderItems();
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
    refs.loginBtn.classList.add('is-hidden');
    refs.logoutBtn.classList.remove('is-hidden');
    refs.watchedBtn.removeAttribute('disabled');
    refs.queueBtn.removeAttribute('disabled');
    onWatchedBtnClick();
  } else {
    refs.logoutBtn.classList.add('is-hidden');
    refs.loginBtn.classList.remove('is-hidden');
    refs.watchedBtn.setAttribute('disabled', 'true');
    refs.queueBtn.setAttribute('disabled', 'true');
    refs.gallery.innerHTML = '';
    showMessage({
      type: 'info',
      message: 'You have to login to see movies in library',
    });
  }
});

refs.watchedBtn.addEventListener('click', onWatchedBtnClick);
refs.queueBtn.addEventListener('click', onQueueBtnClick);
refs.gallery.addEventListener('click', onGalleryClick);
refs.modalCloseBtn.addEventListener('click', hideModal);
refs.addToWatchedBtn.addEventListener('click', onAddToWatchedBtnClick);
refs.addToQueueBtn.addEventListener('click', onAddToQueueBtn);
refs.loginBtn.addEventListener('click', showLogin);
refs.logoutBtn.addEventListener('click', onLogOut);
refs.loginModalCloseBtn.addEventListener('click', hideLogin);
refs.loginForm.addEventListener('submit', onLoginSubmit);
