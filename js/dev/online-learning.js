import "./main.min.js";
import "./programs-course.min2.js";
import "./index.min2.js";
import "./watcher.min.js";
import "./common.min.js";
document.addEventListener("DOMContentLoaded", () => {
  const controls = document.querySelectorAll(".programs-course__control");
  const cards = document.querySelectorAll(".programs-course__cards .programs-course__card");
  controls.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      controls.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      cards.forEach((card) => {
        if (filter === "all") {
          card.style.display = "grid";
        } else {
          const className = filter.replace(".", "");
          if (card.classList.contains(className)) {
            card.style.display = "grid";
          } else {
            card.style.display = "none";
          }
        }
      });
    });
  });
});
