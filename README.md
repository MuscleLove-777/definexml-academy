# define.xml アカデミー

CDISC define.xml（メタデータXML）の作成方法を体系的に学べる日本語リファレンスサイトです。

## 概要

define.xmlは、臨床試験データ（SDTM/ADaM）の構造・変数定義・コードリスト・導出方法などを記述するメタデータ定義ファイルです。FDA/PMDAへの電子データ申請において必須コンポーネントであり、本サイトではその作成方法を基礎から実践まで体系的に解説します。

## コンテンツ

| ページ | 説明 |
|--------|------|
| ホーム | サイト概要、主要要素一覧、データセット例、作成ガイド概要 |
| 基礎 | define.xmlとは、なぜ必要か、SDTM/ADaMとの関係、全体構造ツリー、用語集 |
| XML構造 | インタラクティブXMLツリー、各ノードの属性一覧、シンタックスハイライト付きコード例 |
| 要素辞書 | 17個以上の主要XML要素を検索・フィルター付きで収録（属性、子要素、コード例） |
| 作成ガイド | 6ステップの作成手順（サイドバーナビ付き）、ツール比較一覧 |
| XMLビルダー | データセット・変数を入力してItemGroupDef + ItemDefをリアルタイム生成 |
| 理解度クイズ | 10問のクイズで知識をテスト、5段階のレベル診断 |

## 技術スタック

- HTML5 / CSS3 / Vanilla JavaScript
- フレームワーク不使用
- レスポンシブデザイン対応（モバイル / タブレット / デスクトップ）
- Google Fonts（Noto Sans JP）

## デザインテーマ

- プライマリ: #4a1d96（ディープパープル）
- アクセント: #f59e0b（アンバー）
- XML要素にはシンタックスハイライト付きコードブロック、ツリービュー表示を採用

## ディレクトリ構成

```
definexml-academy/
├── index.html          # ホームページ
├── css/
│   └── style.css       # 共通CSS
├── js/
│   ├── data.js         # データ定義
│   ├── main.js         # 共通JS
│   ├── basics.js       # 基礎ページJS
│   ├── structure.js    # XML構造ページJS
│   ├── elements.js     # 要素辞書ページJS
│   ├── guide.js        # 作成ガイドページJS
│   ├── builder.js      # XMLビルダーJS
│   └── quiz.js         # クイズJS
├── basics/
│   └── index.html      # 基礎ページ
├── structure/
│   └── index.html      # XML構造ページ
├── elements/
│   └── index.html      # 要素辞書ページ
├── guide/
│   └── index.html      # 作成ガイドページ
├── tools/
│   ├── builder.html    # XMLビルダー
│   └── quiz.html       # 理解度クイズ
└── README.md
```

## データ内容

- **DEFINE_ELEMENTS**: 17個の主要XML要素（ODM, Study, MetaDataVersion, ItemGroupDef, ItemDef, CodeList等）
- **DATASET_METADATA**: 5つのADaMデータセット例（ADSL, ADAE, ADLB, ADTTE, ADCM）
- **VARIABLE_METADATA**: 各データセット10個程度の変数メタデータ
- **CODELIST_DATA**: 8個のコードリスト（SEX, RACE, NY, AESEV等）
- **METHOD_DATA**: 5つの導出方法（AGE, SAFFL, CHG, TRTEMFL, AVAL）
- **TOOLS_DATA**: 5つのdefine.xml作成ツール比較
- **GUIDE_STEPS**: 6ステップの作成手順
- **GLOSSARY**: 10個の用語集
- **QUIZ_DATA**: 10問のクイズ + 5段階の結果診断

## ローカル実行

静的サイトのため、ファイルをブラウザで直接開くか、任意のHTTPサーバーで配信できます。

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .
```
