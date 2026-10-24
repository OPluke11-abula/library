---
call_number: LIB-301
status: source-verified
invariants_count: 4
title: 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)
module: Machine-Learning-Theory
category: Statistical-Learning
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Covariate Shift & Radon-Nikodym Importance Weighting
  - Empirical Risk Minimization (ERM) Failure Under Shift
  - 784-Dimensional Linear Separator Hyperplane Analysis
hardware_target:
  - GPU Data Loader Asynchronous Augmentation Pipeline
  - Fast Tensor Rotation & Affine Transformations
created: 2026-09-17
author: Luke
tags:
  - 圖書館
  - 機器學習
  - 資料偏差
  - 領域漂移
  - MNIST
  - 空間懲罰
prerequisites:
  - "[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]"
  - "[[LIB-102 機率統計、資訊理論與變分推論基石 (Probability, Information Theory & Variational Inference)]]"
  - "[[LIB-104 凸最佳化理論與一階二階梯度下降幾何 (Optimization Theory & Gradient Descent)]]"
successors:
  - "[[LIB-401 全連結網路空間極限與卷積神經網路理論必然性 (DNN Spatial Limits & CNN Inductive Bias)]]"
  - "[[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]]"
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/03_machine_learning/LIB-301%20Dataset%20Bias%2C%20Domain%20Shift%20%26%20Spatial%20Penalties%20%28Agent%20EN%29.md)

# 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]、[[LIB-102 機率統計、資訊理論與變分推論基石 (Probability, Information Theory & Variational Inference)]]、[[LIB-104 凸最佳化理論與一階二階梯度下降幾何 (Optimization Theory & Gradient Descent)]]。
- **後續節點**：[[LIB-401 全連結網路空間極限與卷積神經網路理論必然性 (DNN Spatial Limits & CNN Inductive Bias)]]、[[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]]。
- **難度等級**：學士進階 / 機器學習理論核心。

---

## 一、💡 學士直觀心智模型：手寫筆劃形態分佈漂移與特徵空間排他死角

在本次手寫數字辨識的真實畫板測試中，發生了一起令人震撼的「災難性誤判」：
當使用者隨手書寫一個**「短橫樑、主筆劃垂直直挺（Upright uncrossed 7，無橫槓、傾角接近 90 度）」**的數字 7 時，模型沒有猜測 1，也沒有猜測 4，而是以**「100% 的絕對信心度」一口咬定這是數字 8**！

### 1. MNIST 資料集的歷史形態採樣偏置 (NIST SD-1 vs SD-3) `[LITERATURE_RESULT]`
- **資料集不是客觀的上帝視角，它具有強烈的取樣偏置 (Sampling Bias)**。
- MNIST 的原始資料源自 NIST Special Database 3（高中生樣本，筆畫風格自由多變）與 Special Database 1（人口普查局員工樣本，格式標準規範）。
- 在該訓練分佈中，數字 7 的主流形態呈現頂部橫樑長、下半身顯著向左下方傾斜（Slanted crossed/uncrossed 7，傾角約 60°~65°），墨水終點落在畫面左下角。
- 該分佈中極度缺乏「筆直垂直、無橫槓（Upright uncrossed 7）」的字形樣本。在經驗訓練分佈裡，模型經歷數十萬次迭代，從未見過主筆劃垂直立於中央偏右的 7。

### 2. 空間排他性負權重：神經元的扣分禁區
神經網路並非像人類一樣「理解字形的整體美感」，它在 784 個像素座標上各自擺放了權重：
- **正權重 (+)**：如果這個位置有亮光，加分！
- **負權重 (-)**：**如果這個位置有亮光，瘋狂扣分！**
為了把 7 與 8、9、0 等字形區分開，模型在數字 7 的權重分佈中，對**「畫面中右側垂直區域」**施加了極其嚴苛的巨大負權重。直立無橫槓的 7 恰好把長長的主筆劃踩進了這個「扣分禁區」，導致 7 的 Logit 被嚴重壓低；而這條豎筆又剛好與 8 的右半邊圓弧重疊，引發了 100% 誤判為 8 的偽特徵陷阱。

---

## 二、🎓 博士級數學形式化推導：協變量漂移 (Covariate Shift) 與空間懲罰超平面

