/* ============================================
   define.xml アカデミー - XML構造ページJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initStructureTree();
  initNodeDetails();
  initFullCodeExample();
  initExpandCollapseButtons();
});

/* --- ツリービュー生成 --- */
function initStructureTree() {
  var container = document.getElementById("xml-tree-structure");
  if (!container || typeof XML_TREE_DATA === "undefined") return;

  container.innerHTML = buildTreeNode(XML_TREE_DATA, 0);
  initTreeToggle(container);
}

function buildTreeNode(node, depth) {
  var hasChildren = node.children && node.children.length > 0;
  var html = '<div class="xml-tree-node" style="padding-left: ' + (depth * 1.5) + 'rem;">';

  html += '<div class="xml-tree-label" data-depth="' + depth + '">';

  if (hasChildren) {
    html += '<span class="xml-tree-toggle">-</span>';
  } else {
    html += '<span style="width: 1.2rem; display: inline-block;"></span>';
  }

  html += '<span class="xml-tree-tag">&lt;' + escapeHtml(node.tag) + '&gt;</span>';

  if (node.attrs) {
    html += '<span class="xml-tree-attrs">' + escapeHtml(node.attrs) + '</span>';
  }

  if (node.desc) {
    html += '<span class="xml-tree-desc">// ' + escapeHtml(node.desc) + '</span>';
  }

  html += '</div>';

  if (hasChildren) {
    html += '<div class="xml-tree-children">';
    node.children.forEach(function (child) {
      html += buildTreeNode(child, depth + 1);
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function initTreeToggle(container) {
  var toggles = container.querySelectorAll(".xml-tree-toggle");
  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var node = this.closest(".xml-tree-node");
      var children = node.querySelector(".xml-tree-children");

      if (!children) return;

      if (children.classList.contains("collapsed")) {
        children.classList.remove("collapsed");
        this.textContent = "-";
        this.classList.remove("collapsed");
      } else {
        children.classList.add("collapsed");
        this.textContent = "+";
        this.classList.add("collapsed");
      }
    });

    var label = toggle.closest(".xml-tree-label");
    label.addEventListener("click", function () {
      toggle.click();
    });
  });
}

/* --- 展開/折りたたみボタン --- */
function initExpandCollapseButtons() {
  var expandBtn = document.getElementById("expand-all-btn");
  var collapseBtn = document.getElementById("collapse-all-btn");
  var container = document.getElementById("xml-tree-structure");

  if (!expandBtn || !collapseBtn || !container) return;

  expandBtn.addEventListener("click", function () {
    var children = container.querySelectorAll(".xml-tree-children");
    var toggles = container.querySelectorAll(".xml-tree-toggle");
    children.forEach(function (c) { c.classList.remove("collapsed"); });
    toggles.forEach(function (t) { t.textContent = "-"; t.classList.remove("collapsed"); });
  });

  collapseBtn.addEventListener("click", function () {
    var children = container.querySelectorAll(".xml-tree-children");
    var toggles = container.querySelectorAll(".xml-tree-toggle");
    children.forEach(function (c) { c.classList.add("collapsed"); });
    toggles.forEach(function (t) { t.textContent = "+"; t.classList.add("collapsed"); });
  });
}

