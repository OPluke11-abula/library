# 圖書館專案任務與進度交接報告 (Library Stage & Handoff Document)

> **文檔名稱**: `library_stage.md`  
> **更新時間**: 2026-10-10  
> **當前交接基準 HEAD**: `c65161b7406459d03e1aa2481ccd7e58cc239a98`（PR #8: `c65161b` 正式交接點）  
> **專案狀態**: 25 卷雙語完備（共 50 份核心文件），84 條決策合約不變量，拓樸 DAG 100% 閉環驗證通過。

---

## 🏛️ 一、專案拓樸與雙儲存庫環境 (Dual-Vault Topology)

本知識庫採用雙倉鏡像拓樸管理架構，確保開發環境與閱讀筆記庫完全同步：

1. **本機主要開發倉**：
   - 路徑：`d:\GitHub\library`
   - Git 主工作區，連線至遠端：`https://github.com/OPluke11-abula/library.git`，主幹分支 `main`。
2. **OneDrive Obsidian 主庫**：
   - 路徑：`C:\Users\luke2\OneDrive\文件\Obsidian Vault\圖書館`
   - 使用者日常閱讀、筆記雙向鏈接與視覺化圖譜之主庫。
3. **強制零漂移協定 (Zero-Drift Synchronization Rule)**：
   - 任何在開發倉 `d:\GitHub\library` 進行的變更，經 Pull Request 合併至 `main` 並完成 `git push origin main` 後，**必須立即**執行：
     ```powershell
     git -C "C:\Users\luke2\OneDrive\文件\Obsidian Vault\圖書館" fetch origin; git -C "C:\Users\luke2\OneDrive\文件\Obsidian Vault\圖書館" reset --hard origin/main
     ```
   - 確保雙庫之 Commit SHA 100% 完全一致。

---

## 🧭 二、當前知識庫基準狀態與結構會計 (Baseline Accounting)

### 2.1 客觀已驗證狀態 (System Verified Ground Truth)
以下為本知識庫經自動化驗證腳本 (`validate_library.py`) 與 CI 嚴格把關之客觀技術指標：
- **交接基準 Commit SHA**：`c65161b7406459d03e1aa2481ccd7e58cc239a98`
- **雙庫同步狀態**：本機開發倉與 OneDrive Obsidian 主庫處於 100% 零漂移（Zero-Drift）一致狀態。
- **卷冊總數與結構對稱**：25 卷（繁體中文 25 卷，英文對齊 25 卷，共 50 份主體文件），所有 YAML Frontmatter 100% 對齊。
- **決策合約不變量**：精確維持 84 條 `RULE-xxx-xx` 不變量，ID、等級與計數在中英雙語完全對稱（0 重複、0 缺失）。
- **DAG 拓樸結構**：嚴格有向無環圖，Kahn 演算法拓樸排序 100% 驗證通過，零循環、零孤島、零失效鏈接。
- **自動化驗證保證**：執行 `python scripts/validate_library.py` 保證 Exit Code 恆為 `0`。

### 2.2 交接文件聲明與元指引 (Handover Document Declarations)
本文件（`library_stage.md`）作為首席圖書館管理員之跨階段交接藍圖，負責記錄專案演進脈絡、里程碑會計、規範合約與後續維護指引。交接聲明本身隨版本演進持續維護，不影響核心知識庫卷冊之不可變合約。

