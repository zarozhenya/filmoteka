function e({title:e,id:t,poster_path:l}){return`\n            <li class="movies-gallery__item" data-id=${t}>\n              <img\n                src="https://image.tmdb.org/t/p/w780${l}"\n                alt="${e}"\n                class="movies-gallery__img"\n              />\n              <div class="movies-gallery__text">\n                <h3 class="movies-gallery__title">${e}</h3>\n                <p class="movies-gallery__genres">Drama, Action | 2020</p>\n              </div>\n            </li>`}const t={form:document.querySelector("form.header__form"),gallery:document.querySelector(".movies-gallery")},l=[];fetch("https://api.themoviedb.org/3/trending/movie/day?api_key=21a38995d1a0d82c48e261b573f88f7b").then((e=>e.json())).then((({results:e})=>l.push(...e))).then((()=>{console.log(l),(()=>{const n=l.map(e).join("\n");console.log(n),t.gallery.insertAdjacentHTML("beforeend",n)})()}));
//# sourceMappingURL=index.bad94846.js.map