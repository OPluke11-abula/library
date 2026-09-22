---
call_number: LIB-802
title: Quantization Mathematics & Low-Precision Inference Architecture (Agent Edition)
module: Systems-Quantization
category: Engineering-Core
audience:
  - Autonomous-Agent
  - Systems-Architect
  - HPC-Engineer
status: Verified-Authoritative-Production
math_foundations:
  - Uniform Affine Quantization (Scale & Zero-Point)
  - Post-Training Quantization (PTQ) vs QAT (Straight-Through Estimator)
  - Second-Order Taylor Expansion & Optimal Brain Surgeon (GPTQ / AWQ)
hardware_target:
  - NVIDIA Tensor Core INT8 / INT4 / FP8 (Ada/Hopper/Blackwell)
invariants_count: 5
created: 2026-09-17
author: Luke (Chi-Yang Yu) & AI Research Agent (Antigravity)
prerequisites:
  - "[[LIB-101 Linear Algebra & High-Dimensional Geometry (Agent EN)]]"
  - "[[LIB-203 Computer Architecture & Hardware-Aware Deep Learning (Agent EN)]]"
successors:
  - "[[LIB-901 Classic Project Post-Mortem - Production MNIST (Agent EN)]]"
tags:
  - quantization
  - low-precision
  - int8
  - fp8
  - awq
  - gptq
  - tensorrt
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../08_AI%E7%B3%BB%E7%B5%B1%E5%B7%A5%E7%A8%8B%E8%88%87%E9%AB%98%E6%95%88%E9%83%A8%E7%BD%B2/LIB-802%20%E7%8F%BE%E4%BB%A3%E6%B7%B1%E5%BA%A6%E5%AD%B8%E7%BF%92%E6%A8%A1%E5%9E%8B%E9%87%8F%E5%8C%96%E7%90%86%E8%AB%96%E8%88%87%E4%BD%8E%E7%B2%BE%E5%BA%A6%E6%8E%A8%E8%AB%96%E6%9E%B6%E6%A7%8B%20%28Quantization%20Mathematics%20%26%20Low-Precision%20Inference%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Quantization Mathematics & Low-Precision Inference Architectures

## 1. Conceptual Mental Model

Serving deep neural networks in 32-bit floating point (FP32) is wasteful. 99% of neural network parameters do not require 24 bits of mantissa precision. **Quantization** projects continuous real numbers into discrete, low-bit integer lattices ($\mathbb{Z}$), slashing memory footprint by $4 \times$ (INT8) or $8 \times$ (INT4/FP8) while enabling specialized hardware **Tensor Core integer matrix engines (DP4A, WMMA)** to double or quadruple arithmetic throughput.

---

## 2. Mathematical Formalization

### 1. Uniform Affine Quantization
Mapping continuous variable $x \in [\alpha, \beta]$ to integer $q \in [q_{\min}, q_{\max}]$:
$$q = \text{clip}\left( \left\lfloor \frac{x}{S} \right\rceil + Z, \quad q_{\min}, \quad q_{\max} \right)$$
- **Scale Factor $S$**:
  $$S = \frac{\beta - \alpha}{q_{\max} - q_{\min}}$$
- **Zero-Point $Z$**:
  $$Z = \text{round}\left( \frac{-\alpha}{S} \right) + q_{\min}$$
**Dequantization**:
$$\hat{x} = S (q - Z)$$

### 2. Symmetric vs Asymmetric Quantization
- **Asymmetric**: Preserves arbitrary dynamic ranges $[\alpha, \beta]$ with non-zero $Z$. Used for post-ReLU activations ($x \ge 0$).
- **Symmetric**: Enforces $\alpha = -\beta \implies Z = 0$. Multiplications simplify:
  $$\hat{x}_1 \hat{x}_2 = (S_1 q_1)(S_2 q_2) = (S_1 S_2) (q_1 q_2)$$
  Directly maps to hardware INT8 dot-product instructions without zero-point cross-term corrections.

### 3. Second-Order Error Analysis (AWQ & GPTQ)
Quantizing weight matrix $W \to \hat{W} = W + \Delta W$ introduces output perturbation. Taylor expansion of loss $\mathcal{L}$:
$$\mathcal{L}(W + \Delta W) \approx \mathcal{L}(W) + g^T \Delta W + \frac{1}{2} \Delta W^T H \Delta W$$
At convergence, gradient $g = 0$. The error is governed by Hessian $H = 2 X X^T$.
- **GPTQ (Frantar et al., 2022)**: Recursively solves column-wise updates using the inverse Hessian $H^{-1}$:
  $$\Delta w_j = -\frac{w_j - \text{quant}(w_j)}{[H^{-1}]_{jj}} \cdot H_{:, j}^{-1}$$
- **AWQ (Lin et al., 2023)**: Discovers that protecting the top $1\%$ of salient channels (ranked by activation magnitude $\|X\|_2$) prevents perplexity degradation in 4-bit LLMs.

---

## 3. Production INT8 Symmetric Quantization Kernel

```python
import torch

def quantize_symmetric_int8(x: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
    """
    Symmetric per-tensor INT8 quantization.
    Input Contract:  Tensor x of any shape, dtype=float32
    Output Contract: q [int8], scale [float32]
    """
    max_val = torch.max(torch.abs(x))
    scale = max_val / 127.0
    scale = torch.clamp(scale, min=1e-8)
    
    q = torch.clamp(torch.round(x / scale), -128, 127).to(torch.int8)
    return q, scale

def dequantize_symmetric_int8(q: torch.Tensor, scale: torch.Tensor) -> torch.Tensor:
    """
    Dequantizes INT8 tensor back to float32.
    """
    return q.float() * scale
```

---

## 4. Agent Invariants & Decision Protocols

- `INV-802-01 (Symmetric Weights Invariant)`: Weight tensors MUST be quantized using symmetric quantization ($Z = 0$) to eliminate runtime zero-point subtraction overhead during matrix multiplication.
- `INV-802-02 (Outlier Channel Preservation)`: In 4-bit LLM quantization, activations with magnitude exceeding $3\sigma$ MUST remain in FP16 or be protected via AWQ scaling transforms.
- `INV-802-03 (Accuracy Degradation Guard)`: Post-quantization inference MUST NOT degrade baseline validation accuracy by more than $0.5\%$. If exceeded, fallback from INT4 to INT8 or FP8.
