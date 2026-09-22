---
call_number: LIB-504
title: 3D Gaussian Splatting Theory & Rasterization (Agent Edition)
module: 3D-Vision
category: Frontiers-Perception
audience:
  - Autonomous-Agent
  - Graduate-PhD
  - Graphics-Research-Scientist
status: Verified-Authoritative-Production
math_foundations:
  - 3D Covariance Matrix Decomposition (Quaternions & Scaling)
  - Projective Geometry & 2D Screen Space Projection (Zwicker EWA)
  - Differentiable Tile-Based Alpha-Blending & Radiance Sorting
hardware_target:
  - NVIDIA CUDA High-Throughput Rasterizer (> 100 FPS)
invariants_count: 5
created: 2026-09-17
author: Luke
prerequisites:
  - "[[LIB-101 Linear Algebra & High-Dimensional Geometry (Agent EN)]]"
  - "[[LIB-203 Computer Architecture & Hardware-Aware Deep Learning (Agent EN)]]"
successors:
  - "[[LIB-704 Dual-Process Neural Agent S1-Jev & Reflex CUA-S1 (Agent EN)]]"
tags:
  - 3d-gaussian-splatting
  - nerf
  - radiance-fields
  - real-time-rendering
  - differential-rasterization
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../05_%E8%A8%88%E7%AE%97%E6%A9%9F%E8%A6%96%E8%A6%BA%E8%88%87%E9%AB%98%E7%B6%AD%E6%84%9F%E6%B8%AC/LIB-504%203D%20%E8%A6%96%E8%A6%BA%E5%89%8D%E6%B2%BF%EF%BC%9A%E7%A5%9E%E7%B6%93%E8%BC%BB%E5%B0%84%E5%A0%B4%20%28NeRF%29%20%E5%88%B0%203D%20%E9%AB%98%E6%96%AF%E6%BD%91%E6%BF%BA%20%283DGS%29%20%E7%90%86%E8%AB%96%E8%88%87%E5%85%89%E6%9F%B5%E5%8C%96%20%283D%20Gaussian%20Splatting%20Theory%20%26%20Rasterization%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# 3D Gaussian Splatting: Theory & Differentiable Rasterization

## 1. Conceptual Mental Model

Neural Radiance Fields (NeRF) represent 3D scenes as implicit volumetric fields evaluated via costly multi-layer perceptrons along ray marching paths ($O(100)$ MLP forward passes per pixel). **3D Gaussian Splatting (3DGS)** (Kerbl et al., SIGGRAPH 2023) fundamentally disrupts this paradigm: replacing implicit continuous fields with millions of **explicit, anisotropic 3D Gaussians**. Differentiable tile-based sorting and alpha-blending unlocks real-time 100+ FPS rendering with sub-millisecond backward differentiation.

---

## 2. Mathematical Formalization

### 1. Representation of a 3D Gaussian
A 3D Gaussian is parameterized by its mean position $\mu \in \mathbb{R}^3$ and 3D covariance matrix $\Sigma \in \mathbb{R}^{3 \times 3}$:
$$G(x) = \exp\left( -\frac{1}{2} (x - \mu)^T \Sigma^{-1} (x - \mu) \right)$$
To guarantee positive semi-definiteness during gradient descent, $\Sigma$ is factorized into a rotation matrix $R$ (parameterized by unit quaternion $q$) and scale vector $s = (s_x, s_y, s_z)^T$:
$$\Sigma = R S S^T R^T, \quad S = \text{diag}(s)$$

### 2. Projection to 2D Screen Space (Zwicker EWA Splatting)
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

- `INV-504-01 (Quaternion Normalization)`: Quaternions representing 3D Gaussian rotations MUST be normalized to unit norm ($\|q\| = 1$) before evaluating rotation matrices to avoid non-orthogonal shearing.
- `INV-504-02 (Adaptive Density Control)`: During training, Gaussians with positional gradient magnitude $\|\nabla_\mu L\|_2 > \tau_{\text{grad}} = 0.0002$ MUST be split (if scale is large) or cloned (if scale is small) to resolve under-reconstruction.
- `INV-504-03 (Tile Radix Sorting)`: The rasterizer MUST bin Gaussians into $16 \times 16$ pixel tiles and execute 64-bit key Radix Sort on depth values before invoking alpha-blending warps.
