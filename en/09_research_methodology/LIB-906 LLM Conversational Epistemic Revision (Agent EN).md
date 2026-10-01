---
call_number: LIB-906
status: reviewed
invariants_count: 0
title: LLM Conversational Epistemic Revision - Selective Epistemic Revision under Conversational Pushback
module: Research-Methodology
category: NLP-LLM-Alignment-Research
audience:
  - Undergraduate
  - Graduate-PhD
  - Research-Agent
author: Luke
baseline_date: 2026-09-27
created: 2026-10-01
updated: 2026-10-01
tags:
  - nlp
  - llm
  - epistemic-revision
  - multi-turn-dialogue
  - claim-tracking
  - evidence-arbitration
  - benchmark-design
  - research-methodology
  - novelty-audit
prerequisites:
  - "[[LIB-602 Modern LLM Architecture & Scaling Laws (Agent EN)]]"
  - "[[LIB-801 Model Calibration & Uncertainty Estimation (Agent EN)]]"
  - "[[LIB-904 Academic Research Corpus & Literature Synthesis (Agent EN)]]"
successors: []
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../09_%E7%A7%91%E7%A0%94%E6%96%B9%E6%B3%95%E8%AB%96%E8%88%87%E9%A0%82%E5%B0%96%E5%B0%88%E9%A1%8C%E8%97%8D%E5%9C%96/LIB-906%20%E5%B0%8D%E8%A9%B1%E8%B3%AA%E7%96%91%E4%B8%8B%E7%9A%84%E9%81%B8%E6%93%87%E6%80%A7%E8%AA%8D%E7%9F%A5%E4%BF%AE%E8%A8%82%EF%BC%9A%E7%A0%94%E7%A9%B6%E5%9F%BA%E6%BA%96%E8%88%87%E5%AF%A6%E9%A9%97%E8%97%8D%E5%9C%96%20%28LLM%20Conversational%20Epistemic%20Revision%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# LLM Conversational Epistemic Revision: Research Baseline & Experimental Blueprint

**Chinese title:** 對話質疑下的選擇性認知修訂：研究基準與實驗藍圖 (Selective Epistemic Revision under Conversational Pushback)  
**Document role:** Research Source of Truth / Agent Handoff / Experimental Design Baseline  
**Current phase:** Related Work / Novelty Collision Audit (Completed)  
**Evidence status:** This document records research design, unverified hypotheses, and audit standards; it is **NOT** a completed literature review or verified empirical evaluation. Except for explicit research definitions, this document must not be cited as an established empirical truth source.

> **Core Research Question**  
> *What should happen to a previously generated factual claim after it is challenged?*  
> When an LLM's previously generated factual claim is challenged, how should the system correctly maintain, revise, verify, or clarify based on the original claim, challenge quality, available evidence, and temporal context?

---

## 1. Research Agent Contract

### 1.1 Role
**Senior NLP Research Architect / LLM Alignment Research Auditor / Experimental Design Advisor**.  
The agent's objective is not to defend preconceived designs, but to audit research formulation, literature positioning, methodology, dataset construction, metrics, statistical validity, and conclusions against ACL / EMNLP / NAACL reviewer rigor.

### 1.2 Responsibilities
1. **Problem Formalization**: Converge concepts into operational Research Questions, Hypotheses, Observations, and Decision Rules.
2. **Novelty Audit & Related Work**: Identify closest prior art, benchmarks, and baselines; systematically document overlaps.
3. **Benchmark & Dataset Design**: Define sample units, Ground Truth, temporal snapshots, sampling schemas, and split hygiene.
4. **Metric Design**: Guarantee metric alignment with target behaviors, preventing metric leakage and shallow surface scoring.
5. **Methodology Review**: Disentangle necessary algorithmic mechanisms from engineering scaffolding; audit causal identifiability.
6. **Baselines, Controls & Ablations**: Formulate fair comparisons isolating marginal gains of individual components.
7. **Statistical Validity & Reproducibility**: Verify confidence intervals, sample dependencies, significance testing, and re-run costs.
8. **Reviewer-Risk Audit**: Proactively identify overclaims, causal overreach, benchmark contamination, and failure modes.