### 1. 經驗風險最小化 (ERM) 在領域漂移下的泛化界崩潰 `[FACT]`
機器學習的基礎假設是 **I.I.D.（獨立同分佈假設）**：訓練集與測試集採樣自完全相同的聯合機率分佈 $P(X, Y)$。
設經驗風險最小化目標為：
$$\hat{R}(f) = \frac{1}{N} \sum_{i=1}^N \mathcal{L}(f(x_i), y_i)$$
在真實世界落地中，面臨的是**協變量漂移 (Covariate Shift)** `[FACT]`：
$$P_{\text{train}}(Y \mid X) = P_{\text{test}}(Y \mid X), \quad \text{但} \quad P_{\text{train}}(X) \neq P_{\text{test}}(X)$$
Ben-David et al. (Machine Learning 2010) 證明了領域適應的泛化誤差上界 `[LITERATURE_RESULT]`：
$$\epsilon_{\text{target}}(f) \le \epsilon_{\text{source}}(f) + \frac{1}{2} d_{\mathcal{H}\Delta\mathcal{H}}(\mathcal{D}_{\text{source}}, \mathcal{D}_{\text{target}}) + \lambda^*$$
其中 $d_{\mathcal{H}\Delta\mathcal{H}}$ 為兩個領域在假設空間 $\mathcal{H}$ 下的 $\mathcal{H}$-散度（H-Divergence），$\lambda^*$ 為理想聯合假設的誤差。
- 美式 MNIST 分佈 $\mathcal{D}_{\text{source}}$ 與亞洲書寫分佈 $\mathcal{D}_{\text{target}}$ 的散度極大，使原先在測試集高達 98.24% 的模型，在目標領域泛化誤差界限直接失控崩潰。
- **延伸至大型語言模型之預訓練語料文化與語系偏差 (Pretraining Linguistic & Cultural Corpus Bias)** `[FACT]` `[HEURISTIC]`：分佈偏差同樣支配自然語言模型。當預訓練語料中不同語系或文化圈之文本比例嚴重失衡（例如簡體中文語料佔比遠高於繁體中文，$P_{\text{train}}(\mathcal{D}_{\text{SC}}) \gg P_{\text{train}}(\mathcal{D}_{\text{TC}})$），即使後續透過後處理微調或表徵消融移除顯式敏感詞審查（如 R1-1776 去審查模型），底層參數分佈 $P_\theta(Y \mid X)$ 仍會保留高密度語料區的詞彙慣用度、概念框架與隱性價值假設，在跨語境部署時產生潛移默化的概念漂移（Concept & Prior Drift）。

### 2. Logits 空間超曲面與空間懲罰向量分析
全連結輸出層在 Softmax 前對第 $c$ 類別的評分為線性內積：
$$z_c(x) = \mathbf{w}_c^T \mathbf{x} + b_c = \sum_{p=1}^{784} w_{c, p} \cdot x_p + b_c$$
我們將輸入影像向量分解為兩個正交空間成分：
$$\mathbf{x} = \mathbf{x}_{\text{support}} + \mathbf{x}_{\text{penalty}}$$
- $\mathbf{x}_{\text{support}}$：與正權重子空間對齊的有效筆劃。
- $\mathbf{x}_{\text{penalty}}$：踩入負權重區域的筆劃。
對於數字類別 $c = 7$：
$$z_7(\mathbf{x}) = \underbrace{\mathbf{w}_{7, \text{pos}}^T \mathbf{x}_{\text{support}}}_{\text{有限加分}} + \underbrace{\mathbf{w}_{7, \text{neg}}^T \mathbf{x}_{\text{penalty}}}_{\text{劇烈懲罰 (極大負數)}} + b_7 \ll 0$$
與此同時，對於類別 $c = 8$：
$$z_8(\mathbf{x}) = \mathbf{w}_{8, \text{pos}}^T \mathbf{x}_{\text{penalty}} + \dots > 0$$
當 $z_7 \to -\infty$ 且 $z_8 \gg 0$ 時，Softmax 機率呈現病態飽和：
$$P(Y = 8 \mid \mathbf{x}) = \frac{e^{z_8}}{e^{z_8} + e^{z_7} + \sum_{k \neq 7, 8} e^{z_k}} \approx 1.000000$$

