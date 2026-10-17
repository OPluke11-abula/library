---
call_number: LIB-502
status: source-verified
invariants_count: 3
title: 相機射影幾何、對極幾何與運動結構恢復 (Camera Projective Geometry, Epipolar Geometry & Structure-from-Motion)
module: Multi-View-Geometry
category: 3D-Computer-Vision
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Projective Space P^3 & Pinhole Camera Intrinsic/Extrinsic Calibration
  - Epipolar Geometry, Essential Matrix E & Fundamental Matrix F
  - Hartley Isotropic Normalization & Rank-2 SVD Manifold Projection
  - Bundle Adjustment & Schur Complement Sparse Linear Solver
hardware_target:
  - GPU Batched SVD & Block-Diagonal Schur Complement Kernels
  - CUDA Warp-Parallel Reprojection & Jacobian Evaluation
created: 2026-10-17
author: Luke
tags:
  - 圖書館
  - 計算機視覺
  - 多視角幾何
  - 相機標定
  - 對極幾何
  - 本質矩陣
  - 基礎矩陣
  - COLMAP
  - 運動結構恢復
prerequisites:
  - "[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]"
  - "[[LIB-104 凸最佳化理論與一階二階梯度下降幾何 (Optimization Theory & Gradient Descent)]]"
  - "[[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]]"
successors:
  - "[[LIB-408 情境感知擴散物件生成、幾何光照分析與無縫影像融合 (Context-Aware Object Generation, Illumination Estimation & Image Compositing)]]"
  - "[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]"
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/05_computer_vision/LIB-502%20Camera%20Projective%20Geometry,%20Epipolar%20Geometry%20%26%20Structure-from-Motion%20%28Agent%20EN%29.md)

# 相機射影幾何、對極幾何與運動結構恢復 (Camera Projective Geometry, Epipolar Geometry & Structure-from-Motion)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]、[[LIB-104 凸最佳化理論與一階二階梯度下降幾何 (Optimization Theory & Gradient Descent)]]、[[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]]。
- **後續節點**：[[LIB-408 情境感知擴散物件生成、幾何光照分析與無縫影像融合 (Context-Aware Object Generation, Illumination Estimation & Image Compositing)]]、[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]。
- **核心定位**：從 2D 數位影像前處理（LIB-501）邁向 3D 高斯潑濺（LIB-504）與三維空間透視合成（LIB-408），中間絕非一步登天，而是必須跨越**「3D 世界如何壓扁成 2D 像素，以及如何從多張 2D 照片反推 3D 相機位姿與稀疏點雲」**的射影幾何橋樑。無論是 NeRF 還是 3DGS，其訓練起點都完全依賴 **COLMAP 運動結構恢復（Structure-from-Motion, SfM）** 解出的相機內外參矩陣 $\mathbf{K}[\mathbf{R}\mid\mathbf{t}]$ 與初始稀疏點雲。本卷從射影空間 $\mathbb{P}^3$ 第一性原理出發，完整貫通針孔相機模型、透視投影雅可比矩陣 $\mathbf{J}$、對極幾何八點法與光束法平差（Bundle Adjustment）。

---

## 一、💡 學士直觀心智模型：從「針孔暗箱」到「兩隻眼睛的三角測量與偵探拼圖」

為什麼看一張照片時，遠處的高樓看起來跟近處的鉛筆一樣高？為什麼人類閉上一隻眼睛就很難接住飛過來的棒球，而睜開兩隻眼睛就能瞬間判斷距離？

### 1. 透視除法（Perspective Division）：深度 $Z_c$ 是被壓扁的第三維度
針孔相機（Pinhole Camera）就像一個只有一個小孔的黑盒子。3D 空間中的一個點 $\mathbf{X}_c = (X_c, Y_c, Z_c)^\top$ 發出光線穿過小孔投射到距離為焦距 $f$ 的感光元件上，根據國中幾何的相似三角形定理，影像平面上的座標 $(x, y)$ 為 `[FACT]`：
$$x = f \cdot \frac{X_c}{Z_c}, \qquad y = f \cdot \frac{Y_c}{Z_c}$$
這就是**透視除法（Perspective Division）**：物體在畫面上的大小與它的真實深度 $Z_c$ 成反比（近大遠小，這正是 [[LIB-408 情境感知擴散物件生成、幾何光照分析與無縫影像融合 (Context-Aware Object Generation, Illumination Estimation & Image Compositing)]] 計算透視縮放比例的物理依據）。但也因為除以了 $Z_c$，這是一個**非線性運算**！為了用線性代數的矩陣乘法統一處理平移與透視投影，數學家引入了**齊次座標（Homogeneous Coordinates）**：在 3D 點後面補一個 $1$ 變成 $(X, Y, Z, 1)^\top$，把非線性的除法藏在最後一步的齊次尺度歸一化中。

