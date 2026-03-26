import "./common.min2.js";
import "./watcher.min.js";
import "./index.min2.js";
import "./common.min.js";
document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".search-blog__input");
  const clear = document.querySelector(".search-blog__clear");
  input.addEventListener("input", () => {
    clear.classList.toggle("active", input.value.length);
  });
  clear.addEventListener("click", () => {
    input.value = "";
    input.focus();
    clear.classList.remove("active");
  });
});
