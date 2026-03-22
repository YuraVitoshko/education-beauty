import "./main.min.js";
import { m as mixitup } from "./mixitup.min.js";
import "./watcher.min.js";
import "./common.min.js";
window.addEventListener("load", () => {
  const container = document.querySelector(".blog__items");
  const controls = document.querySelectorAll(".blog__control");
  if (container) {
    mixitup(container, {
      selectors: {
        target: ".blog__item"
      },
      animation: {
        duration: 250,
        effects: "fade scale(0.98)",
        easing: "ease-out",
        animateResizeContainer: false
      }
    });
  }
  controls.forEach((btn) => {
    btn.addEventListener("click", () => {
      controls.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});
