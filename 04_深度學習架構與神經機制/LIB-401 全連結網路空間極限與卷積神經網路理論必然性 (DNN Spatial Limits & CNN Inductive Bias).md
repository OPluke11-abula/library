---
call_number: LIB-401
status: source-verified
invariants_count: 4
title: 全連結網路空間極限與卷積神經網路理論必然性 (DNN Spatial Limits & CNN Inductive Bias)
module: Deep-Learning-Foundations
category: Neural-Architectures
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Universal Approximation Theorem (UAT) vs Sample Complexity
  - Lie Group Translation Equivariance Operator Proof
  - Spatial Inductive Bias & Parameter Sharing Efficiency
hardware_target:
  - GPU cuDNN 2D Convolutions & Winograd Algorithm
  - Shared Memory Kernel Stacking
created: 2026-09-17
author: Luke
tags:
  - 圖書館
  - 深度學習
  - CNN
  - DNN
  - 歸納偏置
  - 平移等變性
prerequisites:
  - "[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]"
  - "[[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]"
  - "[[LIB-301 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)]]"
successors:
  - "[[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]]"
  - "[[LIB-901 經典專案實證復盤：從課堂作業到生產級 MNIST 手寫辨識系統 (Classic Project Post-Mortem - From Class Assignment to Production MNIST System)]]"
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/04_deep_learning_architectures/LIB-401%20DNN%20Spatial%20Limits%20%26%20CNN%20Inductive%20Bias%20%28Agent%20EN%29.md)

# 全連結網路空間極限與卷積神經網路理論必然性 (DNN Spatial Limits & CNN Inductive Bias)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]、[[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]、[[LIB-301 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)]]。
- **後續節點**：[[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]]、[[LIB-901 經典專案實證復盤：從課堂作業到生產級 MNIST 手寫辨識系統 (Classic Project Post-Mortem - From Class Assignment to Production MNIST System)]]。
- **難度等級**：學士核心 / 深度學習架構基石。

---

## 一、💡 學士直觀心智模型：鋼鐵模板 vs 靈巧的滑動放大鏡

想像你有兩種工具來檢查一張照片上的貓咪：
1. **全連結神經網路 (Fully Connected / Dense Layer)**：像是一塊巨大的**鋼鐵模板**。
   - 鋼鐵模板上每一個位置都鑽了一個固定的小孔。
   - 它認定：「貓耳朵必須出現在第 3 排第 5 列，貓尾巴必須出現在第 20 排第 25 列」。
   - 如果貓咪稍微往右跳了 3 公分，鋼鐵模板的小孔對準的全部變成了地毯背景，它立刻陷入恐慌，判定「這根本不是貓」！
2. **卷積神經網路 (CNN)**：像是一個**拿著放大鏡在畫面上到處滑動的偵探**。
   - 偵探手裡拿著一個微小的特徵鏡頭（例如 $3 \times 3$ 像素）。
   - 他不管貓咪跳到畫面的正中央、左上角還是邊緣，放大鏡掃過哪裡，就能在哪裡捕捉到「三角形耳朵」或「圓形瞳孔」。
   - 這種「特徵不論出現在哪裡都能被抓到」的神奇能力，在數學上就叫做**平移等變性 (Translation Equivariance)**。

---

## 二、🎓 博士級數學形式化推導：通用近似定理的虛妄與平移等變性證明

### 1. 通用近似定理 (Universal Approximation Theorem) 的樣本複雜度陷阱
Cybenko (1989) `[LITERATURE_RESULT]` 與 Hornik (1991) 證明了著名的通用近似定理：
> 「一個包含單一隱藏層與非線性激活函數 $\sigma$ 的前饋全連結網路，只要神經元數量足夠多，就能在緊緻子集上以任意精度逼近任意連續泛函。」

