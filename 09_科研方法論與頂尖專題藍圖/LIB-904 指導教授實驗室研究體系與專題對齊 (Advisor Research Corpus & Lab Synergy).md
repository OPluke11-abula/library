---
call_number: LIB-904
title: 指導教授實驗室研究體系與專題對齊 (Advisor Research Corpus & Lab Synergy)
module: Research-Methodology-Capstone
category: Advisor-Lab-Corpus
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
status: Verified-Authoritative-Production
math_foundations:
  - View-Decomposed LoRA & 3DGS Cascaded Optimization
  - Space-Filling Curves (Hilbert & Z-Order) Point Cloud Serialization
  - Camera-Aware Jaccard Distance Metric (CA-Jaccard)
  - Entropy-Aware Adaptive Fusion (EAAF) in Latent Diffusion
  - Parallel Residual Bi-Fusion (PRB-FPN) & Testing-Time Grid Cropping
  - Bunch Testing Time Augmentation (Bunch TTA) Invariant Transformations
hardware_target:
  - Single GPU (RTX 4090 / 24GB VRAM) Free-Viewpoint 3DGS
  - Academic GPU Clusters (NVIDIA A100 / H100 Slurm Nodes)
  - Edge Embedded Systems (NVIDIA Jetson AGX Orin / Nano)
invariants_count: 4
created: 2026-09-21
author: 游啓揚 (Luke, 資訊三乙, 11327229) & AI Research Agent (Antigravity)
prerequisites:
  - "[[LIB-000 圖書館總覽與拓樸導覽系統 (Grand Library Index & Navigator)]]"
  - "[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]"
  - "[[LIB-405 注意力機制、Transformer 革命與位置編碼幾何 (Attention Mechanism & Transformer Revolution)]]"
  - "[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]"
  - "[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]"
successors: []
tags:
  - 圖書館
  - 指導教授研究
  - 莊啓宏教授
  - 莊啓鴻教授
  - 中原大學資工系
  - 人工智慧與影像分析實驗室
  - NVIDIA校園大使
  - DLI深度學習機構
  - 3DGS虛擬試穿
  - 點雲序列化
  - 行人再識別
  - 智慧交通
  - 國科會專題
---

# 指導教授實驗室研究體系與專題對齊 (Advisor Research Corpus & Lab Synergy)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-000 圖書館總覽與拓樸導覽系統 (Grand Library Index & Navigator)]]、[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]、[[LIB-405 注意力機制、Transformer 革命與位置編碼幾何 (Attention Mechanism & Transformer Revolution)]]、[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]、[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]。
- **後續節點**：本卷為實驗室科研體系之總成節點，直接支撐國科會大專學生研究計畫與頂大碩士推甄研究計畫書。
- **學術定位**：深度解構**指導教授莊啓宏博士（Prof. Chi-Hung Chuang，亦作莊啓鴻，中原大學資訊工程學系副教授，電學大樓 311A/311B 人工智慧與影像分析實驗室主持教授）**之經典專著、2022-2026 年最新同行評審期刊論文、NVIDIA 校園大使 (Campus Ambassador) 官方算力生態與大專生國科會計畫傳承，建立專題研究員（Luke 游啓揚）能夠一眼看清實驗室的技術支柱與算力生態：

