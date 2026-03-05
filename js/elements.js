/* ============================================
   define.xml アカデミー - 要素辞書ページJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initElementsPage();
});

var currentFilter = "all";
var currentSearch = "";

function initElementsPage() {
  if (typeof DEFINE_ELEMENTS === "undefined") return;

  renderElements();
  initSearch();
  initFilters();
  scrollToHashElement();
}

/* --- 要素カテゴリ分類 --- */
function getElementCategory(el) {
  var defineExtensions = ["commentdef", "whereclausedef", "valuelistdef", "leaf", "documentref", "origin"];
  var codelistRelated = ["codelist", "codelistitem"];
  var methodRelated = ["methoddef", "formalexpression"];

  if (defineExtensions.indexOf(el.id) !== -1) return "define";
  if (codelistRelated.indexOf(el.id) !== -1) return "codelist";
  if (methodRelated.indexOf(el.id) !== -1) return "method";
  return "core";
}

/* --- 要素レンダリング --- */
function renderElements() {
  var container = document.getElementById("elements-list");
  var countEl = document.getElementById("element-count");
  if (!container) return;

  var filtered = DEFINE_ELEMENTS.filter(function (el) {
    // フィルター
    if (currentFilter !== "all" && getElementCategory(el) !== currentFilter) {
      return false;
    }
    // 検索
    if (currentSearch) {
      var searchLower = currentSearch.toLowerCase();
      return (
        el.name.toLowerCase().indexOf(searchLower) !== -1 ||
        el.description.toLowerCase().indexOf(searchLower) !== -1 ||
        el.id.toLowerCase().indexOf(searchLower) !== -1
      );
    }
    return true;
  });

  if (countEl) {
    countEl.textContent = filtered.length + " / " + DEFINE_ELEMENTS.length + " 要素を表示";
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="text-center text-light" style="padding: 3rem 0;">該当する要素が見つかりませんでした</div>';
    return;
  }

  var html = "";
  filtered.forEach(function (el) {
    html += buildElementCard(el);
  });

  container.innerHTML = html;
  initAccordions(container);
}

/* --- 要素カード構築 --- */
function buildElementCard(el) {
  var html = '';
  html += '<div class="accordion" id="' + el.id + '">';
  html += '<div class="accordion-header">';
  html += '<div>';
  html += '<span style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--color-primary-light);">&lt;' + escapeHtml(el.name) + '&gt;</span>';
  html += '<span class="badge badge-element" style="margin-left: 0.75rem;">' + getCategoryLabel(getElementCategory(el)) + '</span>';
  html += '</div>';
  html += '<span class="accordion-arrow">&#9660;</span>';
  html += '</div>';

  html += '<div class="accordion-body"><div class="accordion-content">';

  // 説明
  html += '<p>' + escapeHtml(el.description) + '</p>';

  // 属性テーブル
  if (el.attributes && el.attributes.length > 0) {
    html += '<h4 style="margin-top: 1.5rem;">属性一覧</h4>';
    html += '<div class="table-responsive" style="margin-top: 0.5rem;">';
    html += '<table class="data-table"><thead><tr>';
    html += '<th>属性名</th><th>型</th><th>必須</th><th>説明</th>';
    html += '</tr></thead><tbody>';
    el.attributes.forEach(function (attr) {
      html += '<tr>';
      html += '<td data-label="属性名"><code style="font-family: var(--font-mono); color: var(--color-accent-dark);">' + escapeHtml(attr.name) + '</code></td>';
      html += '<td data-label="型"><span class="badge badge-type">' + escapeHtml(attr.type) + '</span></td>';
      html += '<td data-label="必須"><span class="badge ' + (attr.required ? 'badge-required' : 'badge-optional') + '">' + (attr.required ? '必須' : '任意') + '</span></td>';
      html += '<td data-label="説明">' + escapeHtml(attr.desc) + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table></div>';
  }

  // 子要素
  if (el.children && el.children.length > 0) {
    html += '<h4 style="margin-top: 1.5rem;">子要素</h4>';
    html += '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">';
    el.children.forEach(function (child) {
      html += '<span class="badge badge-element" style="cursor: pointer;" onclick="scrollToElement(\'' + child.replace('def:', '').toLowerCase() + '\')">' + escapeHtml(child) + '</span>';
    });
    html += '</div>';
  }

  // XMLコード例
  if (el.example) {
    html += '<h4 style="margin-top: 1.5rem;">XMLコード例</h4>';
    html += '<div class="xml-code" style="margin-top: 0.5rem;"><pre>' + highlightXml(escapeHtml(el.example)) + '</pre></div>';
  }

  html += '</div></div>';
  html += '</div>';

  return html;
}

/* --- XMLシンタックスハイライト --- */
function highlightXml(str) {
  // タグ名
  str = str.replace(/(&lt;\/?)([\w:]+)/g, '<span class="tag">$1$2</span>');
  // 属性名=値
  str = str.replace(/([\w:.-]+)(=)(&quot;[^&]*&quot;)/g, '<span class="attr">$1</span>$2<span class="value">$3</span>');
  // 閉じ括弧
  str = str.replace(/(\/?&gt;)/g, '<span class="tag">$1</span>');
  return str;
}

/* --- カテゴリラベル --- */
function getCategoryLabel(cat) {
  var labels = {
    core: "コア要素",
    define: "define拡張",
    codelist: "コードリスト系",
    method: "メソッド系"
  };
  return labels[cat] || cat;
}

/* --- 検索初期化 --- */
function initSearch() {
  var searchInput = document.getElementById("element-search");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    currentSearch = this.value.trim();
    renderElements();
  });
}

/* --- フィルター初期化 --- */
function initFilters() {
  var filterContainer = document.getElementById("element-filters");
  if (!filterContainer) return;

  var tabs = filterContainer.querySelectorAll(".filter-tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      this.classList.add("active");
      currentFilter = this.getAttribute("data-filter");
      renderElements();
    });
  });
}

/* --- アコーディオン初期化 --- */
function initAccordions(container) {
  var headers = container.querySelectorAll(".accordion-header");
  headers.forEach(function (header) {
    header.addEventListener("click", function () {
      var accordion = this.closest(".accordion");
      accordion.classList.toggle("active");
    });
  });
}

/* --- 要素へのスクロール --- */
function scrollToElement(id) {
  var target = document.getElementById(id);
  if (target) {
    var accordion = target;
    if (!accordion.classList.contains("active")) {
      accordion.classList.add("active");
    }
    var headerHeight = document.querySelector(".site-header")
      ? document.querySelector(".site-header").offsetHeight
      : 0;
    var pos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
    window.scrollTo({ top: pos, behavior: "smooth" });
  }
}

/* --- ハッシュから要素を開く --- */
function scrollToHashElement() {
  var hash = window.location.hash;
  if (hash) {
    var id = hash.substring(1);
    setTimeout(function () {
      scrollToElement(id);
    }, 300);
  }
}

/* --- ユーティリティ --- */
function escapeHtml(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
