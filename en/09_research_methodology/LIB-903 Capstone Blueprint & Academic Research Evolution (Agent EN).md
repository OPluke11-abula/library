---
call_number: LIB-903
status: reviewed
invariants_count: 6
title: Capstone Blueprint, Graduate Admissions & Multimodal Research Evolution (Agent Edition)
module: Academic-Strategy
category: Methodology-Practice
audience:
  - Autonomous-Agent
  - Research-Scientist
  - Capstone-Student
math_foundations:
  - NSTC C801 Research Proposal Methodology
  - Rigorous Ablation Study Design
  - Academic Paper 8-Stage Lifecycle
hardware_target:
  - Academic HPC Cluster & Research Workstations
created: 2026-09-17
author: Luke
tags:
  - academic-research
  - capstone-blueprint
  - nstc-c801
  - ablation-study
  - thesis-methodology
prerequisites:
  - "[[LIB-704 Dual-Process Neural Agent S1-Jev & Reflex CUA-S1 (Agent EN)]]"
  - "[[LIB-802 Quantization Mathematics & Low-Precision Inference (Agent EN)]]"
  - "[[LIB-901 Classic Project Post-Mortem - Production MNIST (Agent EN)]]"
successors:
  - "[[LIB-904 Academic Research Corpus & Literature Synthesis (Agent EN)]]"
  - "[[LIB-905 Frontier Vision & Multimodal Capstone Blueprints (Agent EN)]]"
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../09_%E7%A7%91%E7%A0%94%E6%96%B9%E6%B3%95%E8%AB%96%E8%88%87%E9%A0%82%E5%B0%96%E5%B0%88%E9%A1%8C%E8%97%8D%E5%9C%96/LIB-903%20%E5%B0%88%E9%A1%8C%E5%9F%BA%E7%9F%B3%E8%97%8D%E5%9C%96%E3%80%81%E5%AD%B8%E8%A1%93%E6%8E%A8%E7%94%84%E8%88%87%E5%A4%9A%E6%A8%A1%E6%85%8B%E7%A0%94%E7%A9%B6%E6%BC%94%E9%80%B2%20%28Capstone%20Blueprint%20%26%20Academic%20Research%20Evolution%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Capstone Blueprint, Graduate Admissions & Multimodal Research Evolution

## Conceptual Coordinates & Topological Navigation
- **Prerequisites**: [[LIB-704 Dual-Process Neural Agent S1-Jev & Reflex CUA-S1 (Agent EN)]], [[LIB-802 Quantization Mathematics & Low-Precision Inference (Agent EN)]], [[LIB-901 Classic Project Post-Mortem - Production MNIST (Agent EN)]].
- **Successors**: [[LIB-904 Academic Research Corpus & Literature Synthesis (Agent EN)]], [[LIB-905 Frontier Vision & Multimodal Capstone Blueprints (Agent EN)]].

## 1. Conceptual Mental Model

An undergraduate capstone project is not a simple homework programming assignment; it is a rigorous mini-dissertation and an empirical proof of capability for top-tier graduate admissions and research grant awards (such as the National Science and Technology Council NSTC C801 undergraduate research grant). True research begins where textbook exercises end: formulating an authentic scientific question, establishing formal hypotheses, conducting ablation studies to isolate confounding factors, and publishing peer-reviewed findings.

---

## 2. The 8-Stage Academic Research Lifecycle

```
[Phase 1: Problem Formulation] ──> [Phase 2: Comprehensive Literature Survey]
                                                    │
                                                    ▼
[Phase 4: Baseline Benchmarking] <── [Phase 3: Mathematical & System Hypothesis]
       │
       ▼
[Phase 5: Ablation Studies] ──────> [Phase 6: OOD & Stress-Testing]
                                                    │
                                                    ▼
[Phase 8: Peer-Reviewed Publication] <── [Phase 7: Paper Manuscript Drafting]
```

### 1. Problem Formulation & Scope
- Identify specific failure modes in prior art (e.g., lack of spatial calibration in real-world handwritten stroke parsing).
- Bound the problem domain with quantitative evaluation criteria.

