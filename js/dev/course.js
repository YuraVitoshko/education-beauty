import "./common.min2.js";
import "./tel-form.min.js";
import "./slider.min.js";
import "./watcher.min.js";
import "./index.min2.js";
import "./common.min.js";
document.addEventListener("DOMContentLoaded", () => {
  function setEqualHeight() {
    const items = document.querySelectorAll(".who-is-the-course__item");
    let maxHeight = 0;
    items.forEach((item) => {
      item.style.height = "auto";
    });
    items.forEach((item) => {
      const height = item.offsetHeight;
      if (height > maxHeight) {
        maxHeight = height;
      }
    });
    items.forEach((item) => {
      item.style.height = maxHeight + "px";
    });
  }
  setEqualHeight();
  window.addEventListener("resize", setEqualHeight);
});
document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll(".video-block");
  videos.forEach((videoBlock) => {
    const video = videoBlock.querySelector("video");
    const nav = videoBlock.querySelector(".nav-video");
    const playBtn = videoBlock.querySelector("[data-play]");
    const pauseBtn = videoBlock.querySelector("[data-pause]");
    const muteBtn = videoBlock.querySelector("[data-mute]");
    const fullscreenBtn = videoBlock.querySelector("[data-fullscreen]");
    const fullscreenIcon = fullscreenBtn?.querySelector("img");
    const muteIcon = muteBtn?.querySelector("img");
    let hideTimeout;
    if (!video) return;
    video.muted = true;
    if (pauseBtn) pauseBtn.style.display = "none";
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      video.controls = true;
      if (nav) nav.style.display = "none";
    }
    function showControls() {
      clearTimeout(hideTimeout);
      nav?.classList.remove("hidden");
      if (!video.paused && document.fullscreenElement === videoBlock) {
        hideTimeout = setTimeout(() => nav?.classList.add("hidden"), 2e3);
      }
    }
    function hideControls() {
      if (!video.paused && document.fullscreenElement === videoBlock) {
        nav?.classList.add("hidden");
      }
    }
    function updateButtons() {
      if (!playBtn || !pauseBtn) return;
      if (video.paused) {
        playBtn.style.display = "block";
        pauseBtn.style.display = "none";
        nav?.classList.remove("hidden");
      } else {
        playBtn.style.display = "none";
        pauseBtn.style.display = "block";
      }
    }
    playBtn?.addEventListener("click", () => {
      video.play();
      updateButtons();
      showControls();
    });
    pauseBtn?.addEventListener("click", () => {
      video.pause();
      updateButtons();
      showControls();
    });
    video.addEventListener("play", updateButtons);
    video.addEventListener("pause", updateButtons);
    muteBtn?.addEventListener("click", () => {
      video.muted = !video.muted;
      if (muteIcon) {
        muteIcon.src = video.muted ? "assets/img/icons/sound-off.svg" : "assets/img/icons/sound-on.svg";
      }
    });
    fullscreenBtn?.addEventListener("click", () => {
      if (document.fullscreenElement === videoBlock) {
        document.exitFullscreen();
      } else {
        videoBlock.requestFullscreen?.();
      }
    });
    videoBlock.addEventListener("mouseenter", showControls);
    videoBlock.addEventListener("mousemove", showControls);
    videoBlock.addEventListener("mouseleave", hideControls);
    videoBlock.addEventListener("touchstart", () => {
      if (nav?.classList.contains("hidden")) {
        showControls();
      } else if (!video.paused) {
        nav?.classList.add("hidden");
      }
    });
    document.addEventListener("fullscreenchange", () => {
      const box = videoBlock.querySelector(".video-block__box");
      if (document.fullscreenElement === videoBlock) {
        if (fullscreenIcon) fullscreenIcon.src = "assets/img/icons/fullscreen-exit.svg";
        video.style.objectFit = "contain";
        hideTimeout = setTimeout(() => nav?.classList.add("hidden"), 2e3);
        if (box) box.style.maxWidth = "100%";
      } else {
        if (fullscreenIcon) fullscreenIcon.src = "assets/img/icons/fullscreen.svg";
        video.style.objectFit = "cover";
        nav?.classList.remove("hidden");
        clearTimeout(hideTimeout);
        if (box) box.style.maxWidth = "580px";
      }
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) video.pause();
      });
    }, { threshold: 0.25 });
    observer.observe(video);
  });
});
