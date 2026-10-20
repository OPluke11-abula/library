---
call_number: LIB-102
status: source-verified
invariants_count: 3
title: 機率統計、資訊理論與變分推論基石 (Probability, Information Theory & Variational Inference)
module: Mathematical-Foundations
category: Information-Theory-Probabilistic-ML
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Measure-Theoretic Probability & Maximum Likelihood Estimation
  - Shannon Entropy, Kullback-Leibler Divergence & Cross-Entropy
  - Fisher Information Metric & Natural Gradient Geometry
  - Evidence Lower Bound (ELBO) & Reparameterization Trick
hardware_target:
  - NVIDIA Tensor Cores & Special Function Units (SFU)
  - High-Bandwidth Memory (HBM) Online Reduction Kernels
created: 2026-10-17
author: Luke
tags:
  - 圖書館
  - 機率統計
  - 資訊理論
  - 變分推論
  - 夏農熵
  - KL散度
  - ELBO
  - Fisher資訊矩陣
prerequisites:
  - "[[LIB-001 深度學習第一性原理先修精要：模型如何學習的六大基石 (Deep Learning First Principles - The Six Pillars of How Models Learn)]]"
  - "[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]"
successors:
  - "[[LIB-104 凸最佳化理論與一階二階梯度下降幾何 (Optimization Theory & Gradient Descent)]]"
  - "[[LIB-301 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)]]"
  - "[[LIB-406 生成模型前沿：從隨機微分方程 (SDE) 擴散模型到最佳傳輸流匹配 (Flow Matching) 與 DiT 革命 (Generative Frontiers - From Score-Based SDE Diffusion to Optimal Transport Flow Matching & DiT Revolution)]]"
  - "[[LIB-602 現代大語言模型架構解剖與縮放定律 (Modern LLM Architecture & Scaling Laws)]]"
  - "[[LIB-603 密集檢索、檢索增強生成 (RAG) 與緩存增強生成 (CAG) 系統架構 (Dense Retrieval, RAG & Cache-Augmented Generation Architecture)]]"
  - "[[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]]"
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/01_mathematics/LIB-102%20Probability,%20Information%20Theory%20%26%20Variational%20Inference%20%28Agent%20EN%29.md)

# 機率統計、資訊理論與變分推論基石 (Probability, Information Theory & Variational Inference)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-001 深度學習第一性原理先修精要：模型如何學習的六大基石 (Deep Learning First Principles - The Six Pillars of How Models Learn)]]、[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]。
- **後續節點**：[[LIB-104 凸最佳化理論與一階二階梯度下降幾何 (Optimization Theory & Gradient Descent)]]、[[LIB-301 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)]]、[[LIB-406 生成模型前沿：從隨機微分方程 (SDE) 擴散模型到最佳傳輸流匹配 (Flow Matching) 與 DiT 革命 (Generative Frontiers - From Score-Based SDE Diffusion to Optimal Transport Flow Matching & DiT Revolution)]]、[[LIB-602 現代大語言模型架構解剖與縮放定律 (Modern LLM Architecture & Scaling Laws)]]、[[LIB-603 密集檢索、檢索增強生成 (RAG) 與緩存增強生成 (CAG) 系統架構 (Dense Retrieval, RAG & Cache-Augmented Generation Architecture)]]、[[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]]。
- **核心定位**：如果線性代數（LIB-101）定義了神經網路如何在高維幾何空間中做確定性座標變換，那麼機率論與資訊理論就是深度學習處理**不確定性（Uncertainty）**、**分佈對齊（Distribution Alignment）**與**隱變數生成（Latent Variable Generation）**的唯一公理語言。從分類問題的交叉熵（Cross-Entropy）、大語言模型的困惑度（Perplexity），到擴散模型與變分自編碼器（VAE）的證據下界（ELBO），全數建立在本卷推導的測度與資訊幾何基石之上。

---

## 一、💡 學士直觀心智模型：從「擲骰子」到「壓縮宇宙訊號與丈量信念差距」

為什麼訓練神經網路分類器時，我們不用均方誤差（MSE）去擬合機率，而是幾乎一面倒地使用**交叉熵（Cross-Entropy）**？為什麼生成模型（VAE 與 Diffusion）都在最小化 **KL 散度（Kullback-Leibler Divergence）**？

這可以用三個直觀物理圖像徹底貫通：

### 1. 資訊量就是「驚訝程度（Surprisal）」
假設今天新聞播報：「明天太陽會從東邊升起」（機率 $P(x) \approx 1$），你聽完毫無波瀾，這句話傳遞的**資訊量為 0**。
反之，如果新聞播報：「撒哈拉沙漠剛剛下起了暴風雪」（機率 $P(x) \ll 1$），你會極度震驚，這句話蘊含了**極高的資訊量**。
克勞德·夏農（Claude Shannon, 1948）指出：一個隨機事件 $x$ 的本質資訊量（自資訊，Self-Information），必須滿足「兩個獨立事件同時發生的資訊量等於各自資訊量相加」，因此唯一符合公理的數學形式就是對數的負值 `[FACT]`：
$$I(x) = -\log P(x)$$
而**夏農熵（Shannon Entropy）** $H(P) = \mathbb{E}_{x \sim P}[-\log P(x)]$，就是當你面對一個隨機分佈 $P$ 時，**平均每次抽樣會感受到的驚訝程度**，同時也是無損壓縮該訊號源所需的**理論最小平均位元數（Minimum Coding Length）** `[FACT]`。

