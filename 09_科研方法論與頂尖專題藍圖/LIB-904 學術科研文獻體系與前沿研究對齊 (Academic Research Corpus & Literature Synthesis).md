---
call_number: LIB-904
status: source-verified
invariants_count: 4
title: 學術科研文獻體系與前沿研究對齊 (Academic Research Corpus & Literature Synthesis)
module: Research-Methodology-Capstone
category: Academic-Literature-Synthesis
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - View-Decomposed LoRA & 3DGS Cascaded Optimization
  - Space-Filling Curves (Hilbert & Z-Order) Point Cloud Serialization
  - Camera-Aware Jaccard Distance Metric (CA-Jaccard)
  - Entropy-Aware Adaptive Fusion (EAAF) in Latent Diffusion
  - Parallel Residual Bi-Fusion (PRB-FPN) & Testing-Time Grid Cropping
  - Bunch Testing Time Augmentation (Bunch TTA) Invariant Transformations
hardware_target:
  - Single GPU (RTX 4090 / 24GB VRAM) Free-Viewpoint 3DGS
  - High-Performance GPU Clusters (NVIDIA A100 / H100)
  - Edge Embedded Systems (NVIDIA Jetson AGX Orin / Nano)
created: 2026-09-21
updated: 2026-09-22
author: Luke
tags:
  - 圖書館
  - 學術文獻研讀
  - 科研方法論
  - 論文復現
  - 3DGS虛擬試穿
  - 點雲序列化
  - 行人再識別
  - 智慧交通
  - 測試時增強
  - 自學體系
prerequisites:
  - "[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]"
successors: []
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/09_research_methodology/LIB-904%20Academic%20Research%20Corpus%20%26%20Literature%20Synthesis%20%28Agent%20EN%29.md)

# 學術科研文獻體系與前沿研究對齊 (Academic Research Corpus & Literature Synthesis)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-000 圖書館總覽與拓樸導覽系統 (Grand Library Index & Navigator)]]、[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]、[[LIB-405 注意力機制、Transformer 革命與位置編碼幾何 (Attention Mechanism & Transformer Revolution)]]、[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]、[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]。
- **後續節點**：本卷為學術文獻研讀與科研方法論之總成節點，直接支撐大專學生研究計畫與深度學習自主科研體系。
- **學術定位**：建立獨立研究員（Luke）研讀頂級會議與同行評審權威期刊論文的系統化方法論。以電腦視覺、神經渲染（3DGS）、高維幾何點雲序列化、度量學習（Metric Learning）與測試時增強（TTA）等前沿研究為實戰範例，架構從理論形式化、消融實驗分析、GPU 硬體映射到代碼復現之完整學術研讀閉環：

```
                              ┌────────────────────────────────────────────────────────┐
                              │  學術科研文獻體系與前沿研究對齊 (Literature Synthesis) │
                              │   全系統工程基石：張量代數、CNN/RNN/Transformer 實作   │
                              └──────────────────────────┬─────────────────────────────┘
                                                         │
         ┌───────────────────────┬───────────────────────┴───────────────────────┬───────────────────────┐
         ▼                       ▼                                               ▼                       ▼
┌──────────────────┐   ┌──────────────────┐                           ┌──────────────────┐   ┌──────────────────┐
│  智慧交通與遙感  │   │  生物辨識與防偽  │                           │ 3D 視覺與神經渲染│   │  多模態生成與對話│
│  ITS & Remote    │   │  Biometrics      │                           │ 3DGS & PointCloud│   │  Generative & AR │
├──────────────────┤   ├──────────────────┤                           ├──────────────────┤   ├──────────────────┤
│• 違規停車偵測    │   │• 動態唇紋辨識    │                           │• 3DGS 虛擬試穿   │   │• 自適應風格擴散  │
│  (影像與識別 22) │   │  (資訊科技 2025) │                           │  (Electronics 25)│   │  (Electronics 26)│
│• 號誌特徵融合    │   │• 影像/點位雙特徵 │                           │• 點雲序列化注意力│   │• AR 對話機器人   │
│  (Electronics 23)│   │• 差分抗光照干擾  │                           │  (Electronics 26)│   │  (Electronics 23)│
│• 空拍農作偵測    │   │• 活體防偽攻擊    │                           │• TransReID 行人  │   │• 資訊熵動態控制  │
│  (Electronics 24)│   │  (HTER: 8.86%)   │                           │  (Algorithms 25) │   │  (EAAF/PFR 模組) │
└──────────────────┘   └──────────────────┘                           └──────────────────┘   └──────────────────┘
```

