---
call_number: LIB-401
title: DNN Spatial Limits & CNN Inductive Bias (Agent Edition)
module: DL-Architectures
category: Architecture-Core
audience:
  - Autonomous-Agent
  - Graduate-PhD
  - Senior-ML-Engineer
status: Verified-Authoritative-Production
math_foundations:
  - Permutation Invariance vs Translation Equivariance
  - Receptive Field Arithmetic & Dilation Geometry
  - Parameter Efficiency & Weight Sharing Bounds
hardware_target:
  - NVIDIA Tensor Core Implicit GEMM Convolution
invariants_count: 4
created: 2026-09-17
author: Luke (Chi-Yang Yu) & AI Research Agent (Antigravity)
prerequisites:
  - "[[LIB-001 Deep Learning First Principles (Agent EN)]]"
  - "[[LIB-101 Linear Algebra & High-Dimensional Geometry (Agent EN)]]"
successors:
  - "[[LIB-405 Attention Mechanism & Transformer Revolution (Agent EN)]]"
  - "[[LIB-501 CV Preprocessing & Center of Mass Alignment (Agent EN)]]"
tags:
  - cnn
  - inductive-bias
  - translation-equivariance
  - receptive-field
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../04_%E6%B7%B1%E5%BA%A6%E5%AD%B8%E7%BF%92%E6%9E%B6%E6%A7%8B%E8%88%87%E7%A5%9E%E7%B6%93%E6%A9%9F%E5%88%B6/LIB-401%20%E5%85%A8%E9%80%A3%E7%B5%90%E7%B6%B2%E8%B7%AF%E7%A9%BA%E9%96%93%E6%A5%B5%E9%99%90%E8%88%87%E5%8D%B7%E7%A9%8D%E7%A5%9E%E7%B6%93%E7%B6%B2%E8%B7%AF%E7%90%86%E8%AB%96%E5%BF%85%E7%84%B6%E6%80%A7%20%28DNN%20Spatial%20Limits%20%26%20CNN%20Inductive%20Bias%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# DNN Spatial Limits & CNN Inductive Bias: Theoretical Inevitability

## 1. Conceptual Mental Model

Why can an MLP (Multi-Layer Perceptron) never serve as a reliable visual backbone? Because a dense layer treats input dimensions as an unordered bag of numbers. If an engineer randomly permutes the 784 pixels of an MNIST image via a fixed permutation matrix $P_\pi$ and feeds it to an MLP, the MLP trains with identical loss convergence. But to human vision, natural images rely on **spatial spatial locality**: nearby pixels share topological context, and edges preserve semantic meaning under translation.

---

## 2. Mathematical Formalization

### 1. The Permutation Invariance Flaw of MLPs
Let $\pi \in S_d$ be a permutation of $d$ coordinates, represented by permutation matrix $P_\pi$. In a Dense MLP:
$$z = W (P_\pi x) + b = (W P_\pi) x + b$$
Because $W' = W P_\pi$ is an unconstrained weight matrix with identical capacity, the hypothesis class $\mathcal{H}_{\text{MLP}}$ has **zero prior preference** for spatial locality. Sample complexity scales as $O(d)$, requiring vast numbers of shifted samples to learn simple translation.

### 2. Formal Translation Equivariance in Convolution
A 2D continuous signal $f: \mathbb{R}^2 \to \mathbb{R}$ operated on by translation operator $T_v$ satisfies:
$$(T_v f)(x) = f(x - v)$$
The 2D convolution operator $\star$ with kernel $\psi$:
$$(f \star \psi)(x) = \int_{\mathbb{R}^2} f(y) \psi(x - y) dy$$
satisfies exact translation equivariance:
$$(T_v f) \star \psi = T_v (f \star \psi)$$
Proof:
$$((T_v f) \star \psi)(x) = \int f(y - v) \psi(x - y) dy$$
Substituting $u = y - v \implies y = u + v$:
$$= \int f(u) \psi(x - v - u) du = (f \star \psi)(x - v) = T_v (f \star \psi)(x) \quad \blacksquare$$

### 3. Receptive Field Recurrence Relation
In a hierarchy of $L$ convolutional layers with kernel sizes $k_l$, strides $s_l$, and dilations $d_l$:
- Cumulative stride (jump):
  $$j_l = j_{l-1} \times s_l, \quad j_0 = 1$$
- Effective receptive field $r_l$:
  $$r_l = r_{l-1} + (k_l - 1) \times j_{l-1}$$
With dilation $d_l$:
$$r_l = r_{l-1} + ((k_l - 1) d_l) \times j_{l-1}$$

---

## 3. Production PyTorch Equivariance Verification

```python
import torch
import torch.nn as nn

def verify_translation_equivariance(conv_layer: nn.Conv2d, shift_x: int = 2, shift_y: int = 2):
    """
    Empirically verifies translation equivariance: Conv(Shift(x)) == Shift(Conv(x))
    ignoring boundary padding effects.
    """
    x = torch.randn(1, conv_layer.in_channels, 32, 32)
    
    # Pathway 1: Shift input then convolve
    x_shifted = torch.roll(x, shifts=(shift_y, shift_x), dims=(-2, -1))
    out1 = conv_layer(x_shifted)
    
    # Pathway 2: Convolve then shift output
    out2 = conv_layer(x)
    out2_shifted = torch.roll(out2, shifts=(shift_y, shift_x), dims=(-2, -1))
    
    # Evaluate discrepancy on central valid region (avoiding edge artifacts)
    valid_slice = slice(4, -4)
    diff = torch.max(torch.abs(out1[:, :, valid_slice, valid_slice] - out2_shifted[:, :, valid_slice, valid_slice]))
    return float(diff.item()) < 1e-5
```

---

## 4. Agent Invariants & Decision Protocols

- `INV-401-01 (Strict 2D Spatial Inductive Bias)`: Image classification, object localization, and visual feature backbones MUST NOT utilize flattened MLP layers prior to spatial feature extraction.
- `INV-401-02 (Receptive Field Sufficiency)`: The effective receptive field $r_L$ at the final feature map MUST cover at least $100\%$ of the target object spatial extent ($r_L \ge 28\text{ px}$ for MNIST, $r_L \ge 224\text{ px}$ for ImageNet).
- `INV-401-03 (Odd Kernel Symmetry)`: Convolutional kernels MUST use odd dimensions ($3 \times 3, 5 \times 5, 7 \times 7$) with symmetric padding $p = \lfloor k / 2 \rfloor$ to preserve spatial coordinate centering.
