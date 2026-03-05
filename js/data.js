/* ============================================
   define.xml アカデミー - データ定義
   ============================================ */

/**
 * DEFINE_ELEMENTS: define.xmlの主要要素
 */
const DEFINE_ELEMENTS = [
  {
    id: "odm",
    name: "ODM",
    description: "Operational Data Model。define.xmlのルート要素。CDISC ODM標準に基づくXMLドキュメント全体を包含する。FileType, FileOID, CreationDateTime等の属性を持つ。",
    attributes: [
      { name: "xmlns", type: "URI", required: true, desc: "ODM名前空間" },
      { name: "xmlns:def", type: "URI", required: true, desc: "define.xml拡張名前空間" },
      { name: "ODMVersion", type: "string", required: true, desc: "ODMバージョン（例: 1.3.2）" },
      { name: "FileType", type: "string", required: true, desc: "Snapshot（固定）" },
      { name: "FileOID", type: "OID", required: true, desc: "ファイル一意識別子" },
      { name: "CreationDateTime", type: "datetime", required: true, desc: "作成日時" }
    ],
    children: ["Study"],
    example: '<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"\n     xmlns:def="http://www.cdisc.org/ns/def/v2.1"\n     ODMVersion="1.3.2"\n     FileType="Snapshot"\n     FileOID="DEF.STUDY001"\n     CreationDateTime="2024-01-15T10:00:00">'
  },
  {
    id: "study",
    name: "Study",
    description: "試験全体の情報を格納する要素。OIDで一意に識別される。1つのODMに通常1つのStudy要素が含まれる。",
    attributes: [
      { name: "OID", type: "OID", required: true, desc: "試験の一意識別子" }
    ],
    children: ["GlobalVariables", "MetaDataVersion"],
    example: '<Study OID="STUDY001">\n  <GlobalVariables>\n    <StudyName>Example Study</StudyName>\n    <StudyDescription>Phase III Clinical Trial</StudyDescription>\n    <ProtocolName>PROTO-001</ProtocolName>\n  </GlobalVariables>\n</Study>'
  },
  {
    id: "globalvariables",
    name: "GlobalVariables",
    description: "試験のグローバル情報（試験名、説明、プロトコル名）を定義する。Study要素の直下に配置される。",
    attributes: [],
    children: ["StudyName", "StudyDescription", "ProtocolName"],
    example: '<GlobalVariables>\n  <StudyName>CDISC01</StudyName>\n  <StudyDescription>Safety and Efficacy Study</StudyDescription>\n  <ProtocolName>CDISC01-PROTO</ProtocolName>\n</GlobalVariables>'
  },
  {
    id: "metadataversion",
    name: "MetaDataVersion",
    description: "メタデータのバージョン管理を行う中核要素。データセット定義、変数定義、コードリスト等すべてのメタデータを包含する。",
    attributes: [
      { name: "OID", type: "OID", required: true, desc: "メタデータバージョンOID" },
      { name: "Name", type: "string", required: true, desc: "メタデータバージョン名" },
      { name: "Description", type: "string", required: false, desc: "説明" },
      { name: "def:DefineVersion", type: "string", required: true, desc: "define.xmlバージョン（例: 2.1.0）" },
      { name: "def:StandardName", type: "string", required: false, desc: "標準名（例: ADaM-IG）" },
      { name: "def:StandardVersion", type: "string", required: false, desc: "標準バージョン（例: 1.1）" }
    ],
    children: ["ItemGroupDef", "ItemDef", "CodeList", "MethodDef", "def:CommentDef", "def:WhereClauseDef", "def:ValueListDef", "def:leaf"],
    example: '<MetaDataVersion OID="MDV.CDISC01.ADaM"\n  Name="Study CDISC01, ADaM"\n  def:DefineVersion="2.1.0"\n  def:StandardName="ADaM-IG"\n  def:StandardVersion="1.1">'
  },
  {
    id: "itemgroupdef",
    name: "ItemGroupDef",
    description: "データセット（ドメイン）を定義する要素。SASデータセット名、ラベル、構造、クラス等の属性を持ち、ItemRef要素で含まれる変数を参照する。",
    attributes: [
      { name: "OID", type: "OID", required: true, desc: "データセットOID" },
      { name: "Name", type: "string", required: true, desc: "データセット名" },
      { name: "SASDatasetName", type: "string", required: true, desc: "SASデータセット名" },
      { name: "Repeating", type: "Yes/No", required: true, desc: "繰り返しの有無" },
      { name: "IsReferenceData", type: "Yes/No", required: true, desc: "参照データかどうか" },
      { name: "Purpose", type: "string", required: true, desc: "目的（Analysis/Tabulation）" },
      { name: "def:Structure", type: "string", required: true, desc: "データ構造の説明" },
      { name: "def:Class", type: "string", required: false, desc: "データセットクラス" },
      { name: "def:ArchiveLocationID", type: "IDREF", required: false, desc: "ファイル参照ID" }
    ],
    children: ["Description", "ItemRef", "def:leaf"],
    example: '<ItemGroupDef OID="IG.ADSL"\n  Name="ADSL"\n  SASDatasetName="ADSL"\n  Repeating="No"\n  IsReferenceData="No"\n  Purpose="Analysis"\n  def:Structure="One record per subject"\n  def:Class="SUBJECT LEVEL ANALYSIS DATASET">\n  <Description>\n    <TranslatedText xml:lang="en">Subject Level Analysis Dataset</TranslatedText>\n  </Description>\n</ItemGroupDef>'
  },
  {
    id: "itemref",
    name: "ItemRef",
    description: "ItemGroupDef内で変数（ItemDef）を参照する要素。変数の順序、必須性、キー順序等を指定する。",
    attributes: [
      { name: "ItemOID", type: "IDREF", required: true, desc: "参照するItemDefのOID" },
      { name: "OrderNumber", type: "integer", required: false, desc: "表示順序" },
      { name: "Mandatory", type: "Yes/No", required: true, desc: "必須かどうか" },
      { name: "KeySequence", type: "integer", required: false, desc: "キー変数の順序" },
      { name: "MethodOID", type: "IDREF", required: false, desc: "導出方法への参照" },
      { name: "Role", type: "string", required: false, desc: "変数の役割" }
    ],
    children: ["def:WhereClauseRef"],
    example: '<ItemRef ItemOID="IT.ADSL.STUDYID"\n  OrderNumber="1"\n  Mandatory="Yes"\n  KeySequence="1"\n  Role="Identifier"/>'
  },
  {
    id: "itemdef",
    name: "ItemDef",
    description: "個々の変数（カラム）を定義する要素。変数名、データ型、長さ、ラベル等の属性を持つ。define.xmlで最も数が多い要素。",
    attributes: [
      { name: "OID", type: "OID", required: true, desc: "変数OID" },
      { name: "Name", type: "string", required: true, desc: "変数名" },
      { name: "SASFieldName", type: "string", required: true, desc: "SASフィールド名" },
      { name: "DataType", type: "string", required: true, desc: "データ型（text, integer, float, date等）" },
      { name: "Length", type: "integer", required: false, desc: "最大長" },
      { name: "SignificantDigits", type: "integer", required: false, desc: "有効桁数" },
      { name: "def:DisplayFormat", type: "string", required: false, desc: "表示フォーマット" }
    ],
    children: ["Description", "CodeListRef", "def:Origin", "def:ValueListRef"],
    example: '<ItemDef OID="IT.ADSL.USUBJID"\n  Name="USUBJID"\n  SASFieldName="USUBJID"\n  DataType="text"\n  Length="20">\n  <Description>\n    <TranslatedText xml:lang="en">Unique Subject Identifier</TranslatedText>\n  </Description>\n  <def:Origin Type="Predecessor"/>\n</ItemDef>'
  },
  {
    id: "codelist",
    name: "CodeList",
    description: "コードリスト（コード化された値の集合）を定義する。性別、人種などカテゴリカル変数の許容値を列挙する。",
    attributes: [
      { name: "OID", type: "OID", required: true, desc: "コードリストOID" },
      { name: "Name", type: "string", required: true, desc: "コードリスト名" },
      { name: "DataType", type: "string", required: true, desc: "データ型" },
      { name: "SASFormatName", type: "string", required: false, desc: "SASフォーマット名" }
    ],
    children: ["CodeListItem", "EnumeratedItem", "ExternalCodeList"],
    example: '<CodeList OID="CL.SEX"\n  Name="SEX"\n  DataType="text"\n  SASFormatName="SEX">\n  <CodeListItem CodedValue="F">\n    <Decode><TranslatedText xml:lang="en">Female</TranslatedText></Decode>\n  </CodeListItem>\n  <CodeListItem CodedValue="M">\n    <Decode><TranslatedText xml:lang="en">Male</TranslatedText></Decode>\n  </CodeListItem>\n</CodeList>'
  },
  {
    id: "codelistitem",
    name: "CodeListItem",
    description: "コードリスト内の個別のコード値を定義する。CodedValueとそのデコード値（表示テキスト）のペアを格納する。",
    attributes: [
      { name: "CodedValue", type: "string", required: true, desc: "コード値" },
      { name: "OrderNumber", type: "integer", required: false, desc: "表示順序" },
      { name: "Rank", type: "float", required: false, desc: "ランク値" },
      { name: "def:ExtendedValue", type: "Yes", required: false, desc: "拡張値フラグ" }
    ],
    children: ["Decode"],
    example: '<CodeListItem CodedValue="Y" OrderNumber="1">\n  <Decode>\n    <TranslatedText xml:lang="en">Yes</TranslatedText>\n  </Decode>\n</CodeListItem>'
  },
  {
    id: "methoddef",
    name: "MethodDef",
    description: "変数の導出方法（計算方法、アルゴリズム）を定義する。ADaMデータセットの導出変数に対して、その計算ロジックを記述する。",
    attributes: [
      { name: "OID", type: "OID", required: true, desc: "メソッドOID" },
      { name: "Name", type: "string", required: true, desc: "メソッド名" },
      { name: "Type", type: "string", required: true, desc: "メソッドタイプ（Computation等）" }
    ],
    children: ["Description", "FormalExpression", "def:DocumentRef"],
    example: '<MethodDef OID="MT.ADSL.BMIBL"\n  Name="Algorithm for BMIBL"\n  Type="Computation">\n  <Description>\n    <TranslatedText xml:lang="en">\n      BMIBL = WEIGHTBL / (HEIGHTBL/100)^2\n    </TranslatedText>\n  </Description>\n</MethodDef>'
  },
  {
    id: "commentdef",
    name: "def:CommentDef",
    description: "コメント（注釈）を定義する要素。データセットや変数に補足説明を付与するために使用する。define.xml拡張要素。",
    attributes: [
      { name: "OID", type: "OID", required: true, desc: "コメントOID" }
    ],
    children: ["Description", "def:DocumentRef"],
    example: '<def:CommentDef OID="COM.ADSL.01">\n  <Description>\n    <TranslatedText xml:lang="en">\n      This dataset contains one record per subject.\n      Baseline values are derived from the last non-missing\n      value prior to first dose.\n    </TranslatedText>\n  </Description>\n</def:CommentDef>'
  },
  {
    id: "whereclausedef",
    name: "def:WhereClauseDef",
    description: "Value Level Metadataの条件（Where句）を定義する。特定の条件下でのみ適用される変数メタデータを指定する。",
    attributes: [
      { name: "OID", type: "OID", required: true, desc: "WhereClause OID" }
    ],
    children: ["RangeCheck"],
    example: '<def:WhereClauseDef OID="WC.ADLB.PARAMCD.ALT">\n  <RangeCheck SoftHard="Soft"\n    def:ItemOID="IT.ADLB.PARAMCD"\n    Comparator="EQ">\n    <CheckValue>ALT</CheckValue>\n  </RangeCheck>\n</def:WhereClauseDef>'
  },
  {
    id: "valuelistdef",
    name: "def:ValueListDef",
    description: "Value Level Metadata（値レベルメタデータ）を定義する。BDS構造のデータセットで、パラメータごとに異なるメタデータを定義する際に使用。",
    attributes: [
      { name: "OID", type: "OID", required: true, desc: "ValueList OID" }
    ],
    children: ["ItemRef"],
    example: '<def:ValueListDef OID="VL.ADLB.AVAL">\n  <ItemRef ItemOID="IT.ADLB.AVAL.ALT"\n    OrderNumber="1"\n    Mandatory="No">\n    <def:WhereClauseRef WhereClauseOID="WC.ADLB.PARAMCD.ALT"/>\n  </ItemRef>\n</def:ValueListDef>'
  },
  {
    id: "leaf",
    name: "def:leaf",
    description: "外部ファイル（CRFページ、ARMドキュメント等）へのリンクを定義する。ファイルパスとタイトルを指定してドキュメント参照を可能にする。",
    attributes: [
      { name: "ID", type: "ID", required: true, desc: "リーフID" },
      { name: "xlink:href", type: "URI", required: true, desc: "ファイルパス" }
    ],
    children: ["def:title"],
    example: '<def:leaf ID="LF.BLANKCRF"\n  xlink:href="blankcrf.pdf">\n  <def:title>Blank CRF</def:title>\n</def:leaf>'
  },
  {
    id: "documentref",
    name: "def:DocumentRef",
    description: "定義済みの外部ドキュメント（leaf要素）への参照。MethodDefやCommentDefからドキュメントの特定ページを参照する際に使用する。",
    attributes: [
      { name: "leafID", type: "IDREF", required: true, desc: "参照するleaf要素のID" }
    ],
    children: ["def:PDFPageRef"],
    example: '<def:DocumentRef leafID="LF.SAP">\n  <def:PDFPageRef PageRefs="12"\n    Type="PhysicalRef"/>\n</def:DocumentRef>'
  },
  {
    id: "origin",
    name: "def:Origin",
    description: "変数の原点（データの出所）を定義する。CRF、導出、割当、プロトコル等のOrigin Typeを指定する。",
    attributes: [
      { name: "Type", type: "string", required: true, desc: "原点タイプ（CRF, Derived, Assigned, Protocol, Predecessor）" }
    ],
    children: ["Description", "def:DocumentRef"],
    example: '<def:Origin Type="Derived">\n  <Description>\n    <TranslatedText xml:lang="en">\n      Derived from DM.BRTHDTC and DM.RFSTDTC\n    </TranslatedText>\n  </Description>\n</def:Origin>'
  },
  {
    id: "formalexpression",
    name: "FormalExpression",
    description: "導出方法の形式的な表現（プログラムコード）を記述する要素。SASコード等の実際の計算ロジックを格納する。",
    attributes: [
      { name: "Context", type: "string", required: true, desc: "言語コンテキスト（例: SAS）" }
    ],
    children: [],
    example: '<FormalExpression Context="SAS">\n  BMIBL = WEIGHTBL / (HEIGHTBL/100)**2;\n</FormalExpression>'
  }
];