### 3. 網路容量決策邊界、$L_1 / L_2$ 權重衰減微積分推導與 `EarlyStopping` 狀態回滾機制 `[DERIVATION]` `[FACT]` `[SAFETY_BOUND]`
1. **網路深度容量與決策邊界曲率（以雙月流形 Moons 為例）**：
   在帶雜訊之二維非線性交錯流形（如 Moons 資料集）中，ReLU 網路將輸入空間切割為指數級數量之分段線性超平面區域（$O((n_{\text{hidden}})^L)$）。當隱藏層由 2 層增至 5～6 層且未施加正則化時，過剩的模型容量會彎曲決策邊界以孤立包圍個別離群雜訊點（高方差過擬合）。
2. **$L_2$ 權重衰減（比例收縮）vs. $L_1$ 正則化（次梯度稀疏特徵選擇）** `[DERIVATION]`：
   - **$L_2$ 正則化 (Ridge / Weight Decay)**：在原始損失 $J(W)$ 加入二次範數懲罰 $\tilde{J}(W) = J(W) + \frac{\alpha}{2} \|W\|_2^2$，對權重求導得 $\nabla \tilde{J}(W) = \nabla J(W) + \alpha W$。代入梯度下降更新步：
     $$W_{t+1} = W_t - \eta \left(\nabla J(W_t) + \alpha W_t\right) = (1 - \eta \alpha) W_t - \eta \nabla J(W_t)$$
     這在幾何上等價於每一步更新前先將權重向量以因子 $(1 - \eta\alpha) < 1$ **等比例向原點線性收縮**，抑制高頻權重震盪並平滑決策邊界（$\alpha \in [10^{-4}, 10^{-2}]$ 為理想平滑區間；若 $\alpha \ge 0.1$ 則過度壓制權重引發欠擬合）。
   - **$L_1$ 正則化 (Lasso)**：加入絕對值總和懲罰 $\tilde{J}(W) = J(W) + \alpha \|W\|_1$，其更新步包含常數次梯度項 $W_{t+1} = W_t - \eta \nabla J(W_t) - \eta \alpha \cdot \text{sign}(W_t)$，以恆定力道將微弱冗餘特徵之權重直接推至精確的 $0$，達成稀疏化特徵篩選。
3. **Inverted Dropout 破除神經元共適應 (Co-adaptation)** `[FACT]`：
   訓練時以保留率 $q = 1 - p$ 執行伯努利遮罩並放大 $\tilde{h} = \frac{1}{q} (m \odot h)$，強迫每個神經元無法依賴特定同伴特徵（破除共適應），同時維持前向期望值 $\mathbb{E}[\tilde{h}] = h$，使推論階段無需再次縮放權重。
4. **`EarlyStopping` 權重回滾陷阱 (`restore_best_weights=True`)** `[SAFETY_BOUND]`：
   當以容忍輪數 `patience = P`（如 $P = 20$）與最小改善閾值 `min_delta` 監控驗證集指標時，若驗證損失在第 $t^*$ 輪達到極小值後連續上升 $P$ 輪並於第 $t^* + P$ 輪觸發停訓：若未顯式開啟 `restore_best_weights=True`（多數框架早期預設為 `False`），最終保留在記憶體中的模型實際上是**已經過擬合退化 $P$ 個 Epoch 的第 $t^* + P$ 輪劣質權重**！生產管線必須強制鎖定 `restore_best_weights=True` 或顯式重載最佳 Checkpoint。

---

## 三、⚙️ 計算機體系結構與硬體微架構映射

在資料管線（Data Pipeline）中，解決分佈漂移往往需要導入**在線資料擴增 (Data Augmentation)**。這直接牽涉到 CPU 與 GPU 之間的資料傳輸頻寬瓶頸：

### 1. CPU-GPU 資料搬移瓶頸 (PCIe Bottleneck)
- 若在 CPU 上使用 PIL 或 OpenCV 進行隨機旋轉與仿射形變：
  - CPU 運算能力有限，容易成為整個訓練迴圈的瓶頸（GPU 經常處於 0% 利用率等待資料 Worker）。
  - 擴增完成的圖片必須透過 **PCIe 匯流排（PCIe 4.0 x16 頻寬約 31.5 GB/s）** 搬移到 GPU 顯存。
- **現代架構解決方案**：
  - 保持原始批次直接上傳 GPU，在顯存中透過 **Kornia** 或 **PyTorch Torchvision v2** 調用 CUDA Core 並行執行仿射幾何矩陣變換，速度提升 10~20 倍，完全消滅 CPU 瓶頸。

---

