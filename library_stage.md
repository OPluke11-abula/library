# 圖書館專案任務與進度交接報告 (Library Stage & Handoff Document)

> **文檔名稱**: `library_stage.md`  
> **更新時間**: 2026-10-17  
> **當前交接基準 HEAD**: `12fb584c248bce1714d0ff2605fed3548f6349d3`（PR #15 / PR #16 / PR #17: `12fb584` 正式交接點）  
> **專案狀態**: 28 卷雙語完備（共 56 份核心文件），101 條決策合約不變量（100% 合約等級對稱），拓樸 DAG 與內文導覽 100% 閉環驗證通過（11 項自動化檢驗全數通過）。

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
以下為本知識庫經自動化驗證腳本 (`validate_library.py` 11 項嚴格檢查) 與 CI 嚴格把關之客觀技術指標：
- **交接基準 Commit SHA**：`12fb584c248bce1714d0ff2605fed3548f6349d3`
- **雙庫同步狀態**：本機開發倉與 OneDrive Obsidian 主庫處於 100% 零漂移（Zero-Drift）一致狀態。
- **卷冊總數與結構對稱**：28 卷（繁體中文 28 卷，英文對齊 28 卷，共 56 份主體文件），所有 YAML Frontmatter、內文拓樸導航、標準證據標籤、權威參考文獻與代碼實作 100% 對齊。
- **決策合約不變量**：精確維持 101 條 `RULE-xxx-xx` 不變量，ID、合約等級（Contract Level）與量化決策閾值在中英雙語 100% 對稱（0 重複、0 缺失、0 等級漂移）。
- **DAG 拓樸結構**：嚴格有向無環圖，Kahn 演算法拓樸排序與內文 `前置依賴`/`後續節點` 100% 驗證通過，零循環、零孤島、零失效鏈接。
- **自動化驗證保證**：執行 `python scripts/validate_library.py`（涵蓋 11 項檢查，含強制內文導航、證據分類學覆蓋、文獻引證完整性與 AST 語法）保證 Exit Code 恆為 `0`。

### 2.2 交接文件聲明與元指引 (Handover Document Declarations)
本文件（`library_stage.md`）作為首席圖書館管理員之跨階段交接藍圖，負責記錄專案演進脈絡、里程碑會計、規範合約與後續維護指引。交接聲明本身隨版本演進持續維護，不影響核心知識庫卷冊之不可變合約。

