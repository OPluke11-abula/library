---
call_number: LIB-704
title: Dual-Process Neural Agent - S1 Non-Autoregressive Typed Decision Engine (Jev) & Byte-Level Interface Reflex Model (CUA-S1) (Agent Edition)
module: Agent-Frontiers
category: Systems-Frontiers
audience:
  - Autonomous-Agent
  - Systems-Architect
  - Research-Scientist
status: Verified-Authoritative-Production
math_foundations:
  - Kahneman Dual-Process Cognitive Theory (System 1 vs System 2)
  - Non-Autoregressive Generation (NAR) & Parallel Decoding
  - Confidence Gating & Threshold Escalation
hardware_target:
  - Low-Latency Edge Inference (< 50ms Reflex SLA)
invariants_count: 5
created: 2026-09-17
author: Luke (Chi-Yang Yu) & AI Research Agent (Antigravity)
prerequisites:
  - "[[LIB-405 Attention Mechanism & Transformer Revolution (Agent EN)]]"
  - "[[LIB-703 LLM Agent Cognitive Architecture & Protocols (Agent EN)]]"
  - "[[LIB-801 Model Calibration & Uncertainty Estimation (Agent EN)]]"
successors:
  - "[[LIB-903 Capstone Blueprint & Academic Research Evolution (Agent EN)]]"
tags:
  - dual-process
  - system1-system2
  - non-autoregressive
  - cua-s1
  - jev-engine
  - low-latency-agents
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../07_%E5%BC%B7%E5%8C%96%E5%AD%B8%E7%BF%92%E8%88%87%E6%99%BA%E6%85%A7%E4%BB%A3%E7%90%86%E4%BA%BA/LIB-704%20%E9%9B%99%E9%80%B2%E7%A8%8B%E7%A5%9E%E7%B6%93%E4%BB%A3%E7%90%86%E4%BA%BA%EF%BC%9AS1%20%E9%9D%9E%E8%87%AA%E8%BF%B4%E6%AD%B8%E5%9E%8B%E6%85%8B%E6%B1%BA%E7%AD%96%E5%BC%95%E6%93%8E%20%28Jev%29%20%E8%88%87%E5%AD%97%E7%AF%80%E7%B4%9A%E4%BB%8B%E9%9D%A2%E5%8F%8D%E5%B0%84%E6%A8%A1%E5%9E%8B%20%28CUA-S1%29%20%E6%B7%B1%E5%BA%A6%E8%A7%A3%E5%89%96%20%28Dual-Process%20Neural%20Agent%20-%20S1%20Non-Autoregressive%20Typed%20Decision%20Engine%20%28Jev%29%20%26%20Byte-Level%20Interface%20Reflex%20Model%20%28CUA-S1%29%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Dual-Process Neural Agents: S1 Non-Autoregressive Typed Engine (Jev) & Reflex Model (CUA-S1)

## 1. Conceptual Mental Model

Why do current commercial agents feel sluggish, consuming 3 to 10 seconds per click? Because they funnel every micro-interaction (clicking "Next", scrolling down, typing a keystroke) through massive, slow autoregressive LLM inference passes (System 2). Human cognition does not work this way. Humans operate via **Dual-Process Cognition** (Kahneman): $95\%$ of daily perceptual-motor reactions are executed by **System 1** (subconscious, instantaneous reflex, $< 100\text{ms}$), while **System 2** (deliberate, slow, logical tree-search) is activated only when novel obstacles or low-confidence thresholds arise.

---

## 2. Mathematical Formalization

```
                                  [Raw Environmental Input (Screen Bytes / UI DOM)]
                                                         │
                                                         ▼
                                       ┌──────────────────────────────────┐
                                       │ System 1 Reflex Engine (CUA-S1)  │  < 50ms
                                       │ Non-Autoregressive (Jev Engine)  │
                                       └──────────────────────────────────┘
                                                         │
                                                p_max >= tau (0.85)?
                                                ┌────────┴────────┐
                                         [YES]  │                 │  [NO] (Low Confidence)
                                                ▼                 ▼
                                    ┌───────────────────────┐   ┌───────────────────────────────┐
                                    │ Direct Typed Action   │   │ System 2 Escalation (ReAct)   │
                                    │ Output (Click / Key)  │   │ Deep Planning & Search (LLM)  │
                                    └───────────────────────┘   └───────────────────────────────┘
```

