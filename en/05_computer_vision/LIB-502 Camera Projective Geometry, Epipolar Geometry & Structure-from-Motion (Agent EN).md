---
call_number: LIB-502
status: source-verified
invariants_count: 3
title: Camera Projective Geometry, Epipolar Geometry & Structure-from-Motion (Agent Edition)
module: Multi-View-Geometry
category: 3D-Computer-Vision
audience:
  - Autonomous-Agent
  - Graduate-PhD
  - Senior-ML-Engineer
math_foundations:
  - Projective Space P^3 & Pinhole Camera Intrinsic/Extrinsic Calibration
  - Epipolar Geometry, Essential Matrix E & Fundamental Matrix F
  - Hartley Isotropic Normalization & Rank-2 SVD Manifold Projection
  - Bundle Adjustment & Schur Complement Sparse Linear Solver
hardware_target:
  - GPU Batched SVD & Block-Diagonal Schur Complement Kernels
  - CUDA Warp-Parallel Reprojection & Jacobian Evaluation
created: 2026-10-17
author: Luke
tags:
  - projective-geometry
  - epipolar-geometry
  - structure-from-motion
  - colmap
  - bundle-adjustment
  - essential-matrix
  - fundamental-matrix
prerequisites:
  - "[[LIB-101 Linear Algebra & High-Dimensional Geometry (Agent EN)]]"
  - "[[LIB-104 Convex Optimization & Gradient Descent (Agent EN)]]"
  - "[[LIB-501 CV Preprocessing & Center of Mass Alignment (Agent EN)]]"
successors:
  - "[[LIB-408 Context-Aware Object Generation, Illumination Estimation & Image Compositing (Agent EN)]]"
  - "[[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]]"
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../05_%E8%A8%88%E7%AE%97%E6%A9%9F%E8%A6%96%E8%A6%BA%E8%88%87%E9%AB%98%E7%B6%AD%E6%84%9F%E6%B8%AC/LIB-502%20%E7%9B%B8%E6%A9%9F%E5%B0%84%E5%BD%B1%E5%B9%BE%E4%BD%95%E3%80%81%E5%B0%8D%E6%A5%B5%E5%B9%BE%E4%BD%95%E8%88%87%E9%81%8B%E5%8B%95%E7%B5%90%E6%A7%8B%E6%81%A2%E5%BE%A9%20%28Camera%20Projective%20Geometry,%20Epipolar%20Geometry%20%26%20Structure-from-Motion%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Camera Projective Geometry, Epipolar Geometry & Structure-from-Motion

## Conceptual Coordinates & Topological Navigation
- **Prerequisites**: [[LIB-101 Linear Algebra & High-Dimensional Geometry (Agent EN)]], [[LIB-104 Convex Optimization & Gradient Descent (Agent EN)]], [[LIB-501 CV Preprocessing & Center of Mass Alignment (Agent EN)]].
- **Successors**: [[LIB-408 Context-Aware Object Generation, Illumination Estimation & Image Compositing (Agent EN)]], [[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]].

---

## 1. Conceptual Mental Model

