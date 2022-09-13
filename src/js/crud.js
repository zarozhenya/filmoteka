export function createMovies(key, data) {
  localStorage.setItem(key, JSON.stringify([data]));
}
export function readMovies(key) {
  const movies = localStorage.getItem(key);
  return JSON.parse(movies);
}
export function updateMovies(key, data) {
  const movies = readMovies(key);
  localStorage.setItem(key, JSON.stringify([...movies, data]));
}
export function deleteMovie(key, movieId) {
  const movies = readMovies(key);
  const filteredMovies = movies.filter(({ id }) => id !== Number(movieId));
  console.log(filteredMovies);
  localStorage.setItem(key, JSON.stringify(filteredMovies));
}
