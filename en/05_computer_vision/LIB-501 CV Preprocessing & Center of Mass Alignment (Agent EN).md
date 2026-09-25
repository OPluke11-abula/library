---
call_number: LIB-501
status: source-verified
invariants_count: 4
title: CV Preprocessing & Center of Mass Alignment (Agent Edition)
module: Computer-Vision
category: Engineering-Perception
audience:
  - Autonomous-Agent
  - Senior-ML-Engineer
  - CV-Practitioner
math_foundations:
  - 2D Spatial Image Moments & Centroids
  - Bilinear Subpixel Coordinate Interpolation
  - Aspect Ratio Preserving Bounding Box Clamping
hardware_target:
  - Embedded Edge (Jetson Nano/Orin) & Web Canvas
created: 2026-09-17
author: Luke
tags:
  - computer-vision
  - preprocessing
  - center-of-mass
  - moments
  - mnist-deployment
prerequisites:
  - "[[LIB-401 DNN Spatial Limits & CNN Inductive Bias (Agent EN)]]"
successors:
  - "[[LIB-408 Context-Aware Object Generation, Illumination Estimation & Image Compositing (Agent EN)]]"
  - "[[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]]"
  - "[[LIB-901 Classic Project Post-Mortem - Production MNIST (Agent EN)]]"
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../05_%E8%A8%88%E7%AE%97%E6%A9%9F%E8%A6%96%E8%A6%BA%E8%88%87%E9%AB%98%E7%B6%AD%E6%84%9F%E6%B8%AC/LIB-501%20%E8%A8%88%E7%AE%97%E6%A9%9F%E8%A6%96%E8%A6%BA%E5%89%8D%E8%99%95%E7%90%86%E8%A6%8F%E7%AF%84%E8%88%87%E5%BD%B1%E5%83%8F%E8%B3%AA%E5%BF%83%E5%AE%9A%E4%BD%8D%E6%BC%94%E7%AE%97%E6%B3%95%20%28CV%20Preprocessing%20%26%20Center%20of%20Mass%20Alignment%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Computer Vision Preprocessing Standards & Center of Mass Alignment

## 1. Conceptual Mental Model

In standard benchmark tutorials, handwritten digit recognition on MNIST achieves high validation accuracy. Yet when real users draw digits on a web canvas (such as Gradio or React sketchpads), naive deployments without centering and bounding-box normalization often suffer severe accuracy degradation due to spatial distribution shift. Why? Because the canonical MNIST dataset was preprocessed using a rigorous protocol established by LeCun et al. (1998): **tight bounding-box extraction, aspect-ratio preserved scaling into a $20 \times 20$ core zone, and translation of the ink center-of-mass directly to $(13.5, 13.5)$ on a $28 \times 28$ canvas**. Omitting this protocol introduces severe spatial distribution shift.

---

## 2. Mathematical Formalization

### 1. Spatial Image Moments & Centroid Equations
For a normalized grayscale intensity image $I(x, y) \in [0, 1]$ where $(x, y) \in [0, W-1] \times [0, H-1]$:
- Raw spatial moments $m_{p, q}$:
  $$m_{p, q} = \sum_{x=0}^{W-1} \sum_{y=0}^{H-1} x^p y^q I(x, y)$$
- Total ink mass: $m_{00} = \sum_x \sum_y I(x, y)$
- The ink Center-of-Mass (CoM) coordinates $(\bar{x}, \bar{y})$:
  $$\bar{x} = \frac{m_{10}}{m_{00}} = \frac{\sum_x \sum_y x I(x, y)}{\sum_x \sum_y I(x, y)}, \quad \bar{y} = \frac{m_{01}}{m_{00}} = \frac{\sum_x \sum_y y I(x, y)}{\sum_x \sum_y I(x, y)}$$

### 2. Centering Translation Vector & Clamping
The geometric center of a $28 \times 28$ discrete grid is $(c_x, c_y) = (13.5, 13.5)$.
The ideal shift vector:
$$\vec{v}_{\text{shift}} = (dx, dy) = (13.5 - \bar{x}, \quad 13.5 - \bar{y})$$
To prevent thin or eccentric strokes (such as an upright uncrossed "7" or period ".") from being shoved off the edge of the canvas, the shift vector MUST be clamped:
$$dx_{\text{clamped}} = \text{clip}(dx, -\tau_{\text{shift}}, +\tau_{\text{shift}}), \quad dy_{\text{clamped}} = \text{clip}(dy, -\tau_{\text{shift}}, +\tau_{\text{shift}})$$
where defensive safety bound $\tau_{\text{shift}} = 3.0\text{ px}$ [HEURISTIC / SAFETY_BOUND]. Note that while LeCun et al. (1998) defined translation of the center-of-mass to the canvas center, the $\pm 3.0\text{ px}$ clamping bound is a project-specific defensive engineering heuristic to prevent eccentric or isolated strokes from shifting off the canvas frame.

### 3. Bilinear Interpolation Operator
Translating discrete pixel grid by continuous shift $(dx, dy)$ maps source coordinates $(u, v) = (x - dx, y - dy)$. The intensity at $(x, y)$ is evaluated via bilinear weighting:
$$I_{\text{shifted}}(x, y) = (1 - s)(1 - t) I(u_0, v_0) + s(1 - t) I(u_1, v_0) + (1 - s) t I(u_0, v_1) + s t I(u_1, v_1)$$
where $u_0 = \lfloor u \rfloor, v_0 = \lfloor v \rfloor, u_1 = u_0 + 1, v_1 = v_0 + 1$, and fractional residuals $s = u - u_0, t = v - v_0$.

