---
call_number: LIB-504
title: 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)
module: Computer-Vision
category: 3D-Neural-Rendering
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
status: Verified-Authoritative-Production
math_foundations:
  - Continuous Volume Rendering Integral
  - EWA Covariance Projection & Jacobian Transformation
  - Tile-based Radix Sorting & Front-to-Back Alpha Blending
hardware_target:
  - CUDA Tile Rasterizer Shared Memory
  - Fast Radix Sort on GPU DRAM
invariants_count: 3
created: 2026-09-17
author: 游啓揚 (Luke, 資訊三乙, 11327229) & AI Research Agent (Antigravity)
prerequisites:
  - "[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]"
  - "[[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]"
successors:
  - "[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]"
tags:
  - 圖書館
  - 電腦視覺
  - 3DGS
  - NeRF
  - 神經渲染
  - 光柵化
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/05_computer_vision/LIB-504%203D%20Gaussian%20Splatting%20Theory%20%26%20Rasterization%20%28Agent%20EN%29.md)

# 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]、[[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]、[[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]]。
- **後續節點**：[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]（莊啓鴻教授實驗室核心課題）。
- **權威期刊/會議文獻出處**：
  - Mildenhall et al. (ECCV 2020) *NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis*.
  - Zwicker et al. (IEEE TVCG 2001) *Surface Splatting*.
  - Kerbl, Kopanas, Leimkühler, Drettakis (ACM TOG / SIGGRAPH 2023) *3D Gaussian Splatting for Real-Time Radiance Field Rendering*.
  - Huang et al. (ACM TOG / SIGGRAPH 2024) *2D Gaussian Splatting for Geometrically Accurate Radiance Fields*.
  - Wu et al. (CVPR 2024) *4D Gaussian Splatting for Dynamic Scenes*.
  - Guédon & Lepetit (CVPR 2024) *SuGaR: Surface-Aligned Gaussian Splatting for Efficient 3D Mesh Reconstruction and Editing*.

---

## 一、💡 學士直觀心智模型：從慢速光線探針到高速噴漆橢球

在 3D 電腦視覺發展史上，人類追求「僅用幾張 2D 照片就能 360 度無死角還原真實三維世界（新視角合成 Novel View Synthesis）」經歷了三次典範轉移：

### 1. 傳統三角網格 (Mesh) 的局限
- 遊戲建模用的多邊形網格（Triangular Mesh）善於表現剛體表面（如桌子、汽車外殼）。
- 但面對**蓬鬆頭髮、煙霧、半透明玻璃、飄逸服裝（如虛擬試衣）**時，三角網格會產生大量撕裂與生硬邊界，微小細節無法透過梯度直接優化。

### 2. NeRF 的革命與痛點：盲人摸象的光線探針
- Mildenhall et al. (ECCV 2020) 提出了 **NeRF（神經輻射場）**：用一個神經網路 MLP 當作「3D 空間百科全書」。
- 渲染一個畫面時，從相機向每個像素射出一條光線，沿著射線採樣數百個點，反覆詢問 MLP：「這個點有霧嗎？是什麼顏色？」。
- **致命痛點**：每渲染一張 1080p 照片，需要調用神經網路數百萬次，渲染一幀耗時數秒甚至數分鐘，根本無法做到即時互動！

### 3. 3D 高斯潑濺 (3DGS) 的頓悟：浮空潑灑的彩色水滴
- Kerbl et al. (SIGGRAPH 2023) 徹底揚棄了昂貴的神經網路射線查詢，回歸顯式幾何表示：
- 在 3D 空間中撒下幾百萬個**半透明、可旋轉、可拉伸的 3D 彩色橢球（3D Gaussians）**。
- 當你從某個視角看過去時，GPU 像高速投影儀一樣，在毫秒級瞬間把這些 3D 橢球「拍扁」成 2D 橢圓貼紙，並透過硬體光柵化迅速疊加混色。
- 運算速度直接從 NeRF 的 0.1 FPS 暴衝至 **150+ FPS**，同時畫質更加銳利！

---

## 二、🎓 博士級數學形式化推導：體積渲染積分、協方差投影與前沿 2D/4DGS

