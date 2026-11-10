# Grand Library — Web Presentation Layer (`site/`)

本目錄為 **Grand Library — CS & AI Knowledge Atlas** 的現代化靜態網站原始碼目錄。

---

## 1. 架構定位與真理原則 (Architectural SSOT)

- **單一真理來源 (Single Source of Truth, SSOT)**：儲存庫根目錄的 10 個知識分館（`00_*` 至 `09_*`）與 `en/` 鏡像資料夾中的 28 對（共 56 篇）核心 Markdown 筆記為不可動搖的內容本體。
- **純靜態呈現層 (Presentation Layer)**：`site/` 不複製、不修改、不分裂原始筆記，而是透過 `src/lib/library.ts` 直接讀取根目錄 Markdown 來源，動態解析 YAML Frontmatter、KaTeX 數學式、Obsidian 雙括號 WikiLinks 與 SVG 圖表，輸出純靜態 HTML。

---

## 2. 技術棧 (Technology Stack)

- **Framework**: Astro 5.x (SSG 靜態網站生成模式)
- **Language**: TypeScript 5.x
- **Mathematics**: KaTeX（編譯期靜態預渲染，零版面跳動，本機離線字型支援）
- **Icon System**: 專屬 SVG Line Icon 元件（`src/components/Icon.astro`，UI 全面零 Emoji 規範）
- **Markdown Pipeline**: Marked 15.x + 自研 CJK 粗體標點語彙分析器 (`cjkStrong`) + Custom Heading Renderer + Single H1 消除管線
- **Link Resolution**: Obsidian WikiLinks 動態解析轉換為型態安全站內路由
- **Design System**: 深色學術研究風格（Dark Academic Research Library Theme），繁體中文優先雙語介面
- **Target Deployment**: GitHub Pages (Base Path: `/library`)
- **Testing**: Playwright 端對端瀏覽器自動化測試 + 拓樸有向無環圖（DAG）自動化邊緣對稱性校驗器

---

## 3. 本地開發、可重現建置與測試命令 (Reproducible Build & Test)

網站具備完全鎖定的 `package-lock.json`，支援乾淨隔離的依賴安裝與可重現建置：

```bash
# 1. 進入網站原始碼目錄
cd site

# 2. 乾淨重現安裝依賴 (CI Mode)
npm ci

# 3. 執行靜態資產同步 (SVG 圖表與 KaTeX 字型)
npm run sync-assets

# 4. 執行學習路徑嚴格 DAG 拓樸直接依賴檢查
npm run verify-paths

# 5. 啟動本機開發伺服器
npm run dev

# 6. 執行正式靜態建置 (包含 verify-paths 前置守門)
npm run build

# 7. 執行完整自動化測試 (包含 DAG 檢驗與 Playwright 47 項桌面/手機真實瀏覽器測試)
npm test

# 8. 本機預覽建置成果
npm run preview
```

---

## 4. Editorial UX Redesign & Final Quality Fix 設計與實證指南

本專案嚴格遵循根目錄 `AGENTS.md` 之設計系統規範，落實高階研究圖書館品質：

### 核心成果亮點：

1. **UI 介面全面禁用 Emoji (UI No-Emoji Rule)**
   - 全站 Header、Footer、分館卡片、標籤、按鈕、搜尋列與狀態徽章，全面移除所有未經統一的 Emoji。
   - 採用純向量 SVG Line Icon 系統 (`src/components/Icon.astro`)，風格沉穩一致。

2. **讀者第一導向閱讀體驗 (Reader-First Editorial Layout)**
   - **第一屏研讀導引與閱讀入口 (Study Orientation & Action)**：文章頂部優先呈現篇名、核心研讀導引以及「開始閱讀 (Start Reading)」入口按鈕（錨點平滑跳轉至 `#article-content`）。移除不精確、誤導性的技術文章「預估閱讀時間」。
   - **漸進式揭露抽屜 (Progressive Disclosure Drawer)**：密集的技術規格（典籍狀態、作者、統一格式化為 `YYYY-MM-DD` 撰寫維護日、目標讀者、數學基石、硬體對齊、104 條形式化系統合約）與前後依賴，收納於 `<details class="metadata-drawer">` 中，讀者按需展開，第一屏維持專注。
   - **舒適閱讀排版**：閱讀欄寬限制於 68–76 字元（760px），行高 1.8，字級 1.05rem；表格、程式碼與公式具備橫向滾動保護。
   - **常駐章節目錄 (Sticky TOC)**：桌面端右側懸浮目錄，平滑捲動跳轉。

