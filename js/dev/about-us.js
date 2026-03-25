import "./common.min2.js";
import "./tel-form.min.js";
import "./slider.min.js";
import "./index.min2.js";
import "./common.min.js";
document.addEventListener("DOMContentLoaded", () => {
  const previews = document.querySelectorAll(".about-us__img img");
  if (!previews.length) return;
  let current = 0;
  const images = [...previews].map((img) => img.src);
  const maxVisibleDots = 5;
  const viewer = document.createElement("div");
  viewer.className = "gallery-viewer";
  viewer.innerHTML = `
		<div class="gallery-viewer__overlay"></div>

		<button class="gallery-viewer__close">
			<img src="/assets/img/icons/close.svg" alt="Close">
		</button>

		<div class="gallery-viewer__content">
			<img class="gallery-viewer__image" src="">
			<div class="gallery-viewer__controls">
				<button class="gallery-viewer__prev"><img src="/assets/img/icons/arrow-slider.svg" alt=""></button>
				<div class="gallery-viewer__dots"></div>
				<button class="gallery-viewer__next"><img src="/assets/img/icons/arrow-slider.svg" alt=""></button>
			</div>
		</div>
	`;
  document.body.append(viewer);
  const image = viewer.querySelector(".gallery-viewer__image");
  const prev = viewer.querySelector(".gallery-viewer__prev");
  const next = viewer.querySelector(".gallery-viewer__next");
  const overlay = viewer.querySelector(".gallery-viewer__overlay");
  const closeBtn = viewer.querySelector(".gallery-viewer__close");
  const dotsContainer = viewer.querySelector(".gallery-viewer__dots");
  viewer.style.display = "none";
  images.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "gallery-dot";
    dot.addEventListener("click", () => {
      current = i;
      update();
    });
    dotsContainer.append(dot);
  });
  const dots = dotsContainer.querySelectorAll(".gallery-dot");
  function update() {
    image.src = images[current];
    const total = dots.length;
    let start = 0;
    let end = total;
    if (total > maxVisibleDots) {
      start = current - 2;
      end = current + 3;
      if (start < 0) {
        start = 0;
        end = maxVisibleDots;
      }
      if (end > total) {
        end = total;
        start = total - maxVisibleDots;
      }
    }
    dots.forEach((dot, i) => {
      dot.classList.remove("active");
      if (i >= start && i < end) {
        dot.style.display = "block";
      } else {
        dot.style.display = "none";
      }
    });
    dots[current].classList.add("active");
    prev.classList.toggle("disabled", current === 0);
    next.classList.toggle("disabled", current === images.length - 1);
  }
  function open(index) {
    current = index;
    update();
    viewer.style.display = "block";
    viewer.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function close() {
    viewer.classList.remove("active");
    viewer.style.display = "none";
    document.body.style.overflow = "";
  }
  previews.forEach((img, i) => {
    img.addEventListener("click", () => open(i));
  });
  next.addEventListener("click", () => {
    if (current >= images.length - 1) return;
    current++;
    update();
  });
  prev.addEventListener("click", () => {
    if (current <= 0) return;
    current--;
    update();
  });
  overlay.addEventListener("click", close);
  closeBtn.addEventListener("click", close);
  let startX = 0;
  image.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });
  image.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50 && current < images.length - 1) next.click();
    if (endX - startX > 50 && current > 0) prev.click();
  });
});
