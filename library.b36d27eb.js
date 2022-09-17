var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},a={},d=e.parcelRequired7c6;null==d&&((d=function(e){if(e in t)return t[e].exports;if(e in a){var d=a[e];delete a[e];var o={id:e,exports:{}};return t[e]=o,d.call(o.exports,o,o.exports),o.exports}var s=new Error("Cannot find module '"+e+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(e,t){a[e]=t},e.parcelRequired7c6=d);var o=d("3nphs"),s=d("7sOwA"),i=d("8G1wF"),n=d("ezyJp"),r=d("gjiCh"),c=d("2PXHr"),l=d("25RCP"),u=d("amyG6"),m=d("fQ3Fn");const g=(0,l.initializeApp)({apiKey:"AIzaSyC4TFBFQRWUVazSJUXo0Z29XqKQGw3CwAA",authDomain:"filmoteka-29d04.firebaseapp.com",projectId:"filmoteka-29d04",storageBucket:"filmoteka-29d04.appspot.com",messagingSenderId:"839332022784",appId:"1:839332022784:web:20cca0e4887dab354326e5",measurementId:"G-8B53C0FEKF",databaseURL:"https://filmoteka-29d04-default-rtdb.europe-west1.firebasedatabase.app"}),v=(0,u.getAuth)(g),y=(0,m.getDatabase)(g),p={watchedBtn:document.querySelector(".js-watched-btn"),queueBtn:document.querySelector(".js-queue-btn"),gallery:document.querySelector(".js-gallery"),backdrop:document.querySelector(".backdrop"),modal:document.querySelector(".js-modal"),modalCloseBtn:document.querySelector(".js-modal-close"),addToWatchedBtn:document.querySelector(".js-add-to-watched-btn"),addToQueueBtn:document.querySelector(".js-add-to-queue-btn"),loginBtn:document.querySelector(".js-login-btn"),logoutBtn:document.querySelector(".js-logout-btn"),loginModal:document.querySelector(".js-login-modal"),loginModalCloseBtn:document.querySelector(".js-login-close"),loginForm:document.querySelector(".js-login-form")};let b,h=[];const w=new(0,r.Loader),k=e=>{e.target.classList.contains("backdrop")&&(L(),q())},E=e=>{"Escape"===e.code&&(L(),q())},L=()=>{p.backdrop.classList.add("is-hidden"),setTimeout((()=>{p.modal.classList.add("is-hidden")}),200),p.backdrop.removeEventListener("click",k),document.body.removeEventListener("keydown",E)},q=e=>{p.backdrop.classList.add("is-hidden"),setTimeout((()=>{p.loginModal.classList.add("is-hidden")}),200),p.backdrop.removeEventListener("click",k),document.body.removeEventListener("keydown",E)},B=()=>{0===h.length&&(0,c.showMessage)({type:"info",message:"There is no movies yet"});const e=(0,s.getMoviesMarkup)(h);p.gallery.innerHTML=e},f=e=>{const{poster_path:t,title:a,vote_average:d,vote_count:o,popularity:s,original_title:r,genre_ids:c,overview:l,id:u}=h.find((({id:t})=>t===Number(e)));var m;p.backdrop.querySelector(".js-img").src=t?`${i.BASE_IMG}${t}`:"https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",p.backdrop.querySelector(".js-title").textContent=a,p.backdrop.querySelector(".js-rating").textContent=d.toFixed(2),p.backdrop.querySelector(".js-votes").textContent=o,p.backdrop.querySelector(".js-popularity").textContent=s.toFixed(2),p.backdrop.querySelector(".js-original").textContent=r,p.backdrop.querySelector(".js-genre").textContent=0!==c.length?c.map((e=>n.default.find((({id:t})=>t===e)).name)).join(", "):"No information",p.backdrop.querySelector(".js-text").textContent=l,p.backdrop.querySelector(".js-modal").dataset.id=u,"watched"===(m=b)&&(p.addToQueueBtn.textContent="add to queue",p.addToWatchedBtn.textContent="remove"),"queue"===m&&(p.addToQueueBtn.textContent="remove",p.addToWatchedBtn.textContent="add to watched")},T=async e=>{p.watchedBtn.classList.add("active"),p.queueBtn.classList.remove("active"),"watched"!==b&&(b="watched",w.show(),h=await(0,o.readMovies)({database:y,key:i.WATCHED_KEY,uid:v.currentUser.uid}),w.hide(),B())};(0,u.onAuthStateChanged)(v,(e=>{e?(isAuthorized=!0,p.loginBtn.classList.add("is-hidden"),p.logoutBtn.classList.remove("is-hidden"),p.watchedBtn.removeAttribute("disabled"),p.queueBtn.removeAttribute("disabled"),T()):(isAuthorized=!1,p.logoutBtn.classList.add("is-hidden"),p.loginBtn.classList.remove("is-hidden"),p.watchedBtn.setAttribute("disabled","true"),p.queueBtn.setAttribute("disabled","true"),p.gallery.innerHTML="",(0,c.showMessage)({type:"info",message:"You have to login to see movies in library"}))})),p.watchedBtn.addEventListener("click",T),p.queueBtn.addEventListener("click",(async e=>{var t;p.queueBtn.classList.add("active"),p.watchedBtn.classList.remove("active"),"queue"!==b&&(b="queue",w.show(),h=await(0,o.readMovies)({database:y,key:i.QUEUE_KEY,uid:null==v||null===(t=v.currentUser)||void 0===t?void 0:t.uid}),w.hide(),B())})),p.gallery.addEventListener("click",(e=>{const t=e.target.closest("li").dataset.id;f(t),p.modal.classList.remove("is-hidden"),p.backdrop.classList.remove("is-hidden"),p.backdrop.addEventListener("click",k),document.body.addEventListener("keydown",E)})),p.modalCloseBtn.addEventListener("click",L),p.addToWatchedBtn.addEventListener("click",(async e=>{const t=e.currentTarget.closest(".js-modal").dataset.id,a=h.find((({id:e})=>e===Number(t)));w.show(),"queue"===b&&(await(0,o.createMovies)({database:y,key:i.WATCHED_KEY,uid:v.currentUser.uid,data:[a]}),await(0,o.deleteMovie)({database:y,key:i.QUEUE_KEY,uid:v.currentUser.uid,idToDelete:t}),h=await(0,o.readMovies)({database:y,key:i.QUEUE_KEY,uid:v.currentUser.uid}),(0,c.showMessage)({type:"success",message:`'${a.title}' is moved to 'Watched'`})),"watched"===b&&(await(0,o.deleteMovie)({database:y,key:i.WATCHED_KEY,uid:v.currentUser.uid,idToDelete:t}),h=await(0,o.readMovies)({database:y,key:i.WATCHED_KEY,uid:v.currentUser.uid}),(0,c.showMessage)({type:"success",message:`'${a.title}' is deleted`})),w.hide(),L(),B()})),p.addToQueueBtn.addEventListener("click",(async e=>{const t=e.currentTarget.closest(".js-modal").dataset.id,a=h.find((({id:e})=>e===Number(t)));"watched"===b&&(await(0,o.createMovies)({database:y,key:i.QUEUE_KEY,uid:v.currentUser.uid,data:[a]}),await(0,o.deleteMovie)({database:y,key:i.WATCHED_KEY,uid:v.currentUser.uid,idToDelete:t}),h=await(0,o.readMovies)({database:y,key:i.WATCHED_KEY,uid:v.currentUser.uid}),(0,c.showMessage)({type:"success",message:`'${a.title}' is moved to 'Queue'`})),"queue"===b&&(await(0,o.deleteMovie)({database:y,key:i.QUEUE_KEY,uid:v.currentUser.uid,idToDelete:t}),h=await(0,o.readMovies)({database:y,key:i.QUEUE_KEY,uid:v.currentUser.uid}),(0,c.showMessage)({type:"success",message:`'${a.title}' is deleted`})),L(),B()})),p.loginBtn.addEventListener("click",(e=>{p.loginModal.classList.remove("is-hidden"),p.backdrop.classList.remove("is-hidden"),p.backdrop.addEventListener("click",k),document.body.addEventListener("keydown",E)})),p.logoutBtn.addEventListener("click",(e=>{v.signOut()})),p.loginModalCloseBtn.addEventListener("click",q),p.loginForm.addEventListener("submit",(async e=>{e.preventDefault();const{email:t,password:a,method:d}=e.currentTarget.elements;console.log(d.value),"sign-up"===d.value?await(0,u.createUserWithEmailAndPassword)(v,t.value,a.value).catch((e=>{console.log(e.code),console.log(e.message)})):"sign-in"===d.value&&await(0,u.signInWithEmailAndPassword)(v,t.value,a.value).catch((e=>{console.log(e.code),console.log(e.message)})),q(),e.target.reset()}));
//# sourceMappingURL=library.b36d27eb.js.map
