---
call_number: LIB-102
status: source-verified
invariants_count: 3
title: Probability, Information Theory & Variational Inference (Agent Edition)
module: Mathematical-Foundations
category: Information-Theory-Probabilistic-ML
audience:
  - Autonomous-Agent
  - Graduate-PhD
  - Senior-ML-Engineer
math_foundations:
  - Measure-Theoretic Probability & Maximum Likelihood Estimation
  - Shannon Entropy, Kullback-Leibler Divergence & Cross-Entropy
  - Fisher Information Metric & Natural Gradient Geometry
  - Evidence Lower Bound (ELBO) & Reparameterization Trick
hardware_target:
  - NVIDIA Tensor Cores & Special Function Units (SFU)
  - High-Bandwidth Memory (HBM) Online Reduction Kernels
created: 2026-10-17
author: Luke
tags:
  - probability-theory
  - information-theory
  - variational-inference
  - shannon-entropy
  - kl-divergence
  - elbo
  - fisher-information
prerequisites:
  - "[[LIB-001 Deep Learning First Principles (Agent EN)]]"
  - "[[LIB-101 Linear Algebra & High-Dimensional Geometry (Agent EN)]]"
successors:
  - "[[LIB-104 Convex Optimization & Gradient Descent (Agent EN)]]"
  - "[[LIB-301 Dataset Bias, Domain Shift & Spatial Penalties (Agent EN)]]"
  - "[[LIB-406 Generative Frontiers - SDE Diffusion to Flow Matching (Agent EN)]]"
  - "[[LIB-602 Modern LLM Architecture & Scaling Laws (Agent EN)]]"
  - "[[LIB-801 Model Calibration & Uncertainty Estimation (Agent EN)]]"
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../01_%E6%95%B8%E5%AD%B8%E8%88%87%E7%90%86%E8%AB%96%E5%9F%BA%E7%9F%B3/LIB-102%20%E6%A9%9F%E7%8E%87%E7%B5%B1%E8%A8%88%E3%80%81%E8%B3%87%E8%A8%8A%E7%90%86%E8%AB%96%E8%88%87%E8%AE%8A%E5%88%86%E6%8E%A8%E8%AB%96%E5%9F%BA%E7%9F%B3%20%28Probability,%20Information%20Theory%20%26%20Variational%20Inference%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Probability, Information Theory & Variational Inference

## Conceptual Coordinates & Topological Navigation
- **Prerequisites**: [[LIB-001 Deep Learning First Principles (Agent EN)]], [[LIB-101 Linear Algebra & High-Dimensional Geometry (Agent EN)]].
- **Successors**: [[LIB-104 Convex Optimization & Gradient Descent (Agent EN)]], [[LIB-301 Dataset Bias, Domain Shift & Spatial Penalties (Agent EN)]], [[LIB-406 Generative Frontiers - SDE Diffusion to Flow Matching (Agent EN)]], [[LIB-602 Modern LLM Architecture & Scaling Laws (Agent EN)]], [[LIB-801 Model Calibration & Uncertainty Estimation (Agent EN)]].

---

## 1. Conceptual Mental Model

While linear algebra (LIB-101) governs deterministic coordinate transformations in $\mathbb{R}^d$, probability theory and information theory provide the axiomatic calculus for **uncertainty quantification**, **distribution alignment**, and **latent-variable generative modeling**:
1. **Self-Information & Shannon Entropy**: By Shannon's additivity axiom for independent events, the information content (surprisal) of an outcome $x$ with probability $P(x)$ is uniquely $I(x) = -\log P(x)$ `[FACT]`. The **Shannon Entropy** $H(P) = \mathbb{E}_{x \sim P}[-\log P(x)]$ quantifies the theoretical minimum expected coding length required to transmit samples from $P$ losslessly `[FACT]`.
2. **Cross-Entropy & KL Divergence**: Encoding samples drawn from the true data distribution $P(x)$ using a codebook optimized for a parametric model $Q_\theta(x)$ incurs an expected coding length of $H(P, Q_\theta) = \mathbb{E}_{x \sim P}[-\log Q_\theta(x)]$. The excess coding penalty beyond the optimal entropy $H(P)$ is the **Kullback-Leibler (KL) Divergence** `[DERIVATION]`:
   $$D_{\mathrm{KL}}(P \parallel Q_\theta) = H(P, Q_\theta) - H(P)$$
   Since $H(P)$ is independent of $\theta$, minimizing Cross-Entropy loss $\mathcal{L}_{\mathrm{CE}}(\theta)$ is mathematically identical to minimizing $D_{\mathrm{KL}}(P \parallel Q_\theta)$ and maximizing log-likelihood (MLE) `[DERIVATION]`.