/**
 * DATASET_METADATA: データセットメタデータ例
 */
const DATASET_METADATA = [
  {
    Name: "ADSL",
    SASDatasetName: "ADSL",
    Label: "Subject Level Analysis Dataset",
    Structure: "One record per subject",
    Class: "SUBJECT LEVEL ANALYSIS DATASET",
    Purpose: "Analysis",
    Keys: ["STUDYID", "USUBJID"],
    Description: "被験者レベルの解析データセット。人口統計学的情報、治療群、解析フラグ等を含む。すべてのADaMデータセットの基盤となる。"
  },
  {
    Name: "ADAE",
    SASDatasetName: "ADAE",
    Label: "Adverse Event Analysis Dataset",
    Structure: "One record per subject per adverse event",
    Class: "ADAM OTHER",
    Purpose: "Analysis",
    Keys: ["STUDYID", "USUBJID", "AESEQ"],
    Description: "有害事象の解析データセット。各有害事象の詳細情報、重症度、因果関係、処置等を含む。"
  },
  {
    Name: "ADLB",
    SASDatasetName: "ADLB",
    Label: "Laboratory Analysis Dataset",
    Structure: "One record per subject per parameter per analysis visit",
    Class: "BASIC DATA STRUCTURE",
    Purpose: "Analysis",
    Keys: ["STUDYID", "USUBJID", "PARAMCD", "AVISIT", "ADT"],
    Description: "臨床検査値の解析データセット。BDS構造を使用し、各検査パラメータの結果値、ベースライン値、変化量等を含む。"
  },
  {
    Name: "ADTTE",
    SASDatasetName: "ADTTE",
    Label: "Time-to-Event Analysis Dataset",
    Structure: "One record per subject per parameter",
    Class: "BASIC DATA STRUCTURE",
    Purpose: "Analysis",
    Keys: ["STUDYID", "USUBJID", "PARAMCD"],
    Description: "Time-to-Event（生存時間解析）データセット。OS、PFS等のイベント発生までの時間、打ち切り情報を含む。"
  },
  {
    Name: "ADCM",
    SASDatasetName: "ADCM",
    Label: "Concomitant Medication Analysis Dataset",
    Structure: "One record per subject per medication",
    Class: "ADAM OTHER",
    Purpose: "Analysis",
    Keys: ["STUDYID", "USUBJID", "CMSEQ"],
    Description: "併用薬の解析データセット。被験者が使用した併用薬の情報、ATC分類、使用時期等を含む。"
  }
];

