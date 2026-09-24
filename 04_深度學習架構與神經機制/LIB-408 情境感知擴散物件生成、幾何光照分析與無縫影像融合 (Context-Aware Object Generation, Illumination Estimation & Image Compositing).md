---
call_number: LIB-408
status: source-verified
invariants_count: 3
title: 情境感知擴散物件生成、幾何光照分析與無縫影像融合 (Context-Aware Object Generation, Illumination Estimation & Image Compositing)
module: Deep-Learning-Architectures
category: Generative-Diffusion-Compositing
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Monocular Depth & Surface Normal Geometry (Depth Anything V2)
  - Spherical Harmonics (SH) Lighting Inversion & Shadow Formation
  - Perspective Vanishing Point Calibration & Scale Constraints
  - Multi-Factor Photometric Harmonization Loss
hardware_target:
  - GPU Real-Time Inpainting Engine
  - Tensor Core Diffusion Inference (ControlNet / IP-Adapter)
  - Fast Poisson Blending & Color Transfer
created: 2026-09-24
author: Luke
tags:
  - 深度學習
  - 擴散模型
  - 影像融合
  - 光照一致性
  - ControlNet
  - 陰影合成
  - 深度估計
prerequisites:
  - "[[LIB-406 生成模型前沿：從隨機微分方程 (SDE) 擴散模型到最佳傳輸流匹配 (Flow Matching) 與 DiT 革命 (Generative Frontiers - From Score-Based SDE Diffusion to Optimal Transport Flow Matching & DiT Revolution)]]"
  - "[[LIB-407 指令引導擴散影像編輯與跨注意力非目標內容保持 (Instruction-Guided Diffusion Editing, Cross-Attention Control & Non-Target Preservation)]]"
  - "[[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]]"
successors:
  - "[[LIB-905 前沿視覺與具身多模態專題研發藍圖：五大題目技術全景與消融實證指南 (Frontier Vision & Multimodal Capstone Blueprints - Five Grand Research Specifications)]]"
---

> 語言切換 / Language: 🇹🇼 **繁體中文** | [🇺🇸 English (Agent Edition)](../en/04_deep_learning_architectures/LIB-408%20Context-Aware%20Object%20Generation,%20Illumination%20Estimation%20%26%20Image%20Compositing%20%28Agent%20EN%29.md)

# 情境感知擴散物件生成、幾何光照分析與無縫影像融合 (Context-Aware Object Generation, Illumination Estimation & Image Compositing)

## 導讀與概念座標
- **前置依賴**：[[LIB-406 生成模型前沿：從隨機微分方程 (SDE) 擴散模型到最佳傳輸流匹配 (Flow Matching) 與 DiT 革命 (Generative Frontiers - From Score-Based SDE Diffusion to Optimal Transport Flow Matching & DiT Revolution)]]、[[LIB-407 指令引導擴散影像編輯與跨注意力非目標內容保持 (Instruction-Guided Diffusion Editing, Cross-Attention Control & Non-Target Preservation)]]、[[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]]。
- **後續模組**：[[LIB-905 前沿視覺與具身多模態專題研發藍圖：五大題目技術全景與消融實證指南 (Frontier Vision & Multimodal Capstone Blueprints - Five Grand Research Specifications)]]。
- **核心主題**：解決生成式影像合成中最嚴重的「生硬貼圖感（Sticker Artifacts）」問題。當使用者要求在既有場景中插入新實體（例如「在沙發旁放一盞黑色落地燈」），系統必須同時滿足：**尺寸比例合理**、**透視方向精確**、**光線陰影物理一致**、**色調無縫融合同步**，達成照片級真實度（Photorealism）。

---

## 一、問題背景與「貼圖感」本質分析 (Motivation & Anatomy of Artifacts)

### 1. 為什麼常規 Inpainting 與 Copy-Paste 會看起來假？
在室內設計、廣告素材生成與電商合成中，若單純呼叫常規修復模型（如 Stable Diffusion Inpainting）或直接將物件摳圖貼上，會產生四重不可調和的物理矛盾：
1. **尺度與透視錯亂（Scale Mismatch）**：忽視相機焦距與深度，將遠處的落地燈畫得跟近處沙發一樣巨大，或者地平線消失點對不齊，物件如同漂浮在空中。
2. **光照方向打架（Lighting Conflict）**：場景主光源從左側窗戶照入，沙發陰影向右下延伸；但生成的落地燈反光卻在右側，或者根本沒有地面接觸陰影（Contact Shadow）。
3. **色調與環境色污染（Color/Ambient Discrepancy）**：背景為暖色調鎢絲燈光，新物件卻帶有戶外冷白光的色彩平衡，造成生硬的色差感。
4. **邊緣切割痕跡（Boundary Incoherence）**：邊界像素與背景高頻噪聲不一致，破壞連續性感官。

---

## 二、數學形式化推導 (Mathematical Formulation)