### 📚 現行 25 卷清單與對齊結構
| 索書號 | 中文卷名 | 英文卷名 (Agent EN) | 核心範疇 |
| :--- | :--- | :--- | :--- |
| **LIB-000** | 圖書館總覽與拓樸導覽系統 | Grand Library Index & Navigator | 全庫 DAG 拓樸、決策樹、三大學習路徑 |
| **LIB-001** | 深度學習第一性原理先修精要 | Deep Learning First Principles | 六大基石：幾何、活化、Loss、反向傳播、優化器、歸納偏置 |
| **LIB-101** | 線性代數與高維幾何變換本質 | Linear Algebra & High-Dimensional Geometry | 矩陣分解、奇異值分解 (SVD)、特徵空間投影 |
| **LIB-104** | 凸最佳化理論與一階二階梯度幾何 | Convex Optimization & Gradient Descent | Lipschitz 平滑度、Hessian 條件數、動量動態 |
| **LIB-203** | 計算機體系結構與硬體對齊 | Computer Architecture & Hardware-Aware Deep Learning | 記憶體階層、CUDA Warp 分歧、Tensor Core GEMM、Roofline |
| **LIB-301** | 資料分佈偏差與空間權重懲罰幾何 | Dataset Bias, Domain Shift & Spatial Penalties | 協變量漂移、OOD 泛化界、文化筆畫偏差、空間權重 |
| **LIB-401** | CNN 理論必然性與歸納偏置 | DNN Spatial Limits & CNN Inductive Bias | 全連接維度災難、局部感受野、平移等變性 |
| **LIB-405** | 注意力機制與 Transformer 革命 | Attention Mechanism & Transformer Revolution | 縮放點積注意力、RoPE 旋轉位置編碼、FlashAttention |
| **LIB-406** | 擴散 SDE、流匹配與 DiT 革命 | Generative Frontiers - SDE Diffusion to Flow Matching | 分數匹配、最佳傳輸流匹配 (OT Flow Matching)、DiT 縮放 |
| **LIB-407** | 指令影像編輯與內容保持 | Fine-Grained Instruction Image Editing | 潛空間反轉、跨注意力調控、自注意力特徵鎖定 |
| **LIB-408** | 情境感知物件生成與光照融合 | Context-Aware Object Generation & Compositing | 深度估計、球諧函數 (SH) 光照、接觸陰影合成 |
| **LIB-501** | CV 前處理規範與質心定位演算法 | CV Preprocessing & Center of Mass Alignment | 邊界框安全截斷、墨跡動差質心、Bunch TTA 增強 |
| **LIB-504** | 3D 高斯潑濺 (3DGS) 理論與光柵化 | 3D Gaussian Splatting Theory & Rasterization | 連續輻射場離散化、3D 高斯投影、GPU Tile 光柵化 |
| **LIB-505** | 開放詞彙 3DGS 與語意場景圖 | Open-Vocabulary 3DGS & Semantic Retrieval | 2D 語意蒸餾、跨視角共識、場景圖查詢 |
| **LIB-506** | LLM 驅動之 3DGS 導航與問答 | LLM-Grounded 3D Scene QA & Navigation | ConceptGraphs、空間 ReAct 推論迴圈、具身導覽 |
| **LIB-602** | 現代大語言模型架構解剖與縮放定律 | Modern LLM Architecture & Scaling Laws | Chinchilla 定律、Decoder-Only、RMSNorm、SwiGLU、GQA |
| **LIB-703** | 大模型代理人認知架構與推論協議 | LLM Agent Cognitive Architecture & Protocols | ReAct 思考迴圈、結構化工具模式、動態規劃 |
| **LIB-704** | 雙進程神經代理人 (Jev & CUA-S1) | Dual-Process Neural Agent S1-Jev & Reflex CUA-S1 | S1 非自迴歸型態決策引擎、位元組級反射模型、信心門控 |
| **LIB-801** | 模型校準、不確定性估計與過度自信 | Model Calibration & Uncertainty Estimation | ECE、溫度縮放 (Temperature Scaling)、共形預測、可靠度圖 |
| **LIB-802** | 模型量化理論與低精度推論架構 | Quantization Mathematics & Low-Precision Inference | 仿射量化、AWQ 激活感知、INT4/FP8 Tensor Core GEMM |
| **LIB-901** | 經典專案實證復盤：生產級 MNIST | Classic Project Post-Mortem - Production MNIST | 探索式腳本至工程級流水線重構、架構消融 |
| **LIB-903** | 專題基石藍圖與學術推甄演進 | Capstone Blueprint & Academic Research Evolution | 國科會大專生計畫書結構、研究演進樹、頂大推甄戰略 |
| **LIB-904** | 學術科研文獻體系與前沿研究對齊 | Academic Research Corpus & Literature Synthesis | 文獻檢索方法論、指標對齊、真實性核查矩陣 |
| **LIB-905** | 前沿視覺與具身多模態五大專題藍圖 | Frontier Vision & Multimodal Capstone Blueprints | 五大專題系統架構、消融實驗矩陣、國科會經費規劃 |
| **LIB-906** | 對話質疑下的選擇性認知修訂基準 | LLM Conversational Epistemic Revision | 諂媚性 (Sycophancy) 對抗、信念修訂、認知覆寫決策樹 |

---

## 📈 三、近期重大進度里程碑 (Recent Milestones)

