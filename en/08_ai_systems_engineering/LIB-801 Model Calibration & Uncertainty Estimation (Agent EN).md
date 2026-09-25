---
call_number: LIB-801
status: source-verified
invariants_count: 3
title: Model Calibration, Uncertainty Estimation & Overconfidence (Agent Edition)
module: Systems-Reliability
category: Engineering-Core
audience:
  - Autonomous-Agent
  - Senior-ML-Engineer
  - Reliability-Architect
math_foundations:
  - Expected Calibration Error (ECE) & Reliability Diagrams
  - Maximum Calibration Error (MCE)
  - Temperature Scaling Optimization via Negative Log-Likelihood (NLL)
hardware_target:
  - Mission-Critical Autonomous Inference Nodes
created: 2026-09-17
author: Luke
tags:
  - calibration
  - ece
  - temperature-scaling
  - uncertainty-estimation
  - reliability
prerequisites:
  - "[[LIB-104 Convex Optimization & Gradient Descent (Agent EN)]]"
  - "[[LIB-301 Dataset Bias, Domain Shift & Spatial Penalties (Agent EN)]]"
successors:
  - "[[LIB-704 Dual-Process Neural Agent S1-Jev & Reflex CUA-S1 (Agent EN)]]"
  - "[[LIB-802 Quantization Mathematics & Low-Precision Inference (Agent EN)]]"
  - "[[LIB-901 Classic Project Post-Mortem - Production MNIST (Agent EN)]]"
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../08_AI%E7%B3%BB%E7%B5%B1%E5%B7%A5%E7%A8%8B%E8%88%87%E9%AB%98%E6%95%88%E9%83%A8%E7%BD%B2/LIB-801%20%E7%8F%BE%E4%BB%A3%E6%B7%B1%E5%BA%A6%E5%AD%B8%E7%BF%92%E4%B9%8B%E6%A8%A1%E5%9E%8B%E6%A0%A1%E6%BA%96%E3%80%81%E4%B8%8D%E7%A2%BA%E5%AE%9A%E6%80%A7%E4%BC%B0%E8%A8%88%E8%88%87%E9%81%8E%E5%BA%A6%E8%87%AA%E4%BF%A1%20%28Model%20Calibration%20%26%20Uncertainty%20Estimation%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Model Calibration, Uncertainty Estimation & Overconfidence in Deep Learning

## 1. Conceptual Mental Model

In high-stakes mission-critical systems (medical imaging, autonomous driving, financial transactions, AI agents), a model must not only be accurate—it must **know when it does not know**. Modern deep neural networks (ResNets, Transformers) exhibit a pathological flaw: they achieve high classification accuracy while suffering from extreme **overconfidence** (e.g., predicting an out-of-distribution input with $99.9\%$ confidence). Model calibration aligns predicted probabilities with true empirical correctness frequencies.

---

## 2. Mathematical Formalization

### 1. Definition of Perfect Calibration
A classifier $\hat{y} = \arg\max_k f_k(x)$ with confidence $\hat{p} = \max_k f_k(x)$ is **perfectly calibrated** if:
$$\mathbb{P}(\hat{y} = y \mid \hat{p} = p) = p, \quad \forall p \in [0, 1]$$
If a model outputs a probability of $0.80$ across 100 samples, exactly 80 of those samples MUST be correct.

### 2. Expected Calibration Error (ECE)
To measure calibration empirically, predicted confidences are partitioned into $M$ equally-spaced bins $B_m = (\frac{m-1}{M}, \frac{m}{M}]$:
- **Accuracy within Bin $B_m$**:
  $$\text{acc}(B_m) = \frac{1}{|B_m|} \sum_{i \in B_m} \mathbb{I}(\hat{y}_i = y_i)$$
- **Confidence within Bin $B_m$**:
  $$\text{conf}(B_m) = \frac{1}{|B_m|} \sum_{i \in B_m} \hat{p}_i$$
The Expected Calibration Error (ECE) is the weighted average gap:
$$\text{ECE} = \sum_{m=1}^M \frac{|B_m|}{N} \left| \text{acc}(B_m) - \text{conf}(B_m) \right|$$

### 3. Temperature Scaling Post-Hoc Calibration (Guo et al., 2017)
Temperature Scaling introduces a single scalar parameter $T > 0$ applied to raw logits $z$:
$$\hat{p}_i = \frac{e^{z_i / T}}{\sum_{j=1}^K e^{z_j / T}}$$
- If $T > 1$: Softens logit distribution, deflating overconfident probabilities toward uniform.
- Top-1 prediction rank ordering remains unchanged ($\arg\max z_i = \arg\max z_i / T$), preserving top-1 accuracy.
- In empirical evaluations (Guo et al., 2017), Temperature Scaling can substantially improve calibration, but the magnitude of improvement depends on the model, dataset, validation distribution, and ECE binning configuration.
Parameter $T^*$ is optimized on a validation set by minimizing Negative Log-Likelihood (NLL):
$$T^* = \arg\min_T -\sum_{i=1}^N \log \left( \frac{e^{z_{i, y_i} / T}}{\sum_j e^{z_{i, j} / T}} \right)$$


### 4. Conformal Prediction & Marginal Coverage (Angelopoulos & Bates, 2023)
While temperature scaling is heuristic, **Conformal Prediction** provides finite-sample distribution-free guarantees. Under the foundational assumption that calibration and test data are **exchangeable** (where i.i.d. is a common sufficient condition), given user-specified error rate $\alpha \in (0, 1)$, it constructs prediction sets $\mathcal{C}(X_{\text{test}}) \subseteq \{1, \dots, K\}$ satisfying:
$$\mathbb{P}\left(Y_{\text{test}} \in \mathcal{C}(X_{\text{test}})\right) \ge 1 - \alpha$$
**Statistical semantics**: This is a **marginal coverage guarantee** over the joint randomness of calibration and test data draws, not a conditional guarantee for any specific test sample or realization. Standard marginal coverage does not hold under arbitrary distribution shift; extensions such as Weighted Conformal Prediction require specific structural assumptions (such as covariate shift with known or estimable likelihood ratios) rather than repairing arbitrary domain drift.