---

## 3. Production PyTorch / OpenCV Preprocessing Implementation

```python
import numpy as np
import cv2
import torch

def preprocess_canvas_digit(raw_image: np.ndarray) -> torch.Tensor:
    """
    Standard LeCun-compliant Preprocessing Pipeline for Real-World MNIST.
    Input:  raw_image [H, W, 3] or [H, W] uint8 from web canvas
    Output: Tensor [1, 1, 28, 28] float32 normalized in [0, 1]
    """
    # 1. Grayscale & Thresholding
    if raw_image.ndim == 3:
        gray = cv2.cvtColor(raw_image, cv2.COLOR_BGR2GRAY)
    else:
        gray = raw_image.copy()
        
    # Invert if background is white and ink is black
    if np.mean(gray) > 127:
        gray = 255 - gray
        
    # Threshold background noise
    _, thresh = cv2.threshold(gray, 30, 255, cv2.THRESH_TOZERO)
    
    # 2. Tight Bounding Box Extraction
    pts = cv2.findNonZero(thresh)
    if pts is None:
        return torch.zeros(1, 1, 28, 28, dtype=torch.float32)
    x, y, w, h = cv2.boundingRect(pts)
    roi = thresh[y:y+h, x:x+w]
    
    # 3. Aspect-Preserving Scaling into 20x20 box
    if h > w:
        new_h = 20
        new_w = max(1, int(round(w * 20.0 / h)))
    else:
        new_w = 20
        new_h = max(1, int(round(h * 20.0 / w)))
    resized = cv2.resize(roi, (new_w, new_h), interpolation=cv2.INTER_AREA)
    
    # 4. Pad into 28x28 Canvas
    padded = np.zeros((28, 28), dtype=np.float32)
    pad_top = (28 - new_h) // 2
    pad_left = (28 - new_w) // 2
    padded[pad_top:pad_top+new_h, pad_left:pad_left+new_w] = resized
    
    # 5. Center of Mass Alignment
    M = cv2.moments(padded)
    if M["m00"] > 1e-4:
        cx = M["m10"] / M["m00"]
        cy = M["m01"] / M["m00"]
        dx = np.clip(13.5 - cx, -3.0, 3.0)
        dy = np.clip(13.5 - cy, -3.0, 3.0)
        
        # Affine translation matrix
        T = np.float32([[1, 0, dx], [0, 1, dy]])
        padded = cv2.warpAffine(padded, T, (28, 28), flags=cv2.INTER_LINEAR)
        
    # 6. Normalize to [0, 1] tensor
    tensor = torch.from_numpy(padded / 255.0).float().unsqueeze(0).unsqueeze(0)
    return tensor
```

---

## 4. Agent Invariants & Decision Protocols

### [RULE-501-01] Anti-Aliasing Resampling Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: When resizing raw high-resolution canvas inputs down to target dimensions ($28 \times 28$), downsampling ratios $s < 0.5$ MUST use anti-aliased resampling (Lanczos-3 or Area downsampling). Nearest-neighbor interpolation is STRICTLY PROHIBITED.
- **Violation Consequence**: Naive nearest-neighbor downsampling creates severe high-frequency aliasing and pixel dropouts that fracture continuous handwritten strokes.

### [RULE-501-02] Foreground Mask & Zero-Moment Filter
- **Contract Level**: `BOUNDARY_GUARD`
- **Specification**: The raw input image MUST be filtered to extract the zero-th spatial moment $M_{00} = \sum_{x,y} I(x, y)$. If total ink mass satisfies $M_{00} < 15.0$, the input MUST be rejected as an empty or noise-only canvas via an explicit `EmptyImageException`. The threshold $M_{00} \ge 15.0$ is a project-specific defensive engineering safety bound [HEURISTIC / SAFETY_BOUND] designed to prevent division-by-zero during centroid computation ($M_{10}/M_{00}$) and suppress sensor noise, rather than a canonical constant defined in LeCun et al. (1998).
- **Violation Consequence**: Processing empty or sub-threshold noise frames produces numerical instability in center of mass division ($M_{10}/M_{00}$) and spurious high-confidence predictions.

### [RULE-501-03] Centroid Clamping & Canvas Boundary Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: Translating the ink center of mass $(\bar{x}, \bar{y})$ to the canonical target coordinate $(13.5, 13.5)$ MUST apply defensive displacement clamping: $\Delta x_{\text{clamped}} = \text{clip}(13.5 - \bar{x}, -3.0, 3.0)$ and $\Delta y_{\text{clamped}} = \text{clip}(13.5 - \bar{y}, -3.0, 3.0)$ [HEURISTIC / SAFETY_BOUND]. Note: While LeCun et al. (1998) introduced unconstrained center of mass translation on centered digits, this $\pm 3.0\text{ px}$ clamp is a defensive engineering safety bound to prevent eccentric strokes from being shifted out of frame boundaries.
- **Violation Consequence**: Unclamped shifts on highly eccentric inputs push peripheral strokes entirely outside canvas boundaries, destroying digit topology.

### [RULE-501-04] Bunch TTA Geometric Invariant
- **Contract Level**: `PERFORMANCE_CRITICAL`
- **Specification**: In production inference pipelines, critical predictions MAY deploy Test-Time Augmentation (TTA) across at least 3 geometric transformations (e.g., slight scaling $\pm 5\%$, small shifts), averaging output probability distributions $\bar{p} = \frac{1}{K} \sum_{k=1}^K p_k$.
- **Violation Consequence**: Single-pass inference on boundary-drawn digits suffers elevated false-negative rates under slight drawing jitter.

