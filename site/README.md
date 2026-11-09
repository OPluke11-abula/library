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
- **Markdown Pipeline**: Marked 15.x + 自研 CJK 粗體標點語彙分析器 (`cjkStrong`) + Custom Heading Renderer
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

# 7. 執行完整自動化測試 (包含 DAG 檢驗與 Playwright 桌面/手機真實瀏覽器測試)
npm test

# 8. 本機預覽建置成果
npm run preview
```

---

## 4. Editorial UX Redesign v2 設計與實證指南

本專案遵循根目錄 `AGENTS.md` 之最新設計系統規範，落實 **Editorial UX Redesign v2**：

### 核心成果亮點：

1. **UI 介面全面禁用 Emoji (UI No-Emoji Rule)**
   - 全站 Header、Footer、分館卡片、標籤、按鈕、搜尋列與狀態徽章，全面移除所有未經統一的 Emoji。
   - 採用純向量 SVG Line Icon 系統 (`src/components/Icon.astro`)，風格沉穩一致。

2. **讀者第一導向閱讀體驗 (Reader-First Editorial Layout)**
   - **導讀摘要 (Executive Context Brief)**：文章開頭提供預估閱讀時間、目標讀者、數學基石與硬體對齊指引。
   - **漸進式揭露抽屜 (Progressive Disclosure Drawer)**：密集的拓樸座標、前後依賴與 104 條形式化系統合約收合於 `<details class="metadata-drawer">` 中，讓讀者第一眼即專注於文章內容。
   - **舒適閱讀排版**：閱讀欄寬限制於 68–76 字元（760px），行高 1.8，字級 1.05rem；表格、程式碼與公式具備橫向滾動保護。
   - **常駐章節目錄 (Sticky TOC)**：桌面端右側懸浮目錄，平滑捲動跳轉。

3. **零星號洩漏與完美 Markdown / LaTeX 渲染 (Zero Leaked Asterisks)**
   - 針對 CommonMark 規範中 CJK 標點與粗體（如 `是**「...」**`）之衝突，引入自研 `cjkStrong` 語彙分析器，使裸露星號降為 **0**。
   - 以 Marked Custom Heading Renderer 取代字串正則替換，杜絕區塊層級被誤當成 raw HTML 的解析失效問題。
   - KaTeX 數學公式於編譯期靜態解析，與 Markdown 語意徹底隔離。

4. **教學引導旅程學習路徑 (Guided Learning Journey)**
   - 學習路徑提供適用對象（Target Audience）、學習收穫（Learning Outcomes）、起始推薦（Starting Volume）、步驟目的（Step Objective）與為何下一步（Why Next Step）。
   - 100% 嚴格驗證全館 3 條路徑、23 個時序節點與 20 條直接 DAG 拓樸邊。
   - 全館巨型 SVG 拓樸圖移至頁面底部之折疊手風琴區塊（Collapsible Accordion）。

5. **搜尋範圍誠實命名 (Article Search Transparency)**
   - 目錄檢索文案統一標明為「文章搜尋」，明確說明搜尋涵蓋篇名、編號、標籤與摘要。

6. **內容密度與介面清晰度 (Content Density & Interface Clarity)**
   - 避免不必要的次要標籤與重複說明，優先透過版面結構、視覺層級與間距傳達資訊。
   - 保留關鍵操作標籤、導航上下文、無障礙標籤與教學推導細節，維持版面簡潔而不犧牲精確度。

---

## 5. 驗收截圖清單 (Verification Screenshots)

Playwright 端對端測試已自動產出 6 大驗收截圖於 `tests/screenshots/`：
- `homepage-zh-desktop-1440.png` (1440x900 桌面版首頁)
- `homepage-zh-mobile-390.png` (390x844 手機版首頁)
- `paths-zh-desktop-1440.png` (1440x900 桌面版教學路徑)
- `paths-zh-mobile-390.png` (390x844 手機版教學路徑)
- `reader-lib405-zh-desktop-1440.png` (1440x900 桌面版 LIB-405 閱讀頁)
- `reader-lib405-zh-mobile-390.png` (390x844 手機版 LIB-405 閱讀頁)