### 2. NSTC Official Forms (`C801–C804`) & the `T / P / N / C` Scope Architecture `[FACT]` `[DESIGN_DECISION]`
Rather than conflating the entire grant package as `C801`, NSTC Undergraduate Research Grant submissions (per the Nov 1, 2024 revised NSTC Guidelines) strictly distinguish four official forms:
- **Form `C801` (Summary & Metadata Form)**, **Form `C802` (Research Proposal Content PDF)**, **Form `C803` (Consumables & Expense Schedule)**, and **Form `C804` (Advisor Initial Evaluation Form)**.
- **Statutory Ethics Training (Point 16.4)**: Student applicants MUST complete $\ge 6$ hours of academic ethics training (AREE) before institutional submission (`UNVERIFIED` until official certificate verification `[SAFETY_BOUND]`).
- **`System Carrier` vs. `Paper Kernel` Decoupling**: Strictly decouple the interactive **System Carrier (`C`: Capstone UI/Viewer)** from the standalone PyTorch **Paper Method Kernel (`P & N`)** exposing boolean ablation switches so causal experiments run headlessly on public benchmarks `[DESIGN_DECISION]`.
- **`T / P / N / C` Non-Sequential Boundary**: `T` (Research Theme), `P` (Pre-NSTC Research—transparently disclosed as preliminary basis in `C802` and NEVER passed off as N-period new work), `N` (Formal Grant Execution), and `C` (Capstone). `P` and `N` are neither forced into separate papers nor engineered with sequential dependency where `B` fails if `A` yields negative results `[DESIGN_DECISION]`.

### 3. 21-Field Research Protocol & Claim-to-Evidence Traceability Matrix `[SAFETY_BOUND]`
Every scientific claim entering an abstract, introduction, table, or grant narrative MUST satisfy six-tuple traceability:
$$\text{Research Claim} \longrightarrow \text{Experiment ID} \longrightarrow \text{Dataset Split \& Version} \longrightarrow \text{Code Commit SHA} \longrightarrow \text{Quantitative Result} \longrightarrow \text{Statistical Evidence}$$
- **Strict Epistemic State Segregation**: Every cell must explicitly separate `AUTHOR_REPORTED` (with table citation), `REPRODUCED_BY_TEAM` (grounded in local hardware & commit logs), and default `NOT_RUN / UNVERIFIED` `[SAFETY_BOUND]`. Never present hypotheses or `[TARGET]` numbers as achieved performance.
- **CRediT Attribution & Venue-Specific AI Disclosure**: Record authorship contributions via **CRediT (`ANSI/NISO Z39.104-2022`)** 14 roles (AI is strictly prohibited as an author across all venues `[FACT]`). Enforce isolated venue disclosure rules: **ACM 2026 (`2026-05-14`)** mandates detailed disclosure in Methods when generative AI generates research code/data/figures; **NeurIPS 2026** (per Main Track Handbook & Paper Checklist) requires disclosure when an LLM/AI agent is a core, novel, or non-standard methodological component, while routine coding assistance and grammar editing do NOT require core-methodology disclosure `[FACT]`.

### 4. Statistical Rigor, Anti-Pseudoreplication & Ethical Governance `[FACT]` `[DERIVATION]` `[SAFETY_BOUND]`
- **Experimental Unit & Anti-Pseudoreplication**: Multiple rendered frames from a single 3DGS scene or sequential video frames share reconstruction errors and camera trajectories and are **NOT independent statistical samples**. Treating $N=300$ frames as independent falsely deflates standard errors ($\text{SE} = s/\sqrt{N}$). Always aggregate metrics at the independent **Scene / Scan level** first and compute **95% Confidence Intervals via Paired Cluster Bootstrap ($B \ge 1,000$)** alongside absolute and standardized/non-parametric Effect Sizes `[DERIVATION]`.
- **Dual-Paradigm Dataset Split & Leakage Guardrails**: Distinguish **Per-Scene NVS** (`1-in-8` view-level split within the same physical scene, strictly withholding test views from Gaussian optimization, densification/pruning, and hyperparameter tuning) from **Cross-Scene Generalization** (strictly `Scene-disjoint / Scan-disjoint` split for detection/segmentation/retrieval) `[SAFETY_BOUND]`.
- **Symmetrical Hypotheses, No Mechanical Dogmas & Anti-HARKing**: Formulate minimal meaningful improvement hypotheses ($H_0: \Delta \le \Delta_{\min}$ vs. $H_1: \Delta > \Delta_{\min}$) or non-inferiority/equivalence/resource-efficiency hypotheses. Preserve the statistical invariant: **failure to reject $H_0$ is NOT proof of zero effect (*Absence of evidence is not evidence of absence*)** `[FACT]`. Reject arbitrary ungrounded fixed seed counts and single mechanical $p < 0.05$ cutoffs; apply Holm–Bonferroni or Benjamini–Hochberg correction for multiple testing; isolate Confirmatory Analysis from post-hoc Exploratory Observations (zero HARKing); and log all **Negative Results** and **Protocol Deviations** under real hardware budgets (e.g., `4 GB / 8 GB` laptop VRAM and capped cloud sessions) `[SAFETY_BOUND]`.
- **Data Redistribution & Human Subjects Ethics**: Enforce `Publicly Accessible != Redistributable` (publish split indices, SHA-256 checksums, and evaluation scripts rather than re-uploading EULA-restricted raw datasets). Under Taiwan's Human Subjects Research Act (Articles 5, 8, 12), classify studies via branching pathways (`Not Subject to Review` / `Exemption Determination` / `Expedited Review` / `Full Board Review`) and strictly distinguish **Exemption from Ethics Review**, **IRB Approval**, and **Informed Consent / Waiver** `[FACT]` `[SAFETY_BOUND]`.