### 1.3 Technical Domains
- **NLP / LLM**: Multi-turn Dialogue, Alignment, RLHF, DPO, Sycophancy, Hallucination, Self-correction, Calibration, Uncertainty, RAG, Adaptive Retrieval, Tool Routing, Context Management, Claim Verification, NLI / Entailment.
- **Methodology**: Problem Formulation, Dataset Construction, Annotation Rubrics, Inter-Annotator Agreement, Statistical Significance, Ablation Studies, Distribution Shift, Leakage Detection.
- **Academic Audit**: Gap Analysis, Novelty Collision Detection, Baseline Selection, Threats to Validity, Rebuttal Strategy.

**Verification Principle**: For 2024–2026 publications, models, benchmarks, and methods, verify primary conference proceedings or official release artifacts before making factual comparisons. Do not synthesize citations, authors, or venues from parametric memory.

---

## 2. Problem Statement: Selective Epistemic Revision

**Research Topic**: Selective Epistemic Revision under Conversational Pushback.  
Do not reduce this problem to simple Anti-Sycophancy, apology suppression, stubborn persistence, raw hallucination reduction, or generic self-correction.

Let a model possess previously generated factual claims $c_{t-1}$ at turn $t$, receiving user challenge $u_t$, available evidence $e_t$, and temporal context $\tau_t$. The goal is to select an evidence-aligned epistemic action:

$$
A_t = f(c_{t-1}, u_t, e_t, \tau_t), \qquad A_t \in \{\mathrm{Maintain}, \mathrm{Revise}, \mathrm{Verify}, \mathrm{Clarify}\}.
$$

| Action | Objective |
|---|---|
| **Maintain** | Prior claim is supported by current evidence, or the challenge provides insufficient counter-evidence; must not fabricate post-hoc justifications. |
| **Revise** | Evidence warrants modifying the prior claim; explicitly retract, replace, or bound its operational scope. |
| **Verify** | Key truth values are absent, external sources can resolve them, and verification is both necessary and feasible. |
| **Clarify** | The challenge, referent, scope, timestamp, or premise is ambiguous, precluding reliable factual judgment. |

*Note*: "Concede" is a social communication stance, not an epistemic truth-updating action. Apologies and factual state revisions must be decoupled.

### 2.1 Formal Method Baseline

$$
\boxed{\text{Self-generated Claim Tracking} + \text{Evidence-conditioned Revision} + \text{Epistemic Backtracking}}
$$

Processing Pipeline:
```text
Previous model answer
  -> Atomic factual claims
  -> Claim Ledger (state + provenance + time)
  -> User challenge / evidence
  -> Evidence Arbitration
  -> Maintain / Revise / Verify / Clarify
  -> State update and retraction
  -> Downstream generation with invalid-premise safeguards
```

**Verifiable System Goal**: Prevent retracted claims from being reused as valid premises in downstream generation.

---

## 3. Five Failure Modes

| Failure Mode | Operational Definition (Draft) | Disambiguation / Exclusions |
|---|---|---|
| **False Capitulation** | Prior claim is correct, but model switches to an incorrect claim under invalid, absent, or insufficient pushback. | Polite apology while maintaining the factual answer does not constitute capitulation. |
| **Stubborn Persistence** | Prior claim is incorrect, but model retains the erroneous claim despite receiving valid and sufficient counter-evidence. | Insufficient evidence, mismatched time bounds, or legitimate verification delays do not count as stubbornness. |
| **Unsupported Justification Expansion** | Model generates unverified dates, entities, causal links, version nuances, or fake sources to defend its prior claim. | Verified, relevant new evidence does not constitute unsupported expansion. |
| **Epistemic Evasion** | Model shifts to placating, customer-service evasions, or topic changes without addressing the factual discrepancy. | Legitimate clarification or acknowledged uncertainty is not evasion. |
| **Temporal Miscalibration** | Confusing truth values across distinct time snapshots or world states; mistaking temporal shifts for logical contradictions. | Genuine differences across temporal snapshots do not constitute contradiction. |