3. **Variational Inference (VI)**: In latent-variable models $p_\theta(x, z) = p_\theta(x \mid z)p(z)$, the exact posterior $p_\theta(z \mid x) = p_\theta(x, z) / \int p_\theta(x, z)\,dz$ is intractable due to the high-dimensional marginal integral. VI introduces a tractable parametric variational family $q_\phi(z \mid x)$ to maximize the **Evidence Lower Bound (ELBO)**, converting intractable integration into differentiable optimization `[DESIGN_DECISION]`.

---

## 2. Mathematical Formalization

### 1. Gibbs' Inequality & Directional Asymmetry of KL Divergence
Let $P, Q$ be probability measures on $(\mathcal{X}, \mathcal{F}, \mu)$ with Radon-Nikodym densities $p(x), q(x)$ satisfying $P \ll Q \ll \mu$.

#### Theorem 2.1 (Gibbs' Inequality: Non-Negativity of KL Divergence) `[DERIVATION]`
For any probability distributions $P, Q$, $D_{\mathrm{KL}}(P \parallel Q) \ge 0$ with equality if and only if $p(x) = q(x)$ $\mu$-almost everywhere.
*Proof*: Since $f(u) = -\log u$ is strictly convex on $(0, \infty)$ ($f''(u) = u^{-2} > 0$), applying Jensen's Inequality to $U = q(x)/p(x)$ yields:
$$D_{\mathrm{KL}}(P \parallel Q) = \mathbb{E}_{x \sim P}\left[-\log \frac{q(x)}{p(x)}\right] \ge -\log \mathbb{E}_{x \sim P}\left[\frac{q(x)}{p(x)}\right] = -\log \int_{\mathcal{X}} q(x)\,d\mu(x) = -\log(1) = 0 \quad \blacksquare$$

#### Forward vs. Reverse KL Geometry `[DERIVATION]`
- **Forward KL (Mean-Seeking / Mass-Covering)**: $\min_\theta D_{\mathrm{KL}}(P_{\text{data}} \parallel Q_\theta) = \min_\theta \mathbb{E}_{x \sim P_{\text{data}}}[-\log Q_\theta(x)]$. Wherever $P_{\text{data}}(x) > 0$, $Q_\theta(x) \to 0$ drives the divergence to $+\infty$, forcing $Q_\theta$ to cover all modes of $P_{\text{data}}$ (MLE, LLM pre-training in LIB-602).
- **Reverse KL (Mode-Seeking / Zero-Forcing)**: $\min_\phi D_{\mathrm{KL}}(Q_\phi \parallel P) = \min_\phi \mathbb{E}_{z \sim Q_\phi}[\log Q_\phi(z) - \log P(z)]$. Wherever $P(z) = 0$, $Q_\phi(z)$ is forced to zero to avoid infinite penalty, locking $Q_\phi$ onto a single high-density mode of $P$ (Variational Inference, policy distillation).

### 2. Fisher Score, Fisher Information Matrix (FIM) & Local Riemannian Metric
For a parametric family $\{p_\theta(x)\}_{\theta \in \Theta \subset \mathbb{R}^d}$, the **Fisher Score** is $s(\theta; x) \triangleq \nabla_\theta \log p_\theta(x)$ `[FACT]`. Under regularity conditions:
1. **Zero First Moment**: $\mathbb{E}_{x \sim p_\theta}[\nabla_\theta \log p_\theta(x)] = \int p_\theta(x) \frac{\nabla_\theta p_\theta(x)}{p_\theta(x)}\,dx = \nabla_\theta \int p_\theta(x)\,dx = \mathbf{0}$ `[DERIVATION]`.
2. **Fisher Information Matrix (FIM)** & Hessian Identity `[DERIVATION]`:
   $$\mathbf{F}(\theta) \triangleq \mathbb{E}_{x \sim p_\theta}\left[\nabla_\theta \log p_\theta(x)\nabla_\theta \log p_\theta(x)^\top\right] = -\mathbb{E}_{x \sim p_\theta}\left[\nabla_\theta^2 \log p_\theta(x)\right] \in \mathbb{R}^{d \times d}$$