---

## 3. Capstone Engineering & Research Traceability Matrix

A rigorous capstone-to-paper pipeline coordinates implementation, primary literature auditing, and statistical evaluation via CRediT-traceable roles rather than ad-hoc scripts:

| Core Engineering Dimension | Typical CRediT Scope | Key Technical Deliverables & Milestones |
| :--- | :--- | :--- |
| **Algorithmic Kernel & System Architecture** | `Methodology`, `Software`, `Visualization` | • Formalization of mathematical invariants, decoupled PyTorch **Paper Kernel**, and **System Carrier** integration<br>• Compute-budgeted execution on actual local (`4 GB / 8 GB VRAM`) and cloud quotas with `time.perf_counter()` telemetry<br>• Lead preparation of `Form C801 / C802 / C803` and reproducible training/evaluation harnesses |
| **Theory, Collision Audit & Co-Writing** | `Conceptualization`, `Formal analysis`, `Writing` | • Primary-source DOI/arXiv verification and 3D Nearest Prior Work collision matrix (`Task / Mechanism / Evaluation`)<br>• Loss/covariance derivations satisfying the **Representation Substitution Test**<br>• Bilingual manuscript drafting and explicit `Claim-to-Evidence` verification |
| **Data Governance, Statistics & QA** | `Data curation`, `Validation`, `Investigation` | • License & EULA auditing (`Publicly Accessible != Redistributable`), SHA-256 manifests, and leakage-free NVS vs. Scene-disjoint splits<br>• Scene-level **Paired Cluster Bootstrap** CI estimation, Holm–Bonferroni control, and Negative Result / Protocol Deviation logging |

---

## 4. Agent Invariants & Decision Protocols

### [RULE-903-01] Controlled Ablation Single-Factor Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: Empirical research and capstone contributions MUST conduct ablation studies adhering to strict single-variable control: exactly one component (e.g., loss term, normalization layer, preprocessing step) is altered per ablation run while holding random seeds (`seed=42 `[DESIGN_DECISION]``), batch sizes, and optimizer schedules constant.
- **Violation Consequence**: Concurrently modifying multiple hyperparameters obscures causal attribution and invalidates scientific claims.

### [RULE-903-02] Full Experimental Reproducibility & Artifact Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: Every empirical benchmark in the library MUST provide complete reproducibility artifacts: fixed random seeds, pinned library versions (`torch`, `cuda`, `cuDNN`), training scripts, and cryptographically verified checkpoint hashes (SHA-256 `[SAFETY_BOUND]`).
- **Violation Consequence**: Unverifiable benchmark assertions degrade scientific integrity and violate peer-reviewed research standards.

```python
def verify_reproducibility(metric_run1: float, metric_run2: float, tolerance: float = 1e-4) -> bool:
    assert abs(metric_run1 - metric_run2) < tolerance, "Reproducibility check failed: deterministic runs diverged!"
    return True
```

### [RULE-903-03] Quantitative Empirical Merit Metric Invariant
- **Contract Level**: `STRATEGIC_DIRECTIVE`
- **Specification**: Technical assertions MUST be supported by quantitative empirical metrics rather than qualitative statements. Evaluations MUST report triple-axis metrics: **Accuracy / Quality** (%, PSNR, mAP), **Parameter Footprint** (Params, MB), and **Inference Efficiency** (Latency in ms, FPS, TFLOPS).
- **Violation Consequence**: Qualitative claims without quantitative measurements lack engineering rigor and cannot support defensible system trade-offs.

### [RULE-903-04] Mathematical Formalization Integrity Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: Mathematical notation across the library MUST maintain formal integrity: tensor dimensions MUST be explicitly declared for every symbol, operator domains and ranges MUST be bounded, and engineering heuristics MUST NOT masquerade as mathematical theorems.
- **Violation Consequence**: Unsound pseudo-mathematical formalization misleads autonomous agents and damages the scientific authority of the knowledge base.

