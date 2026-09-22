---
tags:
  - 圖書館
  - 專題藍圖
  - 系統架構
  - 論文研究
  - 資訊工程
created: 2026-09-17
---

# 專題基石藍圖與未來研究擴展 (Capstone Project Blueprint & Research Roadmap)

## 核心定位
本次 MNIST 手寫辨識專案絕非一個跑完即丟的課堂作業，而是凝結了「體系結構對齊、空間幾何極限、前處理管線重構、資料集文化偏見、模型校準理論」的完整科研閉環。
本卷將本專案正式確立為**大三專題與未來畢業研究的基石起點**，規劃出四大極具學術價值與工程落地前景的擴展方向。

---

## 一、方向一：幾何抗變形手寫辨識系統（CNN + STN 架構）

### 研究動機：
在本次實驗中，我們證實了純全連結網路無法應對仿射變換（Affine Transformation）。若能讓神經網路具備「自我旋轉與縮放」的能力，將徹底解決直立 7 與傾斜 8 的邊界問題。

### 核心技術藍圖：
1. **空間變換網路（Spatial Transformer Networks, STN）**：
   - 引入 Jaderberg et al. (NIPS 2015) 提出的 STN 模組。
   - 網路內部包含 Localization Network，自動預測  	imes 3$ 的仿射變換矩陣：
     egin{bmatrix} x_i^s \ y_i^s \end{bmatrix} = egin{bmatrix} 	heta_{11} & 	heta_{12} & 	heta_{13} \ 	heta_{21} & 	heta_{22} & 	heta_{23} \end{bmatrix} egin{bmatrix} x_i^t \ y_i^t \ 1 \end{bmatrix}
   - 透過可微分雙線性插值（Differentiable Bilinear Sampling），模型在辨識前會主動將傾斜或偏位的筆劃「擺正」。
2. **骨幹網路升級為輕量卷積（LeNet-5 / ResNet-18）**。

---

## 二、方向二：端到端手寫文字行辨識系統（HTR / OCR 引擎）

### 研究動機：
從單一數字辨識擴展到連續手寫筆記、手寫算式或病歷手寫文檔的整行辨識。

### 核心技術藍圖：
1. **CRNN + CTC Loss 架構**：
   - **CNN**：提取手寫文字條狀特徵圖（Feature Map）。
   - **Bi-directional LSTM / GRU**：建模筆劃前後文與字符順序依賴性。
   - **CTC Loss（Connectionist Temporal Classification）**：無需人工對齊單個字元切割點，直接實現端到端序列解碼。
2. **前瞻技術延伸**：
   - Vision Transformer (TrOCR) 與多模態手寫文字理解。

---

## 三、方向三：極致輕量化與邊緣 WebAssembly 推論工程（Edge AI）

### 研究動機：
現代深度學習模型往往依賴昂貴的雲端 GPU。如何將手寫辨識模型極致壓縮，使其能在消費級手機、平板乃至純瀏覽器前端（Zero-Server）以毫秒級延遲運行？

### 核心技術藍圖：
1. **模型量化與剪枝（Quantization & Pruning）**：
   - Post-Training Quantization (PTQ)：將 Float32 權重轉換為 Int8，模型體積縮小 75%，計算速度提升數倍。
   - 結構化剪枝（Structured Pruning）：移除冗餘卷積核與神經元。
2. **跨平台部署管線**：
   - 匯出為 ONNX (Open Neural Network Exchange) 標準格式。
   - 整合 **TensorFlow.js / ONNX Runtime Web**，利用瀏覽器端 WebAssembly (Wasm) 或 WebGPU 進行本地推論，達到零伺服器成本與完全隱私保護。

---

## 四、方向四：全方位人機協同手寫輔助系統（Human-in-the-Loop AI Canvas）

### 研究動機：
結合人機互動（HCI）與主動學習（Active Learning），打造下一代具備自適應學習能力的手繪畫板。

### 核心技術藍圖：
1. **動態筆刷幾何平滑**：
   - 整合 Bézier 曲線擬合演算法，將滑鼠或觸控筆的離散點轉化為連續平滑筆道。
2. **不確定性驅動的主動學習（Active Learning Loop）**：
   - 當模型校準信心度低於閾值（例如最高機率 < 60%）時，介面主動提示使用者：「請問您寫的是 8 還是 7？」
   - 使用者確認後，該樣本自動加入本地微調緩衝區，動態增量學習個人書寫風格。

---

## 專題推進里程碑 (Roadmap)

`
[階段一：基礎奠定 (已完成)]
- 4 層 2^n 金字塔 DNN 構建
- 官方前處理管線與質心限幅演算法實作
- 8 層過擬合實證與模型校準分析
      │
      ▼
[階段二：架構升級 (大三下)]
- 導入 CNN 骨幹與 STN 自適應空間旋轉對齊
- 跨資料集（EMNIST 英文手寫）泛化測試
      │
      ▼
[階段三：邊緣落地 (大四上)]
- ONNX / WebAssembly 瀏覽器端純前端推論
- 研發專屬 React / Vue 互動手寫畫板系統
      │
      ▼
[階段四：專題發表與論文沉澱 (大四下)]
- 撰寫大專生專題研究計畫 / 畢業專題發表
`