Transitioning from 2D pixel processing (LIB-501) to 3D Gaussian Splatting (LIB-504) and metric depth object compositing (LIB-408) requires the mathematical bridge of **Multi-View Projective Geometry**:
1. **Perspective Division & Homogeneous Coordinates**: A pinhole camera projects 3D camera-frame coordinates $\mathbf{X}_c = (X_c, Y_c, Z_c)^\top$ onto the 2D image plane via non-linear perspective division $(x, y) = (f X_c / Z_c, f Y_c / Z_c)$ `[FACT]`. Embedding $\mathbb{R}^3$ into projective space $\mathbb{P}^3$ via homogeneous coordinates $\tilde{\mathbf{X}}_w = [X_w, Y_w, Z_w, 1]^\top$ unifies rigid-body transformation and perspective projection into a single $3 \times 4$ matrix operator $\lambda \tilde{\mathbf{u}} = \mathbf{K}[\mathbf{R}\mid\mathbf{t}]\tilde{\mathbf{X}}_w$.
2. **Epipolar Constraint (2D Search $\to$ 1D Line)**: Given a point $\tilde{\mathbf{u}}_1$ in View 1, its 3D pre-image lies along the optical ray passing through camera center $\mathbf{O}_1$. Projected into View 2, this ray forms an **epipolar line** $\mathbf{l}_2 = \mathbf{F}\tilde{\mathbf{u}}_1$, restricting the correspondence $\tilde{\mathbf{u}}_2$ to the algebraic constraint $\tilde{\mathbf{u}}_2^\top \mathbf{F}\tilde{\mathbf{u}}_1 = 0$ `[FACT]`.
3. **Structure-from-Motion (SfM) & Bundle Adjustment**: Pipelines such as COLMAP (Schönberger & Frahm, CVPR 2016) estimate relative camera poses $[\mathbf{R}\mid\mathbf{t}] \in SE(3)$ via the Essential/Fundamental matrix, triangulate initial 3D landmarks, and jointly refine all $M$ cameras and $N$ 3D points via **Bundle Adjustment**—providing the exact calibrated poses and sparse point clouds required to initialize 3DGS (LIB-504) `[LITERATURE_RESULT]`.

---

## 2. Mathematical Formalization

### 1. Pinhole Camera Model, $SE(3)$ Extrinsics & Local Affine Jacobian $\mathbf{J}$
Let $\mathbf{X}_w \in \mathbb{R}^3$ denote a 3D world point. The rigid transformation into camera frame $\mathbf{X}_c = [X_c, Y_c, Z_c]^\top$ is parameterized by $[\mathbf{R}\mid\mathbf{t}] \in SE(3)$ with $\mathbf{R} \in SO(3)$ ($\mathbf{R}^\top\mathbf{R} = \mathbf{I}_3, \det(\mathbf{R}) = +1$) and camera optical center $\mathbf{C}_w = -\mathbf{R}^\top\mathbf{t}$ `[DERIVATION]`:
$$\lambda \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = \mathbf{K}(\mathbf{R}\mathbf{X}_w + \mathbf{t}), \qquad \mathbf{K} = \begin{bmatrix} f_x & 0 & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}, \qquad \lambda = Z_c > 0$$
Linearizing the non-linear perspective map $\pi(\mathbf{X}_c) = [f_x X_c / Z_c + c_x,\ f_y Y_c / Z_c + c_y]^\top$ around $\mathbf{X}_c$ yields the **Local Affine Projection Jacobian** $\mathbf{J}(\mathbf{X}_c) \in \mathbb{R}^{2 \times 3}$ (Zwicker et al., 2002; Kerbl et al., 2023 in LIB-504) `[DERIVATION]`:
$$\mathbf{J}(\mathbf{X}_c) = \frac{\partial (u, v)}{\partial (X_c, Y_c, Z_c)} = \begin{bmatrix} \frac{f_x}{Z_c} & 0 & -\frac{f_x X_c}{Z_c^2} \\ 0 & \frac{f_y}{Z_c} & -\frac{f_y Y_c}{Z_c^2} \end{bmatrix}$$
which projects 3D world covariance $\boldsymbol{\Sigma}_w$ into 2D screen covariance $\boldsymbol{\Sigma}_{2\text{D}} = \mathbf{J}\mathbf{W}\boldsymbol{\Sigma}_w\mathbf{W}^\top\mathbf{J}^\top$.

