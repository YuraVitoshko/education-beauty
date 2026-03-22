import "./main.min.js";
document.addEventListener("DOMContentLoaded", () => {
  const videoBlock = document.querySelector(".video__box");
  if (!videoBlock) return;
  const video = videoBlock.querySelector(".video__item");
  const nav = videoBlock.querySelector(".nav-video");
  const youtubeVideos = document.querySelectorAll(".video-youtube__iframe");
  const playBtn = videoBlock.querySelector(".nav-video__btn-play");
  const pauseBtn = videoBlock.querySelector(".nav-video__btn-pause");
  const muteBtn = videoBlock.querySelector(".nav-video__btn-mute");
  const muteIcon = muteBtn?.querySelector("img");
  let hideTimeout;
  video.muted = true;
  pauseBtn.style.display = "none";
  function pauseVideo(v) {
    if (!v) return;
    if (v.tagName === "VIDEO") {
      if (!v.paused) v.pause();
    } else if (v.tagName === "IFRAME") {
      if (v.contentWindow) {
        v.contentWindow.postMessage(JSON.stringify({ event: "command", func: "pauseVideo" }), "*");
      }
    }
  }
  function pauseYoutubeVideos() {
    youtubeVideos.forEach((iframe) => pauseVideo(iframe));
  }
  function pauseMainVideo() {
    pauseVideo(video);
    updateButtons();
  }
  function showControls() {
    clearTimeout(hideTimeout);
    nav.classList.remove("hidden");
    if (!video.paused) hideTimeout = setTimeout(() => nav.classList.add("hidden"), 2e3);
  }
  function hideControls() {
    if (!video.paused) nav.classList.add("hidden");
  }
  playBtn.addEventListener("click", () => {
    pauseYoutubeVideos();
    document.querySelectorAll(".video-course-program__item").forEach((v) => pauseVideo(v));
    video.play();
    updateButtons();
    showControls();
  });
  pauseBtn.addEventListener("click", () => {
    pauseMainVideo();
    showControls();
  });
  video.addEventListener("play", () => {
    pauseYoutubeVideos();
    document.querySelectorAll(".video-course-program__item").forEach((v) => pauseVideo(v));
    updateButtons();
  });
  video.addEventListener("pause", updateButtons);
  function updateButtons() {
    if (video.paused) {
      playBtn.style.display = "block";
      pauseBtn.style.display = "none";
      showControls();
    } else {
      playBtn.style.display = "none";
      pauseBtn.style.display = "block";
    }
  }
  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    if (muteIcon) {
      muteIcon.src = video.muted ? "assets/img/icons/sound-off.svg" : "assets/img/icons/sound-on.svg";
    }
  });
  videoBlock.addEventListener("mouseenter", showControls);
  videoBlock.addEventListener("mousemove", showControls);
  videoBlock.addEventListener("mouseleave", hideControls);
  videoBlock.addEventListener("touchstart", () => {
    if (nav.classList.contains("hidden")) showControls();
    else nav.classList.add("hidden");
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) pauseVideo(entry.target);
    });
  }, { threshold: 0.25 });
  observer.observe(video);
  youtubeVideos.forEach((v) => observer.observe(v));
});
document.addEventListener("DOMContentLoaded", () => {
  const previews = document.querySelectorAll(".gallery__preview");
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
				<button class="gallery-viewer__prev"><img src="/assets/img/icons/arrow-slider.svg" alt="Image"></button>
				<div class="gallery-viewer__dots"></div>
				<button class="gallery-viewer__next"><img src="/assets/img/icons/arrow-slider.svg" alt="Image"></button>
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