### 2. 交叉熵與 KL 散度：用「錯誤密碼本」編碼真實世界的代價
假設真實世界的訊號分佈是 $P(x)$（例如真實手寫數字的類別分佈），但你的神經網路目前的預測分佈是 $Q_\theta(x)$。
如果你拿著基於錯誤信念 $Q_\theta$ 設計的霍夫曼編碼本（Huffman Codebook）去壓縮真實世界 $P$ 產生的事件，你平均每次需要花費的編碼長度就是**交叉熵（Cross-Entropy）** $H(P, Q_\theta) = \mathbb{E}_{x \sim P}[-\log Q_\theta(x)]$。
因為你用了不完美的密碼本，你一定會比使用完美密碼本 $P$ 多浪費一些位元。這份**「額外多浪費的編碼長度」**，就是大名鼎鼎的 **KL 散度（相對熵）** `[DERIVATION]`：
$$D_{\mathrm{KL}}(P \parallel Q_\theta) = \underbrace{H(P, Q_\theta)}_{\text{用模型 } Q_\theta \text{ 編碼真實資料的實際代價}} - \underbrace{H(P)}_{\text{真實資料本身的內在熵（常數）}}$$
由於真實資料集 $P$ 的內在熵 $H(P)$ 與模型參數 $\theta$ 無關，**最小化交叉熵損失函數 $\mathcal{L}_{\mathrm{CE}}(\theta)$，在數學上 100% 等價於最小化真實分佈 $P$ 與模型分佈 $Q_\theta$ 之間的 KL 散度，亦完全等價於極大似然估計（Maximum Likelihood Estimation, MLE）** `[DERIVATION]`！

### 3. 變分推論（Variational Inference）：用「可控高斯探照燈」逼近不可解的後驗深淵
在生成模型中，我們觀測到高維資料 $x$（例如一張 $512 \times 512$ 影像），並假設它是由某個低維隱變數 $z$（例如物體姿態、光照、風格）生成的。根據貝氏定理，真實後驗分佈為：
$$p_\theta(z \mid x) = \frac{p_\theta(x \mid z) p(z)}{p_\theta(x)}, \quad \text{其中邊際似然 } p_\theta(x) = \int_{\mathbb{R}^d} p_\theta(x \mid z) p(z) \, dz$$
當條件生成網路 $p_\theta(x \mid z)$ 是深層非線性神經網路時，分母的積分 $\int p_\theta(x \mid z) p(z) \, dz$ 在高維空間 $\mathbb{R}^d$ 中完全沒有解析解，直接蒙地卡羅採樣則需要指數級樣本數（維度災難） `[FACT]`。
**變分推論（Variational Inference）**的核心思想是：**既然算不出真正的後驗 $p_\theta(z \mid x)$，我們就引入一個參數化的可微家族 $q_\phi(z \mid x)$（例如對角高斯分佈），把「求積分問題」轉化為「最佳化問題」——直接調整 $\phi$ 讓 $q_\phi(z \mid x)$ 與真實後驗 $p_\theta(z \mid x)$ 的 KL 散度最小** `[DESIGN_DECISION]`！

---

## 二、🎓 博士級數學形式化推導：夏農熵、KL 散度、Fisher 資訊矩陣與變分證據下界 (ELBO)

### 1. Gibbs 不等式與 KL 散度之非負性及非對稱性證明
設 $(\mathcal{X}, \mathcal{F}, \mu)$ 為測度空間，$P, Q$ 為定義於 $\mathcal{X}$ 上且絕對連續於基底測度 $\mu$（$P \ll Q \ll \mu$）之機率測度，其 Radon-Nikodym 密度函數分別為 $p(x), q(x)$。
**Kullback-Leibler 散度（KL Divergence）**定義為 `[FACT]`：
$$D_{\mathrm{KL}}(P \parallel Q) \triangleq \int_{\mathcal{X}} p(x) \log \left( \frac{p(x)}{q(x)} \right) d\mu(x) = \mathbb{E}_{x \sim P}\left[ -\log \frac{q(x)}{p(x)} \right]$$