/**
 * VARIABLE_METADATA: 変数メタデータ例
 */
const VARIABLE_METADATA = {
  ADSL: [
    { Name: "STUDYID", Label: "Study Identifier", DataType: "text", Length: 12, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "USUBJID", Label: "Unique Subject Identifier", DataType: "text", Length: 20, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "SUBJID", Label: "Subject Identifier for the Study", DataType: "text", Length: 8, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "SITEID", Label: "Study Site Identifier", DataType: "text", Length: 5, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "AGE", Label: "Age", DataType: "integer", Length: 8, Origin: "Derived", Role: "Record Qualifier", Comment: "Years at informed consent", MethodOID: "MT.ADSL.AGE" },
    { Name: "AGEGR1", Label: "Pooled Age Group 1", DataType: "text", Length: 10, Origin: "Derived", Role: "Record Qualifier", Comment: "", MethodOID: "MT.ADSL.AGEGR1" },
    { Name: "SEX", Label: "Sex", DataType: "text", Length: 2, Origin: "Predecessor", Role: "Record Qualifier", Comment: "", MethodOID: "" },
    { Name: "RACE", Label: "Race", DataType: "text", Length: 40, Origin: "Predecessor", Role: "Record Qualifier", Comment: "", MethodOID: "" },
    { Name: "TRT01P", Label: "Planned Treatment for Period 01", DataType: "text", Length: 40, Origin: "Predecessor", Role: "Record Qualifier", Comment: "", MethodOID: "" },
    { Name: "TRT01A", Label: "Actual Treatment for Period 01", DataType: "text", Length: 40, Origin: "Predecessor", Role: "Record Qualifier", Comment: "", MethodOID: "" },
    { Name: "SAFFL", Label: "Safety Population Flag", DataType: "text", Length: 2, Origin: "Derived", Role: "Record Qualifier", Comment: "Y if subject received any study drug", MethodOID: "MT.ADSL.SAFFL" },
    { Name: "ITTFL", Label: "Intent-To-Treat Population Flag", DataType: "text", Length: 2, Origin: "Derived", Role: "Record Qualifier", Comment: "Y if subject was randomized", MethodOID: "MT.ADSL.ITTFL" }
  ],
  ADAE: [
    { Name: "STUDYID", Label: "Study Identifier", DataType: "text", Length: 12, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "USUBJID", Label: "Unique Subject Identifier", DataType: "text", Length: 20, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "AESEQ", Label: "Sequence Number", DataType: "integer", Length: 8, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "AETERM", Label: "Reported Term for the Adverse Event", DataType: "text", Length: 200, Origin: "Predecessor", Role: "Topic", Comment: "", MethodOID: "" },
    { Name: "AEDECOD", Label: "Dictionary-Derived Term", DataType: "text", Length: 200, Origin: "Predecessor", Role: "Record Qualifier", Comment: "MedDRA PT", MethodOID: "" },
    { Name: "AEBODSYS", Label: "Body System or Organ Class", DataType: "text", Length: 200, Origin: "Predecessor", Role: "Record Qualifier", Comment: "MedDRA SOC", MethodOID: "" },
    { Name: "AESEV", Label: "Severity/Intensity", DataType: "text", Length: 10, Origin: "Predecessor", Role: "Record Qualifier", Comment: "", MethodOID: "" },
    { Name: "AESER", Label: "Serious Event", DataType: "text", Length: 2, Origin: "Predecessor", Role: "Record Qualifier", Comment: "", MethodOID: "" },
    { Name: "AEREL", Label: "Causality", DataType: "text", Length: 20, Origin: "Predecessor", Role: "Record Qualifier", Comment: "", MethodOID: "" },
    { Name: "TRTEMFL", Label: "Treatment Emergent Flag", DataType: "text", Length: 2, Origin: "Derived", Role: "Record Qualifier", Comment: "", MethodOID: "MT.ADAE.TRTEMFL" }
  ],
  ADLB: [
    { Name: "STUDYID", Label: "Study Identifier", DataType: "text", Length: 12, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "USUBJID", Label: "Unique Subject Identifier", DataType: "text", Length: 20, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "PARAMCD", Label: "Parameter Code", DataType: "text", Length: 8, Origin: "Derived", Role: "Identifier", Comment: "", MethodOID: "MT.ADLB.PARAMCD" },
    { Name: "PARAM", Label: "Parameter", DataType: "text", Length: 200, Origin: "Derived", Role: "Record Qualifier", Comment: "", MethodOID: "MT.ADLB.PARAM" },
    { Name: "AVAL", Label: "Analysis Value", DataType: "float", Length: 8, Origin: "Derived", Role: "Result Qualifier", Comment: "Numeric result", MethodOID: "MT.ADLB.AVAL" },
    { Name: "AVALC", Label: "Analysis Value (C)", DataType: "text", Length: 200, Origin: "Derived", Role: "Result Qualifier", Comment: "Character result", MethodOID: "" },
    { Name: "BASE", Label: "Baseline Value", DataType: "float", Length: 8, Origin: "Derived", Role: "Record Qualifier", Comment: "", MethodOID: "MT.ADLB.BASE" },
    { Name: "CHG", Label: "Change from Baseline", DataType: "float", Length: 8, Origin: "Derived", Role: "Record Qualifier", Comment: "", MethodOID: "MT.ADLB.CHG" },
    { Name: "AVISIT", Label: "Analysis Visit", DataType: "text", Length: 40, Origin: "Derived", Role: "Record Qualifier", Comment: "", MethodOID: "MT.ADLB.AVISIT" },
    { Name: "ANL01FL", Label: "Analysis Flag 01", DataType: "text", Length: 2, Origin: "Derived", Role: "Record Qualifier", Comment: "", MethodOID: "MT.ADLB.ANL01FL" }
  ],
  ADTTE: [
    { Name: "STUDYID", Label: "Study Identifier", DataType: "text", Length: 12, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "USUBJID", Label: "Unique Subject Identifier", DataType: "text", Length: 20, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "PARAMCD", Label: "Parameter Code", DataType: "text", Length: 8, Origin: "Assigned", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "PARAM", Label: "Parameter", DataType: "text", Length: 200, Origin: "Assigned", Role: "Record Qualifier", Comment: "", MethodOID: "" },
    { Name: "AVAL", Label: "Analysis Value", DataType: "float", Length: 8, Origin: "Derived", Role: "Result Qualifier", Comment: "Time to event in days", MethodOID: "MT.ADTTE.AVAL" },
    { Name: "STARTDT", Label: "Time to Event Origin Date", DataType: "integer", Length: 8, Origin: "Derived", Role: "Record Qualifier", Comment: "", MethodOID: "MT.ADTTE.STARTDT" },
    { Name: "ADT", Label: "Analysis Date", DataType: "integer", Length: 8, Origin: "Derived", Role: "Record Qualifier", Comment: "", MethodOID: "MT.ADTTE.ADT" },
    { Name: "CNSR", Label: "Censor", DataType: "integer", Length: 8, Origin: "Derived", Role: "Record Qualifier", Comment: "0=Event, 1=Censored", MethodOID: "MT.ADTTE.CNSR" },
    { Name: "EVNTDESC", Label: "Event Description", DataType: "text", Length: 200, Origin: "Derived", Role: "Record Qualifier", Comment: "", MethodOID: "" },
    { Name: "CNSDTDSC", Label: "Censor Date Description", DataType: "text", Length: 200, Origin: "Derived", Role: "Record Qualifier", Comment: "", MethodOID: "" }
  ],
  ADCM: [
    { Name: "STUDYID", Label: "Study Identifier", DataType: "text", Length: 12, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "USUBJID", Label: "Unique Subject Identifier", DataType: "text", Length: 20, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "CMSEQ", Label: "Sequence Number", DataType: "integer", Length: 8, Origin: "Predecessor", Role: "Identifier", Comment: "", MethodOID: "" },
    { Name: "CMTRT", Label: "Reported Name of Drug", DataType: "text", Length: 200, Origin: "Predecessor", Role: "Topic", Comment: "", MethodOID: "" },
    { Name: "CMDECOD", Label: "Standardized Medication Name", DataType: "text", Length: 200, Origin: "Predecessor", Role: "Record Qualifier", Comment: "WHODrug preferred name", MethodOID: "" },
    { Name: "CMCAT", Label: "Category for Medication", DataType: "text", Length: 40, Origin: "Predecessor", Role: "Grouping Qualifier", Comment: "", MethodOID: "" },
    { Name: "CMINDC", Label: "Indication", DataType: "text", Length: 200, Origin: "Predecessor", Role: "Record Qualifier", Comment: "", MethodOID: "" },
    { Name: "CMDOSE", Label: "Dose per Administration", DataType: "float", Length: 8, Origin: "Predecessor", Role: "Record Qualifier", Comment: "", MethodOID: "" },
    { Name: "CMDOSU", Label: "Dose Units", DataType: "text", Length: 20, Origin: "Predecessor", Role: "Record Qualifier", Comment: "", MethodOID: "" },
    { Name: "ASTDT", Label: "Analysis Start Date", DataType: "integer", Length: 8, Origin: "Derived", Role: "Timing", Comment: "", MethodOID: "MT.ADCM.ASTDT" }
  ]
};

