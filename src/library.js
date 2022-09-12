import { readMovies } from './js/crud';
import { getMoviesMarkup } from './js/templates';
import { WATCHED_KEY, QUEUE_KEY } from './js/constants';

const refs = {
  watchedBtn: document.querySelector('.js-watched-btn'),
  queueBtn: document.querySelector('.js-queue-btn'),
  gallery: document.querySelector('.js-gallery'),
};

let items = [];

const renderItems = () => {
  const markup = getMoviesMarkup(items);
  refs.gallery.innerHTML = markup;
};

const onWatchedBtnClick = e => {
  refs.watchedBtn.classList.add('active');
  refs.queueBtn.classList.remove('active');
  items = readMovies(WATCHED_KEY);
  renderItems();
};
const onQueueBtnClick = e => {
  refs.queueBtn.classList.add('active');
  refs.watchedBtn.classList.remove('active');
  items = readMovies(QUEUE_KEY);
  renderItems();
};

refs.watchedBtn.addEventListener('click', onWatchedBtnClick);
refs.queueBtn.addEventListener('click', onQueueBtnClick);

onWatchedBtnClick();