#### 定理 2.1（Gibbs 不等式：KL 散度非負性） `[DERIVATION]`
對於任意兩個機率分佈 $P, Q$，恆有 $D_{\mathrm{KL}}(P \parallel Q) \ge 0$，且等號成立若且唯若 $p(x) = q(x)$ 在 $\mu$-幾乎處處（$\mu$-almost everywhere）成立。
**證明**：
考慮函數 $f(u) = -\log u$。由於其二階導數 $f''(u) = \frac{1}{u^2} > 0$（當 $u > 0$），故 $f(u) = -\log u$ 為嚴格凸函數（Strictly Convex Function）。
根據 **Jensen 不等式（Jensen's Inequality）**，對於凸函數 $f$ 與隨機變數 $U = \frac{q(x)}{p(x)}$：
$$D_{\mathrm{KL}}(P \parallel Q) = \mathbb{E}_{x \sim P}\left[ f\left(\frac{q(x)}{p(x)}\right) \right] \ge f\left( \mathbb{E}_{x \sim P}\left[\frac{q(x)}{p(x)}\right] \right) = -\log \left( \int_{\mathcal{X}} p(x) \frac{q(x)}{p(x)} d\mu(x) \right) = -\log \left( \int_{\mathcal{X}} q(x) d\mu(x) \right) = -\log(1) = 0$$
因 $f(u) = -\log u$ 嚴格凸，等號成立條件為隨機變數 $U = \frac{q(x)}{p(x)}$ 幾乎處處為常數 $c=1$，即 $p(x) = q(x)$ a.e.。證畢。$\blacksquare$

#### 方向非對稱性：Forward KL（Mean-Seeking）vs. Reverse KL（Mode-Seeking） `[DERIVATION]`
KL 散度違反度量空間（Metric Space）的對稱性公理（$D_{\mathrm{KL}}(P \parallel Q) \neq D_{\mathrm{KL}}(Q \parallel P)$）與三角不等式，故其為**統計流形上的預度量散度（Bregman Divergence）**：
1. **前向 KL（Forward KL / Mass-Covering）** $\min_\theta D_{\mathrm{KL}}(P_{\text{data}} \parallel Q_\theta)$：
   $$\nabla_\theta D_{\mathrm{KL}}(P_{\text{data}} \parallel Q_\theta) = -\mathbb{E}_{x \sim P_{\text{data}}}[\nabla_\theta \log Q_\theta(x)]$$
   在任何 $P_{\text{data}}(x) > 0$ 的區域，若 $Q_\theta(x) \to 0$，則 $\log(P_{\text{data}}(x)/Q_\theta(x)) \to +\infty$。這迫使模型 $Q_\theta$ 必須覆蓋真實資料分佈的所有支集（Support），表現為**均值追尋（Mean-Seeking / Mode-Covering）**——這是最大似然估計（MLE）與自迴歸交叉熵訓練（LIB-602）的本質。
2. **反向 KL（Reverse KL / Mode-Seeking）** $\min_\phi D_{\mathrm{KL}}(Q_\phi \parallel P)$：
   在任何 $P(x) = 0$ 的低密度禁區，若 $Q_\phi(x) > 0$，懲罰項 $Q_\phi(x) \log(Q_\phi(x)/P(x)) \to +\infty$；反之若 $Q_\phi(x) = 0$，則 $0 \log 0 = 0$ 不受懲罰。這迫使變分分佈 $Q_\phi$ 收縮並鎖定於真實分佈 $P$ 的單一高密度峰值，表現為**峰值追尋（Mode-Seeking / Zero-Forcing）**——這是變分推論（ELBO）與強化學習策略蒸餾的核心幾何特性。

---

### 2. 分數函數（Score Function）、Fisher 資訊矩陣與局部黎曼度量
設參數化機率模型族為 $\{p_\theta(x) \mid \theta \in \Theta \subset \mathbb{R}^d\}$。對數似然對參數 $\theta$ 的梯度稱為統計學之**分數函數（ Fisher Score Function）**（注意與擴散模型 LIB-406 對資料空間求導之 Stein Score $\nabla_x \log p(x)$ 嚴格區分） `[FACT]`：
$$s(\theta; x) \triangleq \nabla_\theta \log p_\theta(x) \in \mathbb{R}^d$$

#### 定理 2.2（分數函數零期望恆等式與 Fisher 資訊矩陣等價性） `[DERIVATION]`
在標準測度正則條件（允許微分算子與積分算子交換次序）下：
1. **一階矩恆為零**：
   $$\mathbb{E}_{x \sim p_\theta}[\nabla_\theta \log p_\theta(x)] = \int_{\mathcal{X}} p_\theta(x) \frac{\nabla_\theta p_\theta(x)}{p_\theta(x)} dx = \nabla_\theta \int_{\mathcal{X}} p_\theta(x) dx = \nabla_\theta (1) = \mathbf{0}$$
2. **Fisher 資訊矩陣（Fisher Information Matrix, FIM）**定義為分數函數的協方差矩陣，且等價於負對數似然之期望 Hessian 矩陣 `[DERIVATION]`：
   $$\mathbf{F}(\theta) \triangleq \mathbb{E}_{x \sim p_\theta}\left[ \nabla_\theta \log p_\theta(x) \nabla_\theta \log p_\theta(x)^\top \right] = -\mathbb{E}_{x \sim p_\theta}\left[ \nabla_\theta^2 \log p_\theta(x) \right] \in \mathbb{R}^{d \times d}$$
