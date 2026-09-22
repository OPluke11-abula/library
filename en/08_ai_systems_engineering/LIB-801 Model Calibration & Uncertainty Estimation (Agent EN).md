---
call_number: LIB-801
title: Model Calibration, Uncertainty Estimation & Overconfidence (Agent Edition)
module: Systems-Reliability
category: Engineering-Core
audience:
  - Autonomous-Agent
  - Senior-ML-Engineer
  - Reliability-Architect
status: Verified-Authoritative-Production
math_foundations:
  - Expected Calibration Error (ECE) & Reliability Diagrams
  - Maximum Calibration Error (MCE)
  - Temperature Scaling Optimization via Negative Log-Likelihood (NLL)
hardware_target:
  - Mission-Critical Autonomous Inference Nodes
invariants_count: 4
created: 2026-09-17
author: Luke (Chi-Yang Yu) & AI Research Agent (Antigravity)
prerequisites:
  - "[[LIB-001 Deep Learning First Principles (Agent EN)]]"
  - "[[LIB-104 Convex Optimization & Gradient Descent (Agent EN)]]"
successors:
  - "[[LIB-704 Dual-Process Neural Agent S1-Jev & Reflex CUA-S1 (Agent EN)]]"
  - "[[LIB-802 Quantization Mathematics & Low-Precision Inference (Agent EN)]]"
tags:
  - calibration
  - ece
  - temperature-scaling
  - uncertainty-estimation
  - reliability
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
- Top-1 prediction remains unchanged ($\arg\max z_i = \arg\max z_i / T$), preserving top-1 accuracy.
Parameter $T^*$ is optimized on a validation set by minimizing Negative Log-Likelihood (NLL):
$$T^* = \arg\min_T -\sum_{i=1}^N \log \left( \frac{e^{z_{i, y_i} / T}}{\sum_j e^{z_{i, j} / T}} \right)$$

---

## 3. Production PyTorch Temperature Scaler

```python
import torch
import torch.nn as nn
import torch.optim as optim

class TemperatureScaler(nn.Module):
    """
    Optimizes a single temperature parameter T > 0 on validation set.
    Guarantees monotonic ECE reduction without degrading top-1 accuracy.
    """
    def __init__(self):
        super().__init__()
        self.temperature = nn.Parameter(torch.ones(1) * 1.5)

    def forward(self, logits: torch.Tensor) -> torch.Tensor:
        # Scale logits: [B, K] -> [B, K]
        return logits / self.temperature

    def fit(self, val_logits: torch.Tensor, val_labels: torch.Tensor, max_iter: int = 50):
        nll_criterion = nn.CrossEntropyLoss()
        optimizer = optim.LBFGS([self.temperature], lr=0.01, max_iter=max_iter)

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

- `INV-801-01 (Mandatory ECE Evaluation)`: Any classification model emitted to production MUST report its ECE alongside Top-1 Accuracy. Models with $\text{ECE} > 0.05$ (5%) MUST undergo post-hoc calibration.
- `INV-801-02 (Separation of Calibration Dataset)`: Optimization of temperature $T$ MUST be performed on a held-out validation set and NEVER on the training set (prevents overfitting to overconfident training logits).
- `INV-801-03 (Uncertainty Fallback)`: When calibrated confidence $\hat{p} < 0.70$ on safety-critical tasks, the decision MUST be halted and routed to human review or S2 deliberate verification.
