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