### 1. 全庫科研誠信閉環 (Scientific Integrity Closure Pass)
- 修正硬體微架構數值、界定共形預測邊際覆蓋率。
- 校準文獻會議標註（郭 et al. 2017 發表於 ICML 2017 PMLR）。
- 嚴格界定標準證據標籤，維持全庫科研嚴謹性。

### 2. 深度學習第一性原理與 GPU 系統優化 (PR #1: `cd421d1`)
- **GPU SFU 運算優化**：`torch.rsqrt(x)` 取代 `1 / torch.sqrt(x)`，消減多餘 Memory I/O。
- **Pointwise 編譯器融合**：`@torch.compile` 將乘法與截斷融合成單一 Kernel。
- **Loss 梯度特性**：解析為何採用 `-log(P)`（交叉熵）而非 `1 - P`，揭示錯誤懲罰梯度的動態特性。
- **Pre-Norm 架構優勢**：殘差流 (Residual Stream) 梯度直達性與數值穩定性。
- **In-place 原地操作**：`add_`、`mul_` 省去中間張量分配的記憶體優化機制。

### 3. 對話質疑下選擇性認知修訂基準入庫 (PR #2: `6ba66e2`)
- 正式撰寫並納入 **LIB-906** 中英文完整卷冊。
- 對稱掛載前置節點 `[LIB-602, LIB-801, LIB-904]` 與後續關聯。
- 全庫總導覽 `LIB-000`、總覽索引與 `README` 雙語完整對齊。
- 順利通過驗證並完成雙庫零漂移同步（HEAD SHA：`6ba66e2`）。

### 4. 首席管理員交接藍圖文檔建立 (PR #3: `68571aa`)
- 正式建立全庫交接治理總綱 `library_stage.md`。
- 完整盤點 25 卷冊架構、84 條決策合約不變量與雙庫零漂移協定。
- 確立交接基準 HEAD 為 `68571aa27ab794fbfe7326ffb972d5897641d2c8`。

### 5. 科研精確度校準、Taxonomy 規範化、CI 升級與文獻差距矩陣 (PR #4: `d838ed7`)
- **P0 科研精確度校準 (Scientific Accuracy Calibration)**：
  - `LIB-001`：界定 Softplus Logit 嚴格凸性範疇；釐清單層 GLM 參數凸性與多層神經網路非凸 Loss Landscape 之界線；說明線性可分資料之發散條件；澄清輸出層代數梯度相消性（$\frac{\partial \mathcal{L}}{\partial z} = P - y$）與 MSE 飽和高原之本質差異。
  - `LIB-203`：移除未經引證之「效能下降 40%」經驗宣稱，改以微架構 Predication Masking 及 Shared Memory Padding 幾何機制深度論證；將記憶體頻寬減半嚴格標註為 Memory-Bound 邊界條件下的理論上限；標準化標籤（`[DERIVATION]`, `[FACT]`, `[HEURISTIC]`）。
  - `LIB-501`：補足 NumPy 與 Python Loop 微基準測試之具體環境條件（x86-64, 單線程, Python 3.11, $28 \times 28$ 陣列）；標準化標籤（`[DESIGN_DECISION]`, `[SAFETY_BOUND]`）。
- **P1 文檔一致性維護 (Documentation Consistency)**：
  - `en/09_research_methodology/LIB-906`：修復損毀之 LaTeX 時間上下文變數（`$\tau_t$`）。
  - 全面收斂非標準標籤，確保 Evidence Taxonomy 嚴格符合 10 種標準標籤定義。
- **P2 基礎設施維護 (Infrastructure Maintenance)**：
  - 升級 `.github/workflows/validate.yml` 至 `actions/checkout@v7` 與 `actions/setup-python@v7`，徹底消除 GitHub Actions Runner Node 20 棄用告警（CI 通過且 0 告警）。

### 6. 原始文獻核實、可重現微基準測試與防碰撞審計狀態校準 (PR #6)
- **P0: LIB-906 原始文獻深度核實與狀態校準 (Primary Literature Verification)**：
  - 逐一校驗核對 Section 12.1 全部 10 篇關鍵文獻之真實出版會議、arXiv ID 與 OpenReview 索引（包括 Cheng et al. ELEPHANT arXiv:2505.02878 / ICLR 2026, Dhuliawala et al. CoVe Findings of ACL 2024 `2024.findings-acl.212`, Hong et al. SYCON-Bench Findings of EMNLP 2025 arXiv:2410.05353, Laban et al. FlipFlop Salesforce 2023 arXiv:2311.08596, AGM-Bench ICLR 2026 OpenReview `h1m1YmpHVx`, SoBA Benchmark 2026, 以及 Selective Epistemic Resistance 假說），全面替換原先引證不符之出版條目。
  - 恪守科研誠信守則：「未完成受控消融實驗前，不得宣告 Novelty Audit 已結束」，將審計狀態校準為「原始文獻核實進行中 `[SAFETY_BOUND]`」，堅決禁止於消融實驗前過早宣告新穎性或完結審計。