**博士級反思**：為什麼 8 層、90 萬參數的全連結網路在手寫板上依然崩潰？
- 通用近似定理只證明了**「存在性 (Existence)」**，卻對**「樣本複雜度 (Sample Complexity)」**閉口不提！
- 在 $D = 784$ 維的連續空間中，若要均勻覆蓋哪怕是微小的幾何旋轉與位移變化，所需無偏樣本數量呈指數級爆炸 $O(2^D)$（維度災難 Curse of Dimensionality）。
- 全連結層將影像強制展平為一維向量 $\mathbf{x} = [x_1, \dots, x_{784}]^T$，人為摧毀了流形幾何的局部鄰近性（Locality）。神經元認為第 1 個像素與第 2 個像素的關係，和第 1 個與第 784 個像素毫無差別！

### 2. 李群平移算子與卷積的平移等變性 (Proof of Translation Equivariance)
設二維連續訊號 $f: \mathbb{R}^2 \to \mathbb{R}$，定義平移算子 $\tau_h$（其中 $h \in \mathbb{R}^2$）為：
$$(\tau_h f)(x) = f(x - h)$$
定義卷積運算 $*$（核函數為 $g$）：
$$(f * g)(x) = \int_{\mathbb{R}^2} f(y) g(x - y) \, dy$$
**定理**：卷積算子與平移算子可交換，即卷積具備嚴格的平移等變性：
$$\tau_h (f * g) = (\tau_h f) * g$$
**嚴格證明**：
$$\begin{aligned}
[(\tau_h f) * g](x) &= \int_{\mathbb{R}^2} (\tau_h f)(y) g(x - y) \, dy \\
&= \int_{\mathbb{R}^2} f(y - h) g(x - y) \, dy \\
\text{令 } u = y - h \implies y = u + h, \quad dy = du: \\
&= \int_{\mathbb{R}^2} f(u) g(x - (u + h)) \, du \\
&= \int_{\mathbb{R}^2} f(u) g((x - h) - u) \, du \\
&= (f * g)(x - h) = [\tau_h (f * g)](x) \quad \blacksquare
\end{aligned}$$
這項數學證明宣告：**卷積層天然將物理世界中最根本的對稱性——空間平移對稱性，作為硬約束刻進了架構先驗中（Inductive Bias）**。模型不需要消耗額外訓練樣本去死記「這個字形向右移動 3 像素還是同一個字」。

### 3. 感受野 (Receptive Field) 的階層遞迴公式
設第 $l$ 層的卷積核尺寸為 $k_l$，步幅為 $s_l$。其感受野 $RF_l$ 滿足數學遞迴：
$$RF_l = RF_{l-1} + (k_l - 1) \cdot \prod_{i=1}^{l-1} s_i, \quad \text{其中 } RF_0 = 1$$
深層網路透過堆疊多個小卷積核（如兩個 $3 \times 3$ 卷積核等效於一個 $5 \times 5$ 的感受野，但參數量減少了 $2 \times 9 / 25 = 28\%$，且多了兩次非線性激活），實現由局部邊緣向全域抽象語意的金字塔式提煉。

### 4. 離散方向導數先驗（Sobel 算子）與經典 CNN 骨幹演進（LeNet-5 $\to$ VGG $\to$ GoogLeNet/Inception） `[DERIVATION]` `[LITERATURE_RESULT]`
1. **Sobel 一階差分邊緣算子先驗**：
   在傳統數位影像處理中，偵測垂直與水平灰階梯度依靠 $3 \times 3$ Sobel 卷積核：
   $$K_x = \begin{bmatrix} -1 & 0 & +1 \\ -2 & 0 & +2 \\ -1 & 0 & +1 \end{bmatrix} \approx \frac{\partial I}{\partial x}, \quad K_y = \begin{bmatrix} -1 & -2 & -1 \\ 0 & 0 & 0 \\ +1 & +2 & +1 \end{bmatrix} \approx \frac{\partial I}{\partial y}$$
   現代 CNN 第一層卷積核在隨機初始化後經反向傳播訓練，會自發收斂出與 Sobel 差分算子及 Gabor 濾波器高度同構的邊緣與頻率基函數。
