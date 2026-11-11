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
- **Markdown & Diagram Pipeline**: Marked 15.x + `cjkStrong` + Custom Heading Renderer + Build-Time Mermaid SVG Cache (`src/data/mermaid-cache/`, local bundled `mermaid` fallback with zero external CDN) + Explicit Error Fallback
- **Shared Bilingual Architecture**: 共用元件 `HomePage.astro`、`PathsPage.astro`、`CatalogPage.astro`、`AboutPage.astro`、`ReaderPage.astro` 搭配對稱薄路由包裝 (`src/pages/{zh,en}/*.astro`)
- **Link Resolution**: Obsidian WikiLinks (`CONCISE_VOLUME_LABELS` 精簡標籤＋完整 `title`/`aria-label`) 與站內雙語路由解析
- **Design System**: 深色學術研究風格（Midnight Archival Monograph，`DESIGN.md` & `src/styles/global.css`），繁體中文優先雙語介面
- **Target Deployment**: GitHub Pages (Base Path: `/library`)
- **Testing**: Playwright 端對端瀏覽器自動化測試 + DAG 拓樸校驗（共 **53** 項靜態語料＋桌面/手機瀏覽器驗收）

---

## 3. 本地開發、可重現建置與測試命令 (Reproducible Build & Test)

網站具備完全鎖定的 `package-lock.json`，支援乾淨隔離的依賴安裝與可重現建置：

```bash
# 1. 進入網站原始碼目錄
cd site

# 2. 乾淨重現安裝依賴 (CI Mode)
npm ci

# 3. 執行靜態資產同步與（選用）更新 Mermaid 靜態圖表快取
npm run sync-assets
# npm run render-mermaid  # 若新增/更動原始 Markdown 中的 Mermaid 區塊時重跑以更新 src/data/mermaid-cache/

# 4. 執行學習路徑嚴格 DAG 拓樸直接依賴檢查
npm run verify-paths

# 5. 啟動本機開發伺服器
npm run dev

# 6. 執行正式靜態建置 (包含 verify-paths 前置守門)
npm run build

# 7. 執行完整自動化測試 (包含 DAG 檢驗與 Playwright 53 項語料＋桌面/手機瀏覽器驗收)
npm test

# 8. 本機預覽建置成果
npm run preview
```

---

## 4. Editorial UX Redesign & Quality Architecture 設計與實證指南

本專案嚴格遵循根目錄 `AGENTS.md` 之設計系統規範，落實高階研究圖書館品質：

### 核心成果亮點：

1. **UI 介面全面禁用 Emoji (UI No-Emoji Rule)**
   - 全站 Header、Footer、分館卡片、標籤、按鈕、搜尋列、狀態徽章與渲染章節標題，全面移除裝飾性 Emoji，採用 SVG Line Icon 系統 (`src/components/Icon.astro`)。

2. **讀者第一教學階層體驗與漸進研究附錄 (Reader-First Pedagogy & `#research-details`)**
   - **第一屏教學導引**：文章頂部呈現篇名、基於 Frontmatter `math_foundations` 與分館結構產出之非重複「核心主題 (`coreFocus`)」、正文摘要要點 (`takeaways`) 及「開始學習」CTA（含圖表記事額外提供「檢視知識拓樸圖」錨點）；開篇直接進入 **觀念入門 (Understand) -> 核心脈絡 (Explore) -> 技術深化與推導 (Technical Deep Dive)**。
   - **研究附錄折疊抽屜 (`#research-details`)**：密集規格（狀態、作者、`YYYY-MM-DD` 維護日、目標讀者、數學基石、硬體對齊、`[RULE-###-##]` 系統合約）、前後依賴與權威文獻統一收斂於 `#research-details` 抽屜，點選文內錨點時自動展開。
   - **階層式可收合目錄與 Scroll-Spy**：右側閱讀大綱預設僅顯示 H2 章節，子章節（H3/H4）隨 `IntersectionObserver` Scroll-Spy 或點擊展開。
   - **精簡 WikiLinks**：Obsidian 雙括號連結以無歧義精簡標籤顯示（完整標題置於 `title` / `aria-label`），維持行文流暢。