3. **Second-Order Taylor Expansion of KL Divergence** (Amari, 1998) `[LITERATURE_RESULT]`:
   $$D_{\mathrm{KL}}(p_\theta \parallel p_{\theta + \delta\theta}) = \frac{1}{2}\delta\theta^\top \mathbf{F}(\theta)\delta\theta + \mathcal{O}(\|\delta\theta\|^3)$$
   establishing $\mathbf{F}(\theta)$ as the unique local Riemannian metric tensor on the statistical manifold.

### 3. Evidence Lower Bound (ELBO), Closed-Form Gaussian KL & Reparameterization
Decomposing the marginal log-likelihood $\log p_\theta(x)$ via an approximate posterior $q_\phi(z \mid x)$ `[DERIVATION]`:
$$\log p_\theta(x) = \mathrm{ELBO}(\theta, \phi; x) + D_{\mathrm{KL}}\big(q_\phi(z \mid x) \parallel p_\theta(z \mid x)\big)$$
$$\mathrm{ELBO}(\theta, \phi; x) = \underbrace{\mathbb{E}_{z \sim q_\phi(z \mid x)}[\log p_\theta(x \mid z)]}_{\text{Reconstruction Fidelity}} - \underbrace{D_{\mathrm{KL}}\big(q_\phi(z \mid x) \parallel p(z)\big)}_{\text{Prior Information Bottleneck}} \le \log p_\theta(x)$$
For a diagonal Gaussian posterior $q_\phi(z \mid x) = \mathcal{N}(\boldsymbol{\mu}, \mathrm{diag}(\boldsymbol{\sigma}^2))$ and standard normal prior $p(z) = \mathcal{N}(\mathbf{0}, \mathbf{I}_k)$, the analytic KL divergence reduces to `[DERIVATION]`:
$$D_{\mathrm{KL}}\big(\mathcal{N}(\boldsymbol{\mu}, \mathrm{diag}(\boldsymbol{\sigma}^2)) \parallel \mathcal{N}(\mathbf{0}, \mathbf{I}_k)\big) = -\frac{1}{2}\sum_{j=1}^k \left(1 + \log(\sigma_j^2) - \mu_j^2 - \sigma_j^2\right)$$
To backpropagate through $z \sim q_\phi(z \mid x)$ with low variance, the **Reparameterization Trick** (Kingma & Welling, 2014) expresses $z = \boldsymbol{\mu}_\phi(x) + \boldsymbol{\sigma}_\phi(x) \odot \boldsymbol{\epsilon}$ with $\boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I}_k)$ independent of $\phi$ `[LITERATURE_RESULT]`.

---

## 3. Systems & Hardware Alignment

1. **Log-Sum-Exp (LSE) Shift Invariance & SFU Fusion**: In FP16 ($\max \approx 65504 \approx e^{11.09}$) and BF16 ($\max \approx e^{88.72}$), evaluating $\exp(z_i)$ directly overflows for $|z_i| > 89$ `[SAFETY_BOUND]`. Hardware kernels enforce shift invariance with $m = \max_i z_i$:
   $$\log \mathrm{Softmax}(\mathbf{z})_c = z_c - m - \log \sum_{i=1}^V \exp(z_i - m)$$
   Fusing `log` and `softmax` into `F.log_softmax` eliminates redundant Special Function Unit (SFU) transcendental instructions ($\exp$ followed by $\log$) and prevents underflow to `log(0) = -inf` `[DESIGN_DECISION]`.
