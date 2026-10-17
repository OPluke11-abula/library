---
call_number: LIB-407
status: source-verified
invariants_count: 3
title: Fine-Grained Instruction Image Editing & Cross-Attention Preservation (Agent EN)
module: Deep-Learning-Architectures
category: Generative-Diffusion-Editing
audience:
  - Autonomous-Agent
  - Graduate-PhD
math_foundations:
  - Latent Diffusion U-Net Cross-Attention Modulation
  - Non-Target Region Attention Suppression
  - DDIM Inversion Latent Trajectory Conservation
hardware_target:
  - Tensor Core FP16/BF16 Attention GEMM
  - Memory-Efficient Attention (xFormers / FlashAttention-2)
created: 2026-09-24
author: Luke
tags:
  - deep-learning
  - diffusion-models
  - image-editing
  - cross-attention
  - instructpix2pix
prerequisites:
  - "[[LIB-405 Attention Mechanism & Transformer Revolution (Agent EN)]]"
  - "[[LIB-406 Generative Frontiers - SDE Diffusion to Flow Matching (Agent EN)]]"
successors:
  - "[[LIB-408 Context-Aware Object Generation, Illumination Estimation & Image Compositing (Agent EN)]]"
  - "[[LIB-905 Frontier Vision & Multimodal Capstone Blueprints (Agent EN)]]"
---

> Language / 語言: [🇹🇼 繁體中文](../../04_%E6%B7%B1%E5%BA%A6%E5%AD%B8%E7%BF%92%E6%9E%B6%E6%A7%8B%E8%88%87%E7%A5%9E%E7%B6%93%E6%A9%9F%E5%88%B6/LIB-407%20%E6%8C%87%E4%BB%A4%E5%BC%95%E5%B0%8E%E6%93%B4%E6%95%A3%E5%BD%B1%E5%83%8F%E7%B7%A8%E8%BC%AF%E8%88%87%E8%B7%A8%E6%B3%A8%E6%84%8F%E5%8A%9B%E9%9D%9E%E7%9B%AE%E6%A8%99%E5%85%A7%E5%AE%B9%E4%BF%9D%E6%8C%81%20%28Instruction-Guided%20Diffusion%20Editing,%20Cross-Attention%20Control%20&%20Non-Target%20Preservation%29.md) | 🇺🇸 **English**

# Fine-Grained Instruction Image Editing & Cross-Attention Preservation

## 1. Attention Map Modulation & Non-Target Protection

Given cross-attention probabilities $A = \text{Softmax}(Q K^T / \sqrt{d})$ in a latent diffusion model, editing instructions ("change wheels to black") frequently corrupt non-target regions (car paint, background).

### Spatial Modulation Formulation
Let $M_{\text{target}} \in \{0, 1\}^{H \times W}$ represent the target segment mask and $M_{\text{bg}} = 1 - M_{\text{target}}$. For token index $j$ corresponding to the target edit attribute:
$$\tilde{A}_{:, j} = A_{:, j} \odot (1 + \lambda_{\text{boost}} M_{\text{target}}) \odot (1 - \lambda_{\text{suppress}} M_{\text{bg}})$$
followed by row-wise re-normalization.

### Multi-Level Preservation Objective
During iterative sampling and latent optimization:
$$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{diff}} + \lambda_{\text{bg}} \|M_{\text{bg}} \odot (z_t - z_t^{\text{orig}})\|_2^2 + \lambda_{\text{struct}} \|S_t - S_t^{\text{orig}}\|_F^2$$
where $S_t$ denotes deep self-attention affinity tensors, enforcing structural preservation.

---

## 2. Production Implementation: Region-Aware Cross-Attention Modulator