- **P0: LIB-501 微基準測試與實證數據標註 (Reproducible Benchmark & Empirical Evidence)**：
  - 新增可重現基準腳本 `scripts/benchmark_lib501_moments.py`，測量 x86-64 單線程環境下 $28 \times 28$ 影像之墨跡動差質心計算耗時。
  - 以實測數據（Python 走訪 NumPy: ~0.13ms–0.46ms；原生 List: ~0.06ms–0.09ms；NumPy SIMD: ~0.007ms–0.02ms，加速比 ~10x–25x，標記為 `[EMPIRICAL_RESULT]`）全面取代未受控之理想化宣稱（1.5ms, 0.02ms, 75x）。

### 7. 正弦位置編碼幾何推導與無正規化 Transformer DyT 入庫 (PR #7: `297e23c`)
- **P0: LIB-405 正弦位置編碼 (Sinusoidal PE) 與損失曲面平滑化閉環**：
  - 補足 Vaswani et al. (NeurIPS 2017) 經典加性正弦位置編碼的第一性原理推導，以多進位制頻率衰減詮釋角速度設計（$\omega_i = 10000^{-2i/d}$）。
  - 嚴密以和差化積三角恆等式證明子空間內積之相對平移不變性（$\langle PE_t^{(i)}, PE_{t+k}^{(i)} \rangle = \cos(\omega_i k)$），並剖析加性注入交叉項污染如何催生乘性正交 RoPE 之演進。
  - 納入 Li et al. (NeurIPS 2018) 殘差連線對高維損失曲面之凸化定理（Loss Landscape Convexification），防禦梯度破碎。