/**
 * CODELIST_DATA: コードリスト例
 */
const CODELIST_DATA = [
  {
    OID: "CL.SEX",
    Name: "SEX",
    DataType: "text",
    SASFormatName: "SEX",
    CodedValues: [
      { value: "F", decode: "Female" },
      { value: "M", decode: "Male" },
      { value: "U", decode: "Unknown" }
    ]
  },
  {
    OID: "CL.RACE",
    Name: "RACE",
    DataType: "text",
    SASFormatName: "RACE",
    CodedValues: [
      { value: "ASIAN", decode: "Asian" },
      { value: "WHITE", decode: "White" },
      { value: "BLACK OR AFRICAN AMERICAN", decode: "Black or African American" },
      { value: "AMERICAN INDIAN OR ALASKA NATIVE", decode: "American Indian or Alaska Native" },
      { value: "NATIVE HAWAIIAN OR OTHER PACIFIC ISLANDER", decode: "Native Hawaiian or Other Pacific Islander" },
      { value: "MULTIPLE", decode: "Multiple" },
      { value: "OTHER", decode: "Other" }
    ]
  },
  {
    OID: "CL.NY",
    Name: "NY",
    DataType: "text",
    SASFormatName: "NY",
    CodedValues: [
      { value: "N", decode: "No" },
      { value: "Y", decode: "Yes" }
    ]
  },
  {
    OID: "CL.AESEV",
    Name: "AESEV",
    DataType: "text",
    SASFormatName: "AESEV",
    CodedValues: [
      { value: "MILD", decode: "Mild" },
      { value: "MODERATE", decode: "Moderate" },
      { value: "SEVERE", decode: "Severe" }
    ]
  },
  {
    OID: "CL.AESER",
    Name: "AESER",
    DataType: "text",
    SASFormatName: "AESER",
    CodedValues: [
      { value: "Y", decode: "Yes" },
      { value: "N", decode: "No" }
    ]
  },
  {
    OID: "CL.AEREL",
    Name: "AEREL",
    DataType: "text",
    SASFormatName: "AEREL",
    CodedValues: [
      { value: "NOT RELATED", decode: "Not Related" },
      { value: "UNLIKELY", decode: "Unlikely Related" },
      { value: "POSSIBLE", decode: "Possibly Related" },
      { value: "PROBABLE", decode: "Probably Related" },
      { value: "DEFINITE", decode: "Definitely Related" }
    ]
  },
  {
    OID: "CL.LBTESTCD",
    Name: "LBTESTCD",
    DataType: "text",
    SASFormatName: "LBTESTCD",
    CodedValues: [
      { value: "ALT", decode: "Alanine Aminotransferase" },
      { value: "AST", decode: "Aspartate Aminotransferase" },
      { value: "BILI", decode: "Bilirubin" },
      { value: "CREAT", decode: "Creatinine" },
      { value: "HGB", decode: "Hemoglobin" },
      { value: "WBC", decode: "White Blood Cell Count" },
      { value: "PLAT", decode: "Platelets" }
    ]
  },
  {
    OID: "CL.EPOCH",
    Name: "EPOCH",
    DataType: "text",
    SASFormatName: "EPOCH",
    CodedValues: [
      { value: "SCREENING", decode: "Screening" },
      { value: "RUN-IN", decode: "Run-In" },
      { value: "TREATMENT", decode: "Treatment" },
      { value: "FOLLOW-UP", decode: "Follow-Up" }
    ]
  }
];

