# AGENTS.md — Grand Library AI 協作與網頁擴充維護規範

> **適用對象**：所有參與維護、擴充、修復或建置 **Grand Library — CS & AI Knowledge Atlas** 的 AI 代理人與開發者。  
> **核心宗旨**：讓任何 AI 即使在沒有先前對話歷史的全新 Session 中，亦能精確理解專案架構、設計規範、唯一真理來源，並遵循標準流程安全擴充頁面，絕不破壞既有知識庫的正確性與 Git 歷史。

---

## 1. 專案目的與核心願景 (Project Purpose)

- **核心定位**：Grand Library 是「資訊工程與人工智慧雙語知識圖書館」（CS & AI Knowledge Atlas），堅持 **Research-grade content, reader-first experience**。內容有科研深度，視覺呈現則如專業科技教材，而非自動生成的 AI Dashboard。
- **目標讀者**：資訊工程與人工智慧領域之大學生、專題研究員，以及自主 AI 代理人（Autonomous Agents）。
- **知識庫與網站的關係**：
  - **知識庫（Repository Notes）是唯一真理來源（Single Source of Truth, SSOT）**。
  - **網站（Site）是知識庫的視覺化與互動呈現層（Presentation Layer）**。
  - 網站的責任是將原始 Markdown、LaTeX 數學式、SVG 架構圖、Obsidian WikiLinks 與拓樸依賴（DAG）以最高品質在瀏覽器中靜態渲染，不得擅自竄改、簡化、複製或分裂知識內容。

---

## 2. 目錄架構與責任分工 (Repository Structure)

本儲存庫遵循嚴格的關注點分離原則，各目錄之責任分工如下：

```
library/
├── AGENTS.md                          # [本文件] AI 協作、規範與擴充指南 (SSOT for Agents)
├── README.md                          # 繁體中文總覽與專案入口
├── README.en.md                       # 英文總覽
├── 00 圖書館總覽 (Library Index).md     # 知識庫總索引入口文件
├── 00_總覽與拓樸導覽/                   # 分館 00：總覽、第一性原理與拓樸圖
├── 01_數學與理論基石/                   # 分館 01：線性代數、機率統計、凸最佳化
├── 02_計算機系統與硬體架構/             # 分館 02：GPU 體系結構、Warp 對齊、記憶體階層
├── 03_機器學習與統計學習原理/           # 分館 03：資料偏差、領域漂移、懲罰幾何
├── 04_深度學習架構與神經機制/           # 分館 04：CNN 歸納偏置、Transformer、擴散模型
├── 05_計算機視覺與高維感測/             # 分館 05：前處理質心對齊、對極幾何、NeRF、3DGS
├── 06_自然語言處理與大語言模型/         # 分館 06：現代 LLM 架構、縮放定律、RAG/CAG
├── 07_強化學習與智慧代理人/             # 分館 07：LLM Agent 認知架構、雙進程神經代理
├── 08_AI系統工程與高效部署/             # 分館 08：模型校準、量化數學、低精度推論
├── 09_科研方法論與頂尖專題藍圖/         # 分館 09：MNIST 實證復盤、專題藍圖、文獻體系
├── en/                                # 英文對應版（目錄與檔名結構完全鏡像對稱）
│   ├── 00_overview/ ... 09_research_methodology/
│   └── README.md
├── assets/                            # 知識庫核心 SVG 架構圖與圖表資產
├── scripts/
│   ├── validate_library.py            # [核心守門員] 11 項知識完整性與 DAG 拓樸驗證器
│   └── library_rag.py                 # 知識檢索輔助工具
├── site/                              # [網站原始碼] Astro + TypeScript 靜態網站
│   ├── package.json                   # 網站依賴與建置腳本
│   ├── package-lock.json              # 鎖定依賴樹 (包含 playwright)
│   ├── astro.config.mjs               # Astro 配置（GitHub Pages Base Path: /library）
│   ├── src/
│   │   ├── layouts/                   # BaseLayout 共同版面 (含 SVG Favicon)
│   │   ├── components/                # Header, Footer, ArticleCard, Icon (SVG Line Icons)
│   │   ├── lib/                       # 知識庫解析器 (library.ts)、KaTeX、WikiLinks
│   │   ├── pages/                     # Astro 靜態頁面路由 (zh/, en/, index.astro)
│   │   └── styles/                    # 設計系統全域樣式與主題變數 (global.css)
│   ├── public/                        # 靜態圖標、資產、KaTeX 字型
│   ├── scripts/                       # verify-learning-paths.mjs, run-browser-tests.mjs
│   └── README.md                      # 網站架構與擴充指引
└── .github/workflows/
    ├── validate.yml                   # CI 知識庫完整性自動驗證
    └── deploy-pages.yml               # GitHub Pages 自動建置與部署
```