---

## 一、💡 學術科研文獻研讀心智模型與四維分析法

### 1. 頂刊/頂會論文的三階研讀法 (Three-Pass Reading Protocol)
在深入前沿領域時，研究者面臨海量的 arXiv 預印本與期刊發表。本館貫徹 S. Keshav 所提之**三階論文研讀規範**：
1. **第一階（快速掃描，10 分鐘）**：研讀 Title, Abstract, Introduction, Section Headings 與 Conclusion，並細閱主要架構圖。判斷該論文之核心假設、技術範疇與是否值得精讀。
2. **第二階（把握內容，1 小時）**：仔細研讀主要推導、幾何直觀與消融實驗（Ablation Study）。標記未理解的數學符號，審視其基準對比（Baseline）是否誠實。
3. **第三階（虛擬復現，數小時至數天）**：在心中或本地從零推導核心定理，推想作者在演算法實作中可能隱瞞或忽略的工程細節（如學習率預熱、數據增強、退化邊界）。

### 2. 四維文獻分析框架
每篇納入知識庫的前沿論文，必須經過以下四個嚴格維度的解構：
- **痛點辨識 (Pain Point Identification)**：現有 SOTA 架構在物理幾何、計算複雜度或資料偏差上的致命缺陷。
- **數學形式化 (Mathematical Formalization)**：嚴謹定義目標函數、流形約束或變分邊界。
- **消融驗證 (Ablation Verification)**：各創新模組（如注意力機制、損失項、數據增強）的邊際貢獻量化。
- **系統邊界 (System & Hardware Bounds)**：在 GPU 記憶體頻寬、Warp 排程與計算複雜度上的實際負擔。

### 3. 真實世界嚴苛條件下的魯棒性突破
觀察優秀期刊論文的共同特質，其核心精髓均在於**「解決真實場景中的物理與算力限制」**：
- **相機視角不重疊**：真實街道中攝影機不可能全覆蓋，跨街區目標追蹤如何消除場景特徵偏差？（提出 **CA-Jaccard** 重排序演算法，Market-1501 mAP 達 **93.58%**）。
- **硬體顯存有限**：高畫質 3D 虛擬試穿通常需要 48GB+ 顯存，如何在單張消費級 24GB RTX 4090 上運行？（提出 **視角解耦 LoRA + 3DGS** 級聯優化）。
- **目標極度微小**：空拍遙感農作物與遠距路口號誌在畫面中僅佔十餘個像素，如何精確捕捉？（提出 **PRB-FPN 雙向特徵融合** 與 **Bunch TTA 測試時多變換增強**）。
- **點雲幾何無序**：光達掃描的 3D 點雲數量高達數十萬，傳統自注意力複雜度爆炸？（提出 **Hilbert 空間填充曲線序列化**，自注意力計算複雜度降至線性 $\mathcal{O}(M \cdot P)$）。
- **風格擴散過度破壞語意**：文字生圖風格微調常導致主體嚴重變形？（提出 **EAAF 資訊熵動態注入** 與 **PFR 漸進重加權**）。
- **光照與照片欺騙**：傳統生物特徵辨識易受靜態照片攻擊攻破？（提出 **動態訊框差分 + 雙特徵流**，HTER 降至 8.86%）。

---

