/* ============================================
   define.xml アカデミー - メインJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initHamburgerMenu();
  initNavDropdown();
  initElementCards();
  initDatasetTable();
  initGuideCards();
  initGlossaryCards();
  initSmoothScroll();
  initFadeInAnimation();
});

/* --- ハンバーガーメニュー開閉 --- */
function initHamburgerMenu() {
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobile-menu");

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    var isOpen = mobileMenu.classList.contains("active");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  var links = mobileMenu.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "メニューを開く");
      document.body.style.overflow = "";
    });
  });
}

/* --- デスクトップナビ ドロップダウン --- */
function initNavDropdown() {
  var dropdowns = document.querySelectorAll(".nav-dropdown");

  dropdowns.forEach(function (dropdown) {
    var toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdowns.forEach(function (other) {
        if (other !== dropdown) {
          other.classList.remove("active");
        }
      });
      dropdown.classList.toggle("active");
    });

    dropdown.addEventListener("mouseenter", function () {
      if (window.innerWidth >= 1024) {
        dropdown.classList.add("active");
      }
    });

    dropdown.addEventListener("mouseleave", function () {
      if (window.innerWidth >= 1024) {
        dropdown.classList.remove("active");
      }
    });
  });

  document.addEventListener("click", function () {
    dropdowns.forEach(function (dropdown) {
      dropdown.classList.remove("active");
    });
  });
}

/* --- 主要要素カード生成 --- */
function initElementCards() {
  var container = document.getElementById("element-cards");
  if (!container || typeof DEFINE_ELEMENTS === "undefined") return;

  var mainElements = DEFINE_ELEMENTS.slice(0, 8);
  var html = "";

  mainElements.forEach(function (el) {
    html +=
      '<div class="card">' +
        '<div class="card-title" style="font-family: var(--font-mono); color: var(--color-primary-light);">&lt;' + escapeHtml(el.name) + '&gt;</div>' +
        '<p class="card-text">' + escapeHtml(el.description.substring(0, 80)) + '...</p>' +
        '<a href="elements/index.html#' + el.id + '" class="card-link">詳細を見る &rarr;</a>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- データセットテーブル生成 --- */
function initDatasetTable() {
  var tableBody = document.getElementById("dataset-table-body");
  if (!tableBody || typeof DATASET_METADATA === "undefined") return;

  var html = "";
  DATASET_METADATA.forEach(function (ds) {
    html +=
      '<tr>' +
        '<td data-label="Dataset"><strong>' + escapeHtml(ds.Name) + '</strong></td>' +
        '<td data-label="Label">' + escapeHtml(ds.Label) + '</td>' +
        '<td data-label="Structure">' + escapeHtml(ds.Structure) + '</td>' +
        '<td data-label="Class"><span class="badge badge-element">' + escapeHtml(ds.Class) + '</span></td>' +
        '<td data-label="Keys">' + ds.Keys.map(function(k) { return escapeHtml(k); }).join(', ') + '</td>' +
      '</tr>';
  });

  tableBody.innerHTML = html;
}

/* --- 作成ガイドカード生成 --- */
function initGuideCards() {
  var container = document.getElementById("guide-cards");
  if (!container || typeof GUIDE_STEPS === "undefined") return;

  var html = "";
  GUIDE_STEPS.forEach(function (step) {
    html +=
      '<div class="card">' +
        '<div class="flex" style="align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">' +
          '<div class="guide-step-num">' + step.step + '</div>' +
          '<h3 class="card-title" style="margin-bottom: 0;">' + escapeHtml(step.title) + '</h3>' +
        '</div>' +
        '<p class="card-text">' + escapeHtml(step.description) + '</p>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- 用語カード生成（主要4つ） --- */
function initGlossaryCards() {
  var container = document.getElementById("glossary-cards");
  if (!container || typeof GLOSSARY === "undefined") return;

  var mainTerms = GLOSSARY.slice(0, 4);
  var html = "";

  mainTerms.forEach(function (item) {
    html +=
      '<div class="glossary-item">' +
        '<div class="glossary-term">' + escapeHtml(item.term) + '</div>' +
        '<div class="glossary-reading">' + escapeHtml(item.reading) + '</div>' +
        '<div class="glossary-definition">' + escapeHtml(item.definition) + '</div>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- スムーズスクロール --- */
function initSmoothScroll() {
  var links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href === "#") return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector(".site-header")
          ? document.querySelector(".site-header").offsetHeight
          : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });
}

/* --- フェードインアニメーション --- */
function initFadeInAnimation() {
  var fadeElements = document.querySelectorAll(".fade-in");
  if (fadeElements.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    fadeElements.forEach(function (el) {
      el.classList.add("visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });
}

/* --- ユーティリティ: HTMLエスケープ --- */
function escapeHtml(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
