---
call_number: LIB-503
status: source-verified
invariants_count: 4
title: Modern Object Detection, Localization & Occlusion Reliability (Agent EN)
module: Computer-Vision
category: 2D-Object-Detection-and-Calibration
audience:
  - Autonomous-Agent
  - Graduate-PhD
  - Senior-ML-Engineer
math_foundations:
  - Bipartite Hungarian Matching & Dense One-to-One Supervision (RT-DETR / DEIM)
  - Fine-grained Distribution Refinement (D-FINE FDR) & Edge Shannon Entropy
  - 2D Gaussian Wasserstein Distance (NWD) & Small-Object IoU Collapse
  - Detection Expected Calibration Error (D-ECE), LaECE & Two-Step Conformal Box Bounds
hardware_target:
  - NVIDIA T4 / Consumer 8GB GPU Real-Time Inference & CPU Post-hoc Calibration
  - CUDA Deformable Attention & Overlap Grid Slicing Trade-offs
created: 2026-11-17
author: Luke
tags:
  - computer-vision
  - object-detection
  - rt-detr
  - d-fine
  - calibration
  - conformal-prediction
  - tiny-objects
  - occlusion
prerequisites:
  - "[[LIB-401 DNN Spatial Limits & CNN Inductive Bias (Agent EN)]]"
  - "[[LIB-405 Attention Mechanism & Transformer Revolution (Agent EN)]]"
  - "[[LIB-501 CV Preprocessing & Center of Mass Alignment (Agent EN)]]"
  - "[[LIB-801 Model Calibration & Uncertainty Estimation (Agent EN)]]"
successors:
  - "[[LIB-904 Academic Research Corpus & Literature Synthesis (Agent EN)]]"
  - "[[LIB-907 Research Gap Discovery, Novelty Collision & Topic Selection (Agent EN)]]"
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../05_%E8%A8%88%E7%AE%97%E6%A9%9F%E8%A6%96%E8%A6%BA%E8%88%87%E9%AB%98%E7%B6%AD%E6%84%9F%E6%B8%AC/LIB-503%20%E7%8F%BE%E4%BB%A3%E7%89%A9%E4%BB%B6%E5%81%B5%E6%B8%AC%E6%9E%B6%E6%A7%8B%E3%80%81%E5%AE%9A%E4%BD%8D%E4%B8%8D%E7%A2%BA%E5%AE%9A%E6%80%A7%E8%88%87%E9%81%AE%E6%93%8B%E6%A0%A1%E6%BA%96%20%28Modern%20Object%20Detection,%20Localization%20%26%20Occlusion%20Reliability%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Modern Object Detection, Localization & Occlusion Reliability

## Conceptual Coordinates & Topological Navigation
- **Prerequisites**: [[LIB-401 DNN Spatial Limits & CNN Inductive Bias (Agent EN)]], [[LIB-405 Attention Mechanism & Transformer Revolution (Agent EN)]], [[LIB-501 CV Preprocessing & Center of Mass Alignment (Agent EN)]], [[LIB-801 Model Calibration & Uncertainty Estimation (Agent EN)]].
- **Successors**: [[LIB-904 Academic Research Corpus & Literature Synthesis (Agent EN)]], [[LIB-907 Research Gap Discovery, Novelty Collision & Topic Selection (Agent EN)]].
- **Core Scope**: Bridges 2D CV preprocessing (`LIB-501`) and literature synthesis (`LIB-904`) by establishing formal mathematical models and system invariants for real-time end-to-end Detection Transformers (`RT-DETR`, `D-FINE`, `DEIM`, `RF-DETR`), tiny-object IoU collapse (`NWD`, `RFLA`, `DQ-DETR`), crowded 2D box occlusion vs. amodal segmentation boundaries, and localization-aware detection calibration (`LaECE`, Two-Step Conformal Prediction).

---

## 1. Conceptual Mental Model: Asymmetric Boundary Risk & Sub-Pixel Fragility