### [RULE-903-05] Claim-to-Evidence Traceability & Anti-Pseudoreplication Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: Every scientific claim in a manuscript or grant proposal MUST map across the six-tuple chain `Research Claim -> Experiment ID -> Dataset Split & Version -> Code Commit SHA -> Quantitative Result -> Statistical Evidence`, strictly segregating `AUTHOR_REPORTED`, `REPRODUCED_BY_TEAM`, and default `NOT_RUN / UNVERIFIED` states `[SAFETY_BOUND]`. In multi-view 3DGS or video evaluations, frames within the same physical scene MUST NOT be treated as independent statistical samples: metrics MUST be aggregated at the independent Scene/Scan level first and evaluated via Paired Cluster Bootstrap 95% confidence intervals `[DERIVATION]`, while strictly separating Confirmatory Analysis from post-hoc Exploratory Observations (zero HARKing), preserving Negative Results, and upholding that failure to reject $H_0$ is NOT proof of zero effect `[FACT]` `[SAFETY_BOUND]`.
- **Violation Consequence**: Frame-level pseudoreplication creates spurious statistical significance, unverified `AUTHOR_REPORTED` numbers corrupt baseline tables, and HARKing triggers rejection in top-tier peer review.

```python
def verify_claim_to_evidence_and_cluster_unit(
    claim_entry: dict, per_scene_deltas: list[float]
) -> dict:
    """Validate six-tuple claim traceability and scene-level statistical aggregation."""
    required = ("claim_id", "experiment_id", "dataset_split", "commit_sha", "source_tag")
    for k in required:
        assert claim_entry.get(k), f"Missing traceability field: {k}"
    assert claim_entry["source_tag"] in {
        "AUTHOR_REPORTED",
        "REPRODUCED_BY_TEAM",
        "NOT_RUN / UNVERIFIED",
    }, "Invalid source provenance tag"
    assert len(per_scene_deltas) >= 2, "Requires >= 2 independent scenes to avoid pseudoreplication"
    mean_delta = sum(per_scene_deltas) / len(per_scene_deltas)
    var = sum((d - mean_delta) ** 2 for d in per_scene_deltas) / (len(per_scene_deltas) - 1)
    se = (var / len(per_scene_deltas)) ** 0.5
    return {"mean_effect": mean_delta, "scene_level_se": se, "ci95_half_width": 1.96 * se}
```

### [RULE-903-06] Carrier-Kernel Decoupling & Research Disclosure Integrity Invariant
- **Contract Level**: `SAFETY_CRITICAL`
- **Specification**: Research repositories MUST decouple the interactive **System Carrier (`C`)** from the headless PyTorch **Paper Method Kernel (`P & N`)**, maintain honest `P` (pre-grant) vs. `N` (grant-period) attribution without forced sequential dependency, enforce `Publicly Accessible != Redistributable` for EULA-restricted datasets, branch IRB/REC screening properly under applicable human subjects laws (never conflating Exemption, IRB Approval, and Consent/Waiver), prohibit AI authorship, and comply with venue-specific generative AI disclosure policies (ACM 2026 vs. NeurIPS 2026 vs. IEEE/CVF) alongside `CRediT` contribution logs `[FACT]` `[DESIGN_DECISION]` `[SAFETY_BOUND]`.
- **Violation Consequence**: Coupled demo code blocks reproducible ablation sweeps, unauthorized dataset redistribution or human-subjects exemption misclassifications violate statutory compliance, and conflated AI disclosure policies risk desk rejection.

---

## 5. Canonical & Peer-Reviewed References

1. **National Science and Technology Council (NSTC)** (2024). *Operational Guidelines for NSTC Research Grants for University Students (Nov 1, 2024 Revision; Official Forms C801, C802, C803, C804; Point 16.4 >=6h Ethics Training)*.
2. **NISO & Center for Open Science** (2022). *ANSI/NISO Z39.104-2022 Contributor Roles Taxonomy (CRediT)* & *Transparency and Openness Promotion (TOP) Guidelines*.
3. **ACM (2026, rev. 2026-05-14) & NeurIPS (2026)**. *ACM Policy on Authorship* & *NeurIPS 2026 Main Track Handbook and Paper Checklist*; Taiwan *Human Subjects Research Act* (Articles 5, 8, 12).
4. **He, K., Zhang, X., Ren, S., & Sun, J.** (2016). "Deep Residual Learning for Image Recognition." *IEEE Conference on Computer Vision and Pattern Recognition (CVPR 2016)*, pp. 770–778. DOI: [10.1109/CVPR.2016.90](https://doi.org/10.1109/CVPR.2016.90).
5. **Radford, A., Kim, J. W., Hallacy, C., Ramesh, A., Goh, G., Agarwal, S., ... & Sutskever, I.** (2021). "Learning Transferable Visual Models From Natural Language Supervision." *International Conference on Machine Learning (ICML 2021)*, PMLR 139, pp. 8748–8763.
6. **Jaderberg, M., Simonyan, K., Zisserman, A., & Kavukcuoglu, K.** (2015). "Spatial Transformer Networks." *Advances in Neural Information Processing Systems (NeurIPS 2015)*, 28, 2017–2025.