/**
 * METHOD_DATA: 導出方法例
 */
const METHOD_DATA = [
  {
    OID: "MT.ADSL.AGE",
    Name: "Algorithm for AGE",
    Type: "Computation",
    Description: "AGE = floor((RFSTDTC - BRTHDTC) / 365.25)。投与開始日と生年月日から年齢を算出。",
    FormalExpression: "AGE = floor((input(RFSTDTC, yymmdd10.) - input(BRTHDTC, yymmdd10.)) / 365.25);"
  },
  {
    OID: "MT.ADSL.SAFFL",
    Name: "Algorithm for SAFFL",
    Type: "Computation",
    Description: "治験薬を1回以上投与された被験者はSAFFL='Y'とする。安全性解析対象集団フラグ。",
    FormalExpression: "if not missing(TRTSDT) then SAFFL = 'Y'; else SAFFL = 'N';"
  },
  {
    OID: "MT.ADLB.CHG",
    Name: "Algorithm for CHG",
    Type: "Computation",
    Description: "CHG = AVAL - BASE。ベースラインからの変化量。ベースライン値またはAVALが欠測の場合はCHGも欠測。",
    FormalExpression: "if not missing(AVAL) and not missing(BASE) then CHG = AVAL - BASE;"
  },
  {
    OID: "MT.ADAE.TRTEMFL",
    Name: "Algorithm for TRTEMFL",
    Type: "Computation",
    Description: "治験薬投与開始日以降に発現、または投与開始前に発現し投与後に悪化した有害事象にTRTEMFL='Y'を設定。",
    FormalExpression: "if ASTDT >= TRTSDT or (ASTDT < TRTSDT and AENDT >= TRTSDT and ASEV > BSEV) then TRTEMFL = 'Y';"
  },
  {
    OID: "MT.ADTTE.AVAL",
    Name: "Algorithm for AVAL (Time-to-Event)",
    Type: "Computation",
    Description: "AVAL = ADT - STARTDT + 1。イベント発生日（または打ち切り日）から原点日を引いて1を加算。",
    FormalExpression: "AVAL = ADT - STARTDT + 1;"
  }
];