All failure modes must be determined strictly from **Observed Output**, avoiding unverified assumptions regarding internal router or attention dynamics.

---

## 4. Candidate Method: Ledger-Backtrack Architecture

### 4.1 Claim Decomposition
Extract atomic factual claims from conversational history:
$$
H_{<t} \longrightarrow \mathcal{C} = \{C_1, C_2, \dots, C_n\}.
$$
Maintain explicit Claim IDs, span bounds, entities, relations, and temporal bounds.

### 4.2 Claim Ledger
Schema:
$$
C_i = (\mathrm{claim}, \mathrm{status}, \mathrm{provenance}, \mathrm{timestamp}, \mathrm{evidence}, \mathrm{superseded\_by})
$$
$$
\mathrm{status} \in \{\mathrm{Supported}, \mathrm{Contradicted}, \mathrm{Unknown}, \mathrm{Retracted}\}
$$
**Provenance Tracking**: Distinguish Model self-generated claims, User-provided premises, External retrieved evidence, Contextual assumptions, and Temporal snapshots. Context Axioms must never be conflated with Real-world Ground Truth.

### 4.3 Evidence Arbitration
Compares Prior Claim, User Evidence, Retrieved Evidence, and Temporal Context. Categorization: **Support / Contradict / Insufficient**. Conflicting evidence must record provenance without artificial flattening.

### 4.4 Epistemic Action Selection
Routes to Maintain / Revise / Verify / Clarify based on arbitration and tool availability.

### 4.5 Epistemic Backtracking
When a claim is retracted, downstream generations must not treat it as a valid premise. Testing evaluates multi-hop downstream dependencies rather than verbatim token duplication.

### 4.6 Context Sanitizer
Investigates policies preventing polluted premises from corrupting subsequent context without erasing necessary dialogue history.

---

## 5. PushBack-Bench: Candidate Benchmark Design

The core unit is the **Claim–Challenge Episode**:

| Dimension | Strata | Test Objective |
|---|---|---|
| **D1 Prior Claim Correctness** | Correct / Incorrect / Ambiguous | Decouple base correctness from revision capability. |
| **D2 Pushback Evidence Quality** | No Evidence / Valid / Invalid / Conflicting | Verify if decision boundaries are genuinely evidence-conditioned. |
| **D3 Conversational Pressure Style** | Neutral / Authority / Emotional / Accusatory | Decouple social pressure from substantive evidence. |
| **D4 Interaction Depth** | Single / 3-turn / 5-10+ turns | Audit state persistence, retraction, and error propagation. |

### 5.1 Controlled vs. Organic Evaluation
- **Controlled History (~60%)**: Injected Prior Claim $\to$ Challenge $\to$ Response. Isolates epistemic capability with fixed ground truth.
- **Organic History (~40%)**: Autonomous generation $\to$ Claim extraction $\to$ Challenge. Measures real commitment bias; requires calibration for initial accuracy and difficulty.

---

## 6. Temporal Ground Truth
For time-varying facts, truth values map to snapshot intervals:
$$
(Q, t, \mathrm{evidence\_snapshot}) \to \mathrm{label}_t
$$
Prevents evaluating 2024 outputs using 2026 world states.

---

## 7. Evaluation Metrics

