import { ref, get, set, child } from 'firebase/database';

export async function createMovies({
  database,
  key,
  uid,
  data,
  savePrev = true,
}) {
  const prevData = await readMovies({ database, uid, key });
  await set(
    ref(database, `users/${uid}/${key}`),
    savePrev ? [...data, ...prevData] : [...data]
  );
}
export async function readMovies({ database, key, uid }) {
  let movies;
  await get(child(ref(database), `users/${uid}/${key}`))
    .then(snapshot => {
      if (snapshot.exists()) {
        movies = snapshot.val();
      }
    })
    .catch(error => {
      console.error(error);
    });
  return movies || [];
}

export async function deleteMovie({ database, key, uid, idToDelete }) {
  const prevData = await readMovies({ database, uid, key });
  const filteredMovies = prevData.filter(({ id }) => id !== Number(idToDelete));
  await createMovies({
    database,
    key,
    uid,
    data: filteredMovies,
    savePrev: false,
  });
}