### 1. 單目幾何與透視尺度約束 (Geometric & Perspective Scaling)
利用單目深度估計網絡（如 Depth Anything V2）預測背景密集深度圖 $D(u, v)$ 與表面法向量圖 $N(u, v) = \nabla D \times (u, v, 1)^T$。
- **地面平面擬合**：利用 RANSAC 從法向量接近 $(0, 1, 0)$ 的區域提取地面方程 $\Pi_{\text{floor}}: \mathbf{n}^T \mathbf{x} + d = 0$。
- **透視約束邊界框 (Perspective-Consistent Bounding Box)**：
  設目標實體真實物理高度為 $H_{\text{real}}$（如落地燈標準高度 $1.6\text{m} \sim 1.8\text{m}$），放置點之相機座標系深度為 $Z_{\text{target}}$，相機焦距為 $f_y$。投影至 2D 螢幕的像素高度 $h_{\text{pixel}}$ 必須滿足小孔成像射影幾何：
  $$h_{\text{pixel}} = \frac{f_y \cdot H_{\text{real}}}{Z_{\text{target}}}, \quad \pm 10\% \text{ 容差限幅}$$

### 2. 球諧函數光照估計 (Spherical Harmonics Lighting Estimation)
假定遠處環境光可由二階球諧函數（Spherical Harmonics, SH）基底展開：
$$E(\mathbf{n}) = \sum_{l=0}^2 \sum_{m=-l}^l c_{lm} Y_{lm}(\mathbf{n})$$
其中 $Y_{lm}$ 為球諧正交基底，$\mathbf{n} \in \mathbb{S}^2$ 為表面法向量。
透過場景已有物體（如沙發表面）的漫反射輻照度採樣，利用最小平方法估計 9 個球諧係數 $\mathbf{c} \in \mathbb{R}^9$，從中解析出主光源方向向量 $\mathbf{L}_{\text{main}} = (\theta, \phi)$ 與色溫向量 $\mathbf{T}_{\text{light}}$。

### 3. 接觸陰影與投影合成 (Shadow Synthesis Formulation)
在地板平面 $\Pi_{\text{floor}}$ 上，新物件在點 $\mathbf{x}$ 產生的陰影衰減係數 $S(\mathbf{x}) \in [0, 1]$ 建模為光線遮擋與射線投射（Ray Casting）：
$$I_{\text{comp}}(\mathbf{x}) = I_{\text{bg}}(\mathbf{x}) \cdot \left[ S(\mathbf{x}) + (1 - S(\mathbf{x})) \cdot \frac{E_{\text{ambient}}}{E_{\text{total}}} \right]$$
其中陰影衰減與接觸點距離呈指數衰減：$S(\mathbf{x}) = 1 - \exp(-\kappa \cdot \text{dist}(\mathbf{x}, \mathbf{x}_{\text{contact}}))$。

### 4. 複合一致性損失函數 (Multi-Factor Compositing Loss)
訓練與融合最佳化目標由四項物理正則項組成：
$$\mathcal{L} = \lambda_{\text{light}} \mathcal{L}_{\text{light}} + \lambda_{\text{geom}} \mathcal{L}_{\text{geom}} + \lambda_{\text{scale}} \mathcal{L}_{\text{scale}} + \lambda_{\text{harmon}} \mathcal{L}_{\text{harmon}}$$
- $\mathcal{L}_{\text{light}}$：物件表面預測法向量與推導主光源的點積光照分佈一致性。
- $\mathcal{L}_{\text{geom}}$：接觸面法向量與地面法向量的正交性約束。
- $\mathcal{L}_{\text{scale}}$：實際生成長寬比與實體真實長寬比之偏差懲罰。
- $\mathcal{L}_{\text{harmon}}$：背景環境色與物件邊緣反射率的 Wasserstein 色彩直方圖距離。

---

## 三、端到端系統微架構管線 (End-to-End Pipeline)

```
[原始場景影像 + 文字指令] 
       │
       ├───> [場景語意與空間圖] ──> 物件類別、可用地面空間提取
       │
       ├───> [深度與幾何分析] ────> Depth Anything V2 深度估計 + 消失點透視計算
       │
       └───> [光照方向估計] ──────> 球諧函數分析 + 主光源陰影方向向量
                     │
                     ▼
       [條件式擴散生成器 (ControlNet / IP-Adapter)]
       • 根據透視邊界框生成特定尺度之物件候選集 (Candidates)
       • 基於 CLIP 語意與光照吻合度自動挑選最優候選
                     │
                     ▼
       [影像融合與一致性優化模組]
       • 色調調和 (Harmonizer) • 陰影生成 (Shadow Synthesis) • 邊界羽化
                     │
                     ▼
       [照片級自然無縫合成結果]
```

---

## 四、工業級工程實作與防禦規範 (Production-Grade Code)

以下為情境感知放置邊界框計算與光照方向投影模組：