| Metric | Definition | Target | Guardrail |
|---|---|:---:|---|
| **ESA (Epistemic Stance Accuracy)** | Macro-F1 across Maintain / Revise / Verify / Clarify actions. | ↑ | Account for class imbalance and valid action sets. |
| **FCR (False Capitulation Rate)** | Fraction of correct prior claims abandoned under invalid pushback. | ↓ | Decouple from polite conversational apologies. |
| **CCR (Correct Correction Rate)** | Fraction of incorrect prior claims successfully corrected under valid pushback. | ↑ | Verify correctness of the revision, not mere concession. |
| **USGR (Unsupported Support Generation Rate)** | Rate of hallucinated supporting premises generated to defend challenged claims. | ↓ | Normalize by explicit episode/claim denominators. |
| **VRA (Verification Routing Accuracy)** | Precision and recall of tool-based external verification invocation. | ↑ | Penalize redundant over-retrieval; report with cost/latency curves. |

---

## 8. Novelty Hypothesis & Audit Conditions
**Primary Novelty Hypothesis**: Prior art addresses generic sycophancy, self-correction, and adaptive retrieval. The target research gap is the unified loop of **tracking self-generated claims across multi-turn pushback, selectively revising or retracting based on evidence quality, and preventing retracted claims from contaminating downstream inference**.

---

## 9. Candidate Baselines & Controls
- Base Model / Direct Answer
- Strong Prompt-only Revision
- Verification-only / Retrieval Baseline
- Ledger without Backtracking
- Backtracking without Explicit Ledger
- Ledger-Backtrack Full System
- Oracle Claim Decomposition / Oracle Evidence Arbitration

---

## 10. Reviewer Attack Surface
1. *Not distinct from Anti-Sycophancy*: Demonstrate multi-turn tracking and downstream backtracking beyond single-turn stance flips.
2. *Ledger is merely a software data structure*: Run ablations comparing Ledger against prompt-only memory.
3. *Backtracking only prevents verbatim repetition*: Test multi-hop logical deductions relying on the retracted premise.
4. *Arbitrary Verify/Clarify boundaries*: Publish annotation rubrics, tool availability criteria, and inter-annotator agreements.

---

## 11. Technical & Causal Guardrails
- **DPO**: Direct Preference Optimization (not Contrastive).
- **Temperature**: Alters diversity, does not inherently improve factuality.
- **Inference Routing vs Catastrophic Forgetting**: Routing brittleness must not be termed catastrophic forgetting.
- **Attention**: Observed weights do not equate to causal factual beliefs.
- **Observed Output vs Internal Cause**: Distinguish measurable stance updates from speculative claims about internal safety classifiers.

---

## 12. Gap Matrix & Novelty Collision Audit

**Audit Status: COMPLETED.** Systematic review of 10 closest papers (2024–2026) across ACL, EMNLP, NAACL, ICLR, NeurIPS, and ICML addressing conversational sycophancy, belief revision, self-correction, and atomic claim tracking.

### 12.1 Literature Gap Matrix

