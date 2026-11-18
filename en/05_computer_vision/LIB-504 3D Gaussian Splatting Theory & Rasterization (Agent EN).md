---
call_number: LIB-504
status: source-verified
invariants_count: 4
title: 3D Gaussian Splatting Theory & Rasterization (Agent Edition)
module: 3D-Vision
category: Frontiers-Perception
audience:
  - Autonomous-Agent
  - Graduate-PhD
  - Graphics-Research-Scientist
math_foundations:
  - 3D Covariance Matrix Decomposition (Quaternions & Scaling)
  - Projective Geometry & 2D Screen Space Projection (Zwicker EWA)
  - Differentiable Tile-Based Alpha-Blending & Radiance Sorting
hardware_target:
  - NVIDIA CUDA High-Throughput Rasterizer (> 100 FPS)
created: 2026-09-17
author: Luke
tags:
  - 3d-gaussian-splatting
  - nerf
  - radiance-fields
  - real-time-rendering
  - differential-rasterization
prerequisites:
  - "[[LIB-101 Linear Algebra & High-Dimensional Geometry (Agent EN)]]"
  - "[[LIB-203 Computer Architecture & Hardware-Aware Deep Learning (Agent EN)]]"
  - "[[LIB-502 Camera Projective Geometry, Epipolar Geometry & Structure-from-Motion (Agent EN)]]"
successors:
  - "[[LIB-505 Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval (Agent EN)]]"
  - "[[LIB-506 LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)]]"
  - "[[LIB-507 Sparse-View 3DGS Geometry, Depth Priors & Reliability (Agent EN)]]"
  - "[[LIB-508 Gaussian Optimization, Densification, Surface Fidelity & Fast Iteration (Agent EN)]]"
  - "[[LIB-905 Frontier Vision & Multimodal Capstone Blueprints (Agent EN)]]"
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../05_%E8%A8%88%E7%AE%97%E6%A9%9F%E8%A6%96%E8%A6%BA%E8%88%87%E9%AB%98%E7%B6%AD%E6%84%9F%E6%B8%AC/LIB-504%203D%20%E8%A6%96%E8%A6%BA%E5%89%8D%E6%B2%BF%EF%BC%9A%E7%A5%9E%E7%B6%93%E8%BC%BB%E5%B0%84%E5%A0%B4%20%28NeRF%29%20%E5%88%B0%203D%20%E9%AB%98%E6%96%AF%E6%BD%91%E6%BF%BA%20%283DGS%29%20%E7%90%86%E8%AB%96%E8%88%87%E5%85%89%E6%9F%B5%E5%8C%96%20%283D%20Gaussian%20Splatting%20Theory%20%26%20Rasterization%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# 3D Gaussian Splatting: Theory & Differentiable Rasterization

## Conceptual Coordinates & Topological Navigation
- **Prerequisites**: [[LIB-101 Linear Algebra & High-Dimensional Geometry (Agent EN)]], [[LIB-203 Computer Architecture & Hardware-Aware Deep Learning (Agent EN)]], [[LIB-502 Camera Projective Geometry, Epipolar Geometry & Structure-from-Motion (Agent EN)]].
- **Successors**: [[LIB-505 Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval (Agent EN)]], [[LIB-506 LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)]], [[LIB-507 Sparse-View 3DGS Geometry, Depth Priors & Reliability (Agent EN)]], [[LIB-508 Gaussian Optimization, Densification, Surface Fidelity & Fast Iteration (Agent EN)]], [[LIB-905 Frontier Vision & Multimodal Capstone Blueprints (Agent EN)]].

## 1. Conceptual Mental Model

Neural Radiance Fields (NeRF) represent 3D scenes as implicit volumetric fields evaluated via costly multi-layer perceptrons along ray marching paths ($O(100)$ MLP forward passes per pixel). **3D Gaussian Splatting (3DGS)** (Kerbl et al., SIGGRAPH 2023) fundamentally disrupts this paradigm: replacing implicit continuous fields with millions of **explicit, anisotropic 3D Gaussians**. Differentiable tile-based sorting and alpha-blending unlocks real-time 100+ FPS rendering with sub-millisecond backward differentiation.

