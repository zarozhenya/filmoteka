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
