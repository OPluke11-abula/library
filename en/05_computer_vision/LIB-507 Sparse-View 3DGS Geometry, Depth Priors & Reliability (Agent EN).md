---
call_number: LIB-507
status: source-verified
invariants_count: 4
title: Sparse-View 3DGS Geometry, Depth Priors & Reliability (Agent EN)
module: Computer-Vision
category: Sparse-View-3DGS-Reliability
audience:
  - Autonomous-Agent
  - Graduate-PhD
  - Graphics-Research-Scientist
math_foundations:
  - Spatially Varying Affine Disparity Rectification & Guided Filtering Bounds
  - Virtual-Stereo Depth-Inconsistency Masking (DIM) & Adaptive Normal Regularization
  - Epipolar-Ray vs. Image-Plane DoF Separation & Dual-Field Co-Regularization
  - Pose Provenance Protocols (P1/P2/P3) & Parameter Non-Identifiability vs. Geometry Truth
hardware_target:
  - Consumer GPU / Single-GPU Cloud Pilot (T4 16GB / L4 24GB) & CPU Synthetic Counterexample Suite
  - Fixed Sparse RGB Constraint (K in [2, 5], Zero Extra Depth Sensors)
created: 2026-11-17
author: Luke
tags:
  - computer-vision
  - 3dgs
  - sparse-view
  - depth-priors
  - affine-rectification
  - geometry-reliability
  - pose-protocol
prerequisites:
  - "[[LIB-502 Camera Projective Geometry, Epipolar Geometry & Structure-from-Motion (Agent EN)]]"
  - "[[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]]"
  - "[[LIB-508 Gaussian Optimization, Densification, Surface Fidelity & Fast Iteration (Agent EN)]]"
  - "[[LIB-801 Model Calibration & Uncertainty Estimation (Agent EN)]]"
successors:
  - "[[LIB-505 Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval (Agent EN)]]"
  - "[[LIB-907 Research Gap Discovery, Novelty Collision & Topic Selection (Agent EN)]]"
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../05_%E8%A8%88%E7%AE%97%E6%A9%9F%E8%A6%96%E8%A6%BA%E8%88%87%E9%AB%98%E7%B6%AD%E6%84%9F%E6%B8%AC/LIB-507%20%E5%B0%91%E8%A6%96%E8%A7%92%203DGS%20%E5%B9%BE%E4%BD%95%E5%8F%AF%E9%9D%A0%E6%80%A7%E3%80%81%E5%96%AE%E7%9B%AE%E6%B7%B1%E5%BA%A6%E5%85%88%E9%A9%97%E8%88%87%E5%B1%80%E9%83%A8%E4%BB%BF%E5%B0%84%E6%A0%A1%E6%AD%A3%E9%82%8A%E7%95%8C%20%28Sparse-View%203DGS%20Geometry,%20Depth%20Priors%20%26%20Reliability%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Sparse-View 3DGS Geometry, Depth Priors & Reliability

## Conceptual Coordinates & Topological Navigation
- **Prerequisites**: [[LIB-502 Camera Projective Geometry, Epipolar Geometry & Structure-from-Motion (Agent EN)]], [[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]], [[LIB-508 Gaussian Optimization, Densification, Surface Fidelity & Fast Iteration (Agent EN)]], [[LIB-801 Model Calibration & Uncertainty Estimation (Agent EN)]].
- **Successors**: [[LIB-505 Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval (Agent EN)]], [[LIB-907 Research Gap Discovery, Novelty Collision & Topic Selection (Agent EN)]].
- **Core Scope**: Expands `LIB-504` Section 2.6 into a rigorous 2024–2026 treatise on sparse-view 3DGS under fixed input views ($K \in [2, 5]$ RGB images, zero added physical depth sensors). Covers `AffineGS` spatially varying affine rectification and Guided Filter assumptions, selective supervision (`In Depth We Trust`, `DepthGS`, `DGDO-GS`), DoF/perturbation regularization (`GDoFS`, `CoR-GS`, `DropGaussian`, `DOC-GS`, `SRUP-GS`), stereo priors (`Sparse2DGS`, `StereoGS`), `P1/P2/P3` pose provenance, and non-identifiability boundaries.

---

## 1. Conceptual Mental Model: Monocular Depth Priors Under Extreme Sparsity