---

## 3. 設計系統規範 (Design System & Editorial UX)

為體現「國家級研究圖書館 / 學術殿堂」的穩重感與專業性，網站採用嚴謹的**深色學術研究風格（Dark Academic Research Library Theme）**：

### 3.1 語言與排版
- **繁體中文優先雙語介面**：介面預設為 Traditional Chinese（臺灣慣用語法，如「資訊工程」、「快取」、「向量」、「矩陣」），英文為次要版本。
- **零外部 CDN 字型依賴棧（Zero-External-Font System Stack）**：全站停用 Google Fonts（`fonts.googleapis.com` / `fonts.gstatic.com`）等外部執行期字型請求，統一採用零外部依賴之原生系統字型棧並於 `BaseLayout.astro`、`global.css` 與本規範保持完全同步：
  - 襯線標題：`Georgia, "Times New Roman", "Noto Serif CJK TC", "Songti TC", "PMingLiU", serif`
  - 內文與介面：`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", Roboto, "Helvetica Neue", Arial, sans-serif`
  - 程式碼字型：`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
  - 數學式：由本地離線打包之 `/katex/` 樣式與字型渲染

### 3.2 色彩哲學與 WCAG AA 對比度（Color Palette & Accessibility）
| 語意命名 | 色碼 / 描述 | 用途 |
| :--- | :--- | :--- |
| `bg-primary` | `#0b0f19` (極深群青藍黑) | 網站全域背景 |
| `bg-surface` | `#121826` (深海軍藍) | 卡片、導覽列、側邊欄背景 |
| `bg-elevated` | `#1a2234` (高階面板) | 浮動卡片、程式碼區塊、抽屜面板 |
| `text-primary` | `#f8fafc` (白銀灰) | 主要標題、核心閱讀內文 |
| `text-secondary` | `#94a3b8` (石板灰) | 次要敘述、詮釋資料標籤 |
| `text-muted` | `#8a99ad` (靜謐岩灰) | 頁尾資訊、標籤徽章、時間戳記（全面通過 WCAG AA `>= 4.5:1` 對比度） |
| `accent-gold` | `#d4af37` / `#f59e0b` (古雅典金) | 圖書館徽章、高亮強調、選中狀態 |
| `accent-cyan` | `#38bdf8` (學術天藍) | 內部超連結、WikiLinks、數學常數 |
| `border-subtle` | `#1e293b` (深邃幽藍) | 分隔線、卡片邊框 |

- **可及性對比門檻**：全站深色表面（`bg-primary`、`bg-surface`、`bg-elevated`、`bg-hover`）上之一般文字對比度必須達到 WCAG AA `>= 4.5:1`、大字或徽章達 `>= 3.0:1`，不得為追求視覺弱化而降低次要文字可讀性。

### 3.3 UI 介面全面禁止使用 Emoji (UI No-Emoji Rule)
- **核心禁令**：網站 UI 介面（導覽列 Header、頁尾 Footer、分館卡片、標籤、按鈕、狀態徽章、搜尋列）**全面嚴格禁止使用 Emoji**（如 🏛️、🌐、🔍、📚、⚖️、⚡ 等）。
- **統一線條圖標系統**：所有 UI 圖標必須使用純 SVG Line Icon 元件 `src/components/Icon.astro`（包含 `atlas`, `compass`, `math`, `cpu`, `chart`, `network`, `camera`, `text`, `bot`, `settings`, `academic`, `globe`, `search`, `book-open`, `layers`, `shield-check`, `clock` 等）。
- 嚴禁依賴任何未被打包的外部圖標套件或網路 CDN 字型。

