---
call_number: LIB-505
status: source-verified
invariants_count: 4
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
  - "[[LIB-507 Sparse-View 3DGS Geometry, Depth Priors & Reliability (Agent EN)]]"
successors:
  - "[[LIB-506 LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)]]"
  - "[[LIB-905 Frontier Vision & Multimodal Capstone Blueprints (Agent EN)]]"
---

> Language / 語言: [🇹🇼 繁體中文](../../05_%E8%A8%88%E7%AE%97%E6%A9%9F%E8%A6%96%E8%A6%BA%E8%88%87%E9%AB%98%E7%B6%AD%E6%84%9F%E6%B8%AC/LIB-505%20%E9%96%8B%E6%94%BE%E8%A9%9E%E5%BD%99%203D%20%E9%AB%98%E6%96%AF%E6%BD%91%E6%BF%BA%E8%88%87%E8%AA%9E%E6%84%8F%E5%A0%B4%E6%99%AF%E5%9C%96%E6%AA%A2%E7%B4%A2%20%28Open-Vocabulary%203D%20Gaussian%20Splatting%20&%20Semantic%20Retrieval%29.md) | 🇺🇸 **English**

# Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval

## Conceptual Coordinates & Topological Navigation
- **Prerequisites**: [[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]], [[LIB-507 Sparse-View 3DGS Geometry, Depth Priors & Reliability (Agent EN)]].
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

### 1.4 Level 1–8 Query Complexity Taxonomy, Gaussian Covariance Affordance Gate & Calibrated Abstention `[FACT]` `[DERIVATION]` `[DESIGN_DECISION]` `[SAFETY_BOUND]`
With **OpenGaussian (ECCV 2024)**, **3DAffordSplat (ACM MM 2025 Oral, `arXiv:2504.11218`)**, **GenSplat (CVPR 2026)**, and **ReLaGS (CVPR 2026)** covering pure nouns, single attributes, and explicit spatial relations (**L1–L3**), defensible 3DGS retrieval research requires an **8-Level Query Taxonomy**: distinguishing zero-shot CLIP association from physical suitability/affordance (**L4**, e.g., `"something to sit on"`), unoccupied support state (**L5**, `"empty chair"` vs. cluttered chair vs. vertical wall poster), multi-factor composition (**L6–L7**), and **Unsatisfiable / Contradictory Queries (L8)** where naive Top-$K$ triggers false positives.

To satisfy the **Representation Substitution Test** and calibrate L8 abstention, decompose scoring via native Gaussian covariance geometry and occupancy:
$$S_{\mathrm{total}}(q, c_k) = \sigma\!\big(f_{\mathrm{CE}}(q, u_k)\big) \cdot \Phi_{\mathrm{geom}}\!\big(\{\mu_i, \Sigma_i\}_{i \in c_k}, \mathcal{P}_{\mathrm{req}}(q)\big) \cdot \Psi_{\mathrm{free}}\!\big(\mathcal{V}_{\mathrm{above}}(c_k), \mathcal{G}\big)$$
where local surface normal $\mathbf{n}_i = \arg\min_{\|\mathbf{u}\|_2=1} \mathbf{u}^\top \Sigma_i \mathbf{u}$ is extracted from the smallest eigenvector of 3D Gaussian covariance $\Sigma_i$ (`Phi_geom` verifies horizontal alignment $\mathbf{n}_k \cdot \mathbf{z}_{\mathrm{up}} \ge \cos\theta_{\max}$ and metric extent), $\Psi_{\mathrm{free}} = \exp(-\sum_{g_j \in \mathcal{V}_{\mathrm{above}}(c_k)} \alpha_j) \in (0, 1]$ penalizes occupied surfaces, and queries with $\max_k S_{\mathrm{total}}(q, u_k) < \tau_{\mathrm{abstain}}$ trigger `ABSTAINED` (`Abstention AUROC / ECE`) `[DERIVATION]` `[SAFETY_BOUND]`.

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