2. **VGG 小卷積核因式分解定理 (Simonyan & Zisserman, ICLR 2015)** `[DERIVATION]`：
   由感受野遞迴公式可知，連續堆疊 $m$ 層步幅 $s=1$ 的 $3 \times 3$ 卷積層，其等效感受野為 $RF = 2m + 1$（即 $m=2$ 等效於 $5 \times 5$，$m=3$ 等效於 $7 \times 7$）。設輸入與輸出通道數同為 $C$：
   - 單層 $7 \times 7$ 卷積參數量：$7^2 C^2 = 49 C^2$（僅含 1 次 ReLU 非線性折疊）。
   - 三層 $3 \times 3$ 卷積堆疊參數量：$3 \times (3^2 C^2) = 27 C^2$（**參數量與計算量直接削減 $44.9\%$**，且注入 3 次 ReLU 非線性決策折疊）。
3. **GoogLeNet / Inception $1 \times 1$ 逐點卷積瓶頸 (Pointwise Bottleneck) 與全域平均池化 (`GlobalAvgPool2D`)** (Szegedy et al., CVPR 2015; Lin et al., ICLR 2014) `[DERIVATION]` `[FACT]`：
   - **$1 \times 1$ 降維瓶頸計算量壓縮證明**：設輸入特徵圖尺寸為 $H \times W \times C_{\text{in}}$（例如 $C_{\text{in}} = 192$），目標經由 $k \times k$（如 $5 \times 5$）卷積輸出 $C_{\text{out}} = 32$ 通道：
     - **直接 $5 \times 5$ 卷積**：每像素乘加次數（MACs/pixel）為 $5^2 \cdot C_{\text{in}} \cdot C_{\text{out}} = 25 \times 192 \times 32 = 153,600$。
     - **Inception $1 \times 1$ 瓶頸分解**（先以 $1 \times 1$ 卷積將通道投影至低維瓶頸 $C_{\text{mid}} = 16$，再執行 $5 \times 5$ 卷積）：
       $$\text{MACs/pixel}_{\text{bottleneck}} = (1^2 \cdot C_{\text{in}} \cdot C_{\text{mid}}) + (k^2 \cdot C_{\text{mid}} \cdot C_{\text{out}}) = (1 \times 192 \times 16) + (25 \times 16 \times 32) = 3,072 + 12,800 = 15,872$$
       壓縮比達 **$\frac{153,600}{15,872} \approx 9.68\times$**，在不損失 $5 \times 5$ 空間感受野的前提下消除了近九成冗餘運算。
   - **以 `GlobalAvgPool2D` 終結全連結分類頭的參數黑洞**：
     在 VGG-16 中，末端 $7 \times 7 \times 512 = 25,088$ 維特徵圖經 `Flatten()` 接入 `Dense(4096)`，單層即消耗 $25,088 \times 4,096 \approx 1.0276 \times 10^8$ 個參數（佔全網路 $1.38 \times 10^8$ 總參數量的 **$74.5\%$**），極易在小樣本資料集上引發嚴重過擬合。GoogLeNet 與 ResNet 引入全域平均池化（Global Average Pooling, GAP）：
     $$z_c = \frac{1}{H \times W} \sum_{i=1}^H \sum_{j=1}^W F_{i, j, c}, \quad \forall c \in \{1, \dots, C\}$$
     將每個空間通道直接坍縮為單一純量語意響應（輸出 $[B, C]$），使特徵圖至分類頭之過渡層參數量降至 **$0$**，同時賦予任意輸入解析度的平移不變性。