### 3.4 讀者第一教學階層版面與手機首屏密度 (Reader-First Pedagogy & Mobile Density)
- **第一屏教學導引 (First-Screen Pedagogy & Action)**：文章頂部呈現篇名、基於 Frontmatter `math_foundations` 與分館結構產出之非重複「核心主題 (`coreFocus`)」、自正文開放章節提取之「你將在本文理解 (`takeaways`)」，以及主要 CTA「開始學習 (Start Learning)」(`#lesson-start`，若本文含視覺圖表則附帶「檢視知識拓樸圖」直達錨點)。正文開篇即直接進入概念理解，**嚴禁**在正文前以先修條件、後續節點或系統合約牆阻擋閱讀。手機版（`390px`）收斂頂部留白與導覽列高度，不顯示失真「預估閱讀時間」。
- **來源真實之導讀與摘要 (Source-Grounded Orientation)**：卡片摘要與標題導引不得洩漏縮排書目、ASCII 圖框、Markdown 表格、公式尾端推論句（如孤立定理量詞）或未編譯 LaTeX 指令；TOC 與標題輔助純文字使用 Unicode 上標轉換 (`texToReadablePlain`) 並去除多餘符號噪音。
- **教學進程與漸進式研究附錄 (`#research-details`)**：閱讀體驗依循 **觀念入門 (Understand) -> 核心脈絡 (Explore) -> 技術深化與推導 (Technical Deep Dive) -> `#research-details`** 推進。作者/狀態/統一 `YYYY-MM-DD` 維護日、前後依賴（Prerequisites / Successors）、`[RULE-###-##]` 合約規範、AI Agent 協定與參考文獻統一收納於可搜尋／可由錨點自動展開之 `<details id="research-details" class="research-details-drawer">`（預設折疊）。
- **階層式可收合目錄與捲動追蹤 (Collapsible H2/H3 TOC & Scroll-Spy)**：桌面端右側欄（及行動端頂部目錄抽屜）預設展示主要 H2 章節，子章節（H3/H4）透過 `IntersectionObserver` Scroll-Spy 或點擊按鈕展開，避免雙重嵌套捲軸框；點擊文內錨點跳轉至研究附錄章節時自動展開 `#research-details`。
- **單一 H1 與閱讀尺度守則**：每頁僅保留版面 Header 唯一 `<h1>`（正文首行 `# 標題` 於語意層移除）。閱讀欄寬維持 68–76 字元（`max-width: 760px`），行高 1.8，字級 1.05rem；表格、`<pre>` 程式碼區塊與 `.katex-display-container` 公式皆具橫向滾動保護，桌機／手機嚴格 `scrollWidth <= clientWidth` (`minmax(0, 1fr)` / `min-width: 0`)。

### 3.5 杜絕 AI 模板感與浮誇裝飾 (Anti-Decorative Bloat)
- 移除首頁 `.metric-card` KPI 儀表板方塊與浮誇光暈動畫，改以單行編輯資訊帶（`.atlas-meta-strip`）搭配明確「選擇學習路線」行動按鈕引導讀者出發。
- 卡片徽章與分館標籤禁止無意義堆疊或換行折斷，維持緊湊單行清晰排版。

### 3.6 典籍簡介真實性與事實查核 (Content Fidelity & Fact-Checking)
- **內容忠實性**：首頁精選、分館目錄與各處展示卡片之文章代號、篇名與推薦理由，必須 100% 忠實對齊原始 Markdown 內容與 Frontmatter。
- **典型負面禁忌**：嚴禁憑空發明或張冠李戴。例如 `LIB-504` 之核心研究為「3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與可微分光柵化」，嚴禁誤植為「空間變換網路 (Spatial Transformer Networks, STN)」。

### 3.7 Content Density & Interface Clarity（內容密度與介面清晰度）

**Primary Principle**

Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining.

**中文原則**

避免不必要的次要標籤與重複說明。優先透過版面結構、視覺層級、間距及元件關係傳達資訊，而不是增加文字。

**Mandatory Constraints**

1. Remove redundant labels, repeated metadata, decorative badges, and descriptions that merely restate headings.
2. Preserve clear action labels, navigation context, accessibility labels, and information necessary to predict what an interaction will do.
3. Preserve educational explanations, prerequisites, learning objectives, research evidence, and material warnings.
4. Do not sacrifice comprehension, accuracy, or accessibility to achieve lower word counts.
5. For learning pages, preserve the essential sequence: What am I learning? Why does it matter? What should I read next?
6. When a page is changed, verify that a first-time visitor can identify its purpose, primary action, and expected result without prior project knowledge.

**Acceptance Criterion**