With only `2–5` uncalibrated or wide-baseline RGB views and zero LiDAR/RGB-D hardware, vanilla 3DGS fails via geometric collapse and camera-facing floaters `[FACT]`. Pretrained monocular depth networks (e.g., Depth Anything V2) provide dense priors, but suffer three structural pathologies `[FACT]`:
1. **Region-Dependent Affine Distortion**: Early baselines (`DNGaussian`) normalize depth globally; modern networks actually exhibit spatially varying piecewise-linear scale-shift distortions across depth regimes (`AffineGS`, NeurIPS 2026) `[LITERATURE_RESULT]`.
2. **Guided Filter Propagation of Non-Affine Local Shape Errors**: When monocular depth inverts local surface curvature within a smooth region lacking crisp edges, filtering affine fields using the monocular disparity itself as the guide image risks locking inverted slopes into Gaussian geometry `[HYPOTHESIS]`.
3. **Photometric Deception vs. True Geometry**: As analyzed in `LIB-508`, high Spherical Harmonics (SH) capacity can sustain high NVS PSNR via displaced billboards under controlled/synthetic parallax setups (whereas `Wang & Miller, arXiv:2608.30054` observed surface-consistent reconstructions on evaluated real-world scenes); combined with multi-parameter equivalence, independent 3D geometry metrics (`Chamfer Distance` / `Normal MAE` / metric `AbsRel`) are mandatory `[SAFETY_BOUND]`.

---

## 2. Mathematical Formalization

### 1. From Global Alignment to Local Spatially Varying Affine Rectification `[LITERATURE_RESULT]`
Given monocular disparity $d_{\mathrm{mono}}(u,v)$, **`AffineGS`** (Tse, Peng, Chen, & Yao, NeurIPS 2026, `arXiv:2611.07709`) estimates pixel-wise affine fields $(\alpha(u,v), \beta(u,v))$:
$$\hat{d}_{\mathrm{rect}}(u, v) = \alpha(u, v)\,d_{\mathrm{mono}}(u, v) + \beta(u, v)$$
Direct source inspection of `AffineGS-LLFF-public/utils/disparity_normal_loss.py` (L90–145) verifies the exact rectification pipeline `[FACT]`:
1. The local scaling field is computed as `coefficients = d_gt_norm / (gt_safe**2 * d_render_norm + 1e-5)`—strictly **non-negative ($\ge 0$, sign-blind ratio of gradient L2 norms)**.
2. Percentile clamping (`5th–95th`) is applied **before** running `cv2.ximgproc.guidedFilter(guide=gt_disparity.detach().cpu(), radius=600, eps=0.05)` guided by the unrectified monocular disparity $d_{\mathrm{mono}}$, followed by post-filter `[p5, p95]` gradient-norm & denominator clamping (`.clamp(min=1e-6)`) and `torch.no_grad()` global least-squares re-alignment (`_fa, _fb`) `[FACT]`.
- *Structural Limits vs. Unverified Hypothesis*: Because `coefficients` is non-negative and Guided Filtering enforces piecewise linear affinity to raw $d_{\mathrm{mono}}$ across large windows, the filter structurally cannot invert a sign-flipped slope inside a smooth guide region where boundary contrast is weak `[FACT]`; whether such non-affine local shape errors consistently induce irreversible 3D geometric degradation after 3DGS joint optimization remains an open `[HYPOTHESIS]` requiring minimal reproduction testing rather than premature rejection. Edge bleeding across foreground-background boundaries can also propagate biased local coefficients `[DERIVATION]`.

### 2. Selective Supervision & Stereo Prior Landscape (2024–2026) `[LITERATURE_RESULT]`
- **`In Depth We Trust`** (`arXiv:2604.05715`, CVPRW 3DMV 2026): Constructs a virtual-stereo **Depth-Inconsistency Mask (DIM)** to suppress noisy/contradictory monocular regions combined with **Gradient-Alignment Loss (GAL)** on locally consistent subsets.
- **`DepthGS`** (`arXiv:2611.13628`, IEEE TPAMI 2026, `10.1109/TPAMI.2026.3751295`): Derives reconstruction error bounds from depth discrepancy and dynamically downweights normal regularization where monocular vs. multi-view depth disagree, paired with cross-view depth consistency.
- **`DGDO-GS`** (Applied Sciences 2026): Partitions smooth vs. sharp depth-gradient zones and orthogonally decouples position and shape updates.
- **`Sparse2DGS`** (`arXiv:2504.20378`, CVPR 2025) & **`StereoGS`** (`arXiv:2606.30545`, ECCV 2026): Bypass monocular scale ambiguity by initializing or supervising directly with `DUSt3R` / Foundation Stereo multi-view priors—posing the primary baseline challenge whenever cross-view overlap suffices `[LITERATURE_RESULT]`.