```python
import torch

class CrossAttentionModulator:
    """
    Region-aware cross-attention modulation and non-target latent preservation engine.
    Aligns with RULE-407-01 ~ RULE-407-03.
    """
    def __init__(self, boost_factor: float = 1.5, suppress_factor: float = 0.8):
        self.boost = boost_factor
        self.suppress = suppress_factor

    def modulate_attention(
        self,
        attn_probs: torch.Tensor,        # [Batch, Heads, HW, Tokens]
        target_mask: torch.Tensor,       # [Batch, 1, HW, 1] (0 or 1)
        edit_token_indices: list
    ) -> torch.Tensor:
        assert attn_probs.dim() == 4, f"Expected 4D attention tensor, got {attn_probs.dim()}D"
        assert target_mask.shape[2] == attn_probs.shape[2], "Spatial mask dimension mismatch"

        modified_attn = attn_probs.clone()
        bg_mask = 1.0 - target_mask.detach()

        for idx in edit_token_indices:
            token_attn = modified_attn[:, :, :, idx:idx+1]
            boosted = token_attn * (1.0 + self.boost * target_mask.detach())
            suppressed = boosted * (1.0 - self.suppress * bg_mask)
            modified_attn[:, :, :, idx:idx+1] = suppressed

        return modified_attn / (modified_attn.sum(dim=-1, keepdim=True) + 1e-8)

    @staticmethod
    def compute_preservation_loss(
        latent_current: torch.Tensor,
        latent_original: torch.Tensor,
        target_mask: torch.Tensor
    ) -> torch.Tensor:
        bg_mask = 1.0 - target_mask.detach()
        diff = (latent_current - latent_original) * bg_mask
        return torch.mean(diff ** 2)
```

---

## 3. Invariants & Implementation Specifications

### [RULE-407-01] Non-Target Background LPIPS Drift Upper Bound
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: In fine-grained instruction-based image editing, perceptual feature drift in non-target background regions MUST satisfy $\text{LPIPS}(I_{\text{edit}} \odot M_{\text{bg}}, I_{\text{orig}} \odot M_{\text{bg}}) \le 0.05$ and $\text{PSNR} \ge 32\text{ dB}$ [SAFETY_BOUND].
- **Violation Consequence**: Unconstrained generative editing alters unrelated scene elements, corrupting visual identity and contextual consistency.

### [RULE-407-02] Cross-Attention Mask Gradient Isolation Guardrail
- **Contract Level**: `HIGH_INVARIANT`
- **Specification**: Target segmentation masks $M_{\text{target}}$ directing cross-attention editing operations MUST be explicitly detached (`.detach()`) from autograd computation graphs.
- **Violation Consequence**: Backpropagating editing loss through spatial mask generation causes target boundary erosion and semantic bleeding into background pixels.

### [RULE-407-03] DDIM Inversion Step Count & Reconstruction SLA
- **Contract Level**: `HIGH_INVARIANT`
- **Specification**: Deterministic DDIM inversion for image reconstruction MUST execute $N_{\text{inv}} \ge 50$ steps with relative latent reconstruction error $\|z_0 - \hat{z}_0\|_2 / \|z_0\|_2 < 1.5 \times 10^{-2}$, while maintaining per-frame editing latency under $1.5\text{s}$ on target GPU hardware [TARGET].
- **Violation Consequence**: Insufficient inversion steps ($N_{\text{inv}} < 50$) accumulate discretization drift, degrading background reconstruction fidelity.

## 4. Canonical References

1. **Brooks, T., et al.** (2023). *InstructPix2Pix: Learning to Follow Image Editing Instructions*. **CVPR 2023**.
2. **Hertz, A., et al.** (2023). *Prompt-to-Prompt Image Editing with Cross-Attention Control*. **ICLR 2023**.
3. **Cao, M., et al.** (2023). *MasaCtrl: Tuning-Free Mutual Self-Attention Control for Consistent Image Synthesis and Editing*. **ICCV 2023**.
4. **Mokady, R., et al.** (2023). *Null-text Inversion for Editing Real Images using Guided Diffusion Models*. **CVPR 2023**.
5. **Winter, R., et al.** (2024). *LEDITS++: Limitless Image Editing using Text-to-Image Diffusion Models*. **CVPR 2024**.