1. **Scalar Box Overconfidence under Partial Occlusion**: Predicting four deterministic coordinates $(x_1, y_1, x_2, y_2)$ paired with a single class confidence score (`0.92`) hides anisotropic spatial uncertainty. When a vehicle or pedestrian is cleanly visible on its left edge but occluded on its right edge, a scalar box gives downstream planners no mechanism to know that three boundaries are sharp while one boundary has high localization variance.
2. **Tiny-Object IoU Cliff (`<16x16 px`)**: In aerial and distant traffic detection (`AI-TOD`, `VisDrone`), a 1–2 pixel regression offset on an $8 \times 8$ box slashes Intersection-over-Union (`IoU`) toward zero `[FACT]`, destroying gradient flow and positive label assignment unless replaced by smooth distributional metrics.
3. **NMS Bottlenecks vs. Set-Prediction Collapse**: Classical detectors discard overlapping predictions via heuristic NMS; real-time end-to-end DETRs eliminate NMS via bipartite Hungarian matching, yet extreme instance overlap (`CrowdHuman`) can trigger query saturation, high cardinality error, or merged "mega-boxes."

---

## 2. Mathematical Formalization

### 1. Real-Time DETR Evolution & `D-FINE` Edge Distribution Refinement (FDR)
- **RT-DETR (Zhao et al., CVPR 2024)**: Decouples intra-scale interaction and cross-scale fusion via an Efficient Hybrid Encoder plus Uncertainty-Minimal Query Selection, reaching `108 FPS` (R50) at T4 FP16 without NMS `[LITERATURE_RESULT]`.
- **DEIM (Huang et al., CVPR 2025)**: Resolves sparse one-to-one (O2O) supervision via **Dense O2O Matching** and **Matchability-Aware Loss (MAL)**, reducing training time by `50%` (`AUTHOR_REPORTED`, `arXiv:2412.04234`) without inference overhead `[LITERATURE_RESULT]`.
- **D-FINE (Peng et al., ICLR 2025 Spotlight)**: Replaces deterministic coordinate regression with iterative **Fine-grained Distribution Refinement (FDR)** over four independent per-edge probability distributions $\mathbf{p}_e^{(l)} \in \Delta^{K}$ for $e \in \{l, t, r, b\}$ and **Global Optimal Localization Self-Distillation (GO-LSD)** `[LITERATURE_RESULT]`:
  $$\hat{d}_e^{(l)} = \hat{d}_e^{(l-1)} + H_{\text{box}} \sum_{k=0}^{K} w_k \, p_{e, k}^{(l)}, \qquad p_{e, k}^{(l)} = \mathrm{Softmax}\big(z_{e, k}^{(l)} + z_{e, k}^{(l-1)}\big)$$
  - **Per-Edge Geometric Uncertainty `[DERIVATION]`**: Computing the Shannon entropy $H(\mathbf{p}_e) = -\sum_{k=0}^K p_{e,k}\log(p_{e,k}+\varepsilon)$ preserves anisotropic per-boundary uncertainty under one-sided occlusion rather than collapsing it into a scalar point estimate.

### 2. Tiny-Object Normalized Gaussian Wasserstein Distance (`NWD`) `[DERIVATION]`
Modeling bounding boxes $(c_x, c_y, w, h)$ as 2D Gaussians $\mathcal{N}_a(\boldsymbol{\mu}_a, \boldsymbol{\Sigma}_a)$ with $\boldsymbol{\Sigma}_a = \mathrm{diag}(w_a^2/4, h_a^2/4)$ (Wang et al., ICPR 2021) yields a smooth, non-vanishing similarity under zero pixel overlap:
$$W_2^2(\mathcal{N}_a, \mathcal{N}_b) = \left\| \left[c_{x,a}, c_{y,a}, \frac{w_a}{2}, \frac{h_a}{2}\right]^\top - \left[c_{x,b}, c_{y,b}, \frac{w_b}{2}, \frac{h_b}{2}\right]^\top \right\|_2^2, \qquad \mathrm{NWD}(\mathcal{N}_a, \mathcal{N}_b) = \exp\left(-\frac{\sqrt{W_2^2(\mathcal{N}_a, \mathcal{N}_b)}}{C}\right)$$
Paired with Gaussian receptive-field assignment (`RFLA`, ECCV 2022) and counting-guided dynamic queries (`DQ-DETR`, ECCV 2024), detectors stabilize supervision on tiny dense targets `[LITERATURE_RESULT]`.

