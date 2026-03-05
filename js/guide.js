/* ============================================
   define.xml アカデミー - 作成ガイドページJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initGuideSidebar();
  initGuideContent();
  initToolsGrid();
});

var activeStep = 0;

/* --- サイドバー生成 --- */
function initGuideSidebar() {
  var sidebar = document.getElementById("guide-sidebar");
  if (!sidebar || typeof GUIDE_STEPS === "undefined") return;

  var html = "";
  GUIDE_STEPS.forEach(function (step, i) {
    var activeClass = i === 0 ? " active" : "";
    html +=
      '<div class="guide-sidebar-item' + activeClass + '" data-step="' + i + '">' +
        '<div class="guide-step-num">' + step.step + '</div>' +
        '<div class="guide-sidebar-title">' + escapeHtml(step.title) + '</div>' +
      '</div>';
  });

  sidebar.innerHTML = html;

  // クリックイベント
  var items = sidebar.querySelectorAll(".guide-sidebar-item");
  items.forEach(function (item) {
    item.addEventListener("click", function () {
      var stepIndex = parseInt(this.getAttribute("data-step"));
      setActiveStep(stepIndex);
    });
  });
}

/* --- ガイドコンテンツ生成 --- */
function initGuideContent() {
  var main = document.getElementById("guide-main");
  if (!main || typeof GUIDE_STEPS === "undefined") return;

  var html = "";
  GUIDE_STEPS.forEach(function (step, i) {
    var activeClass = i === 0 ? " active" : "";
    html += '<div class="guide-content' + activeClass + '" id="guide-step-' + i + '">';

    html += '<div class="card">';
    html += '<div class="flex" style="align-items: center; gap: 1rem; margin-bottom: 1.5rem;">';
    html += '<div class="guide-step-num" style="width: 3rem; height: 3rem; font-size: 1.25rem;">' + step.step + '</div>';
    html += '<div>';
    html += '<h2 style="margin-bottom: 0.25rem;">' + escapeHtml(step.title) + '</h2>';
    html += '<p class="text-light text-sm" style="margin-bottom: 0;">ステップ ' + step.step + ' / 6</p>';
    html += '</div>';
    html += '</div>';

    html += '<p style="font-size: 1.05rem; line-height: 1.8;">' + escapeHtml(step.description) + '</p>';

    // 詳細リスト
    if (step.details && step.details.length > 0) {
      html += '<h3 style="margin-top: 1.5rem;">詳細手順</h3>';
      html += '<ul class="guide-detail-list">';
      step.details.forEach(function (detail) {
        html += '<li>' + escapeHtml(detail) + '</li>';
      });
      html += '</ul>';
    }

    // TIPS
    if (step.tips) {
      html += '<div class="guide-tips">' + escapeHtml(step.tips) + '</div>';
    }

    // ナビゲーション
    html += '<div style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--color-border);">';
    if (i > 0) {
      html += '<button class="btn btn-outline btn-sm" onclick="setActiveStep(' + (i - 1) + ')">&#8592; 前のステップ</button>';
    } else {
      html += '<div></div>';
    }
    if (i < GUIDE_STEPS.length - 1) {
      html += '<button class="btn btn-primary btn-sm" onclick="setActiveStep(' + (i + 1) + ')">次のステップ &#8594;</button>';
    } else {
      html += '<a href="../tools/builder.html" class="btn btn-primary btn-sm">XMLビルダーへ &#8594;</a>';
    }
    html += '</div>';

    html += '</div>';
    html += '</div>';
  });

  main.innerHTML = html;
}

/* --- アクティブステップ切替 --- */
function setActiveStep(index) {
  activeStep = index;

  // サイドバー更新
  var sidebarItems = document.querySelectorAll(".guide-sidebar-item");
  sidebarItems.forEach(function (item, i) {
    item.classList.toggle("active", i === index);
  });

  // コンテンツ更新
  var contents = document.querySelectorAll(".guide-content");
  contents.forEach(function (content, i) {
    content.classList.toggle("active", i === index);
  });

  // スクロール
  var guideMain = document.getElementById("guide-main");
  if (guideMain) {
    var headerHeight = document.querySelector(".site-header")
      ? document.querySelector(".site-header").offsetHeight
      : 0;
    var pos = guideMain.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
    window.scrollTo({ top: pos, behavior: "smooth" });
  }
}

/* --- ツール一覧生成 --- */
function initToolsGrid() {
  var container = document.getElementById("tools-grid");
  if (!container || typeof TOOLS_DATA === "undefined") return;

  var html = "";
  TOOLS_DATA.forEach(function (tool) {
    html += '<div class="tool-card">';

    // レーティング
    html += '<div class="tool-rating">';
    for (var i = 1; i <= 5; i++) {
      html += '<span class="tool-star' + (i > tool.rating ? ' empty' : '') + '">&#9733;</span>';
    }
    html += '</div>';

    html += '<div class="tool-name">' + escapeHtml(tool.name) + '</div>';
    html += '<div class="tool-vendor">' + escapeHtml(tool.vendor) + '</div>';
    html += '<p class="card-text">' + escapeHtml(tool.description) + '</p>';

    // 機能タグ
    html += '<div class="tool-features">';
    tool.features.forEach(function (f) {
      html += '<span class="tool-feature-tag">' + escapeHtml(f) + '</span>';
    });
    html += '</div>';

    html += '<p class="text-sm text-light" style="margin-top: 0.5rem;">価格: ' + escapeHtml(tool.pricing) + '</p>';

    html += '</div>';
  });

  container.innerHTML = html;
}

/* --- ユーティリティ --- */
function escapeHtml(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