### 2. Essential Matrix $\mathbf{E}$, Fundamental Matrix $\mathbf{F}$ & Spectral Manifold
In normalized camera coordinates $\mathbf{x}_i = \mathbf{K}_i^{-1}\tilde{\mathbf{u}}_i$, coplanarity of baseline $\mathbf{t}$ and rays $\mathbf{R}\mathbf{x}_1, \mathbf{x}_2$ yields the Longuet-Higgins (1981) equation `[LITERATURE_RESULT]`:
$$\mathbf{x}_2^\top (\mathbf{t} \times \mathbf{R}\mathbf{x}_1) = 0 \iff \mathbf{x}_2^\top \mathbf{E}\mathbf{x}_1 = 0, \qquad \mathbf{E} \triangleq [\mathbf{t}]_\times \mathbf{R}$$
By the Huang-Faugeras Theorem (1989), $\mathbf{E} \in \mathbb{R}^{3 \times 3}$ is a valid Essential Matrix if and only if its singular values satisfy $\boldsymbol{\Sigma} = \mathrm{diag}(\sigma, \sigma, 0)$ ($\mathrm{rank}(\mathbf{E}) = 2, \mathrm{DoF} = 5$) `[DERIVATION]`. Substituting $\mathbf{x}_i = \mathbf{K}_i^{-1}\tilde{\mathbf{u}}_i$ yields the **Fundamental Matrix** $\mathbf{F} = \mathbf{K}_2^{-\top}\mathbf{E}\mathbf{K}_1^{-1}$ satisfying $\tilde{\mathbf{u}}_2^\top \mathbf{F}\tilde{\mathbf{u}}_1 = 0$ and $\det(\mathbf{F}) = 0$ ($\mathrm{rank}(\mathbf{F}) = 2$) `[DERIVATION]`.

### 3. Hartley's Isotropic Coordinate Normalization (TPAMI 1997)
Stacking $N \ge 8$ correspondences $(\tilde{\mathbf{u}}_2 \otimes \tilde{\mathbf{u}}_1)^\top \mathrm{vec}(\mathbf{F}) = 0$ forms $\mathbf{A}\mathbf{f} = \mathbf{0}$. Raw pixel coordinates $u, v \sim 10^3$ create severe scale imbalance ($u_1 u_2 \sim 10^6$ vs. $1 \sim 10^0$), causing the normal matrix condition number to explode to $\kappa(\mathbf{A}^\top\mathbf{A}) \sim 10^{12}$ `[FACT]`.
Hartley (1997) proved that pre-normalizing each view via an isotropic similarity transform $\hat{\mathbf{u}} = \mathbf{T}\tilde{\mathbf{u}}$ (shifting the centroid to $(0,0)$ and scaling mean distance to $\sqrt{2}$) reduces $\kappa(\hat{\mathbf{A}}^\top\hat{\mathbf{A}})$ to $\mathcal{O}(10^1)$ `[LITERATURE_RESULT]`, followed by Eckart-Young Rank-2 SVD projection ($\sigma_3 \leftarrow 0$) and denormalization $\mathbf{F} = \mathbf{T}_2^\top \hat{\mathbf{F}}\mathbf{T}_1$ `[DERIVATION]`.

### 4. Bundle Adjustment & Schur Complement Marginalization
Jointly optimizing $M$ cameras $\mathbf{c} \in \mathbb{R}^{6M}$ and $N$ 3D points $\mathbf{p} \in \mathbb{R}^{3N}$ ($N \gg M$) via Levenberg-Marquardt yields the bipartite normal system `[DERIVATION]`:
$$\begin{bmatrix} \mathbf{U} & \mathbf{W} \\ \mathbf{W}^\top & \mathbf{V} \end{bmatrix} \begin{bmatrix} \Delta\mathbf{c} \\ \Delta\mathbf{p} \end{bmatrix} = \begin{bmatrix} \mathbf{e}_c \\ \mathbf{e}_p \end{bmatrix}$$
Because 3D points do not directly observe one another, $\mathbf{V} = \mathrm{blkdiag}(\mathbf{V}_1, \dots, \mathbf{V}_N) \in \mathbb{R}^{3N \times 3N}$ is strictly $3 \times 3$ block-diagonal `[FACT]`. Applying the **Schur Complement** eliminates $\Delta\mathbf{p}$ in $\mathcal{O}(N)$ parallel operations (Triggs et al., 1999) `[LITERATURE_RESULT]`:
$$\left(\mathbf{U} - \mathbf{W}\mathbf{V}^{-1}\mathbf{W}^\top\right)\Delta\mathbf{c} = \mathbf{e}_c - \mathbf{W}\mathbf{V}^{-1}\mathbf{e}_p, \qquad \Delta\mathbf{p} = \mathbf{V}^{-1}\left(\mathbf{e}_p - \mathbf{W}^\top\Delta\mathbf{c}\right)$$
reducing linear solver complexity from $\mathcal{O}((6M + 3N)^3)$ to $\mathcal{O}(M^3 + M^2 N)$.