### 1. 連續體積渲染積分及其數值離散化
NeRF 與 3DGS 的底層光學物理均基於 Max (1995) 的體積渲染方程。沿相機光線 $\mathbf{r}(t) = \mathbf{o} + t \mathbf{d}$ 的最終顏色為：
$$C(\mathbf{r}) = \int_{t_n}^{t_f} T(t) \cdot \sigma(\mathbf{r}(t)) \cdot \mathbf{c}(\mathbf{r}(t), \mathbf{d}) \, dt$$
其中透射率（光線未被前方粒子阻擋的機率）為：
$$T(t) = \exp\left(-\int_{t_n}^t \sigma(\mathbf{r}(s)) \, ds\right)$$
在 3DGS 中，沿著視線相交的所有高斯點按照深度由近及遠排序（$i = 1, \dots, N$），渲染公式被精確離散化為**前向 Alpha 混合 (Front-to-Back Alpha Blending)**：
$$C = \sum_{i \in \mathcal{N}} c_i \alpha_i \prod_{j=1}^{i-1} (1 - \alpha_j)$$
其中 $\alpha_i$ 由 3D 高斯的自身不透明度（Opacity）$o_i$ 與其在 2D 投影平面上的機率密度共同決定。

### 2. 3D 高斯幾何表徵與協方差矩陣分解
空間中一個中心位於 $\mu \in \mathbb{R}^3$ 的 3D 高斯分佈定義為：
$$G(\mathbf{x}) = \exp\left(-\frac{1}{2} (\mathbf{x} - \mu)^T \Sigma^{-1} (\mathbf{x} - \mu)\right)$$
協方差矩陣 $\Sigma \in \mathbb{R}^{3 \times 3}$ 必須滿足**半正定性 (Positive Semi-Definite)**。
解耦幾何參數化將 $\Sigma$ 分解為旋轉矩陣 $R$（由單位四元數 $\mathbf{q} \in \mathbb{R}^4$ 表示）與對角縮放矩陣 $S = \text{diag}(s_x, s_y, s_z)$：
$$\Sigma = R S S^T R^T$$
保證了對任意實數 $s$ 與四元數 $\mathbf{q}$，$\Sigma$ 恆為對稱半正定矩陣，數值極端穩定。

### 3. Zwicker 2D 投影平面潑濺定理 (2D Splatting Projection)
Zwicker et al. (IEEE TVCG 2001) 證明了 3D 協方差矩陣投影至 2D 像素座標系的仿射近似。設相機視角外參變換矩陣為 $W \in \mathbb{R}^{3 \times 3}$，透視投影變換在中心點 $\mu$ 處的局部一階雅可比矩陣為 $J \in \mathbb{R}^{2 \times 3}$：
$$\Sigma' = J W \Sigma W^T J^T$$
得到的 $\Sigma' \in \mathbb{R}^{2 \times 2}$ 即為相機成像平面上的 2D 協方差矩陣。

### 4. 前沿突破一：2D Gaussian Splatting (Huang et al., SIGGRAPH 2024)
原始 3DGS 使用 3D 橢球，在表示纖薄物體表面（如衣服薄片、紙張、葉片）時，橢球在法向量方向具有虛假的體積厚度，容易導致視角不一致與幾何漂移。
Huang et al. (SIGGRAPH 2024) 提出 **2DGS**：將 3D 橢球扁平化為具備切線基底向量 $(u_1, u_2)$ 與法向量 $n$ 的 **2D 有向平面圓盤 (Planar Oriented Disks)**：
$$P(u, v) = \exp\left(-\frac{u^2}{2\sigma_u^2} - \frac{v^2}{2\sigma_v^2}\right)$$
- 引入**射線-平面嚴格相交 (Ray-Splat Exact Intersection)**，徹底消除 3DGS 投影近似誤差。
- 引入**法向一致性正則化 (Normal Consistency Regularization)**，使渲染幾何能直接提取出光滑精準的 CAD 級 3D 表面網格（Mesh）。

### 5. 前沿突破二：4D Gaussian Splatting 與動態試衣形變 (Wu et al., CVPR 2024)
針對動態人體、布料擺動與自駕動態感知，Wu et al. (CVPR 2024) 提出了 **4DGS**：
- 將高斯中心坐標擴展為時間函數：$\mu(t) = \mu_0 + \Delta \mu(t)$。
- 利用 HexPlane（空間-時間六平面分解）或輕量級 MLP 預測高斯點的位移場 $\Delta \mu$、旋轉變化 $\Delta q$ 與尺度變化 $\Delta s$。
- **實驗室課題對齊**：這為中原資工莊啓鴻教授實驗室的「手繪 2D 草圖引導之 3D 動態虛擬試衣」提供了最佳的實時動態渲染理論支撐！

---

## 三、⚙️ 計算機體系結構與硬體微架構映射：Tile-based CUDA 高速排序光柵化

3DGS 能夠達到 150+ FPS 的核心秘密，在於其完全對齊了 NVIDIA GPU 的硬體架構：