### 3. Update DoF Separation, Co-Regularization & Dropout `[LITERATURE_RESULT]`
- **`GDoFS`** (`arXiv:2412.13325`, WACV 2026): Separates uncertain ray-aligned Gaussian translations (visibility-regularized) from bounded image-plane translations.
- **`CoR-GS`** (ECCV 2024): Jointly optimizes dual 3DGS instances using point disagreement co-pruning and rendering disagreement pseudo-views (`~6 min` on RTX 3090 Ti reported for LLFF); fails if both instances collapse symmetrically under strong bias `[LITERATURE_RESULT]`.
- **`DropGaussian`** (CVPR 2025), **`DOC-GS`** (ACM MM 2026, `2604.06739`), and **`SRUP-GS`** (`10.1016/j.cag.2026.104731`): Amplify visibility gradients via structural Gaussian dropout, dark-channel floater pruning, or rank-uncertainty perturbation `[LITERATURE_RESULT]`.

### 4. Pose Provenance Protocols (`P1/P2/P3`) & Parameter Non-Identifiability `[DERIVATION]` `[SAFETY_BOUND]`
- **`P1` (Dense-SfM Oracle Poses)** vs. **`P2` (Training-View-Only SfM)**: Direct inspection of `AffineGS-LLFF-public/scene/dataset_readers.py` (L274–318, L559) verifies that `readColmapSceneInfo` invokes `refineColmapWithIndex` (global `P1` precomputed extrinsics filtered to training views) rather than `BundleAdjustment_ColmapWithIndex` (`P2`), and `scripts/search_llff_config.sh` (L5) warns that grid search inspects test-view metrics `[FACT]`. Under $K \le 3$ views, `P2` COLMAP triangulation frequently fails on wide-baseline pairs; failure rates and hyperparameter-selection splits must never be silently conflated with `P1` oracle numbers `[SAFETY_BOUND]`. **`P3`** denotes learned MVS/DUSt3R/Stereo pose/point initialization.
- **Theorem (Non-Identifiability $\neq$ Geometric Error)**: Distinct affine coefficients $(\alpha_1, \beta_1) \neq (\alpha_2, \beta_2)$ mapping different intermediate disparities onto the identical surface manifold achieve `Chamfer Distance = 0` `[DERIVATION]`. Likewise, sensitivity of NVS PSNR to depth noise does not prove physical surface distortion without independent 3D ground truth `[SAFETY_BOUND]`.

---

## 3. Compute, VRAM & Verification Architecture

- **`AffineGS` (`eldentse/AffineGS` / `AffineGS-LLFF-public`, Apache-2.0)**: Author-reported full Nerfstudio version requires **`1.5–2.0 hr/scene` on 1× RTX 3090** (`[LITERATURE_RESULT]`); runtime of `AffineGS-LLFF-public` on single consumer/Colab GPUs remains **`UNVERIFIED`** locally (treat any timing estimate without logged runs strictly as `ESTIMATED`, and never discard core geometric failure hypotheses solely on unmeasured compute assumptions before checking reproducibility) `[DESIGN_DECISION]` `[SAFETY_BOUND]`.
- **Zero-GPU CPU Counterexample Harness**: Synthetic local-affine vs. inverted-curvature diagnostics execute in milliseconds on CPU before burning cloud GPU quotas `[DESIGN_DECISION]`.

---

## 4. Executable Python Implementation: CPU Affine Bound & Identifiability Verifier