### 5. 一維時序卷積 (`Conv1D`) 與多層循環神經網路 (`RNN`) 之張量秩守恆定理 `[DERIVATION]` `[FACT]`
當處理離散序列特徵（如自然語言詞嵌入序列 $X \in \mathbb{R}^{B \times T \times D_{\text{emb}}}$，$B$ 為批次、$T$ 為序列長度、$D_{\text{emb}}$ 為嵌入維度）時，存在兩大歸納偏置範式：
1. **時序一維卷積 (`Conv1D + GlobalMaxPool1D`)**：
   以核寬 $k$ 的一維濾波器 $W \in \mathbb{R}^{k \times D_{\text{emb}} \times C_{\text{out}}}$ 沿時間軸 $T$ 滑動萃取局部 $k$-gram 組合特徵，時間步之間完全無狀態依賴，序列平行深度為 **$O(1)$**，可 100% 映射至 GPU SIMT Warp 並行矩陣乘法。
2. **循環神經網路 (`SimpleRNN` / `LSTM`) 與多層堆疊張量秩守恆**：
   RNN 透過隱狀態遞迴方程 $h_t^{(l)} = \tanh(W_{xh}^{(l)} h_t^{(l-1)} + W_{hh}^{(l)} h_{t-1}^{(l)} + b_h^{(l)})$ 維護跨時間步記憶（單步執行時單元輸出與新狀態共享同一記憶體參照 `out is h1[0]`），其序列相依深度為 **$O(T)$**，且隨 $T$ 增長受雅可比連乘 $\frac{\partial h_T}{\partial h_1} = \prod_{t=2}^T \text{diag}(1 - (h_t)^2) W_{hh}^T$ 支配而易生梯度消失或爆炸。
   - **`[SAFETY_BOUND]` 多層堆疊張量秩守恆定理 (`return_sequences=True`)**：當垂直堆疊 $L \ge 2$ 層循環網路時，第 $l$ 層（$1 \le l \le L-1$）必須對下一層 $l+1$ 的每一個時間步 $t \in \{1, \dots, T\}$ 提供輸入向量。因此，所有**非終端循環層**（$l < L$）必須保留時間維度，輸出三階張量 $H^{(l)} = [h_1^{(l)}, \dots, h_T^{(l)}] \in \mathbb{R}^{B \times T \times D_h}$（即強制設定 `return_sequences=True`）；僅最後一層循環層（$l = L$）在接入序列級分類頭 `Dense` 前可取末端狀態 $h_T^{(L)} \in \mathbb{R}^{B \times D_h}$（`return_sequences=False`）。若在中間層誤設為 `False`，三階時序張量將提前坍縮為二階矩陣 $[B, D_h]$，導致下一層循環算子因喪失時間軸而拋出維度崩潰例外。

---

## 三、⚙️ 計算機體系結構與硬體微架構映射

卷積在數學上是滑動積分，但在現代硬體底層，它被轉換為極高吞吐量的矩陣乘法：

### 1. Im2Col (Image to Column) 轉換演算法
GPU 不擅長執行細碎的滑動窗口循環，但極其擅長大矩陣乘法 (GEMM)。
- **Im2Col**：將特徵圖中每個卷積核滑過的小區塊（Patch），展開為矩陣的一列。
- 將卷積核權重展平為另一矩陣。
- 卷積運算瞬間轉化為標準的 **BLAS Level 3 GEMM**：
  $$\text{Output Matrix} = \text{Kernel Matrix} \times \text{Im2Col Matrix}$$
- 配合 NVIDIA Tensor Cores，以超高速瓦片乘法瞬間完成。

### 2. Winograd 卷積加速
對於小型卷積核（如 $3 \times 3$）：
- Winograd $F(2 \times 2, 3 \times 3)$ 演算法利用空間多項式變換，將單次卷積乘法次數由 36 次減少為 16 次，**計算複雜度降低 2.25 倍**，廣泛應用於 cuDNN 底層引擎。

---