### 2. 對極幾何（Epipolar Geometry）：把 2D 大海撈針變成 1D 直線搜尋
當我們在兩個不同位置拍下同一棟建築的兩張照片 $I_1, I_2$ 時：
如果你在左圖 $I_1$ 看到屋頂的一個角點 $\mathbf{u}_1$，單憑一張圖你不知道它距離相機多遠——它可能位在從左相機光心 $\mathbf{O}_1$ 穿過 $\mathbf{u}_1$ 射向宇宙深處的**整條 3D 射線（Ray）**上的任何一點。
但是，當你從右相機光心 $\mathbf{O}_2$ 看這條 3D 射線時，整條 3D 射線在右圖 $I_2$ 上會投影成一條明確的 2D 直線——稱為**對極線（Epipolar Line）**！
這意味著：**左圖的一個點 $\mathbf{u}_1$，在右圖的對應點 $\mathbf{u}_2$ 必定被死死鎖在對應的對極線上**！這就是對極約束 $\mathbf{u}_2^\top \mathbf{F} \mathbf{u}_1 = 0$，它將原本在整張 2D 圖片 $(H \times W)$ 的大海撈針匹配，瞬間壓縮成沿著 1D 對極線的精準搜尋 `[FACT]`。

### 3. 運動結構恢復（SfM）與光束法平差（Bundle Adjustment）
當我們拿著手機圍繞一個物體拍了 100 張照片（事前完全不知道手機在每個瞬間的 3D 位置，也不知道物體的 3D 形狀），**Structure-from-Motion（如 COLMAP）** 就像一位幾何偵探：
1. 先找出兩張圖之間的匹配特徵點，利用對極幾何解出基礎矩陣 $\mathbf{F}$ 與本質矩陣 $\mathbf{E}$，拆解出兩台相機的相對旋轉 $\mathbf{R}$ 與平移 $\mathbf{t}$；
2. 利用**三角測量（Triangulation）** 讓兩條視線在 3D 空間交會，算出第一批 3D 點座標；
3. 一張接一張把新照片註冊進來，最後啟動**光束法平差（Bundle Adjustment）**——同時微調所有 100 台相機的 6DoF 位姿與成千上萬個 3D 點的位置，讓所有 3D 點重投影回 2D 照片的位置與實際觀測像素的誤差平方和最小！這批千錘百鍊出的相機位姿與 3D 點雲，就是 [[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]] 初始化 3D 高斯橢球的絕對地基。

---

## 二、🎓 博士級數學形式化推導：射影變換、本質矩陣奇異值結構、Hartley 正規化與舒爾補

### 1. 射影空間 $\mathbb{P}^3$、歐氏剛體群 $SE(3)$ 與透視投影雅可比矩陣 $\mathbf{J}$
設世界座標系下之三維點為 $\mathbf{X}_w = [X_w, Y_w, Z_w]^\top \in \mathbb{R}^3$，其齊次座標記為 $\tilde{\mathbf{X}}_w = [X_w, Y_w, Z_w, 1]^\top \in \mathbb{P}^3$。
1. **外參剛體變換（Extrinsics）**：將世界座標轉換至相機座標系 $\mathbf{X}_c = [X_c, Y_c, Z_c]^\top$，由特殊歐氏群 $[\mathbf{R} \mid \mathbf{t}] \in SE(3)$ 定義 `[FACT]`：
   $$\mathbf{X}_c = \mathbf{R}\mathbf{X}_w + \mathbf{t}, \quad \text{其中 } \mathbf{R} \in SO(3) \iff \mathbf{R}^\top \mathbf{R} = \mathbf{I}_3, \ \det(\mathbf{R}) = +1, \ \mathbf{t} \in \mathbb{R}^3$$
   注意相機光心在世界座標系中的真實 3D 位置為 $\mathbf{C}_w = -\mathbf{R}^\top \mathbf{t}$（令 $\mathbf{X}_c = \mathbf{0}$ 解得） `[DERIVATION]`。
2. **內參矩陣（Intrinsics）与針孔投影方程**：設焦距為 $(f_x, f_y)$（單位：pixel），主點偏移為 $(c_x, c_y)$，歪斜係數為 $s$（現代數位感光元件 $s=0$），則上三角內參矩陣 $\mathbf{K} \in \mathbb{R}^{3 \times 3}$ 與完整投影矩陣 $\mathbf{P} \in \mathbb{R}^{3 \times 4}$ 為 `[FACT]`：
   $$\lambda \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = \mathbf{K} \mathbf{X}_c = \underbrace{\begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}}_{\mathbf{K}} \underbrace{\begin{bmatrix} \mathbf{R} & \mathbf{t} \end{bmatrix}}_{3 \times 4} \begin{bmatrix} X_w \\ Y_w \\ Z_w \\ 1 \end{bmatrix} = \mathbf{P}\tilde{\mathbf{X}}_w, \quad \text{其中尺度因子 } \lambda = Z_c > 0$$