3. **Mermaid 本地視覺圖表與 Render QA**
   - **Mermaid 本地預渲染＋動態備援**：`LIB-000` (ZH/EN) 與 `LIB-001` (ZH) 等 ```` ```mermaid ```` 圖表於建置期渲染為 SVG 並快取於 `src/data/mermaid-cache/`，支援縮放、`Full height` 切換與「查看原始碼」次要抽屜；未知區塊由本地打包 `mermaid` 動態渲染，解析失敗顯式回報錯誤警訊，全程零外部 CDN。
   - **零星號、單一 H1、零雙重跳脫與 KaTeX 原樣優先**：支援 `cjkStrong` 中文粗體解析、單一頂部 `<h1>`、`splitMarkdownByH2` 多行 `$$` 塊精確追蹤、`texToReadablePlain` 純文字轉換與嚴格 `throwOnError: true` KaTeX 編譯（僅安全跳脫 `\text{...}` 內底線及已稽核 `LIB-802` 顯式例外）；全館 56 篇 **0 個 `katex-error`**。

4. **方向優先學習路徑與精簡首頁 (Direction-First Learning Paths & Editorial Homepage)**
   - **學習路徑第一屏方向選擇矩陣**：桌面首屏（1440x900）立即呈現 3 張差異化方向卡片（Deep Learning、Computer Vision & 3D、AI Agents），先選方向或直達第 1 步，再展開 23 個步驟詳情；全館巨大 SVG 拓樸圖移至頁面底部並預設折疊，驗證全館 3 條路徑、23 節點與 20 條直接 DAG 拓樸邊。
   - **首頁精簡化**：移除廉價 `.metric-card` KPI 儀表板方塊，改以單行編輯資訊帶與路線入口引導學習；`LIB-504` 正確對應 NeRF 與 3DGS（無 STN 誤植）。

5. **搜尋透明度與響應式安全**
   - 目錄統一標註「文章搜尋」；全站桌面（1440px）與行動（390px）保證 `scrollWidth <= clientWidth`，Grid 採用 `minmax(0, 1fr)` 與 `min-width: 0`。

---

## 5. 驗收截圖清單 (Verification Screenshots)

Playwright 端對端測試自動產出下列核心驗收截圖於 `site/tests/screenshots/`（不提交至 Git）：
- `homepage-zh-desktop-1440-top.png` / `homepage-zh-mobile-390-top.png` (首頁 1440x900 與 390x844 首屏)
- `paths-zh-desktop-1440-top.png` / `paths-zh-mobile-390-top.png` (學習路徑 3 路線首屏選擇矩陣)
- `lib000-zh-desktop-1440-diagram.png` / `lib000-en-desktop-1440-diagram.png` (中／英 LIB-000 Mermaid 視覺圖表渲染與無裁切驗證)
- `lib703-zh-desktop-1440-top.png` / `lib405-zh-desktop-1440-top.png` / `lib104-zh-desktop-1440-math.png` (Reader 首屏教學導引、精簡 WikiLinks、可收合 TOC 與數學推導)

---

## 6. AI 新增頁面示範 (AI Page Extension Demonstration — Week 9 Core Theme)

本專案為大學第九週作業核心主題：「**建立 `AGENTS.md`，讓 AI 能依照專案規則持續新增網頁**」。

為證明任何全新的 AI 代理人在無歷史上下文之 Session 下，皆能重複遵守規則擴充網站，本專案提供具體範例與作業檢驗標準：

### 已實作實證與擴充標準作業實踐：

- **真正已實作之可重複擴充頁面**：`site/src/pages/zh/paths.astro` 與 `site/src/pages/en/paths.astro`（Learning Paths 雙語頁，透過 `loadLibraryArticles()` 整合 SSOT 資料與 20 條直接 DAG 拓樸邊）。
- **AI 擴充示意範本**：`AGENTS.md` 第 7.2 節提供未建立之 `example.astro` 示意範本，遵循以下五步驟擴充：

1. **依據 SSOT 唯一真理來源**：
   - AI 調用 `src/lib/library.ts` 內之 `loadLibraryArticles()` 或現有 Frontmatter 並實際於頁面渲染，不修改、不分裂根目錄 Markdown 筆記。
2. **選用共用版面與無 Emoji 元件**：
   - 繼承 `src/layouts/BaseLayout.astro`，引入 `src/components/Icon.astro`（如 `<Icon name="academic" size={16} />`）。
   - 嚴格遵守 UI 零 Emoji 禁令，杜絕任何 Emoji 符號出現在介面按鈕、徽章或導覽中。
3. **建立雙語對稱路由（示意，如 `<page>.astro`）**：
   - 同步建立 `site/src/pages/zh/<page>.astro` 與 `site/src/pages/en/<page>.astro`。
   - 互設 `alternateUrl`，使 Header 語言切換紐能無縫原位跳轉。
4. **落實防溢出與單一 H1 規範**：
   - 頁面僅保留一個頂級 `<h1>`。
   - CSS Grid 容器一律採用 `minmax(0, 1fr)` 與 `min-width: 0`，杜絕任何撐破視窗寬度之橫向滾動。
5. **執行可重現自動化驗證**：
   ```bash
   npm run verify-paths   # 20 條直接 DAG 拓樸邊 100% 通過
   npm run build          # 靜態 HTML 編譯產出（65 頁），0 錯誤
   npm test               # 53 項靜態語料＋桌面/手機 Playwright 瀏覽器驗收 100% 通過
   ```
