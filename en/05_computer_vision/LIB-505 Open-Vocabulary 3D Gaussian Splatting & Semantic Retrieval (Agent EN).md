---
call_number: LIB-505
title: Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval (Agent EN)
module: Computer-Vision
category: 3D-Gaussian-Splatting-Open-Vocabulary
audience:
  - Autonomous-Agent
  - Graduate-PhD
status: Verified-Authoritative-Production
math_foundations:
  - Contrastive Language-Image Pretraining (CLIP) Embedding Geometries
  - Differentiable Semantic Feature Splatting
  - Multi-View Consensus Formulations & Confidence Weighting
hardware_target:
  - NVIDIA Tensor Core Tile Rasterizer
  - Low-Dimensional Codebook Latent Feature Buffers
invariants_count: 3
created: 2026-09-24
author: Luke
prerequisites:
  - "[[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]]"
successors:
  - "[[LIB-506 LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)]]"
  - "[[LIB-905 Frontier Vision & Multimodal Capstone Blueprints (Agent EN)]]"
tags:
  - computer-vision
  - 3dgs
  - open-vocabulary
  - semantic-retrieval
  - clip
---

> Language / 語言: [🇹🇼 繁體中文](../../05_%E8%A8%88%E7%AE%97%E6%A9%9F%E8%A6%96%E8%A6%BA%E8%88%87%E9%AB%98%E7%B6%AD%E6%84%9F%E6%B8%AC/LIB-505%20%E9%96%8B%E6%94%BE%E8%A9%9E%E5%BD%99%203D%20%E9%AB%98%E6%96%AF%E6%BD%91%E6%BF%BA%E8%88%87%E8%AA%9E%E6%84%8F%E5%A0%B4%E6%99%AF%E5%9C%96%E6%AA%A2%E7%B4%A2%20%28Open-Vocabulary%203D%20Gaussian%20Splatting%20&%20Semantic%20Retrieval%29.md) | 🇺🇸 **English**

# Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval

## 1. Mathematical Formalization of Semantic Splatting

Each explicit 3D Gaussian primitive is extended with a low-dimensional semantic embedding vector $f_i \in \mathbb{R}^d$ ($d \ll D_{\text{CLIP}}$, typically $d \in \{16, 32\}$):
$$\mathcal{G}_i = \left( \mu_i \in \mathbb{R}^3, \Sigma_i \in \mathbb{S}_{++}^3, \alpha_i \in [0, 1], c_i \in \mathbb{R}^k, f_i \in \mathbb{R}^d \right)$$

### Differentiable Feature Accumulation
The rendered 2D semantic feature map $F(u, v)$ across ordered tile primitives is:
$$F(u, v) = \sum_{i \in \mathcal{N}} f_i \, \alpha_i \prod_{j=1}^{i-1} (1 - \alpha_j)$$

Decoded CLIP features are obtained via a lightweight MLP decoder $\mathcal{D}_{\psi}: \mathbb{R}^d \to \mathbb{R}^{512}$:
$$\hat{F}_{\text{CLIP}}(u, v) = \mathcal{D}_{\psi}(F(u, v))$$

### Composite Query Scoring Function
Given a natural language query $q$ with CLIP text embedding $e_q$:
$$\text{Score}(q, \mathcal{O}_m) = \alpha \cdot \frac{\langle e_q, \mathcal{D}_{\psi}(\bar{f}_m) \rangle}{\|e_q\| \|\mathcal{D}_{\psi}(\bar{f}_m)\|} + \beta \cdot S_{\text{view}}(\mathcal{O}_m) + \gamma \cdot \bar{\alpha}_m$$
where $S_{\text{view}}$ enforces cross-view consensus across training camera frustums.

---

## 2. Invariants & Implementation Specifications

- `INV-505-01 (Feature Bottleneck)`: In-memory Gaussian primitives MUST NOT store uncompressed $>64$-dim embeddings. Latent codebook dimensionality $d \le 32$ is strictly enforced.
- `INV-505-02 (Multi-View Consensus)`: Target candidate clusters MUST be validated across $\ge 60\%$ of unoccluded viewpoints to eliminate single-view specular artifacts.
- `INV-505-03 (Spatial Density Outlier Filtering)`: Activated Gaussian subsets MUST pass DBSCAN spatial clustering ($eps=0.15\text{m}$, $min\_samples=10$) before computing bounding centroids.

---

## 3. Canonical References

1. **Qin, M., et al.** (2024). *LangSplat: 3D Language Gaussian Splatting*. **CVPR 2024**.
2. **Zhou, S., et al.** (2024). *Feature 3DGS: Feature 3D Gaussian Splatting for Language and Spatial Reasoning*. **ECCV 2024**.
3. **Kerr, J., et al.** (2023). *LERF: Language Embedded Radiance Fields*. **CVPR 2023**.