### 1. System 1: Non-Autoregressive (NAR) Typed Action Emission
Standard autoregressive decoding emits tokens sequentially:
$$P(y_1, \dots, y_T \mid x) = \prod_{t=1}^T P(y_t \mid y_{<t}, x), \quad \text{Latency} = O(T)$$
The **Jev Engine** uses Non-Autoregressive Parallel Action Decoding. Given UI state $x$, it predicts target coordinates $(u, v)$ and action type $a \in \mathcal{A}$ in a single forward pass:
$$P(a, u, v \mid x) = P(a \mid x) \cdot P(u \mid x) \cdot P(v \mid x), \quad \text{Latency} = O(1) \approx 30-50\text{ms}$$

### 2. Confidence Gating & System 2 Escalation Condition
Let the calibrated maximum softmax probability be:
$$p_{\max} = \max_{a \in \mathcal{A}} P_{\text{calibrated}}(a \mid x)$$
The dual-process gating decision rule is:
$$\text{Policy}(x) = \begin{cases} \text{Execute S1 Action}(a, u, v) & \text{if } p_{\max} \ge \tau_{\text{gate}} \land \text{Entropy}(H) \le \epsilon_H \\ \text{Escalate to System 2 Planner} & \text{otherwise} \end{cases}$$
where canonical confidence threshold $\tau_{\text{gate}} = 0.85$.

---

## 3. Production Dual-Process Gating Implementation

```python
import torch
import torch.nn as nn
from dataclasses import dataclass
from typing import Optional

@dataclass
class AgentAction:
    action_type: str
    coord_x: int
    coord_y: int
    confidence: float
    system_origin: str # "S1_Reflex" or "S2_Deliberate"

class DualProcessController:
    """
    Production dual-process gating controller.
    Dispatches fast S1 reflexes when confident; escalates to S2 when ambiguous.
    """
    def __init__(self, s1_model: nn.Module, s2_client, tau_gate: float = 0.85):
        self.s1_model = s1_model
        self.s2_client = s2_client
        self.tau_gate = tau_gate

    @torch.no_grad()
    def step(self, ui_state_tensor: torch.Tensor, raw_context: dict) -> AgentAction:
        # S1 Forward Pass (Sub-50ms)
        action_logits, coord_preds = self.s1_model(ui_state_tensor)
        probs = torch.softmax(action_logits, dim=-1)
        p_max, action_idx = torch.max(probs, dim=-1)
        
        confidence = float(p_max.item())
        
        # Gating condition
        if confidence >= self.tau_gate:
            cx, cy = coord_preds[0].tolist()
            return AgentAction(
                action_type=["CLICK", "SCROLL", "TYPE", "NAVIGATE"][action_idx.item()],
                coord_x=int(cx),
                coord_y=int(cy),
                confidence=confidence,
                system_origin="S1_Reflex"
            )
        else:
            # Escalate to System 2 Deliberate ReAct Reasoning
            s2_decision = self.s2_client.plan_and_solve(raw_context)
            return AgentAction(
                action_type=s2_decision["action"],
                coord_x=s2_decision["x"],
                coord_y=s2_decision["y"],
                confidence=1.0,
                system_origin="S2_Deliberate"
            )
```

---

## 4. Agent Invariants & Decision Protocols

- `INV-704-01 (Strict Gating Invariant)`: System 1 actions MUST NOT be dispatched if $p_{\max} < 0.85$. Low-confidence states MUST be escalated to System 2.
- `INV-704-02 (Sub-50ms S1 Latency SLA)`: System 1 forward pass latency MUST be strictly bounded under $50\text{ms}$ on target hardware.
- `INV-704-03 (Calibration Requirement)`: Probabilities $P(a \mid x)$ in System 1 MUST be temperature-calibrated (LIB-801) on out-of-distribution validation sets before setting gating thresholds.