```
[3D 高斯瓦片光柵化管線]
1. 投影與幾何剔除 (Frustum Culling): 篩選出視錐體內的有效高斯。
2. 劃分 16x16 像素瓦片 (Tiles): 將螢幕切成二維微瓦片網格。
3. 64-bit 鍵值排序 (GPU Radix Sort):
   Key = [ 32-bit Tile ID | 32-bit Depth ]
   調用 NVIDIA CUB 函式庫，數百萬個高斯在 1.5ms 內完成精確排序！
4. 瓦片並行光柵化 (Thread Block per Tile):
   每個 CUDA Thread Block 負責一個 16x16 瓦片。
   利用晶上超高速 Shared Memory 載入高斯參數。
   當累計透射率 Prod(1 - alpha) < 0.0001 (飽和度達 99.99%) 時，觸發早停 (Early Exit)！
```

---

## 四、💻 工業級工程實作：3D 協方差投影與 Alpha 合成數學核心

```python
import torch

def compute_2d_covariance(
    scales: torch.Tensor,       # [N, 3] 尺度向量
    quaternions: torch.Tensor,  # [N, 4] 單位四元數 [w, x, y, z]
    W: torch.Tensor,            # [3, 3] 相機外參旋轉矩陣
    J: torch.Tensor             # [N, 2, 3] 透視投影局部雅可比
) -> torch.Tensor:
    """
    實作 Zwicker et al. 2D 協方差矩陣潑濺投影: Sigma' = J * W * Sigma * W^T * J^T
    輸出: [N, 2, 2] 2D 影像平面協方差矩陣
    """
    # 1. 由四元數構建 3D 旋轉矩陣 R [N, 3, 3]
    q = quaternions / torch.norm(quaternions, dim=-1, keepdim=True)
    w, x, y, z = q[:, 0], q[:, 1], q[:, 2], q[:, 3]
    
    R = torch.stack([
        1 - 2*(y**2 + z**2), 2*(x*y - w*z),     2*(x*z + w*y),
        2*(x*y + w*z),     1 - 2*(x**2 + z**2), 2*(y*z - w*x),
        2*(x*z - w*y),     2*(y*z + w*x),     1 - 2*(x**2 + y**2)
    ], dim=-1).view(-1, 3, 3)
    
    # 2. 構建對角尺度矩陣 S [N, 3, 3]
    S = torch.diag_embed(scales)
    
    # 3. 3D 協方差矩陣 Sigma = R * S * S^T * R^T
    M = torch.matmul(R, S)
    Sigma_3D = torch.matmul(M, M.transpose(-1, -2)) # [N, 3, 3]
    
    # 4. 投影至相機坐標系 Sigma_cam = W * Sigma_3D * W^T
    Sigma_cam = torch.matmul(W.unsqueeze(0), torch.matmul(Sigma_3D, W.T.unsqueeze(0)))
    
    # 5. 投影至 2D 像素坐標系 Sigma_2D = J * Sigma_cam * J^T
    Sigma_2D = torch.matmul(J, torch.matmul(Sigma_cam, J.transpose(-1, -2))) # [N, 2, 2]
    
    # 加入微小對角擾動 (Low-pass filter) 防止奇異值除以零
    Sigma_2D[:, 0, 0] += 0.3
    Sigma_2D[:, 1, 1] += 0.3
    return Sigma_2D

if __name__ == "__main__":
    N = 100
    scales = torch.rand(N, 3) * 0.1
    quats = torch.randn(N, 4)
    W = torch.eye(3)
    J = torch.randn(N, 2, 3) * 0.05
    cov2d = compute_2d_covariance(scales, quats, W, J)
    print(f"2D 協方差張量形狀: {cov2d.shape}")
    assert cov2d.shape == (N, 2, 2), "協方差矩陣維度錯誤！"
```

