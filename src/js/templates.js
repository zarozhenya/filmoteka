import genres from './genres';

export function getCardMarkup({
  title,
  id,
  poster_path,
  release_date,
  genre_ids,
}) {
  const BASE_URL = 'https://image.tmdb.org/t/p/w780';
  return `
            <li class="movies-gallery__item" data-id=${id}>
              <img
                src="${
                  poster_path
                    ? `${BASE_URL}${poster_path}`
                    : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
                }"
                alt="${title}"
                class="movies-gallery__img"
              />
              <div class="movies-gallery__text">
                <h3 class="movies-gallery__title">${title}</h3>
                <p class="movies-gallery__genres">${
                  genre_ids.length !== 0
                    ? genre_ids.length <= 3
                      ? genres
                          .filter(({ id: genreID }) =>
                            genre_ids.includes(genreID)
                          )
                          .map(({ name }) => name)
                          .join(', ')
                      : [
                          genres.find(
                            ({ id: movieID }) => movieID === genre_ids[0]
                          ).name,
                          genres.find(
                            ({ id: movieID }) => movieID === genre_ids[1]
                          ).name,
                          'Other',
                        ].join(', ')
                    : 'No information'
                } | ${
    release_date ? new Date(release_date).getFullYear() : 'No information'
  }</p>
              </div>
            </li>`;
}

export function getModalMarkup() {
  return `
      <div class="movie-modal">
        <button type="button" class="movie-modal__close js-modal-close">
          <svg width="30px" height="30px" class="movie-modal__icon">
            <use href="./images/icons.svg#icon-close"></use>
          </svg>
        </button>
        <img
          src="https://image.tmdb.org/t/p/w780/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg"
          alt="Thor: Love and Thunder"
          class="movie-modal__img"
        />
        <div class="movie-modal__info">
          <h3 class="movie-modal__title">A FISTFUL OF LEAD</h3>
          <ul class="movie-modal__stats">
            <li class="movie-modal__field">
              <p class="movie-modal__category">Vote / Votes</p>
              <p class="movie-modal__data">
                <span class="movie-modal__rating">7.3</span>
                /
                <span class="movie-modal__quantity">1260</span>
              </p>
            </li>
            <li class="movie-modal__field">
              <p class="movie-modal__category">Popularity</p>
              <p class="movie-modal__data">100.2</p>
            </li>
            <li class="movie-modal__field">
              <p class="movie-modal__category">Original Title</p>
              <p class="movie-modal__data">A FISTFUL OF LEAD</p>
            </li>
            <li class="movie-modal__field">
              <p class="movie-modal__category">Genre</p>
              <p class="movie-modal__data">Western</p>
            </li>
          </ul>
          <h4 class="movie-modal__subtitle">About</h4>
          <p class="movie-modal__text">
            Four of the West’s most infamous outlaws assemble to steal a huge
            stash of gold from the most corrupt settlement of the gold rush
            towns. But not all goes to plan one is killed and the other three
            escapes with bags of gold hide out in the abandoned gold mine where
            they happen across another gang of three – who themselves were
            planning to hit the very same bank! As tensions rise, things go from
            bad to worse as they realise the bags of gold are filled with
            lead... they’ve been double crossed – but by who and how?
          </p>
          <ul class="movie-modal__buttons">
            <li class="movie-modal__item">
              <button
                type="submit"
                class="movie-modal__btn movie-modal__btn--accent"
              >
                add to Watched
              </button>
            </li>
            <li class="movie-modal__item">
              <button type="submit" class="movie-modal__btn">
                add to queue
              </button>
            </li>
          </ul>
        </div>
      </div>`;
}