### 📚 現行 28 卷清單與對齊結構
| 索書號 | 中文卷名 | 英文卷名 (Agent EN) | 核心範疇 |
| :--- | :--- | :--- | :--- |
| **LIB-000** | 圖書館總覽與拓樸導覽系統 | Grand Library Index & Navigator | 全庫 DAG 拓樸、決策樹、三大學習路徑 |
| **LIB-001** | 深度學習第一性原理先修精要 | Deep Learning First Principles | 六大基石：幾何、活化、Loss、反向傳播、優化器、歸納偏置 |
| **LIB-101** | 線性代數與高維幾何變換本質 | Linear Algebra & High-Dimensional Geometry | 矩陣分解、奇異值分解 (SVD)、特徵空間投影 |
| **LIB-102** | 機率統計、資訊理論與變分推論基石 | Probability, Information Theory & Variational Inference | 夏農熵、前向/反向 KL 散度、ELBO 與重參數化、Online Softmax |
| **LIB-104** | 凸最佳化理論與一階二階梯度幾何 | Convex Optimization & Gradient Descent | Lipschitz 平滑度、Hessian 條件數、動量動態 |
| **LIB-203** | 計算機體系結構與硬體對齊 | Computer Architecture & Hardware-Aware Deep Learning | 記憶體階層、CUDA Warp 分歧、Tensor Core GEMM、Roofline |
| **LIB-301** | 資料分佈偏差與空間權重懲罰幾何 | Dataset Bias, Domain Shift & Spatial Penalties | 協變量漂移、OOD 泛化界、文化筆畫偏差、空間權重 |
| **LIB-401** | CNN 理論必然性與歸納偏置 | DNN Spatial Limits & CNN Inductive Bias | 全連接維度災難、局部感受野、平移等變性 |
| **LIB-405** | 注意力機制與 Transformer 革命 | Attention Mechanism & Transformer Revolution | 縮放點積注意力、RoPE 旋轉位置編碼、FlashAttention |
| **LIB-406** | 擴散 SDE、流匹配與 DiT 革命 | Generative Frontiers - SDE Diffusion to Flow Matching | 分數匹配、最佳傳輸流匹配 (OT Flow Matching)、DiT 縮放 |
| **LIB-407** | 指令影像編輯與內容保持 | Fine-Grained Instruction Image Editing | 潛空間反轉、跨注意力調控、自注意力特徵鎖定 |
| **LIB-408** | 情境感知物件生成與光照融合 | Context-Aware Object Generation & Compositing | 深度估計、球諧函數 (SH) 光照、接觸陰影合成 |
| **LIB-501** | CV 前處理規範與質心定位演算法 | CV Preprocessing & Center of Mass Alignment | 邊界框安全截斷、墨跡動差質心、Bunch TTA 增強 |
| **LIB-502** | 相機射影幾何、對極幾何與運動結構恢復 | Camera Projective Geometry, Epipolar Geometry & SfM | 針孔投影、$\mathrm{SO}(3)/\mathrm{SE}(3)$ 李代數、EWA 透視雅可比 $\mathbf{J}$、Hartley 八點法、舒爾補 BA |
| **LIB-504** | 3D 高斯潑濺 (3DGS) 理論與光柵化 | 3D Gaussian Splatting Theory & Rasterization | 連續輻射場離散化、3D 高斯投影、GPU Tile 光柵化 |
| **LIB-505** | 開放詞彙 3DGS 與語意場景圖 | Open-Vocabulary 3DGS & Semantic Retrieval | 2D 語意蒸餾、跨視角共識、場景圖查詢 |
| **LIB-506** | LLM 驅動之 3DGS 導航與問答 | LLM-Grounded 3D Scene QA & Navigation | ConceptGraphs、空間 ReAct 推論迴圈、具身導覽 |
| **LIB-602** | 現代大語言模型架構解剖與縮放定律 | Modern LLM Architecture & Scaling Laws | Chinchilla 定律、Decoder-Only、RMSNorm、SwiGLU、GQA、稀疏 MoE |
| **LIB-603** | 密集檢索、檢索增強生成 (RAG) 與緩存增強生成 (CAG) 系統架構 | Dense Retrieval, RAG & Cache-Augmented Generation Architecture | InfoNCE 互資訊下界、Bi-Encoder vs Cross-Encoder、BM25+RRF、ColBERT MaxSim、GraphRAG 拓樸展開、RAG vs CAG |
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

### 9. 滾動時域模型預測控制 (MPC) 與 GPU 批次路徑積分 (MPPI) 入庫 (PR #10: `4fa289d`)
- **P0: LIB-506 機器人控制理論 vs. 教學簡化模型 6 大維度對比**：
  - 嚴格界定 State（全位姿、速度、關節狀態）、Dynamics（明確取樣週期 $\Delta t$）、Trajectory（Markov 遞迴前向推進）、Cost（狀態跟隨、控制能量、終端 Lyapunov 代價）、Constraints（致動器飽和與摩擦錐接觸條件）、Optimization（數值/採樣連續最佳化）之本質差異。
- **P0: 生產級向量化控制器實作**：
  - 納入 `BatchedMPPIController`，支援 CUDA 批次前向 Rollout、3DGS 幾何障礙物勢能場阻尼懲罰與時域滑動熱啟動（Warm-start Shifting）。
- **P1: 雙語對稱與規範引證**：
  - 中英雙語完全對齊，補足 Williams et al. (T-RO 2017) 與 Rawlings et al. (2017) 經典控制權威引證。