/**
 * TOOLS_DATA: define.xml作成ツール一覧
 */
const TOOLS_DATA = [
  {
    name: "Pinnacle 21 Enterprise",
    vendor: "Pinnacle 21 (Certara)",
    description: "CDISC標準への準拠チェックとdefine.xmlの作成・検証を統合的に行えるプラットフォーム。業界標準のバリデーションツール。",
    features: ["define.xml自動生成", "CDISC準拠チェック", "P21バリデーションレポート", "メタデータ管理", "FDA/PMDA提出対応"],
    pricing: "エンタープライズライセンス",
    url: "https://www.pinnacle21.com/",
    rating: 5
  },
  {
    name: "Formedix",
    vendor: "Formedix",
    description: "メタデータ管理とdefine.xmlの作成を中心としたクラウドベースのプラットフォーム。標準管理からサブミッションまで一気通貫。",
    features: ["クラウドベース", "メタデータリポジトリ", "define.xml生成", "標準ライブラリ管理", "チーム共同作業"],
    pricing: "サブスクリプション",
    url: "https://www.formedix.com/",
    rating: 4
  },
  {
    name: "Ennov Define",
    vendor: "Ennov",
    description: "define.xmlの作成に特化したツール。Excelベースのメタデータ入力とXML生成を簡素化するインターフェースを提供。",
    features: ["Excel連携", "メタデータインポート", "define.xml生成", "バージョン管理", "テンプレート機能"],
    pricing: "ライセンス制",
    url: "https://www.ennov.com/",
    rating: 4
  },
  {
    name: "SAS Clinical Standards Toolkit",
    vendor: "SAS Institute",
    description: "SAS環境でCDISC標準のメタデータ管理とdefine.xmlの生成を行うツールキット。SASプログラマーに馴染みやすい。",
    features: ["SAS統合", "define.xml生成マクロ", "標準テンプレート", "カスタマイズ可能", "無料（SASライセンス内）"],
    pricing: "SASライセンスに含まれる",
    url: "https://support.sas.com/",
    rating: 3
  },
  {
    name: "Yomics Define.xml Designer",
    vendor: "Yomics",
    description: "直感的なGUIでdefine.xmlの作成・編集が可能なデスクトップアプリケーション。ドラッグ&ドロップでメタデータを構成できる。",
    features: ["GUI操作", "ドラッグ&ドロップ", "リアルタイムプレビュー", "メタデータインポート/エクスポート", "バリデーション機能"],
    pricing: "ライセンス制",
    url: "https://www.yomics.com/",
    rating: 4
  }
];

/**
 * GUIDE_STEPS: 作成手順6ステップ
 */
const GUIDE_STEPS = [
  {
    step: 1,
    title: "メタデータの収集と整理",
    icon: "1",
    description: "SDTM/ADaMの仕様書、解析計画書（SAP）、CRFからメタデータを収集します。",
    details: [
      "SDTMデータセット仕様（SDTM Annotated CRF、SDTM Spec）を確認",
      "ADaMデータセット仕様書（ADaM Spec）からデータセット・変数情報を抽出",
      "SAPから導出方法の詳細を確認",
      "コードリスト（Controlled Terminology）を整理",
      "メタデータをExcelまたはスプレッドシートに整理"
    ],
    tips: "Pinnacle 21のメタデータテンプレート（Excelワークブック）を使用すると効率的です。"
  },
  {
    step: 2,
    title: "データセット定義の作成",
    icon: "2",
    description: "各データセット（ItemGroupDef）の属性を定義します。",
    details: [
      "データセット名、ラベル、構造を定義",
      "データセットクラス（BDS, ADSL等）を指定",
      "Purpose（Analysis/Tabulation）を設定",
      "キー変数とその順序を決定",
      "データセットのコメント（CommentDef）を作成"
    ],
    tips: "CDISC定義のデータセットクラスに準拠してClass属性を設定しましょう。"
  },
  {
    step: 3,
    title: "変数定義の作成",
    icon: "3",
    description: "各変数（ItemDef）の詳細なメタデータを定義します。",
    details: [
      "変数名、ラベル、データ型、長さを定義",
      "Origin（CRF, Derived, Assigned, Protocol等）を指定",
      "変数の役割（Role）を設定",
      "CodeListRefでコードリストへの参照を設定",
      "Value Level Metadata（ValueListDef）が必要な変数を特定"
    ],
    tips: "DataTypeは必ずCDISC ODMの定義に従い、text, integer, float, date, datetime等を使用してください。"
  },
  {
    step: 4,
    title: "コードリストと導出方法の定義",
    icon: "4",
    description: "CodeList、MethodDef、CommentDefを作成します。",
    details: [
      "各カテゴリ変数のコードリスト（CodeList）を定義",
      "CDISC Controlled Terminologyとの整合性を確認",
      "導出変数のMethodDefを作成（Description + FormalExpression）",
      "CommentDefで補足説明を追加",
      "WhereClauseDef（条件付きメタデータ）を定義"
    ],
    tips: "CDISC CT（Controlled Terminology）の最新版を使用し、ExtensibleなCodeListには独自の値を追加可能です。"
  },
  {
    step: 5,
    title: "外部ドキュメント参照の設定",
    icon: "5",
    description: "CRF、SAP、ARM等の外部ドキュメントへの参照を設定します。",
    details: [
      "def:leaf要素で外部ファイルへのパスを定義",
      "Annotated CRFへの参照（ページ番号指定）を設定",
      "Analysis Results Metadata（ARM）の参照を追加",
      "DocumentRefでMethodDefやCommentDefからドキュメントを参照",
      "PDFPageRefで特定ページへのリンクを設定"
    ],
    tips: "ファイルパスは相対パスで指定し、提出パッケージのディレクトリ構造と一致させてください。"
  },
  {
    step: 6,
    title: "バリデーションとレビュー",
    icon: "6",
    description: "完成したdefine.xmlを検証し、品質を確保します。",
    details: [
      "XMLスキーマ（XSD）に対するバリデーション実行",
      "Pinnacle 21等のツールでdefine.xmlのコンプライアンスチェック",
      "ブラウザでdefine.xmlを表示し、スタイルシート適用後の表示を確認",
      "OID参照の整合性を確認（未解決の参照がないか）",
      "レビュアーによるメタデータの正確性レビュー",
      "FDA/PMDAの技術仕様に準拠しているか最終確認"
    ],
    tips: "Pinnacle 21 Communityの無料版でも基本的なdefine.xmlバリデーションが可能です。"
  }
];

