!function(){var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},o={},n=e.parcelRequired7c6;null==n&&((n=function(e){if(e in t)return t[e].exports;if(e in o){var n=o[e];delete o[e];var d={id:e,exports:{}};return t[e]=d,n.call(d.exports,d,d.exports),d.exports}var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,t){o[e]=t},e.parcelRequired7c6=n);var d=n("eBfQW"),a=n("bfaTO"),r=n("4s6iC"),c=n("twtVq"),s=n("QXG35"),i={watchedBtn:document.querySelector(".js-watched-btn"),queueBtn:document.querySelector(".js-queue-btn"),gallery:document.querySelector(".js-gallery"),backdrop:document.querySelector(".backdrop"),closeBtn:document.querySelector(".js-modal-close"),addToWatchedBtn:document.querySelector(".js-add-to-watched-btn"),addToQueueBtn:document.querySelector(".js-add-to-queue-btn")},u=[],l="watched",v=function(){i.backdrop.classList.add("is-hidden")},p=function(){0===u.length&&(0,s.showMessage)({type:"info",message:"There is no movies yet"});var e=(0,a.getMoviesMarkup)(u);i.gallery.innerHTML=e},E=function(e){var t,o=u.find((function(t){return t.id===Number(e)})),n=o.poster_path,d=o.title,a=o.vote_average,s=o.vote_count,v=o.popularity,p=o.original_title,E=o.genre_ids,f=o.overview,m=o.id;i.backdrop.querySelector(".js-img").src=n?"".concat(r.BASE_IMG).concat(n):"https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",i.backdrop.querySelector(".js-title").textContent=d,i.backdrop.querySelector(".js-rating").textContent=a.toFixed(2),i.backdrop.querySelector(".js-votes").textContent=s,i.backdrop.querySelector(".js-popularity").textContent=v.toFixed(2),i.backdrop.querySelector(".js-original").textContent=p,i.backdrop.querySelector(".js-genre").textContent=0!==E.length?E.map((function(e){return c.default.find((function(t){return t.id===e})).name})).join(", "):"No information",i.backdrop.querySelector(".js-text").textContent=f,i.backdrop.querySelector(".js-modal").dataset.id=m,"watched"===(t=l)&&(i.addToQueueBtn.textContent="add to queue",i.addToWatchedBtn.textContent="remove"),"queue"===t&&(i.addToQueueBtn.textContent="remove",i.addToWatchedBtn.textContent="add to watched")},f=function(e){i.watchedBtn.classList.add("active"),i.queueBtn.classList.remove("active"),l="watched",u=(0,d.readMovies)(r.WATCHED_KEY),p()};i.watchedBtn.addEventListener("click",f),i.queueBtn.addEventListener("click",(function(e){i.queueBtn.classList.add("active"),i.watchedBtn.classList.remove("active"),l="queue",u=(0,d.readMovies)(r.QUEUE_KEY),p()})),i.gallery.addEventListener("click",(function(e){var t=e.target.closest("li").dataset.id;E(t),i.backdrop.classList.remove("is-hidden")})),i.closeBtn.addEventListener("click",v),i.addToWatchedBtn.addEventListener("click",(function(e){var t=e.currentTarget.closest(".js-modal").dataset.id,o=u.find((function(e){return e.id===Number(t)}));"queue"===l&&((0,d.updateMovies)(r.WATCHED_KEY,o),(0,d.deleteMovie)(r.QUEUE_KEY,t),u=(0,d.readMovies)(r.QUEUE_KEY),(0,s.showMessage)({type:"success",message:"'".concat(o.title,"' is moved to 'Watched'")})),"watched"===l&&((0,d.deleteMovie)(r.WATCHED_KEY,t),u=(0,d.readMovies)(r.WATCHED_KEY),(0,s.showMessage)({type:"success",message:"'".concat(o.title,"' is deleted")})),v(),p()})),i.addToQueueBtn.addEventListener("click",(function(e){var t=e.currentTarget.closest(".js-modal").dataset.id,o=u.find((function(e){return e.id===Number(t)}));"watched"===l&&((0,d.updateMovies)(r.QUEUE_KEY,o),(0,d.deleteMovie)(r.WATCHED_KEY,t),u=(0,d.readMovies)(r.WATCHED_KEY),(0,s.showMessage)({type:"success",message:"'".concat(o.title,"' is moved to 'Queue'")})),"queue"===l&&((0,d.deleteMovie)(r.QUEUE_KEY,t),u=(0,d.readMovies)(r.QUEUE_KEY),(0,s.showMessage)({type:"success",message:"'".concat(o.title,"' is deleted")})),v(),p()})),f()}();
//# sourceMappingURL=library.017c9bce.js.map
