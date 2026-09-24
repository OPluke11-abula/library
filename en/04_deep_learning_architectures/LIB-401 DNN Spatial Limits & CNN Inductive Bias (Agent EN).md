---
call_number: LIB-401
status: source-verified
invariants_count: 3
title: DNN Spatial Limits & CNN Inductive Bias (Agent Edition)
module: DL-Architectures
category: Architecture-Core
audience:
  - Autonomous-Agent
  - Graduate-PhD
  - Senior-ML-Engineer
math_foundations:
  - Permutation Invariance vs Translation Equivariance
  - Receptive Field Arithmetic & Dilation Geometry
  - Parameter Efficiency & Weight Sharing Bounds
hardware_target:
  - NVIDIA Tensor Core Implicit GEMM Convolution
created: 2026-09-17
author: Luke
tags:
  - cnn
  - inductive-bias
  - translation-equivariance
  - receptive-field
prerequisites:
  - "[[LIB-101 Linear Algebra & High-Dimensional Geometry (Agent EN)]]"
  - "[[LIB-203 Computer Architecture & Hardware-Aware Deep Learning (Agent EN)]]"
  - "[[LIB-301 Dataset Bias, Domain Shift & Spatial Penalties (Agent EN)]]"
successors:
  - "[[LIB-405 Attention Mechanism & Transformer Revolution (Agent EN)]]"
  - "[[LIB-501 CV Preprocessing & Center of Mass Alignment (Agent EN)]]"
  - "[[LIB-901 Classic Project Post-Mortem - Production MNIST (Agent EN)]]"
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

### [RULE-401-01] Spatial Inductive Bias & Translation Equivariance Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: 2D grid perception tasks MUST prioritize convolutional layers with local weight sharing over fully-connected architectures to preserve translation equivariance: $f(T_v(x)) = T_v(f(x))$.
- **Violation Consequence**: Fully connected networks discard grid spatial topology, requiring exponential parameter counts ($O(H W \cdot C)$) that overfit training coordinates.

### [RULE-401-02] Effective Receptive Field (ERF) Scale Coverage Invariant
- **Contract Level**: `HIGH_INVARIANT`
- **Specification**: Neural feature extractors MUST be engineered such that the theoretical receptive field at the final representation layer covers $\ge 100\%$ of target input object spatial bounds.
- **Violation Consequence**: Insufficient receptive field spans prevent the network from integrating global contextual relationships, causing semantic misclassifications on large-scale objects.

### [RULE-401-03] Feature Map Padding & Boundary Consistency Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: Convolutional layer padding MUST be symmetric and configured ($p = \lfloor k/2 floor$ for stride 1) to prevent feature map drift and boundary truncation across deep hierarchies.
- **Violation Consequence**: Asymmetric or unpadded convolutions induce spatial feature shifts toward frame edges, causing structural distortion in downstream feature representations.

