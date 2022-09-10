export function getCardMarkup({ title, id, poster_path }) {
  const BASE_URL = 'https://image.tmdb.org/t/p/w780';
  return `
            <li class="movies-gallery__item" data-id=${id}>
              <img
                src="${BASE_URL}${poster_path}"
                alt="${title}"
                class="movies-gallery__img"
              />
              <div class="movies-gallery__text">
                <h3 class="movies-gallery__title">${title}</h3>
                <p class="movies-gallery__genres">Drama, Action | 2020</p>
              </div>
            </li>`;
}