### 10. 全庫深度審查與 P0 數學代碼修復、P1 中英雙語合約與內文 DAG 全面對齊 (PR #12: `e283d3b`)
- **P0: 核心演算法與科學精確度修復**：
  - `LIB-406`（ZH & EN）：修正 `AdaLNZeroBlock` 與 `OptimalTransportFlowMatchingTrainer` 忽略時間變數 $t$ 之重大缺陷，補齊正弦時間嵌入（Sinusoidal Timestep Embedding）與條件組合 $c_{\text{joint}} = c + \text{MLP}(t)$，使流匹配真正學習時變速度場 $v_\theta(x_t, t)$。
  - `LIB-506`（ZH & EN）：將 `BatchedMPPIController` 由純 CPU NumPy 全面升級為原生 PyTorch GPU 張量實現（`torch.Tensor` 支援 `cuda`/`cpu`），補齊李亞普諾夫終端代價 $\Phi(x_H)$、MPPI 重要性採樣交叉項 $\lambda u_{t-1, \tau}^\top \Sigma_\epsilon^{-1} \epsilon_{k, \tau}$ 與顯式加速度硬約束 `a_max`。
  - `LIB-407`（ZH & EN）：消除 `RULE-407-03`（原寫 20 步）與正文 Section 3.2（50 步）之 DDIM 反演步數矛盾，統一為 $N_{\text{inv}} \ge 50$ 步。
- **P1: 中英雙語實作對稱、合約等級對齊與拓樸導航同步**：
  - 為 `LIB-407 EN`、`LIB-408 EN`、`LIB-505 EN`、`LIB-703 EN` 補齊缺失的 Python 核心架構實作區塊，並將 `LIB-000 EN` 總覽由 24 卷更新為 25 卷（納入 `LIB-906`）。
  - 修復 `LIB-104 EN`、`LIB-401 EN`、`LIB-802 EN` 因控制字元轉義造成的 LaTeX 語法損毀（`\nabla`、`\rfloor`、`\neq`）。
  - 全面校準 84 條 `RULE-xxx-xx` 的中英合約等級（Contract Level）與量化決策閾值，同步 16 卷內文 `前置依賴`/`後續節點` 與 YAML Frontmatter DAG，並將複合斜線標籤全數收斂至 10 大標準證據標籤。

### 11. P2 自動化驗證器升級至 11 項嚴格檢查 (PR #13: `a945543`)
- **P2: `scripts/validate_library.py` 擴充 Checks 8–11**：
  - **Check 8**：驗證全部 `RULE-xxx-xx` 均定義合法之合約等級，且中英雙語等級 100% 一致。
  - **Check 9**：驗證內文導覽區塊（`前置依賴`/`後續節點`/`Prerequisites`/`Successors`）與 YAML Frontmatter DAG 100% 對齊。
  - **Check 10**：強制執行 10 大標準證據分類學（Canonical Evidence Taxonomy），攔截自創或斜線複合標籤。
  - **Check 11**：使用 Python `ast.parse()` 對全庫所有 Python 程式碼區塊進行語法解析驗證，並強制檢驗中英雙語程式碼區塊對稱性。

### 12. Phase 3 英文高密度標準化與 Phase 4 過渡基礎專卷擴建 (PR #15: `7f65131`, PR #16: `9138fba`)
- **P0: 新增兩大核心過渡基礎專卷（`LIB-102` 與 `LIB-502`）與 `LIB-906` 不變量形式化**：
  - **`LIB-102`（機率統計、資訊理論與變分推論基石，`RULE-102-01..03`）**：完整推導夏農熵、交叉熵分解、Gibbs 非負不等式嚴格證明、前向（Mode-Covering）與反向（Mode-Seeking）KL 散度幾何偏置、變分證據下界（ELBO）與重參數化技巧（Reparameterization Trick）、Fisher 資訊矩陣與自然梯度，以及 GPU SFU `F.log_softmax` 融合算子與 Online Softmax 單趟暫存器歸約。
  - **`LIB-502`（相機射影幾何、對極幾何與運動結構恢復，`RULE-502-01..03`）**：完整推導針孔透視投影、$\mathrm{SO}(3)/\mathrm{SE}(3)$ 李群與李代數指數映射、連結 3DGS（`LIB-504`）之 EWA 局部仿射透視雅可比矩陣 $\mathbf{J}$、對極幾何本質/基礎矩陣與 Hartley 各向同性正規化八點法（含 Eckart-Young 秩-2 流形投影），以及非線性光束法平差（Bundle Adjustment）之 $3 \times 3$ 分塊對角舒爾補（Schur Complement）消元。
  - **`LIB-906`（ZH & EN）**：正式定義 `RULE-906-01..03` 三條認知修訂不變量與第 18 節權威參考文獻，全庫擴展至 **27 卷雙語典籍（54 份主體文件）** 與 **93 條正式決策不變量**。
