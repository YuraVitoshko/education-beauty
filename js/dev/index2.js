document.addEventListener("DOMContentLoaded", () => {
  const videoBlock = document.querySelector(".video__box");
  if (!videoBlock) return;
  const video = videoBlock.querySelector(".video__item");
  const nav = videoBlock.querySelector(".nav-video");
  const youtubeVideos = document.querySelectorAll(".video-youtube__iframe");
  const fullscreenBtn = videoBlock.querySelector(".nav-video__btn-fullscreen");
  const fullscreenIcon = fullscreenBtn?.querySelector("img");
  const playBtn = videoBlock.querySelector(".nav-video__btn-play");
  const pauseBtn = videoBlock.querySelector(".nav-video__btn-pause");
  const muteBtn = videoBlock.querySelector(".nav-video__btn-mute");
  const muteIcon = muteBtn?.querySelector("img");
  const isMobile = () => window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  let hideTimeout;
  let controlsLocked = false;
  video.muted = true;
  video.autoplay = true;
  pauseBtn.style.display = "none";
  if (isIOS) {
    video.controls = true;
    nav.style.display = "none";
  } else {
    video.controls = false;
    nav.style.display = "flex";
  }
  const pauseVideo = (v) => {
    if (!v) return;
    if (v.tagName === "VIDEO" && !v.paused) v.pause();
    else if (v.tagName === "IFRAME") v.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo" }), "*");
  };
  const pauseYoutubeVideos = () => youtubeVideos.forEach(pauseVideo);
  const showControls = () => {
    clearTimeout(hideTimeout);
    nav?.classList.remove("hidden");
    nav.style.opacity = "1";
    nav.style.transition = "opacity 0.2s";
  };
  const hideControls = (delay = 1e3) => {
    const isFullscreen = document.fullscreenElement === videoBlock;
    if (isAndroid && controlsLocked && !isFullscreen) return;
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (video.paused) return;
      nav?.classList.add("hidden");
      nav.style.opacity = "0";
    }, delay);
  };
  const updateButtons = () => {
    if (!playBtn || !pauseBtn) return;
    if (video.paused) {
      playBtn.style.display = "block";
      pauseBtn.style.display = "none";
      showControls();
    } else {
      playBtn.style.display = "none";
      pauseBtn.style.display = "block";
    }
  };
  playBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const isFullscreen = document.fullscreenElement === videoBlock;
    controlsLocked = false;
    pauseYoutubeVideos();
    document.querySelectorAll(".video-course-program__item").forEach((v) => pauseVideo(v));
    video.play();
    updateButtons();
    if (isAndroid && isFullscreen) {
      hideControls(500);
    } else {
      hideControls(1e3);
    }
  });
  pauseBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    video.pause();
    updateButtons();
    showControls();
    if (isAndroid) controlsLocked = true;
  });
  video.addEventListener("play", () => {
    pauseYoutubeVideos();
    document.querySelectorAll(".video-course-program__item").forEach((v) => pauseVideo(v));
    updateButtons();
    const isFullscreen = document.fullscreenElement === videoBlock;
    if (isAndroid && isFullscreen) {
      hideControls(500);
    } else {
      hideControls(1e3);
    }
  });
  video.addEventListener("pause", () => {
    updateButtons();
    showControls();
    if (isAndroid) controlsLocked = true;
    clearTimeout(hideTimeout);
  });
  muteBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    if (muteIcon) muteIcon.src = video.muted ? "assets/img/icons/sound-off.svg" : "assets/img/icons/sound-on.svg";
  });
  fullscreenBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (document.fullscreenElement === videoBlock) document.exitFullscreen();
    else videoBlock.requestFullscreen?.();
  });
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement === videoBlock) {
      fullscreenIcon && (fullscreenIcon.src = "assets/img/icons/fullscreen-exit.svg");
      video.style.objectFit = "contain";
      showControls();
      hideControls(1e3);
      if (isAndroid) {
        const adjustVideoSize = () => {
          video.style.width = window.innerWidth + "px";
          video.style.height = window.innerHeight + "px";
        };
        adjustVideoSize();
        window.addEventListener("resize", adjustVideoSize);
        videoBlock._androidResizeHandler = adjustVideoSize;
      }
    } else {
      fullscreenIcon && (fullscreenIcon.src = "assets/img/icons/fullscreen.svg");
      video.style.objectFit = "cover";
      video.style.width = "";
      video.style.height = "";
      showControls();
      if (isAndroid && videoBlock._androidResizeHandler) {
        window.removeEventListener("resize", videoBlock._androidResizeHandler);
        delete videoBlock._androidResizeHandler;
      }
    }
  });
  if (!isMobile()) {
    videoBlock.addEventListener("mousemove", () => {
      showControls();
      hideControls(1500);
    });
    videoBlock.addEventListener("mouseleave", () => {
      if (!video.paused) hideControls(200);
    });
  } else if (isAndroid) {
    videoBlock.addEventListener("touchstart", () => {
      if (!video.paused) {
        showControls();
        controlsLocked = true;
        clearTimeout(hideTimeout);
      }
    });
  }
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
			<img src="./assets/img/icons/close.svg" alt="Close">
		</button>

		<div class="gallery-viewer__content">
			<img class="gallery-viewer__image" src="">
			<div class="gallery-viewer__controls">
				<button class="gallery-viewer__prev"><img src="./assets/img/icons/arrow-slider.svg" alt="Image"></button>
				<div class="gallery-viewer__dots"></div>
				<button class="gallery-viewer__next"><img src="./assets/img/icons/arrow-slider.svg" alt="Image"></button>
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