## 四、💻 工業級工程實作：8 層 DNN vs 輕量 CNN 空間抗形變消融實證

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class DeepOverfittedDNN(nn.Module):
    """8 層深度過擬合 DNN (約 90 萬參數)"""
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(784, 512), nn.ReLU(),
            nn.Linear(512, 512), nn.ReLU(),
            nn.Linear(512, 256), nn.ReLU(),
            nn.Linear(256, 256), nn.ReLU(),
            nn.Linear(256, 128), nn.ReLU(),
            nn.Linear(128, 64),  nn.ReLU(),
            nn.Linear(64, 32),   nn.ReLU(),
            nn.Linear(32, 10)
        )
    def forward(self, x):
        return self.net(x.view(x.size(0), -1))

class RobustLeNet(nn.Module):
    """具備平移等變性之輕量 CNN (約 6 萬參數)"""
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 16, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(16, 32, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(32 * 7 * 7, 64)
        self.fc2 = nn.Linear(64, 10)
        
    def forward(self, x):
        # x: [B, 1, 28, 28]
        x = self.pool(F.relu(self.conv1(x))) # [B, 16, 14, 14]
        x = self.pool(F.relu(self.conv2(x))) # [B, 32, 7, 7]
        x = x.view(x.size(0), -1)
        x = F.relu(self.fc1(x))
        return self.fc2(x)

def compare_spatial_robustness():
    dnn = DeepOverfittedDNN()
    cnn = RobustLeNet()
    
    # 建立一個中央為 1 的手寫影像
    sample = torch.zeros(1, 1, 28, 28)
    sample[0, 0, 8:20, 13:15] = 1.0 # 豎線
    
    # 平移 3 個像素
    sample_shifted = torch.roll(sample, shifts=(0, 3), dims=(2, 3))
    
    # 評估特徵輸出向量餘弦相似度
    feat_dnn_orig = dnn.net[:-1](sample.view(1, -1))
    feat_dnn_shift = dnn.net[:-1](sample_shifted.view(1, -1))
    cos_dnn = F.cosine_similarity(feat_dnn_orig, feat_dnn_shift).item()
    
    # CNN 全域平均池化前特徵響應
    feat_cnn_orig = cnn.pool(F.relu(cnn.conv2(cnn.pool(F.relu(cnn.conv1(sample)))))).mean(dim=[2, 3])
    feat_cnn_shift = cnn.pool(F.relu(cnn.conv2(cnn.pool(F.relu(cnn.conv1(sample_shifted)))))).mean(dim=[2, 3])
    cos_cnn = F.cosine_similarity(feat_cnn_orig, feat_cnn_shift).item()
    
    print(f"平移 3 像素後 DNN 高層特徵餘弦相似度: {cos_dnn:.4f} (特徵表徵崩塌)")
    print(f"平移 3 像素後 CNN 高層特徵餘弦相似度: {cos_cnn:.4f} (高度平移穩健性)")

if __name__ == "__main__":
    compare_spatial_robustness()
    # 驗證 Inception 1x1 逐點卷積瓶頸之參數量壓縮比 (192 -> 16 -> 32, k=5)
    direct_conv5x5 = nn.Conv2d(192, 32, kernel_size=5, padding=2, bias=False)
    bottleneck_conv5x5 = nn.Sequential(
        nn.Conv2d(192, 16, kernel_size=1, bias=False),
        nn.Conv2d(16, 32, kernel_size=5, padding=2, bias=False)
    )
    params_direct = sum(p.numel() for p in direct_conv5x5.parameters())
    params_bn = sum(p.numel() for p in bottleneck_conv5x5.parameters())
    compression_ratio = params_direct / params_bn
    print(f"5x5 卷積參數量: 直接={params_direct} vs 1x1瓶頸={params_bn} (壓縮比={compression_ratio:.2f}x)")
    assert compression_ratio > 9.5, "Inception 1x1 瓶頸壓縮比驗證失敗！"
```

---
---
---

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-401-01] 空間資料歸納偏置優先合約 (Spatial Inductive Bias Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件 (Pre-conditions)**: 輸入特徵具備二維或三維空間格網結構（如影像、點雲、高維感測圖）。
- **量化決策邊界 (Decision Thresholds)**:
  - 嚴禁在網路前端第一層直接執行 `x.view(batch_size, -1)` 進行全維度展平後接 `nn.Linear`。
  - 前端特徵擷取必須強制使用具有局部連接與權重共享特性的運算元（如 `nn.Conv2d` 或 Patch-based Vision Transformer 投影）。
- **執行保證**: 確保網路參數量受限於局部核大小，且具備李群平移等變性。
- **可執行斷言**:
```python
first_layer = list(model.children())[0]
assert not isinstance(first_layer, torch.nn.Linear), "空間網格輸入嚴禁第一層直接採用全連結層！"
```

### [RULE-401-02] 有效感受野 (ERF) 尺度覆蓋合約 (Receptive Field Scale Invariant)
- **合約等級**: `BOUNDARY_GUARD`
- **前置條件 (Pre-conditions)**: 設計用於目標辨識或語意分割的 CNN 骨幹網路。
- **量化決策邊界 (Decision Thresholds)**:
  - 終端特徵圖之理論感受野 $RF$ 必須滿足：$RF \ge S_{\text{object}}$（其中 $S_{\text{object}}$ 為目標物件最大像素尺度）。
  - 對於 $28 \times 28$ 輸入，感受野必須至少達到 24 像素；對於 $224 \times 224$ 輸入，終端感受野必須大於 200 像素。
- **例外回退 (Fallback Protocol)**: 若層數過淺導致感受野不足，Agent 必須自動引入空洞卷積 (Dilated Convolution) 或階層式 Pooling。

### [RULE-401-03] 邊界效應與特徵圖對齊合約 (Feature Map Padding Invariant)
- **合約等級**: `BOUNDARY_GUARD`
- **前置條件 (Pre-conditions)**: 配置卷積核尺寸 $k$ 與填充 $p$。
- **量化決策邊界 (Decision Thresholds)**:
  - 對於保持解析度之卷積層（步幅 $s = 1$），必須嚴格配置奇數卷積核 $k \in \{3, 5, 7\}$ 且對稱填充 $p = \lfloor k/2 \rfloor$（即 `padding='same'`）。
- **執行保證**: 杜絕特徵圖邊界像素權重退化與空間座標漂移。

### [RULE-401-04] 逐點卷積瓶頸、全域平均池化與多層序列張量秩守恆合約 (Bottleneck, GAP & Sequence Rank Invariant)
- **合約等級**: `PERFORMANCE_CRITICAL`
- **前置條件 (Pre-conditions)**: 設計深層視覺卷積骨幹網路（如 Inception/ResNet）或多層堆疊循環序列模型（Stacked RNN/LSTM）。
- **量化決策邊界 (Decision Thresholds)**:
  - **$1 \times 1$ 瓶頸壓縮**：當輸入通道數 $C_{\text{in}} \ge 128$ 且空間卷積核 $k \ge 5$ 時，必須強制前置 $1 \times 1$ 逐點卷積降維瓶頸（使 $C_{\text{mid}} \le C_{\text{in}} / 4$），確保單層 MACs 壓縮比 $\ge 4.0\times$。
  - **全域平均池化 (`GlobalAvgPool2D`) 替代展平全連結**：當終端特徵圖展平維度 $H \times W \times C > 4096$ 時，嚴禁直接執行 `Flatten()` 接入高維 `Dense(4096)`；必須強制採用 `AdaptiveAvgPool2d((1, 1))` / `GlobalAvgPool2D()` 將空間維度收斂為 $[B, C]$。
  - **多層序列張量秩守恆 (`return_sequences=True`)**：在堆疊 $L \ge 2$ 層循環算子時，所有非終端層 $l \in \{1, \dots, L-1\}$ 輸出必須維持三階時序張量形狀 $[B, T, D_h]$（強制開啟 `return_sequences=True`）。
- **可執行斷言**:
```python
assert feat_gap.ndim == 2 and seq_hidden_l1.ndim == 3, "GAP 輸出必須為 2D [B, C]，且非終端序列層必須維持 3D [B, T, D]！"
```
---

## 六、📚 權威論文、經典著作與同行評審文獻 (Canonical & Peer-Reviewed References)

1. **通用近似定理 (Universal Approximation Theorem) 奠基作**
   - *Paper*: Cybenko, G. (1989). "Approximation by superpositions of a sigmoidal function." *Mathematics of Control, Signals and Systems*, 2(4), 303-314. DOI: [10.1007/BF02551274](https://doi.org/10.1007/BF02551274).
   - *Core Contribution*: 數學證明單一隱藏層連續 Sigmoid 前饋網路可在緊緻集上逼近任意連續多元實函數，確立神經網路之萬能表現潛力。
2. **通用近似定理推廣至任意激活函數**
   - *Paper*: Hornik, K., Stinchcombe, M., & White, H. (1989). "Multilayer feedforward networks are universal approximators." *Neural Networks*, 2(5), 359-366. DOI: [10.1016/0893-6080(89)90020-8](https://doi.org/10.1016/0893-6080(89)90020-8).
   - *Core Contribution*: 證明逼近能力來自於多層神經架構本身之拓樸代數結構，而非依賴特定 S 型激活函數。
3. **卷積神經網路開山之作 (IEEE 歷史經典)**
   - *Paper*: LeCun, Y., Bottou, L., Bengio, Y., & Haffner, P. (1998). "Gradient-based learning applied to document recognition." *Proceedings of the IEEE*, 86(11), 2278-2324. DOI: [10.1109/5.726791](https://doi.org/10.1109/5.726791).
   - *Core Contribution*: 提出 LeNet-5 架構，形式化局部連接 (Local Receptive Fields)、共享權重 (Shared Weights) 與子取樣 (Spatial Subsampling) 三大歸納偏置，徹底擊敗全連結網路於影像辨識之維度災難。
4. **幾何深度學習 (Geometric Deep Learning) 權威著作**
   - *Book*: Bronstein, M. M., Bruna, J., Cohen, T., & Veličković, P. (2021). *Geometric Deep Learning: Grids, Groups, Graphs, Geodesics, and Gauges*. arXiv: [2104.13478](https://arxiv.org/abs/2104.13478).
   - *Core Contribution*: 以李群 (Lie Groups) 與對稱性為統一語言，從數學上證明卷積運算為歐幾里得網格上平移變換之唯一線性等變算子 (Translation Equivariant Operator)。
5. **VGG 小卷積核階層深度網路經典 (ICLR 2015)**
   - *Paper*: Simonyan, K., & Zisserman, A. (2015). "Very Deep Convolutional Networks for Large-Scale Image Recognition." *International Conference on Learning Representations (ICLR 2015)*. arXiv: [1409.1556](https://arxiv.org/abs/1409.1556).
   - *Core Contribution*: 證明以連續 $3 \times 3$ 小卷積核堆疊取代 $5 \times 5$ 與 $7 \times 7$ 大卷積核，可在維持相同有效感受野下大幅削減參數量並強化非線性表徵能力。
6. **GoogLeNet 與 Inception $1 \times 1$ 瓶頸架構奠基作 (CVPR 2015)**
   - *Paper*: Szegedy, C., Liu, W., Jia, Y., Sermanet, P., Reed, S., Anguelov, D., Erhan, D., Vanhoucke, V., & Rabinovich, A. (2015). "Going deeper with convolutions." *IEEE Conference on Computer Vision and Pattern Recognition (CVPR 2015)*, pp. 1-9. DOI: [10.1109/CVPR.2015.7298594](https://doi.org/10.1109/CVPR.2015.7298594).
   - *Core Contribution*: 提出多尺度平行分支 Inception 模組、$1 \times 1$ 逐點卷積通道降維瓶頸與末端全域平均池化 (Global Average Pooling)，大幅壓縮參數量與計算複雜度。
