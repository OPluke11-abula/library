---
call_number: LIB-903
status: reviewed
invariants_count: 6
title: 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)
module: Research-Methodology-Capstone
category: Academic-Research
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Scientific Hypothesis Testing & Empirical Benchmarking
  - Rigorous Ablation Study & Factor Isolation
  - The 8-Stage Golden Research Pipeline
hardware_target:
  - Academic Compute Cluster (Slurm / RTX 4090 / A100 Nodes)
  - Edge Embedded Systems (NVIDIA Jetson AGX Orin / Nano)
created: 2026-09-17
author: Luke
tags:
  - 圖書館
  - 專題藍圖
  - 科研方法
  - 國科會計畫
  - 國科會C801
  - 研究所推甄
  - 中原大學資工系
  - 臺大資工
  - 清大資工
  - 交大資工
prerequisites:
  - "[[LIB-704 雙進程神經代理人：S1 非自迴歸型態決策引擎 (Jev) 與字節級介面反射模型 (CUA-S1) 深度解剖 (Dual-Process Neural Agent - S1 Non-Autoregressive Typed Decision Engine (Jev) & Byte-Level Interface Reflex Model (CUA-S1))]]"
  - "[[LIB-802 現代深度學習模型量化理論與低精度推論架構 (Quantization Mathematics & Low-Precision Inference)]]"
  - "[[LIB-901 經典專案實證復盤：從課堂作業到生產級 MNIST 手寫辨識系統 (Classic Project Post-Mortem - From Class Assignment to Production MNIST System)]]"
successors:
  - "[[LIB-904 學術科研文獻體系與前沿研究對齊 (Academic Research Corpus & Literature Synthesis)]]"
  - "[[LIB-905 前沿視覺與具身多模態專題研發藍圖：五大題目技術全景與消融實證指南 (Frontier Vision & Multimodal Capstone Blueprints - Five Grand Research Specifications)]]"
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/09_research_methodology/LIB-903%20Capstone%20Blueprint%20%26%20Academic%20Research%20Evolution%20%28Agent%20EN%29.md)

# 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-704 雙進程神經代理人：S1 非自迴歸型態決策引擎 (Jev) 與字節級介面反射模型 (CUA-S1) 深度解剖 (Dual-Process Neural Agent - S1 Non-Autoregressive Typed Decision Engine (Jev) & Byte-Level Interface Reflex Model (CUA-S1))]]、[[LIB-802 現代深度學習模型量化理論與低精度推論架構 (Quantization Mathematics & Low-Precision Inference)]]、[[LIB-901 經典專案實證復盤：從課堂作業到生產級 MNIST 手寫辨識系統 (Classic Project Post-Mortem - From Class Assignment to Production MNIST System)]]。
- **後續節點**：[[LIB-904 學術科研文獻體系與前沿研究對齊 (Academic Research Corpus & Literature Synthesis)]]、[[LIB-905 前沿視覺與具身多模態專題研發藍圖：五大題目技術全景與消融實證指南 (Frontier Vision & Multimodal Capstone Blueprints - Five Grand Research Specifications)]]。
- **難度等級**：學士畢業專題 / 碩士科研實戰。

---

## 一、💡 學士直觀心智模型：從「交作業」到「叩關頂大研究所的學術核武」

在大學部資工系，90% 的學生把手寫辨識作業當作一次性的學期任務：在 Colab 跑完程式碼，準確率超過 95%，交出報告就拋諸腦後。