- **P0: LIB-602 Meta FAIR DyT (Dynamic Tanh, CVPR 2025) 微架構與 Roofline 分析**：
  - 納入 Zhu, He, LeCun, Liu et al. (*Transformers without Normalization*, CVPR 2025) 突破性成果。
  - 剖析 LayerNorm (2 次 reduction)、RMSNorm (1 次 reduction 仰賴 Warp Shuffle `__shfl_down_sync`) 到 DyT (0 次 reduction，純逐點 SFU 運算）的微架構躍進。
  - 論證 DyT 實現與 GEMM epilogue 之 100% 融合及顯存頻寬（HBM）瓶頸解放，提供 PyTorch 參考實作與標準文獻引用。
- **P1: 文檔一致性與標準標籤收斂**：
  - 清理殘留之非規範標籤，嚴格恪守全庫 10 大標準證據分類學。

### 8. 輸入輸出權重綁定 (Weight Tying) 架構與參數量化 (PR #8: `c65161b`)
- **P0: LIB-602 權重綁定幾何直觀與記憶體壓縮**：
  - 基於 Press & Wolf (2017) 經典文獻，正式補足 Weight Tying（Token Embedding = LM Head，即 $W_{\text{out}} = W_{\text{emb}}^T$）架構設定。
  - 提出幾何層面之點積相似度空間（Dot-Product Similarity）詮釋，跳脫「分類器權重」思維。
  - 量化參數壓縮比（如 GPT-2 Small 省下 $\sim 20\%$ 總參數量），並針對大語言模型（如 LLaMA 3 70B）論述 Untie 取捨（Expressivity Trade-off）。

---

## 🛡️ 四、核心規範與系統不變量約束 (System Invariants)

新接手的 Agent 必須無條件嚴格遵守以下六大規範：

1. **雙庫零漂移協定 (Zero-Drift Synchronization Rule)**：
   每次變更與 PR 合併後，必須第一時間同步本機開發倉與 OneDrive Obsidian 主庫，保證兩者 HEAD SHA 完全一致。
2. **標準證據分類學 (Canonical Evidence Taxonomy)**：
   僅允許使用標準證據標籤，嚴禁自創非規範標籤：
   - `[FACT]`：有可驗證事實或官方文件支持。
   - `[DERIVATION]`：數學公式或幾何邏輯推導。
   - `[LITERATURE_RESULT]`：同行評審頂級會議文獻發表之結論。
   - `[EMPIRICAL_RESULT]`：倉內本機可重現之實驗數據。
   - `[HEURISTIC]`：工程實務經驗法則。
   - `[DESIGN_DECISION]`：架構設計權衡決策。
   - `[TARGET]`：系統效能目標值。
   - `[SAFETY_BOUND]`：防禦性工程邊界與數值保護截斷。
   - `[HYPOTHESIS]`：待驗證之科研假設。
   - `[OPEN_QUESTION]`：目前學術界或工程界未解之公開問題。
3. **嚴格無環有向圖 (Strict DAG Topology)**：
   前置節點（`prerequisites`）與後續節點（`successors`）必須雙向對稱更新，禁止產生循環或孤立節點。
4. **雙語對稱性 (Bilingual Parity)**：
   繁體中文卷與英文卷必須維持元數據（Call Number、Status、Prerequisites、Successors、Invariants Count）與實質內容完全對齊。
5. **Git 與 PR 合併生命週期**：
   變更需建立功能分支 -> 執行單元與拓樸驗證 -> Commit (Conventional Commits) -> Push -> `gh pr create` -> `gh pr merge` -> Pull main -> OneDrive Vault Reset。
6. **四大工作維度與解耦治理原則 (Four-Tier Governance & Decoupling Principles)**：
   依據知識庫長期維護規範，後續工作嚴格劃分為四大優先級與治理維度，並遵循解耦原則：
   - **P0: 科研精確度 (Scientific Accuracy)**：第一性原理驗證、凸性與幾何極限、硬體微架構邊界條件。優先於任何文檔排版或格式修飾。
   - **P1: 文檔一致性 (Documentation Consistency)**：標準證據分類學（嚴格 10 種標籤，杜絕自創複合標籤）、中英雙語對稱性、符號與 LaTeX 語法一致性。
   - **P2: 基礎設施維護 (Infrastructure Maintenance)**：CI/CD Workflow、驗證腳本、依賴升級。**嚴格解耦原則**：基礎設施修改必須獨立成專門 PR 提交與審查，嚴禁與核心科學內容修改混雜提交。
   - **Research Milestone: 8–15 篇前沿文獻矩陣與防碰撞審計 (Novelty Collision Audit)**：新方法提出必須涵蓋同領域最新文獻比對。**科研誠信守則**：實驗驗證前所有方法與效果一律標註為 `Proposed / Hypothesized / Expected`，嚴禁在缺乏實證數據前宣稱新穎性或效能優勢。

---

## 🛠️ 五、Agent 技能調度手冊 (Skills Usage Guide)

新接手之 Agent 應依據任務特性主動調用對應技能工具：

- **`verification-before-completion`**：在向使用者宣告任務完成、或提交 PR 前，必須實際運行驗證命令確認結果。
- **`systematic-debugging`**：遇到測試失敗、腳本報錯或拓樸異常時，遵循系統化除錯流程（Reproduce -> Hypothesize -> Verify -> Fix）。
- **`codebase-recon` / `codegraph`**：進行新卷冊掛載、符號引用追蹤與跨檔案依賴探勘時使用。
- **`agent-team` / `dispatching-parallel-agents`**：當有 3 個以上獨立卷冊需並行撰寫或審查時調度。
- **`research` / `fact-check`**：涉及外部論文、會議出處、演算法數學公式查證時調用，杜絕幻覺與未受控宣稱。
- **`unslop` / `unslop-commit`**：編寫技術文檔與 Commit Message 時，剔除 AI 行話與空洞贅字，維持嚴謹科研工程風格。

---

## 📋 六、後續維護與研發待辦清單 (Future Roadmap)

1. **新主題候選擴充**：
   - 評估是否擴充多模態具身智慧（Embodied AI）或推論時計算（Test-Time Compute / Reasoning Tokens）專卷。
2. **消融實驗重現環境建置**：
   - 針對 LIB-901、LIB-905、LIB-906 中的基準實驗，評估建立自動化測試與消融驗證腳本。
3. **日常維護**：
   - 每次開啟新 Thread，第一步必須執行初始化自檢，確保環境處於 `297e23ce64a8b58d7877d6edbd7ea7f55adba170`（或最新 main 分支 HEAD），工作區乾淨無漂移。
