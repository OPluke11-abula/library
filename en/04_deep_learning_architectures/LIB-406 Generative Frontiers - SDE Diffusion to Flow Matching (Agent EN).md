---
call_number: LIB-406
status: source-verified
invariants_count: 4
title: Generative Frontiers - SDE Diffusion to Flow Matching & DiT Revolution (Agent Edition)
module: Generative-AI
category: Frontiers-Core
audience:
  - Autonomous-Agent
  - Graduate-PhD
  - Research-Scientist
math_foundations:
  - Stochastic Differential Equations (Itô Calculus & SDEs)
  - Score Matching & Tweedie's Denoising Formula
  - Optimal Transport Flow Matching (OT-FM)
  - Diffusion Transformers (DiT & adaLN-Zero)
hardware_target:
  - High-Throughput Cluster (H100/B200 NVLink)
created: 2026-09-17
author: Luke
tags:
  - diffusion
  - flow-matching
  - dit
  - score-based-models
  - optimal-transport
prerequisites:
  - "[[LIB-104 Convex Optimization & Gradient Descent (Agent EN)]]"
  - "[[LIB-405 Attention Mechanism & Transformer Revolution (Agent EN)]]"
successors:
  - "[[LIB-407 Fine-Grained Instruction Image Editing & Cross-Attention Preservation (Agent EN)]]"
  - "[[LIB-408 Context-Aware Object Generation, Illumination Estimation & Image Compositing (Agent EN)]]"
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../04_%E6%B7%B1%E5%BA%A6%E5%AD%B8%E7%BF%92%E6%9E%B6%E6%A7%8B%E8%88%87%E7%A5%9E%E7%B6%93%E6%A9%9F%E5%88%B6/LIB-406%20%E7%94%9F%E6%88%90%E6%A8%A1%E5%9E%8B%E5%89%8D%E6%B2%BF%EF%BC%9A%E5%BE%9E%E9%9A%A8%E6%A9%9F%E5%BE%AE%E5%88%86%E6%96%B9%E7%A8%8B%20%28SDE%29%20%E6%93%B4%E6%95%A3%E6%A8%A1%E5%9E%8B%E5%88%B0%E6%9C%80%E4%BD%B3%E5%82%B3%E8%BC%B8%E6%B5%81%E5%8C%B9%E9%85%8D%20%28Flow%20Matching%29%20%E8%88%87%20DiT%20%E9%9D%A9%E5%91%BD%20%28Generative%20Frontiers%20-%20From%20Score-Based%20SDE%20Diffusion%20to%20Optimal%20Transport%20Flow%20Matching%20%26%20DiT%20Revolution%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Generative Frontiers: SDE Score-Based Diffusion to Optimal Transport Flow Matching

## 1. Conceptual Mental Model

Traditional Generative Adversarial Networks (GANs) suffer from severe mode collapse due to adversarial min-max instabilities. Diffusion models revolutionized generation by treating synthesis as **progressive denoising along a reverse thermodynamic time trajectory**. Flow Matching takes the final evolutionary leap: replacing curved Brownian random walks with **deterministic, straight constant-velocity probability flows**, compressing sampling from 50 curved steps down to 4-8 linear Euler steps.

---

## 2. Mathematical Formalization

### 1. The Continuous SDE Framework (Song et al., 2020)
The forward diffusion process transforms complex data distribution $p_0(x)$ into pure Gaussian noise $p_T(x) \sim \mathcal{N}(0, I)$ via an Itô SDE:
$$dx = f(x, t) dt + g(t) dw$$
where $w$ is standard Brownian motion.
Anderson's reverse-time SDE theorem proves the time-reversed process is also a diffusion governed by:
$$dx = \left[ f(x, t) - g(t)^2 \nabla_x \log p_t(x) \right] dt + g(t) d\bar{w}$$
where $\nabla_x \log p_t(x)$ is the **Stein Score Function**, parameterized by neural network $s_\theta(x, t)$.

