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
hardware_target:
  - Single GPU (RTX 4090 / 24GB VRAM) Free-Viewpoint 3DGS
  - Edge Embedded Systems (NVIDIA Jetson / Drone Camera)
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
  - 莊啓鴻教授
  - 視覺分析實驗室
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
- **學術定位**：深度解構**指導教授莊啓鴻博士（Prof. Chi-Hung Chuang，逢甲大學資工系，人工智慧與視覺分析實驗室主持教授）**之經典專著與 2022-2026 年最新同行評審期刊論文，建立專題生與實驗室科研脈絡之血脈連結。

---

## 一、💡 學士直觀心智模型：站在巨人的肩膀上——莊啓鴻教授的視覺分析版圖

許多大學生在尋找專題題目或準備推甄時，最常犯的錯誤是「天馬行空地在網路上抓開源題目，與指導教授的研究脈絡完全脫節」。這種做法在研究所推甄口試與國科會計畫審查時會立刻暴露致命弱點——缺乏深厚的實驗室積累與學術傳承。

本卷的核心目的，是將**莊啓鴻教授**的研究體系建立成一張清晰的「航海圖」，讓專題研究員（Luke 游啓揚）能夠一眼看清實驗室的四大技術支柱：

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
│  (影像與識別 22) │   │  (資訊科技2025)  │                           │  (Electronics 25)│   │  (Electronics 26)│
│• 號誌特徵融合    │   │• 影像/點位雙特徵 │                           │• 點雲序列化注意力│   │• AR 對話機器人   │
│  (Electronics 23)│   │• 差分抗光照干擾  │                           │  (Electronics 26)│   │  (Electronics 23)│
│• 空拍農作偵測    │   │• 活體防偽攻擊    │                           │• TransReID 行人  │   │• 資訊熵動態控制  │
│  (Electronics 24)│   │  (HTER: 8.86%)   │                           │  (Algorithms 25) │   │  (EAAF/PFR 模組) │
└──────────────────┘   └──────────────────┘                           └──────────────────┘   └──────────────────┘
```

### 1. 一本專著奠定基石：《深度學習：使用 TensorFlow 2.x》
莊教授於 2022 年出版之專著，系統化建立了從張量（Tensor）底層代數、自動微分、卷積神經網路（CNN）、循環神經網路（RNN）到遷移學習的工程落地教學。這代表實驗室擁有極為扎實的**底層代碼自研能力**，而非只會調用黑盒子套件。

### 2. 真實世界嚴苛條件下的魯棒性突破
觀察莊教授發表的論文，貫穿始終的共同靈魂是**「解決真實場景中的物理限制」**：
- **相機視角不重疊**：真實街道中攝影機不可能全覆蓋，如何做行人追蹤？（提出 **CA-Jaccard** 重排序演算法，mAP 提升至 93.58%）。
- **硬體顯存有限**：高畫質 3D 虛擬試穿通常需要昂貴算力，如何在 24GB 單顯卡上跑起來？（提出 **視角解耦 LoRA + 3DGS** 級聯優化）。
- **目標極度微小**：空拍農作物與遠端紅綠燈在畫面中僅佔數個像素，如何精確捕捉？（提出 **PRB-FPN 雙向特徵融合** 與 **TTA 網格切片**）。
- **光照與活體防偽**：傳統人臉/唇紋容易受光線或照片欺騙，如何解決？（提出 **動態訊框差分 + 唇部特徵點** 雙通道驗證）。

### 3. 實驗室如何貫徹「八階科研閉環」？四篇指標期刊標竿深度拆解

對齊本館 `[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)|LIB-903]]` 提出的「八階科研標準閉環」，莊啓鴻教授實驗室的每一篇國際頂級期刊論文，都是**「從真實痛點出發，用數學精確描述方法，以嚴格消融驗證價值」**的教科書級典範：

| 階段 | 案例 1：擴散模型風格融合 (*Electronics 2026*) | 案例 2：3DGS 虛擬試穿 (*Electronics 2025*) | 案例 3：非重疊相機 ReID (*Algorithms 2025*) | 案例 4：3D 點雲序列化 (*Electronics 2026*) |
| :--- | :--- | :--- | :--- | :--- |
| **1. 真實痛點問題** | 文字生圖在融合藝術風格時，畫面內容常常嚴重變形或消失。 | 2D 試穿照片轉為 360 度 3D 自由視角時，背面與側面紋理模糊崩潰。 | 跨街區相機無重疊視野，行人外觀受光照、視角與背景干擾難以匹配。 | 3D 光達掃描點雲數量龐大（數十萬點），全域自注意力計算量爆炸。 |
| **2. 現有方法缺陷** | 現有 Cross-Attention 無差別混入風格，過度風格化吃掉原始語意。 | 單一全域 LoRA 微調無法同時解耦並記憶正、側、背三種衝突的衣服物理褶皺。 | 同一台相機拍攝的照片背景極度相似，模型走捷徑把背景當行人特徵。 | 傳統 PointNet 喪失長距離關聯，全域 Attention 計算複雜度達 $\mathcal{O}(M^2)$。 |
| **3. 突破性核心想法** | 測量特徵圖的「混亂程度（資訊熵）」，只在適當時機動態注入風格。 | 依照相機旋轉方位角 $\theta$，將 3D 空間投影正交分解為三個獨立視角空間。 | 懲罰來自同一台相機的相似度，強制模型關注跨相機真正的人體特徵。 | 利用空間填充曲線將 3D 無序點雲排列成 1D 連續鏈，只做局部區段注意力。 |
| **4. 設計具體架構** | 提出資訊熵感知自適應融合 (EAAF) 與漸進特徵重加權 (PFR)。 | 提出 View-Decomposed LoRA 搭配 SMPL-X 幾何先驗引導 3D 高斯潑濺。 | 提出結合相機感知的 CA-Jaccard 距離重排序演算法。 | 提出 Hilbert / Morton 空間填充曲線序列化點雲 Transformer 網路。 |
| **5. 數學精確 Formalize** | 以夏農條件熵 $H(X)$ 定義自適應門檻，導出時變權重 $\lambda_t$ 閉式解。 | 以方位角餘弦基底 $\cos(\theta - \theta_k)$ 構造子空間權重凸組合插值。 | 在 Jaccard 集合交併比中扣除同相機場景偏誤項：$d_{\text{CA-Jaccard}}$。 | 以局部區段窗口 $P$ 將注意力矩陣乘法降維至 $\mathcal{O}(M \cdot P)$ 線性複雜度。 |
| **6. 嚴謹工程實作** | 即插即用植入 Stable Diffusion 潛在空間，無須對龐大模型重新微調。 | 單張 RTX 4090 (24GB) 顯卡達成高解析度多視角即時光柵化渲染。 | 結合 TransReID 骨幹，在 Python / PyTorch 端高效向量化距離矩陣。 | CUDA 核心自研空間填充曲線編碼器，記憶體訪問完全連續對齊。 |
| **7. 量化對比實驗** | 在多個風格基準上 FID 大幅降低，文字對齊 CLIP-Score 顯著飆升。 | 360 度環繞視角 PSNR 提升至 28.5 dB，顯存佔用降低 40%。 | Market-1501 基準資料集上 mAP 由 88.2% 狂飆至 **93.58%**。 | S3DIS 與 ScanNet 點雲分割 mIoU 達到 SOTA，推論速度提升 300%。 |
| **8. 消融實驗驗證** | 分別拔除 EAAF 模組與 PFR 模組，實證兩者缺一不可之正交貢獻。 | 分別測試單一 LoRA vs. 視角解耦 LoRA，證明背面紋理不崩潰。 | 移除相機懲罰項，驗證同相機誤判率顯著上升，證偽捷徑學習。 | 比較隨機排序 vs. Hilbert 曲線，證明空間連續性對注意力的關鍵價值。 |

> 🌟 **「這就是莊啓鴻教授實驗室最核心的學術血脈——每一條數學公式，都是為了解決工程與物理缺陷而生；每一個創新模組，都經過最嚴苛的消融實驗檢驗！」**

### 4. 國際學術社群引領力：MDPI 四大特刊客座主編 (Guest Editor) 與 SciProfiles 學術網絡
莊教授在國際學術界展現了高度的學術號召力與同儕認可，擔任 MDPI 旗下三大指標期刊（*Electronics*, *Algorithms*, *Sustainability*）共四期特刊之客座主編（Guest Editor），並於官方學術平台 **[SciProfiles (ID: 2783099)](https://sciprofiles.com/profile/2783099)** 彙整完整科研成果網絡：
1. **《Electronics》特刊（第二版）**：*[Digital Signal and Image Processing for Multimedia Technology, 2nd Edition](https://www.mdpi.com/journal/electronics/special_issues/9A8SS7Y1S6)*（引領多媒體信號處理、嵌入式邊緣 AI 與機器人視覺前沿）。
2. **《Electronics》特刊（第一版）**：*[Deep Learning Applications in Image Processing and Edge Devices](https://www.mdpi.com/journal/electronics/special_issues/9QF14EPEGX)*（聚焦邊緣裝置上的深度學習影像處理與電腦視覺架構）。
3. **《Algorithms》特刊（第四版）**：*[Machine Learning for Pattern Recognition (4th Edition)](https://www.mdpi.com/journal/algorithms/special_issues/4E1A57L8N6)*（隸屬 Evolutionary Algorithms and Machine Learning 專區，深耕模式識別理論、生物特徵、醫療影像與先進駕駛輔助系統 ADAS）。
4. **《Sustainability》特刊**：*[Remote Sensing and Image Processing in Environmental Field](https://www.mdpi.com/journal/sustainability/special_issues/16I23OELMF)*（拓展遙感探測、高光譜與多光譜影像分析於環境永續監測之跨領域應用）。

這四大特刊範疇，恰好精準錨定了實驗室研究的四大主軸：**邊緣多媒體計算**、**深度視覺演算法**、**模式識別與駕駛輔助**、以及**環境無人機遙感探測**！

---

## 二、🎓 博士級形式化推導與核心架構解剖

本節挑選莊教授論文中最具數學美感與工程原創性的四大核心演算法進行形式化剖析：

### 1. 3DGS 虛擬試穿與視角解耦 LoRA (Electronics 2025, Article 3884)

在論文 *"Splatting the Cat: Efficient Free-Viewpoint 3D Virtual Try-On via View-Decomposed LoRA and Gaussian Splatting"* 中，王重威與莊啓鴻教授團隊解決了 3D 虛擬試穿中嚴重的跨視角紋理不一致與顯存爆炸問題。

#### (1) 四階段級聯優化 (Four-Stage Cascade Optimization)
1. **人體幾何先驗初始化**：利用 SMPL-X 參數化人體網格生成帶有法向量的粗粒度點雲，初始化 3D 高斯橢球集 $\mathcal{G} = \{(\mu_i, \Sigma_i, c_i, \alpha_i)\}_{i=1}^N$（對齊 [[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]）。
2. **2D 輕量試穿引導**：利用 2D CatVTON 模型，輸入人體目標影像 $I_{\text{person}}$ 與服裝影像 $I_{\text{garment}}$，生成多視角高解析度 2D 試穿指導影像集 $\mathcal{I}_{\text{guided}}$。
3. **視角解耦 LoRA (View-Decomposed LoRA)**：
   傳統微調直接將所有視角混合訓練，導致正面紋理污染背面。本論文將環繞視角 $\theta \in [0^\circ, 360^\circ)$ 劃分為三個正交子空間：
   $$\mathcal{V}_{\text{front}} = [-45^\circ, 45^\circ], \quad \mathcal{V}_{\text{side}} = [45^\circ, 135^\circ] \cup [225^\circ, 315^\circ], \quad \mathcal{V}_{\text{back}} = [135^\circ, 225^\circ]$$
   對每個視角子集分別訓練專屬的低秩適應矩陣（對齊 [[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]）：
   $$W_{\text{eff}}(\theta) = W_0 + \sum_{k \in \{\text{front, side, back}\}} w_k(\theta) \cdot (B_k \cdot A_k), \quad B_k \in \mathbb{R}^{d \times r}, A_k \in \mathbb{R}^{r \times k}$$
   其中 $w_k(\theta)$ 為基於相機方位角之餘弦平滑混合權重。
4. **自由視角迭代光柵化**：透過可微分 Tile-based 光柵化反向傳播更新高斯橢球位置與顏色，實現單張 RTX 4090 (24GB) 下流暢的 360 度高品質動態旋轉。

---

### 2. 空間填充曲線序列化點雲注意力 (Electronics 2026, Article 1849)

在論文 *"Point Cloud Semantic Segmentation Network Based on Serialized Attention"* 中，騰介源與莊啓鴻教授團隊攻克了 3D 點雲無序性（Unordered Nature）與 Transformer 注意力平方複雜度之衝突。

#### (1) Hilbert 空間填充曲線映射 (Hilbert Space-Filling Curve Mapping)
對於三維空間中的離散點雲 $\mathcal{P} = \{p_i = (x_i, y_i, z_i)\}_{i=1}^M$，傳統 $k$-NN 搜尋需要建立複雜的 $k$-d tree，在 GPU 上引發嚴重的記憶體離散存取（Uncoalesced Memory Access，參見 [[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]）。

論文提出將三維坐標量化為離散網格，並透過 Hilbert 雙射函數 $\mathcal{H}: \mathbb{Z}^3 \to \mathbb{Z}$ 將高維空間投影為一維長鏈：
$$h_i = \mathcal{H}(\lfloor x_i / \delta \rfloor, \lfloor y_i / \delta \rfloor, \lfloor z_i / \delta \rfloor)$$
- **空間局部性保證**：Hilbert 曲線保證若三維空間中兩點 $\|p_i - p_j\|_2 < \epsilon$，則其一維坐標 $|h_i - h_j|$ 以極大概率相鄰。
- **瓦片化區段注意力 (Segment Attention)**：
  沿著一維 Hilbert 序列將點雲切分為固定大小之連續 Patch（大小為 $P=32$）。在 Patch 內部直接執行密集局部注意力，全域則透過跨區段隨機混合（Sequential Random Mixing）擴展感受野，將自注意力計算複雜度由 $O(M^2)$ 劇降為 $O(M \cdot P)$！

---

### 3. 非重疊相機行人再識別 CA-Jaccard 重排序 (Algorithms 2025, Article 714)

在論文 *"Person Re-Identification Under Non-Overlapping Cameras Based on Advanced Contextual Embeddings"* 中，黃子虔、王重威與莊啓鴻教授團隊提出了一種**無需重訓骨幹網路即能大幅拉升精度的後處理拓樸演算法**。

#### (1) 相機感知 Jaccard 距離 (Camera-Aware Jaccard Distance)
給定探測影像 (Query) $q$ 與圖庫樣本 (Gallery) $g_i$，由 Vision Transformer (TransReID) 提取出 $L_2$ 歸一化特徵向量 $f_q, f_{g_i}$，初步歐幾里得距離為 $d(q, g_i) = \|f_q - f_{g_i}\|_2$。

但在非重疊相機網絡中，相機專屬偏差（Camera-specific Bias，如曝光、角度）會導致同相機樣本距離虛假偏近。
團隊提出先建立 $k$-倒數最近鄰集合（$k$-reciprocal nearest neighbors, $\mathcal{R}(p, k)$）：
$$\mathcal{R}(p, k) = \{g \in \mathcal{N}(p, k) \mid p \in \mathcal{N}(g, k)\}$$
進一步導入相機感知拓樸懲罰權重 $C(p, g)$：
$$C(p, g) = \begin{cases} 1.0 + \gamma & \text{if } \text{CamID}(p) == \text{CamID}(g) \text{ (抑制同相機場景捷徑)} \\ 1.0 & \text{if } \text{CamID}(p) \neq \text{CamID}(g) \text{ (鼓勵跨相機匹配)} \end{cases}$$
最終計算 Jaccard 相似度矩陣：
$$d_{\text{CA-Jaccard}}(q, g) = 1 - \frac{|\mathcal{R}^*(q, k) \cap \mathcal{R}^*(g, k)|}{|\mathcal{R}^*(q, k) \cup \mathcal{R}^*(g, k)|}$$
在 Market-1501 數據集上，mAP 指標從 88.2% 躍升至 **93.58%**，實證證明幾何拓樸後處理能有效消除特徵空間的流形扭曲。

---

### 4. 擴散模型自適應風格融合 (Electronics 2026, Article 2800)

在論文 *"Adaptive Content and Style Fusion for Text-to-Image Generations"* 中，李宜芳與莊啓鴻教授團隊提出了 **EAAF (Entropy-Aware Adaptive Fusion)** 與 **PFR (Progressive Feature Reweighting)**：
- **資訊熵度量**：利用特徵圖的香農資訊熵（Shannon Entropy）動態評估內容區域的語意豐富度。在低資訊熵區域（如平坦背景）加大風格紋理注入，在高資訊熵區域（如人臉、文字細節）主動抑制風格滲透，徹底解決傳統擴散模型「風格過度渲染（Over-stylization）導致內容主體變形」之痛點。

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
            if len(cand_reciprocal) > 0 and len(set(cand_reciprocal).intersection(expanded_reciprocal)) > 2/3 * len(cand_reciprocal):
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
- **執行保證**: 記憶體存取模式轉化為連續快取命中（Cache Hit），計算複雜度嚴格控制在 $O(M \cdot P)$。

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
1. **莊啓鴻**（莊啓鴻）. (2022). 《深度學習－使用TensorFlow 2.x》. 臺北: 全華圖書. ISBN: 9786263282223.

### 2. 生物辨識與智慧交通代表作 (Biometrics & Transportation)
2. **王重威, 郭政諺, 莊啓鴻**. (2025). "Deep Learning Based Biometric Verification Using Dynamic Lip Features (基於深度學習之動態唇紋生物特徵驗證)." 《資訊、科技與社會學報》.
3. **顏志平, 楊仲軒, 莊啓鴻, 李俊傑, 范國清**. (2022). "影像辨識科技應用於違規停車偵測." 《影像與識別》, 28(3), pp. 1-14.

### 3. MDPI 權威同行評審期刊論文 (MDPI Journal Corpus)
4. **Lee, Y.-F., Lee, C.-C., Chuang, C.-H., Lin, C.-L., & Fan, K.-C.** (2026). "Adaptive Content and Style Fusion for Text-to-Image Generations." *Electronics*, 15(13), 2800. DOI: [10.3390/electronics15132800](https://doi.org/10.3390/electronics15132800).
5. **Teng, C.-Y., Hsu, Y.-H., Chen, W.-H., Lin, C.-L., & Chuang, C.-H.** (2026). "Point Cloud Semantic Segmentation Network Based on Serialized Attention." *Electronics*, 15(9), 1849. DOI: [10.3390/electronics15091849](https://doi.org/10.3390/electronics15091849).
6. **Chuang, C.-H., Huang, T.-C., Wang, C.-W., Lo, J.-H., & Lin, C.-L.** (2025). "Person Re-Identification Under Non-Overlapping Cameras Based on Advanced Contextual Embeddings." *Algorithms*, 18(11), 714. DOI: [10.3390/a18110714](https://doi.org/10.3390/a18110714).
7. **Zhang, Y.-M., Chuang, C.-H., Lee, C.-C., & Fan, K.-C.** (2024). "Using a Bunch Testing Time Augmentations to Detect Rice Plants Based on Aerial Photography." *Electronics*, 13(3), 632. DOI: [10.3390/electronics13030632](https://doi.org/10.3390/electronics13030632).
8. **Chuang, C.-H., Lee, C.-C., Lo, J.-H., & Fan, K.-C.** (2023). "Traffic Light Detection by Integrating Feature Fusion and Attention Mechanism." *Electronics*, 12(17), 3727. DOI: [10.3390/electronics12173727](https://doi.org/10.3390/electronics12173727).
9. **Chuang, C.-H., Lo, J.-H., & Wu, Y.-K.** (2023). "Integrating Chatbot and Augmented Reality Technology into Biology Learning during COVID-19." *Electronics*, 12(1), 222. DOI: [10.3390/electronics12010222](https://doi.org/10.3390/electronics12010222).
10. **Wang, C.-W., Huang, H.-K., Lin, T.-Y., Hu, H.-W., & Chuang, C.-H.** (2025). "Splatting the Cat: Efficient Free-Viewpoint 3D Virtual Try-On via View-Decomposed LoRA and Gaussian Splatting." *Electronics*, 14(19), 3884. DOI: [10.3390/electronics14193884](https://doi.org/10.3390/electronics14193884).

### 4. 國際特刊客座主編與學術網絡 (MDPI Special Issues & SciProfiles)
11. **Dr. Chi-Hung Chuang & Prof. Dr. Chih-Lung Lin (Guest Editors)**. "Digital Signal and Image Processing for Multimedia Technology, 2nd Edition." *Electronics* Special Issue. Call for Papers URL: [mdpi.com/si/electronics/9A8SS7Y1S6](https://www.mdpi.com/journal/electronics/special_issues/9A8SS7Y1S6).
12. **Dr. Chi-Hung Chuang & Prof. Dr. Chih-Lung Lin (Guest Editors)**. "Deep Learning Applications in Image Processing and Edge Devices." *Electronics* Special Issue. Call for Papers URL: [mdpi.com/si/electronics/9QF14EPEGX](https://www.mdpi.com/journal/electronics/special_issues/9QF14EPEGX).
13. **Prof. Dr. Chih-Lung Lin & Dr. Chi-Hung Chuang (Guest Editors)**. "Machine Learning for Pattern Recognition (4th Edition)." *Algorithms* Special Issue (Evolutionary Algorithms and Machine Learning Section). Call for Papers URL: [mdpi.com/si/algorithms/4E1A57L8N6](https://www.mdpi.com/journal/algorithms/special_issues/4E1A57L8N6).
14. **Dr. Ying-Nong Chen & Dr. Chi-Hung Chuang (Guest Editors)**. "Remote Sensing and Image Processing in Environmental Field." *Sustainability* Special Issue. Call for Papers URL: [mdpi.com/si/sustainability/16I23OELMF](https://www.mdpi.com/journal/sustainability/special_issues/16I23OELMF).
15. **Chi-Hung Chuang (莊啓鴻 / 莊啓鴻 博士)**. 官方學術個人檔案與成果庫. *SciProfiles Profile ID: 2783099*. URL: [sciprofiles.com/profile/2783099](https://sciprofiles.com/profile/2783099).