---

## 2. Mathematical Formalization

### 1. Representation of a 3D Gaussian
A 3D Gaussian is parameterized by its mean position $\mu \in \mathbb{R}^3$ and 3D covariance matrix $\Sigma \in \mathbb{R}^{3 \times 3}$:
$$G(x) = \exp\left( -\frac{1}{2} (x - \mu)^T \Sigma^{-1} (x - \mu) \right)$$
To guarantee positive semi-definiteness during gradient descent, $\Sigma$ is factorized into a rotation matrix $R$ (parameterized by unit quaternion $q$) and scale vector $s = (s_x, s_y, s_z)^T$:
$$\Sigma = R S S^T R^T, \quad S = \text{diag}(s)$$

### 2. Projection to 2D Screen Space (Zwicker EWA Splatting `[DERIVATION]`)
Given viewing transformation $W$ (world-to-camera matrix) and projective Jacobian $J$ at camera coordinate $t = W \mu$:
$$\Sigma' = J W \Sigma W^T J^T$$
where $\Sigma' \in \mathbb{R}^{2 \times 2}$ is the projected 2D covariance matrix on the camera image plane.
A low-pass filter ($\nu I_2, \nu = 0.3$) is added to prevent aliasing when Gaussians shrink below single pixel boundaries.

### 3. Differentiable Alpha-Blending Formulation
Screen pixels $p = (u, v)$ aggregate the color contributions of $N$ sorted, overlapping Gaussians front-to-back:
$$C(p) = \sum_{i=1}^N c_i \alpha_i \prod_{j=1}^{i-1} (1 - \alpha_j)$$
where transmittance $T_i = \prod_{j=1}^{i-1} (1 - \alpha_j)$, and opacity $\alpha_i$ is evaluated from the 2D Gaussian density:
$$\alpha_i = o_i \exp\left( -\frac{1}{2} (p - \mu'_i)^T (\Sigma'_i)^{-1} (p - \mu'_i) \right)$$
Color $c_i$ is parameterized via Spherical Harmonics (SH) coefficients to capture view-dependent radiance reflections.

### 1.5 Fixed Sparse-View RGB 3DGS Geometric Reliability & Identifiability Bounds `[FACT]` `[DERIVATION]` `[SAFETY_BOUND]`
Under fixed sparse RGB inputs ($K \in [2, 8]$ views, no recapture, no LiDAR/RGB-D sensors), unconstrained 3DGS overfits training views with floating artifacts and degraded geometry. Incorporating RGB-derived monocular disparity/depth priors $d_{\mathrm{mono}}(u, v)$ introduces spatially varying affine scale/shift ambiguity—for example, `AffineGS` (`arXiv:2611.07709`) models inverse disparity $1/d_{\mathrm{mono}}(u,v) = \alpha(u,v)\mathcal{D}(u,v) + \beta(u,v)$ yielding rectified depth (see `LIB-507` for product-rule gradient bounds):
$$\hat{\mathcal{D}}(u, v) = \frac{1 - \beta_{\mathrm{smooth}}(u, v)\, d_{\mathrm{mono}}(u, v)}{\alpha_{\mathrm{smooth}}(u, v)\, d_{\mathrm{mono}}(u, v)}$$
- **Epistemic Demarcation**: Monocular depth priors are fallible candidate supervision signals, NEVER geometric ground truth `[SAFETY_BOUND]`. Furthermore, local parameter non-uniqueness (identifiability ambiguity) MUST NOT be conflated with guaranteed geometric error, nor does local identifiability guarantee geometric correctness when priors conflict with multi-view stereo evidence `[HYPOTHESIS]`.
- **Three-Tier Pose & Initialization Isolation (`P1 / P2 / P3`)**: Distinguish **`P1` (`Precomputed-Pose`)** (controlled baseline comparison; cannot be claimed as strict sparse-RGB-only), **`P2` (`Training-View-Only SfM`)** (poses and sparse points derived solely from the $K$ fixed RGB inputs, logging failures honestly), and **`P3` (`Pose-Perturbed Sensitivity`)** `[DESIGN_DECISION]` `[SAFETY_BOUND]`. Any proposed depth gating or adaptive regularization MUST pass collision checks against **AffineGS (`arXiv:2611.07709`, 2026)**, **In Depth We Trust (CVPRW 2026)**, and **DepthGS (IEEE TPAMI 2026, DOI `10.1109/TPAMI.2026.3751295`)** `[FACT]`.

---

## 3. Production Covariance Matrix Decomposition Contract

```python
import torch

def quaternion_to_rotation_matrix(q: torch.Tensor) -> torch.Tensor:
    """
    Converts unit quaternions q = [r, x, y, z] to 3x3 orthogonal rotation matrix.
    Input Contract:  Tensor [N, 4], normalized to unit norm
    Output Contract: Tensor [N, 3, 3]
    """
    r, x, y, z = q.unbind(-1)
    
    R = torch.stack([
        1 - 2 * (y**2 + z**2), 2 * (x*y - r*z), 2 * (x*z + r*y),
        2 * (x*y + r*z), 1 - 2 * (x**2 + z**2), 2 * (y*z - r*x),
        2 * (x*z - r*y), 2 * (y*z + r*x), 1 - 2 * (x**2 + y**2)
    ], dim=-1).reshape(-1, 3, 3)
    return R

def compute_3d_covariance(scales: torch.Tensor, rotations: torch.Tensor) -> torch.Tensor:
    """
    Computes positive semi-definite 3D covariance matrix Sigma = R S S^T R^T.
    Input Contract: scales [N, 3], rotations [N, 4]
    Output Contract: Sigma [N, 3, 3]
    """
    R = quaternion_to_rotation_matrix(rotations)
    S = torch.diag_embed(scales)
    M = torch.bmm(R, S)
    Sigma = torch.bmm(M, M.transpose(1, 2))
    return Sigma
```

---

## 4. Agent Invariants & Decision Protocols

### [RULE-504-01] Positive Semi-Definite Covariance Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: In 3D Gaussian Splatting, 3D covariance matrices $\Sigma = R S S^T R^T$ MUST remain mathematically positive semi-definite. Scaling parameters $s \in \mathbb{R}^3$ MUST be constrained via positive exponential activation ($s = \exp(s_{\text{raw}})$) and rotation quaternions $q$ MUST be normalized to unit norm ($\|q\| = 1$).
- **Violation Consequence**: Unnormalized quaternions or negative scaling parameters produce indefinite covariance matrices, causing 2D projection Jacobian breakdown and catastrophic rendering artifacts.

### [RULE-504-02] 2D Screen-Space Low-Pass Anti-Aliasing Guardrail
- **Contract Level**: `BOUNDARY_GUARD`
- **Specification**: When projecting 3D Gaussians to 2D screen space, a low-pass filter variance $\sigma_{\text{filter}}^2 = 0.3\text{ px}^2$ MUST be added to the 2D projected covariance $\Sigma_{2D}' = J W \Sigma W^T J^T + \sigma_{\text{filter}}^2 I_{2 \times 2}$.
- **Violation Consequence**: Omitting the screen-space low-pass footprint causes severe high-frequency pixel popping and aliasing during camera translation.

### [RULE-504-03] Ray Transmittance Early-Exit Heuristic
- **Contract Level**: `PERFORMANCE_CRITICAL`
- **Specification**: During tiled front-to-back alpha blending rasterization ($T_i = \prod_{j=1}^{i-1} (1 - \alpha_j)$), thread evaluation for a given pixel MUST terminate immediately when accumulated opacity reaches $1 - T_i \ge 0.9999$.
- **Violation Consequence**: Continuing ray integration past near-opaque surfaces consumes unnecessary memory bandwidth without altering output color values.

### [RULE-504-04] Sparse-View 3DGS Depth-Prior Fallibility & Pose-Protocol Isolation Invariant
- **Contract Level**: `SAFETY_CRITICAL`
- **Specification**: Under fixed sparse RGB 3DGS reconstruction ($K \in [2, 8]$ views, no recapture, no extra physical depth sensor), monocular depth priors $d_{\mathrm{mono}}$ MUST be treated as fallible candidate supervision with full disclosure of pretrained weights/provenance—never as geometric ground truth `[SAFETY_BOUND]`. Experiments MUST isolate **`P1` (`Precomputed-Pose`)** from **`P2` (`Training-View-Only SfM`)** and **`P3` (`Pose-Perturbed`)**, strictly preventing evaluation geometry GT or test-view poses from leaking into optimization or hyperparameter selection `[SAFETY_BOUND]`.
- **Violation Consequence**: Treating precomputed poses or monocular depth estimators as noiseless sparse-RGB-only inputs introduces hidden observational leakage and invalidates geometric reliability claims.

---

## 5. Canonical & Peer-Reviewed References

1. **Mildenhall, B., Srinivasan, P. P., Tancik, M., Barron, J. T., Ramamoorthi, R., & Ng, R.** (2020). "NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis." *European Conference on Computer Vision (ECCV 2020)*, pp. 405–421. DOI: [10.1007/978-3-030-58452-8_24](https://doi.org/10.1007/978-3-030-58452-8_24).
2. **Kerbl, B., Kopanas, G., Leimkühler, T., & Drettakis, G.** (2023). "3D Gaussian Splatting for Real-Time Radiance Field Rendering." *ACM Transactions on Graphics (SIGGRAPH 2023)*, 42(4), Article 139. DOI: [10.1145/3592433](https://doi.org/10.1145/3592433).
3. **Huang, B., Yu, Z., Chen, E., Zheng, Y., & Yang, B.** (2024). "2D Gaussian Splatting for Geometrically Accurate Radiance Fields." *ACM SIGGRAPH 2024* ([arXiv:2403.17888](https://arxiv.org/abs/2403.17888), DOI: [10.1145/3641519.3657428](https://doi.org/10.1145/3641519.3657428)); **Guédon, A., & Lepetit, V.** (2024). "SuGaR: Surface-Aligned Gaussian Splatting for Efficient 3D Mesh Reconstruction and Editing." *CVPR 2024* ([arXiv:2311.12775](https://arxiv.org/abs/2311.12775)). (Further optimization & surface extensions: [[LIB-508 Gaussian Optimization, Densification, Surface Fidelity & Fast Iteration (Agent EN)]]).
4. **Wu, G., Yi, T., Fang, J., Xie, L., Zhang, X., Wei, W., Liu, W., Tian, Q., & Wang, X.** (2024). "4D Gaussian Splatting for Real-Time Dynamic Scene Rendering." *IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR 2024)*, pp. 20310–20320.
5. **Sparse-View Depth Supervision & Affine Reliability (see dedicated expansion in [[LIB-507 Sparse-View 3DGS Geometry, Depth Priors & Reliability (Agent EN)]])**: **Ren, X., Liu, Y., An, N., Cheng, J., Qiao, X., Li, Y.-F., & Kong, H.** (2026). "DepthGS: Depth-Guided Gaussian Splatting with Adaptive Regularization for High-Quality Surface Reconstruction." *IEEE TPAMI 2026* ([arXiv:2611.13628](https://arxiv.org/abs/2611.13628), DOI: [10.1109/TPAMI.2026.3751295](https://doi.org/10.1109/TPAMI.2026.3751295)); **Xiao, W.-H., Goan, E., Santa Cruz, R., Ahmedt-Aristizabal, D., Salvado, O., Fookes, C., & Lebrat, L.** (2026). "In Depth We Trust: Reliable Monocular Depth Supervision for Gaussian Splatting." *CVPR Workshops (3DMV 2026)* ([arXiv:2604.05715](https://arxiv.org/abs/2604.05715)); **Tse, T. H. E., Peng, J., Chen, R., & Yao, A.** (2026). "AffineGS: Unlocking Accurate Geometry in 3DGS via Spatially Varying Affine Rectification." *NeurIPS 2026* ([arXiv:2611.07709](https://arxiv.org/abs/2611.07709)).