3. **局部仿射投影雅可比矩陣（Local Affine Projection Jacobian）** `[DERIVATION]`：
   定義非線性透視映射 $\pi(\mathbf{X}_c) = [u, v]^\top = \left[f_x \frac{X_c}{Z_c} + c_x, \ f_y \frac{Y_c}{Z_c} + c_y\right]^\top$。對相機座標 $\mathbf{X}_c = [X_c, Y_c, Z_c]^\top$ 求一階偏導數，即得 EWA 體積潑濺（Zwicker et al., 2001）與 3DGS（Kerbl et al., SIGGRAPH 2023，見 LIB-504）將 3D 協方差 $\boldsymbol{\Sigma}_w$ 投影至 2D 螢幕空間 $\boldsymbol{\Sigma}_{2\text{D}} = \mathbf{J}\mathbf{W}\boldsymbol{\Sigma}_w\mathbf{W}^\top\mathbf{J}^\top$ 的核心雅可比矩陣：
   $$\mathbf{J}(\mathbf{X}_c) = \frac{\partial (u, v)}{\partial (X_c, Y_c, Z_c)} = \begin{bmatrix} \frac{f_x}{Z_c} & 0 & -\frac{f_x X_c}{Z_c^2} \\ 0 & \frac{f_y}{Z_c} & -\frac{f_y Y_c}{Z_c^2} \end{bmatrix} \in \mathbb{R}^{2 \times 3}$$
   由分母 $Z_c^2$ 可見：當點接近或跨越相機近裁剪面 $Z_c \to 0^+$ 時，$\|\mathbf{J}\|_F \to \infty$，3D 高斯橢球在螢幕上會瞬間暴衝為無窮大退化奇異矩陣 `[SAFETY_BOUND]`！

---

### 2. 對極幾何、本質矩陣 $\mathbf{E}$ 與基礎矩陣 $\mathbf{F}$ 之代數流形結構
設同一三維點在第一相機座標系（設為參考系 $[\mathbf{I}\mid\mathbf{0}]$）與第二相機座標系（相對位姿 $[\mathbf{R}\mid\mathbf{t}]$）下的歸一化相機座標分別為 $\mathbf{x}_1 = \mathbf{K}_1^{-1}\tilde{\mathbf{u}}_1$ 與 $\mathbf{x}_2 = \mathbf{K}_2^{-1}\tilde{\mathbf{u}}_2$。
在第二相機座標系中，兩光心基線向量 $\mathbf{t}$、第一相機視線向量 $\mathbf{R}\mathbf{x}_1$ 與第二相機視線向量 $\mathbf{x}_2$ 三者必然**共面（Coplanar）**，其純量三重積恆為零 `[DERIVATION]`：
$$\mathbf{x}_2^\top (\mathbf{t} \times (\mathbf{R}\mathbf{x}_1)) = 0$$
將叉積改寫為反對稱矩陣（Skew-Symmetric Matrix）$[\mathbf{t}]_\times \triangleq \begin{bmatrix} 0 & -t_z & t_y \\ t_z & 0 & -t_x \\ -t_y & t_x & 0 \end{bmatrix}$，即得 Longuet-Higgins (1981) **本質矩陣（Essential Matrix）**方程 `[LITERATURE_RESULT]`：
$$\mathbf{x}_2^\top \mathbf{E} \mathbf{x}_1 = 0, \qquad \text{其中 } \mathbf{E} \triangleq [\mathbf{t}]_\times \mathbf{R} \in \mathbb{R}^{3 \times 3}$$

#### 定理 2.1（本質矩陣之奇異值充要條件，Huang & Faugeras, 1989） `[DERIVATION]`
一個非零實矩陣 $\mathbf{E} \in \mathbb{R}^{3 \times 3}$ 為有效本質矩陣，若且唯若其奇異值分解 $\mathbf{E} = \mathbf{U}\boldsymbol{\Sigma}\mathbf{V}^\top$ 滿足**前兩個奇異值相等且第三個奇異值為零**，即 $\boldsymbol{\Sigma} = \mathrm{diag}(\sigma, \sigma, 0)$（其中 $\sigma > 0$，秩 $\mathrm{rank}(\mathbf{E}) = 2$，自由度 $\mathrm{DoF} = 5$）。
將未標定像素座標 $\tilde{\mathbf{u}}_i = \mathbf{K}_i \mathbf{x}_i$ 代入，即得 **基礎矩陣（Fundamental Matrix）**方程 `[DERIVATION]`：
$$\tilde{\mathbf{u}}_2^\top \mathbf{F} \tilde{\mathbf{u}}_1 = 0, \qquad \text{其中 } \mathbf{F} \triangleq \mathbf{K}_2^{-\top} \mathbf{E} \mathbf{K}_1^{-1}, \quad \mathrm{rank}(\mathbf{F}) = 2, \quad \det(\mathbf{F}) = 0$$

---

### 3. Hartley 各向同性座標正規化八點法（Normalized 8-Point Algorithm）
對於每一組匹配點對 $\tilde{\mathbf{u}}_1 = [u_1, v_1, 1]^\top, \tilde{\mathbf{u}}_2 = [u_2, v_2, 1]^\top$，展開 $\tilde{\mathbf{u}}_2^\top \mathbf{F} \tilde{\mathbf{u}}_1 = 0$ 可寫成 Kronecker 內積形式 $(\tilde{\mathbf{u}}_2 \otimes \tilde{\mathbf{u}}_1)^\top \mathrm{vec}(\mathbf{F}) = 0$。收集 $N \ge 8$ 組點對可排成齊次線性方程組 $\mathbf{A}\mathbf{f} = \mathbf{0}$（$\mathbf{A} \in \mathbb{R}^{N \times 9}$）。

