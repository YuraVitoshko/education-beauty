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
  const isMobile = () => window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
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
    let controlsLocked = false;
    if (!video) return;
    video.muted = true;
    video.autoplay = false;
    pauseBtn && (pauseBtn.style.display = "none");
    if (isIOS) {
      video.controls = true;
      nav && (nav.style.display = "none");
    } else {
      video.controls = false;
      nav && (nav.style.display = "flex");
    }
    const pauseOtherVideos = () => {
      videos.forEach((vb) => {
        const other = vb.querySelector("video");
        if (other !== video && !other.paused) other.pause();
      });
    };
    const showControls = () => {
      clearTimeout(hideTimeout);
      nav?.classList.remove("hidden");
      if (nav) {
        nav.style.opacity = "1";
        nav.style.transition = "opacity 0.2s";
      }
    };
    const hideControls = (delay = 1e3) => {
      const isFullscreen = document.fullscreenElement === videoBlock;
      if (isAndroid && controlsLocked && !isFullscreen) return;
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        if (!video.paused) {
          nav?.classList.add("hidden");
          if (nav) nav.style.opacity = "0";
        }
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
    video.addEventListener("play", () => {
      pauseOtherVideos();
      updateButtons();
      const isFullscreen = document.fullscreenElement === videoBlock;
      if (isAndroid && isFullscreen) hideControls(500);
      else if (!isAndroid) hideControls(1e3);
    });
    video.addEventListener("pause", () => {
      updateButtons();
      showControls();
      if (isAndroid) controlsLocked = true;
      clearTimeout(hideTimeout);
    });
    playBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      const isFullscreen = document.fullscreenElement === videoBlock;
      controlsLocked = false;
      pauseOtherVideos();
      video.play();
      updateButtons();
      if (isAndroid && isFullscreen) hideControls(500);
      else if (!isAndroid && isFullscreen) hideControls(1e3);
      else showControls();
    });
    pauseBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      video.pause();
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
      const box = videoBlock.querySelector(".video-block__box");
      if (document.fullscreenElement === videoBlock) {
        fullscreenIcon && (fullscreenIcon.src = "assets/img/icons/fullscreen-exit.svg");
        video.style.objectFit = "contain";
        showControls();
        hideControls(1e3);
        video.style.width = window.innerWidth + "px";
        video.style.height = window.innerHeight + "px";
        if (box) box.style.maxWidth = "100%";
        if (isAndroid) {
          const adjustVideoSize = () => {
            video.style.width = window.innerWidth + "px";
            video.style.height = window.innerHeight + "px";
          };
          window.addEventListener("resize", adjustVideoSize);
          videoBlock._androidResizeHandler = adjustVideoSize;
        }
      } else {
        fullscreenIcon && (fullscreenIcon.src = "assets/img/icons/fullscreen.svg");
        video.style.objectFit = "cover";
        video.style.width = "";
        video.style.height = "";
        nav?.classList.remove("hidden");
        if (box) box.style.maxWidth = "580px";
        if (isAndroid && videoBlock._androidResizeHandler) {
          window.removeEventListener("resize", videoBlock._androidResizeHandler);
          delete videoBlock._androidResizeHandler;
        }
      }
    });
    if (!isMobile()) {
      videoBlock.addEventListener("mousemove", () => {
        showControls();
        hideControls(500);
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
    } else {
      videoBlock.addEventListener("touchstart", () => showControls());
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) video.pause();
      });
    }, { threshold: 0.25 });
    observer.observe(video);
  });
});