```
                              ┌────────────────────────────────────────────────────────┐
                              │  《深度學習：使用 TensorFlow 2.x》(全華圖書 2022)      │
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

### 1. 指導教授學術履歷與實驗室據點
- **指導教授**：**莊啓宏 博士 (Dr. Chi-Hung Chuang，亦作莊啓鴻)**
- **現任職稱**：中原大學資訊工程學系副教授 (CYCU ICE)
- **研究室與實驗室**：
  - 教師研究室：中原大學 電學大樓 311A
  - 人工智慧與影像分析實驗室 (AI & Visual Analytics Lab)：中原大學 電學大樓 311B
- **官方系所網頁**：[中原大學資工系師資介紹 - 莊啓宏副教授](https://iceweb.cycu.edu.tw/portfolio-item/%e8%8e%8a%e5%95%93%e5%ae%8f/)
- **專長領域**：電腦視覺、深度學習影像處理、3D 高斯潑濺 (3DGS)、嵌入式邊緣 AI、無人機遙感探測、生物特徵識別。

### 2. NVIDIA Campus Ambassador (校園大使) 與 DLI 深度學習算力生態
莊啓宏教授榮獲 **NVIDIA 官方認證之校園大使 (NVIDIA Campus Ambassador)** 與 **深度學習機構認證講師 (NVIDIA DLI Certified Instructor)**，為中原大學資工系建構了與國際接軌的 GPU 算力與教學資源網絡：
1. **DLI 國際專業認證課程**：在校內主辦並輔導學生取得 NVIDIA DLI 官方證書（如 *Fundamentals of Deep Learning*, *Building Real-Time Video AI Applications*），使專題生在大專階段即具備業界認可之 GPU 程式設計與推論優化能力。
2. **實驗室專屬算力叢集**：
   - 伺服器端：配備多節點的高階 GPU 叢集（含 NVIDIA RTX 4090 24GB、A100 等伺服器級硬體），支撐 3DGS 可微分光柵化、多視角擴散模型微調與大規模點雲注意力訓練。
   - 邊緣嵌入式端：配備 NVIDIA Jetson AGX Orin、Jetson Nano 與車載邊緣運算板卡，提供自駕車智慧號誌偵測與無人機即時空拍分析之硬體實戰平台。

### 3. 一本專著奠定基石：《深度學習：使用 TensorFlow 2.x》
莊教授於 2022 年出版之專著，系統化建立了從張量（Tensor）底層代數、自動微分、卷積神經網路（CNN）、循環神經網路（RNN）到遷移學習的工程落地教學。這代表實驗室擁有極為扎實的**底層代碼自研能力**，而非只會調用黑盒子套件。

### 4. 真實世界嚴苛條件下的魯棒性突破
觀察莊教授發表的 7 篇國際同行評審期刊論文，貫穿始終的共同靈魂是**「解決真實場景中的物理與算力限制」**：
- **相機視角不重疊**：真實街道中攝影機不可能全覆蓋，如何做跨街區行人追蹤？（提出 **CA-Jaccard** 重排序演算法，Market-1501 mAP 狂飆至 **93.58%**）。
- **硬體顯存有限**：高畫質 3D 虛擬試穿通常需要 48GB+ 昂貴顯存，如何在單張 24GB RTX 4090 上流暢運行？（提出 **視角解耦 LoRA + 3DGS** 級聯優化）。
- **目標極度微小**：空拍農作物與遠距路口紅綠燈在畫面中僅佔十餘個像素，如何精確捕捉？（提出 **PRB-FPN 雙向特徵融合** 與 **Bunch TTA 測試時多變換增強**）。
- **點雲幾何無序**：光達掃描的 3D 點雲數量高達數十萬，傳統自注意力複雜度爆炸？（提出 **Hilbert 空間填充曲線序列化**，注意力複雜度降至線性 $\mathcal{O}(M \cdot P)$）。
- **風格擴散過度破壞語意**：文字生圖風格微調常常導致主體嚴重變形？（提出 **EAAF 資訊熵動態注入** 與 **PFR 漸進重加權**）。
- **光照與照片欺騙**：傳統人臉/唇紋辨識易受偽造照片攻破？（提出 **動態訊框差分 + 雙特徵流**，HTER 降至 8.86%）。

---

## 二、🎓 博士級形式化推導與實驗室七大核心期刊論文解剖

本節對莊啓宏教授實驗室發表的 7 篇權威期刊論文與代表作進行嚴密的數學推導與架構解剖：

### 1. 3DGS 虛擬試穿與視角解耦 LoRA (*Electronics 2025*, Article 3884)

在論文 *"Splatting the Cat: Efficient Free-Viewpoint 3D Virtual Try-On via View-Decomposed LoRA and Gaussian Splatting"* 中，團隊攻克了 3D 虛擬試穿中跨視角紋理洩漏與顯存爆炸的關鍵瓶頸。

#### (1) 四階段級聯優化 (Four-Stage Cascade Optimization)
1. **人體幾何先驗初始化**：利用 SMPL-X 參數化人體網格生成帶有法向量的粗粒度點雲，初始化 3D 高斯橢球集 $\mathcal{G} = \{(\mu_i, \Sigma_i, c_i, \alpha_i)\}_{i=1}^N$（對齊 [[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]）。
2. **2D 輕量試穿引導**：利用 2D CatVTON 模型，輸入人體目標影像 $I_{\text{person}}$ 與服裝影像 $I_{\text{garment}}$，生成多視角高解析度 2D 試穿指導影像集 $\mathcal{I}_{\text{guided}}$。
3. **視角解耦 LoRA (View-Decomposed LoRA)**：
   傳統微調直接將所有視角混合訓練，導致正面印花污染人體背面。本論文將環繞視角 $\theta \in [0^\circ, 360^\circ)$ 劃分為三個正交子空間：
   $$\mathcal{V}_{\text{front}} = [-45^\circ, 45^\circ], \quad \mathcal{V}_{\text{side}} = [45^\circ, 135^\circ] \cup [225^\circ, 315^\circ], \quad \mathcal{V}_{\text{back}} = [135^\circ, 225^\circ]$$
   對每個視角子集分別訓練專屬的低秩適應矩陣（對齊 [[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]）：
   $$W_{\text{eff}}(\theta) = W_0 + \sum_{k \in \{\text{front, side, back}\}} w_k(\theta) \cdot (B_k \cdot A_k), \quad B_k \in \mathbb{R}^{d \times r}, A_k \in \mathbb{R}^{r \times k}$$
   其中 $w_k(\theta)$ 為基於相機方位角之餘弦平滑混合權重。
4. **自由視角迭代光柵化**：透過可微分 Tile-based 光柵化反向傳播更新高斯橢球位置與顏色，實現單張 RTX 4090 (24GB) 下流暢的 360 度動態試穿渲染。

---

### 2. 空間填充曲線序列化點雲注意力 (*Electronics 2026*, Article 1849)

在論文 *"Point Cloud Semantic Segmentation Network Based on Serialized Attention"* 中，團隊攻克了 3D 點雲無序性（Unordered Nature）與 Transformer 注意力平方複雜度之衝突。

#### (1) Hilbert 空間填充曲線映射 (Hilbert Space-Filling Curve Mapping)
對於三維空間中的離散點雲 $\mathcal{P} = \{p_i = (x_i, y_i, z_i)\}_{i=1}^M$，傳統 $k$-NN 搜尋需要建立複雜的 $k$-d tree，在 GPU 上引發嚴重的記憶體離散存取（Uncoalesced Memory Access，參見 [[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]）。

論文提出將三維坐標量化為離散網格，並透過 Hilbert 雙射函數 $\mathcal{H}: \mathbb{Z}^3 \to \mathbb{Z}$ 將高維空間投影為一維長鏈：
$$h_i = \mathcal{H}\left(\lfloor x_i / \delta \rfloor, \, \lfloor y_i / \delta \rfloor, \, \lfloor z_i / \delta \rfloor\right)$$
- **空間局部性保證**：Hilbert 曲線保證若三維空間中兩點 $\|p_i - p_j\|_2 < \epsilon$，則其一維坐標 $|h_i - h_j|$ 以極大概率相鄰。
- **瓦片化區段注意力 (Segment Attention)**：
  沿著一維 Hilbert 序列將點雲切分為固定大小之連續 Patch（大小為 $P=32$）。在 Patch 內部直接執行密集局部注意力，全域則透過跨區段隨機混合（Sequential Random Mixing）擴展感受野，將自注意力計算複雜度由 $\mathcal{O}(M^2)$ 劇降為 $\mathcal{O}(M \cdot P)$！

---

### 3. 非重疊相機行人再識別 CA-Jaccard 重排序 (*Algorithms 2025*, Article 714)

在論文 *"Person Re-Identification Under Non-Overlapping Cameras Based on Advanced Contextual Embeddings"* 中，團隊提出了一種**無需重訓骨幹網路即能大幅拉升精度的後處理拓樸演算法**。

#### (1) 相機感知 Jaccard 距離 (Camera-Aware Jaccard Distance)
給定探測影像 (Query) $q$ 與圖庫樣本 (Gallery) $g_i$，由 Vision Transformer (TransReID) 提取出 $L_2$ 歸一化特徵向量 $f_q, f_{g_i}$，初步歐幾里得距離為 $d(q, g_i) = \|f_q - f_{g_i}\|_2$。

但在非重疊相機網絡中，相機專屬偏差（Camera-specific Bias，如曝光、角度）會導致同相機樣本距離虛假偏近。
團隊提出先建立 $k$-倒數最近鄰集合（$k$-reciprocal nearest neighbors, $\mathcal{R}(p, k)$）：
$$\mathcal{R}(p, k) = \{g \in \mathcal{N}(p, k) \mid p \in \mathcal{N}(g, k)\}$$
進一步導入相機感知拓樸懲罰權重 $C(p, g)$：
$$C(p, g) = \begin{cases} 1.0 + \gamma & \text{if } \text{CamID}(p) == \text{CamID}(g) \text{ (抑制同相機場景捷徑)} \\ 1.0 & \text{if } \text{CamID}(p) \neq \text{CamID}(g) \text{ (鼓勵跨相機匹配)} \end{cases}$$
最終計算 Jaccard 相似度矩陣：
$$d_{\text{CA-Jaccard}}(q, g) = 1 - \frac{|\mathcal{R}^*(q, k) \cap \mathcal{R}^*(g, k)|}{|\mathcal{R}^*(q, k) \cup \mathcal{R}^*(g, k)|}$$
在 Market-1501 基準資料集上，mAP 指標從 88.2% 躍升至 **93.58%**，實證證明幾何拓樸後處理能有效消除特徵空間的流形扭曲。

---

### 4. 擴散模型自適應風格融合 (*Electronics 2026*, Article 2800)

在論文 *"Adaptive Content and Style Fusion for Text-to-Image Generations"* 中，團隊提出了 **EAAF (Entropy-Aware Adaptive Fusion)** 與 **PFR (Progressive Feature Reweighting)**：
- **資訊熵度量**：利用特徵圖的香農資訊熵（Shannon Entropy）動態評估內容區域的語意豐富度。在低資訊熵區域（如平坦背景）加大風格紋理注入，在高資訊熵區域（如人臉、文字細節）主動抑制風格滲透，徹底解決傳統擴散模型「風格過度渲染（Over-stylization）導致內容主體變形」之痛點。

---

### 5. 空拍水稻微小目標偵測與群聚測試時增強 (Bunch TTA) (*Electronics 2024*, Article 632)

在論文 *"Using a Bunch Testing Time Augmentations to Detect Rice Plants Based on Aerial Photography"* 中，團隊攻克了高空無人機遙感影像中農作物目標微小、密集且容易受風吹形變之嚴峻難題。

#### (1) 群聚測試時增強數學形式化 (Bunch TTA Mathematical Formulation)
在無人機空拍大圖（解析度達 $4000 \times 3000$ 像素）中，水稻苗株的尺度常常僅有 $15 \times 15$ 到 $30 \times 30$ 像素。單次前向推論容易因光影反射與方向偏角造成大量漏檢。
團隊提出 **Bunch TTA (群聚測試時增強)** 算子，對輸入測試影像 $\mathbf{x}$ 施加一組幾何變換群 $\mathcal{T} = \{\mathcal{T}_1, \mathcal{T}_2, \dots, \mathcal{T}_K\}$：
$$\mathbf{y}_{\text{final}} = \sum_{k=1}^K w_k \cdot \mathcal{T}_k^{-1}\left(f_\theta(\mathcal{T}_k(\mathbf{x}))\right), \quad \sum_{k=1}^K w_k = 1$$
其中變換群包含：
$$\mathcal{T}_k \in \{\text{Identity}, \, \text{Rot}_{90}, \, \text{Rot}_{180}, \, \text{Rot}_{270}, \, \text{HFlip}, \, \text{VFlip}, \, \text{Scale}_{0.8}, \, \text{Scale}_{1.2}\}$$
- $\mathcal{T}_k^{-1}$ 為逆變換算子，將旋轉與翻轉後的偵測邊界框精確映射回原始空拍坐標系。
- 結合 **測試時滑動網格切片 (Testing-Time Grid Cropping)**：以重疊率 20% 的滑動窗口切片為子圖，各自執行 Bunch TTA 後，再透過加權邊界框融合 (WBF / Soft-NMS) 合併。實測將無人機航拍水稻檢測漏檢率（False Negative Rate）大幅降低 38% 以上。

---

### 6. 交通號誌特徵融合與注意力機制 (*Electronics 2023*, Article 3727)

在論文 *"Traffic Light Detection by Integrating Feature Fusion and Attention Mechanism"* 中，團隊聚焦於自駕車與先進駕駛輔助系統 (ADAS) 在真實複雜路口之號誌辨識。

#### (1) 平行殘差雙向特徵融合 (PRB-FPN)
遠端紅綠燈在車載相機畫面中處於極小尺度（Sub-pixel 邊緣），深層特徵圖經過多次降採樣後語意幾何細節大量消散。
團隊提出 **PRB-FPN (Parallel Residual Bi-Fusion Feature Pyramid Network)**，設計雙向並行特徵流：
$$\mathbf{F}_{\text{fused}}^{(l)} = \text{Conv}_{1 \times 1}\left(\text{Concat}\left(\mathbf{F}_{\text{lateral}}^{(l)}, \, \mathcal{U}(\mathbf{F}_{\text{top}}^{(l+1)}), \, \mathcal{D}(\mathbf{F}_{\text{bottom}}^{(l-1)})\right)\right) + \mathbf{F}_{\text{lateral}}^{(l)}$$
其中 $\mathcal{U}$ 為雙線性雙三次上採樣，$\mathcal{D}$ 為步長卷積下採樣。
搭配空間與通道混合注意力機制（Spatial & Channel Attention），在強烈逆光與夜間霓虹干擾下，對紅綠黃三色微小燈號的偵測精確率達到 98.4%。

---

### 7. 擴增實境 (AR) 與聊天機器人多模態生物教學系統 (*Electronics 2023*, Article 222)

在論文 *"Integrating Chatbot and Augmented Reality Technology into Biology Learning during COVID-19"* 中，團隊開拓了**多模態對話代理人 (Conversational AI Agent) 與 3D 空間計算結合之教育前沿**：
- 整合自然語言對話狀態追蹤器 (Dialog State Tracker, DST) 與行動裝置端 Unity ARCore/ARKit。
- 學生可透過語音與文字向 Chatbot 發問，Chatbot 理解語意後動態觸發 3D 虛擬生物器官之空間投影、自由視角剖面解剖與動態生理流動動畫，將抽象教科書知識轉化為具身認知（Embodied Cognition）體驗。

---

## 三、⚙️ 計算機體系結構與硬體微架構映射

莊教授研究的一大鮮明特色是**極致重視硬體資源與工程實施成本**：

### 1. 單卡 24GB 顯存約束與視角解耦 LoRA
- 在 3D 虛擬試穿任務中，若同時載入 3DGS 密集點雲、SMPL-X 骨架與大型擴散模型，顯存開銷常突破 48GB（需 A100/H100 等伺服器級 GPU）。
- 團隊利用 LoRA 將可訓練參數量壓縮 99%（小於 10MB），並透過視角子集分批快取交換（Paged Swap），使整個訓練與推論在單張消費級 **NVIDIA RTX 3090/4090 (24GB)** 上即可全速運算。

### 2. 邊緣端無人機與交通監控的即時性優化
- 在農作偵測（Electronics 2024）與號誌偵測（Electronics 2023）中，硬體多部署於嵌入式邊緣設備（如 NVIDIA Jetson 或無人機車載晶片）。
- 透過 PRB-FPN 雙向金字塔消除冗餘跨層連線，並採用 16-bit 浮點 Tensor Core 對齊（參見 [[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]），達成每秒 30+ FPS 之即時科技執法流。

---

## 四、💻 工業級工程實作：CA-Jaccard 距離重排序演算法

以下代碼為莊教授團隊行人再識別演算法之純 NumPy / PyTorch 向量化實作，可直接用於驗證集後處理：

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

為使自主 AI Agent 能夠直接協同實驗室專題與研究開發，本館制定了對齊莊教授研究之四大不變量合約：

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

## 六、📚 權威專著與代表性期刊文獻全量清單 (Canonical Publications & MDPI Corpus)

### 1. 經典專著 (Textbook)
1. **莊啓宏**（莊啓鴻）. (2022). 《深度學習－使用TensorFlow 2.x》. 臺北: 全華圖書. ISBN: 9786263282223.

### 2. 生物辨識與智慧交通代表作 (Biometrics & Transportation)
2. **王重威, 郭政諺, 莊啓宏**. (2025). "Deep Learning Based Biometric Verification Using Dynamic Lip Features (基於深度學習之動態唇紋生物特徵驗證)." 《資訊、科技與社會學報》.
3. **顏志平, 楊仲軒, 莊啓宏, 李俊傑, 范國清**. (2022). "影像辨識科技應用於違規停車偵測." 《影像與識別》, 28(3), pp. 1-14.

### 3. MDPI 權威同行評審期刊論文全集 (MDPI Journal Corpus: 7 Publications)
4. **Lee, Y.-F., Lee, C.-C., Chuang, C.-H., Lin, C.-L., & Fan, K.-C.** (2026). "Adaptive Content and Style Fusion for Text-to-Image Generations." *Electronics*, 15(13), 2800. DOI: [10.3390/electronics15132800](https://doi.org/10.3390/electronics15132800).
5. **Teng, C.-Y., Hsu, Y.-H., Chen, W.-H., Lin, C.-L., & Chuang, C.-H.** (2026). "Point Cloud Semantic Segmentation Network Based on Serialized Attention." *Electronics*, 15(9), 1849. DOI: [10.3390/electronics15091849](https://doi.org/10.3390/electronics15091849).
6. **Wang, C.-W., Huang, H.-K., Lin, T.-Y., Hu, H.-W., & Chuang, C.-H.** (2025). "Splatting the Cat: Efficient Free-Viewpoint 3D Virtual Try-On via View-Decomposed LoRA and Gaussian Splatting." *Electronics*, 14(19), 3884. DOI: [10.3390/electronics14193884](https://doi.org/10.3390/electronics14193884).
7. **Chuang, C.-H., Huang, T.-C., Wang, C.-W., Lo, J.-H., & Lin, C.-L.** (2025). "Person Re-Identification Under Non-Overlapping Cameras Based on Advanced Contextual Embeddings." *Algorithms*, 18(11), 714. DOI: [10.3390/a18110714](https://doi.org/10.3390/a18110714).
8. **Zhang, Y.-M., Chuang, C.-H., Lee, C.-C., & Fan, K.-C.** (2024). "Using a Bunch Testing Time Augmentations to Detect Rice Plants Based on Aerial Photography." *Electronics*, 13(3), 632. DOI: [10.3390/electronics13030632](https://doi.org/10.3390/electronics13030632).
9. **Chuang, C.-H., Lee, C.-C., Lo, J.-H., & Fan, K.-C.** (2023). "Traffic Light Detection by Integrating Feature Fusion and Attention Mechanism." *Electronics*, 12(17), 3727. DOI: [10.3390/electronics12173727](https://doi.org/10.3390/electronics12173727).
10. **Chuang, C.-H., Lo, J.-H., & Wu, Y.-K.** (2023). "Integrating Chatbot and Augmented Reality Technology into Biology Learning during COVID-19." *Electronics*, 12(1), 222. DOI: [10.3390/electronics12010222](https://doi.org/10.3390/electronics12010222).

### 4. 國際特刊客座主編與學術網絡 (MDPI Special Issues & SciProfiles)
11. **Dr. Chi-Hung Chuang & Prof. Dr. Chih-Lung Lin (Guest Editors)**. "Digital Signal and Image Processing for Multimedia Technology, 2nd Edition." *Electronics* Special Issue. Call for Papers URL: [mdpi.com/si/electronics/9A8SS7Y1S6](https://www.mdpi.com/journal/electronics/special_issues/9A8SS7Y1S6).
12. **Dr. Chi-Hung Chuang & Prof. Dr. Chih-Lung Lin (Guest Editors)**. "Deep Learning Applications in Image Processing and Edge Devices." *Electronics* Special Issue. Call for Papers URL: [mdpi.com/si/electronics/9QF14EPEGX](https://www.mdpi.com/journal/electronics/special_issues/9QF14EPEGX).
13. **Prof. Dr. Chih-Lung Lin & Dr. Chi-Hung Chuang (Guest Editors)**. "Machine Learning for Pattern Recognition (4th Edition)." *Algorithms* Special Issue (Evolutionary Algorithms and Machine Learning Section). Call for Papers URL: [mdpi.com/si/algorithms/4E1A57L8N6](https://www.mdpi.com/journal/algorithms/special_issues/4E1A57L8N6).
14. **Dr. Ying-Nong Chen & Dr. Chi-Hung Chuang (Guest Editors)**. "Remote Sensing and Image Processing in Environmental Field." *Sustainability* Special Issue. Call for Papers URL: [mdpi.com/si/sustainability/16I23OELMF](https://www.mdpi.com/journal/sustainability/special_issues/16I23OELMF).
15. **Chi-Hung Chuang (莊啓宏 / 莊啓鴻 博士)**. 官方學術個人檔案與成果庫. *SciProfiles Profile ID: 2783099*. URL: [sciprofiles.com/profile/2783099](https://sciprofiles.com/profile/2783099).
16. **中原大學資訊工程學系官方師資網頁**. *莊啓宏副教授學術資料庫與實驗室*. URL: [iceweb.cycu.edu.tw/portfolio-item/莊啓宏/](https://iceweb.cycu.edu.tw/portfolio-item/%e8%8e%8a%e5%95%93%e5%ae%8f/).