```python
import math

def extract_smallest_eigenvector_3x3(cov: tuple) -> tuple[float, float, float]:
    """Extract local surface normal n_i via shifted inverse power iteration on Sigma_i."""
    trace = cov[0][0] + cov[1][1] + cov[2][2]
    shift = max(trace, 1e-6)
    b00, b01, b02 = shift - cov[0][0], -cov[0][1], -cov[0][2]
    b10, b11, b12 = -cov[1][0], shift - cov[1][1], -cov[1][2]
    b20, b21, b22 = -cov[2][0], -cov[2][1], shift - cov[2][2]

    vx, vy, vz = 0.17, 0.31, 0.93
    for _ in range(18):
        nx = b00 * vx + b01 * vy + b02 * vz
        ny = b10 * vx + b11 * vy + b12 * vz
        nz = b20 * vx + b21 * vy + b22 * vz
        norm = math.sqrt(nx * nx + ny * ny + nz * nz)
        if norm < 1e-12:
            return (0.0, 0.0, 1.0)
        vx, vy, vz = nx / norm, ny / norm, nz / norm
    if vz < 0.0:
        vx, vy, vz = -vx, -vy, -vz
    return (vx, vy, vz)

def score_gaussian_affordance_and_abstain(
    semantic_score: float,
    cov_3x3: tuple,
    above_opacity_sum: float,
    max_tilt_deg: float = 20.0,
    tau_abstain: float = 0.35,
) -> tuple[float, str]:
    """Couple Gaussian normal gate Phi_geom, unoccupied gate Psi_free, and calibrated abstention."""
    normal = extract_smallest_eigenvector_3x3(cov_3x3)
    cos_limit = math.cos(math.radians(max_tilt_deg))
    phi_geom = 1.0 if normal[2] >= cos_limit else max(0.05, (normal[2] / cos_limit) ** 3)
    psi_free = math.exp(-max(0.0, above_opacity_sum))
    total = semantic_score * phi_geom * psi_free
    status = "ABSTAINED" if total < tau_abstain else "GROUNDED"
    return total, status

if __name__ == "__main__":
    cov_horiz = ((0.25, 0.0, 0.0), (0.0, 0.25, 0.0), (0.0, 0.0, 0.002))
    cov_vert = ((0.002, 0.0, 0.0), (0.0, 0.30, 0.0), (0.0, 0.0, 0.30))
    s_empty, st_empty = score_gaussian_affordance_and_abstain(0.85, cov_horiz, 0.02)
    s_clut, st_clut = score_gaussian_affordance_and_abstain(0.85, cov_horiz, 3.80)
    s_wall, st_wall = score_gaussian_affordance_and_abstain(0.85, cov_vert, 0.0)
    assert st_empty == "GROUNDED" and st_clut == "ABSTAINED" and st_wall == "ABSTAINED"
    assert s_empty > s_clut and s_empty > s_wall
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
- **Specification**: Semantic Gaussian subsets selected via similarity thresholding MUST undergo DBSCAN or Radius Outlier Removal (requiring $K \ge 5$ matching neighbors within radius $R = 0.1\text{m}$ and pruning isolated points beyond $2\times$ the object's primary extent) `[HEURISTIC]`.
- **Violation Consequence**: Unfiltered floating outlier Gaussians introduce severe spatial noise during open-vocabulary 3D scene querying.

### [RULE-505-04] Gaussian Covariance Affordance, Support Occupancy & Calibrated Abstention Invariant
- **Contract Level**: `HIGH_INVARIANT`
- **Specification**: Open-vocabulary 3DGS retrieval systems claiming physical affordance (L4), occupancy-state filtering (L5), or robustness against unsatisfiable queries (L8) MUST extract surface normals via the smallest eigenvector of 3D Gaussian covariance $\Sigma_i$ ($\Phi_{\mathrm{geom}}$), penalize occluded support volumes via $\Psi_{\mathrm{free}} = \exp(-\sum \alpha_j)$ `[DESIGN_DECISION]`, and output `ABSTAINED` rather than forced Top-$K$ false positives whenever $\max_k S_{\mathrm{total}}(q, u_k) < \tau_{\mathrm{abstain}}$ (calibrated strictly on Validation splits) `[SAFETY_BOUND]`.
- **Violation Consequence**: Pure CLIP association highlights vertical wall posters or cluttered objects as valid seating, while uncalibrated Top-$K$ retrieval hallucinates answers on L8 contradictory queries.

## 4. Canonical References

1. **Kerbl, B., et al.** (2023). *3D Gaussian Splatting for Real-Time Radiance Field Rendering*. **ACM TOG / SIGGRAPH 2023**.
2. **Kerr, J., et al.** (2023). *LERF: Language Embedded Radiance Fields*. **CVPR 2023**.
3. **Qin, M., et al.** (2024). *LangSplat: 3D Language Gaussian Splatting*. **CVPR 2024**.
4. **Zhou, S., et al.** (2024). *Feature 3DGS: Feature 3D Gaussian Splatting for Language and Spatial Reasoning*. **ECCV 2024**.
5. **Kirillov, A., et al.** (2023). *Segment Anything*. **ICCV 2023**.
6. **Wei, Z., et al.** (2025). *3DAffordSplat*, **ACM MM 2025 Oral** ([arXiv:2504.11218](https://arxiv.org/abs/2504.11218)); **ReLaGS** & **GenSplat** (**CVPR 2026**); **SeqAfford** (**CVPR 2025**).