### 3. 2D Occlusion-Aware Box Detection vs. Amodal Instance Segmentation `[FACT]`
- **2D Box Occlusion Detection** separates densely overlapping instances via visible/full bounding boxes (`CrowdHuman`, `CityPersons`; metrics: `AP`, `MR^-2`, `JI`; e.g., `CrowdDet`, `DDQ`, `Relation-DETR`).
- **Amodal Instance Segmentation** infers full pixel-level masks behind occluders (`COCOA`, `SAIL-VOS`; metric: `Amodal mIoU`). The two tasks must never be conflated `[SAFETY_BOUND]`.

### 4. Detection Calibration Pitfalls (`LaECE`) & Two-Step Conformal Box Bounds `[LITERATURE_RESULT]`
- **Evaluation Pitfalls (Kuzucu et al., ECCV 2024 Oral)**: Standard `D-ECE` depends heavily on arbitrary score thresholding (e.g., $\ge 0.30$) and ignores regression quality. Combining **Localization-aware ECE (`LaECE`)** (weighting precision by matched IoU) with `LRP Error` prevents confident-yet-misaligned boxes from scoring artificially well; properly adapted **Post-hoc Isotonic Regression / Platt Scaling** outperforms heavy train-time baselines such as `Cal-DETR` by over 7 D-ECE points on COCO `[LITERATURE_RESULT]`.
- **Two-Step Conformal Detection & Aleatoric Scaled Intervals (`Timans 2024`, `Ries 2026`, `SeqCRC 2025`)**:
  - **Timans et al. (`ECCV 2024 Oral`, `arXiv:2403.07263`)** construct Step-1 class prediction sets followed by quantile/size-scaled residual box bounds.
  - **Ries et al. (`COPA 2026 Oral`, PMLR v329, `arXiv:2605.07549`, [`mos-ks/OD-CP`](https://github.com/mos-ks/OD-CP))** scale coordinate-wise split conformal residuals directly by **per-prediction anisotropic aleatoric uncertainties ($\sigma_e$) trained via loss attenuation** (`EfficientDet-d0`), applying Bonferroni ($1-4\alpha$) box widening, two-step **RAPS** class sets, and class-wise calibration across **KITTI, BDD100K, and CODA** (achieving `up to 19%` higher IoU and `39%` lower interval scores vs. unscaled CP baselines, `AUTHOR_REPORTED` `[LITERATURE_RESULT]`). Hence anisotropic coordinate-wise conformal scaling is ALREADY established prior art rather than unclaimed novelty `[SAFETY_BOUND]`.
  - **Marginal vs. Conditional Coverage & Statistical Preconditions `[FACT]` `[DERIVATION]`**: Standard split CP only guarantees global marginal coverage $\mathbb{P}(B_{\text{test}} \subseteq \hat{\mathcal{B}}_\alpha(X_{\text{test}})) \ge 1 - \alpha$ under strict conditions `[SAFETY_BOUND]`: (i) coverage is conditioned exclusively on **detected True Positives matched to GT** (post-hoc box bounds NEVER cover missed detections / False Negatives—Recall and `MR^-2` must be tracked independently); (ii) split/calibration vs. test sets must remain strictly `Image-/Scene-disjoint` so intra-image object-level dependence does not violate image-level exchangeability; (iii) covariate or occlusion distribution shift invalidates exchangeability and degrades coverage; and (iv) global marginal guarantees can mask severe minority-stratum (e.g., heavily occluded) under-coverage `[HYPOTHESIS]`, while exact distribution-free pointwise conditional coverage is provably unattainable `[FACT]`, requiring group-stratified **Mondrian CP** over occlusion groups $G_{\mathrm{occ}}$ at the cost of higher finite-sample quantile variance `[SAFETY_BOUND]`.

---

## 3. Systems & Hardware Microarchitecture Alignment (`D-FINE` Eval Hook & Provenance)

1. **Official `Peterande/D-FINE` Code Extraction Behavior (`[FACT]`)**: Direct source inspection of `src/zoo/dfine/dfine_decoder.py` (L287–314, L428–456, L890–900) and `postprocessor.py` (L39–93) verifies that pretrained `D-FINE` computes 4-edge discrete `out_corners` distributions via non-uniform `weighting_function`, `Integral`, and `LQE` without backbone weight retraining; **however**, default `DFINETransformer.forward()` discards `pred_corners` whenever `not self.training` (`else:` returns only `pred_logits` and `pred_boxes`), and `DFINEPostProcessor.forward()` omits `topk` indices and distributions. Extracting aligned `[B, N_topk, 4, reg_max+1]` FDR tensors therefore requires modifying eval/postprocessor outputs or attaching a PyTorch forward hook checked against decoded `pred_boxes` `[DESIGN_DECISION]`.
2. **Author-Reported Forward FPS vs. End-to-End Runtime Boundary**: The `D-FINE` paper (`arXiv:2410.13842`) reports `124 / 78 FPS` TensorRT FP16 forward throughput on NVIDIA T4 for **`D-FINE-L / D-FINE-X`** (`54.0% / 55.8% AP` on COCO, while the official README reports `472 FPS / 42.8% APval` for `D-FINE-N`, `AUTHOR_REPORTED` `[LITERATURE_RESULT]`), excluding dataset decoding, hook alignment, GT matching, and Mondrian statistical passes; total calibration/eval runtime remains `NOT_RUN / UNVERIFIED` on team hardware (`4–8 GB` local VRAM is an observed device constraint, not a topic elimination rule) `[SAFETY_BOUND]`.
3. **High-Resolution Memory Scaling**: Naive high-resolution inference or exhaustive multi-tile slicing multiplies compute and latency (`Illustrative Example`: e.g., `2x2` to `3x3` grids scale base tiles by `4x–9x`+ before overlap margins), requiring measured overhead reporting (`RULE-503-02`) `[DESIGN_DECISION]` `[SAFETY_BOUND]`.

---

## 4. Executable Verification Kernel: Edge Entropy, NWD & LaECE

```python
import torch
import math
from typing import Tuple


def compute_fdr_edge_entropy(edge_probs: torch.Tensor, eps: float = 1e-8) -> torch.Tensor:
    """Compute per-edge Shannon entropy of D-FINE discrete boundary distributions [N, 4, L]."""
    assert edge_probs.dim() == 3 and edge_probs.shape[1] == 4, "Expected tensor of shape [N, 4, L]"
    row_sums = edge_probs.sum(dim=-1)
    assert torch.allclose(row_sums, torch.ones_like(row_sums), atol=1e-4), "Edge distributions must sum to 1"
    p_safe = torch.clamp(edge_probs, min=eps)
    return -(edge_probs * torch.log(p_safe)).sum(dim=-1)


def compute_nwd_similarity(
    boxes_a: torch.Tensor,
    boxes_b: torch.Tensor,
    scale_constant: float = 12.0,
) -> torch.Tensor:
    """Compute 2D Gaussian Normalized Wasserstein Distance (NWD) similarity for tiny boxes (cx, cy, w, h)."""
    assert boxes_a.shape[-1] == 4 and boxes_b.shape[-1] == 4
    assert scale_constant > 0.0
    ga = torch.stack([boxes_a[:, 0], boxes_a[:, 1], boxes_a[:, 2] * 0.5, boxes_a[:, 3] * 0.5], dim=-1)
    gb = torch.stack([boxes_b[:, 0], boxes_b[:, 1], boxes_b[:, 2] * 0.5, boxes_b[:, 3] * 0.5], dim=-1)
    diff = ga.unsqueeze(1) - gb.unsqueeze(0)
    w2_dist = torch.sqrt(torch.clamp((diff * diff).sum(dim=-1), min=1e-12))
    return torch.exp(-w2_dist / scale_constant)


def compute_laece(
    confidences: torch.Tensor,
    matched_ious: torch.Tensor,
    n_bins: int = 10,
) -> Tuple[float, float]:
    """Compute instance-level Localization-aware ECE (LaECE) vs binary D-ECE (IoU >= 0.5)."""
    assert confidences.shape == matched_ious.shape
    N = confidences.numel()
    assert N > 0
    bin_bounds = torch.linspace(0.0, 1.0, n_bins + 1, device=confidences.device)
    la_ece = 0.0
    d_ece = 0.0
    tp_binary = (matched_ious >= 0.5).float()

    for m in range(n_bins):
        lo, hi = bin_bounds[m].item(), bin_bounds[m + 1].item()
        mask = (confidences > lo) & (confidences <= hi) if m > 0 else (confidences >= lo) & (confidences <= hi)
        cnt = int(mask.sum().item())
        if cnt == 0:
            continue
        weight = cnt / N
        avg_conf = float(confidences[mask].mean().item())
        avg_bin_acc = float(tp_binary[mask].mean().item())
        avg_la_acc = float((tp_binary[mask] * matched_ious[mask]).mean().item())
        d_ece += weight * abs(avg_conf - avg_bin_acc)
        la_ece += weight * abs(avg_conf - avg_la_acc)

    return la_ece, d_ece


if __name__ == "__main__":
    L = 32
    sharp = torch.zeros(L)
    sharp[10], sharp[9], sharp[11] = 0.96, 0.02, 0.02
    occluded = torch.full((L,), 1.0 / L)
    sample_fdr = torch.stack([torch.stack([sharp, sharp, sharp, occluded])])
    ent = compute_fdr_edge_entropy(sample_fdr)
    assert ent[0, 3] > 3.0 * ent[0, 0]

    box_gt = [100.0, 100.0, 8.0, 8.0]
    box_pred = [112.0, 100.0, 8.0, 8.0]
    tiny_gt = torch.tensor(box_gt).unsqueeze(0)
    tiny_pred = torch.tensor(box_pred).unsqueeze(0)
    nwd_val = compute_nwd_similarity(tiny_pred, tiny_gt, scale_constant=12.0).item()
    assert 0.30 < nwd_val < 0.45 and math.isfinite(nwd_val)

    confs = torch.tensor([0.92, 0.90, 0.88, 0.85])
    ious = torch.tensor([0.52, 0.55, 0.51, 0.54])
    la_val, d_val = compute_laece(confs, ious, n_bins=5)
    assert la_val > d_val
    print(f"[LIB-503 Verified] edge_ent={ent.tolist()}, NWD={nwd_val:.4f}, LaECE={la_val:.4f} > D-ECE={d_val:.4f}")
```

---

## 5. AI Agent Inference Contracts & System Invariants

### [RULE-503-01] Occlusion Detection vs. Amodal Segmentation Boundary
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: Never conflate 2D box-level occlusion separation (`AP`, `MR^-2`, `JI` on CrowdHuman/CityPersons) with pixel-level amodal mask completion (`Amodal mIoU` on COCOA/SAIL-VOS) in problem framing, baselines, or metric comparisons.

### [RULE-503-02] Tiny-Object Distribution Matching & Grid-Slicing Guard
- **Contract Level**: `BOUNDARY_GUARD`
- **Specification**: For targets averaging $< 16 \times 16\text{ px}$, avoid unsmoothed pure `IoU` in matching costs where 1–2px shifts cause gradient collapse; use distributional distances (`NWD` / `RFLA`) or overlap-guarded grid slicing ($\ge 20\%$ overlap, aligned with `LIB-904` `RULE-904-03`) with full inference latency overhead disclosed `[SAFETY_BOUND]`.

### [RULE-503-03] Localization-Aware Calibration & Baseline Integrity Invariant
- **Contract Level**: `QUALITY_BOUND`
- **Specification**: Detection calibration evaluations MUST NOT rely solely on fixed-threshold `D-ECE`; report `LaECE`, `LRP`, threshold-swept profiles, and head-to-head comparisons against detector-adapted Post-hoc Isotonic Regression and Platt Scaling baselines `[LITERATURE_RESULT]`.

### [RULE-503-04] Conformal Bounding Box Coverage & FN Transparency Invariant
- **Contract Level**: `SAFETY_CRITICAL`
- **Specification**: Conformal detection calibration splits MUST enforce `Image-/Scene-disjoint` exchangeability rather than shuffling boxes across the same image `[SAFETY_BOUND]`. Explicitly report **Marginal Coverage** alongside occlusion-stratified **Occlusion-Conditional (Mondrian) Coverage**, disclose that conformal box bounds never cover missed detections (False Negatives), and accompany coverage with recall (`MR^-2`) and box stretch tightness `[SAFETY_BOUND]`.

---

## 6. Peer-Reviewed References & Literature

1. Zhao, Y., Lv, W., Xu, S., Wei, J., Wang, G., Dang, Q., Liu, Y., & Chen, J. (2024). "DETRs Beat YOLOs on Real-time Object Detection (*RT-DETR*)." *CVPR 2024*. [arXiv:2304.08069](https://arxiv.org/abs/2304.08069) | Code: `lyuwenyu/RT-DETR`.
2. Peng, Y., Li, H., Wu, P., Zhang, Y., Sun, X., & Wu, F. (2025). "D-FINE: Redefine Regression Task of DETRs as Fine-grained Distribution Refinement." *ICLR 2025 (Spotlight)*. [arXiv:2410.13842](https://arxiv.org/abs/2410.13842) | Code: `Peterande/D-FINE` (Apache-2.0).
3. Huang, S., Lu, Z., Cun, X., Yu, Y., Zhou, X., & Shen, X. (2025). "DEIM: DETR with Improved Matching for Fast Convergence." *CVPR 2025*. [arXiv:2412.04234](https://arxiv.org/abs/2412.04234); *DEIMv2*: [arXiv:2509.20787](https://arxiv.org/abs/2509.20787); Robinson, I., et al. (2026). *RF-DETR* (*ICLR 2026*, [arXiv:2511.09554](https://arxiv.org/abs/2511.09554)).
4. Kuzucu, S., Oksuz, K., Sadeghi, J., & Dokania, P. K. (2024). "On Calibration of Object Detectors: Pitfalls, Evaluation and Baselines." *ECCV 2024 (Oral)*. [arXiv:2405.20459](https://arxiv.org/abs/2405.20459) | Code: `fiveai/detection_calibration`.
5. Timans, A., Straehle, C.-N., Sakmann, K., & Nalisnick, E. (2024). "Adaptive Bounding Box Uncertainties via Two-Step Conformal Prediction." *ECCV 2024 (Oral)*. [arXiv:2403.07263](https://arxiv.org/abs/2403.07263); **Ries, C., Kassem Sbeyti, M., Bianco, N., & Klein, N.** (2026). "Probabilistic Object Detection with Conformal Prediction." *COPA 2026 (Oral)*, PMLR v329 ([arXiv:2605.07549](https://arxiv.org/abs/2605.07549) | Code: [`mos-ks/OD-CP`](https://github.com/mos-ks/OD-CP)); Andéol, L., et al. (2025). [arXiv:2505.24038](https://arxiv.org/abs/2505.24038).
6. Wang, J., et al. (2021). *NWD* (*ICPR 2021*, [arXiv:2110.13389](https://arxiv.org/abs/2110.13389)); Xu, C., et al. (2022). *RFLA* (*ECCV 2022*, [arXiv:2208.08738](https://arxiv.org/abs/2208.08738)); Huang, Y.-X., Liu, H.-I., Shuai, H.-H., & Cheng, W.-H. (2024). *DQ-DETR* (*ECCV 2024*, [arXiv:2404.03507](https://arxiv.org/abs/2404.03507)).
7. Chu, X., et al. (2020). *CrowdDet* (*CVPR 2020*, [arXiv:2003.09163](https://arxiv.org/abs/2003.09163)); Zhang, S., et al. (2023). *DDQ* (*CVPR 2023*, [arXiv:2303.13481](https://arxiv.org/abs/2303.13481)); Hou, X., et al. (2024). *Relation-DETR* (*ECCV 2024*, [arXiv:2407.11699](https://arxiv.org/abs/2407.11699)).