3. **KL 散度的局部二階泰勒展開（資訊幾何黎曼度量）**：
   考慮無窮小參數擾動 $\theta + \delta\theta$，將 $D_{\mathrm{KL}}(p_\theta \parallel p_{\theta + \delta\theta})$ 在 $\delta\theta = \mathbf{0}$ 處進行二階泰勒展開：
   $$D_{\mathrm{KL}}(p_\theta \parallel p_{\theta + \delta\theta}) = \underbrace{D_{\mathrm{KL}}(p_\theta \parallel p_\theta)}_{=0} - \underbrace{\mathbb{E}_{p_\theta}[\nabla_\theta \log p_\theta(x)]^\top}_{=\mathbf{0}} \delta\theta - \frac{1}{2} \delta\theta^\top \mathbb{E}_{p_\theta}[\nabla_\theta^2 \log p_\theta(x)] \delta\theta + \mathcal{O}(\|\delta\theta\|^3)$$
   $$\implies D_{\mathrm{KL}}(p_\theta \parallel p_{\theta + \delta\theta}) = \frac{1}{2} \delta\theta^\top \mathbf{F}(\theta) \delta\theta + \mathcal{O}(\|\delta\theta\|^3)$$
   這證明了 **Fisher 資訊矩陣 $\mathbf{F}(\theta)$ 正是機率分佈流形（Statistical Manifold）上的唯一局部黎曼度量張量（Riemannian Metric Tensor）**（Amari, 1998） `[LITERATURE_RESULT]`，直接奠定了 LIB-104 自然梯度下降（Natural Gradient Descent, $\tilde{\nabla}_\theta \mathcal{L} = \mathbf{F}(\theta)^{-1} \nabla_\theta \mathcal{L}$）與強化學習 TRPO/PPO 信賴域約束的幾何根基。

---

### 3. 變分證據下界（ELBO）完整閉式分解與重參數化定理
對於含隱變數 $z \in \mathbb{R}^k$ 之生成模型 $p_\theta(x, z) = p_\theta(x \mid z) p(z)$，對任意變分近似後驗 $q_\phi(z \mid x)$，觀測資料對數邊際似然 $\log p_\theta(x)$ 可進行如下恆等分解 `[DERIVATION]`：

$$\begin{aligned}
\log p_\theta(x) &= \int q_\phi(z \mid x) \log p_\theta(x) \, dz \\
&= \int q_\phi(z \mid x) \log \left( \frac{p_\theta(x, z)}{p_\theta(z \mid x)} \cdot \frac{q_\phi(z \mid x)}{q_\phi(z \mid x)} \right) dz \\
&= \underbrace{\mathbb{E}_{z \sim q_\phi(z \mid x)}\left[ \log \frac{p_\theta(x, z)}{q_\phi(z \mid x)} \right]}_{\triangleq \mathrm{ELBO}(\theta, \phi; x)} + \underbrace{D_{\mathrm{KL}}\big(q_\phi(z \mid x) \parallel p_\theta(z \mid x)\big)}_{\ge 0 \text{ (由定理 2.1)}}
\end{aligned}$$

由於後驗 KL 散度恆非負，故 **$\mathrm{ELBO}(\theta, \phi; x) \le \log p_\theta(x)$** 恆為對數邊際似然之嚴格下界，且進一步拆解為「重構保真度」與「先驗正則化」兩項對抗目標 `[DERIVATION]`：
$$\mathrm{ELBO}(\theta, \phi; x) = \underbrace{\mathbb{E}_{z \sim q_\phi(z \mid x)}[\log p_\theta(x \mid z)]}_{\text{重構對數似然 (Reconstruction Fidelity)}} - \underbrace{D_{\mathrm{KL}}\big(q_\phi(z \mid x) \parallel p(z)\big)}_{\text{先驗資訊瓶頸懲罰 (Prior Regularization)}}$$

#### 定理 2.3（兩個多元高斯分佈之閉式 KL 散度與對角化簡） `[DERIVATION]`
設變分後驗為 $q_\phi(z \mid x) = \mathcal{N}(z; \boldsymbol{\mu}_1, \boldsymbol{\Sigma}_1)$，先驗為 $p(z) = \mathcal{N}(z; \boldsymbol{\mu}_2, \boldsymbol{\Sigma}_2)$，維度為 $k$。則其解析 KL 散度為：
$$D_{\mathrm{KL}}\big(\mathcal{N}(\boldsymbol{\mu}_1, \boldsymbol{\Sigma}_1) \parallel \mathcal{N}(\boldsymbol{\mu}_2, \boldsymbol{\Sigma}_2)\big) = \frac{1}{2}\left[ \log \frac{\det \boldsymbol{\Sigma}_2}{\det \boldsymbol{\Sigma}_1} - k + \mathrm{Tr}(\boldsymbol{\Sigma}_2^{-1} \boldsymbol{\Sigma}_1) + (\boldsymbol{\mu}_2 - \boldsymbol{\mu}_1)^\top \boldsymbol{\Sigma}_2^{-1} (\boldsymbol{\mu}_2 - \boldsymbol{\mu}_1) \right]$$
特別地，在標準 VAE（Kingma & Welling, ICLR 2014）設定下，取標準高斯先驗 $\boldsymbol{\mu}_2 = \mathbf{0}, \boldsymbol{\Sigma}_2 = \mathbf{I}_k$，且變分後驗採對角協方差 $\boldsymbol{\Sigma}_1 = \mathrm{diag}(\sigma_1^2, \dots, \sigma_k^2)$，上式退化為 $\mathcal{O}(k)$ 逐元素閉式解 `[DERIVATION]`：
$$D_{\mathrm{KL}}\big(\mathcal{N}(\boldsymbol{\mu}, \mathrm{diag}(\boldsymbol{\sigma}^2)) \parallel \mathcal{N}(\mathbf{0}, \mathbf{I}_k)\big) = -\frac{1}{2} \sum_{j=1}^k \left( 1 + \log(\sigma_j^2) - \mu_j^2 - \sigma_j^2 \right)$$

