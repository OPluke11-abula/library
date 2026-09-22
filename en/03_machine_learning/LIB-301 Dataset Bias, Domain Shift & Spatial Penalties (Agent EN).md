---
call_number: LIB-301
title: Dataset Bias, Domain Shift & Spatial Penalties (Agent Edition)
module: ML-Statistical-Foundations
category: Theory-Perception
audience:
  - Autonomous-Agent
  - Graduate-PhD
  - Senior-ML-Engineer
status: Verified-Authoritative-Production
math_foundations:
  - Covariate Shift vs Concept Drift
  - Maximum Mean Discrepancy (MMD) & Wasserstein Distance
  - Cultural Dataset Bias & Out-of-Distribution (OOD) Bounds
hardware_target:
  - Edge Embedded & Production Servers
invariants_count: 4
created: 2026-09-17
author: Luke
prerequisites:
  - "[[LIB-000 Grand Library Index & Navigator (Agent EN)]]"
  - "[[LIB-101 Linear Algebra & High-Dimensional Geometry (Agent EN)]]"
successors:
  - "[[LIB-401 DNN Spatial Limits & CNN Inductive Bias (Agent EN)]]"
  - "[[LIB-501 CV Preprocessing & Center of Mass Alignment (Agent EN)]]"
tags:
  - dataset-bias
  - domain-shift
  - covariate-shift
  - spatial-penalties
  - ood-generalization
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../03_%E6%A9%9F%E5%99%A8%E5%AD%B8%E7%BF%92%E8%88%87%E7%B5%B1%E8%A8%88%E5%AD%B8%E7%BF%92%E5%8E%9F%E7%90%86/LIB-301%20%E8%B3%87%E6%96%99%E5%88%86%E4%BD%88%E5%81%8F%E5%B7%AE%E3%80%81%E9%A0%98%E5%9F%9F%E6%BC%82%E7%A7%BB%E8%88%87%E7%A9%BA%E9%96%93%E6%AC%8A%E9%87%8D%E6%87%B2%E7%BD%B0%E5%B9%BE%E4%BD%95%20%28Dataset%20Bias%2C%20Domain%20Shift%20%26%20Spatial%20Penalties%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Dataset Bias, Domain Shift & Spatial Penalties in Neural Perception

## 1. Conceptual Mental Model

Models do not fail because deep learning is flawed; models fail because the **empirical training distribution $P_{\text{train}}(X)$ does not equal the production inference distribution $P_{\text{test}}(X)$**. In handwritten digit recognition, the benchmark MNIST dataset reflects 1990s US Census Bureau writing habits (where the digit "7" is predominantly written with a horizontal crossbar or distinctive slant). When presented with upright, uncrossed Asian handwritten "7"s, models trained without spatial robustness suffer catastrophic distribution collapse, falsely misclassifying "7" as "1" with $> 99\%$ overconfidence.

---

## 2. Mathematical Formalization

### 1. Covariate Shift vs Concept Shift
Let $(X, Y) \sim P(X, Y) = P(Y|X) P(X)$.
- **Covariate Shift**: The marginal input distribution drifts, while the underlying conditional label mapping remains invariant:
  $$P_{\text{train}}(X) \neq P_{\text{test}}(X), \quad P_{\text{train}}(Y|X) = P_{\text{test}}(Y|X)$$
- **Concept Shift**: The conditional decision boundary itself changes:
  $$P_{\text{train}}(Y|X) \neq P_{\text{test}}(Y|X)$$

### 2. Measuring Distribution Divergence: Maximum Mean Discrepancy (MMD)
In a Reproducing Kernel Hilbert Space (RKHS) $\mathcal{H}$ associated with kernel $k(\cdot, \cdot)$:
$$\text{MMD}^2(\mathcal{H}, P, Q) = \left\| \mathbb{E}_{X \sim P}[\phi(X)] - \mathbb{E}_{Y \sim Q}[\phi(Y)] \right\|_{\mathcal{H}}^2$$
Empirical estimator with $m$ source and $n$ target samples:
$$\text{MMD}_u^2 = \frac{1}{m(m-1)} \sum_{i=1}^m \sum_{j \neq i}^m k(x_i, x_j) + \frac{1}{n(n-1)} \sum_{i=1}^n \sum_{j \neq i}^n k(y_i, y_j) - \frac{2}{mn} \sum_{i=1}^m \sum_{j=1}^n k(x_i, y_j)$$

### 3. Spatial Weight Penalties & Loss Geometry
Standard cross-entropy treats all misclassifications symmetrically. When evaluating domain shifts (such as distinguishing vertical Asian "7" from "1"), we incorporate a **Spatial Discriminative Penalty** $\Omega(x)$ based on the presence/absence of horizontal top strokes:
$$\mathcal{L}_{\text{total}}(x, y) = \mathcal{L}_{\text{CE}}(f(x), y) + \lambda \cdot \Omega_{\text{spatial}}(x, f(x))$$
where:
$$\Omega_{\text{spatial}}(x, \hat{y}) = \mathbb{I}(\hat{y} = 1 \land y = 7) \cdot \left\| \nabla_x \text{TopStroke}(x) \right\|_2^2$$

---

## 3. Production Domain Adaptation Contract

```python
import torch
import torch.nn as nn

def compute_mmd_loss(source_features: torch.Tensor, target_features: torch.Tensor, kernel_mul: float = 2.0, kernel_num: int = 5) -> torch.Tensor:
    """
    Computes multi-scale Gaussian RBF Maximum Mean Discrepancy (MMD) loss
    between source domain features and unlabelled target domain features.
    """
    n_samples = int(source_features.size()[0])
    total = torch.cat([source_features, target_features], dim=0)
    
    # Pairwise L2 squared distance matrix
    total0 = total.unsqueeze(0).expand(total.size(0), total.size(0), total.size(1))
    total1 = total.unsqueeze(1).expand(total.size(0), total.size(0), total.size(1))
    l2_distance = ((total0 - total1) ** 2).sum(2)
    
    # Bandwidth heuristic
    bandwidth = torch.sum(l2_distance.data) / (total.size(0) ** 2 - total.size(0))
    bandwidth /= kernel_mul ** (kernel_num // 2)
    bandwidth_list = [bandwidth * (kernel_mul ** i) for i in range(kernel_num)]
    
    # Multi-kernel sum
    kernel_val = [torch.exp(-l2_distance / bw) for bw in bandwidth_list]
    XX = sum(kernel_val)[:n_samples, :n_samples]
    YY = sum(kernel_val)[n_samples:, n_samples:]
    XY = sum(kernel_val)[:n_samples, n_samples:]
    
    loss = torch.mean(XX) + torch.mean(YY) - 2 * torch.mean(XY)
    return loss
```

---

## 4. Agent Invariants & Decision Protocols

- `INV-301-01 (Cultural Domain Awareness)`: Models trained on Western MNIST MUST incorporate synthetic augmentation reproducing Asian handwritten variants (e.g., straight uncrossed vertical strokes, centered strokes).
- `INV-301-02 (OOD Confidence Clamping)`: When input feature MMD distance exceeds threshold $\tau_{\text{OOD}} = 0.45$, agents MUST flag the prediction as Out-of-Distribution and reject automated decision emission.
- `INV-301-03 (Spatial Masking)`: Critical spatial regions (top horizontal stroke in digit 7) MUST NOT be wiped out during random affine augmentations (limit rotation angle $|\theta| \le 15^\circ$).
