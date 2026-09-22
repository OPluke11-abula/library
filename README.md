# 資訊工程與深度學習知識庫 (CS & Deep Learning Notes)

> 語言切換 / Language: 🇹🇼 **繁體中文** | [🇺🇸 English](en/README.md)

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.x-EE4C2C.svg?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00.svg?logo=tensorflow&logoColor=white)](https://tensorflow.org/)
[![Hardware Alignment](https://img.shields.io/badge/Hardware-CUDA_Warp--32-76B900.svg?logo=nvidia&logoColor=white)](https://developer.nvidia.com/cuda-toolkit)
[![Obsidian Vault](https://img.shields.io/badge/Obsidian-Verified-7C3AED.svg?logo=obsidian&logoColor=white)](https://obsidian.md/)
[![System Invariants](https://img.shields.io/badge/System_Rules-66_Invariants-0ea5e9.svg)](00_總覽與拓樸導覽/LIB-000%20圖書館總覽與拓樸導覽系統%20%28Grand%20Library%20Index%20&%20Navigator%29.md)

<p align="center">
  <b>結合理論推導、GPU 體系結構與工程實踐的深度學習自學筆記</b>
</p>

[總覽導覽](00_總覽與拓樸導覽/LIB-000%20圖書館總覽與拓樸導覽系統%20%28Grand%20Library%20Index%20&%20Navigator%29.md) • [核心原理](#一核心原理-principles) • [工程管線](#二工程管線-pipeline) • [視覺演算法](#三電腦視覺演算法-computer-vision) • [統計校準與前沿機制](#四統計校準與前沿機制-frontiers) • [知識圖譜](#五知識圖譜與依賴關係-roadmap) • [分館目錄](#六分館典籍目錄-catalog)

</div>

---

## 關於本知識庫 (About This Repository)

本知識庫由 **Luke** 整理與維護，記錄資訊工程、深度學習與電腦視覺領域的自學與研究筆記。

針對多數教材「偏向高階抽象概念而忽略數學本質」或「僅止於套件呼叫而忽略底層硬體協同」的問題，本筆記庫依循三個層次展開：
1. **概念與物理動機**：從幾何視角與核心痛點切入，釐清架構設計的原因。
2. **數學形式化推導**：提供定義、目標函數閉式解與收斂性質證明，引證同儕評審期刊與會議論文（CVPR, ICCV, NeurIPS, ICML, ICLR, MLSys, ACM TOG）。
3. **計算機系統與硬體協同**：分析記憶體階層、Cache Line、GPU Warp 排程（32 執行緒對齊）、Tensor Core Tiling 與推論延遲瓶頸。
4. **工程實作規範**：提供標註張量形狀的 PyTorch / CUDA 實作，並標註邊界防禦條件。

---

## 一、核心原理 (Principles)

深度學習的底層是高維空間變換與數值最佳化。以下梳理模型學習過程中的六大關鍵環節：

<div align="center">
  <img src="assets/01_principles_navigator.svg" alt="深度學習核心原理導覽" width="100%" />
</div>

### 核心理論模組索引
| 模組編號 | 核心原理 | 解決問題 | 參考筆記 |
| :--- | :--- | :--- | :--- |
| **01 空間投影** | **高維幾何變換 (Linear Map)** | 784 維像素空間的旋轉、縮放與超平面投影 | [LIB-101 線性代數與高維幾何變換本質](01_數學與理論基石/LIB-101%20線性代數與高維幾何變換本質%20%28Linear%20Algebra%20&%20High-Dimensional%20Geometry%29.md) |
| **02 前向傳播** | **非線性激活 (Activation)** | 全連接矩陣運算，ReLU/GELU 避免梯度消失並提供空間扭曲能力 | [LIB-001 深度學習第一性原理先修精要](00_總覽與拓樸導覽/LIB-001%20深度學習第一性原理先修精要：模型如何學習的六大基石%20%28Deep%20Learning%20First%20Principles%20-%20The%20Six%20Pillars%20of%20How%20Models%20Learn%29.md) |
| **03 損失函數** | **分佈距離度量 (Loss Metrics)** | 交叉熵衡量預測機率分佈與真實標籤的距離，Softmax 數值穩定轉換 | [LIB-001 深度學習第一性原理先修精要](00_總覽與拓樸導覽/LIB-001%20深度學習第一性原理先修精要：模型如何學習的六大基石%20%28Deep%20Learning%20First%20Principles%20-%20The%20Six%20Pillars%20of%20How%20Models%20Learn%29.md) |
| **04 反向傳播** | **鏈式法則梯度計算 (Autograd)** | 多層雅可比矩陣連乘，沿梯度反方向更新權重參數 | [LIB-104 凸最佳化理論與一階二階梯度下降幾何](01_數學與理論基石/LIB-104%20凸最佳化理論與一階二階梯度下降幾何%20%28Optimization%20Theory%20&%20Gradient%20Descent%29.md) |
| **05 最佳化器** | **自適應學習率 (Optimizer)** | Adam 結合一階動量（慣性）與二階動量（梯度方差自適應縮放） | [LIB-104 凸最佳化理論與一階二階梯度下降幾何](01_數學與理論基石/LIB-104%20凸最佳化理論與一階二階梯度下降幾何%20%28Optimization%20Theory%20&%20Gradient%20Descent%29.md) |
| **06 歸納偏置** | **卷積局部性與平移等變 (CNN)** | 解決全連接層展平後的空間拓樸破壞，利用權重共享與局部感受野 | [LIB-401 全連結網路空間極限與卷積神經網路理論必然性](04_深度學習架構與神經機制/LIB-401%20全連結網路空間極限與卷積神經網路理論必然性%20%28DNN%20Spatial%20Limits%20&%20CNN%20Inductive%20Bias%29.md) |

---

## 二、工程管線 (Pipeline)

以 MNIST 手寫辨識系統為例，實際落地的模型管線需要兼顧 GPU 硬體執行緒排程、記憶體階層、分佈漂移抑制與網頁推論延遲。

<div align="center">
  <img src="assets/02_code_pipeline.svg" alt="生產級代碼模組管線" width="100%" />
</div>

### 模組架構（LIB-901 實證管線）
1. **Module 01: 環境與硬體偵測**：動態偵測 CUDA 驅動、GPU 記憶體與執行框架版本，防止執行期例外。
2. **Module 02: 資料載入與互動視覺化**：封裝視覺化控制項，強制執行維度還原檢驗 `[RULE-901-01]`。
3. **Module 03: 數值正規化與標籤編碼**：`float32 / 255.0` 縮放，防範重複除法與精度損失 `[RULE-901-02]`。
4. **Module 04: 四層硬體對齊神經網路**：
   - 隱藏層節點數設計為 $256 \to 128 \to 64 \to 32$，嚴格對齊 NVIDIA CUDA Warp 32 執行緒記憶體合併讀取 (Coalesced Access)。
   - 採用 `BatchNormalization()` 與 `Dropout(0.2)` 控制分佈漂移與過度擬合。
   - 參數量控制在 24.5 萬，相較未經正規化的深層網路減少 72% 計算開銷。
5. **Module 05: 學習曲線監控與抽樣測試**：繪製收斂曲線，並以獨立抽樣確認泛化精度達 98% 以上。
6. **Module 06: 即時畫板推論服務**：整合前處理演算法與 Gradio 介面，提供本機推論 API。

* 詳細實作代碼與逐行解析請見：[LIB-901 經典專案實證復盤：從課堂作業到生產級 MNIST 手寫辨識系統](09_科研方法論與頂尖專題藍圖/LIB-901%20經典專案實證復盤：從課堂作業到生產級%20MNIST%20手寫辨識系統%20%28Classic%20Project%20Post-Mortem%20-%20From%20Class%20Assignment%20to%20Production%20MNIST%20System%29.md)

---

## 三、電腦視覺演算法 (Computer Vision)

在手繪畫板等真實場景中，使用者輸入的筆劃粗細、位置與角度與標準測試集往往存在分佈漂移（Domain Shift）。若直接使用常規 `resize()`，容易引發嚴重的誤判問題。

<div align="center">
  <img src="assets/03_application_cv.svg" alt="前處理與質心演算法" width="100%" />
</div>

### 常見問題與對應演算法
- **大面積留白導致筆劃斷裂**：
  - **問題機制**：畫布邊界過大時，直接縮小會使筆劃壓細甚至斷裂，觸發特徵盲區（例如將「1」誤判為「5」）。
  - **解法**：計算筆劃 Bounding Box 外接矩形，等比例縮放至 $20 \times 20$ 核心區域，四周填充 4 像素留白至 $28 \times 28$。
- **書寫習慣與非對稱筆劃偏差**：
  - **問題機制**：亞洲人書寫直立 7 時，若僅依據外框置中，會將實體筆劃推向右側，落入美式傾斜 7 的負權重懲罰區域，進而誤判為 8。
  - **解法**：遵循 Yann LeCun 1998 原著規範，計算墨水一階動差**質量重心 (Center of Mass)**：
    $$\bar{x} = \frac{\sum x \cdot I(x,y)}{\sum I(x,y)}, \quad \bar{y} = \frac{\sum y \cdot I(x,y)}{\sum I(x,y)}$$
    加上 $\pm 3$ 像素安全限幅平移至 $(13.5, 13.5)$ 中心。
- **推論端增強 (Bunch TTA)**：
  - 引入多視角旋轉與翻轉的凸組合推論，降低遮擋與邊界噪聲影響（參考 Electronics 2024）。

* 演算法細節見：[LIB-501 計算機視覺前處理規範與影像質心定位演算法](05_計算機視覺與高維感測/LIB-501%20計算機視覺前處理規範與影像質心定位演算法%20%28CV%20Preprocessing%20&%20Center%20of%20Mass%20Alignment%29.md) 與 [LIB-301 資料分佈偏差、領域漂移與空間權重懲罰幾何](03_機器學習與統計學習原理/LIB-301%20資料分佈偏差、領域漂移與空間權重懲罰幾何%20%28Dataset%20Bias,%20Domain%20Shift%20&%20Spatial%20Penalties%29.md)。

---

## 四、統計校準與前沿機制 (Frontiers)

<div align="center">
  <img src="assets/04_logic_calibration_frontiers.svg" alt="模型校準與前沿演進" width="100%" />
</div>

### 1. 模型校準 (Model Calibration)
- **深層網路的過度自信**：未經正則化約束的深層網路（如 8 層全連接）容易產生極端 Logits，使 Softmax 輸出趨於 100% 或 0%，失去對不確定性的量度能力（引證 Guo et al., ICML 2017《On Calibration of Modern Neural Networks》）。
- **校準後網路**：引入 BatchNorm 與 Dropout，輸出機率能合理反映模糊輸入的真實分佈（如輸出 8 為 57%、7 為 29%），預測結果更具可靠度。
- 詳見：[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信](08_AI系統工程與高效部署/LIB-801%20現代深度學習之模型校準、不確定性估計與過度自信%20%28Model%20Calibration%20&%20Uncertainty%20Estimation%29.md)。

### 2. 生成模型演進：擴散模型至流匹配 (Flow Matching)
- **擴散模型 (Score-based SDE)**：透過隨機微分方程進行加噪與去噪，需要多步數值積分。
- **最佳傳輸流匹配 (Flow Matching / Rectified Flow)**：建構直線性向量場（曲率 $\kappa=0$），顯著減少推論積分步數。
- **Diffusion Transformer (DiT)**：取代傳統 UNet 架構，以 Patch 方式切分特徵，適用於大規模參數量縮放。
- 詳見：[LIB-406 生成模型前沿：隨機微分方程擴散、流匹配與 DiT 革命](04_深度學習架構與神經機制/LIB-406%20生成模型前沿：從隨機微分方程%20%28SDE%29%20擴散模型到最佳傳輸流匹配%20%28Flow%20Matching%29%20與%20DiT%20革命%20%28Generative%20Frontiers%20-%20From%20Score-Based%20SDE%20Diffusion%20to%20Optimal%20Transport%20Flow%20Matching%20&%20DiT%20Revolution%29.md)。

### 3. 雙進程代理人架構 (Dual-Process Agent Architecture)
- **直覺反射進程 (System 1)**：非自迴歸型態決策模型（如 Jev, CUA-S1），以單次前向傳播完成高頻介面動作判斷，延遲約 50ms。
- **深度規劃進程 (System 2)**：ReAct 迴圈與鏈路規劃，依據拓樸關係調度工具並維護全域狀態。
- 詳見：[LIB-704 雙進程神經代理人：S1 非自迴歸型態決策引擎與字節級介面反射模型](07_強化學習與智慧代理人/LIB-704%20雙進程神經代理人：S1%20非自迴歸型態決策引擎%20%28Jev%29%20與字節級介面反射模型%20%28CUA-S1%29%20深度解剖%20%28Dual-Process%20Neural%20Agent%20-%20S1%20Non-Autoregressive%20Typed%20Decision%20Engine%20%28Jev%29%20&%20Byte-Level%20Interface%20Reflex%20Model%20%28CUA-S1%29%29.md)。

---

## 五、知識圖譜與依賴關係 (Roadmap)

<div align="center">
  <img src="assets/00_grand_roadmap.svg" alt="知識拓樸依賴圖譜" width="100%" />
</div>

### 推薦閱讀路徑
- **【基礎路徑】資工基礎與模型原理**：
  `LIB-001` (先修基石) $\to$ `LIB-101` (線性代數) $\to$ `LIB-203` (硬體架構) $\to$ `LIB-401` (CNN 偏置) $\to$ `LIB-501` (質心演算法) $\to$ `LIB-801` (模型校準) $\to$ `LIB-901` (MNIST 生產級復盤)。
- **【研究路徑】前沿架構與專題研究**：
  `LIB-001` $\to$ `LIB-104` (最佳化) $\to$ `LIB-301` (領域漂移) $\to$ `LIB-405` (Transformer) $\to$ `LIB-406` (流匹配/DiT) $\to$ `LIB-504` (3DGS) $\to$ `LIB-602` (大語言模型) $\to$ `LIB-802` (模型量化) $\to$ `LIB-903` (專題藍圖) $\to$ `LIB-904` (學術文獻體系)。
- **【系統路徑】推論部署與智慧代理人**：
  `LIB-203` (硬體架構) $\to$ `LIB-405` (注意力機制) $\to$ `LIB-602` (LLM 架構) $\to$ `LIB-703` (代理人協議) $\to$ `LIB-704` (雙進程架構) $\to$ `LIB-802` (低精度量化)。

---

## 六、分館典籍目錄 (Catalog)

| 索書號編碼 | 分館名稱 | 核心範疇 | 代表筆記 |
| :--- | :--- | :--- | :--- |
| **LIB-000 ~ 099** | **00 總覽與拓樸導覽** | 知識圖譜、學習路徑、模型先修基石 | [LIB-000 總導覽](00_總覽與拓樸導覽/LIB-000%20圖書館總覽與拓樸導覽系統%20%28Grand%20Library%20Index%20&%20Navigator%29.md) • [LIB-001 先修精要](00_總覽與拓樸導覽/LIB-001%20深度學習第一性原理先修精要：模型如何學習的六大基石%20%28Deep%20Learning%20First%20Principles%20-%20The%20Six%20Pillars%20of%20How%20Models%20Learn%29.md) |
| **LIB-100 ~ 199** | **01 數學物理與理論基石** | 線性代數、微積分自動微分、凸最佳化 | [LIB-101 線性代數](01_數學與理論基石/LIB-101%20線性代數與高維幾何變換本質%20%28Linear%20Algebra%20&%20High-Dimensional%20Geometry%29.md) • [LIB-104 凸最佳化](01_數學與理論基石/LIB-104%20凸最佳化理論與一階二階梯度下降幾何%20%28Optimization%20Theory%20&%20Gradient%20Descent%29.md) |
| **LIB-200 ~ 299** | **02 計算機系統與 AI 硬體架構** | 記憶體階層、GPU SIMT、Tensor Cores、算子融合 | [LIB-203 硬體對齊](02_計算機系統與硬體架構/LIB-203%20計算機體系結構與深度學習硬體對齊%20%28Computer%20Architecture%20&%20Hardware-Aware%20Deep%20Learning%29.md) |
| **LIB-300 ~ 399** | **03 機器學習與統計學習原理** | 經驗風險、泛化界、分佈漂移、空間權重幾何 | [LIB-301 資料分佈偏差](03_機器學習與統計學習原理/LIB-301%20資料分佈偏差、領域漂移與空間權重懲罰幾何%20%28Dataset%20Bias,%20Domain%20Shift%20&%20Spatial%20Penalties%29.md) |
| **LIB-400 ~ 499** | **04 深度學習架構與神經機制** | CNN 歸納偏置、Transformer、流匹配與 DiT | [LIB-401 CNN 理論必然性](04_深度學習架構與神經機制/LIB-401%20全連結網路空間極限與卷積神經網路理論必然性%20%28DNN%20Spatial%20Limits%20&%20CNN%20Inductive%20Bias%29.md) • [LIB-405 Transformer](04_深度學習架構與神經機制/LIB-405%20注意力機制、Transformer%20革命與位置編碼幾何%20%28Attention%20Mechanism%20&%20Transformer%20Revolution%29.md) • [LIB-406 流匹配與 DiT](04_深度學習架構與神經機制/LIB-406%20生成模型前沿：從隨機微分方程%20%28SDE%29%20擴散模型到最佳傳輸流匹配%20%28Flow%20Matching%29%20與%20DiT%20革命%20%28Generative%20Frontiers%20-%20From%20Score-Based%20SDE%20Diffusion%20to%20Optimal%20Transport%20Flow%20Matching%20&%20DiT%20Revolution%29.md) |
| **LIB-500 ~ 599** | **05 計算機視覺與高維感測** | 數位訊號處理、質心定位、NeRF 到 3DGS 光柵化 | [LIB-501 CV 前處理與質心](05_計算機視覺與高維感測/LIB-501%20計算機視覺前處理規範與影像質心定位演算法%20%28CV%20Preprocessing%20&%20Center%20of%20Mass%20Alignment%29.md) • [LIB-504 3DGS 高斯潑濺](05_計算機視覺與高維感測/LIB-504%203D%20視覺前沿：神經輻射場%20%28NeRF%29%20到%203D%20高斯潑濺%20%283DGS%29%20理論與光柵化%20%283D%20Gaussian%20Splatting%20Theory%20&%20Rasterization%29.md) |
| **LIB-600 ~ 699** | **06 自然語言處理與大語言模型** | 縮放定律、Decoder-Only、RMSNorm、SwiGLU、GQA | [LIB-602 大語言模型架構](06_自然語言處理與大語言模型/LIB-602%20現代大語言模型架構解剖與縮放定律%20%28Modern%20LLM%20Architecture%20&%20Scaling%20Laws%29.md) |
| **LIB-700 ~ 799** | **07 強化學習與智慧代理人** | MDP、ReAct 迴圈、S1/S2 雙進程代理人 | [LIB-703 代理人認知架構](07_強化學習與智慧代理人/LIB-703%20現代大模型代理人%20%28LLM%20Agent%29%20認知架構與推論協議%20%28LLM%20Agent%20Cognitive%20Architecture%20&%20Protocols%29.md) • [LIB-704 雙進程神經代理人](07_強化學習與智慧代理人/LIB-704%20雙進程神經代理人：S1%20非自迴歸型態決策引擎%20%28Jev%29%20與字節級介面反射模型%20%28CUA-S1%29%20深度解剖%20%28Dual-Process%20Neural%20Agent%20-%20S1%20Non-Autoregressive%20Typed%20Decision%20Engine%20%28Jev%29%20&%20Byte-Level%20Interface%20Reflex%20Model%20%28CUA-S1%29%29.md) |
| **LIB-800 ~ 899** | **08 AI 系統工程與高效部署** | 模型校準 (ECE)、共形預測、AWQ 量化與低精度推論 | [LIB-801 模型校準與不確定性](08_AI系統工程與高效部署/LIB-801%20現代深度學習之模型校準、不確定性估計與過度自信%20%28Model%20Calibration%20&%20Uncertainty%20Estimation%29.md) • [LIB-802 模型量化與推論](08_AI系統工程與高效部署/LIB-802%20現代深度學習模型量化理論與低精度推論架構%20%28Quantization%20Mathematics%20&%20Low-Precision%20Inference%29.md) |
| **LIB-900 ~ 999** | **09 科研方法論與頂尖專題藍圖** | 專題藍圖、國科會計畫、學術文獻體系、生產級復盤 | [LIB-901 MNIST 專案復盤](09_科研方法論與頂尖專題藍圖/LIB-901%20經典專案實證復盤：從課堂作業到生產級%20MNIST%20手寫辨識系統%20%28Classic%20Project%20Post-Mortem%20-%20From%20Class%20Assignment%20to%20Production%20MNIST%20System%29.md) • [LIB-903 專題基石藍圖](09_科研方法論與頂尖專題藍圖/LIB-903%20專題基石藍圖、學術推甄與多模態研究演進%20%28Capstone%20Blueprint%20&%20Academic%20Research%20Evolution%29.md) • [LIB-904 學術科研文獻體系](09_科研方法論與頂尖專題藍圖/LIB-904%20學術科研文獻體系與前沿研究對齊%20%28Academic%20Research%20Corpus%20&%20Literature%20Synthesis%29.md) |

*(早期課堂作業與歷史筆記封存於 `_archive_legacy/` 目錄)*

---

## 七、Obsidian 本地使用說明 (Using with Obsidian)

本筆記庫完全相容於 [Obsidian](https://obsidian.md/)：
1. **Clone 專案至本地**：
   ```bash
   git clone https://github.com/OPluke11-abula/library.git
   ```
2. **在 Obsidian 中開啟**：
   - 點選「開啟資料夾作為儲存庫 (Open folder as vault)」。
   - 選取本 `library` 資料夾。
3. **功能支援**：
   - 全庫筆記包含雙向鏈結（Wikilinks），可直接在右上角開啟「圖譜檢視 (Graph view)」查看節點依賴關係。
   - 支援標準 KaTeX 數學公式與語法高亮。

---

## 八、授權條款 (License)

本知識庫遵循 [MIT License](LICENSE) 開源授權。引用格式參考：
```bibtex
@misc{luke2026library,
  author = {Luke},
  title = {Computer Science and Deep Learning Knowledge Base: Theory, Systems, and Implementations},
  year = {2026},
  publisher = {GitHub},
  howpublished = {\url{https://github.com/OPluke11-abula/library}}
}
```
