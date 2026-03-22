import { d as dataMediaQueries, s as slideToggle, a as slideUp } from "./common.min.js";
function spollers() {
  const spollersArray = document.querySelectorAll("[data-fls-spollers]");
  if (spollersArray.length > 0) {
    let initSpollers = function(spollersArray2, matchMedia = false) {
      spollersArray2.forEach((spollersBlock) => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("--spoller-init");
          initSpollerBody(spollersBlock);
        } else {
          spollersBlock.classList.remove("--spoller-init");
          initSpollerBody(spollersBlock, false);
        }
      });
    }, initSpollerBody = function(spollersBlock, hideSpollerBody = true) {
      let spollerItems = spollersBlock.querySelectorAll("details");
      if (spollerItems.length) {
        spollerItems.forEach((spollerItem) => {
          let spollerTitle = spollerItem.querySelector("summary");
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerItem.hasAttribute("data-fls-spollers-open")) {
              spollerItem.open = false;
              spollerTitle.nextElementSibling.hidden = true;
            } else {
              spollerTitle.classList.add("--spoller-active");
              spollerItem.open = true;
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            spollerTitle.classList.remove("--spoller-active");
            spollerItem.open = true;
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }, setSpollerAction = function(e) {
      const el = e.target;
      if (el.closest("summary") && el.closest("[data-fls-spollers]")) {
        e.preventDefault();
        if (el.closest("[data-fls-spollers]").classList.contains("--spoller-init")) {
          const spollerTitle = el.closest("summary");
          const spollerBlock = spollerTitle.closest("details");
          const spollersBlock = spollerTitle.closest("[data-fls-spollers]");
          const oneSpoller = spollersBlock.hasAttribute("data-fls-spollers-one");
          const scrollSpoller = spollerBlock.hasAttribute("data-fls-spollers-scroll");
          const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
          if (!spollersBlock.querySelectorAll(".--slide").length) {
            if (oneSpoller && !spollerBlock.open) {
              hideSpollersBody(spollersBlock);
            }
            !spollerBlock.open ? spollerBlock.open = true : setTimeout(() => {
              spollerBlock.open = false;
            }, spollerSpeed);
            spollerTitle.classList.toggle("--spoller-active");
            slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
            if (scrollSpoller && spollerTitle.classList.contains("--spoller-active")) {
              const scrollSpollerValue = spollerBlock.dataset.flsSpollersScroll;
              const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
              const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-fls-spollers-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
              window.scrollTo(
                {
                  top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                  behavior: "smooth"
                }
              );
            }
          }
        }
      }
      if (!el.closest("[data-fls-spollers]")) {
        const spollersClose = document.querySelectorAll("[data-fls-spollers-close]");
        if (spollersClose.length) {
          spollersClose.forEach((spollerClose) => {
            const spollersBlock = spollerClose.closest("[data-fls-spollers]");
            const spollerCloseBlock = spollerClose.parentNode;
            if (spollersBlock.classList.contains("--spoller-init")) {
              const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
              spollerClose.classList.remove("--spoller-active");
              slideUp(spollerClose.nextElementSibling, spollerSpeed);
              setTimeout(() => {
                spollerCloseBlock.open = false;
              }, spollerSpeed);
            }
          });
        }
      }
    }, hideSpollersBody = function(spollersBlock) {
      const spollerActiveBlock = spollersBlock.querySelector("details[open]");
      if (spollerActiveBlock && !spollersBlock.querySelectorAll(".--slide").length) {
        const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
        const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
        spollerActiveTitle.classList.remove("--spoller-active");
        slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        setTimeout(() => {
          spollerActiveBlock.open = false;
        }, spollerSpeed);
      }
    };
    document.addEventListener("click", setSpollerAction);
    const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
      return !item.dataset.flsSpollers.split(",")[0];
    });
    if (spollersRegular.length) {
      initSpollers(spollersRegular);
    }
    let mdQueriesArray = dataMediaQueries(spollersArray, "flsSpollers");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        mdQueriesItem.matchMedia.addEventListener("change", function() {
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }
}
window.addEventListener("load", spollers);
let iti = null;
document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#phone");
  if (input) {
    iti = window.intlTelInput(input, {
      // <-- тепер через window.intlTelInput
      initialCountry: "pl",
      separateDialCode: true,
      // utilsScript можна підключити через CDN, якщо потрібно
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
      geoIpLookup: (callback) => {
        fetch("https://ipapi.co/json").then((res) => res.json()).then((data) => callback(data.country_code)).catch(() => callback("us"));
      }
    });
  }
  const form = document.querySelector(".form");
  if (!form) return;
  const phoneInput = form.querySelector('input[name="tel"]');
  const phoneLine = form.querySelector(".form__line--phone");
  const nameInput = form.querySelector('input[name="name"]');
  const nameLine = form.querySelector(".form__line--name");
  const phoneFullInput = form.querySelector('input[name="tel-send"]');
  const textarea = form.querySelector(".form__textarea");
  const errorMsg = document.querySelector(".form__valid--textarea");
  const checkbox = form.querySelector('input[name="checkbox"]');
  const maxLength = 500;
  if (phoneInput) {
    phoneInput.addEventListener("input", function() {
      this.value = this.value.replace(/\D/g, "").slice(0, 11);
    });
  }
  form.addEventListener("submit", (e) => {
    let isValid = true;
    const phoneValue = phoneInput.value.trim();
    if (/^\d{9,11}$/.test(phoneValue)) {
      phoneLine.classList.remove("error");
      phoneLine.classList.add("success");
    } else {
      phoneLine.classList.remove("success");
      phoneLine.classList.add("error");
      isValid = false;
    }
    const nameValue = nameInput.value.trim();
    if (/^[A-Za-zА-Яа-яІіЇїЄєҐґʼ’\-]{2,}( [A-Za-zА-Яа-яІіЇїЄєҐґʼ’\-]{2,})*$/.test(nameValue)) {
      nameLine.classList.remove("error");
      nameLine.classList.add("success");
    } else {
      nameLine.classList.remove("success");
      nameLine.classList.add("error");
      isValid = false;
    }
    if (textarea.value.length <= maxLength) {
      textarea.classList.remove("textarea--error");
      errorMsg.style.display = "none";
    } else {
      textarea.classList.add("textarea--error");
      errorMsg.style.display = "block";
      isValid = false;
    }
    if (!checkbox.checked) {
      isValid = false;
    }
    if (iti && phoneFullInput) {
      phoneFullInput.value = iti.getNumber();
    }
    if (!isValid) e.preventDefault();
  });
});