```python
import math
import statistics
from dataclasses import dataclass
from typing import List, Tuple


@dataclass
class SparseDepthDiagnosticResult:
    case_name: str
    mean_surface_mae: float
    normal_sign_flip_rate: float
    is_geometrically_faithful: bool


def box_mean_1d(values: List[float], radius: int) -> List[float]:
    n = len(values)
    return [sum(values[max(0, i - radius):min(n, i + radius + 1)]) / (min(n, i + radius + 1) - max(0, i - radius)) for i in range(n)]


def simulated_guided_affine_fit_1d(
    guide: List[float],
    target: List[float],
    anchor_mask: List[bool],
    radius: int = 4,
    eps: float = 1e-4,
) -> List[float]:
    """Sparse-anchor affine fit + guided propagation into anchor-free smooth interior."""
    n = len(guide)
    anchor_idx = [i for i, m in enumerate(anchor_mask) if m]
    assert len(anchor_idx) >= 4
    mg = sum(guide[i] for i in anchor_idx) / len(anchor_idx)
    mt = sum(target[i] for i in anchor_idx) / len(anchor_idx)
    var_g = sum((guide[i] - mg) ** 2 for i in anchor_idx) / len(anchor_idx)
    cov_gt = sum((guide[i] - mg) * (target[i] - mt) for i in anchor_idx) / len(anchor_idx)
    a_global = max(0.1, min(3.0, cov_gt / (var_g + eps)))
    b_global = mt - a_global * mg

    a_field, b_field = [], []
    for i in range(n):
        if anchor_mask[i]:
            lo, hi = max(0, i - radius), min(n, i + radius + 1)
            win = [j for j in range(lo, hi) if anchor_mask[j]]
            if len(win) >= 3:
                w_mg = sum(guide[j] for j in win) / len(win)
                w_mt = sum(target[j] for j in win) / len(win)
                w_vg = sum((guide[j] - w_mg) ** 2 for j in win) / len(win)
                w_cov = sum((guide[j] - w_mg) * (target[j] - w_mt) for j in win) / len(win)
                a_est = max(0.1, min(3.0, w_cov / (w_vg + eps)))
                b_est = w_mt - a_est * w_mg
            else:
                a_est, b_est = a_global, b_global
        else:
            a_est, b_est = a_global, b_global
        a_field.append(a_est)
        b_field.append(b_est)

    mean_a = box_mean_1d(a_field, radius)
    mean_b = box_mean_1d(b_field, radius)
    return [a * g + b for a, b, g in zip(mean_a, mean_b, guide)]


def evaluate_surface_faithfulness(
    case_name: str,
    true_surface: List[float],
    predicted_surface: List[float],
    mae_threshold: float = 0.05,
) -> SparseDepthDiagnosticResult:
    mae = statistics.fmean(abs(p - t) for p, t in zip(predicted_surface, true_surface))
    flips, total_grad = 0, 0
    for i in range(len(true_surface) - 1):
        gt_d = true_surface[i + 1] - true_surface[i]
        pr_d = predicted_surface[i + 1] - predicted_surface[i]
        if abs(gt_d) > 1e-3:
            total_grad += 1
            if gt_d * pr_d < 0:
                flips += 1
    flip_rate = flips / max(1, total_grad)
    return SparseDepthDiagnosticResult(
        case_name=case_name,
        mean_surface_mae=mae,
        normal_sign_flip_rate=flip_rate,
        is_geometrically_faithful=(mae < mae_threshold and flip_rate < 0.05),
    )


def verify_non_identifiable_plane_equivalence(
    coords: List[float],
    true_plane: List[float],
) -> Tuple[float, bool]:
    """Demonstrates distinct affine parameterizations yielding zero geometric error difference."""
    raw_a = [0.5 * z + 1.0 for z in true_plane]
    raw_b = [2.0 * z - 3.5 for z in true_plane]
    rect_a = [2.0 * v - 2.0 for v in raw_a]
    rect_b = [0.5 * v + 1.75 for v in raw_b]
    diff = max(abs(a - b) for a, b in zip(rect_a, rect_b))
    err_gt = max(abs(a - t) for a, t in zip(rect_a, true_plane))
    return max(diff, err_gt), (len(coords) == len(true_plane) and diff < 1e-9)


if __name__ == "__main__":
    xs = [-1.0 + 2.0 * i / 63 for i in range(64)]
    gt_curve = [2.0 + 0.6 * math.exp(-3.0 * x * x) for x in xs]
    sparse_anchors = [abs(x) >= 0.45 for x in xs]

    mono_affine = [0.70 * z + 0.4 for z in gt_curve]
    res_a = evaluate_surface_faithfulness("Piecewise_Affine_Only", gt_curve, simulated_guided_affine_fit_1d(mono_affine, gt_curve, sparse_anchors, radius=3))

    mono_inverted = list(mono_affine)
    for idx in range(20, 44):
        mono_inverted[idx] -= 0.75 * math.exp(-(xs[idx] ** 2) / 0.12)
    res_b = evaluate_surface_faithfulness("Local_Shape_Inversion", gt_curve, simulated_guided_affine_fit_1d(mono_inverted, gt_curve, sparse_anchors, radius=4))

    geom_delta, eq_ok = verify_non_identifiable_plane_equivalence(xs, [2.5 + 0.4 * x for x in xs])

    assert res_a.is_geometrically_faithful
    assert not res_b.is_geometrically_faithful and res_b.normal_sign_flip_rate > 0.25
    assert eq_ok and geom_delta < 1e-9
    print(f"[LIB-507 Verified] CaseA_MAE={res_a.mean_surface_mae:.4f} | CaseB_flip={res_b.normal_sign_flip_rate:.2%} | EqDiff={geom_delta:.1e}")
```

---

## 5. AI Agent Inference Contracts & System Invariants

