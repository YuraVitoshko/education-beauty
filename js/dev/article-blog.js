import "./common.min2.js";
import "./slider.min.js";
import "./watcher.min.js";
import "./index.min2.js";
import "./common.min.js";
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-article-blog__item");
  const articles = document.querySelectorAll(".article-blog__item");
  articles.forEach((article, index) => {
    const articleId = "article-" + index;
    article.setAttribute("id", articleId);
    if (navItems[index]) {
      navItems[index].addEventListener("click", () => {
        const target = document.getElementById(articleId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  });
});