## 四、💻 工業級工程實作：權重懲罰熱圖可視化與彈性資料增強管線

以下代碼示範如何從訓練好的 PyTorch 線性層中提取各類別的 784 維權重，還原為 $28 \times 28$ 的「空間獎懲矩陣」，直接肉眼觀察 7 的負權重禁區：

```python
import torch
import numpy as np

def inspect_spatial_weight_penalty(linear_layer_weight: torch.Tensor):
    """
    可視化全連結層的空間權重懲罰熱圖
    linear_layer_weight: [10, 784]
    """
    # 提取數字 7 與數字 8 的權重向量
    w_7 = linear_layer_weight[7].view(28, 28).detach().cpu().numpy()
    w_8 = linear_layer_weight[8].view(28, 28).detach().cpu().numpy()
    
    # 統計 7 的右下角禁區 (x >= 14, y >= 14) 的負權重強度
    penalty_zone_7 = w_7[14:, 14:]
    mean_penalty_7 = np.mean(penalty_zone_7[penalty_zone_7 < 0])
    
    # 統計 8 在該區域的正權重支援度
    support_zone_8 = w_8[14:, 14:]
    mean_support_8 = np.mean(support_zone_8[support_zone_8 > 0])
    
    print(f"數字 7 右下角空間負權重均值: {mean_penalty_7:.4f} (強烈扣分區)")
    print(f"數字 8 右下角空間正權重均值: {mean_support_8:.4f} (高度獎勵區)")
    return w_7, w_8

# 抗領域漂移的 GPU 資料增強管線
import torchvision.transforms.v2 as T

gpu_augmentation_pipeline = T.Compose([
    T.RandomRotation(degrees=15),                               # 克服筆劃形態傾角變異 (Slanted vs Upright)
    T.RandomAffine(degrees=0, translate=(0.08, 0.08), shear=10),# 克服橫樑長度與剪切變換
    T.ToDtype(torch.float32, scale=True),
    T.Normalize(mean=[0.1307], std=[0.3081])
])
```

---
---
---

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-301-01] 分佈外 (OOD) 與協變量漂移熔斷合約 (Covariate Shift OOD Guardrail)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件 (Pre-conditions)**: 測試樣本 $x_{\text{test}}$ 輸入至分類模型。
- **量化決策邊界 (Decision Thresholds)**:
  - 分類器輸出 Softmax 置信度最高值 $p_{\max} = \max_k P(y=k|x)$。
  - 同步利用預訓練自編碼器 (Autoencoder) 計算重構誤差 $\text{MSE}(x, \hat{x})$。
  - 熔斷判定：若 $p_{\max} > 0.95$ 但 $\text{MSE}(x, \hat{x}) > \tau_{\text{OOD}} = 0.08$，判定發生**捷徑學習 (Shortcut Learning) 與領域漂移**。
- **執行保證 (Post-conditions)**: 嚴禁採信該高置信度預測，標記為 OOD 警報並轉入人工或備用管線。
- **可執行斷言**:
```python
if recon_error > 0.08 and max_prob > 0.95:
    raise OODDriftAlert("偵測到形態分佈漂移樣本！禁止採信捷徑過度自信預測。")
```

### [RULE-301-02] 空間墨水質心前處理牽引合約 (Center of Mass Alignment Safeguard)
- **合約等級**: `BOUNDARY_GUARD`
- **前置條件 (Pre-conditions)**: 任何二維手寫影像進入特徵擷取前。
- **量化決策邊界 (Decision Thresholds)**:
  - 必須強制調用 [[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]] 質心定位演算法。
  - 計算重心座標 $(\bar{x}, \bar{y})$，將筆劃中心牽引至畫布中心 $(13.5, 13.5)$。
  - 重心容忍殘差：$|\bar{x}_{\text{aligned}} - 13.5| \le 0.5$ 像素。
- **執行保證**: 防止因為書寫偏位直接踩入全連結權重矩陣的負權重扣分陷阱。

