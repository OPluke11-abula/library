---
call_number: LIB-602
title: Modern LLM Architecture & Scaling Laws (Agent Edition)
module: LLM-Core
category: Architecture-Core
audience:
  - Autonomous-Agent
  - Graduate-PhD
  - LLM-Engineer
status: Verified-Authoritative-Production
math_foundations:
  - Chinchilla Compute-Optimal Frontier (Hoffmann et al.)
  - SwiGLU Gated Activation Mathematics
  - Grouped-Query Attention (GQA) Memory Budgeting
hardware_target:
  - Tensor Parallelism & Pipeline Parallelism Clusters
invariants_count: 5
created: 2026-09-17
author: Luke (Chi-Yang Yu) & AI Research Agent (Antigravity)
prerequisites:
  - "[[LIB-405 Attention Mechanism & Transformer Revolution (Agent EN)]]"
  - "[[LIB-203 Computer Architecture & Hardware-Aware Deep Learning (Agent EN)]]"
successors:
  - "[[LIB-703 LLM Agent Cognitive Architecture & Protocols (Agent EN)]]"
  - "[[LIB-802 Quantization Mathematics & Low-Precision Inference (Agent EN)]]"
tags:
  - llm
  - scaling-laws
  - chinchilla
  - swiglu
  - gqa
  - rmsnorm
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../06_%E8%87%AA%E7%84%B6%E8%AA%9E%E8%A8%80%E8%99%95%E7%90%86%E8%88%87%E5%A4%A7%E8%AA%9E%E8%A8%80%E6%A8%A1%E5%9E%8B/LIB-602%20%E7%8F%BE%E4%BB%A3%E5%A4%A7%E8%AA%9E%E8%A8%80%E6%A8%A1%E5%9E%8B%E6%9E%B6%E6%A7%8B%E8%A7%A3%E5%89%96%E8%88%87%E7%B8%AE%E6%94%BE%E5%AE%9A%E5%BE%8B%20%28Modern%20LLM%20Architecture%20%26%20Scaling%20Laws%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Modern Large Language Model Architectures & Empirical Scaling Laws

## 1. Conceptual Mental Model

Modern generative Large Language Models (such as LLaMA-3, Mistral, and Gemma) depart substantially from the original 2017 Vaswani Transformer. Standard Post-LN was abandoned due to vanishing gradient instabilities; absolute positional embeddings were supplanted by RoPE; ReLU was replaced by SwiGLU; and standard Multi-Head Attention was replaced by Grouped-Query Attention (GQA) to tame the explosive memory footprint of the Key-Value (KV) cache. Understanding these architectural transitions is vital for optimizing agent inference throughput.

---

## 2. Mathematical Formalization

### 1. The Chinchilla Scaling Law (Hoffmann et al., 2022)
Under a fixed computational budget of $C \approx 6 N D$ FLOPs (where $N$ is parameter count and $D$ is training token count), empirical risk models follow a power-law frontier:
$$L(N, D) = E + \frac{A}{N^\alpha} + \frac{B}{D^\beta}$$
where $E$ is irreducible loss.
The optimal compute allocation condition requires:
$$N_{\text{opt}} \propto C^a, \quad D_{\text{opt}} \propto C^b, \quad a = \frac{\beta}{\alpha + \beta} \approx 0.5, \quad b = \frac{\alpha}{\alpha + \beta} \approx 0.5$$
**Crucial Finding**: For compute-optimal performance, model parameters and token counts MUST scale equally in a **1:20 ratio** (~20 tokens per model parameter). Models like Chinchilla 70B trained on 1.4T tokens systematically outperform oversized under-trained models like Gopher 280B.

### 2. Modern Architectural Primitives
1. **RMSNorm (Root Mean Square Normalization)**:
   Dispenses with mean re-centering in LayerNorm, reducing arithmetic complexity:
   $$\text{RMSNorm}(x) = \frac{x}{\text{RMS}(x)} \odot \gamma, \quad \text{RMS}(x) = \sqrt{\frac{1}{d} \sum_{i=1}^d x_i^2 + \epsilon}$$
2. **SwiGLU Activation Function**:
   Gated linear unit with Swish activation $\text{Swish}(x) = x \cdot \sigma(\beta x)$:
   $$\text{SwiGLU}(x) = \left( \text{Swish}(x W_{\text{gate}}) \odot (x W_{\text{up}}) \right) W_{\text{down}}$$
   Expands intermediate MLP dimension to $d_{\text{ffn}} = \left\lfloor \frac{8}{3} d_{\text{model}} \right\rfloor$.
3. **Grouped-Query Attention (GQA)**:
   Standard MHA maintains $H$ query heads and $H$ key/value heads. In GQA, $H_Q$ query heads share $H_{KV}$ key/value heads (where $H_Q = G \times H_{KV}$):
   $$\text{KV Cache Memory Compression Factor} = \frac{H_Q}{H_{KV}}$$
   For LLaMA-3 70B ($H_Q = 64, H_{KV} = 8$), KV cache memory is reduced by **$8 \times$**, enabling $128\text{K}$ context window deployments.

---

## 3. Production KV Cache Budgeting Formula

$$\text{KV Cache Memory (Bytes)} = 2 \times B \times S \times L \times H_{KV} \times d_k \times \text{BytesPerElement}$$
For a sequence length $S = 32,768$, batch size $B = 4$, $L = 32$, $H_{KV} = 8$, $d_k = 128$, with FP16 ($\text{BytesPerElement} = 2$):
$$\text{Memory} = 2 \times 4 \times 32768 \times 32 \times 8 \times 128 \times 2 = 17,179,869,184 \text{ Bytes} \approx 16.0 \text{ GB}$$

---

## 4. Agent Invariants & Decision Protocols

- `INV-602-01 (Compute-Optimal Ratio)`: Training runs MUST NOT exceed parameter-to-token ratios where $D < 20 N$, preventing premature model degradation.
- `INV-602-02 (GQA KV Cache Allocation)`: In production serving environments, agents MUST specify GQA configurations ($H_{KV} \le H_Q / 4$) when deployment context length exceeds $16\text{K}$ tokens.
- `INV-602-03 (RoPE Base Frequency Scaling)`: When extending context windows beyond pre-training length $L_0$, the RoPE base frequency $\theta_0 = 10,000$ MUST be scaled (e.g., to $500,000$ via YaRN or linear RoPE scaling) to prevent perplexity explosion.
