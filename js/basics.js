/* ============================================
   define.xml アカデミー - 基礎ページJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initSampleXml();
  initFlowDiagram();
  initBasicsTree();
  initBasicsGlossary();
});

/* --- サンプルXML表示 --- */
function initSampleXml() {
  var container = document.getElementById("sample-xml");
  if (!container) return;

  var xml = [
    '<span class="tag">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</span>',
    '<span class="tag">&lt;ODM</span> <span class="attr">xmlns</span>=<span class="value">"http://www.cdisc.org/ns/odm/v1.3"</span>',
    '     <span class="attr">xmlns:def</span>=<span class="value">"http://www.cdisc.org/ns/def/v2.1"</span>',
    '     <span class="attr">FileType</span>=<span class="value">"Snapshot"</span>',
    '     <span class="attr">FileOID</span>=<span class="value">"DEF.STUDY001.ADaM"</span><span class="tag">&gt;</span>',
    '  <span class="tag">&lt;Study</span> <span class="attr">OID</span>=<span class="value">"STUDY001"</span><span class="tag">&gt;</span>',
    '    <span class="tag">&lt;GlobalVariables&gt;</span>',
    '      <span class="tag">&lt;StudyName&gt;</span>Example Study<span class="tag">&lt;/StudyName&gt;</span>',
    '      <span class="tag">&lt;StudyDescription&gt;</span>Phase III Trial<span class="tag">&lt;/StudyDescription&gt;</span>',
    '      <span class="tag">&lt;ProtocolName&gt;</span>PROTO-001<span class="tag">&lt;/ProtocolName&gt;</span>',
    '    <span class="tag">&lt;/GlobalVariables&gt;</span>',
    '    <span class="tag">&lt;MetaDataVersion</span> <span class="attr">OID</span>=<span class="value">"MDV.001"</span> ... <span class="tag">&gt;</span>',
    '      <span class="comment">&lt;!-- ItemGroupDef, ItemDef, CodeList 等 --&gt;</span>',
    '    <span class="tag">&lt;/MetaDataVersion&gt;</span>',
    '  <span class="tag">&lt;/Study&gt;</span>',
    '<span class="tag">&lt;/ODM&gt;</span>'
  ].join("\n");

  container.innerHTML = xml;
}

/* --- フロー図生成 --- */
function initFlowDiagram() {
  var container = document.getElementById("flow-diagram");
  if (!container) return;

  var steps = [
    { label: "CRF\n(症例報告書)", highlight: false },
    { label: "SDTM\n(Tabulation)", highlight: false },
    { label: "ADaM\n(Analysis)", highlight: false },
    { label: "define.xml\n(メタデータ)", highlight: true },
    { label: "eCTD\n(電子申請)", highlight: false }
  ];

  var html = "";
  steps.forEach(function (step, i) {
    if (i > 0) {
      html += '<div class="flow-arrow">&#x27A1;</div>';
    }
    var cls = step.highlight ? "flow-box highlight" : "flow-box";
    html += '<div class="' + cls + '">' + escapeHtml(step.label).replace(/\n/g, "<br>") + '</div>';
  });

  container.innerHTML = html;
}

/* --- ツリービュー生成 --- */
function initBasicsTree() {
  var container = document.getElementById("xml-tree-basics");
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
      var label = this.closest(".xml-tree-label");
      var node = label.closest(".xml-tree-node");
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

    // ラベルクリックでもトグル
    var label = toggle.closest(".xml-tree-label");
    label.addEventListener("click", function () {
      toggle.click();
    });
  });
}

/* --- 用語集生成 --- */
function initBasicsGlossary() {
  var container = document.getElementById("glossary-list");
  if (!container || typeof GLOSSARY === "undefined") return;

  var html = "";
  GLOSSARY.forEach(function (item) {
    html +=
      '<div class="glossary-item">' +
        '<div class="glossary-term">' + escapeHtml(item.term) + '</div>' +
        '<div class="glossary-reading">' + escapeHtml(item.reading) + '</div>' +
        '<div class="glossary-definition">' + escapeHtml(item.definition) + '</div>' +
      '</div>';
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