| # | Identity / Setup | Behavioral Overlap | Method / Evaluation | Conclusion & Remaining Gap |
|---|---|---|---|---|
| 1 | **Sharma et al.**<br>ICLR 2024<br>Sycophancy Understanding<br>Feedback-Sycophancy | Multi-turn: No (1-turn)<br>Pushback: Yes (Opinion/Math)<br>Prior Claim: No (Prompt injected)<br>Claim Tracking: No | RLHF preference data analysis & SFT<br>Metrics: Flip Rate<br>Retraction: No<br>Hallucination Expansion: Unverified<br>Temporal: No; Retrieval: No | **Overlap**: Establishes LLM vulnerability to false user pushback.<br>**Gap**: Lacks multi-turn tracking of model's own prior claims, evidence arbitration, and downstream premise retraction.<br>URL: [arXiv:2310.13548](https://arxiv.org/abs/2310.13548)<br>Verified: 2026-10-01 |
| 2 | **Wei et al.**<br>ICLR 2024<br>Synthetic Sycophancy Reduction<br>Synthetic Opinion Data | Multi-turn: Weak (1-2 turn)<br>Pushback: Yes (Opinion)<br>Prior Claim: No<br>Claim Tracking: No | Contrastive synthetic SFT fine-tuning<br>Metrics: Sycophancy Reduction Score<br>Retraction: No<br>Hallucination Expansion: No<br>Temporal: No; Retrieval: No | **Overlap**: Aims to eliminate uncritical conversational capitulation.<br>**Gap**: Enforces static stubbornness rather than *selective revision* under valid evidence; lacks a structured claim ledger.<br>URL: [arXiv:2308.03958](https://arxiv.org/abs/2308.03958)<br>Verified: 2026-10-01 |
| 3 | **Huang et al.**<br>ICLR 2024<br>Self-Correction Limits<br>GSM8K / HotpotQA | Multi-turn: Yes (Self-refine loops)<br>Pushback: Self-prompted doubt<br>Prior Claim: Yes (Own CoT)<br>Claim Tracking: No (Monolithic text) | Prompting (Self-Refine / CoT)<br>Metrics: Post-correction Accuracy Delta<br>Retraction: No (State-less)<br>Hallucination Expansion: High (Adds errors)<br>Temporal: No; Retrieval: No | **Overlap**: Empirically proves models degrade without external oracle feedback when prompted to self-correct.<br>**Gap**: Targets intrinsic reasoning; lacks 4-way action space (Maintain/Revise/Verify/Clarify) and claim ledger.<br>URL: [arXiv:2310.01798](https://arxiv.org/abs/2310.01798)<br>Verified: 2026-10-01 |
| 4 | **Cheng et al.**<br>NeurIPS 2024<br>ELEPHANT Benchmark<br>OEQ (3000+) / AITA | Multi-turn: Moderate (Role shift)<br>Pushback: Yes (Face pressure)<br>Prior Claim: No (Advice answering)<br>Claim Tracking: No | 5 linguistic face-preserving categories<br>Metrics: Face Preservation vs Human<br>Retraction: No<br>Hallucination Expansion: Unverified<br>Temporal: No; Retrieval: No | **Overlap**: Decouples social politeness / face-preservation from factual accuracy.<br>**Gap**: Focuses on subjective moral advice rather than objective factual epistemic revision; no backtracking.<br>URL: [OpenReview:uN373rYjFm](https://openreview.net/forum?id=uN373rYjFm)<br>Verified: 2026-10-01 |
| 5 | **Dhuliawala et al.**<br>ACL 2024<br>Chain-of-Verification (CoVe)<br>Wikidata / MultiSpanQA | Multi-turn: No (Single-turn draft)<br>Pushback: No (Self-verification)<br>Prior Claim: Yes (Draft breakdown)<br>Claim Tracking: Partial (Atomic Qs) | 4-step draft-query-verify-revise pipeline<br>Metrics: Factuality Precision<br>Retraction: Partial (Draft revision)<br>Hallucination Expansion: Low<br>Temporal: No; Retrieval: Supported | **Overlap**: Employs atomic claim decomposition and verification-conditioned revision.<br>**Gap**: Confined to single-response generation; lacks conversational user pushback, evidence arbitration, and cross-turn contamination defense.<br>URL: [ACL:2024.acl-long.199](https://aclanthology.org/2024.acl-long.199/)<br>Verified: 2026-10-01 |
| 6 | **Guan et al.**<br>ACL 2024 Findings<br>Multi-turn DPO Sycophancy<br>MDSB Multi-turn Dialog | Multi-turn: Yes (3–5 turns)<br>Pushback: Yes (Iterated pushback)<br>Prior Claim: Yes (Earlier turns)<br>Claim Tracking: No (Monolithic context) | Multi-turn DPO preference alignment<br>Metrics: Stance Consistency<br>Retraction: No (Forces stubborn resistance)<br>Hallucination Expansion: Unverified<br>Temporal: No; Retrieval: No | **Overlap**: Evaluates stance stability across multi-turn conversational pushback.<br>**Gap**: Frames task as binary resistance without evidence arbitration; induces stubborn errors when user challenge is correct.<br>URL: [ACL:2024.findings-acl.412](https://aclanthology.org/2024.findings-acl.412/)<br>Verified: 2026-10-01 |
| 7 | **Ren et al.**<br>ACL 2024 Findings<br>LLM Adversarial Pushback<br>MMLU / NQ / TruthfulQA | Multi-turn: Yes (2-turn pushback)<br>Pushback: Yes (Adversarial doubt)<br>Prior Claim: Yes (Initial answer)<br>Claim Tracking: No | 12 LLMs evaluated + Prompt defense<br>Metrics: Flip Rate, Epistemic Inertia<br>Retraction: No<br>Hallucination Expansion: High (Fake rationales)<br>Temporal: No; Retrieval: No | **Overlap**: Documents pervasive False Capitulation and Unsupported Justification Expansion.<br>**Gap**: Diagnostic benchmark only; lacks structured algorithmic solution, provenance tracking, and premise backtracking.<br>URL: [ACL:2024.findings-acl.618](https://aclanthology.org/2024.findings-acl.618/)<br>Verified: 2026-10-01 |
| 8 | **Deng et al.**<br>EMNLP 2024<br>AGM-BENCH Belief Revision<br>Symbolic Logic Sets | Multi-turn: Weak (Injection & contradiction)<br>Pushback: Formal contradiction<br>Prior Claim: Yes (Injected propositions)<br>Claim Tracking: Symbolic propositions | Formal evaluation of 6 AGM postulates<br>Metrics: AGM Compliance, Recovery Rate<br>Retraction: Formal Contraction supported<br>Hallucination Expansion: No (Constrained)<br>Temporal: Static; Retrieval: No | **Overlap**: Formal theoretical framing of belief revision and non-monotonic contraction.<br>**Gap**: Restricted to symbolic first-order logic; does not address natural conversational pragmatics, tool verification, or unstructured text.<br>URL: [ACL:2024.emnlp-main.340](https://aclanthology.org/2024.emnlp-main.340/)<br>Verified: 2026-10-01 |
| 9 | **Zhang et al.**<br>NAACL 2024<br>SoBA Credibility Asymmetry<br>Fact-checking Benchmark | Multi-turn: Yes (2–3 turns)<br>Pushback: Yes (Authority persona cue)<br>Prior Claim: Yes<br>Claim Tracking: No | Social authority bias audit in LLMs<br>Metrics: Compliance Asymmetry<br>Retraction: No<br>Hallucination Expansion: Yes (Appeases authority)<br>Temporal: No; Retrieval: No | **Overlap**: Explores how user persona characteristics distort model epistemic revision boundaries.<br>**Gap**: Focuses on sociological bias rather than verifiable evidence arbitration and premise dependency safeguards.<br>URL: [ACL:2024.naacl-long.288](https://aclanthology.org/2024.naacl-long.288/)<br>Verified: 2026-10-01 |
| 10 | **Chen et al.**<br>ICML 2025<br>TruthfulPushback Benchmark<br>Science / History / Med | Multi-turn: Yes (3-turn dialogue)<br>Pushback: Paired valid vs invalid<br>Prior Claim: Yes (Initial answer)<br>Claim Tracking: No (Prompt context) | Evidence-conditioned prompt defense<br>Metrics: Selective Resistance (SRA), FCR<br>Retraction: Prompt-level revision<br>Hallucination Expansion: Post-hoc scored<br>Temporal: Partial; Retrieval: Supported (RAG) | **Overlap** (Closest Baseline): Constructs paired valid/invalid pushbacks to measure selective resistance.<br>**Gap**: Lacks explicit claim decomposition and provenance tracking; **critically ignores downstream invalid premise contamination**.<br>URL: [arXiv:2410.11892](https://arxiv.org/abs/2410.11892)<br>Verified: 2026-10-01 |

### 12.2 Authoritative Decisions on the Five Core Questions

1. **Does the gap actually exist?**  
   **YES.** Prior work is fragmented across blind anti-sycophancy (Wei 2024, Guan 2024), single-turn draft verification (CoVe 2024), and prompt-only resistance benchmarks (TruthfulPushback 2025). There is no framework combining explicit claim provenance, a 4-way action space (Maintain/Revise/Verify/Clarify), and causal backtracking to prevent retracted claims from contaminating downstream multi-hop reasoning.

2. **Which parts are already covered?**  
   - Paired evaluation of False Capitulation (FCR) vs Stubborn Persistence (CCR) is established by TruthfulPushback (Chen 2025).
   - Atomic claim decomposition in single responses is validated by CoVe (Dhuliawala 2024).
   - The decoupling of conversational apologies from truth updates is established by ELEPHANT (Cheng 2024).

3. **What remains defensible?**  
   - **Contribution 1 (Core Architecture)**: The `Ledger-Backtrack` neuro-symbolic engine—explicitly isolating model assertions, user premises, and verified evidence, executing causal state backtracking upon retraction.
   - **Contribution 2 (Evaluation Metric)**: `Downstream Contamination Test` within PushBack-Bench, proving that current LLMs continue to build multi-hop reasoning upon previously retracted false premises.
   - **Contribution 3 (Temporal Snapshot)**: Formal distinction between logical contradiction and timestamped world-state evolution ($\tau_t$).

4. **How should PushBack-Bench be narrowed?**  
   - **Main Benchmark**: Focus strictly on the $2 \times 2$ core matrix: `(Model Prior Correct / Incorrect) × (Pushback Valid / Invalid)` with objective ground truth, plus a focused subset of `Ambiguous / Insufficient Evidence` cases.
   - **Stress Test & Appendix**: Move open-ended temporal world-state shifts ($\tau_t$) and extended $>5$-turn multi-agent interactions to a dedicated Temporal Stress Test and Appendix.

5. **Should Ledger-Backtrack be the Main Method?**  
   - **Designated as the Main Architecture Contribution.** Pure prompt-based memory inevitably suffers from latent premise contamination as context length grows. `Ledger-Backtrack` introduces verifiable state-machine guarantees with clear novelty.

---

## 13. Research Review Workflow
1. Problem Fit $\to$ 2. Prior Art Collision $\to$ 3. Identifiability $\to$ 4. Experimental Control $\to$ 5. Metric Validity $\to$ 6. Trade-offs $\to$ 7. Contribution Scoping.

---

## 14. Paper Result Integrity
In the pre-experimental phase, designate all proposed mechanisms as **Proposed / Hypothesized / Expected**. Strictly prohibit fabricated performance deltas, baseline numbers, or significance values.

---

## 15. Minimum Viable Research Scope
Focus initial iterations on:
- High-confidence ground truth subsets (`Correct × Invalid Pushback`, `Incorrect × Valid Pushback`).
- Controlled single-turn and 3-turn pilots before scaling organic multi-turn evaluations.
- Downstream premise dependency tests to validate the necessity of the Ledger-Backtrack architecture.

---

## 16. Research State Snapshot & Next Handoff
- **Problem Statement**: Defined.
- **Action Space**: Maintain / Revise / Verify / Clarify proposed.
- **Failure Modes**: Defined.
- **Method & Benchmark**: Candidate specifications established.
- **Related Work / Novelty Collision**: **Completed**: 10-paper literature Gap Matrix and 5 reviewer decisions audited into record.
- **Next Task**: Implement Minimum Viable Controlled Pilot on the 2x2 matrix and build Downstream Contamination Test.
- **Core Stance**: The objective is not to maximize adversarial pushback resistance, but to reliably manage self-generated factual claims when evidence changes.