#### 為什麼天真八點法在實務上必敗？（病態條件數災難） `[DERIVATION]`
在 $1920 \times 1080$ 影像中，像素座標 $u, v \sim 10^3$，因此矩陣 $\mathbf{A}$ 的各行包含三種數量級相差 $10^6$ 倍的項目：
- 二次項 $u_1 u_2 \sim 10^6$
- 一次項 $u_1 \cdot 1 \sim 10^3$
- 常數項 $1 \cdot 1 = 10^0$
這導致法方程矩陣 $\mathbf{A}^\top \mathbf{A}$ 的譜條件數高達 $\kappa(\mathbf{A}^\top \mathbf{A}) = \frac{\sigma_{\max}^2}{\sigma_{\min}^2} \sim (10^6)^2 = 10^{12}$ `[FACT]`！在有限精度浮點數下，微小的 0.5 像素特徵定位雜訊就會被放大 $10^6$ 倍，使 SVD 最小奇異向量完全崩潰。

#### Hartley (TPAMI 1997) 各向同性預正規化定理 `[LITERATURE_RESULT]`
在構建矩陣 $\mathbf{A}$ 之前，分別對兩張圖的點集施加相似變換矩陣 $\mathbf{T}_1, \mathbf{T}_2 \in \mathbb{R}^{3 \times 3}$，將點集質心平移至原點 $(0, 0)$，並將到原點的平均歐氏距離縮放為 $\sqrt{2}$（使正規化座標均方約為 $\tilde{u} \approx 1, \tilde{v} \approx 1$）：
$$\hat{\mathbf{u}}_k = \mathbf{T}\tilde{\mathbf{u}}_k, \quad \mathbf{T} = \begin{bmatrix} s & 0 & -s\bar{u} \\ 0 & s & -s\bar{v} \\ 0 & 0 & 1 \end{bmatrix}, \quad \text{其中 } \bar{u} = \frac{1}{N}\sum_{k=1}^N u_k, \ \bar{v} = \frac{1}{N}\sum_{k=1}^N v_k, \ s = \frac{\sqrt{2}}{\frac{1}{N}\sum_{k=1}^N \sqrt{(u_k-\bar{u})^2 + (v_k-\bar{v})^2}}$$
正規化後 $\hat{u}\hat{u}' \sim 10^0, \hat{u} \sim 10^0, 1 \sim 10^0$，條件數驟降 $10^{10}$ 倍至 $\kappa(\hat{\mathbf{A}}^\top \hat{\mathbf{A}}) \sim 10^1$！求解步驟為 `[DERIVATION]`：
1. 對 $\hat{\mathbf{A}}$ 執行 SVD，取最小奇異值對應右奇異向量重排為 $\hat{\mathbf{F}}_{\text{raw}} \in \mathbb{R}^{3 \times 3}$；
2. **Frobenius 秩-2 流形投影（Eckart-Young Theorem，見 LIB-101）**：對 $\hat{\mathbf{F}}_{\text{raw}} = \mathbf{U}\mathrm{diag}(\sigma_1, \sigma_2, \sigma_3)\mathbf{V}^\top$ 強制令 $\sigma_3 = 0$，得 $\hat{\mathbf{F}} = \mathbf{U}\mathrm{diag}(\sigma_1, \sigma_2, 0)\mathbf{V}^\top$，保證極對極線收斂於唯一對極點 $\mathbf{e}$；
3. **去正規化（Denormalization）**：$\mathbf{F} = \mathbf{T}_2^\top \hat{\mathbf{F}} \mathbf{T}_1$。

---

### 4. 光束法平差（Bundle Adjustment）與舒爾補（Schur Complement）稀疏消去
給定 $M$ 台相機參數 $\mathbf{c} = [\mathbf{c}_1^\top, \dots, \mathbf{c}_M^\top]^\top \in \mathbb{R}^{6M}$ 與 $N$ 個三維空間點 $\mathbf{p} = [\mathbf{X}_1^\top, \dots, \mathbf{X}_N^\top]^\top \in \mathbb{R}^{3N}$（通常 $N \gg M$，例如 $M=200$ 張照片、$N=100,000$ 個 3D 點），光束法平差求解非線性最小二乘重投影誤差（Triggs et al., 1999；Schönberger & Frahm, CVPR 2016）：
$$\min_{\mathbf{c}, \mathbf{p}} \frac{1}{2} \sum_{i=1}^M \sum_{j=1}^N w_{ij} \left\| \mathbf{u}_{ij} - \pi(\mathbf{c}_i, \mathbf{X}_j) \right\|_2^2$$
在 Levenberg-Marquardt（LM，見 LIB-104）每一步迭代中，雅可比矩陣分塊為 $\mathbf{J} = [\mathbf{J}_c \mid \mathbf{J}_p]$，阻尼正規方程（Augmented Normal Equations）呈現嚴格的**二分圖分塊結構（Bipartite Block Structure）** `[DERIVATION]`：
$$\begin{bmatrix} \mathbf{U} & \mathbf{W} \\ \mathbf{W}^\top & \mathbf{V} \end{bmatrix} \begin{bmatrix} \Delta\mathbf{c} \\ \Delta\mathbf{p} \end{bmatrix} = \begin{bmatrix} \mathbf{e}_c \\ \mathbf{e}_p \end{bmatrix}, \quad \text{其中 } \mathbf{U} = \mathbf{J}_c^\top\mathbf{J}_c + \lambda\mathbf{D}_c \in \mathbb{R}^{6M \times 6M}, \ \mathbf{V} = \mathbf{J}_p^\top\mathbf{J}_p + \lambda\mathbf{D}_p \in \mathbb{R}^{3N \times 3N}$$
因為不同 3D 點 $\mathbf{X}_j, \mathbf{X}_k$ 之間沒有直接觀測耦合，**$\mathbf{V} = \mathrm{blkdiag}(\mathbf{V}_1, \dots, \mathbf{V}_N)$ 是由 $N$ 個獨立的 $3 \times 3$ 小矩陣組成的嚴格分塊對角矩陣** `[FACT]`！
若直接對 $(6M + 3N) \times (6M + 3N)$ 矩陣做 Cholesky 分解，複雜度為 $\mathcal{O}((6M + 3N)^3) \approx \mathcal{O}(27 N^3)$（當 $N=10^5$ 時需 $10^{15}$ 次浮點運算，完全不可解）。
利用左乘消去矩陣 $\begin{bmatrix} \mathbf{I} & -\mathbf{W}\mathbf{V}^{-1} \\ \mathbf{0} & \mathbf{I} \end{bmatrix}$ 執行**舒爾補消去（Schur Complement / Marginalization of 3D Points）** `[DERIVATION]`：
$$\underbrace{\left(\mathbf{U} - \mathbf{W}\mathbf{V}^{-1}\mathbf{W}^\top\right)}_{\mathbf{S} \in \mathbb{R}^{6M \times 6M} \text{ (Reduced Camera System)}} \Delta\mathbf{c} = \mathbf{e}_c - \mathbf{W}\mathbf{V}^{-1}\mathbf{e}_p, \qquad \Delta\mathbf{p} = \mathbf{V}^{-1}\left(\mathbf{e}_p - \mathbf{W}^\top \Delta\mathbf{c}\right)$$
由於 $\mathbf{V}^{-1} = \mathrm{blkdiag}(\mathbf{V}_1^{-1}, \dots, \mathbf{V}_N^{-1})$ 可在 $\mathcal{O}(N)$ 時間內高度平行求逆，問題瞬間降維為僅對 $6M \times 6M$ 相機系統求解（$\mathcal{O}(M^3 + M^2 N)$），計算量暴降 $10^6$ 倍以上 `[LITERATURE_RESULT]`！