---

## 3. Systems & Hardware Alignment

1. **Frustum Near-Plane Guard & Cheirality Constraint**: In GPU splatting and differentiable projection kernels, points with $Z_c \le z_{\text{near}}$ ($0.2\text{ m}$) cause $1/Z_c^2 \to \infty$ in $\mathbf{J}(\mathbf{X}_c)$, exploding 2D screen covariance radii across all $16 \times 16$ tiles and saturating shared memory queues `[SAFETY_BOUND]`. Kernels must enforce $Z_c \ge z_{\text{near}}$ and verify the **Cheirality constraint** ($Z_{c1} > 0 \land Z_{c2} > 0$) when disambiguating the 4 pose solutions of $\mathbf{E}$.
2. **Warp-Parallel $3 \times 3$ Block Inversion**: In GPU Bundle Adjustment, $\mathbf{V}^{-1}$ is computed by assigning one CUDA thread per 3D landmark to invert its $3 \times 3$ symmetric positive-definite block $\mathbf{V}_j$ directly in registers via closed-form cofactors, avoiding cuSOLVER kernel launch overhead and warp divergence `[DESIGN_DECISION]`.

---

## 4. Production PyTorch Implementation: Pinhole Jacobian & Hartley Normalized 8-Point Engine

```python
import torch
from typing import Tuple, Dict

def project_points_with_jacobian(
    points_w: torch.Tensor,
    R: torch.Tensor,
    t: torch.Tensor,
    K: torch.Tensor,
    z_near: float = 0.2,
) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
    """
    Projects 3D world points to 2D pixel coordinates and computes the local affine
    perspective Jacobian J required by 3D Gaussian Splatting (LIB-504).
    """
    assert points_w.dim() == 2 and points_w.shape[1] == 3
    assert R.shape == (3, 3) and t.shape == (3,) and K.shape == (3, 3)
    orth_err = torch.norm(R.T @ R - torch.eye(3, device=R.device, dtype=R.dtype))
    assert orth_err < 1e-4 and torch.det(R) > 0.0, f"Invalid rotation matrix R: {orth_err}"

    points_c = points_w @ R.T + t.unsqueeze(0)  # (N, 3)
    Xc, Yc, Zc = points_c[:, 0], points_c[:, 1], points_c[:, 2]

    # RULE-502-02: Enforce frustum near-plane guard to prevent 1/Zc^2 overflow
    valid_mask = Zc > z_near
    Zc_safe = torch.clamp(Zc, min=z_near)
    inv_z = 1.0 / Zc_safe
    inv_z2 = inv_z * inv_z

    fx, fy = K[0, 0], K[1, 1]
    cx, cy = K[0, 2], K[1, 2]

    uv = torch.stack([fx * Xc * inv_z + cx, fy * Yc * inv_z + cy], dim=-1)

    zeros = torch.zeros_like(Xc)
    J_row0 = torch.stack([fx * inv_z, zeros, -fx * Xc * inv_z2], dim=-1)
    J_row1 = torch.stack([zeros, fy * inv_z, -fy * Yc * inv_z2], dim=-1)
    J = torch.stack([J_row0, J_row1], dim=1)  # (N, 2, 3)

    assert torch.isfinite(uv).all() and torch.isfinite(J).all()
    return uv, J, valid_mask


def hartley_isotropic_normalize(uv: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
    """
    RULE-502-01: Hartley (TPAMI 1997) isotropic coordinate normalization:
    zero-centers centroid and scales mean distance from origin to sqrt(2).
    """
    assert uv.dim() == 2 and uv.shape[1] == 2 and uv.shape[0] >= 8
    centroid = uv.mean(dim=0)
    shifted = uv - centroid.unsqueeze(0)
    mean_dist = torch.norm(shifted, dim=-1).mean()
    scale = (2.0 ** 0.5) / torch.clamp(mean_dist, min=1e-8)

    T = torch.eye(3, device=uv.device, dtype=uv.dtype)
    T[0, 0] = scale
    T[1, 1] = scale
    T[0, 2] = -scale * centroid[0]
    T[1, 2] = -scale * centroid[1]

    ones = torch.ones((uv.shape[0], 1), device=uv.device, dtype=uv.dtype)
    uv_hom = torch.cat([uv, ones], dim=-1)
    return uv_hom @ T.T, T


def estimate_fundamental_matrix_8point(
    uv1: torch.Tensor,
    uv2: torch.Tensor,
) -> Tuple[torch.Tensor, Dict[str, float]]:
    """
    Computes Fundamental Matrix F via Hartley Normalized 8-Point Algorithm
    with Eckart-Young Rank-2 SVD projection (det(F) = 0).
    """
    assert uv1.shape == uv2.shape and uv1.shape[0] >= 8
    x1, T1 = hartley_isotropic_normalize(uv1)
    x2, T2 = hartley_isotropic_normalize(uv2)

    u1, v1, w1 = x1[:, 0], x1[:, 1], x1[:, 2]
    u2, v2, w2 = x2[:, 0], x2[:, 1], x2[:, 2]
    A = torch.stack(
        [
            u2 * u1, u2 * v1, u2 * w1,
            v2 * u1, v2 * v1, v2 * w1,
            w2 * u1, w2 * v1, w2 * w1,
        ],
        dim=-1,
    )

    _, S_A, Vh_A = torch.linalg.svd(A, full_matrices=False)
    cond_number = float((S_A[0] / torch.clamp(S_A[-2], min=1e-12)).item() ** 2)
    F_norm_raw = Vh_A[-1].reshape(3, 3)

    # RULE-502-01: Enforce Rank-2 manifold constraint (sigma_3 = 0)
    U_f, S_f, Vh_f = torch.linalg.svd(F_norm_raw)
    S_f_rank2 = torch.stack([S_f[0], S_f[1], torch.zeros_like(S_f[2])])
    F_norm = U_f @ torch.diag(S_f_rank2) @ Vh_f

    F_mat = T2.T @ F_norm @ T1
    F_mat = F_mat / torch.clamp(torch.norm(F_mat), min=1e-12)

    ones = torch.ones((uv1.shape[0], 1), device=uv1.device, dtype=uv1.dtype)
    p1 = torch.cat([uv1, ones], dim=-1)
    p2 = torch.cat([uv2, ones], dim=-1)
    algebraic_err = torch.abs((p2 * (p1 @ F_mat.T)).sum(dim=-1)).mean().item()

    return F_mat, {
        "normalized_cond_kappa": cond_number,
        "mean_epipolar_residual": float(algebraic_err),
        "det_F": float(torch.det(F_mat).item()),
    }
```