### 5. Frontiers in Calibrated Alignment: RLCD (Reinforcement Learning for Calibrated Decisions)
Conventional preference alignment (e.g., RLHF) optimizes scalar rewards, which can sharpen policy distributions (entropy collapse) and induce severe overconfidence.
Recent research initiatives (e.g., Jev, see [[LIB-704 Dual-Process Neural Agent S1-Jev & Reflex CUA-S1 (Agent EN)]]) investigate **RLCD**:
- **Publicly Documented Statement [FACT]**: TypeSafe AI publicly describes RLCD (Reinforcement Learning for Calibrated Decisions) as a training approach intended to produce calibrated decisions / probabilities for Jev.
- **Undisclosed Implementation Details [OPEN_QUESTION]**: The exact reward function, scoring rule, calibration objective, loss formulation, and policy-gradient implementation have not been publicly disclosed in the cited official material; jointly optimizing discrete, non-smooth binned ECE within end-to-end policy gradients remains an open research challenge.
---

## 3. Production PyTorch Temperature Scaler

```python
import torch
import torch.nn as nn
import torch.optim as optim

class TemperatureScaler(nn.Module):
    """
    Optimizes temperature parameter T on a validation set via NLL minimization.
    Mathematical requirement: T > 0 strictly preserves top-1 logit rank ordering.
    Project heuristic bound: T in [0.1, 5.0] [HEURISTIC / BOUNDARY_GUARD] prevents degenerate calibration.
    Mathematically enforced via sigmoid reparameterization: T = 0.1 + 4.9 * torch.sigmoid(raw_temperature).
    Initial raw_temperature = -0.9163 yields T ≈ 1.5.
    """
    def __init__(self):
        super().__init__()
        # raw_temperature = log((1.5 - 0.1) / (5.0 - 1.5)) = log(1.4 / 3.5) = log(0.4) ≈ -0.9163
        self.raw_temperature = nn.Parameter(torch.tensor([-0.9163]))

    @property
    def temperature(self) -> torch.Tensor:
        return 0.1 + 4.9 * torch.sigmoid(self.raw_temperature)

    def forward(self, logits: torch.Tensor) -> torch.Tensor:
        # Scale logits: [B, K] -> [B, K]
        return logits / self.temperature

    def fit(self, val_logits: torch.Tensor, val_labels: torch.Tensor, max_iter: int = 50):
        nll_criterion = nn.CrossEntropyLoss()
        optimizer = optim.LBFGS([self.raw_temperature], lr=0.01, max_iter=max_iter)

        def eval_loss():
            optimizer.zero_grad()
            scaled_logits = self.forward(val_logits)
            loss = nll_criterion(scaled_logits, val_labels)
            loss.backward()
            return loss

        optimizer.step(eval_loss)
        return float(self.temperature.item())
```

---

## 4. Agent Invariants & Decision Protocols

### [RULE-801-01] Expected Calibration Error (ECE) Release Gate
- **Contract Level**: `QUALITY_BOUND`
- **Specification**: Classification models submitted for production release MUST report Expected Calibration Error (ECE) across a minimum of 15 bins alongside Top-1 Accuracy. Models exhibiting $\text{ECE} > 0.05$ (5%) MUST undergo post-hoc temperature scaling or conformal calibration [DESIGN_DECISION / TARGET].
- **Violation Consequence**: Uncalibrated models produce severe overconfidence on ambiguous edge-case inputs, creating critical reliability risks in automated decision systems.

### [RULE-801-02] Temperature Scaling Parameter Range Guardrail
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: When optimizing temperature parameter $T$ via negative log-likelihood (NLL) minimization on a held-out validation set, $T$ MUST be strictly positive ($T > 0$) as a mathematical requirement to preserve logit rank ordering and strictly monotonic Softmax mapping. The bounded range $T \in [0.1, 5.0]$ is an engineering heuristic [HEURISTIC / BOUNDARY_GUARD] enforced via bounded sigmoid parameterization ($T = 0.1 + 4.9 \cdot \sigma(\theta)$) to prevent numerical instability or probability collapse. Note: NLL minimization optimizes continuous likelihood, which empirically reduces calibration error but does NOT mathematically guarantee monotonic reduction of discrete binned ECE due to non-smooth bin boundary partitioning.
- **Violation Consequence**: Setting $T \le 0$ violates mathematical monotonicity and inverts top-1 predictions; unconstrained $T \gg 5$ collapses predictive distributions toward uniform entropy.

### [RULE-801-03] Conformal Prediction Distribution-Free Coverage Guarantee
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: In high-stakes safety-critical deployments, point predictions MUST be complemented by split conformal prediction sets $\mathcal{C}(X) \subseteq \{1, \dots, K\}$ guaranteeing statistical marginal coverage $\mathbb{P}(Y_{\text{test}} \in \mathcal{C}(X_{\text{test}})) \ge 1 - \alpha$ under the foundational assumption of **data exchangeability** (where i.i.d. is a common sufficient condition) between calibration and test distributions. Note: The guarantee is marginal over joint draws, not conditional on an individual test instance. Standard marginal coverage does NOT hold under arbitrary out-of-distribution shift without explicit domain-shift or covariate-shift weighting adjustments based on verifiable likelihood ratios.
- **Violation Consequence**: Relying on uncalibrated point predictions or assuming coverage under uncorrected distribution shifts provides false statistical confidence guarantees.