---

## 三、⚙️ 計算機體系結構與硬體微架構映射：視錐近平面裁剪、批次 $3 \times 3$ 求逆與記憶體佈局

### 1. 視錐近平面保護（Near-Plane Frustum Guard）與 Cheirality 正深度不變量
在 GPU 光柵化管線（如 3DGS 的 `preprocessCUDA` Kernel，見 LIB-504）與可微重投影層中，任何位於相機後方或過於靠近光心（$Z_c \le z_{\text{near}}$，標準閾值 $z_{\text{near}} = 0.2\text{ m}$）的 3D 點，若直接代入透視除法 $1/Z_c$ 或雅可比矩陣 $-f_x X_c / Z_c^2$，會立即觸發兩個致命硬體級故障 `[SAFETY_BOUND]`：
1. **梯度與協方差溢位**：當 $Z_c \to 0$ 時，$1/Z_c^2 \to +\infty$，導致投影後的 2D 高斯半徑覆蓋整個螢幕的所有 $16 \times 16$ 圖塊（Tiles），單一高斯點塞爆全螢幕共享記憶體（Shared Memory）佇列，使光柵化吞吐量從 150 FPS 瞬間跌至 $< 1$ FPS 甚至引發 CUDA 越界崩潰；
2. **Cheirality 鏡像反轉偽影**：在射影幾何中，$\lambda \tilde{\mathbf{u}} = \mathbf{P}\tilde{\mathbf{X}}_w$ 允許 $\lambda = Z_c < 0$ 的代數解（即點位在相機背後卻穿透針孔顛倒投影到感光元件上）。因此從本質矩陣 $\mathbf{E} = \mathbf{U}\mathrm{diag}(1,1,0)\mathbf{V}^\top$ 分解出的 4 組候選位姿 $(\mathbf{R}_1, \pm\mathbf{t}), (\mathbf{R}_2, \pm\mathbf{t})$ 中，**只有唯一一組能同時滿足兩個相機座標系下深度皆嚴格為正（$Z_{c1} > 0 \land Z_{c2} > 0$，稱為手性正深度約束 Cheirality Constraint）** `[FACT]`。

### 2. GPU Warp 平行化 $3 \times 3$ 舒爾補分塊求逆
在 GPU 加速的光束法平差（如 Ceres CUDA / MegBA）中，矩陣 $\mathbf{V}$ 由 $N$ 個獨立的 $3 \times 3$ 對稱正定區塊 $\mathbf{V}_j \in \mathbb{R}^{3 \times 3}$ 組成。
- **反模式（Anti-Pattern）**：在迴圈中對每個 $3 \times 3$ 矩陣呼叫 `torch.linalg.inv`（啟動 cuSOLVER LU 分解 Kernel），Kernel Launch 延遲與同步開銷比實際計算慢 100 倍以上。
- **硬體對齊策略**：將 $N$ 個點打包為連續張量 `(N, 3, 3)`，利用閉式伴隨矩陣公式（Cramer's Rule / Cofactor Expansion）或批次 Cholesky 在單一 CUDA Kernel 內由每個執行緒獨立於暫存器（Registers）中完成 9 個元素的求逆，完全零 Warp 分支發散（Zero Warp Divergence） `[DESIGN_DECISION]`。