3. **零星號洩漏、單一 H1 與零雙重跳脫 (Rendering QA)**
   - **零星號洩漏 (Zero Leaked Asterisks)**：針對 CommonMark 規範中 CJK 標點與粗體（如 `是**「...」**`）之衝突，引入自研 `cjkStrong` 語彙分析器，使裸露星號降為 **0**。
   - **單一主要 H1 守則 (Single Primary H1 Invariant)**：Reader 每頁僅保留版面 Header 之唯一文章大標題；Markdown 原始內文之第一行標題（`# 標題`）由渲染器在語意前置解析期消除，同時 Marked Custom Heading Renderer 針對 `depth === 1` 一律返回空字串並不計入目錄，全館 56 篇雙語典籍 H1 違規數嚴格為 **0**。
   - **零雙重跳脫 (Zero Double Escaping)**：在生成目錄（TOC）與標題錨點 ID 前，精確還原 Marked 內建 HTML Entities 為乾淨純文字，再由 Astro 範本進行安全單次跳脫，杜絕 `&amp;amp;` 或 `&amp;#39;` 編碼洩漏。
   - **KaTeX 原樣優先與容錯修復 (Verbatim-First & Robust KaTeX Invariant)**：優先以原始 TeX 嚴格編譯，確保全館合法公式 100% 原樣輸出；僅針對解析失敗之公式進行目標容錯（`\text{...}` 內部底線跳脫與未閉合下標括號修復），全館 56 篇典籍達到 **0 個 `katex-error`**。

4. **教學引導旅程學習路徑 (Guided Learning Journey)**
   - 學習路徑提供適用對象（Target Audience）、學習收穫（Learning Outcomes）、起始推薦（Starting Volume）、步驟目的（Step Objective）與為何下一步（Why Next Step）。
   - 100% 嚴格驗證全館 3 條路徑、23 個時序節點與 20 條直接 DAG 拓樸邊。
   - 移除節點卡片上冗餘重複的「直接拓樸邊」標籤，貫徹 Content Density 原則。
   - 全館巨型 SVG 拓樸圖移至頁面底部之折疊手風琴區塊（`<details class="roadmap-accordion">`），且**預設折疊**。

5. **搜尋範圍誠實命名 (Article Search Transparency)**
   - 目錄檢索文案統一標明為「文章搜尋」，明確說明搜尋涵蓋篇名、編號、標籤與摘要，杜絕誇大全文搜尋。

6. **典籍介紹真實性 (Content Fidelity)**
   - 首頁展示之 LIB-504 正確標註為「3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與可微分光柵化」，推薦理由說明體積渲染積分與 GPU Tile-based 光柵化架構，絕無張冠李戴之空間變換網路 (STN)。

7. **版面零橫向溢出 (Zero Desktop Overflow)**
   - 桌面端與行動端均嚴格保證 `scrollWidth <= clientWidth`（1440px 桌面端無橫向捲動條），Grid 容器搭配 `minmax(0, 1fr)` 與 `min-width: 0`。

---

## 5. 驗收截圖清單 (Verification Screenshots)

Playwright 端對端測試已自動產出 6 大驗收截圖於 `tests/screenshots/`：
- `homepage-zh-desktop-1440.png` (1440x900 桌面版首頁)
- `homepage-zh-mobile-390.png` (390x844 手機版首頁)
- `paths-zh-desktop-1440.png` (1440x900 桌面版教學路徑)
- `paths-zh-mobile-390.png` (390x844 手機版教學路徑)
- `reader-lib405-zh-desktop-1440.png` (1440x900 桌面版 LIB-405 閱讀頁)
- `reader-lib405-zh-mobile-390.png` (390x844 手機版 LIB-405 閱讀頁)

---

## 6. AI 新增頁面示範 (AI Page Extension Demonstration — Week 9 Core Theme)

本專案為大學第九週作業核心主題：「**建立 `AGENTS.md`，讓 AI 能依照專案規則持續新增網頁**」。

為證明任何全新的 AI 代理人在無歷史上下文之 Session 下，皆能重複遵守規則擴充網站，本專案提供具體範例與作業檢驗標準：

### 示範案例：AI 新增「研究專題導讀頁面」標準作業實踐

1. **依據 SSOT 唯一真理來源**：
   - AI 調用 `src/lib/library.ts` 內之 `loadLibraryArticles()` 或現有 Frontmatter，不修改、不分裂根目錄 Markdown 筆記。
2. **選用共用版面與無 Emoji 元件**：
   - 繼承 `src/layouts/BaseLayout.astro`，引入 `src/components/Icon.astro`（如 `<Icon name="academic" size={16} />`）。
   - 嚴格遵守 UI 零 Emoji 禁令，杜絕任何 Emoji 符號出現在介面按鈕、徽章或導覽中。
3. **建立雙語對稱路由**：
   - 中文版建立於 `site/src/pages/zh/example.astro`。
   - 英文版建立於 `site/src/pages/en/example.astro`。
   - 互設 `alternateUrl`，使 Header 語言切換紐能無縫原位跳轉。
4. **落實防溢出與單一 H1 規範**：
   - 頁面僅保留一個頂級 `<h1>`。
   - CSS Grid 容器一律採用 `minmax(0, 1fr)` 與 `min-width: 0`，杜絕任何撐破視窗寬度之橫向滾動。
5. **執行可重現自動化驗證**：
   ```bash
   npm run verify-paths   # 20 條直接 DAG 拓樸邊 100% 通過
   npm run build          # 靜態 HTML 編譯產出，0 錯誤
   npm test               # 47 項 Playwright 測試與無頭瀏覽器驗收 100% 通過
   ```
