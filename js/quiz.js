/* ============================================
   define.xml アカデミー - クイズページJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initQuiz();
});

var currentQuestion = 0;
var score = 0;
var answered = false;
var userAnswers = [];

function initQuiz() {
  var startBtn = document.getElementById("start-quiz-btn");
  if (startBtn) {
    startBtn.addEventListener("click", startQuiz);
  }
}

/* --- クイズ開始 --- */
function startQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  userAnswers = [];

  document.getElementById("quiz-start").style.display = "none";
  document.getElementById("quiz-active").style.display = "block";
  document.getElementById("quiz-result").style.display = "none";

  renderQuestion();
}

/* --- 問題表示 --- */
function renderQuestion() {
  if (typeof QUIZ_DATA === "undefined") return;

  var q = QUIZ_DATA[currentQuestion];
  var card = document.getElementById("quiz-question-card");
  var progressFill = document.getElementById("quiz-progress-fill");
  var progressText = document.getElementById("quiz-progress-text");

  answered = false;

  // プログレス更新
  var progress = ((currentQuestion) / QUIZ_DATA.length) * 100;
  progressFill.style.width = progress + "%";
  progressText.textContent = (currentQuestion + 1) + " / " + QUIZ_DATA.length;

  var html = '';
  html += '<div class="quiz-question-num">Q' + q.id + '</div>';
  html += '<div class="quiz-question-text">' + escapeHtml(q.question) + '</div>';

  html += '<div class="quiz-choices">';
  var markers = ["A", "B", "C", "D"];
  q.choices.forEach(function (choice, i) {
    html += '<div class="quiz-choice" data-index="' + i + '">';
    html += '<span class="quiz-choice-marker">' + markers[i] + '</span>';
    html += '<span>' + escapeHtml(choice) + '</span>';
    html += '</div>';
  });
  html += '</div>';

  html += '<div class="quiz-explanation" id="quiz-explanation"></div>';

  html += '<div class="quiz-nav">';
  html += '<div></div>';
  html += '<button class="btn btn-primary" id="next-btn" style="display: none;">次の問題 &#8594;</button>';
  html += '</div>';

  card.innerHTML = html;

  // 選択肢クリックイベント
  var choices = card.querySelectorAll(".quiz-choice");
  choices.forEach(function (choice) {
    choice.addEventListener("click", function () {
      if (answered) return;
      selectAnswer(parseInt(this.getAttribute("data-index")));
    });
  });
}

/* --- 回答選択 --- */
function selectAnswer(index) {
  if (answered) return;
  answered = true;

  var q = QUIZ_DATA[currentQuestion];
  var isCorrect = index === q.answer;

  if (isCorrect) {
    score++;
  }

  userAnswers.push({
    question: currentQuestion,
    selected: index,
    correct: q.answer,
    isCorrect: isCorrect
  });

  // 選択肢のスタイル更新
  var choices = document.querySelectorAll(".quiz-choice");
  choices.forEach(function (choice, i) {
    if (i === q.answer) {
      choice.classList.add("correct");
    } else if (i === index && !isCorrect) {
      choice.classList.add("incorrect");
    }
    if (i === index) {
      choice.classList.add("selected");
    }
  });

  // 解説表示
  var explanation = document.getElementById("quiz-explanation");
  if (explanation) {
    explanation.classList.add("show");
    explanation.classList.add(isCorrect ? "correct" : "incorrect");
    explanation.innerHTML =
      '<strong>' + (isCorrect ? '正解!' : '不正解...') + '</strong><br>' +
      escapeHtml(q.explanation);
  }

  // 次へボタン表示
  var nextBtn = document.getElementById("next-btn");
  if (nextBtn) {
    nextBtn.style.display = "inline-flex";

    if (currentQuestion >= QUIZ_DATA.length - 1) {
      nextBtn.textContent = "結果を見る";
    }

    nextBtn.addEventListener("click", function () {
      currentQuestion++;
      if (currentQuestion >= QUIZ_DATA.length) {
        showResult();
      } else {
        renderQuestion();
      }
    });
  }
}

/* --- 結果表示 --- */
function showResult() {
  document.getElementById("quiz-active").style.display = "none";
  document.getElementById("quiz-result").style.display = "block";

  // プログレス完了
  var progressFill = document.getElementById("quiz-progress-fill");
  if (progressFill) progressFill.style.width = "100%";

  var resultContent = document.getElementById("quiz-result-content");
  if (!resultContent || typeof QUIZ_RESULTS === "undefined") return;

  // 結果判定
  var resultKey = "novice";
  var keys = Object.keys(QUIZ_RESULTS);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (score >= QUIZ_RESULTS[key].min) {
      resultKey = key;
      break;
    }
  }

  var result = QUIZ_RESULTS[resultKey];

  var html = '';
  html += '<div class="quiz-score">' + score + ' / ' + QUIZ_DATA.length + '</div>';
  html += '<div class="quiz-result-title">' + escapeHtml(result.title) + '</div>';
  html += '<div class="quiz-result-desc">' + escapeHtml(result.description) + '</div>';
  html += '<p class="text-sm text-light">' + escapeHtml(result.advice) + '</p>';

  // 回答一覧
  html += '<div style="text-align: left; margin-top: 2rem;">';
  html += '<h3 style="margin-bottom: 1rem; text-align: center;">回答一覧</h3>';

  userAnswers.forEach(function (ua) {
    var q = QUIZ_DATA[ua.question];
    var icon = ua.isCorrect ? '<span style="color: var(--color-success);">&#10003;</span>' : '<span style="color: var(--color-warning);">&#10007;</span>';
    html += '<div style="padding: 0.75rem 0; border-bottom: 1px solid var(--color-border);">';
    html += '<div class="flex-between" style="gap: 1rem;">';
    html += '<div>';
    html += '<span class="text-sm text-light">Q' + q.id + '</span> ';
    html += icon + ' ';
    html += '<span class="text-sm">' + escapeHtml(q.question.substring(0, 60)) + (q.question.length > 60 ? '...' : '') + '</span>';
    html += '</div>';
    html += '</div>';
    if (!ua.isCorrect) {
      html += '<div class="text-sm" style="margin-top: 0.25rem; padding-left: 2.5rem;">';
      html += '<span class="text-light">正解: </span><strong>' + escapeHtml(q.choices[q.answer]) + '</strong>';
      html += '</div>';
    }
    html += '</div>';
  });

  html += '</div>';

  // ボタン
  html += '<div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">';
  html += '<button class="btn btn-primary" onclick="startQuiz()">もう一度挑戦</button>';
  html += '<a href="../basics/index.html" class="btn btn-outline">基礎を復習する</a>';
  html += '</div>';

  resultContent.innerHTML = html;
}

/* --- ユーティリティ --- */
function escapeHtml(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