---

## 四、💻 工業級工程實作：Hartley 正規化八點法、解析透視雅可比與 DLT 三角測量

以下提供完整可執行的 PyTorch 射影幾何核心引擎，實作包含近平面防禦的針孔投影與解析雅可比 $\mathbf{J}$、Hartley 各向同性正規化八點法（含秩-2 流形投影）以及 DLT 線性三角測量與正深度檢驗：

```python
import torch
from typing import Tuple, Dict

def project_points_with_jacobian(
    points_w: torch.Tensor,
    R: torch.Tensor,
    t: torch.Tensor,
    K: torch.Tensor,
    z_near: float = 0.2,
) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    """
    將世界座標 3D 點投影至 2D 像素平面，並計算 3DGS 所需之局部仿射投影雅可比矩陣 J。
    輸入:
      points_w: (N, 3) 世界座標系 3D 點
      R: (3, 3) 旋轉矩陣 in SO(3)
      t: (3,) 平移向量
      K: (3, 3) 內參矩陣
      z_near: 視錐近裁剪面安全下界 (m)
    輸出:
      uv: (N, 2) 像素座標
      J: (N, 2, 3) 局部透視投影雅可比 d(u,v)/d(Xc,Yc,Zc)
      valid_mask: (N,) Cheirality 正深度有效遮罩 (Zc > z_near)
    """
    assert points_w.dim() == 2 and points_w.shape[1] == 3
    assert R.shape == (3, 3) and t.shape == (3,) and K.shape == (3, 3)
    # 驗證 R 屬於特殊正交群 SO(3)
    orth_err = torch.norm(R.T @ R - torch.eye(3, device=R.device, dtype=R.dtype))
    assert orth_err < 1e-4 and torch.det(R) > 0.0, f"無效旋轉矩陣 R: orth_err={orth_err}"

    # 1. 世界座標轉相機座標: X_c = X_w @ R^T + t
    points_c = points_w @ R.T + t.unsqueeze(0)  # (N, 3)
    Xc, Yc, Zc = points_c[:, 0], points_c[:, 1], points_c[:, 2]

    # RULE-502-02: 強制執行視錐近平面正深度防禦，防止 1/Zc 與 1/Zc^2 溢位
    valid_mask = Zc > z_near
    Zc_safe = torch.clamp(Zc, min=z_near)
    inv_z = 1.0 / Zc_safe
    inv_z2 = inv_z * inv_z

    fx, fy = K[0, 0], K[1, 1]
    cx, cy = K[0, 2], K[1, 2]

    u = fx * Xc * inv_z + cx
    v = fy * Yc * inv_z + cy
    uv = torch.stack([u, v], dim=-1)  # (N, 2)

    # 2. 構造解析局部透視雅可比 J (N, 2, 3)
    zeros = torch.zeros_like(Xc)
    J_row0 = torch.stack([fx * inv_z, zeros, -fx * Xc * inv_z2], dim=-1)
    J_row1 = torch.stack([zeros, fy * inv_z, -fy * Yc * inv_z2], dim=-1)
    J = torch.stack([J_row0, J_row1], dim=1)  # (N, 2, 3)

    assert torch.isfinite(uv).all() and torch.isfinite(J).all()
    return uv, J, valid_mask


def hartley_isotropic_normalize(uv: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
    """
    RULE-502-01: Hartley (TPAMI 1997) 各向同性座標預正規化：
    將質心移至原點 (0,0)，並將到原點之平均距離縮放為 sqrt(2)。
    輸入: uv (N, 2)
    輸出: (uv_norm_hom (N, 3), T (3, 3))
    """
    assert uv.dim() == 2 and uv.shape[1] == 2 and uv.shape[0] >= 8
    centroid = uv.mean(dim=0)  # (2,)
    shifted = uv - centroid.unsqueeze(0)
    mean_dist = torch.norm(shifted, dim=-1).mean()
    scale = (2.0 ** 0.5) / torch.clamp(mean_dist, min=1e-8)

    T = torch.eye(3, device=uv.device, dtype=uv.dtype)
    T[0, 0] = scale
    T[1, 1] = scale
    T[0, 2] = -scale * centroid[0]
    T[1, 2] = -scale * centroid[1]

    ones = torch.ones((uv.shape[0], 1), device=uv.device, dtype=uv.dtype)
    uv_hom = torch.cat([uv, ones], dim=-1)  # (N, 3)
    uv_norm_hom = uv_hom @ T.T
    return uv_norm_hom, T


def estimate_fundamental_matrix_8point(
    uv1: torch.Tensor,
    uv2: torch.Tensor,
) -> Tuple[torch.Tensor, Dict[str, float]]:
    """
    使用 Hartley 正規化八點法與 Eckart-Young 秩-2 SVD 流形投影求解基礎矩陣 F，
    滿足 u2^T @ F @ u1 = 0 且 rank(F) = 2。
    """
    assert uv1.shape == uv2.shape and uv1.shape[0] >= 8
    x1, T1 = hartley_isotropic_normalize(uv1)  # (N, 3)
    x2, T2 = hartley_isotropic_normalize(uv2)  # (N, 3)

    # 構造正規化 Kronecker 設計矩陣 A (N, 9)
    u1, v1, w1 = x1[:, 0], x1[:, 1], x1[:, 2]
    u2, v2, w2 = x2[:, 0], x2[:, 1], x2[:, 2]
    A = torch.stack(
        [
            u2 * u1, u2 * v1, u2 * w1,
            v2 * u1, v2 * v1, v2 * w1,
            w2 * u1, w2 * v1, w2 * w1,
        ],
        dim=-1,
    )

    # 求解最小奇異向量並重排為 3x3
    _, S_A, Vh_A = torch.linalg.svd(A, full_matrices=False)
    cond_number = float((S_A[0] / torch.clamp(S_A[-2], min=1e-12)).item() ** 2)
    F_norm_raw = Vh_A[-1].reshape(3, 3)

    # RULE-502-01: 強制執行 Rank-2 SVD 流形投影 (det(F) = 0)
    U_f, S_f, Vh_f = torch.linalg.svd(F_norm_raw)
    S_f_rank2 = torch.stack([S_f[0], S_f[1], torch.zeros_like(S_f[2])])
    F_norm = U_f @ torch.diag(S_f_rank2) @ Vh_f

    # 去正規化: F = T2^T @ F_norm @ T1
    F_mat = T2.T @ F_norm @ T1
    F_mat = F_mat / torch.clamp(torch.norm(F_mat), min=1e-12)

    # 驗證對極代數殘差與行列式
    ones = torch.ones((uv1.shape[0], 1), device=uv1.device, dtype=uv1.dtype)
    p1 = torch.cat([uv1, ones], dim=-1)
    p2 = torch.cat([uv2, ones], dim=-1)
    algebraic_err = torch.abs((p2 * (p1 @ F_mat.T)).sum(dim=-1)).mean().item()

    return F_mat, {
        "normalized_cond_kappa": cond_number,
        "mean_epipolar_residual": float(algebraic_err),
        "det_F": float(torch.det(F_mat).item()),
    }


if __name__ == "__main__":
    torch.manual_seed(42)
    dtype = torch.float64
    N_pts = 32
    pts_w = torch.empty((N_pts, 3), dtype=dtype).uniform_(-1.5, 1.5)
    pts_w[:, 2] += 5.0  # 確保位於兩個相機前方 Z > 3.5m

    K = torch.tensor(
        [
            [800.0, 0.0, 640.0],
            [0.0, 800.0, 360.0],
            [0.0, 0.0, 1.0],
        ],
        dtype=dtype,
    )
    R1 = torch.eye(3, dtype=dtype)
    t1 = torch.zeros(3, dtype=dtype)

    # 第二台相機繞 Y 軸旋轉約 15 度並平移基線
    angle = torch.tensor(0.26, dtype=dtype)
    c, s = torch.cos(angle), torch.sin(angle)
    R2 = torch.tensor(
        [
            [c.item(), 0.0, s.item()],
            [0.0, 1.0, 0.0],
            [-s.item(), 0.0, c.item()],
        ],
        dtype=dtype,
    )
    t2 = torch.tensor([-0.8, 0.1, 0.2], dtype=dtype)

    uv1, J1, mask1 = project_points_with_jacobian(pts_w, R1, t1, K)
    uv2, J2, mask2 = project_points_with_jacobian(pts_w, R2, t2, K)
    assert mask1.all() and mask2.all()

    F_est, stats = estimate_fundamental_matrix_8point(uv1, uv2)
    assert stats["mean_epipolar_residual"] < 1e-9
    assert abs(stats["det_F"]) < 1e-12
    print(f"[LIB-502 Verified] {stats}, J1 shape={tuple(J1.shape)}")
```