#### 重參數化技巧（Reparameterization Trick）之低方差梯度路徑 `[DERIVATION]`
若直接對隨機採樣節點 $z \sim q_\phi(z \mid x)$ 求導，利用對數導數技巧（Score-Function / REINFORCE Estimator）：
$$\nabla_\phi \mathbb{E}_{q_\phi}[f(z)] = \mathbb{E}_{q_\phi}\big[f(z) \nabla_\phi \log q_\phi(z \mid x)\big]$$
該估計量的蒙地卡羅梯度方差極高，常導致訓練發散。Kingma & Welling (2014) 提出可微同胚變換 $z = g_\phi(\boldsymbol{\epsilon}, x) = \boldsymbol{\mu}_\phi(x) + \boldsymbol{\sigma}_\phi(x) \odot \boldsymbol{\epsilon}$，其中基礎雜訊 $\boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I}_k)$ 與參數 $\phi$ 完全解耦 `[LITERATURE_RESULT]`。根據測度變換定理（Law of the Unconscious Statistician, LOTUS），期望梯度可直接穿過積分號並沿確定性計算圖反向傳播：
$$\nabla_\phi \mathbb{E}_{z \sim q_\phi(z \mid x)}[f(z)] = \mathbb{E}_{\boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I}_k)}\left[ \nabla_z f(z)^\top \frac{\partial g_\phi(\boldsymbol{\epsilon}, x)}{\partial \phi} \right]$$

---

## 三、⚙️ 計算機體系結構與硬體微架構映射：Log-Sum-Exp 融合、線上 Softmax 歸約與重參數化梯度流

在 GPU 硬體（NVIDIA Ampere / Hopper 架構）上實作機率與資訊論算子時，天真的教科書公式會直接引發 **IEEE 754 浮點數下溢/上溢（Underflow / Overflow）** 與 **HBM 記憶體頻寬瓶頸（Memory-Bound Bottleneck）**：

### 1. IEEE 754 指數溢位與 Log-Sum-Exp (LSE) 超越函數單元 (SFU) 融合
在 FP16（最大可表示正數 $65504 \approx e^{11.09}$）或 BF16（最大可表示正數 $\approx 3.39 \times 10^{38} \approx e^{88.72}$）下，直接先計算 $\exp(z_i)$ 再取 $\log$ 會在 $|z_i| > 89$ 時瞬間產生 `Inf` 或 `0`，導致 $\log(\sum \exp(z_i))$ 崩潰為 `NaN` `[SAFETY_BOUND]`。
工程實作必須強制使用平移不變性恆等式（Shift-Invariance Identity）：
$$\mathrm{LSE}(\mathbf{z}) = \log \sum_{i=1}^V \exp(z_i) = m + \log \sum_{i=1}^V \exp(z_i - m), \quad \text{其中 } m = \max_{1 \le i \le V} z_i$$
此時對所有 $i$ 恆有 $z_i - m \le 0 \implies \exp(z_i - m) \in (0, 1]$，且至少有一項等於 $\exp(0) = 1$，徹底消滅上溢並保證和至少為 $1$（消除 $\log(0)$ 下溢） `[DERIVATION]`。
更關鍵的是，絕對禁止在代碼中分別呼叫 `probs = torch.softmax(logits, dim=-1)` 與 `torch.log(probs)`：這不僅會在極小機率類別產生 `log(0) = -inf`，更會將原本可簡化為線性減法的交叉熵強制送入 GPU **特殊函數單元（Special Function Units, SFU）**執行兩次昂貴的超越函數（$\exp$ 後緊接 $\log$），且額外產生一次完整詞表張量 $(B \times T \times V)$ 的 HBM 讀寫！正確的融合算子 `F.log_softmax` 直接計算 `[DESIGN_DECISION]`：
$$\log P(y = c \mid \mathbf{z}) = z_c - m - \log \sum_{i=1}^V \exp(z_i - m)$$