### [RULE-507-01] Pose & Prior Provenance Disclosure Invariant
- **Contract Level**: `SAFETY_CRITICAL`
- **Specification**: Sparse-view 3DGS benchmarks MUST explicitly label pose/initialization provenance (`P1` dense-SfM, `P2` training-view-only SfM, `P3` external DUSt3R/Stereo priors); `P2` SfM registration failure rates must be logged transparently and never masked with `P1` oracle poses `[DESIGN_DECISION]`.

### [RULE-507-02] Independent Geometry Truth Verification Gate
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: Claims of geometric repair or superior 3D structure MUST be validated against independent 3D geometric ground truth (e.g., Mesh Chamfer Distance, Normal MAE, or scanned metric Depth AbsRel), NEVER inferred solely from RGB NVS metrics (`PSNR`/`SSIM`/`LPIPS`) `[SAFETY_BOUND]`.

### [RULE-507-03] Non-Identifiability vs. Geometry Error Disentanglement
- **Contract Level**: `BOUNDARY_GUARD`
- **Specification**: Agents must NOT conflate non-unique affine rectification parameters $(\alpha, \beta)$ or photometric perturbation sensitivity with genuine 3D surface errors; surface displacement must be verified directly in metric 3D geometry `[DERIVATION]`.

### [RULE-507-04] Mandatory Selective-Supervision & Stereo Baseline Matrix
- **Contract Level**: `QUALITY_BOUND`
- **Specification**: New monocular depth supervision or adaptive weighting schemes MUST benchmark against `AffineGS`, selective supervision (`In Depth We Trust` / `DepthGS` adaptive normal weighting), and multi-view stereo alternatives (`Sparse2DGS` / `StereoGS`) with explicit algorithmic boundaries `[LITERATURE_RESULT]`.

---

## 6. Peer-Reviewed References & Literature

1. Tse, T. H. E., Peng, J., Chen, R., & Yao, A. (2026). *AffineGS: Unlocking Accurate Geometry in 3DGS via Spatially Varying Affine Rectification*. Accepted to **NeurIPS 2026** ([arXiv:2611.07709](https://arxiv.org/abs/2611.07709)).
2. Xiao, W.-H., Goan, E., Santa Cruz, R., Ahmedt-Aristizabal, D., Salvado, O., Fookes, C., & Lebrat, L. (2026). *In Depth We Trust: Reliable Monocular Depth Supervision for Gaussian Splatting*. **CVPRW 3DMV 2026** ([arXiv:2604.05715](https://arxiv.org/abs/2604.05715)).
3. Ren, X., Liu, Y., An, N., Cheng, J., Qiao, X., Li, Y.-F., & Kong, H. (2026). *DepthGS: Depth-Guided Gaussian Splatting with Adaptive Regularization for High-Quality Surface Reconstruction*. **IEEE TPAMI 2026** ([arXiv:2611.13628](https://arxiv.org/abs/2611.13628), DOI: `10.1109/TPAMI.2026.3751295`).
4. Li, J., Zhang, J., Bai, X., et al. (2024). *DNGaussian: Optimizing Sparse-View 3D Gaussian Radiance Fields with Global-Local Depth Normalization*. **CVPR 2024**.
5. Kim, Y., Choi, J., & Yoon, S. (2026). *GDoFS: Gaussian DoF Separation for Plausible 3D Geometry in Sparse-View 3DGS*. **WACV 2026** ([arXiv:2412.13325](https://arxiv.org/abs/2412.13325)).
6. Zhang, J., et al. (2024). *CoR-GS: Sparse-View 3D Gaussian Splatting via Co-Regularization*. **ECCV 2024**.
7. Park, H., et al. (2025). *DropGaussian: Structural Regularization for Sparse-View Gaussian Splatting*. **CVPR 2025**; Li, Z., et al. (2026). *DOC-GS*. **ACM MM 2026** ([arXiv:2604.06739](https://arxiv.org/abs/2604.06739)); Lian, X., et al. (2026). *DGDO-GS*. **Applied Sciences 2026** (`10.3390/app16084026`); Liu, X., et al. (2026). *SRUP-GS*. **Computers & Graphics 2026** (`10.1016/j.cag.2026.104731`).
8. Wu, J., et al. (2025). *Sparse2DGS*. **CVPR 2025** ([arXiv:2504.20378](https://arxiv.org/abs/2504.20378)); Yuan, W., Ge, Y., & Cai, D. (2026). *StereoGS*. **ECCV 2026** ([arXiv:2606.30545](https://arxiv.org/abs/2606.30545)).
