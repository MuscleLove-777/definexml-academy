/* ============================================
   define.xml アカデミー - XMLビルダーJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initBuilder();
});

var variables = [
  { name: "STUDYID", label: "Study Identifier", type: "text", length: "12", origin: "Predecessor", key: true, order: 1 },
  { name: "USUBJID", label: "Unique Subject Identifier", type: "text", length: "20", origin: "Predecessor", key: true, order: 2 },
  { name: "AGE", label: "Age", type: "integer", length: "8", origin: "Derived", key: false, order: 3 }
];

function initBuilder() {
  renderVariables();
  updatePreview();
  initFormListeners();
  initAddVarButton();
  initCopyButton();
}

/* --- 変数リスト表示 --- */
function renderVariables() {
  var container = document.getElementById("variables-container");
  if (!container) return;

  var html = "";
  variables.forEach(function (v, i) {
    html += '<div class="card" style="margin-bottom: 0.75rem; padding: 0.75rem;" data-var-index="' + i + '">';
    html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">';
    html += '<strong class="text-sm" style="color: var(--color-primary-light);">変数 ' + (i + 1) + '</strong>';
    html += '<button class="btn btn-sm" style="color: var(--color-warning); font-size: 0.8rem;" onclick="removeVariable(' + i + ')">削除</button>';
    html += '</div>';

    html += '<div class="form-row" style="margin-bottom: 0.5rem;">';
    html += '<div class="form-group" style="margin-bottom: 0;">';
    html += '<label class="form-label">変数名</label>';
    html += '<input type="text" class="form-input var-input" data-field="name" data-index="' + i + '" value="' + escapeAttr(v.name) + '">';
    html += '</div>';
    html += '<div class="form-group" style="margin-bottom: 0;">';
    html += '<label class="form-label">ラベル</label>';
    html += '<input type="text" class="form-input var-input" data-field="label" data-index="' + i + '" value="' + escapeAttr(v.label) + '">';
    html += '</div>';
    html += '</div>';

    html += '<div class="form-row" style="margin-bottom: 0.5rem;">';
    html += '<div class="form-group" style="margin-bottom: 0;">';
    html += '<label class="form-label">DataType</label>';
    html += '<select class="form-select var-input" data-field="type" data-index="' + i + '">';
    ["text", "integer", "float", "date", "datetime", "time"].forEach(function (t) {
      html += '<option value="' + t + '"' + (v.type === t ? ' selected' : '') + '>' + t + '</option>';
    });
    html += '</select>';
    html += '</div>';
    html += '<div class="form-group" style="margin-bottom: 0;">';
    html += '<label class="form-label">Length</label>';
    html += '<input type="number" class="form-input var-input" data-field="length" data-index="' + i + '" value="' + escapeAttr(v.length) + '">';
    html += '</div>';
    html += '</div>';

    html += '<div class="form-row">';
    html += '<div class="form-group" style="margin-bottom: 0;">';
    html += '<label class="form-label">Origin</label>';
    html += '<select class="form-select var-input" data-field="origin" data-index="' + i + '">';
    ["Predecessor", "Derived", "Assigned", "CRF", "Protocol"].forEach(function (o) {
      html += '<option value="' + o + '"' + (v.origin === o ? ' selected' : '') + '>' + o + '</option>';
    });
    html += '</select>';
    html += '</div>';
    html += '<div class="form-group" style="margin-bottom: 0;">';
    html += '<label class="form-label">Key変数</label>';
    html += '<select class="form-select var-input" data-field="key" data-index="' + i + '">';
    html += '<option value="true"' + (v.key ? ' selected' : '') + '>Yes</option>';
    html += '<option value="false"' + (!v.key ? ' selected' : '') + '>No</option>';
    html += '</select>';
    html += '</div>';
    html += '</div>';

    html += '</div>';
  });

  container.innerHTML = html;

  // 変数入力のリスナー
  var inputs = container.querySelectorAll(".var-input");
  inputs.forEach(function (input) {
    input.addEventListener("input", function () {
      var idx = parseInt(this.getAttribute("data-index"));
      var field = this.getAttribute("data-field");
      if (field === "key") {
        variables[idx][field] = this.value === "true";
      } else {
        variables[idx][field] = this.value;
      }
      updatePreview();
    });
    input.addEventListener("change", function () {
      var idx = parseInt(this.getAttribute("data-index"));
      var field = this.getAttribute("data-field");
      if (field === "key") {
        variables[idx][field] = this.value === "true";
      } else {
        variables[idx][field] = this.value;
      }
      updatePreview();
    });
  });
}

/* --- 変数追加 --- */
function initAddVarButton() {
  var btn = document.getElementById("add-var-btn");
  if (!btn) return;

  btn.addEventListener("click", function () {
    variables.push({
      name: "VAR" + (variables.length + 1),
      label: "Variable " + (variables.length + 1),
      type: "text",
      length: "20",
      origin: "Derived",
      key: false,
      order: variables.length + 1
    });
    renderVariables();
    updatePreview();
  });
}

/* --- 変数削除 --- */
function removeVariable(index) {
  if (variables.length <= 1) return;
  variables.splice(index, 1);
  renderVariables();
  updatePreview();
}

/* --- フォームリスナー --- */
function initFormListeners() {
  var dsFields = ["ds-name", "ds-label", "ds-purpose", "ds-structure", "ds-class", "ds-repeating"];
  dsFields.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", updatePreview);
      el.addEventListener("change", updatePreview);
    }
  });
}