```python
import torch
import numpy as np

class ContextAwarePlacementEngine:
    """
    情境感知物件放置尺度推算與陰影投射引擎
    對齊 [RULE-408-01] ~ [RULE-408-03]
    """
    def __init__(self, focal_length_px: float = 800.0, principal_point: tuple = (256.0, 256.0)):
        self.fy = focal_length_px
        self.cx, self.cy = principal_point

    def compute_bounding_box(
        self,
        footprint_pixel: tuple,     # (u, v) 物件著地點座標
        depth_val: float,           # 著地點密集深度值 (meters)
        real_height_m: float,       # 物件物理高度 (meters)
        aspect_ratio: float = 0.35  # 寬高比 (width / height)
    ) -> tuple:
        """
        依據小孔射影幾何推算符合透視比例的 Bounding Box (ymin, xmin, ymax, xmax)
        """
        assert depth_val > 0.2, f"深度值不合理: {depth_val}m"
        u, v = footprint_pixel

        # 1. 射影計算像素高度
        height_px = (self.fy * real_height_m) / depth_val
        width_px = height_px * aspect_ratio

        # 2. 以底部中心為基準對齊
        ymin = int(v - height_px)
        ymax = int(v)
        xmin = int(u - width_px / 2)
        xmax = int(u + width_px / 2)

        return (max(0, ymin), max(0, xmin), ymax, xmax)

    @staticmethod
    def generate_shadow_mask(
        object_mask: np.ndarray,      # [H, W] 二值物件遮罩
        light_direction: tuple,       # (dx, dy) 歸一化光照向量
        shadow_length_factor: float = 0.6
    ) -> np.ndarray:
        """
        根據光源方向投射接觸陰影遮罩
        """
        dx, dy = light_direction
        H, W = object_mask.shape
        shadow = np.zeros((H, W), dtype=np.float32)

        # 提取物體底部接觸像素並沿光照反方向剪切投影
        y_indices, x_indices = np.where(object_mask > 0)
        if len(y_indices) == 0:
            return shadow

        base_y = np.max(y_indices)
        contact_points = [(y, x) for y, x in zip(y_indices, x_indices) if y > base_y - 15]

        for cy, cx in contact_points:
            for step in range(1, int(30 * shadow_length_factor)):
                sy = int(cy - dy * step)
                sx = int(cx - dx * step)
                if 0 <= sy < H and 0 <= sx < W:
                    decay = np.exp(-step / (10 * shadow_length_factor))
                    shadow[sy, sx] = max(shadow[sy, sx], decay * 0.7)

        return np.clip(shadow, 0.0, 1.0)
```

---

## 五、系統規範與不變量 (System Invariants)

### [RULE-408-01] 透視幾何尺度容差約束 (Perspective Scale Invariant)
- **等級**: `CRITICAL_INVARIANT`
- **邊界**: 生成實體的 2D 像素高度與小孔成像理論高度的比值必須落於 $[0.90, 1.10]$（容許 $\pm 10\%$ 自由度），嚴格禁止因提示詞引導而生成巨人或迷你矮化實體。

### [RULE-408-02] 主光源陰影夾角物理約束 (Shadow Angular Tolerance)
- **等級**: `HIGH_INVARIANT`
- **邊界**: 合成物件之接觸陰影投射角度與場景主光源估計方向夾角偏差不得超過 $15^\circ$，且陰影衰減係數在物件底部接縫處必須達到 $S \ge 0.70$（呈現紮實深黑接觸暗部）。

### [RULE-408-03] 色彩直方圖分佈一致性 (Color Harmonization EMD SLA)
- **等級**: `HIGH_INVARIANT`
- **邊界**: 經過色調調和後，新合成實體與周邊 $50\text{px}$ 鄰域背景的色相/飽和度分佈，其推土機距離（Earth Mover's Distance, EMD）必須小於 $0.08$。

---

## 六、標準引證與權威文獻 (Canonical References)

1. **Zhang, L., Rao, A., & Agrawala, M.** (2023). *Adding Conditional Control to Text-to-Image Diffusion Models*. **IEEE/CVF International Conference on Computer Vision (ICCV 2023)**.
2. **Yang, L., Kang, B., Huang, Z., Xu, X., et al.** (2024). *Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data*. **IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR 2024)**.
3. **Chen, X., Huang, L., Liu, Y., Shen, Y., et al.** (2024). *AnyDoor: Zero-shot Object-level Image Customization*. **IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR 2024)**.
4. **Sheng, L., Yang, S., Zhang, Y., et al.** (2023). *ShadowDiffusion: When Degradation Prior Meets Diffusion Model for Shadow Removal and Synthesis*. **IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR 2023)**.
5. **Ke, Z., Sun, C., Fei, L., et al.** (2022). *Harmonizer: Unified Image Harmonization with High-Pass and Low-Pass Filtering*. **IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI 2022)**.