/**
 * GLOSSARY: 用語集
 */
const GLOSSARY = [
  { term: "CDISC", reading: "シーディスク", definition: "Clinical Data Interchange Standards Consortium。臨床試験データの標準化団体。SDTM、ADaM、define.xml等の標準を策定。" },
  { term: "define.xml", reading: "ディファイン エックスエムエル", definition: "CDISC標準に基づくメタデータ定義ファイル。SDTMまたはADaMデータセットの構造、変数定義、コードリスト等を記述するXMLドキュメント。" },
  { term: "SDTM", reading: "エスディーティーエム", definition: "Study Data Tabulation Model。臨床試験の生データを格納するための標準モデル。DMやAE等のドメインで構成される。" },
  { term: "ADaM", reading: "エイダム", definition: "Analysis Data Model。統計解析用のデータモデル。SDTMデータから導出され、ADSL, ADAE, ADLB等のデータセットで構成される。" },
  { term: "ODM", reading: "オーディーエム", definition: "Operational Data Model。CDISCの基盤データモデル。define.xmlはODMのXMLスキーマを拡張して作成される。" },
  { term: "OID", reading: "オーアイディー", definition: "Object Identifier。define.xml内で各オブジェクト（データセット、変数、コードリスト等）を一意に識別するためのID。" },
  { term: "Controlled Terminology (CT)", reading: "コントロールド ターミノロジー", definition: "CDISCが定義する統制用語集。コードリスト内の許容値を標準化するための用語辞書。定期的に更新される。" },
  { term: "BDS", reading: "ビーディーエス", definition: "Basic Data Structure。ADaMの基本データ構造。1レコードが被験者×パラメータ×時点で構成される。ADLB等が該当。" },
  { term: "Value Level Metadata", reading: "バリュー レベル メタデータ", definition: "パラメータの値に応じて異なるメタデータを定義する仕組み。BDS構造のデータセットで、各PARAMCDごとに異なる属性を定義する。" },
  { term: "ARM", reading: "エーアールエム", definition: "Analysis Results Metadata。解析結果のメタデータ。define.xml v2.1でサポートされ、統計解析の結果とその導出過程を記述する。" }
];

/**
 * QUIZ_DATA: 10問クイズ
 */
const QUIZ_DATA = [
  {
    id: 1,
    question: "define.xmlのルート要素は何か？",
    choices: ["Study", "ODM", "MetaDataVersion", "ItemGroupDef"],
    answer: 1,
    explanation: "define.xmlのルート要素はODMです。ODM（Operational Data Model）はCDISCの基盤データモデルであり、define.xmlはODMスキーマの拡張として定義されています。"
  },
  {
    id: 2,
    question: "データセット（ドメイン）を定義するdefine.xml要素はどれか？",
    choices: ["ItemDef", "CodeList", "ItemGroupDef", "MetaDataVersion"],
    answer: 2,
    explanation: "ItemGroupDefはデータセット（ドメイン）を定義する要素です。Name, SASDatasetName, Label, Structure等の属性を持ち、ItemRef要素で含まれる変数を参照します。"
  },
  {
    id: 3,
    question: "コードリスト内の個別のコード値を定義する要素は？",
    choices: ["CodeList", "CodeListItem", "EnumeratedItem", "ItemDef"],
    answer: 1,
    explanation: "CodeListItemは、CodeList内の個別のコード値とそのデコード値（表示テキスト）のペアを定義します。CodedValue属性にコード値、Decode子要素に表示テキストを格納します。"
  },
  {
    id: 4,
    question: "ADaMのBDS構造のデータセットで、パラメータごとに異なるメタデータを定義するために使用する要素は？",
    choices: ["MethodDef", "def:WhereClauseDef", "def:ValueListDef", "def:CommentDef"],
    answer: 2,
    explanation: "def:ValueListDefは、Value Level Metadataを定義する要素です。BDS構造のデータセットで、PARAMCDの値に応じて異なるメタデータ（データ型、長さ、コードリスト等）を定義する際に使用します。"
  },
  {
    id: 5,
    question: "define.xmlにおいて、変数の導出方法（アルゴリズム）を記述する要素は？",
    choices: ["def:Origin", "MethodDef", "def:CommentDef", "FormalExpression"],
    answer: 1,
    explanation: "MethodDefは導出方法を定義する要素です。Description子要素にテキストでの説明を、FormalExpression子要素にSASコード等の形式的な表現を記述します。"
  },
  {
    id: 6,
    question: "define.xml v2.1の名前空間URIとして正しいものは？",
    choices: [
      "http://www.cdisc.org/ns/def/v1.0",
      "http://www.cdisc.org/ns/def/v2.0",
      "http://www.cdisc.org/ns/def/v2.1",
      "http://www.cdisc.org/ns/odm/v2.1"
    ],
    answer: 2,
    explanation: "define.xml v2.1の名前空間URIは http://www.cdisc.org/ns/def/v2.1 です。ODM本体の名前空間（http://www.cdisc.org/ns/odm/v1.3）と区別して使用します。"
  },
  {
    id: 7,
    question: "外部ドキュメント（CRF、SAP等のPDFファイル）へのリンクを定義する要素は？",
    choices: ["def:DocumentRef", "def:leaf", "def:Origin", "def:PDFPageRef"],
    answer: 1,
    explanation: "def:leaf要素は外部ファイルへのリンクを定義します。xlink:href属性にファイルパスを指定し、def:title子要素にタイトルを記載します。def:DocumentRefはleafへの参照要素です。"
  },
  {
    id: 8,
    question: "ItemGroupDefのPurpose属性に設定できる値として正しい組み合わせは？",
    choices: [
      "Input / Output",
      "Tabulation / Analysis",
      "SDTM / ADaM",
      "Primary / Secondary"
    ],
    answer: 1,
    explanation: "Purpose属性にはTabulation（SDTMデータの場合）またはAnalysis（ADaMデータの場合）を設定します。これにより、データセットの目的が表形式化か解析かを明示します。"
  },
  {
    id: 9,
    question: "CDISCが策定する統制用語集の略称は？",
    choices: ["CDT", "CT", "CSV", "CRF"],
    answer: 1,
    explanation: "CT（Controlled Terminology）はCDISCが定義する統制用語集です。コードリスト内の許容値を標準化し、一貫性のあるデータ収集・報告を可能にします。定期的に更新されるNCI EVSで公開されます。"
  },
  {
    id: 10,
    question: "define.xmlのバリデーションに最も広く使用されるツールは？",
    choices: [
      "SAS Enterprise Guide",
      "Pinnacle 21",
      "Microsoft Excel",
      "XML Notepad"
    ],
    answer: 1,
    explanation: "Pinnacle 21（旧OpenCDISC）はdefine.xmlのバリデーションに業界で最も広く使用されているツールです。XMLスキーマの検証、CDISC準拠チェック、参照整合性の確認等を自動的に行えます。"
  }
];