### [RULE-301-03] 抗領域漂移資料增強與邊界保留強制合約 (Data Augmentation & Mass Preservation Invariant)
- **合約等級**: `OPTIMIZATION_HEURISTIC`
- **前置條件 (Pre-conditions)**: 構建手寫字元訓練管線。
- **量化決策邊界 (Decision Thresholds)**:
  - 必須強制包含幾何抗漂移增強：
    - 隨機旋轉角度：$\theta \in [-15^\circ, +15^\circ]$（涵蓋傾斜與直立風格）。
    - 隨機橫向剪切：$\text{shear} \in [-10^\circ, +10^\circ]$。
    - 隨機平移：$\pm 8\%$ 畫布尺寸。
  - 邊界墨水保留約束：增強變換後必須保證 $\ge 90\%$ 的前景墨水質量（Foreground Ink Mass）保留於中央有效感受野區域內，嚴禁將關鍵拓樸筆劃裁切出畫布外。
- **執行保證**: 阻斷模型僅憑像素絕對空間座標做死記硬背，強迫學習拓樸筆劃特徵。

### [RULE-301-04] 正則化容量約束與早停最佳權重回滾合約 (Regularization Capacity & EarlyStopping Rollback Invariant)
- **合約等級**: `QUALITY_BOUND`
- **前置條件 (Pre-conditions)**: 在有限樣本或含噪資料集上訓練多層神經網路（$L \ge 3$）並配置驗證集早停機制（`EarlyStopping`）。
- **量化決策邊界 (Decision Thresholds)**:
  - **權重衰減區間**：必須配置 $L_2$ 權重衰減係數 $\alpha \in [10^{-5}, 10^{-2}]$（防止 $\alpha = 0$ 高曲率過擬合或 $\alpha \ge 0.1$ 欠擬合坍縮）與隱藏層 `Dropout`（$p \in [0.2, 0.5]$）。
  - **早停狀態強制回滾 (`restore_best_weights=True`)**：任何 `EarlyStopping(patience=P)` 回調或自訂早停迴圈，必須強制設定 `restore_best_weights=True`（或在停訓時從磁碟重載 $t^* = \arg\min_t \mathcal{L}_{\text{val}}(t)$ 之最佳權重），嚴禁直接導出第 $t^* + P$ 輪之末端退化權重。
- **可執行斷言**:
```python
assert getattr(early_stopping_cb, "restore_best_weights", False) is True, "EarlyStopping 必須開啟 restore_best_weights=True 防止保留過擬合末端權重！"
```
---

## 六、📚 權威論文、經典著作與同行評審文獻 (Canonical & Peer-Reviewed References)

1. **協變量漂移 (Covariate Shift) 統計理論奠基作**
   - *Paper*: Shimodaira, H. (2000). "Improving predictive inference under covariate shift by weighting the log-likelihood function." *Journal of Statistical Planning and Inference*, 90(2), 227-244. DOI: [10.1016/S0378-3758(00)00115-4](https://doi.org/10.1016/S0378-3758(00)00115-4).
   - *Core Contribution*: 證明當輸入分佈 $P(x)$ 漂移但條件分佈 $P(y|x)$ 不變時，傳統經驗風險最小化 (ERM) 會產生系統性偏差，必須引入重要性加權 (Importance Weighting)。
2. **電腦視覺資料集偏差經典 (CVPR 頂會)**
   - *Paper*: Torralba, A., & Efros, A. A. (2011). "Unbiased look at dataset bias." *IEEE Conference on Computer Vision and Pattern Recognition (CVPR 2011)*, pp. 1521-1528. DOI: [10.1109/CVPR.2011.5995347](https://doi.org/10.1109/CVPR.2011.5995347).
   - *Core Contribution*: 實證揭露視覺資料集內在「攝影師偏見與文化偏差」，指出跨資料集交叉評測之斷崖式性能跌落現象。
3. **深度學習捷徑學習 (Shortcut Learning) 權威綜述**
   - *Paper*: Geirhos, R., Jacobsen, J. H., Michaelis, C., Zemel, R., Brendel, W., Bethge, M., & Wichmann, F. A. (2020). "Shortcut Learning in Deep Neural Networks." *Nature Machine Intelligence*, 2(11), 665-673. DOI: [10.1038/s42256-020-00257-z](https://doi.org/10.1038/s42256-020-00257-z).
   - *Core Contribution*: 系統化闡明深度網路傾向學習背景紋理與非本質偽相關性（如 MNIST 7 之美式負權重陷阱），導致分佈外 (OOD) 泛化失敗。
4. **統計學習理論經典**
   - *Book*: Vapnik, V. (1998). *Statistical Learning Theory*. John Wiley & Sons. ISBN: 978-0471030034.
   - *Core Contribution*: VC 維度、結構風險最小化 (SRM) 與泛化界限理論。