The interface should be concise without becoming ambiguous. Removing words is not considered an improvement unless clarity and usability are preserved.

---

## 4. 命名、路由與搜尋規範 (Naming, Routing & Search)

### 4.1 核心文章 ID
- 所有 28 篇核心典籍皆擁有唯一的格式代號：`LIB-###`（例如 `LIB-000` 至 `LIB-906`）。
- 任何與文章相關之邏輯、資料索引與錨點，均以此 ID 作為 Canonical Key。

### 4.2 URL 結構對稱性與語意導覽完整性 (URL Symmetry & Semantic Navigation)
中文與英文版必須維持嚴格對稱的 URL 階層：
- **首頁**：中文 `/library/zh/`，英文 `/library/en/`
- **文章目錄 (Catalog)**：中文 `/library/zh/library/`，英文 `/library/en/library/`
- **文章閱讀器 (Reader)**：中文 `/library/zh/notes/lib-001/`，英文 `/library/en/notes/lib-001/`
- **學習路徑 (Paths)**：中文 `/library/zh/paths/`，英文 `/library/en/paths/`
- **關於 (About)**：中文 `/library/zh/about/`，英文 `/library/en/about/`

- **雙向對稱語言切換合約**：Header 導覽列與 Reader `.btn-mirror-link` 切換鈕必須保留相同 `LIB-###` ID 並嚴格跨語跳轉（`zh` → `en`、`en` → `zh`），嚴禁指向自身語系。
- **正文語意連結防衝突與目標語系推斷**：原始 Markdown 頂部的重複「語言切換 / Language」引言橫幅由渲染管線於建置期剔除，避免與網頁導覽列衝突；正文中若存有任何 `.md` 篇目連結，渲染器須依來源路徑（`en/` 與 `Agent EN` → `en`，`0#_*/` → `zh`）精準判定目標語系，不得硬編碼當前頁面語系。

### 4.3 搜尋範圍誠實命名 (Search Scope Transparency)
- 圖書館目錄檢索僅針對篇名、編號、標籤與摘要進行即時篩選，介面與文案**統一標示為「文章搜尋」**，嚴格禁止誇大宣稱為「全文搜尋」。

---

## 5. 內容唯讀與渲染品質規範 (Content Integrity & Rendering QA)

1. **唯一內容來源**：根目錄下的 10 個分館資料夾與 `en/` 鏡像資料夾中的 Markdown 檔案，是知識庫不可動搖的唯一內容。
2. **禁止擅自改動**：
   - 嚴禁為了網頁排版方便而修改、刪減、重寫原始筆記內容。
   - 嚴禁在 `site/` 內部重複建立或複製 `LIB-###.md`。