/**
 * QUIZ_RESULTS: 5段階の結果
 */
const QUIZ_RESULTS = {
  master: {
    min: 9,
    title: "define.xml マスター",
    description: "define.xmlの構造と要素を完全に理解しています。実際のdefine.xml作成をリードできるレベルです。",
    advice: "この知識を活かして、チーム内でのdefine.xml作成のリーダーシップを発揮しましょう。"
  },
  advanced: {
    min: 7,
    title: "上級者",
    description: "define.xmlの主要な要素と構造をしっかり理解しています。実務での作成にもスムーズに取り組めるでしょう。",
    advice: "Value Level MetadataやARMなど、より高度なトピックにも挑戦してみましょう。"
  },
  intermediate: {
    min: 5,
    title: "中級者",
    description: "基本的な要素は理解していますが、詳細な属性や応用的な使い方には改善の余地があります。",
    advice: "各要素の属性を再確認し、実際のdefine.xmlサンプルを読んでみることをお勧めします。"
  },
  beginner: {
    min: 3,
    title: "初級者",
    description: "define.xmlの基礎概念は理解していますが、要素の詳細やXML構造についてもう少し学習が必要です。",
    advice: "まずは基礎ページでdefine.xmlの全体構造を把握してから、各要素の詳細を学びましょう。"
  },
  novice: {
    min: 0,
    title: "入門者",
    description: "define.xmlはまだ学習を始めたばかりです。でも大丈夫、基礎からしっかり学べます。",
    advice: "まずは基礎ページで「define.xmlとは何か」から始めて、XMLの基本構造を理解しましょう。"
  }
};

/**
 * XML_TREE_DATA: define.xmlの全体構造ツリーデータ
 */
const XML_TREE_DATA = {
  tag: "ODM",
  attrs: 'xmlns="..." xmlns:def="..." FileType="Snapshot"',
  desc: "ルート要素",
  children: [
    {
      tag: "Study",
      attrs: 'OID="STUDY001"',
      desc: "試験定義",
      children: [
        {
          tag: "GlobalVariables",
          desc: "試験のグローバル情報",
          children: [
            { tag: "StudyName", desc: "試験名", children: [] },
            { tag: "StudyDescription", desc: "試験の説明", children: [] },
            { tag: "ProtocolName", desc: "プロトコル名", children: [] }
          ]
        },
        {
          tag: "MetaDataVersion",
          attrs: 'OID="MDV.001" def:DefineVersion="2.1.0"',
          desc: "メタデータバージョン",
          children: [
            {
              tag: "ItemGroupDef",
              attrs: 'OID="IG.ADSL" Name="ADSL"',
              desc: "データセット定義（複数）",
              children: [
                { tag: "Description", desc: "データセットの説明", children: [] },
                { tag: "ItemRef", attrs: 'ItemOID="IT.ADSL.USUBJID"', desc: "変数参照（複数）", children: [] },
                { tag: "def:leaf", desc: "データファイルへのリンク", children: [] }
              ]
            },
            {
              tag: "ItemDef",
              attrs: 'OID="IT.ADSL.USUBJID" Name="USUBJID"',
              desc: "変数定義（複数）",
              children: [
                { tag: "Description", desc: "変数の説明", children: [] },
                { tag: "CodeListRef", desc: "コードリスト参照", children: [] },
                { tag: "def:Origin", desc: "データの出所", children: [] },
                { tag: "def:ValueListRef", desc: "Value Level Metadata参照", children: [] }
              ]
            },
            {
              tag: "CodeList",
              attrs: 'OID="CL.SEX" Name="SEX"',
              desc: "コードリスト定義（複数）",
              children: [
                { tag: "CodeListItem", attrs: 'CodedValue="M"', desc: "コード値（複数）", children: [
                  { tag: "Decode", desc: "デコード値", children: [] }
                ]}
              ]
            },
            {
              tag: "MethodDef",
              attrs: 'OID="MT.ADSL.AGE"',
              desc: "導出方法定義（複数）",
              children: [
                { tag: "Description", desc: "方法の説明", children: [] },
                { tag: "FormalExpression", desc: "形式的な表現（SASコード等）", children: [] },
                { tag: "def:DocumentRef", desc: "ドキュメント参照", children: [] }
              ]
            },
            { tag: "def:CommentDef", desc: "コメント定義（複数）", children: [
              { tag: "Description", desc: "コメント内容", children: [] }
            ]},
            { tag: "def:WhereClauseDef", desc: "Where句定義（複数）", children: [
              { tag: "RangeCheck", desc: "条件式", children: [] }
            ]},
            { tag: "def:ValueListDef", desc: "Value Level Metadata定義（複数）", children: [
              { tag: "ItemRef", desc: "条件付き変数参照", children: [] }
            ]},
            { tag: "def:leaf", attrs: 'ID="LF.BLANKCRF"', desc: "外部ドキュメントリンク（複数）", children: [
              { tag: "def:title", desc: "ドキュメントタイトル", children: [] }
            ]}
          ]
        }
      ]
    }
  ]
};