---

## 5. Agent Invariants & Decision Protocols

### [RULE-502-01] Hartley Isotropic Pre-Normalization & Rank-2 Manifold Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: When estimating the Fundamental Matrix $\mathbf{F}$ or Homography $\mathbf{H}$ from pixel correspondences, agents MUST apply Hartley isotropic pre-normalization (zero-centering the centroid and scaling mean distance to $\sqrt{2}$) prior to constructing the DLT design matrix $\mathbf{A}$, and MUST project $\hat{\mathbf{F}}_{\text{raw}}$ onto the rank-2 manifold ($\sigma_3 \leftarrow 0$) via SVD before denormalization $\mathbf{F} = \mathbf{T}_2^\top \hat{\mathbf{F}}\mathbf{T}_1$.
- **Violation Consequence**: Unnormalized pixel coordinates induce catastrophic ill-conditioning ($\kappa(\mathbf{A}^\top\mathbf{A}) \sim 10^{12}$), while omitting rank-2 projection violates $\det(\mathbf{F}) = 0$ and prevents epipolar lines from intersecting at a unique epipole.

### [RULE-502-02] Cheirality Positive-Depth & Near-Plane Guard Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: All perspective projection operators $\pi(\mathbf{X}_c)$ and local affine Jacobian kernels $\mathbf{J}(\mathbf{X}_c)$ MUST clamp or cull camera-space depth at the frustum near plane $Z_c \ge z_{\text{near}}$ ($0.2\text{ m}$) `[SAFETY_BOUND]` before evaluating $1/Z_c$ or $1/Z_c^2$. Pose recovery from $\mathbf{E}$ MUST verify the Cheirality condition ($Z_{c1} > 0 \land Z_{c2} > 0$).
- **Violation Consequence**: Division by near-zero depth explodes projected 2D Gaussian covariances, saturating GPU tile rasterization queues and causing `NaN` gradients.