### 2. Online Softmax / Online LSE 單趟寄存器歸約（Single-Pass Register Reduction）
對於大語言模型（詞表 $V = 128,256$）或長序列注意力（LIB-405），傳統 LSE 需要**三趟 HBM 掃描（3-Pass Memory Scan）**：第一趟求全局最大值 $m$，第二趟累加分母 $\sum \exp(z_i - m)$，第三趟寫出正規化結果。
Milakov & Gimelshein (2018) 提出的 **Online Softmax 演算法**維護一組動態更新的局部統計量 $(m_k, d_k)$，在單趟掃描中透過指數重縮放因子 $\exp(m_{k-1} - m_{\text{new}})$ 即時合併區塊 `[LITERATURE_RESULT]`：
$$m_{\text{new}} = \max(m_{k-1}, z_k), \qquad d_{\text{new}} = d_{k-1} \cdot \exp(m_{k-1} - m_{\text{new}}) + \exp(z_k - m_{\text{new}})$$
在 CUDA Kernel 內部，32 個執行緒組成的 Warp 利用 `__shfl_xor_sync(0xffffffff, val, offset)` 寄存器洗牌指令在 5 個時脈週期（$\log_2 32 = 5$）內完成歸約，將 HBM 記憶體流量直接削減 $66.7\%$ `[EMPIRICAL_RESULT]`。

### 3. 對數方差參數化（Log-Variance Parameterization）與數值安全護欄
在實作高斯變分推論時，神經網路絕對不直接預測標準差 $\sigma$ 或方差 $\sigma^2$（因為線性層輸出範圍為 $(-\infty, +\infty)$，一旦預測出 $\sigma \le 0$，對數項 $\log \sigma^2$ 將立即產生 `NaN`）。
工業級架構強制讓網路預測**對數方差（Log-Variance）** $s \triangleq \log \sigma^2 \in \mathbb{R}$，並透過 $\sigma = \exp(0.5 \cdot s)$ 恢復標準差 `[DESIGN_DECISION]`。為防止早期訓練梯度爆炸導致 $\exp(s)$ 在 FP32 下溢位，必須對 $s$ 施加雙邊軟硬截斷 $s \in [-20.0, 10.0]$ `[SAFETY_BOUND]`。

---

## 四、💻 工業級工程實作：數值穩定變分推論 (ELBO)、解析高斯 KL 與重參數化採樣器

以下提供符合工業級防禦標準的 PyTorch 實作，包含單趟重參數化高斯變分編碼器、具備雙邊截斷的閉式 KL 散度算子，以及交叉熵與 KL 散度的精確分解驗證：

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Tuple, Dict

