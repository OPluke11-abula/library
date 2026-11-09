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

## 4. AI 頁面擴充實證指南 (Evidence of AGENTS.md Reusability)

本專案遵循根目錄 `AGENTS.md` 之「Page Extension Workflow（新增頁面標準作業流程）」。  
以下以修復與落地的 **Learning Paths（學習路徑）** 頁面為真實案例，展示 AI 如何在不破壞任何既有規則下擴充網站，並落實**數學級嚴謹的拓樸依賴**：

### 擴充實證歷程：

1. **Step 1: 閱讀與遵循規範 (Read AGENTS.md)**
   - 參照 `AGENTS.md` 第 4 節命名規範，確定路由為對稱之 `/library/zh/paths/` 與 `/library/en/paths/`。
   - 遵循第 3 節 Design System，套用 Dark Academic Research 風格與響應式排版。

2. **Step 2: 確認真實資料來源與嚴格 DAG 依賴 (Verify SSOT & Strict DAG Invariant)**
   - 嚴格拒絕「主題閱讀概念跳躍」，所有相鄰節點 `A ──► B` 必須具備雙向對稱直接依賴邊：
     - 條件一：節點 B 的 Frontmatter `prerequisites` 明確宣告 A。
     - 條件二：節點 A 的 Frontmatter `successors` 明確宣告 B。
     - 條件三：節點 A 與 B 的 `LIB-###` ID 與雙語 Markdown 來源檔均真實存在。
   - 經自動化掃描真實 Markdown Frontmatter，精確建立 3 條 100% 符合直接 DAG 拓樸的研讀路線（共 23 個時序節點、20 條雙向驗證之直接有向邊）：
     - **路線 1：深度學習核心理論與架構演進 (Deep Learning Foundations to Diffusion)**  
       `LIB-000` ➔ `LIB-001` ➔ `LIB-101` ➔ `LIB-203` ➔ `LIB-405` ➔ `LIB-602`  
       （6 個節點，5 條直接拓樸邊）
     - **路線 2：高維空間幾何與現代電腦視覺 (Computer Vision & High-Dimensional Geometry)**  
       `LIB-000` ➔ `LIB-001` ➔ `LIB-101` ➔ `LIB-203` ➔ `LIB-401` ➔ `LIB-501` ➔ `LIB-502` ➔ `LIB-504` ➔ `LIB-505` ➔ `LIB-506`  
       （10 個節點，9 條直接拓樸邊）
     - **路線 3：智慧代理人認知架構與推論系統 (AI Agents, Cognition & System Inference)**  
       `LIB-000` ➔ `LIB-001` ➔ `LIB-101` ➔ `LIB-203` ➔ `LIB-405` ➔ `LIB-703` ➔ `LIB-704`  
       （7 個節點，6 條直接拓樸邊）

3. **Step 3: 選用共用模板與元件 (Select Layout & Components)**
   - 引用 `src/layouts/BaseLayout.astro`，自動套用全站 Header、Footer 與 Dark Academic 主題變數。
   - 在路徑節點間加入 `.direct-edge-pill` 視覺徽章，明確標註真實 DAG 連線（`直接拓樸邊: LIB-xxx ➔ LIB-yyy`）。

4. **Step 4: 建立對稱頁面 (Create Symmetric Pages)**
   - 建立繁中頁面 `src/pages/zh/paths.astro`。
   - 建立英文鏡像頁面 `src/pages/en/paths.astro`。

5. **Step 5: 更新全域導覽列 (Update Navigation)**
   - 在 `src/components/Header.astro` 與 `src/components/Footer.astro` 的導覽陣列中加入「學習路徑 (Learning Paths)」，保持中英文選單原位切換一致。

6. **Step 6: 自動化守門員與多層驗證 (Automated Verification Gate)**
   - **拓樸守門**：新增 `scripts/verify-learning-paths.mjs` 並整合至 `src/lib/library.ts` 之 `verifyLearningPathsStrictly()`。任何一條邊不對稱或節點不存在，立即拋出 `[FATAL_DAG_VIOLATION]` 中斷 Build。
   - **靜態建置**：`npm run build`，56 篇核心文章與所有系統頁面 100% 產出（共 65 頁靜態 HTML）。
   - **原始不變量**：`python scripts/validate_library.py`，保持 11 項知識完整性不變量全部通過。
   - **端對端瀏覽器測試**：Playwright 桌面端與行動端實測，驗證 23 個時序節點與 20 個直接拓樸邊徽章均正確渲染，無任何 404 或樣式破版。

7. **Step 7: 交付真實證據 (Report with Real Evidence)**
   - 依據實際執行日誌回報各項指標，數據完全來自最新建置結果。

未來任何 AI 或工程師欲新增更多頁面（例如「術語表 Glossary」、「研究論文文獻索引」），皆須嚴格重現上述步驟。