3. **Markdown / LaTeX 編譯品質守則**：
   - **零星號洩漏 (Zero Leaked Asterisks)**：CommonMark 對 CJK 標點（如 `是**「...」**`）有左側界定限制。`src/lib/library.ts` 透過自研 `cjkStrong` 內聯語彙分析器擴充 Marked，確保中文粗體 100% 正確解析為 `<strong>`，內文嚴禁殘留裸露星號 `**`。
   - **單一主要 H1 守則 (Single Primary H1 Invariant)**：Reader 頁面僅保留 Header 之唯一文章大標題；Markdown 原始內文之第一行標題（`# 標題`）由渲染器在語意前置解析期消除，避免重複顯示或雙重標記；同時 Heading Renderer 針對 `depth === 1` 一律返回空字串並不計入目錄，保障全站 56 篇雙語典籍之 H1 唯一性。
   - **零雙重跳脫與實體外洩防護 (Zero Double Escaping)**：Marked 內建之 `parseInline` 會將 `&` 轉化為 `&amp;`、`'` 轉化為 `&#39;`。在生成目錄（TOC）與標題錨點 ID 前，必須精確還原為乾淨純文字（`plainText`），再由 Astro 範本進行安全單次跳脫，杜絕 `&amp;amp;` 或 `&amp;#39;` 等實體編碼洩漏在網頁可見文字中。
   - **KaTeX 嚴格原樣優先與精準例外處理 (Verbatim-First & Explicit KaTeX Error Policy)**：數學渲染優先以原始 TeX 執行嚴格編譯（`throwOnError: true`），確保所有合法公式與轉義百分比符號 `\%` 100% 原樣輸出不被改寫；僅當原始 LaTeX 解析失敗時允許以下兩項安全／明確稽核之顯示回復：
     1. 自動轉義 `\text{...}` 內部未跳脫之底線（例如 `LIB-506` 的 `\text{[SAFETY_BOUND]}` 修正為 `\text{[SAFETY\_BOUND]}`）。
     2. 嚴禁對未經查證的不平衡下標括號進行通用 Regex 猜測修復；僅對已核對筆誤來源之 `LIB-802` 原始公式設置精確字串匹配例外（`EXACT_KATEX_DISPLAY_EXCEPTIONS`：原始筆記保持唯讀不動，網站僅做顯示修復）。任何未知公式解析錯誤皆必須以 `console.error` 明確回報並透過 `.katex-error` 顯式呈現，不得靜默改寫或宣稱語意正確。
   - **多行數學區塊 (`$$...$$`) 與標題完整性**：嚴禁在 Markdown 解析前用單純 Regex 切割標題。分段切割函式（`splitMarkdownByH2`）必須同時追蹤程式碼圍欄與奇偶成對 `$$` 數學區塊，確保公式內部註解不誤判為章節；標題生成與錨點計算透過 Marked Custom Heading Renderer 完成，並濾除裝飾性 Unicode Emoji（保留 `[FACT]` / `[RULE-###-##]` 證據標記與數學內容）。
   - **Mermaid 本地視覺圖表與明確失敗守則 (Local Mermaid SVG & Explicit Fallback)**：全館 ```` ```mermaid ```` 區塊必須渲染為真實視覺 SVG（禁顯未渲染原始碼或依賴外部 CDN）。建置階段透過 `site/scripts/render-mermaid.mjs` 預先產出靜態 SVG 快取至 `site/src/data/mermaid-cache/`（供應無瀏覽器環境之 CI 快速建置）；未知或新增語法由前端 `src/scripts/reader-enhance.ts` 動態載入本地打包之 `mermaid` 套件接手渲染。圖表外框具備縮放（`−`/`100%`/`+`/高度切換）、寬度自適應防裁切與次要 `<details>`「查看原始碼」；含 Mermaid 之章節保持於正文開放流程。若語法不支援或渲染失敗，必須顯式呈現 Accessible 錯誤區塊（`.mermaid-error-box`）並展開原始碼。
   - **Obsidian WikiLinks 精簡可讀性**：支援雙括號語法（`[[LIB-### ...]]` 與 `[[LIB-### ...|自訂標題]]`），透過 `CONCISE_VOLUME_LABELS` 與 `formatConciseWikiLabel` 轉為無歧義簡短識別連結（完整篇名保留於 `title` 與 `aria-label`，作者自訂 `|別名` 優先保留），維持站內雙語路由 `.wikilink-badge` 樣式。

---

## 6. 系統化學習路徑教學價值規範 (Learning Path Educational Value)

學習路徑是引導讀者循序漸進攻克領域知識的教學鷹架，必須嚴格落實以下規則：

1. **教學引導旅程 (Guided Learning Journey)**：
   - 每條路徑必須明確標註：
     - **適用對象 (Target Audience)**：明確指出適合大學生、專題生或高階研究員。
     - **預期學習收穫 (Learning Outcomes)**：條列完成研讀後的具體認知成果。
     - **起始推薦典籍 (Starting Volume & Role Fidelity)**：真實說明起始節點角色——例如 `LIB-000` 為「全館總覽、分館分類、證據標記與 DAG 拓樸導航系統」，不得虛構其教授數學或幾何基礎（第一性原理與數學推導實際始於 `LIB-001` / `LIB-101`）。
     - **步驟研讀目的 (Step Objective)**：說明每個節點在路徑中的角色。
     - **為何進入下一步 (Why Next Step)**：說明從前一節點過渡到下一節點的邏輯因果關係。
2. **數學級嚴謹的直接 DAG 拓樸邊 (Strict Direct DAG Edge Invariant)**：
   - 任何相鄰步驟 `A ──► B` 必須具備雙向宣告直接依賴：
     - 條件一：節點 B 的 Frontmatter `prerequisites` 明確宣告 A。
     - 條件二：節點 A 的 Frontmatter `successors` 明確宣告 B。
     - 條件三：節點 A 與 B 的 `LIB-###` ID 與雙語 Markdown 來源檔均真實存在。
   - 目前全館 3 條已驗證之直接路徑（共 23 節點、20 條直接拓樸邊）：
     - **路線 1 (Deep Learning)**: `LIB-000` ➔ `LIB-001` ➔ `LIB-101` ➔ `LIB-203` ➔ `LIB-405` ➔ `LIB-602` (5 邊)
     - **路線 2 (Computer Vision)**: `LIB-000` ➔ `LIB-001` ➔ `LIB-101` ➔ `LIB-203` ➔ `LIB-401` ➔ `LIB-501` ➔ `LIB-502` ➔ `LIB-504` ➔ `LIB-505` ➔ `LIB-506` (9 邊)
     - **路線 3 (AI Agents)**: `LIB-000` ➔ `LIB-001` ➔ `LIB-101` ➔ `LIB-203` ➔ `LIB-405` ➔ `LIB-703` ➔ `LIB-704` (6 邊)
3. **首屏方向選擇矩陣與精簡卡片 (First-Screen Track Matrix & Clean Cards)**：
   - 學習路徑頁面頂部於桌面首屏（1440x900）立即呈現三張具清晰定位、模組數量與直接「查看路線 / 直接開始第 1 步」按鈕的方向卡片（`.track-chooser-card`），確保第一次造訪之學生能在三秒內做出學習選擇。
   - 移除每個節點卡片上重複出現的 `DIRECT EDGE`、`VERIFIED INVARIANT` 等重複性徽章，改以「我將學到什麼／從哪裡開始／為何下一步」之教學順序呈現，貫徹 Content Density & Interface Clarity 原則。
4. **全景地圖次要收合 (Collapsible Panorama Section)**：
   - 龐大的全館總覽 SVG 拓樸圖移至頁面底部之折疊手風琴區塊（`<details class="roadmap-accordion">`），且**預設折疊（不加 open 屬性）**，確保讀者進站時優先聚焦於路線選擇與步驟卡。

---

## 7. 新增頁面標準作業流程 (Page Extension Workflow)

```mermaid
flowchart TD
    Step1["1. 閱讀規範<br/>(Read AGENTS.md)"] --> Step2["2. 確認資料來源<br/>(Verify SSOT)"]
    Step2 --> Step3["3. 選用共用模板<br/>(BaseLayout & Icon.astro)"]
    Step3 --> Step4["4. 實作頁面與路由<br/>(Create src/pages/zh & en)"]
    Step4 --> Step5["5. 更新導覽與切換<br/>(Update Navigation & Language Switch)"]
    Step5 --> Step6["6. 執行完整驗證<br/>(Build & Playwright Test)"]
    Step6 --> Step7["7. 停止於乾淨本地完成<br/>(Wait for Git Authorization)"]
```

### 步驟說明：
1. **閱讀規範**：重新檢驗本文件與設計系統規定，嚴格禁止 UI Emoji，遵循讀者第一版面與內容密度原則。
2. **確認資料來源與拓樸真實性**：確認新頁面所需資料來自現有 Markdown Frontmatter 或真實系統統計。若涉學習路徑，必經 `verifyLearningPathsStrictly()` 守門。
3. **選用共用模板與無 Emoji 組件**：使用 `src/layouts/BaseLayout.astro` 與 `src/components/Icon.astro`。
4. **實作頁面與路由**：在 `site/src/pages/zh/` 與 `site/src/pages/en/` 建立對稱的 `.astro` 頁面，保持路由對稱。
5. **更新導覽**：於 `Header.astro` 與 `Footer.astro` 加入新頁面連結，保持中英文選單一致。
6. **執行完整驗證**：在 `site/` 依序執行 `npm run verify-paths`、`npm run build`（含 Astro 編譯檢查）與 `npm test`（Playwright 瀏覽器實測與視覺截圖）。
7. **停止於乾淨本地完成**：回報真實證據（Log 與截圖），等待使用者 Git Delivery 授權。

### 7.1 已實作之可重複擴充實證案例：Learning Paths 雙語頁面

為證明依循 `AGENTS.md` 新增頁面規則可實際落地並通過完整自動化驗證，目前網站中**真正已實作、已對稱建置並通過測試**的可重複擴充頁面案例為學習路徑導覽頁：

- **對稱雙語實作檔案**：`site/src/pages/zh/paths.astro` 與 `site/src/pages/en/paths.astro` 皆透過薄路由包裝共用元件 `site/src/components/PathsPage.astro`（同樣模式亦應用於 `HomePage.astro` 與 `ReaderPage.astro`），確保雙語結構同步演進且零重複樣板。
- **模板與圖標規範**：繼承 `BaseLayout.astro` 並互設 `alternateUrl`（`/library/zh/paths/` ↔ `/library/en/paths/`），介面圖標全面採用 `Icon.astro`（零 Emoji）。
- **SSOT 資料整合**：透過 `loadLibraryArticles()` 即時讀取根目錄 56 篇筆記之 `title`、`status`、`hall` 與 `callNumber`，並結合 `CURATED_LEARNING_PATHS`（3 條路線、23 節點、20 條直接拓樸邊）渲染，絕不複製或修改原始筆記。
- **品質與回歸保障**：單一 `<h1>`、CSS Grid 採 `minmax(0, 1fr)` 與 `min-width: 0`（Desktop 1440px / Mobile 390px 零橫向溢出），並受 `npm run verify-paths`、`npm run build` 與 Playwright `npm test` 持續守門。

### 7.2 AI 新增雙語頁面示意範本（Blueprint — 尚未建立之示意程式）

> **注意**：以下 `example.astro` 為提供後續 AI 代理人參考之**尚未建立、尚未執行建置與測試的示意範本（Blueprint Template）**；倉庫內實際並沒有 `example.astro` 頁面。任何 AI 執行新增頁面任務時，須依此結構實際建立 `zh/` 與 `en/` 雙語對稱檔案並通過驗證，方可勾選檢核表。

```astro
---
// [示意範本 — 尚未建立] site/src/pages/zh/example.astro（須同步建立 site/src/pages/en/example.astro）
import BaseLayout from '../../layouts/BaseLayout.astro';
import Icon from '../../components/Icon.astro';
import { loadLibraryArticles, type ArticleData } from '../../lib/library';

const { zh } = loadLibraryArticles();
const featuredIds = ['lib-903', 'lib-904'];
const guides = featuredIds.map(id => zh.get(id)).filter(Boolean) as ArticleData[];
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const alternateUrl = `${base}/en/example/`;
---

<BaseLayout title="研究專題方法導讀 (Research Methodology Guide)" lang="zh" alternateUrl={alternateUrl}>
  <div class="container py-8">
    <header class="page-header">
      <!-- 規範遵循：使用統一 SVG Line Icon，嚴格禁止 Emoji -->
      <div class="header-badge">
        <Icon name="academic" size={16} />
        <span>研究指引 (Research Guide)</span>
      </div>
      <h1 class="page-title">研究方法與專題藍圖導讀</h1>
      <p class="page-subtitle">從既有知識庫 SSOT 動態彙整指定典籍之雙語頁面擴充示意。</p>
    </header>

    <!-- 規範遵循：CSS Grid 搭配 minmax(min(280px, 100%), 1fr) 與 min-width: 0 防止橫向撐破版面 -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: 1.5rem;">
      {guides.map(article => (
        <article style="min-width: 0; background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 1.5rem; border-radius: 8px;">
          <span style="font-family: var(--font-mono); color: var(--accent-cyan); font-size: 0.85rem;">{article.callNumber}</span>
          <h2 style="font-size: 1.15rem; margin: 0.5rem 0;">
            <a href={`${base}/zh/notes/${article.slug}/`}>{article.title}</a>
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.92rem; overflow-wrap: anywhere;">{article.excerpt}</p>
        </article>
      ))}
    </div>
  </div>
</BaseLayout>
```

**AI 新增頁面執行前／後檢核表（Agent Execution Checklist — 建立新頁時逐項核對後勾選）**：
- [ ] **SSOT 唯一真理**：資料實際來自 `loadLibraryArticles()` 等現有來源並於模板中使用，未修改根目錄原始 Markdown 典籍。
- [ ] **雙語對稱路由與導覽**：同步建立 `site/src/pages/zh/<page>.astro` 與 `site/src/pages/en/<page>.astro` 並於 `Header.astro` / `Footer.astro` 更新連結與 `alternateUrl`。
- [ ] **零 Emoji 守則**：介面元素全面使用 `<Icon name="..." />`，無任何 Emoji 字元。
- [ ] **單一 H1 與防溢出**：整頁僅有一個 `<h1>`，Grid 與卡片具備 `minmax(0, 1fr)` / `min-width: 0` 防溢出保護。
- [ ] **完整實證測試通過**：實作完成後實際執行 `npm run verify-paths`、`npm run build`（產出頁數包含新增雙語頁）與 `npm test` 全部 PASS。

---

## 8. 驗證與測試規則 (Validation Rules)

在完成任何頁面新增或修改後，必須完成以下六大關卡驗證：

1. **原始知識庫驗證器**：
   ```bash
   python scripts/validate_library.py
   ```
   - 預期結果：於乾淨工作區（GitHub CI `validate.yml` 環境，不含 `site/node_modules`）回報 `ALL 11 INTEGRITY INVARIANTS PASSED`。若於本機存在 `site/node_modules` 時執行，舊版腳本會掃描第三方 `node_modules/**/*.md` 之已知限制，請以 CI 或隔離環境驗證為準。
2. **學習路徑直接拓樸邊自動化驗證**：
   ```bash
   cd site && npm run verify-paths
   ```
   - 預期結果：20 條直接拓樸邊 100% 通過驗證。
3. **Mermaid 本地靜態 SVG 快取同步（僅於新增或改動 Mermaid 圖表後重跑）**：
   ```bash
   cd site && npm run render-mermaid
   ```
   - 預期結果：更新 `site/src/data/mermaid-cache/` 之 SVG 與 `manifest.json`，確保無 Chromium 之 GitHub Actions 建置環境亦可直接輸出視覺圖表。
4. **Astro 靜態建置**：
   ```bash
   cd site && npm run build
   ```
   - 預期結果：65 頁靜態 HTML 產出完畢，0 錯誤。
5. **Markdown 與 KaTeX 渲染品質檢測**：
   - 抽驗 `LIB-405`、`LIB-104`、`LIB-703`、`LIB-000` 等篇目，確認內文無殘留 `**`、無裝飾性 Emoji 噪音，KaTeX 數學式與 Mermaid 圖表均正確解析渲染。
6. **端對端瀏覽器與靜態語料實測 (Playwright)**：
   ```bash
   cd site && npm test
   ```
   - 預期結果：53 項靜態語料與桌機（1440x900）／手機（390x844）瀏覽器實測全數 PASS（涵蓋全 56 篇雙向語言切換與正文無衝突、56 篇導引純淨度、Mermaid 視覺 SVG 與失敗警訊 Fallback、零 Google Fonts 外部請求、WCAG AA 對比度 `>= 4.5:1`、Learning Paths 3 路線首屏切換、Reader 漸進教學階層與 `#research-details`／可收合 TOC、手機首屏密度、單一 H1、0 KaTeX 錯誤、0 雙重跳脫、0 橫向溢出、`LIB-504` 真實性）。
7. **核心視覺驗收截圖產出（於 `site/tests/screenshots/`，不提交至 Git）**：
   - `homepage-zh-desktop-1440-top.png` / `homepage-zh-mobile-390-top.png`
   - `paths-zh-desktop-1440-top.png` / `paths-zh-mobile-390-top.png`
   - `lib000-zh-desktop-1440-diagram.png` / `lib000-en-desktop-1440-diagram.png`
   - `lib703-zh-desktop-1440-top.png` / `lib405-zh-desktop-1440-top.png` / `lib104-zh-desktop-1440-math.png`

---

## 9. 安全守則與 Git 操作邊界 (Safety & Git Gate)

- **嚴禁破壞性操作**：
  - 禁止執行 `git reset --hard`、`git clean -fd`、`git checkout -f`。
  - 禁止執行未經授權的 Force Push 或覆蓋他人工作區。
- **嚴禁未授權修改原始筆記**：
  - 核心筆記（`00_*` 至 `09_*`、`en/*`）為嚴格唯讀。
  - 允許編輯範圍僅限：`AGENTS.md`、`site/**`、`.github/workflows/deploy-pages.yml`、`README.md` 的網站入口章節。
- **Git Delivery Gate**：
  - 本地開發完成後，**不得自行執行 `git add`、`git commit`、`git push` 或發起 PR**。
  - 必須將修改成果、測試日誌與驗證報告整理齊全，停留在乾淨的本地完成狀態，等待使用者親自審查並授權進一步操作。
- **真實性承諾**：
  - 所有測試狀態（`PASS` / `FAIL` / `PARTIAL` / `NOT_RUN`）必須基於終端機命令的真實輸出，嚴禁任何模擬造假。