- **P1: 全庫拓樸圖譜優化與 `Agent EN` 高密度標準化**：
  - 解除不自然的 `LIB-401 (CNN) -> LIB-405 (Transformer)` 硬性耦合；建立 `LIB-101 -> LIB-102 -> LIB-301/406/602/801` 與 `LIB-501 -> LIB-502 -> LIB-408/504` 由淺入深之過渡鏈路，54 份檔案之 YAML 與內文導覽 100% 雙向同步。
  - 為全部 27 份 `Agent EN` 英文卷補齊內文拓樸導覽、標準證據分類標籤、`Systems & Hardware Alignment` 硬體微架構對齊章節與 `Canonical & Peer-Reviewed References` 權威文獻引證。

### 13. P2 驗證器完整性強制門檻升級 (PR #17: `12fb584`)
- **P2: `scripts/validate_library.py` 強化完整性覆蓋檢查**：
  - 強制要求 `LIB-001` 至 `LIB-906` 所有中英文卷必須顯式宣告內文 `前置依賴`/`後續節點` 與 `Prerequisites`/`Successors`（禁止缺失跳過）。
  - 強制要求每一份中英文卷正文至少包含 1 個以上標準證據標籤（攔截 0 標籤卷冊）。
  - 將 `LIB-903` 納入 Python 區塊雙語對稱強制檢驗，並強制要求全部 56 份中英文卷具備參考文獻（References / Literature）章節。

### 14. 密集檢索與 RAG/CAG 系統架構專卷 (`LIB-603`) 入庫、MoE/LPU 硬體經濟學與 LLM Wiki 認知編譯對齊
- **P0: 新增 `LIB-603`（密集檢索、RAG 與 CAG 系統架構，`RULE-603-01..03`）**：
  - 推導對比學習 InfoNCE 損失與互資訊變分下界 $I(Q; K^+) \ge \log(N) - \mathcal{L}_{\mathrm{InfoNCE}}$、非對稱雙編碼器 MIPS 與交叉編碼器重排序複雜度、結構化 Metadata 解耦，以及 RAG 與長上下文預計算 KV-Cache（CAG）之顯存預算與路由邊界。
- **P0: 擴充 `LIB-602`、`LIB-802`、`LIB-703` 與 `LIB-906`**：
  - `LIB-602`：補足稀疏混合專家模型（Sparse MoE）活躍參數 $N_{\mathrm{active}}$ 與總容量 $N_{\mathrm{total}}$ 解耦公式，以及獨立 GPU HBM、Unified Memory SoC 與確定性片上 SRAM LPU（Groq）之推論頻寬分析。
  - `LIB-802`：補足端側部署 W4A16 顯存容量閉式解 $\mathrm{VRAM}_{\mathrm{total}} = N_{\mathrm{params}}(b_w/8 + (b_{\mathrm{scale}}+b_{\mathrm{zp}})/(8g)) + \mathrm{Mem}_{\mathrm{KV}} + \mathrm{Mem}_{\mathrm{act/ctx}}$。
  - `LIB-703`：納入 Karpathy「LLM Wiki」結構化知識編譯範式（`raw/` $\to$ `wiki/` + `index.md` + 自動化 Linter）與 `provider:model` 統一路由協議。
  - `LIB-906`：補充 H-CoT 思維鏈劫持攻擊（Kuo et al., 2025, arXiv:2502.12893）與 `Claim Ledger` 外部檢索證據之結構化 Metadata 溯源規範。

### 15. 莊啟宏教授視覺與深度學習課程對齊：經典 CNN 骨幹演進、二次病態曲面軌跡、非零中心梯度與早停回滾合約（100 條不變量里程碑）
- **P0: 方案 A — 擴充 `LIB-401`（CNN 骨幹演進與時序序列張量秩守恆，`RULE-401-04`）**：
  - 推導 Sobel 一階差分先驗、VGG 雙/三層 $3 \times 3$ 卷積因式分解（參數量削減 $44.9\%$）、GoogLeNet/Inception $1 \times 1$ 逐點卷積瓶頸（$9.68\times$ MACs 壓縮證明）與 `GlobalAvgPool2D` 取代全連結分類頭（消除 $74.5\%$ 冗餘參數），以及 `Conv1D` vs. 多層堆疊 `RNN` 非終端層 `return_sequences=True` 三階張量秩 $[B, T, D_h]$ 守恆定理。