---
---
---

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-504-01] 3D 高斯協方差半正定性保證合約 (Positive Semi-Definite Covariance Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件 (Pre-conditions)**: 透過尺度矩陣 $S$ 與旋轉矩陣 $R$ 構建 3D 協方差矩陣 $\Sigma = R S S^T R^T$。
- **量化決策邊界 (Decision Thresholds)**:
  - 縮放因子必須嚴格施加激活下界：$s_i = \exp(s_{\text{raw}, i}) > 10^{-6}$。
  - 四元數 $q = (w, x, y, z)$ 在轉換為旋轉矩陣前必須執行 $L_2$ 歸一化：$q \leftarrow q / \|q\|_2$。
- **執行保證**: 確保協方差矩陣永遠為實對稱且嚴格正定，杜絕奇異值分解崩潰。

### [RULE-504-02] 2D 螢幕投影低通抗混疊濾波合約 (Low-Pass Anti-Aliasing Guardrail)
- **合約等級**: `BOUNDARY_GUARD`
- **前置條件 (Pre-conditions)**: 3D 協方差投影至 2D 螢幕坐標系：$\Sigma' = J W \Sigma W^T J^T$。
- **量化決策邊界 (Decision Thresholds)**:
  - 強制加上低通濾波常數項：$\Sigma'_{2D} = \Sigma' + 0.3 I_2$。
- **執行保證**: 防止高斯橢球在極度縮小或視角極度傾斜時退化為無窮小奇異點，消除像素級高頻閃爍。
- **可執行斷言**:
  ```python
cov2d[0, 0] += 0.3
cov2d[1, 1] += 0.3
det = cov2d[0, 0] * cov2d[1, 1] - cov2d[0, 1] ** 2
assert det > 0.0, f"2D 協方差行列式非正: det={det}"
  ```

### [RULE-504-03] 射線透射率早停合約 (Ray Transmittance Early-Exit Heuristic)
- **合約等級**: `OPTIMIZATION_HEURISTIC`
- **前置條件 (Pre-conditions)**: 依序自前向後（Front-to-back）累積 Alpha 合成光柵化。
- **量化決策邊界 (Decision Thresholds)**:
  - 累積透射率：$T_i = \prod_{j=1}^{i-1} (1 - \alpha_j)$。
  - 早停閾值：當 $T_i < 10^{-4}$（即光線遮蔽率超過 99.99%）時，立即終止後續所有高斯點之著色計算。
- **執行保證**: 節省超過 40% 的 CUDA 核心計算開銷，達成 100+ FPS 即時渲染。
---

## 六、📚 權威論文、經典著作與同行評審文獻 (Canonical & Peer-Reviewed References)

1. **NeRF 神經輻射場開山作 (ECCV 頂會 Best Paper Honorable Mention)**
   - *Paper*: Mildenhall, B., Srinivasan, P. P., Tancik, M., Barron, J. T., Ramamoorthi, R., & Ng, R. (2020). "NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis." *European Conference on Computer Vision (ECCV 2020)*, pp. 405-421. DOI: [10.1007/978-3-030-58452-8_24](https://doi.org/10.1007/978-3-030-58452-8_24).
   - *Core Contribution*: 首次將 3D 場景隱式編碼為 5D 座標連續函數 $F_\Theta(x, y, z, \theta, \phi) \to (c, \sigma)$，並結合經典體積渲染數值積分，開創神經渲染新時代。
2. **3D Gaussian Splatting 開創性頂刊作 (ACM TOG / SIGGRAPH 2023)**
   - *Paper*: Kerbl, B., Kopanas, G., Leimkühler, T., & Drettakis, G. (2023). "3D Gaussian Splatting for Real-Time Radiance Field Rendering." *ACM Transactions on Graphics (TOG)*, 42(4), Article 139. DOI: [10.1145/3592433](https://doi.org/10.1145/3592433).
   - *Core Contribution*: 捨棄神經網路 MLP，提出以顯式 3D 高斯橢球為場景幾何表示，配合 GPU Tile-based 基數排序高速光柵化，首次達成 1080p 100+ FPS 即時高品質渲染。
3. **2D Gaussian Splatting 幾何精確重建前沿 (SIGGRAPH 2024)**
   - *Paper*: Huang, B., Yu, Z., Chen, E., Zheng, Y., & Yang, B. (2024). "2D Gaussian Splatting for Geometrically Accurate Radiance Fields." *ACM Transactions on Graphics (TOG)*, 43(4), Article 55 (SIGGRAPH 2024).
   - *Core Contribution*: 將 3D 高斯投影簡化為 2D 扁平高斯衝擊片 (Planar Surfels)，解決 3DGS 視角傾斜時之幾何多義性，完美重建高保真 3D 表面網格 (Mesh)。
4. **4D Gaussian Splatting 動態時空渲染 (CVPR 2024 頂會)**
   - *Paper*: Wu, G., Yi, T., Fang, J., Xie, L., Zhang, X., Wei, W., Liu, W., Tian, Q., & Wang, X. (2024). "4D Gaussian Splatting for Real-Time Dynamic Scene Rendering." *IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR 2024)*, pp. 20310-20320.
   - *Core Contribution*: 引入時空神經變形場，讓高斯粒子隨時間 $t$ 產生連續位移與旋轉，支援非剛體人體動態與虛擬試穿。
5. **EWA 橢球加權平均光柵化經典 (IEEE Visualization 歷史經典)**
   - *Paper*: Zwicker, M., Pfister, H., van Baar, J., & Gross, M. (2001). "EWA Volume Splatting." *IEEE Visualization 2001*, pp. 29-36. DOI: [10.1109/VISUAL.2001.964490](https://doi.org/10.1109/VISUAL.2001.964490).
   - *Core Contribution*: 奠定 3D 高斯協方差矩陣向 2D 螢幕坐標系投影 Jacobian 近似轉換之數學公式 $\Sigma' = J W \Sigma W^T J^T$。
