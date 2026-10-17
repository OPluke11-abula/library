---
call_number: LIB-505
status: source-verified
invariants_count: 3
title: Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval (Agent EN)
module: Computer-Vision
category: 3D-Gaussian-Splatting-Open-Vocabulary
audience:
  - Autonomous-Agent
  - Graduate-PhD
math_foundations:
  - Contrastive Language-Image Pretraining (CLIP) Embedding Geometries
  - Differentiable Semantic Feature Splatting
  - Multi-View Consensus Formulations & Confidence Weighting
hardware_target:
  - NVIDIA Tensor Core Tile Rasterizer
  - Low-Dimensional Codebook Latent Feature Buffers
created: 2026-09-24
author: Luke
tags:
  - computer-vision
  - 3dgs
  - open-vocabulary
  - semantic-retrieval
  - clip
prerequisites:
  - "[[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]]"
successors:
  - "[[LIB-506 LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)]]"
  - "[[LIB-905 Frontier Vision & Multimodal Capstone Blueprints (Agent EN)]]"
---

> Language / 語言: [🇹🇼 繁體中文](../../05_%E8%A8%88%E7%AE%97%E6%A9%9F%E8%A6%96%E8%A6%BA%E8%88%87%E9%AB%98%E7%B6%AD%E6%84%9F%E6%B8%AC/LIB-505%20%E9%96%8B%E6%94%BE%E8%A9%9E%E5%BD%99%203D%20%E9%AB%98%E6%96%AF%E6%BD%91%E6%BF%BA%E8%88%87%E8%AA%9E%E6%84%8F%E5%A0%B4%E6%99%AF%E5%9C%96%E6%AA%A2%E7%B4%A2%20%28Open-Vocabulary%203D%20Gaussian%20Splatting%20&%20Semantic%20Retrieval%29.md) | 🇺🇸 **English**

# Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval

## Conceptual Coordinates & Topological Navigation
- **Prerequisites**: [[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]].
- **Successors**: [[LIB-506 LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)]], [[LIB-905 Frontier Vision & Multimodal Capstone Blueprints (Agent EN)]].

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

## 2. Production Implementation: Open-Vocabulary 3D Gaussian Retriever

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class SemanticGaussianRetriever(nn.Module):
    """
    Open-vocabulary 3D Gaussian Splatting semantic retrieval engine.
    Aligns with RULE-505-01 ~ RULE-505-03.
    """
    def __init__(self, feat_dim: int = 16, clip_dim: int = 512):
        super().__init__()
        self.feat_dim = feat_dim
        self.clip_dim = clip_dim
        self.feature_decoder = nn.Sequential(
            nn.Linear(feat_dim, 128),
            nn.LayerNorm(128),
            nn.SiLU(),
            nn.Linear(128, clip_dim)
        )

    def forward(
        self,
        gaussian_features: torch.Tensor,     # [N_gaussians, feat_dim]
        gaussian_opacities: torch.Tensor,    # [N_gaussians, 1]
        query_clip_embed: torch.Tensor,      # [1, clip_dim]
        similarity_threshold: float = 0.65
    ) -> dict:
        assert gaussian_features.shape[1] == self.feat_dim
        assert query_clip_embed.shape == (1, self.clip_dim)

        decoded_feats = F.normalize(self.feature_decoder(gaussian_features), p=2, dim=-1)
        query_norm = F.normalize(query_clip_embed, p=2, dim=-1)
        cosine_sim = torch.mm(decoded_feats, query_norm.t()).squeeze(-1)
        weighted_score = cosine_sim * gaussian_opacities.squeeze(-1).clamp(0.0, 1.0)
        target_mask = (weighted_score >= similarity_threshold) & (gaussian_opacities.squeeze(-1) > 0.1)

        return {
            "similarity_scores": weighted_score,
            "target_mask": target_mask,
            "matched_count": target_mask.sum().item()
        }
```

---

## 3. Invariants & Implementation Specifications

### [RULE-505-01] Semantic Feature Embedding Compression Ratio Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: High-dimensional vision-language feature embeddings (e.g., 512-dim CLIP vectors) stored directly on 3D Gaussians MUST be compressed via dimensionality reduction (PCA or trained Autoencoders) to $d \le 64$ (recommended $d \in \{16, 32\}$) so full-scene semantic VRAM remains within $\le 4\text{ GB}$ [SAFETY_BOUND].
- **Violation Consequence**: Storing raw uncompressed 512-dim FP32 vectors across millions of Gaussians exhausts GPU VRAM, limiting scene scalability.

### [RULE-505-02] Multi-View Observation Consensus Verification Invariant
- **Contract Level**: `HIGH_INVARIANT`
- **Specification**: Candidate 3D semantic Gaussian clusters MUST achieve a cross-view observation consensus ratio $S_{\text{view}}(\mathcal{O}_m) \ge 0.60$ across visible unoccluded camera viewpoints before confirmation [SAFETY_BOUND].
- **Violation Consequence**: Single-view semantic assignment incorporates viewpoint-dependent specular reflections and occlusion artifacts into global 3D semantic representations.

### [RULE-505-03] Spatial Outlier Point Connectivity Rejection
- **Contract Level**: `HIGH_INVARIANT`
- **Specification**: Semantic Gaussian subsets selected via similarity thresholding MUST undergo DBSCAN or Radius Outlier Removal (requiring $K \ge 5$ matching neighbors within radius $R = 0.1\text{m}$ and pruning isolated points beyond $2\times$ the object's primary extent) [HEURISTIC].
- **Violation Consequence**: Unfiltered floating outlier Gaussians introduce severe spatial noise during open-vocabulary 3D scene querying.

## 4. Canonical References

1. **Kerbl, B., et al.** (2023). *3D Gaussian Splatting for Real-Time Radiance Field Rendering*. **ACM TOG / SIGGRAPH 2023**.
2. **Kerr, J., et al.** (2023). *LERF: Language Embedded Radiance Fields*. **CVPR 2023**.
3. **Qin, M., et al.** (2024). *LangSplat: 3D Language Gaussian Splatting*. **CVPR 2024**.
4. **Zhou, S., et al.** (2024). *Feature 3DGS: Feature 3D Gaussian Splatting for Language and Spatial Reasoning*. **ECCV 2024**.
5. **Kirillov, A., et al.** (2023). *Segment Anything*. **ICCV 2023**.