## 二、🎓 博士級形式化推導與前沿代表性文獻深度復盤

本節精選 7 篇具備高實用價值與嚴謹數理結構的權威期刊論文進行解剖：

### 1. 3DGS 虛擬試穿與視角解耦 LoRA (*Electronics 2025*, Article 3884)

在論文 *"Splatting the Cat: Efficient Free-Viewpoint 3D Virtual Try-On via View-Decomposed LoRA and Gaussian Splatting"* 中，研究攻克了 3D 虛擬試穿中跨視角紋理洩漏與顯存爆炸的關鍵瓶頸。

#### (1) 四階段級聯優化 (Four-Stage Cascade Optimization)
1. **人體幾何先驗初始化**：利用 SMPL-X 參數化人體網格生成帶有法向量的粗粒度點雲，初始化 3D 高斯橢球集 $\mathcal{G} = \{(\mu_i, \Sigma_i, c_i, \alpha_i)\}_{i=1}^N$（對齊 [[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]）。
2. **2D 輕量試穿引導**：利用 2D CatVTON 模型，輸入人體目標影像 $I_{\text{person}}$ 與服裝影像 $I_{\text{garment}}$，生成多視角高解析度 2D 試穿指導影像集 $\mathcal{I}_{\text{guided}}$。
3. **視角解耦 LoRA (View-Decomposed LoRA)**：
   傳統微調直接將所有視角混合訓練，導致正面印花污染人體背面。論文將環繞視角 $\theta \in [0^\circ, 360^\circ)$ 劃分為三個正交子空間：
   $$\mathcal{V}_{\text{front}} = [-45^\circ, 45^\circ], \quad \mathcal{V}_{\text{side}} = [45^\circ, 135^\circ] \cup [225^\circ, 315^\circ], \quad \mathcal{V}_{\text{back}} = [135^\circ, 225^\circ]$$
   對每個視角子集分別訓練專屬的低秩適應矩陣（對齊 [[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]）：
   $$W_{\text{eff}}(\theta) = W_0 + \sum_{k \in \{\text{front, side, back}\}} w_k(\theta) \cdot (B_k \cdot A_k), \quad B_k \in \mathbb{R}^{d \times r}, A_k \in \mathbb{R}^{r \times k}$$
   其中 $w_k(\theta)$ 為基於相機方位角之餘弦平滑混合權重。
4. **自由視角迭代光柵化**：透過可微分 Tile-based 光柵化反向傳播更新高斯橢球位置與顏色，實現單張 RTX 4090 (24GB) 下流暢的 360 度動態試穿渲染。

---

### 2. 空間填充曲線序列化點雲注意力 (*Electronics 2026*, Article 1849)

在論文 *"Point Cloud Semantic Segmentation Network Based on Serialized Attention"* 中，研究攻克了 3D 點雲無序性（Unordered Nature）與 Transformer 注意力平方複雜度之衝突。

#### (1) Hilbert 空間填充曲線映射 (Hilbert Space-Filling Curve Mapping)
對於三維空間中的離散點雲 $\mathcal{P} = \{p_i = (x_i, y_i, z_i)\}_{i=1}^M$，傳統 $k$-NN 搜尋需要建立複雜的 $k$-d tree，在 GPU 上引發嚴重的記憶體離散存取（Uncoalesced Memory Access，參見 [[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]）。

論文提出將三維坐標量化為離散網格，並透過 Hilbert 雙射函數 $\mathcal{H}: \mathbb{Z}^3 \to \mathbb{Z}$ 將高維空間投影為一維長鏈：
$$h_i = \mathcal{H}\left(\lfloor x_i / \delta \rfloor, \, \lfloor y_i / \delta \rfloor, \, \lfloor z_i / \delta \rfloor\right)$$
- **空間局部性保證**：Hilbert 曲線保證若三維空間中兩點 $\|p_i - p_j\|_2 < \epsilon$，則其一維坐標 $|h_i - h_j|$ 以極大概率相鄰。
- **瓦片化區段注意力 (Segment Attention)**：
  沿著一維 Hilbert 序列將點雲切分為固定大小之連續 Patch（大小為 $P=32$）。在 Patch 內部直接執行密集局部注意力，全域則透過跨區段隨機混合（Sequential Random Mixing）擴展感受野，將自注意力計算複雜度由 $\mathcal{O}(M^2)$ 劇降為 $\mathcal{O}(M \cdot P)$！

---

### 3. 非重疊相機行人再識別 CA-Jaccard 重排序 (*Algorithms 2025*, Article 714)

在論文 *"Person Re-Identification Under Non-Overlapping Cameras Based on Advanced Contextual Embeddings"* 中，提出了一種**無需重訓骨幹網路即能大幅拉升精度的後處理拓樸演算法**。

#### (1) 相機感知 Jaccard 距離 (Camera-Aware Jaccard Distance)
給定探測影像 (Query) $q$ 與圖庫樣本 (Gallery) $g_i$，由 Vision Transformer (TransReID) 提取出 $L_2$ 歸一化特徵向量 $f_q, f_{g_i}$，初步歐幾里得距離為 $d(q, g_i) = \|f_q - f_{g_i}\|_2$。

但在非重疊相機網絡中，相機專屬偏差（Camera-specific Bias，如曝光、角度）會導致同相機樣本距離虛假偏近。
研究提出先建立 $k$-倒數最近鄰集合（$k$-reciprocal nearest neighbors, $\mathcal{R}(p, k)$）：
$$\mathcal{R}(p, k) = \{g \in \mathcal{N}(p, k) \mid p \in \mathcal{N}(g, k)\}$$
進一步導入相機感知拓樸懲罰權重 $C(p, g)$：
$$C(p, g) = \begin{cases} 1.0 + \gamma & \text{if } \text{CamID}(p) == \text{CamID}(g) \text{ (抑制同相機場景捷徑)} \\ 1.0 & \text{if } \text{CamID}(p) \neq \text{CamID}(g) \text{ (鼓勵跨相機匹配)} \end{cases}$$
最終計算 Jaccard 相似度矩陣：
$$d_{\text{CA-Jaccard}}(q, g) = 1 - \frac{|\mathcal{R}^*(q, k) \cap \mathcal{R}^*(g, k)|}{|\mathcal{R}^*(q, k) \cup \mathcal{R}^*(g, k)|}$$
在 Market-1501 基準資料集上，mAP 指標從 88.2% 躍升至 **93.58%**，實證證明幾何拓樸後處理能有效消除特徵空間的流形扭曲。

---

### 4. 擴散模型自適應風格融合 (*Electronics 2026*, Article 2800)

在論文 *"Adaptive Content and Style Fusion for Text-to-Image Generations"* 中，提出了 **EAAF (Entropy-Aware Adaptive Fusion)** 與 **PFR (Progressive Feature Reweighting)**：
- **資訊熵度量**：利用特徵圖的香農資訊熵（Shannon Entropy）動態評估內容區域的語意豐富度。在低資訊熵區域（如平坦背景）加大風格紋理注入，在高資訊熵區域（如人臉、文字細節）主動抑制風格滲透，徹底解決傳統擴散模型「風格過度渲染（Over-stylization）導致內容主體變形」之痛點。

---

### 5. 空拍遙感微小目標偵測與群聚測試時增強 (Bunch TTA) (*Electronics 2024*, Article 632)

在論文 *"Using a Bunch Testing Time Augmentations to Detect Rice Plants Based on Aerial Photography"* 中，攻克了高空無人機遙感影像中農作物目標微小、密集且容易受風吹形變之嚴峻難題。

#### (1) 群聚測試時增強數學形式化 (Bunch TTA Mathematical Formulation)
在無人機空拍大圖（解析度達 $4000 \times 3000$ 像素）中，目標的尺度常常僅有 $15 \times 15$ 到 $30 \times 30$ 像素。單次前向推論容易因光影反射與方向偏角造成大量漏檢。
論文提出 **Bunch TTA (群聚測試時增強)** 算子，對輸入測試影像 $\mathbf{x}$ 施加一組幾何變換群 $\mathcal{T} = \{\mathcal{T}_1, \mathcal{T}_2, \dots, \mathcal{T}_K\}$：
$$\mathbf{y}_{\text{final}} = \sum_{k=1}^K w_k \cdot \mathcal{T}_k^{-1}\left(f_\theta(\mathcal{T}_k(\mathbf{x}))\right), \quad \sum_{k=1}^K w_k = 1$$
其中變換群包含：
$$\mathcal{T}_k \in \{\text{Identity}, \, \text{Rot}_{90}, \, \text{Rot}_{180}, \, \text{Rot}_{270}, \, \text{HFlip}, \, \text{VFlip}, \, \text{Scale}_{0.8}, \, \text{Scale}_{1.2}\}$$
- $\mathcal{T}_k^{-1}$ 為逆變換算子，將旋轉與翻轉後的偵測邊界框精確映射回原始空拍坐標系。
- 結合 **測試時滑動網格切片 (Testing-Time Grid Cropping)**：以重疊率 20% 的滑動窗口切片為子圖，各自執行 Bunch TTA 後，再透過加權邊界框融合 (WBF / Soft-NMS) 合併。實測將無人機航拍目標檢測漏檢率（False Negative Rate）大幅降低 38% 以上。

---

### 6. 交通號誌特徵融合與注意力機制 (*Electronics 2023*, Article 3727)

在論文 *"Traffic Light Detection by Integrating Feature Fusion and Attention Mechanism"* 中，聚焦於自駕車與先進駕駛輔助系統 (ADAS) 在真實複雜路口之號誌辨識。

#### (1) 平行殘差雙向特徵融合 (PRB-FPN)
遠端號誌在車載相機畫面中處於極小尺度（Sub-pixel 邊緣），深層特徵圖經過多次降採樣後語意幾何細節大量消散。
論文提出 **PRB-FPN (Parallel Residual Bi-Fusion Feature Pyramid Network)**，設計雙向並行特徵流：
$$\mathbf{F}_{\text{fused}}^{(l)} = \text{Conv}_{1 \times 1}\left(\text{Concat}\left(\mathbf{F}_{\text{lateral}}^{(l)}, \, \mathcal{U}(\mathbf{F}_{\text{top}}^{(l+1)}), \, \mathcal{D}(\mathbf{F}_{\text{bottom}}^{(l-1)})\right)\right) + \mathbf{F}_{\text{lateral}}^{(l)}$$
其中 $\mathcal{U}$ 為雙線性雙三次上採樣，$\mathcal{D}$ 為步長卷積下採樣。
搭配空間與通道混合注意力機制（Spatial & Channel Attention），在強烈逆光與夜間霓虹干擾下，對微小燈號的偵測精確率達到 98.4%。

---

### 7. 擴增實境 (AR) 與具身對話代理人系統 (*Electronics 2023*, Article 222)

在論文 *"Integrating Chatbot and Augmented Reality Technology into Biology Learning during COVID-19"* 中，開拓了**多模態對話代理人 (Conversational AI Agent) 與 3D 空間計算結合之前沿**：
- 整合自然語言對話狀態追蹤器 (Dialog State Tracker, DST) 與行動裝置端 Unity ARCore/ARKit。
- 使用者可透過語音與文字向 Chatbot 發問，Chatbot 理解語意後動態觸發 3D 虛擬物件之空間投影、自由視角剖面解剖與動態動畫，將抽象知識轉化為具身認知（Embodied Cognition）體驗。

---

## 三、⚙️ 計算機體系結構與硬體微架構映射

學術科研演算法的生命力取決於**硬體資源效率與工程落地可行性**：

### 1. 單卡 24GB 顯存約束與視角解耦 LoRA
- 在 3D 虛擬試穿任務中，若同時載入 3DGS 密集點雲、SMPL-X 骨架與大型擴散模型，顯存開銷常突破 48GB（需 A100/H100 等伺服器級 GPU）。
- 利用 LoRA 將可訓練參數量壓縮 99%（小於 10MB），並透過視角子集分批快取交換（Paged Swap），使整個訓練與推論在單張消費級 **NVIDIA RTX 3090/4090 (24GB)** 上即可全速運算。

### 2. 邊緣端嵌入式運算與即時性優化
- 在遙感農作偵測與號誌偵測中，硬體多部署於嵌入式邊緣設備（如 NVIDIA Jetson 或車載晶片）。
- 透過 PRB-FPN 雙向金字塔消除冗餘跨層連線，並採用 16-bit 浮點 Tensor Core 對齊（參見 [[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]），達成每秒 30+ FPS 之即時推論流。

---

## 四、💻 工業級工程實作：CA-Jaccard 距離重排序演算法

以下代碼為相機感知 Jaccard 行人再識別演算法之純 NumPy / PyTorch 向量化實作，可直接用於特徵檢索與驗證集後處理：

```python
import torch
import numpy as np

def compute_ca_jaccard_distance(
    features: torch.Tensor, 
    cam_ids: np.ndarray, 
    k1: int = 20, 
    k2: int = 6, 
    gamma: float = 0.3
) -> np.ndarray:
    """
    相機感知 Jaccard 距離重排序演算法 (CA-Jaccard Reranking)
    輸入:
      features: (N, D) 已做 L2-norm 之神經特徵向量
      cam_ids: (N,) 各樣本對應之攝影機 ID
      k1, k2: 倒數近鄰擴展超參數
      gamma: 同相機場景偏差懲罰係數
    輸出:
      final_distance: (N, N) 重排序後之對稱距離矩陣
    """
    N = features.size(0)
    # 1. 計算原始歐氏距離平方矩陣 D
    dist_matrix = 2.0 - 2.0 * torch.matmul(features, features.T)
    dist_matrix = torch.clamp(dist_matrix, min=0.0).cpu().numpy()
    
    # 2. 獲取初始近鄰排序
    initial_rank = np.argsort(dist_matrix, axis=1)
    
    # 3. 建立相機懲罰遮罩
    cam_match_mask = (cam_ids[:, None] == cam_ids[None, :])
    penalty_weights = np.where(cam_match_mask, 1.0 + gamma, 1.0)
    
    # 4. 構建 k-reciprocal 最近鄰特徵編碼
    fast_inv_ranks = np.zeros((N, N), dtype=np.float32)
    for i in range(N):
        forward_k = initial_rank[i, :k1 + 1]
        backward_k = initial_rank[forward_k, :k1 + 1]
        reciprocal_indices = forward_k[np.where(backward_k == i)[0]]
        
        expanded_reciprocal = set(reciprocal_indices)
        for cand in reciprocal_indices:
            cand_forward = initial_rank[cand, :int(np.around(k1 / 2)) + 1]
            cand_backward = initial_rank[cand_forward, :int(np.around(k1 / 2)) + 1]
            cand_reciprocal = cand_forward[np.where(cand_backward == cand)[0]]
            if len(cand_reciprocal) > 0 and len(set(cand_reciprocal).intersection(expanded_reciprocal)) > (2/3) * len(cand_reciprocal):
                expanded_reciprocal.update(cand_reciprocal)
                
        reciprocal_list = list(expanded_reciprocal)
        weights = np.exp(-dist_matrix[i, reciprocal_list] * penalty_weights[i, reciprocal_list])
        fast_inv_ranks[i, reciprocal_list] = weights / np.sum(weights)
        
    # 5. 計算 Jaccard 距離 (交集 / 聯集)
    inv_ranks_tensor = torch.from_numpy(fast_inv_ranks)
    intersection = torch.matmul(inv_ranks_tensor, inv_ranks_tensor.T)
    jaccard_dist = 1.0 - (intersection / (2.0 - intersection)).numpy()
    
    # 6. 凸組合融合
    final_distance = 0.5 * jaccard_dist + 0.5 * (dist_matrix / np.max(dist_matrix))
    return final_distance

if __name__ == "__main__":
    torch.manual_seed(42)
    sample_feats = torch.randn(100, 512)
    sample_feats = torch.nn.functional.normalize(sample_feats, p=2, dim=1)
    sample_cams = np.random.randint(0, 4, size=100)
    
    reranked_dist = compute_ca_jaccard_distance(sample_feats, sample_cams)
    print(f"重排序距離矩陣形狀: {reranked_dist.shape}")
    print(f"對角線自距離均值: {np.mean(np.diag(reranked_dist)):.6f}")
    assert np.all(np.diag(reranked_dist) < 0.1), "CA-Jaccard 距離計算異常！"
```

---

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

為使自主 AI Agent 在文獻研讀、演算法調用與系統架構設計中保持高標準，制定以下四大不變量合約：

### [RULE-904-01] 3DGS 視角解耦 LoRA 調度合約 (View-Decomposed LoRA Dispatch Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件**: 執行多視角 3D 虛擬試穿或多視角圖像編輯。
- **量化決策邊界**:
  - 嚴禁使用單一全域 LoRA 權重對所有相機視角進行端到端盲目微調。
  - 必須依據相機方位角 $\theta$，劃分至少 3 個視角子空間（正面 $[-45^\circ, 45^\circ]$、側面、背面 $[135^\circ, 225^\circ]$），並透過餘弦加權進行平滑切換。
- **執行保證**: 徹底消除衣物正面印花洩漏至人體背面的幾何偽影。

### [RULE-904-02] 3D 點雲空間填充曲線序列化合約 (Point Cloud Serialization Invariant)
- **合約等級**: `PERFORMANCE_CRITICAL`
- **前置條件**: 處理點數 $M > 10000$ 的 3D 點雲語意分割任務。
- **量化決策邊界**:
  - 嚴禁直接在未排序的無序點集上計算全域自注意力。
  - 必須強制使用 Hilbert 或 Morton (Z-order) 空間填充曲線將三維點轉換為一維排序，並以區段大小 $P \in \{32, 64\}$ 實施 Patch 內局部注意力。
- **執行保證**: 記憶體存取模式轉化為連續快取命中（Cache Hit），計算複雜度嚴格控制在 $\mathcal{O}(M \cdot P)$。

### [RULE-904-03] 遙感與交通微小目標網格切片合約 (Grid-Cropping TTA Invariant)
- **合約等級**: `BOUNDARY_GUARD`
- **前置條件**: 輸入高解析度空拍或路口監控影像（解析度大於 $1920 \times 1080$），且目標尺寸小於 $32 \times 32$ 像素。
- **量化決策邊界**:
  - 嚴禁直接將整張大圖等比例降採樣至 $640 \times 640$ 進入檢測器（此舉會使微小目標直接被低通濾波抹除，對齊 [[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]]）。
  - 必須執行 Testing Time Grid Cropping：以重疊率 20% 的滑動窗口切片為子圖分別偵測，最後使用 Mean-NMS 合併重疊框。
- **可執行斷言**:
  ```python
  def verify_small_object_pipeline(img_w, img_h, target_px, use_grid_cropping):
      if img_w >= 1920 and target_px < 32:
          assert use_grid_cropping, "超高畫質微小目標偵測必須強制啟用網格切片管線！"
  ```

### [RULE-904-04] 動態生物特徵差分融合防偽合約 (Frame-Difference Liveness Invariant)
- **合約等級**: `SAFETY_CRITICAL`
- **前置條件**: 唇紋或人臉生物特徵身分驗證。
- **量化決策邊界**:
  - 驗證管線中嚴禁僅依賴單張靜態照片或未經差分的序列影像（靜態序列易受照片播放攻擊，誤接受率 FAR 高達 84%）。
  - 必須強制計算相鄰訊框差分 $\Delta I_t = |I_{t} - I_{t-1}|$ 與關鍵點速度向量，並實施唇部特徵點與外觀影像雙模態融合，保證 HTER $\le 9.0\%$。

---

## 六、📚 權威期刊文獻與同行評審論文清單 (Canonical Publications & Academic Literature)

### 1. 深度學習工程專著 (Textbook)
1. 《深度學習－使用TensorFlow 2.x》. (2022). 臺北: 全華圖書. ISBN: 9786263282223.

### 2. 生物辨識與智慧交通期刊文獻 (Biometrics & Transportation)
2. Wang, C.-W., Kuo, C.-Y., & Chuang, C.-H. (2025). "Deep Learning Based Biometric Verification Using Dynamic Lip Features." *Journal of Information, Technology and Society*.
3. Yen, C.-P., Yang, C.-H., Chuang, C.-H., Lee, C.-C., & Fan, K.-C. (2022). "Vision-Based Technology for Illegal Parking Detection." *Journal of Image and Recognition*, 28(3), pp. 1-14.

### 3. 電腦視覺與多模態前沿期刊論文 (Computer Vision & Multimodal Literature)
4. Lee, Y.-F., Lee, C.-C., Chuang, C.-H., Lin, C.-L., & Fan, K.-C. (2026). "Adaptive Content and Style Fusion for Text-to-Image Generations." *Electronics*, 15(13), 2800. DOI: [10.3390/electronics15132800](https://doi.org/10.3390/electronics15132800).
5. Teng, C.-Y., Hsu, Y.-H., Chen, W.-H., Lin, C.-L., & Chuang, C.-H. (2026). "Point Cloud Semantic Segmentation Network Based on Serialized Attention." *Electronics*, 15(9), 1849. DOI: [10.3390/electronics15091849](https://doi.org/10.3390/electronics15091849).
6. Wang, C.-W., Huang, H.-K., Lin, T.-Y., Hu, H.-W., & Chuang, C.-H. (2025). "Splatting the Cat: Efficient Free-Viewpoint 3D Virtual Try-On via View-Decomposed LoRA and Gaussian Splatting." *Electronics*, 14(19), 3884. DOI: [10.3390/electronics14193884](https://doi.org/10.3390/electronics14193884).
7. Chuang, C.-H., Huang, T.-C., Wang, C.-W., Lo, J.-H., & Lin, C.-L. (2025). "Person Re-Identification Under Non-Overlapping Cameras Based on Advanced Contextual Embeddings." *Algorithms*, 18(11), 714. DOI: [10.3390/a18110714](https://doi.org/10.3390/a18110714).
8. Zhang, Y.-M., Chuang, C.-H., Lee, C.-C., & Fan, K.-C. (2024). "Using a Bunch Testing Time Augmentations to Detect Rice Plants Based on Aerial Photography." *Electronics*, 13(3), 632. DOI: [10.3390/electronics13030632](https://doi.org/10.3390/electronics13030632).
9. Chuang, C.-H., Lee, C.-C., Lo, J.-H., & Fan, K.-C. (2023). "Traffic Light Detection by Integrating Feature Fusion and Attention Mechanism." *Electronics*, 12(17), 3727. DOI: [10.3390/electronics12173727](https://doi.org/10.3390/electronics12173727).
10. Chuang, C.-H., Lo, J.-H., & Wu, Y.-K. (2023). "Integrating Chatbot and Augmented Reality Technology into Biology Learning during COVID-19." *Electronics*, 12(1), 222. DOI: [10.3390/electronics12010222](https://doi.org/10.3390/electronics12010222).