- **P0: 方案 B — 擴充 `LIB-104`（病態二次曲面軌跡基準與 AdaGrad 早衰證明，`RULE-104-04`）**：
  - 以 $f(x,y) = 0.5x^2 + 2.5y^2$（$\kappa = 5, L = 5$）定量推導 SGD 跨壁震盪、Momentum 正負抵消、AdaGrad 二階單調累加 $G_t = \sum g_\tau^2$ 引發有效學習率 $\eta/\sqrt{G_t} \to 0$ 早衰停滯，以及 RMSprop/Adam 指數移動平均（EMA）遺忘視窗與偏差修正機制。
- **P0: 方案 C — 擴充 `LIB-001`（Sigmoid 非零中心化鋸齒動態、單調性凸性迷思勘誤與 `from_logits=True` 數值穩定性，`RULE-001-05`）**：
  - 嚴密證明非零中心化激活輸出 $a_i > 0$ 如何迫使下游權重梯度 $\frac{\partial \mathcal{L}}{\partial w_i} = \delta \cdot a_i$ 全同號並受限於全正/全負象限（Zig-Zagging Dynamics）；勘誤「單調激活函數保證網路損失為凸函數」之入門迷思；補充 `from_logits=True` 融合 Log-Sum-Exp 防下溢公式與 ROC 曲線門檻掃描 / Wilcoxon-Mann-Whitney AUC 統計等價性。
- **P0: 方案 D — 擴充 `LIB-301` 與 `LIB-501`（$L_1/L_2$ 權重衰減、`EarlyStopping` 狀態回滾與單張影像防除零標準化，`RULE-301-04`）**：
  - 在 `LIB-301` 推導網路深度容量對雙月流形決策邊界曲率之影響、$L_2$ 比例收縮 $(1-\eta\alpha)W$ vs. $L_1$ 次梯度 $\text{sign}(W)$ 稀疏化，並建立 `EarlyStopping(restore_best_weights=True)` 狀態回滾不變量；在 `LIB-501` 增補 `per_image_standardization` 分母防除零安全下界 $\sigma_{\text{adj}} = \max(\sigma_I, 1/\sqrt{N})$ 與兩階段過採樣隨機裁切（`Resize 247` $\to$ `RandomCrop 227`）。全庫正式達成 **28 卷雙語典籍、100 條決策合約不變量**里程碑。

### 16. 混合檢索倒數排名融合 (Hybrid BM25+RRF)、ColBERT 多向量延遲交互與 DAG 拓樸感知圖檢索升級（101 條不變量）
- **P0: 擴充 `LIB-603`（Okapi BM25、RRF 倒數排名融合、ColBERT MaxSim 與 DAG 拓樸子圖展開，`RULE-603-04`）**：
  - 推導稀疏詞彙檢索（Okapi BM25 飽和詞頻與長度正規化）與密集向量之無參數倒數排名融合（Reciprocal Rank Fusion, RRF, $k_0 = 60$，Cormack et al., SIGIR 2009），解決精確索書號與規則代號漏召回問題。
  - 推導 ColBERT 多向量延遲交互（Late Interaction MaxSim 算子 $S(q,d) = \sum_{i} \max_{j} \langle \mathbf{e}_{q,i}, \mathbf{e}_{d,j} \rangle$，Khattab & Zaharia, SIGIR 2020）、父子階層切塊與 1-Hop DAG 先修不變量展開，以及 RAGAS 三元評估體系（Es et al., EACL 2024），並新增 `[RULE-603-04]`（`PERFORMANCE_CRITICAL`）。
- **P0: 擴充 `LIB-703` 與 `LIB-906`（Agentic GraphRAG 路由與檢索證據分類學門控）**：
  - 於 `LIB-703` 建立三階段 Agentic GraphRAG 檢索協議（Child-Chunk RRF $\to$ Parent Section & 1-Hop DAG 先修展開 $\to$ CAG 拓樸子圖預載入）；於 `LIB-906` 將全庫 10 種標準證據標籤綁定至 `Claim Ledger` 證據仲裁器之抗諂媚認知優先序權重。

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
   - 每次開啟新 Thread，第一步必須執行初始化自檢，確保環境處於 `12fb584c248bce1714d0ff2605fed3548f6349d3`（或最新 main 分支 HEAD），工作區乾淨無漂移。
