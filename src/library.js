import { readMovies, deleteMovie, updateMovies } from './js/crud';
import { getMoviesMarkup } from './js/templates';
import { WATCHED_KEY, QUEUE_KEY, BASE_IMG } from './js/constants';
import genres from './js/genres';
import { showMessage } from './js/showMessage';

const refs = {
  watchedBtn: document.querySelector('.js-watched-btn'),
  queueBtn: document.querySelector('.js-queue-btn'),
  gallery: document.querySelector('.js-gallery'),
  backdrop: document.querySelector('.backdrop'),
  closeBtn: document.querySelector('.js-modal-close'),
  addToWatchedBtn: document.querySelector('.js-add-to-watched-btn'),
  addToQueueBtn: document.querySelector('.js-add-to-queue-btn'),
};

let items = [];
let currentPage = 'watched';

const showModal = () => {
  refs.backdrop.classList.remove('is-hidden');
};
const hideModal = () => {
  refs.backdrop.classList.add('is-hidden');
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

const onWatchedBtnClick = e => {
  refs.watchedBtn.classList.add('active');
  refs.queueBtn.classList.remove('active');
  currentPage = 'watched';
  items = readMovies(WATCHED_KEY);
  renderItems();
};
const onQueueBtnClick = e => {
  refs.queueBtn.classList.add('active');
  refs.watchedBtn.classList.remove('active');
  currentPage = 'queue';
  items = readMovies(QUEUE_KEY);
  renderItems();
};
const onGalleryClick = e => {
  const element = e.target;
  const id = element.closest('li').dataset.id;
  renderModal(id);
  showModal();
};

const onAddToWatchedBtnClick = e => {
  const id = e.currentTarget.closest('.js-modal').dataset.id;
  const movieData = items.find(({ id: movieId }) => movieId === Number(id));
  if (currentPage === 'queue') {
    updateMovies(WATCHED_KEY, movieData);
    deleteMovie(QUEUE_KEY, id);
    items = readMovies(QUEUE_KEY);
    showMessage({
      type: 'success',
      message: `'${movieData.title}' is moved to 'Watched'`,
    });
  }
  if (currentPage === 'watched') {
    deleteMovie(WATCHED_KEY, id);
    items = readMovies(WATCHED_KEY);
    showMessage({
      type: 'success',
      message: `'${movieData.title}' is deleted`,
    });
  }
  hideModal();

  renderItems();
};

const onAddToQueueBtn = e => {
  const id = e.currentTarget.closest('.js-modal').dataset.id;
  const movieData = items.find(({ id: movieId }) => movieId === Number(id));
  if (currentPage === 'watched') {
    updateMovies(QUEUE_KEY, movieData);
    deleteMovie(WATCHED_KEY, id);
    items = readMovies(WATCHED_KEY);
    showMessage({
      type: 'success',
      message: `'${movieData.title}' is moved to 'Queue'`,
    });
  }
  if (currentPage === 'queue') {
    deleteMovie(QUEUE_KEY, id);
    items = readMovies(QUEUE_KEY);
    showMessage({
      type: 'success',
      message: `'${movieData.title}' is deleted`,
    });
  }
  hideModal();

  renderItems();
};

refs.watchedBtn.addEventListener('click', onWatchedBtnClick);
refs.queueBtn.addEventListener('click', onQueueBtnClick);
refs.gallery.addEventListener('click', onGalleryClick);
refs.closeBtn.addEventListener('click', hideModal);
refs.addToWatchedBtn.addEventListener('click', onAddToWatchedBtnClick);
refs.addToQueueBtn.addEventListener('click', onAddToQueueBtn);

onWatchedBtnClick();