### 2. Optimal Transport Flow Matching (OT-FM) (Lipman et al., 2023)
Instead of injecting noise, Flow Matching constructs a time-dependent probability density path $p_t(x)$ driven by velocity field $v_t(x)$:
$$\frac{\partial p_t(x)}{\partial t} + \nabla \cdot (p_t(x) v_t(x)) = 0 \quad (\text{Continuity Equation})$$
Given data sample $x_1 \sim q(x_1)$ and prior noise $x_0 \sim \mathcal{N}(0, I)$, the **Optimal Transport conditional path** defines a linear interpolation trajectory:
$$\psi_t(x) = (1 - (1 - \sigma_{\min}) t) x_0 + t x_1$$
The true conditional velocity field is constant in time:
$$u_t(x | x_0, x_1) = \frac{d}{dt} \psi_t(x) = x_1 - (1 - \sigma_{\min}) x_0$$
The objective is simple regression without SDE stochastic drift:
$$\mathcal{L}_{\text{FM}}(\theta) = \mathbb{E}_{t \sim \mathcal{U}[0, 1], x_0, x_1} \left\| v_\theta(\psi_t(x_0, x_1), t) - (x_1 - (1 - \sigma_{\min}) x_0) \right\|_2^2$$

### 3. Diffusion Transformer (DiT) Architecture
Replacing legacy U-Nets with standard Vision Transformer backbones:
1. **Patchification**: Image $x \in \mathbb{R}^{H \times W \times C}$ flattened into $p \times p$ patches $\to$ sequence length $N = (H W) / p^2$.
2. **adaLN-Zero Conditioning**: Adaptive LayerNorm parameters $(\gamma, \beta, \alpha)$ dynamically regressed from time embedding $t$:
   $$\text{adaLN}(h, t) = \gamma(t) \odot \text{LayerNorm}(h) + \beta(t)$$
   Crucially, scale factor $\alpha(t)$ is initialized to 0 at $t = 0$, making each residual block an exact identity function at initialization.

---

## 3. Production Optimal Transport Flow Matching Sampler

```python
import torch

@torch.no_grad()
def sample_flow_matching_euler(model, noise: torch.Tensor, steps: int = 10) -> torch.Tensor:
    """
    Solves probability flow ODE via simple Euler integration in 10 steps.
    Trajectory: x(0) ~ N(0, I) -> x(1) ~ Data
    """
    dt = 1.0 / steps
    x = noise
    for i in range(steps):
        t_scalar = i / steps
        t = torch.full((x.shape[0],), t_scalar, device=x.device, dtype=x.dtype)
        
        # Predict constant velocity vector field v_theta(x, t)
        v = model(x, t)
        
        # Euler step: x_{t + dt} = x_t + v * dt
        x = x + v * dt
    return x
```

---

## 4. Agent Invariants & Decision Protocols

### [RULE-406-01] Optimal Transport Straight-Flow Path Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: In Flow Matching and Rectified Flow generative architectures, probability trajectories MUST follow optimal transport conditioning $x_t = (1 - t) x_0 + t x_1$ with constant target velocity $u_t(x_t) = x_1 - x_0$.
- **Violation Consequence**: Non-linear diffusion noise schedules introduce high trajectory curvature, requiring excessive ODE solver integration steps during inference.

### [RULE-406-02] AdaLN-Zero Identity Initialization Invariant
- **Contract Level**: `STABILITY_CRITICAL`
- **Specification**: In Diffusion Transformer (DiT) blocks, projection layers modulating scale and shift parameters ($\gamma, \beta, \alpha$) MUST be initialized strictly to zero (`nn.init.zeros_`).
- **Violation Consequence**: Non-zero initialization breaks identity mapping at initialization, causing initial forward activations to explode in deep residual stacks.

### [RULE-406-03] ODE Solver Truncation Error Bound Invariant
- **Contract Level**: `PERFORMANCE_CRITICAL`
- **Specification**: In Flow Matching numerical ODE sampling, solver step counts $N_{\text{steps}}$ MUST balance truncation error $\mathcal{O}(\Delta t^p)$ and compute latency. Single-step Euler integration is restricted to distilled flow networks.
- **Violation Consequence**: Under-stepping ODE integration without distillation introduces severe perceptual truncation artifacts and mode collapse.

### [RULE-406-04] MM-DiT Dual-Stream Modality Isolation Invariant
- **Contract Level**: `BOUNDARY_GUARD`
- **Specification**: Multi-modal Diffusion Transformers (MM-DiT) MUST maintain distinct linear projections and LayerNorm parameters for visual and textual token sequences, joining representations exclusively within the cross-attention kernel.
- **Violation Consequence**: Forcing heterogeneous modalities through shared projection layers causes severe cross-modal interference and degraded text-image alignment.