### [RULE-502-03] Bundle Adjustment Schur Complement Directive
- **Contract Level**: `STRATEGIC_DIRECTIVE`
- **Specification**: Non-linear least-squares Bundle Adjustment over $M$ cameras and $N$ 3D landmarks ($N \gg M$) MUST exploit the $3 \times 3$ block-diagonal sparsity of the landmark Hessian $\mathbf{V}$ via the Schur complement $(\mathbf{U} - \mathbf{W}\mathbf{V}^{-1}\mathbf{W}^\top)\Delta\mathbf{c} = \mathbf{e}_c - \mathbf{W}\mathbf{V}^{-1}\mathbf{e}_p$, rather than invoking dense $\mathcal{O}((6M + 3N)^3)$ Cholesky factorization.

---

## 6. Canonical & Peer-Reviewed References

1. **Hartley, R., & Zisserman, A.** (2004). *Multiple View Geometry in Computer Vision* (2nd ed.). Cambridge University Press.
2. **Hartley, R. I.** (1997). "In Defense of the Eight-Point Algorithm." *IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)*, 19(6), 580–593. DOI: [10.1109/34.601246](https://doi.org/10.1109/34.601246).
3. **Longuet-Higgins, H. C.** (1981). "A computer algorithm for reconstructing a scene from two projections." *Nature*, 293(5828), 133–135. DOI: [10.1038/293133a0](https://doi.org/10.1038/293133a0).
4. **Schönberger, J. L., & Frahm, J.-M.** (2016). "Structure-from-Motion Revisited." *IEEE Conference on Computer Vision and Pattern Recognition (CVPR 2016)*, pp. 4104–4113. DOI: [10.1109/CVPR.2016.445](https://doi.org/10.1109/CVPR.2016.445).
5. **Triggs, B., McLauchlan, P. F., Hartley, R. I., & Fitzgibbon, A. W.** (1999). "Bundle Adjustment — A Modern Synthesis." *International Workshop on Vision Algorithms (ICCV 1999)*, LNCS vol. 1883, pp. 298–372. DOI: [10.1007/3-540-44480-7_21](https://doi.org/10.1007/3-540-44480-7_21).
6. **Zwicker, M., Pfister, H., Van Baar, J., & Gross, M.** (2002). "EWA Splatting." *IEEE Transactions on Visualization and Computer Graphics (TVCG)*, 8(3), 223–238. DOI: [10.1109/TVCG.2002.1021576](https://doi.org/10.1109/TVCG.2002.1021576).