2. **Online Softmax Single-Pass Register Reduction**: Instead of 3 separate HBM passes over vocabulary dimension $V$, Online Softmax (Milakov & Gimelshein, 2018) maintains running statistics $(m_{\text{new}}, d_{\text{new}})$ in CUDA registers using warp-level butterfly shuffles (`__shfl_xor_sync`), cutting HBM memory traffic by $66.7\%$ `[EMPIRICAL_RESULT]`.
3. **Log-Variance Parameterization & Clamping**: Networks predict unconstrained log-variance $s = \log \sigma^2 \in \mathbb{R}$ clamped to $[-20.0, 10.0]$ before evaluating $\sigma = \exp(0.5 s)$, preventing non-positive variance and FP32 overflow `[SAFETY_BOUND]`.

---

## 4. Production PyTorch Implementation: Variational Gaussian Bottleneck & Information Identities

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Tuple, Dict

class VariationalGaussianBottleneck(nn.Module):
    """
    Production Variational Gaussian Bottleneck with log-variance clamping,
    reparameterization trick, and analytic closed-form KL divergence.
    """
    def __init__(
        self,
        in_features: int,
        latent_dim: int,
        logvar_min: float = -20.0,
        logvar_max: float = 10.0,
    ) -> None:
        super().__init__()
        assert in_features > 0 and latent_dim > 0, "Dimensions must be positive integers"
        assert logvar_min < logvar_max, "logvar_min must be strictly less than logvar_max"
        self.latent_dim = latent_dim
        self.logvar_min = logvar_min
        self.logvar_max = logvar_max
        self.proj_moments = nn.Linear(in_features, 2 * latent_dim)

    def reparameterize(self, mu: torch.Tensor, logvar: torch.Tensor) -> torch.Tensor:
        """
        Low-variance reparameterization: z = mu + exp(0.5 * logvar) * eps, eps ~ N(0, I).
        """
        assert mu.shape == logvar.shape, f"Shape mismatch: {mu.shape} vs {logvar.shape}"
        if not self.training:
            return mu
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + std * eps

    def compute_closed_form_kl(self, mu: torch.Tensor, logvar: torch.Tensor) -> torch.Tensor:
        """
        Analytic KL(N(mu, diag(exp(logvar))) || N(0, I)) per sample in nats: (B,)
        """
        kl_per_dim = -0.5 * (1.0 + logvar - mu.pow(2) - logvar.exp())
        return torch.clamp(kl_per_dim.sum(dim=-1), min=0.0)

    def forward(self, h: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """
        Input: h of shape (B, in_features)
        Output: (z, mu, kl_loss) of shapes (B, D), (B, D), (B,)
        """
        assert h.dim() == 2, f"Expected 2D tensor (B, F), got {h.shape}"
        mu, raw_logvar = torch.chunk(self.proj_moments(h), chunks=2, dim=-1)
        # RULE-102-02: Clamp log-variance to prevent exp() overflow or underflow
        logvar = torch.clamp(raw_logvar, min=self.logvar_min, max=self.logvar_max)
        z = self.reparameterize(mu, logvar)
        kl_loss = self.compute_closed_form_kl(mu, logvar)
        assert torch.isfinite(kl_loss).all(), "Non-finite KL divergence detected!"
        return z, mu, kl_loss


def verify_information_identities(
    logits_p: torch.Tensor,
    logits_q: torch.Tensor,
) -> Dict[str, float]:
    """
    Verifies H(P, Q) = H(P) + D_KL(P || Q) and D_KL(P || Q) >= 0 using fused log_softmax.
    """
    assert logits_p.shape == logits_q.shape and logits_p.dim() == 2
    # RULE-102-01: Always use fused log_softmax; never torch.log(torch.softmax(...))
    log_p = F.log_softmax(logits_p, dim=-1)
    log_q = F.log_softmax(logits_q, dim=-1)
    p = log_p.exp()

    entropy_p = -(p * log_p).sum(dim=-1).mean()
    cross_entropy_pq = -(p * log_q).sum(dim=-1).mean()
    kl_pq = (p * (log_p - log_q)).sum(dim=-1).mean()

    residual = torch.abs(cross_entropy_pq - (entropy_p + kl_pq)).item()
    assert residual < 1e-5, f"Information identity residual too large: {residual}"
    assert kl_pq.item() >= -1e-6, f"Gibbs inequality violated: KL={kl_pq.item()}"

    return {
        "H_P_nats": float(entropy_p.item()),
        "H_PQ_nats": float(cross_entropy_pq.item()),
        "KL_PQ_nats": float(kl_pq.item()),
        "identity_residual": float(residual),
    }
```

---

## 5. Agent Invariants & Decision Protocols

### [RULE-102-01] Fused Log-Softmax & Anti-Naive-Log Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: When implementing Cross-Entropy, KL Divergence, policy gradient log-probabilities $\log \pi_\theta(a \mid s)$, or contrastive InfoNCE objectives, agents MUST use fused shift-invariant operators (`F.log_softmax`, `F.cross_entropy`, or `torch.logsumexp`). Sequential invocation of `torch.log(torch.softmax(logits, dim=-1))` is strictly prohibited.
- **Violation Consequence**: Low-probability tail classes underflow to `0.0` in FP16/BF16, causing `torch.log(0.0)` to evaluate to `-inf` and propagating `NaN` gradients across the network while doubling GPU SFU overhead.

### [RULE-102-02] Log-Variance Clamping & Analytic KL Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: Variational posterior networks MUST parameterize unconstrained log-variance $s = \log \sigma^2$ clamped to `[-20.0, 10.0]` `[SAFETY_BOUND]` prior to exponentiation. Whenever $q_\phi(z \mid x)$ and $p(z)$ belong to exponential families admitting a closed-form KL expression (e.g., diagonal Gaussians), agents MUST compute $D_{\mathrm{KL}}(q_\phi \parallel p)$ analytically rather than via single-sample Monte Carlo estimation.
- **Violation Consequence**: Unclamped variance predictions trigger `NaN` domain errors or FP32 overflow, while Monte Carlo KL estimation injects unnecessary gradient variance into the prior regularization term.

### [RULE-102-03] Directional KL Selection Directive
- **Contract Level**: `STRATEGIC_DIRECTIVE`
- **Specification**: Agents MUST align KL directionality with the target distributional geometry: select **Forward KL** $D_{\mathrm{KL}}(P_{\text{data}} \parallel Q_\theta)$ when full support coverage (mode-covering MLE) is required from offline samples; select **Reverse KL** $D_{\mathrm{KL}}(Q_\phi \parallel P)$ when concentrating a unimodal or compact policy/variational distribution onto high-probability modes without placing probability mass in zero-density troughs.

---

## 6. Canonical & Peer-Reviewed References

1. **Shannon, C. E.** (1948). "A Mathematical Theory of Communication." *The Bell System Technical Journal*, 27(3), 379–423. DOI: [10.1002/j.1538-7305.1948.tb01338.x](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x).
2. **Kullback, S., & Leibler, R. A.** (1951). "On Information and Sufficiency." *The Annals of Mathematical Statistics*, 22(1), 79–86. DOI: [10.1214/aoms/1177729694](https://doi.org/10.1214/aoms/1177729694).
3. **Cover, T. M., & Thomas, J. A.** (2006). *Elements of Information Theory* (2nd ed.). Wiley-Interscience.
4. **Kingma, D. P., & Welling, M.** (2014). "Auto-Encoding Variational Bayes." *International Conference on Learning Representations (ICLR 2014)*. [arXiv:1312.6114](https://arxiv.org/abs/1312.6114).
5. **Amari, S.-I.** (1998). "Natural Gradient Works Efficiently in Learning." *Neural Computation*, 10(2), 251–276. DOI: [10.1162/089976698300017746](https://doi.org/10.1162/089976698300017746).
6. **Blei, D. M., Kucukelbir, A., & McAuliffe, J. D.** (2017). "Variational Inference: A Review for Statisticians." *Journal of the American Statistical Association (JASA)*, 112(518), 859–877. DOI: [10.1080/01621459.2017.1285773](https://doi.org/10.1080/01621459.2017.1285773).
7. **Milakov, M., & Gimelshein, N.** (2018). "Online normalizer calculation for softmax." *NVIDIA Technical Report*, [arXiv:1805.02867](https://arxiv.org/abs/1805.02867).