---

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-502-01] Hartley 各向同性預正規化與秩-2 流形投影鐵律 (Hartley Normalization & Rank-2 Manifold Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件**: 當 AI Agent 實作基礎矩陣 $\mathbf{F}$ 八點法或單應性矩陣 $\mathbf{H}$ 直接線性變換（DLT）演算法時。
- **決策邊界**:
  - **嚴格禁止**將原始像素座標 $(u, v) \in [0, W] \times [0, H]$ 直接填入線性方程組 $\mathbf{A}\mathbf{f} = \mathbf{0}$。
  - **強制要求**先執行 Hartley 各向同性正規化（質心歸零、平均距離縮放至 $\sqrt{2}$），並在取得初始 SVD 解 $\hat{\mathbf{F}}_{\text{raw}}$ 後，強制將最小奇異值 $\sigma_3$ 置零以投影回 $\det(\mathbf{F}) = 0$ 的秩-2 流形，最後再執行去正規化 $\mathbf{F} = \mathbf{T}_2^\top \hat{\mathbf{F}} \mathbf{T}_1$。
- **違規後果**: 未正規化像素座標會導致法方程條件數惡化至 $\kappa \sim 10^{12}$，微小的亞像素雜訊即可使解出的對極線完全偏離；未執行秩-2 投影則會導致對極線無法交會於單一對極點。

### [RULE-502-02] 手性正深度檢驗與視錐近平面截斷護欄 (Cheirality Positive-Depth & Near-Plane Guard Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件**: 撰寫相機透視投影 $\pi(\mathbf{X}_c)$、3DGS 協方差投影雅可比 $\mathbf{J}(\mathbf{X}_c)$ 或本質矩陣位姿還原函數時。
- **決策邊界**:
  - 在執行任何除以深度 $Z_c$ 或 $Z_c^2$ 的運算前，**強制執行視錐近平面篩選與截斷** `Zc >= z_near`（標準值 $z_{\text{near}} = 0.2\text{ m}$） `[SAFETY_BOUND]`。
  - 從本質矩陣 $\mathbf{E}$ 分解出 4 組 $(\mathbf{R}, \mathbf{t})$ 候選解後，必須執行三角測量並驗證三維點在兩台相機座標系下同時滿足手性正深度條件（$Z_{c1} > 0 \land Z_{c2} > 0$）。
- **執行保證**: 杜絕 $Z_c \to 0$ 引發的投影協方差爆炸、GPU 光柵化佇列溢位與反向鏡像偽影。

### [RULE-502-03] 光束法平差舒爾補稀疏消去指令 (Bundle Adjustment Schur Complement Directive)
- **合約等級**: `STRATEGIC_DIRECTIVE`
- **前置條件**: 求解同時包含 $M$ 台相機位姿與 $N$ 個三維路標點（$N \gg M$）之大規模重投影非線性最小二乘問題（Bundle Adjustment / SLAM 後端）。
- **決策邊界**:
  - **嚴格禁止**對 $(6M + 3N) \times (6M + 3N)$ 聯合 Hessian 矩陣呼叫稠密線性求解器（Dense Cholesky / LU）。
  - **強制要求**利用三維路標點子塊 $\mathbf{V} = \mathrm{blkdiag}(\mathbf{V}_1, \dots, \mathbf{V}_N)$ 的 $3 \times 3$ 分塊對角稀疏性，先在 $\mathcal{O}(N)$ 時間內平行計算 $\mathbf{V}^{-1}$ 並構造縮減相機舒爾補系統 $(\mathbf{U} - \mathbf{W}\mathbf{V}^{-1}\mathbf{W}^\top)\Delta\mathbf{c} = \mathbf{e}_c - \mathbf{W}\mathbf{V}^{-1}\mathbf{e}_p$。

---

## 六、📚 權威論文、經典著作與同行評審文獻 (Canonical & Peer-Reviewed References)

1. **多視角幾何聖經 (Cambridge University Press)**
   - *Book*: Hartley, R., & Zisserman, A. (2004). *Multiple View Geometry in Computer Vision* (2nd ed.). Cambridge University Press. ISBN: 978-0-521-54051-3.
   - *Application*: 射影空間 $\mathbb{P}^3$、針孔相機模型、對極幾何與三角測量之最高權威數學基準。
2. **為八點法平反之經典論文 (IEEE TPAMI 1997)**
   - *Paper*: Hartley, R. I. (1997). "In Defense of the Eight-Point Algorithm." *IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)*, 19(6), 580–593. DOI: [10.1109/34.601246](https://doi.org/10.1109/34.601246).
   - *Application*: 嚴密證明未正規化像素座標之條件數病態根源，並提出各向同性預正規化變換 $\mathbf{T}$。
3. **本質矩陣與相對位姿復原開創論文 (Nature 1981)**
   - *Paper*: Longuet-Higgins, H. C. (1981). "A computer algorithm for reconstructing a scene from two projections." *Nature*, 293(5828), 133–135. DOI: [10.1038/293133a0](https://doi.org/10.1038/293133a0).
   - *Application*: 首次引入本質矩陣 $\mathbf{E} = [\mathbf{t}]_\times \mathbf{R}$ 與共面對極約束方程。
4. **COLMAP 通用運動結構恢復系統 (CVPR 2016)**
   - *Paper*: Schönberger, J. L., & Frahm, J.-M. (2016). "Structure-from-Motion Revisited." *IEEE Conference on Computer Vision and Pattern Recognition (CVPR 2016)*, pp. 4104–4113. DOI: [10.1109/CVPR.2016.445](https://doi.org/10.1109/CVPR.2016.445).
   - *Application*: 現代 NeRF 與 3DGS（LIB-504）標準相機位姿標定與稀疏點雲初始化工業管線。
5. **光束法平差與舒爾補稀疏求解權威綜述 (ICCV Workshop 1999)**
   - *Paper*: Triggs, B., McLauchlan, P. F., Hartley, R. I., & Fitzgibbon, A. W. (1999). "Bundle Adjustment — A Modern Synthesis." *International Workshop on Vision Algorithms (ICCV 1999)*, LNCS vol. 1883, pp. 298–372. DOI: [10.1007/3-540-44480-7_21](https://doi.org/10.1007/3-540-44480-7_21).
   - *Application*: 推導二分圖正規方程與舒爾補（Schur Complement）消去路標點之標準數值架構。
6. **EWA 體積潑濺與局部仿射投影雅可比 (IEEE TVCG 2002)**
   - *Paper*: Zwicker, M., Pfister, H., Van Baar, J., & Gross, M. (2002). "EWA Splatting." *IEEE Transactions on Visualization and Computer Graphics (TVCG)*, 8(3), 223–238. DOI: [10.1109/TVCG.2002.1021576](https://doi.org/10.1109/TVCG.2002.1021576).
   - *Application*: 推導非線性透視映射在相機座標處之一階泰勒展開雅可比矩陣 $\mathbf{J}(\mathbf{X}_c)$，直接被 3DGS 繼承。