/* --- ノード説明リスト生成 --- */
function initNodeDetails() {
  var container = document.getElementById("node-details-list");
  if (!container || typeof DEFINE_ELEMENTS === "undefined") return;

  var coreElements = DEFINE_ELEMENTS.slice(0, 8);
  var html = "";

  coreElements.forEach(function (el) {
    html += '<div class="accordion" id="node-' + el.id + '">';
    html += '<div class="accordion-header">';
    html += '<span style="font-family: var(--font-mono);">&lt;' + escapeHtml(el.name) + '&gt; <span class="text-sm text-light" style="font-family: var(--font-family);">- ' + escapeHtml(el.description.substring(0, 60)) + '...</span></span>';
    html += '<span class="accordion-arrow">&#9660;</span>';
    html += '</div>';
    html += '<div class="accordion-body"><div class="accordion-content">';
    html += '<p>' + escapeHtml(el.description) + '</p>';

    if (el.attributes && el.attributes.length > 0) {
      html += '<h4 style="margin-top: 1rem;">属性一覧</h4>';
      html += '<div class="table-responsive" style="margin-top: 0.5rem;">';
      html += '<table class="data-table"><thead><tr>';
      html += '<th>属性名</th><th>型</th><th>必須</th><th>説明</th>';
      html += '</tr></thead><tbody>';
      el.attributes.forEach(function (attr) {
        html += '<tr>';
        html += '<td data-label="属性名" style="font-family: var(--font-mono); font-weight: 600;">' + escapeHtml(attr.name) + '</td>';
        html += '<td data-label="型"><span class="badge badge-type">' + escapeHtml(attr.type) + '</span></td>';
        html += '<td data-label="必須"><span class="badge ' + (attr.required ? 'badge-required' : 'badge-optional') + '">' + (attr.required ? '必須' : '任意') + '</span></td>';
        html += '<td data-label="説明">' + escapeHtml(attr.desc) + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div>';
    }

    if (el.children && el.children.length > 0) {
      html += '<h4 style="margin-top: 1rem;">子要素</h4>';
      html += '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">';
      el.children.forEach(function (child) {
        html += '<span class="badge badge-element">' + escapeHtml(child) + '</span>';
      });
      html += '</div>';
    }

    html += '</div></div>';
    html += '</div>';
  });

  container.innerHTML = html;
  initAccordions(container);
}

function initAccordions(container) {
  var headers = container.querySelectorAll(".accordion-header");
  headers.forEach(function (header) {
    header.addEventListener("click", function () {
      var accordion = this.closest(".accordion");
      accordion.classList.toggle("active");
    });
  });
}

/* --- フルコード例 --- */
function initFullCodeExample() {
  var container = document.getElementById("full-code-example");
  if (!container) return;

  var lines = [
    '<span class="tag">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</span>',
    '<span class="tag">&lt;ODM</span> <span class="attr">xmlns</span>=<span class="value">"http://www.cdisc.org/ns/odm/v1.3"</span>',
    '     <span class="attr">xmlns:def</span>=<span class="value">"http://www.cdisc.org/ns/def/v2.1"</span>',
    '     <span class="attr">xmlns:xlink</span>=<span class="value">"http://www.w3.org/1999/xlink"</span>',
    '     <span class="attr">ODMVersion</span>=<span class="value">"1.3.2"</span>',
    '     <span class="attr">FileType</span>=<span class="value">"Snapshot"</span>',
    '     <span class="attr">FileOID</span>=<span class="value">"DEF.STUDY001.ADaM"</span>',
    '     <span class="attr">CreationDateTime</span>=<span class="value">"2024-01-15T10:00:00"</span><span class="tag">&gt;</span>',
    '',
    '  <span class="tag">&lt;Study</span> <span class="attr">OID</span>=<span class="value">"STUDY001"</span><span class="tag">&gt;</span>',
    '    <span class="tag">&lt;GlobalVariables&gt;</span>',
    '      <span class="tag">&lt;StudyName&gt;</span>CDISC01<span class="tag">&lt;/StudyName&gt;</span>',
    '      <span class="tag">&lt;StudyDescription&gt;</span>Phase III Safety and Efficacy Study<span class="tag">&lt;/StudyDescription&gt;</span>',
    '      <span class="tag">&lt;ProtocolName&gt;</span>CDISC01-PROTO<span class="tag">&lt;/ProtocolName&gt;</span>',
    '    <span class="tag">&lt;/GlobalVariables&gt;</span>',
    '',
    '    <span class="tag">&lt;MetaDataVersion</span> <span class="attr">OID</span>=<span class="value">"MDV.CDISC01.ADaM"</span>',
    '      <span class="attr">Name</span>=<span class="value">"Study CDISC01, ADaM"</span>',
    '      <span class="attr">def:DefineVersion</span>=<span class="value">"2.1.0"</span>',
    '      <span class="attr">def:StandardName</span>=<span class="value">"ADaM-IG"</span>',
    '      <span class="attr">def:StandardVersion</span>=<span class="value">"1.1"</span><span class="tag">&gt;</span>',
    '',
    '      <span class="comment">&lt;!-- データセット定義 --&gt;</span>',
    '      <span class="tag">&lt;ItemGroupDef</span> <span class="attr">OID</span>=<span class="value">"IG.ADSL"</span> <span class="attr">Name</span>=<span class="value">"ADSL"</span>',
    '        <span class="attr">SASDatasetName</span>=<span class="value">"ADSL"</span> <span class="attr">Repeating</span>=<span class="value">"No"</span>',
    '        <span class="attr">Purpose</span>=<span class="value">"Analysis"</span>',
    '        <span class="attr">def:Structure</span>=<span class="value">"One record per subject"</span><span class="tag">&gt;</span>',
    '        <span class="tag">&lt;ItemRef</span> <span class="attr">ItemOID</span>=<span class="value">"IT.ADSL.USUBJID"</span> <span class="attr">OrderNumber</span>=<span class="value">"1"</span>',
    '          <span class="attr">Mandatory</span>=<span class="value">"Yes"</span> <span class="attr">KeySequence</span>=<span class="value">"1"</span><span class="tag">/&gt;</span>',
    '        <span class="tag">&lt;ItemRef</span> <span class="attr">ItemOID</span>=<span class="value">"IT.ADSL.AGE"</span> <span class="attr">OrderNumber</span>=<span class="value">"2"</span>',
    '          <span class="attr">Mandatory</span>=<span class="value">"No"</span> <span class="attr">MethodOID</span>=<span class="value">"MT.ADSL.AGE"</span><span class="tag">/&gt;</span>',
    '      <span class="tag">&lt;/ItemGroupDef&gt;</span>',
    '',
    '      <span class="comment">&lt;!-- 変数定義 --&gt;</span>',
    '      <span class="tag">&lt;ItemDef</span> <span class="attr">OID</span>=<span class="value">"IT.ADSL.USUBJID"</span> <span class="attr">Name</span>=<span class="value">"USUBJID"</span>',
    '        <span class="attr">DataType</span>=<span class="value">"text"</span> <span class="attr">Length</span>=<span class="value">"20"</span><span class="tag">&gt;</span>',
    '        <span class="tag">&lt;Description&gt;</span>',
    '          <span class="tag">&lt;TranslatedText</span> <span class="attr">xml:lang</span>=<span class="value">"en"</span><span class="tag">&gt;</span>Unique Subject Identifier<span class="tag">&lt;/TranslatedText&gt;</span>',
    '        <span class="tag">&lt;/Description&gt;</span>',
    '        <span class="tag">&lt;def:Origin</span> <span class="attr">Type</span>=<span class="value">"Predecessor"</span><span class="tag">/&gt;</span>',
    '      <span class="tag">&lt;/ItemDef&gt;</span>',
    '',
    '      <span class="comment">&lt;!-- コードリスト --&gt;</span>',
    '      <span class="tag">&lt;CodeList</span> <span class="attr">OID</span>=<span class="value">"CL.SEX"</span> <span class="attr">Name</span>=<span class="value">"SEX"</span> <span class="attr">DataType</span>=<span class="value">"text"</span><span class="tag">&gt;</span>',
    '        <span class="tag">&lt;CodeListItem</span> <span class="attr">CodedValue</span>=<span class="value">"F"</span><span class="tag">&gt;</span>',
    '          <span class="tag">&lt;Decode&gt;&lt;TranslatedText&gt;</span>Female<span class="tag">&lt;/TranslatedText&gt;&lt;/Decode&gt;</span>',
    '        <span class="tag">&lt;/CodeListItem&gt;</span>',
    '      <span class="tag">&lt;/CodeList&gt;</span>',
    '',
    '      <span class="comment">&lt;!-- 導出方法 --&gt;</span>',
    '      <span class="tag">&lt;MethodDef</span> <span class="attr">OID</span>=<span class="value">"MT.ADSL.AGE"</span> <span class="attr">Name</span>=<span class="value">"Algorithm for AGE"</span>',
    '        <span class="attr">Type</span>=<span class="value">"Computation"</span><span class="tag">&gt;</span>',
    '        <span class="tag">&lt;Description&gt;</span>',
    '          <span class="tag">&lt;TranslatedText&gt;</span>AGE = floor((RFSTDTC - BRTHDTC) / 365.25)<span class="tag">&lt;/TranslatedText&gt;</span>',
    '        <span class="tag">&lt;/Description&gt;</span>',
    '      <span class="tag">&lt;/MethodDef&gt;</span>',
    '',
    '    <span class="tag">&lt;/MetaDataVersion&gt;</span>',
    '  <span class="tag">&lt;/Study&gt;</span>',
    '<span class="tag">&lt;/ODM&gt;</span>'
  ];

  container.innerHTML = lines.join("\n");
}

/* --- ユーティリティ --- */
function escapeHtml(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