/* --- XMLプレビュー更新 --- */
function updatePreview() {
  var preview = document.getElementById("xml-preview");
  if (!preview) return;

  var dsName = getVal("ds-name") || "ADSL";
  var dsLabel = getVal("ds-label") || "Dataset Label";
  var dsPurpose = getVal("ds-purpose") || "Analysis";
  var dsStructure = getVal("ds-structure") || "One record per subject";
  var dsClass = getVal("ds-class") || "SUBJECT LEVEL ANALYSIS DATASET";
  var dsRepeating = getVal("ds-repeating") || "No";

  var oid = "IG." + dsName;
  var lines = [];

  // ItemGroupDef
  lines.push('<span class="comment">&lt;!-- === ItemGroupDef: ' + esc(dsName) + ' === --&gt;</span>');
  lines.push('<span class="tag">&lt;ItemGroupDef</span>');
  lines.push('  <span class="attr">OID</span>=<span class="value">"' + esc(oid) + '"</span>');
  lines.push('  <span class="attr">Name</span>=<span class="value">"' + esc(dsName) + '"</span>');
  lines.push('  <span class="attr">SASDatasetName</span>=<span class="value">"' + esc(dsName) + '"</span>');
  lines.push('  <span class="attr">Repeating</span>=<span class="value">"' + esc(dsRepeating) + '"</span>');
  lines.push('  <span class="attr">IsReferenceData</span>=<span class="value">"No"</span>');
  lines.push('  <span class="attr">Purpose</span>=<span class="value">"' + esc(dsPurpose) + '"</span>');
  lines.push('  <span class="attr">def:Structure</span>=<span class="value">"' + esc(dsStructure) + '"</span>');
  lines.push('  <span class="attr">def:Class</span>=<span class="value">"' + esc(dsClass) + '"</span><span class="tag">&gt;</span>');
  lines.push('');
  lines.push('  <span class="tag">&lt;Description&gt;</span>');
  lines.push('    <span class="tag">&lt;TranslatedText</span> <span class="attr">xml:lang</span>=<span class="value">"en"</span><span class="tag">&gt;</span>' + esc(dsLabel) + '<span class="tag">&lt;/TranslatedText&gt;</span>');
  lines.push('  <span class="tag">&lt;/Description&gt;</span>');
  lines.push('');

  // ItemRef
  var keySeq = 1;
  variables.forEach(function (v, i) {
    var itemOID = "IT." + dsName + "." + (v.name || "VAR");
    var line = '  <span class="tag">&lt;ItemRef</span>';
    line += ' <span class="attr">ItemOID</span>=<span class="value">"' + esc(itemOID) + '"</span>';
    line += ' <span class="attr">OrderNumber</span>=<span class="value">"' + (i + 1) + '"</span>';
    line += ' <span class="attr">Mandatory</span>=<span class="value">"' + (v.key ? 'Yes' : 'No') + '"</span>';
    if (v.key) {
      line += ' <span class="attr">KeySequence</span>=<span class="value">"' + keySeq + '"</span>';
      keySeq++;
    }
    line += '<span class="tag">/&gt;</span>';
    lines.push(line);
  });

  lines.push('');
  lines.push('<span class="tag">&lt;/ItemGroupDef&gt;</span>');
  lines.push('');
  lines.push('');

  // ItemDef
  lines.push('<span class="comment">&lt;!-- === ItemDef: ' + esc(dsName) + ' variables === --&gt;</span>');
  variables.forEach(function (v) {
    var itemOID = "IT." + dsName + "." + (v.name || "VAR");
    lines.push('<span class="tag">&lt;ItemDef</span>');
    lines.push('  <span class="attr">OID</span>=<span class="value">"' + esc(itemOID) + '"</span>');
    lines.push('  <span class="attr">Name</span>=<span class="value">"' + esc(v.name) + '"</span>');
    lines.push('  <span class="attr">SASFieldName</span>=<span class="value">"' + esc(v.name) + '"</span>');
    lines.push('  <span class="attr">DataType</span>=<span class="value">"' + esc(v.type) + '"</span>');
    if (v.length) {
      lines.push('  <span class="attr">Length</span>=<span class="value">"' + esc(v.length) + '"</span><span class="tag">&gt;</span>');
    } else {
      lines.push('  <span class="tag">&gt;</span>');
    }
    lines.push('  <span class="tag">&lt;Description&gt;</span>');
    lines.push('    <span class="tag">&lt;TranslatedText</span> <span class="attr">xml:lang</span>=<span class="value">"en"</span><span class="tag">&gt;</span>' + esc(v.label) + '<span class="tag">&lt;/TranslatedText&gt;</span>');
    lines.push('  <span class="tag">&lt;/Description&gt;</span>');
    lines.push('  <span class="tag">&lt;def:Origin</span> <span class="attr">Type</span>=<span class="value">"' + esc(v.origin) + '"</span><span class="tag">/&gt;</span>');
    lines.push('<span class="tag">&lt;/ItemDef&gt;</span>');
    lines.push('');
  });

  preview.innerHTML = lines.join("\n");
}

/* --- コピーボタン --- */
function initCopyButton() {
  var btn = document.getElementById("copy-xml-btn");
  if (!btn) return;

  btn.addEventListener("click", function () {
    var preview = document.getElementById("xml-preview");
    if (!preview) return;

    // プレーンテキスト取得
    var text = preview.textContent || preview.innerText;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showCopied(btn);
      });
    } else {
      // Fallback
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showCopied(btn);
    }
  });
}

function showCopied(btn) {
  var originalText = btn.textContent;
  btn.textContent = "コピーしました!";
  btn.classList.add("copied");
  setTimeout(function () {
    btn.textContent = originalText;
    btn.classList.remove("copied");
  }, 2000);
}

/* --- ユーティリティ --- */
function getVal(id) {
  var el = document.getElementById(id);
  return el ? el.value : "";
}

function esc(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