class VariationalGaussianBottleneck(nn.Module):
    """
    工業級變分高斯資訊瓶頸模組 (Variational Gaussian Bottleneck)
    整合：對數方差安全截斷、重參數化技巧 (Reparameterization Trick) 與閉式解析 KL 散度。
    """
    def __init__(
        self,
        in_features: int,
        latent_dim: int,
        logvar_min: float = -20.0,
        logvar_max: float = 10.0,
    ) -> None:
        super().__init__()
        assert in_features > 0 and latent_dim > 0, "特徵維度與隱空間維度必須為正整數"
        assert logvar_min < logvar_max, "對數方差下界必須嚴格小於上界"
        self.latent_dim = latent_dim
        self.logvar_min = logvar_min
        self.logvar_max = logvar_max
        # 單次融合線性投影同時產出均值 mu 與對數方差 logvar，提升 GEMM 算術強度
        self.proj_moments = nn.Linear(in_features, 2 * latent_dim)

    def reparameterize(self, mu: torch.Tensor, logvar: torch.Tensor) -> torch.Tensor:
        """
        執行低方差重參數化採樣: z = mu + exp(0.5 * logvar) * eps, eps ~ N(0, I)
        輸入張量形狀: mu, logvar 皆為 (B, D)
        輸出張量形狀: z 為 (B, D)
        """
        assert mu.shape == logvar.shape, f"形狀不匹配: {mu.shape} vs {logvar.shape}"
        if not self.training:
            return mu
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + std * eps

    def compute_closed_form_kl(self, mu: torch.Tensor, logvar: torch.Tensor) -> torch.Tensor:
        """
        計算對角高斯 q(z|x) = N(mu, diag(exp(logvar))) 相對於標準先驗 p(z) = N(0, I) 之閉式 KL 散度:
        D_KL = -0.5 * sum_{j=1}^D (1 + logvar_j - mu_j^2 - exp(logvar_j))
        回傳形狀: (B,) 每個樣本之精確非負 KL 散度 (nats)
        """
        kl_per_dim = -0.5 * (1.0 + logvar - mu.pow(2) - logvar.exp())
        kl_per_sample = kl_per_dim.sum(dim=-1)
        # 數值防禦：消除浮點數捨入造成的極微小負值 (-1e-7)
        return torch.clamp(kl_per_sample, min=0.0)

    def forward(self, h: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """
        輸入: h 形狀 (B, in_features)
        輸出: (z, mu, kl_loss) 形狀分別為 (B, D), (B, D), (B,)
        """
        assert h.dim() == 2, f"預期 2D 特徵張量 (B, F)，實際收到 {h.shape}"
        moments = self.proj_moments(h)  # (B, 2*D)
        mu, raw_logvar = torch.chunk(moments, chunks=2, dim=-1)
        # RULE-102-02: 強制截斷對數方差，防止 exp(logvar) 溢位為 Inf 或下溢為 0
        logvar = torch.clamp(raw_logvar, min=self.logvar_min, max=self.logvar_max)
        z = self.reparameterize(mu, logvar)
        kl_loss = self.compute_closed_form_kl(mu, logvar)
        assert torch.isfinite(kl_loss).all(), "偵測到非有限 KL 散度數值！"
        return z, mu, kl_loss


def verify_information_identities(
    logits_p: torch.Tensor,
    logits_q: torch.Tensor,
) -> Dict[str, float]:
    """
    驗證夏農資訊論核心恆等式: H(P, Q) = H(P) + D_KL(P || Q) 且 D_KL(P || Q) >= 0。
    全面使用融合 log_softmax 避免獨立呼叫 log(softmax(z))。
    輸入形狀: logits_p, logits_q 為 (B, V)
    """
    assert logits_p.shape == logits_q.shape and logits_p.dim() == 2
    # RULE-102-01: 使用融合 Log-Sum-Exp 正規化，禁止 torch.log(torch.softmax(...))
    log_p = F.log_softmax(logits_p, dim=-1)
    log_q = F.log_softmax(logits_q, dim=-1)
    p = log_p.exp()

    # 1. 真實分佈內在夏農熵 H(P) = -sum P(x) log P(x)
    entropy_p = -(p * log_p).sum(dim=-1).mean()
    # 2. 交叉熵 H(P, Q) = -sum P(x) log Q(x)
    cross_entropy_pq = -(p * log_q).sum(dim=-1).mean()
    # 3. KL 散度 D_KL(P || Q) = sum P(x) (log P(x) - log Q(x))
    kl_pq = (p * (log_p - log_q)).sum(dim=-1).mean()

    residual = torch.abs(cross_entropy_pq - (entropy_p + kl_pq)).item()
    assert residual < 1e-5, f"資訊論分解恆等式誤差過大: {residual}"
    assert kl_pq.item() >= -1e-6, f"違反 Gibbs 非負不等式: KL={kl_pq.item()}"

    return {
        "H_P_nats": float(entropy_p.item()),
        "H_PQ_nats": float(cross_entropy_pq.item()),
        "KL_PQ_nats": float(kl_pq.item()),
        "identity_residual": float(residual),
    }


if __name__ == "__main__":
    torch.manual_seed(42)
    B, F_in, D_lat, V_vocab = 16, 64, 16, 1000
    bottleneck = VariationalGaussianBottleneck(in_features=F_in, latent_dim=D_lat)
    features = torch.randn(B, F_in, requires_grad=True)
    z, mu, kl = bottleneck(features)
    loss = (z.pow(2).sum(dim=-1) + kl).mean()
    loss.backward()
    assert features.grad is not None and torch.isfinite(features.grad).all()

    metrics = verify_information_identities(
        logits_p=torch.randn(B, V_vocab),
        logits_q=torch.randn(B, V_vocab),
    )
    print(f"[LIB-102 Verified] {metrics}, KL mean={kl.mean().item():.4f} nats")
```

---

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-102-01] 融合對數機率與禁止分離對數軟最大值鐵律 (Fused Log-Softmax & Anti-Naive-Log Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件**: 當 AI Agent 撰寫涉及交叉熵（Cross-Entropy）、KL 散度、策略梯度對數似然 $\log \pi_\theta(a \mid s)$ 或對比學習 InfoNCE Loss 之程式碼時。
- **決策邊界**:
  - **嚴格禁止**先計算機率 `p = torch.softmax(logits, dim=-1)` 再呼叫 `torch.log(p)` 或 `torch.log(p + eps)`。
  - **強制要求**一律呼叫底層融合平移不變算子 `F.log_softmax(logits, dim=-1)`、タスク專屬 `F.cross_entropy(logits, targets)` 或 `torch.logsumexp(logits, dim=-1)`。
- **違規後果**: 在低機率尾部類別中，$\exp(z_i - m)$ 會在 IEEE 754 FP16/BF16 下直接下溢為 `0.0`，隨後 `torch.log(0.0)` 產生 `-inf`，乘上權重或梯度後引發全網 `NaN` 崩潰，且浪費雙倍 GPU SFU 超越函數週期與 HBM 頻寬。

### [RULE-102-02] 變分推論對數方差參數化與閉式 KL 優先合約 (Log-Variance Clamping & Analytic KL Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件**: 實作變分自編碼器（VAE）、隨機狀態空間模型（RSSM）或擴散後驗分佈參數化時。
- **決策邊界**:
  - 神經網路分支必須預測無約束之對數方差 $s = \log \sigma^2$，並在執行 $\exp(s)$ 前強制施加雙邊安全截斷 `logvar = torch.clamp(raw_logvar, min=-20.0, max=10.0)` `[SAFETY_BOUND]`。
  - 當變分分佈 $q_\phi(z \mid x)$ 與先驗 $p(z)$ 皆屬於高斯分佈等指數族（Exponential Family）且存在解析閉式 KL 解時，**強制使用閉式解析公式計算 $D_{\mathrm{KL}}(q_\phi \parallel p)$**，嚴禁對該項使用單樣本蒙地卡羅估計 $\log q_\phi(z) - \log p(z)$。
- **執行保證**: 徹底消滅標準差非正數引發之對數定義域錯誤，並將先驗正則化項的採樣方差降為零。

### [RULE-102-03] 前向與反向 KL 散度非對稱方向選擇協議 (Directional KL Selection Directive)
- **合約等級**: `STRATEGIC_DIRECTIVE`
- **前置條件**: 設計分佈對齊目標函數（如知識蒸餾 Knowledge Distillation、生成模型訓練或強化學習策略約束）。
- **決策邊界**:
  - 若目標為**完整覆蓋多模態真實資料支集（防止 Mode Collapse）**，且擁有來自真實分佈 $P_{\text{data}}$ 的離線樣本，必須選用**前向 KL（Forward KL）** $D_{\mathrm{KL}}(P_{\text{data}} \parallel Q_\theta)$（等價於極大似然交叉熵）。
  - 若目標為**讓輕量或單峰近似分佈 $Q_\phi$ 聚焦於高價值峰值（避免在兩峰之間的零機率禁區生成無效樣本）**，且可評估目標密度或獎勵 $\log P(x)$，則應選用**反向 KL（Reverse KL）** $D_{\mathrm{KL}}(Q_\phi \parallel P)$。

---

## 六、📚 權威論文、經典著作與同行評審文獻 (Canonical & Peer-Reviewed References)

1. **資訊理論開山聖經 (Bell System Technical Journal)**
   - *Paper*: Shannon, C. E. (1948). "A Mathematical Theory of Communication." *The Bell System Technical Journal*, 27(3), 379–423. DOI: [10.1002/j.1538-7305.1948.tb01338.x](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x).
   - *Application*: 定義夏農熵 $H(P)$、交叉熵與無損信源編碼定理之第一性原理公理來源。
2. **Kullback-Leibler 散度原始論文 (Annals of Mathematical Statistics)**
   - *Paper*: Kullback, S., & Leibler, R. A. (1951). "On Information and Sufficiency." *The Annals of Mathematical Statistics*, 22(1), 79–86. DOI: [10.1214/aoms/1177729694](https://doi.org/10.1214/aoms/1177729694).
   - *Application*: 建立相對熵（KL 散度）與充分統計量之測度論基礎。
3. **資訊理論與統計教材權威經典 (Wiley Textbook)**
   - *Book*: Cover, T. M., & Thomas, J. A. (2006). *Elements of Information Theory* (2nd ed.). Wiley-Interscience. ISBN: 978-0-471-24195-9.
   - *Application*: 本卷定理 2.1（Gibbs 不等式）、資料處理不等式與漸近等分性（AEP）之標準引證來源。
4. **變分自編碼器與重參數化技巧奠基作 (ICLR 2014 Test of Time Award)**
   - *Paper*: Kingma, D. P., & Welling, M. (2014). "Auto-Encoding Variational Bayes." *International Conference on Learning Representations (ICLR 2014)*. [arXiv:1312.6114](https://arxiv.org/abs/1312.6114).
   - *Application*: 提出變分證據下界（ELBO）端到端隨機梯度優化、重參數化技巧與對角高斯閉式 KL 公式。
5. **自然梯度與資訊幾何奠基作 (Neural Computation)**
   - *Paper*: Amari, S.-I. (1998). "Natural Gradient Works Efficiently in Learning." *Neural Computation*, 10(2), 251–276. DOI: [10.1162/089976698300017746](https://doi.org/10.1162/089976698300017746).
   - *Application*: 證明 Fisher 資訊矩陣 $\mathbf{F}(\theta)$ 為機率流形之唯一不變黎曼度量張量。
6. **變分推論統計學權威綜述 (JASA)**
   - *Paper*: Blei, D. M., Kucukelbir, A., & McAuliffe, J. D. (2017). "Variational Inference: A Review for Statisticians." *Journal of the American Statistical Association (JASA)*, 112(518), 859–877. DOI: [10.1080/01621459.2017.1285773](https://doi.org/10.1080/01621459.2017.1285773).
   - *Application*: 嚴格闡述平均場變分推論（Mean-Field VI）與前向/反向 KL 散度之幾何偏置。
7. **Online Normalizer Calculation (FlashAttention 數學前驅)**
   - *Paper*: Milakov, M., & Gimelshein, N. (2018). "Online normalizer calculation for softmax." *NVIDIA Technical Report*, [arXiv:1805.02867](https://arxiv.org/abs/1805.02867).
   - *Application*: 推導單趟暫存器歸約之 Online Softmax / LSE 演算法，消除多趟 HBM 讀寫。