然而，在頂級學者與頂大（台清交成）書審教授眼裡，**一個普通作業與頂尖科研作品的差距，從來不在於問題的起點有多宏大，而在於你的「研究縱深」與「系統完整度」**：
- 能否從「畫 1 猜 5」的尺度崩塌中，推導出訊號處理的取樣定理與質心演算法？（[[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]]）
- 能否從「直立 7 誤判 8」的荒謬現象中，診斷出資料集文化偏見與負權重空間幾何？（[[LIB-301 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)]]）
- 能否從 8 層過擬合的盲目自信中，引證 ICML 經典文獻並實作溫度縮放校準？（[[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]]）
- 能否在硬體層面精確計算 GPU Warp 排程與記憶體瓦片對齊？（[[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]）
- 能否全面承接指導教授的研究血脈與頂會/MDPI 論文資產？（[[LIB-904 學術科研文獻體系與前沿研究對齊 (Academic Research Corpus & Literature Synthesis)]]）

當你把這一切實證、推導與除錯過程沉澱為具備學術規格的技術閉環時，這不再是一份課堂作業，而是**你叩關頂大資訊工程研究所、爭取國科會大專生計畫與指導教授極致推薦信的基石核武**！

---

## 二、🔬 學術科研第一性原理：做論文不等於發明全新數學

### 1. 破除大專生科研迷思：頂會頂刊論文都在幹嘛？
許多大學生以為做學術研究必須像牛頓或愛因斯坦一樣，憑空發明一套全新的微積分或群論，因而產生巨大的科研焦慮與心理門檻。

事實上，在國際頂級計算機視覺與機器學習會議（CVPR, ICCV, ECCV, NeurIPS, ICML, ICLR）以及 IEEE / MDPI 指標期刊發表的論文中，**90% 以上都不是發明新數學，而是精準診斷痛點後的精妙創新！** 現代頂尖學術論文主要由以下四大經典科研範式構成：
1. **應用創新型 (Application Paper)**：
   * 將現有的頂尖模型（如 YOLO, Transformer, 3DGS）遷移至高價值、過去因物理條件嚴苛而無法解決的真實領域痛點（例如：智慧交通路口違規停車與號誌偵測、無人機空拍超微小農作目標辨識）。
2. **架構與模組改良型 (Architecture & Module Innovation)**：
   * 敏銳指出既有 SOTA 模型的結構性缺陷（例如局部特徵流失、注意力計算複雜度為 $\mathcal{O}(N^2)$ 難以擴展），進而設計專屬的即插即用新模組（例如：在 3D 點雲中引入 Hilbert 空間填充曲線序列化注意力、在多視角生成中引入視角解耦 LoRA）。
3. **損失函數與訓練策略型 (Loss Function & Training Strategy)**：
   * 網路骨幹不動，但為任務設計全新的幾何約束、資訊論度量或動態採樣策略（例如：提出資訊熵感知的自適應融合 EAAF、懲罰同相機場景偏誤的相機感知 CA-Jaccard 距離重排序）。
4. **演算法原創型 (Fundamental Algorithm)**：
   * 顛覆傳統概念，提出全新的通用計算架構或生成範式（例如：Transformer、Diffusion Models、Flow Matching）。

對於大專生與碩士研究生而言，**深耕前三種範式（應用創新、模組改良、目標函數創新），便足以產出震撼頂大書審委員與國際期刊的頂級成果！**

---

### 2. 論文研發的八階標準黃金閉環 (The 8-Stage Golden Research Pipeline)

任何一篇具備學術嚴謹度的高影響力論文，其背後必定遵循一套標準的思考與研發閉環：

```
1. 真實痛點問題 (Real-world Problem)
      │
      ▼
2. 診斷現有方法缺陷 (Identify Flaws of Existing Methods)
      │
      ▼
3. 提出突破性核心想法 (Propose Core Intuitive Idea)
      │
      ▼
4. 設計具體架構與模組 (Design Concrete Architecture / Module)
      │
      ▼
5. 用數學精確符號化 (Formalize Mathematically)
      │
      ▼
6. 嚴謹工程代碼實作 (Engineering Implementation)
      │
      ▼
7. 多維度量化對比實驗 (Quantitative Benchmark Experiments)
      │
      ▼
8. 消融實驗深度驗證 (Ablation Study: 證明每一個積木都有用)
```

---

### 3. 館藏科研黃金不變量合約

> 🌟 **「核心觀念濃縮成一句：數學是用來精確描述你的方法，不是為了讓論文看起來很厲害才硬湊公式。」**

* **公式硬湊的失敗案例**：原本只是一個很簡單的平均值，卻硬要寫成帶有黎曼積分符號與極限符號的五重積分，評審教授一眼就能看穿這是缺乏自信的學術裝逼，反而招致拒稿。
* **數學精準描述的成功案例**：你觀察到現有風格遷移演算法在過度風格化時，特徵圖的資訊分佈會從廣泛多樣驟降為單一模式，因此你**引入夏農資訊熵（Shannon Entropy）作為門檻函數，精準推導出融合權重隨時間步演進的封閉解**——這時，數學就是你直擊問題核心、無可辯駁的精準手術刀！

---

## 三、🎓 博士級科研演進樹：從 MNIST 出發的四大前沿分支

```
                         [MNIST 深度實證科研基石]
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
[分支一：幾何抗變形 OCR]     [分支二：3DGS 視角生成]     [分支三：極致邊緣加速]
 • STN 仿射自適應旋轉       • 2D 特徵對齊 3D 空間       • INT8 / FP4 模型量化
 • CRNN + CTC 手寫行解碼    • 前沿 3DGS 虛擬試穿        • TensorRT 運算元融合
 • TrOCR 視覺 Transformer   • (詳見 LIB-904 文獻體系)   • WebAssembly 零伺服器
         │                          │                          │
         └──────────────────────────┼──────────────────────────┘
                                    ▼
                  [分支四：多模態 Agent 協同閉環]
                   • ReAct 自我糾錯手寫畫板
                   • 主動學習不確定性回饋迴圈
```

### 1. 分支一：幾何抗變形手寫文字辨識引擎 (Robust HTR / OCR)
- **空間變換網路 (Spatial Transformer Networks, STN)**：
  引入 Jaderberg et al. (NeurIPS 2015) `[LITERATURE_RESULT]` 的 STN 模組。在影像送入分類器之前，透過可微雙線性網格採樣，網路自動預測 $2 \times 3$ 仿射矩陣：
  $$\begin{bmatrix} x_i^s \\ y_i^s \end{bmatrix} = \begin{bmatrix} \theta_{11} & \theta_{12} & \theta_{13} \\ \theta_{21} & \theta_{22} & \theta_{23} \end{bmatrix} \begin{bmatrix} x_i^t \\ y_i^t \\ 1 \end{bmatrix}$$
  自主學會將歪斜的 7 擺正、將過小的 1 放大，從根本上解決旋轉與尺度變形。
- **序列化端到端手寫文字行辨識**：
  升級為 **CRNN (CNN + Bi-LSTM + CTC Loss)** 或 **TrOCR (Vision Transformer)**，從單個手寫字符躍遷至手寫筆記整行自動轉錄。

### 2. 分支二：前沿 3DGS 視角生成與動態渲染
- **前沿核心研究**：聚焦於 3D Gaussian Splatting、視角生成、虛擬試穿與智慧視覺感知，依託高階 GPU 算力與先進可微光柵化管線。
- **科研對齊突破點**：
  將手寫/手繪 2D 線稿作為條件約束（ControlNet），利用 2D 骨幹提取多尺度幾何特徵，直接回歸預測 3D 高斯橢球的中心坐標 $\mu$、四元數旋轉 $q$、尺度 $s$ 與球諧色彩係數（參見 [[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]），實現**「單張手繪服裝草圖 $\to$ 即時 3D 虛擬試衣高斯渲染」**的突破性學術專題！

### 3. 分支三：邊緣端極致加速與 WebAssembly/WebGPU 部署 (Edge AI)
- **TensorRT 引擎編譯**：利用運算元融合（Operator Fusion）與 INT8 後訓練量化 (PTQ)，將推論延遲壓縮至 1ms 以內（對齊 [[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]）。
- **純前端零伺服器架構**：將模型導出為 ONNX 格式，結合 **ONNX Runtime Web** 在使用者瀏覽器端直接利用 WebGPU 執行硬體推論，達到 100% 使用者隱私保護與零伺服器維護成本。

---

## 四、🛠️ 專題獨立研發與全棧工程交付矩陣 (Solo Capstone Engineering Matrix: Luke)

本專案由 **Luke** 獨立主導全域架構設計、演算法理論推導、高維資料管線、模型訓練校準、底層硬體加速對齊與前端服務部署：

| 核心工程維度 | 負責人 | 核心技術交付物與成果 |
| :--- | :--- | :--- |
| **架構設計與演算法推導** | **Luke** | • 統籌全域演算法架構設計與數學形式化推導<br>• 主筆國科會大專生研究計畫書 (C801) 與學術論文<br>• 深入前沿學術文獻體系與高效能 GPU 算力生態 |
| **資料管線與實驗評測** | **Luke** | • 負責大規模手寫資料集（MNIST, EMNIST, IAM）收集、清理與質心動差校準<br>• 設計嚴格的消融實驗 (Ablation Study) 與基準對比測試<br>• 監控模型校準指標 (ECE) 與損失曲面收斂動態 |
| **系統工程與邊緣加速部署** | **Luke** | • 負責 ONNX / TensorRT 模型量化 (AWQ, INT4/FP8) 與微秒級硬體加速<br>• 研發高互動性 Gradio 即時手繪推論畫板與 3D 渲染展示服務<br>• 維護開源程式碼倉庫的 CI/CD、Docker 與性能基準測試 |

## 五、📝 國科會大專學生研究計畫 (`C801–C804`) 申請攻略與 `D-project` 論文級科研方法論突破

國科會大專生研究計畫每年由學校彙整申報，是頂大資工研究所推甄最具說服力的研究資歷之一（歷史通過率依當年度公告為準，團隊不得預先保證通過率或錄取結果）。從 `D-project` 研究工作系統實戰演化出的 **「`Carrier–Kernel` 解耦 × `T/P/N/C` 四維邊界 × 21 欄證據追溯協議」**，提供了一套可寫出具備頂會／SCI 期刊可信度論文的標準基礎設施：

### 1. 國科會官方四表件正名與計畫書五大段落結構 `[FACT]`
必須精確區分國科會《補助大專學生研究計畫作業要點》（113 年 11 月 1 日修正生效版）之官方表件，不可將整份計畫混稱為 `C801`：
- **`表 C801`（大專學生研究計畫綜合資料表）**：線上基本資料、中英文計畫名稱、研究領域代碼與中英文摘要。
- **`表 C802`（研究計畫內容正文）**：包含 **(1) 研究動機與問題意識、(2) 文獻探討與缺口定位、(3) 研究方法與進行步驟、(4) 預期完成工作項目與成果（甘特圖，預計 7 月至翌年 2 月共 8 個月，遇閏年 2 月計至 29 日）、(5) 參考文獻（IEEE/ACM 規範）**（頁數與格式以當年度官方系統規定為準，通常以 10 頁為上限原則）。
- **`表 C803`（耗材、物品、圖書及雜項費用明細表）**：研究經費編列。
- **`表 C804`（指導教授初評意見表）**：由指導教授登入系統填寫初評意見並上傳個人資料表。
- **法定倫理訓練要件（作業要點第 16 點第 4 款）**：申請學生於學校函送國科會前，須完成教育部臺灣學術倫理教育資源中心 (AREE) **至少 6 小時**學術倫理課程訓練並檢附完訓證明；未經查驗前一律標記為 `UNVERIFIED` `[SAFETY_BOUND]`。

### 2. 審查評估面向解析 (`RECOMMENDED_PRACTICE`)
> **誠信釐清**：過往經驗常見之百分比（如 30/25/20/15/10 或 40/30/30）僅屬**內部寫作配重建議 (`RECOMMENDED_PRACTICE`)**，並非國科會法定固定評分權重；實際評審概以審查委員專業裁量與當年度官方要點為準 `[FACT]`。撰寫 `表 C802` 應聚焦：
1. **研究問題與文獻缺口真實性**：明確指出既有頂會方法在特定物理、幾何或系統邊界下的可驗證失效模式，嚴禁僅做套件教學。
2. **方法論與算力可行性**：提供符號與張量維度明確的演算法形式化與偽代碼，並對齊團隊真實可用硬體（如 `4 GB / 8 GB VRAM` 筆電或受限雲端額度），預先定義 OOM／超時降階與停損條件 `[DESIGN_DECISION]`。
3. **具體量化交付物**：承諾開源程式碼（不含未授權第三方原始資料）、可重現消融日誌、展示系統載體與學術論文草稿。

---

## 六、🧪 `D-project` 論文級科研工程突破：雙層解耦、`T/P/N/C`、證據追溯與統計防線

要把大學專題或課程實作寫成能通過頂會／SCI 審稿的論文，最大障礙通常不在程式寫不出來，而在 **實驗設計邏輯漏洞（偽重複、資料洩漏、HARKing）** 與 **成果宣稱不可追溯**。以下為 `D-project` 建立的系統化論文工程準則：

### 1. `System Carrier` vs. `Paper Kernel` 解耦與 `T / P / N / C` 治理架構 `[DESIGN_DECISION]`
- **雙層架構解耦**：
  - **`System Carrier`（展示載體，對應 `C` Capstone）**：Unity / Web / Gradio 互動介面，以流暢度、FPS 與操作體驗服務專題展示，**嚴禁將 UI 狀態邏輯混入核心演算法**。
  - **`Paper Kernel`（論文演算法核心，對應 `P` 與 `N`）**：純 PyTorch/Python 無頭模組（`kernel(inputs, config) -> outputs, diagnostics`），暴露獨立消融布林開關（如 `use_geom_gate`、`use_calibrated_abstention`），可直接在公開資料集上進行可重現批次基準評測。
- **`T / P / N / C` 四維研究範疇與誠實揭露**：
  - **`T` (Research Theme)**：貫穿專題與論文的共同研究主線。
  - **`P` (Pre-NSTC Research)**：補助執行期開始前之先導驗證與首波論文實驗（若引述於 `表 C802`，必須誠實標記為「申請前先導基礎」，**嚴禁在計畫核定後將補助前已完成之成果冒充為 `N` 期間新工作**）。
  - **`N` (NSTC Research)**：核定補助期間之深化與泛化實驗；**`P` 與 `N` 不強制拆為兩篇論文，亦不強制設計為「假說 A 必須成功、方法 B 才能成立」的序列相依結構**。
  - **`C` (Capstone)**：大學部畢業專題展示載體。

### 2. 21 欄研究協定與 `Claim-to-Evidence` 全鏈路追溯矩陣 `[SAFETY_BOUND]`
任何寫入論文摘要、貢獻點、實驗表格或 `表 C802` 的科學主張，必須通過六元組全鏈路追溯：
$$\text{Research Claim} \longrightarrow \text{Experiment ID} \longrightarrow \text{Dataset Split \& Version} \longrightarrow \text{Code Commit SHA} \longrightarrow \text{Quantitative Result} \longrightarrow \text{Statistical Evidence}$$
- **成果來源三態嚴格隔離**：強制區分 **`AUTHOR_REPORTED`**（引用原論文表格，註明表次）、**`REPRODUCED_BY_TEAM`**（團隊於確定硬體與 Commit 實測結果）與 **`NOT_RUN / UNVERIFIED`**（未執行測試預設值）。**嚴禁將原論文作者數值混寫為團隊實測，亦嚴禁將 `[TARGET]` 或假說寫成已達成數據** `[SAFETY_BOUND]`。
- **論文生命週期與 `CRediT` 貢獻追蹤**：對外文書與履歷必須嚴格區分 `Manuscript (Draft)`、`Submitted / Under Review`（附投稿收件紀錄）、`Accepted` 與 `Published` 四態；團隊協作依 **CRediT (`ANSI/NISO Z39.104-2022`)** 14 項標準角色及實質 Commit 紀錄決定作者資格與排序（**AI 絕不可列為共同作者**） `[FACT]`。
- **各學會獨立之 AI 使用揭露準則 (`VENUE_SPECIFIC`)**：嚴格隔離不同學會規範——**ACM 2026 (`2026-05-14`)** 要求於方法章節詳述輔助生成實驗程式／圖表／合成資料之模型與驗證（純文字潤飾另依最新規範）；**NeurIPS 2026** 僅於 LLM/AI Agent 構成研究方法核心、原創或非標準組件時須於規定段落詳實揭露（常規程式寫作輔助或拼寫文法修正不屬核心方法揭露範疇）；**IEEE / CVF** 各自遵循當年度最新 Author Guidelines `[FACT]`。

### 3. CV 與 AI 實驗統計嚴謹防線（對抗 Reviewer 常見拒稿理由） `[FACT]` `[DERIVATION]` `[SAFETY_BOUND]`
1. **獨立實驗分析單位與防偽重複（Experimental Unit & Anti-Pseudoreplication）**：
   - **致命陷阱**：在 3DGS 新視角合成、3D 場景問答或影片物件偵測中，同一物理場景的 $N=300$ 張渲染影格或多個查詢共享幾何重建誤差與相機軌跡，**絕非 300 個獨立樣本**！若直接以影格數計算標準誤 $\text{SE} = s/\sqrt{N}$，將人為大幅窄化信賴區間並製造虛假顯著性。
   - **正確解法**：以獨立物理場景（Scene-level）或獨立掃描（Scan-level）為主要統計單位（先在場景內聚合指標），再跨場景計算中位數／IQR 與 **配對叢集拔靴法（Paired Cluster Bootstrap, 建議 $B \ge 1,000$）95% 信賴區間**或階層混合效果模型 `[DERIVATION]`。
2. **雙典範資料集切分防漏（Dual-Paradigm Dataset Split）**：
   - **單場景 NVS 任務（Per-Scene NVS，如 3DGS/NeRF）**：同場景之 `1-in-8` 視角級切分屬任務標準定義（不可誤判為跨場景洩漏），但測試視角影像、深度與姿態標籤**嚴禁參與高斯最佳化、稠密化／剪枝決策或超參數搜尋**。
   - **跨場景泛化任務（Detection / Segmentation / Retrieval）**：強制執行 **Scene-disjoint / Scan-disjoint 切分**，確保同一物理房間絕不同時跨入 Train/Val 與 Test。
   - 同步排查閾值調校洩漏（`Threshold Tuning on Test`）、基礎模型預訓練重疊與特徵標準化洩漏 `[SAFETY_BOUND]`。
3. **假說對稱、效應量優先與防 HARKing**：
   - 依研究問題設定合適假說（如最小實質重要差異 $H_0: \Delta \le \Delta_{\min}$ vs. $H_1: \Delta > \Delta_{\min}$，或非劣性／等效性／資源節約假說）。
   - **核心統計鐵律**：**「未能拒絕 $H_0$，不等於證明無效應或效果為零（*Absence of evidence is not evidence of absence*）」**。拒絕無根據的固定隨機種子數（應依真實算力預算與 run-to-run vs. scene-to-scene 變異決定）及單一機械式 $p < 0.05$ 宣稱，改報 **Absolute Effect Size + 95% CI**，並在多指標比較時套用 **Holm–Bonferroni** 或 **Benjamini–Hochberg** 校正 `[FACT]`。
   - 嚴格隔離預先定義之 **Confirmatory Analysis** 與觀察數據後才提出的 **Exploratory / Post-hoc Observation**（禁止 HARKing）；完整保留 **Negative Results**（作為 `Limitations & Failure Mode Analysis` 證據）與 **Protocol Deviations** `[SAFETY_BOUND]`。

### 4. 資料再散布邊界與臺灣人體研究倫理四路徑分流 `[FACT]`
- **資料集授權邊界**：**`Publicly Accessible != Redistributable`**。即使學術資料集（如 ScanNet、Matterport3D）公開開放研究人員申請下載，其 EULA 通常禁止再散布；程式碼儲存庫僅應發布輕量切分索引（Split Indices）、SHA-256 校驗碼與評測腳本，嚴禁轉傳受限原始影像包 `[SAFETY_BOUND]`。
- **人體研究倫理審查四路徑（臺灣《人體研究法》第 5、8、12 條）**：不得一律宣稱電腦視覺研究自動免審，亦不得將審查流程誤寫為線性階段，而應依個案性質分流為：(1) **Not Subject to Review**（純去識別化公開基準或無人類參與物體幾何）；(2) **Exemption from Ethics Review**（依法或經機構委員會核發免審證明——未核實機構程序前標記 `INSTITUTIONAL_PROCEDURE_UNVERIFIED`）；(3) **Expedited Review**（微小風險如主觀 UI 體驗評測）；(4) **Full Board Review**。且**「得免倫理審查 (`Exemption`)」、「審查核准 (`IRB Approval`)」與「知情同意／免除同意 (`Consent / Waiver`)」分屬三種不同法律概念，嚴禁混淆** `[SAFETY_BOUND]`。

---

## 七、🎯 叩關頂大（台清交成）推甄書審突破點

### 1. 審查委員最重視的三大指標
1. **在學成績表現與修課紀錄**：依各校系當年度**正式招生簡章**規範呈現歷年成績與核心科目修課表現（不將非官方經驗百分比猜測當作法定門檻）。
2. **專題研究深度、可追溯成果與論文狀態誠信**：
   - 具備可重現 GitHub 倉庫、`Claim-to-Evidence` 消融矩陣、負面結果分析與明確核實的論文進度（嚴格區分 `Manuscript` / `Submitted` / `Accepted` / `Published`）。
3. **指導教授獨立評估與推薦信基礎**：
   - 推薦信內容完全屬於指導教授之獨立學術裁量；學生團隊所能提供的最佳支撐，就是嚴謹的實驗紀錄、`CRediT` 具體工程貢獻與可驗證的原型展示（`System Carrier` + `Paper Kernel`）。

---

## 八、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-903-01] 科研消融實驗變因單一隔離合約 (Ablation Study Controlled Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件**: 撰寫科研論文或專題成果報告中的實驗評測章節。
- **決策邊界**:
  - 任何新提出的模組（如質心對齊、AWQ 量化、溫度縮放），必須提供**嚴格的單一變因消融實驗對比表格**。
  - 所有對照組必須強制保持完全相同的：隨機種子 (`seed=42 `[DESIGN_DECISION]``)、批次大小、優化器學習率曲線與訓練總輪數。
- **執行保證**: 杜絕將超參數調優帶來的偶然紅利歸功於演算法創新。

### [RULE-903-02] 實驗完全可復現性合約 (Reproducibility & Artifact Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件**: 專題代碼倉庫與開源發布。
- **決策邊界**:
  - 倉庫根目錄必須具備單指令復現腳本 (`python reproduce_all_results.py`)。
  - 必須附帶精確的環境鎖定清單（固定 PyTorch, CUDA, cuDNN 版本）與已校驗 Checkpoint 的 SHA-256 哈希值。
- **可執行斷言**:

```python
def verify_reproducibility(metric_run1: float, metric_run2: float, tolerance: float = 1e-4) -> bool:
    assert abs(metric_run1 - metric_run2) < tolerance, "可復現性驗證失敗：兩次同種子運行結果不符！"
    return True
```

### [RULE-903-03] 推甄報告成果硬指標量化合約 (Quantitative Merit Metric Invariant)
- **合約等級**: `STRATEGIC_DIRECTIVE`
- **前置條件**: 產出大專生國科會計畫書、頂大推甄自述書或專題結案報告。
- **決策邊界**:
  - 嚴禁使用純粹感性形容詞（如「大幅改善」、「效能極佳」）。
  - 每項核心成果必須精確量化至三維座標：**準確率 (%)**、**參數量 (Params/MB)**、**硬體推論延遲 (Latency in ms / FPS)**。

### [RULE-903-04] 八階科研閉環與數學形式化誠信合約 (Mathematical Formalization Integrity Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件**: 撰寫研究計畫書、專題報告或學術論文之方法論章節 (Methodology)。
- **決策邊界**:
  - 嚴禁為了「讓論文看起來高深」而生搬硬套無關的複雜數學公式。
  - 論文中的每一個數學符號、集合定義與矩陣算子，必須嚴格具備物理實體對應（如張量維度、特徵空間、幾何變換）。
  - 方法論陳述必須嚴格體現「現有方法缺陷 $\to$ 核心思想 $\to$ 數學形式化定義 $\to$ 消融實驗驗證」的閉環證明鏈。
- **執行保證**: 確保研究成果經得起頂級學術同儕評審，杜絕假大空的學術包裝。

### [RULE-903-05] 論文主張對證據全鏈路追溯與防偽重複統計合約 (Claim-to-Evidence Traceability & Anti-Pseudoreplication Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件**: 撰寫研究計畫、論文實驗比較表、消融實驗報告或統計檢定推論。
- **決策邊界**:
  - **六元組追溯與三態隔離**：任何寫入論文的主張必須綁定 `Research Claim -> Experiment ID -> Dataset Split/Hash -> Code Commit -> Quantitative Result -> Statistical Evidence`，且強制區分 `AUTHOR_REPORTED`、`REPRODUCED_BY_TEAM` 與預設 `NOT_RUN / UNVERIFIED`（未執行測試嚴禁標為 PASS 或填入推測數據） `[SAFETY_BOUND]`。
  - **獨立實驗分析單位與防偽重複**：同一 3D 場景之多張影格或同一影片序列影格不得視為獨立統計樣本；必須先按獨立場景／掃描聚合，再以 Scene-level Paired Cluster Bootstrap 計算 95% 信賴區間與效果量 `[DERIVATION]` `[SAFETY_BOUND]`。
  - **禁止 HARKing 與邏輯誤判**：嚴格隔離 Confirmatory Analysis 與 Post-hoc Exploratory Analysis；堅守「未能拒絕 $H_0$ 不等於證明無效應」，且完整保留負面結果與協定偏離紀錄 `[FACT]` `[SAFETY_BOUND]`。
- **可執行斷言**:
```python
def verify_claim_to_evidence_and_cluster_unit(
    claim_entry: dict, per_scene_deltas: list[float]
) -> dict:
    """驗證論文主張之六元組追溯完整性與場景級獨立聚合統計 (防偽重複)。"""
    required = ("claim_id", "experiment_id", "dataset_split", "commit_sha", "source_tag")
    for k in required:
        assert claim_entry.get(k), f"追溯鏈缺漏欄位: {k}"
    assert claim_entry["source_tag"] in {
        "AUTHOR_REPORTED",
        "REPRODUCED_BY_TEAM",
        "NOT_RUN / UNVERIFIED",
    }, "非法的來源狀態標記"
    assert len(per_scene_deltas) >= 2, "場景級獨立分析單位至少需跨 >= 2 個獨立場景聚合"
    mean_delta = sum(per_scene_deltas) / len(per_scene_deltas)
    var = sum((d - mean_delta) ** 2 for d in per_scene_deltas) / (len(per_scene_deltas) - 1)
    se = (var / len(per_scene_deltas)) ** 0.5
    return {"mean_effect": mean_delta, "scene_level_se": se, "ci95_half_width": 1.96 * se}
```
- **執行保證**: 杜絕影格級偽重複假顯著、跨場景洩漏及無實驗根據的幻覺宣稱進入論文手稿。

### [RULE-903-06] 系統載體與論文核心解耦暨研究倫理誠信合約 (Carrier-Kernel Decoupling & Research Disclosure Integrity Invariant)
- **合約等級**: `SAFETY_CRITICAL`
- **前置條件**: 將大學部專題系統工程延伸為國科會大專生計畫 (`表 C801–C804`)、學術論文與推甄研究報告。
- **決策邊界**:
  - **雙層架構解耦**：互動展示前端（`System Carrier` / Capstone `C`）與純演算法研究核（`Paper Kernel` / `P & N`）必須以明確介面解耦；`P`（補助前先導基礎）與 `N`（補助期間工作）必須誠實劃分且不強制為「A 成功 B 才成立」之序列相依 `[DESIGN_DECISION]`。
  - **資料授權與倫理審查邊界**：嚴禁以「公開可得」推斷「允許再散布（`Publicly Accessible != Redistributable`）」；涉及自然人參與之視覺／互動評估須依適用人體研究法規四路徑分流，並嚴格區分免審（Exemption）、核准（Approval）與知情同意（Consent / Waiver） `[FACT]` `[SAFETY_BOUND]`。
  - **學會專屬揭露與作者誠信**：AI 嚴禁列為作者；論文與申請書須分別遵循目標出版機構（ACM 2026 / NeurIPS 2026 / IEEE / CVF）之獨立 AI 揭露規則，並依 `CRediT` 紀錄貢獻及誠實標示 `Manuscript / Submitted / Accepted / Published` 四態 `[FACT]` `[SAFETY_BOUND]`。
- **執行保證**: 確保專題展示、國科會計畫書與國際論文投稿完全符合學術倫理、智慧財產與雙盲／公開審查規範。

---

## 九、📚 權威指導規範、頂會範本與學術論文 (Canonical Guidelines & Top-Tier Literature)

1. **國科會補助大專學生研究計畫作業要點**
   - *Official Guideline*: 國家科學及技術委員會 (NSTC). (2024). *國家科學及技術委員會補助大專學生研究計畫作業要點（113 年 11 月 1 日修正生效版，第 3、4、6、16 點）與正式表件 C801/C802/C803/C804*. 國科會行政法規.
   - *Application*: 申請資格、至少 6 小時學術倫理教育訓練 (AREE)、補助前成果揭露及表件審查合規依據。
2. **CRediT 貢獻者角色分類標準與 COS 開放科學促進指南**
   - *Standards*: NISO (2022). *ANSI/NISO Z39.104-2022 Contributor Roles Taxonomy (CRediT)*; Center for Open Science (COS). *Transparency and Openness Promotion (TOP) Guidelines*.
   - *Application*: 團隊實質研究貢獻歸屬、Confirmatory vs. Exploratory 分析隔離與可重現性稽核。
3. **深度殘差學習開創巨作 (CVPR 頂會 Best Paper)**
   - *Paper*: He, K., Zhang, X., Ren, S., & Sun, J. (2016). "Deep Residual Learning for Image Recognition." *IEEE Conference on Computer Vision and Pattern Recognition (CVPR 2016)*, pp. 770-778. DOI: [10.1109/CVPR.2016.90](https://doi.org/10.1109/CVPR.2016.90).
   - *Application*: 本專題消融實驗與特徵跳躍連接架構之經典標竿。
4. **CLIP 多模態對比學習奠基作 (ICML 頂會)**
   - *Paper*: Radford, A., Kim, J. W., Hallacy, C., Ramesh, A., Goh, G., Agarwal, S., ... & Sutskever, I. (2021). "Learning Transferable Visual Models From Natural Language Supervision." *International Conference on Machine Learning (ICML 2021)*, PMLR 139, pp. 8748-8763.
   - *Application*: 跨模態語意對齊、Zero-shot 遷移與下游手寫字元語意校驗之理論依歸。
5. **國際學會 AI 政策與國內人體研究法規依據**
   - *Guidelines*: ACM (2026, rev. 2026-05-14). *ACM Policy on Authorship*; NeurIPS (2026). *NeurIPS 2026 Main Track Handbook & Paper Checklist*; 我國《人體研究法》（第 5、8、12 條）與教育部臺灣學術倫理教育資源中心 (AREE).
   - *Application*: 論文研究性 AI 使用揭露邊界、作者資格與人體研究倫理審查分流合規檢核。
