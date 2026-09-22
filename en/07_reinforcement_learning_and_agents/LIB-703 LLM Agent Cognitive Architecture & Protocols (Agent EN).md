---
call_number: LIB-703
title: LLM Agent Cognitive Architecture & Protocols (Agent Edition)
module: Agent-Cognition
category: Systems-Frontiers
audience:
  - Autonomous-Agent
  - Research-Scientist
  - Systems-Architect
status: Verified-Authoritative-Production
math_foundations:
  - Finite State Automata & ReAct Reasoning Loops
  - JSON-RPC Tool Use Schemas & Type Contracts
  - Memory Hierarchy (Context Buffer vs Episodic Vector Storage)
hardware_target:
  - Distributed Multi-Agent Inference Cluster
invariants_count: 5
created: 2026-09-17
author: Luke
prerequisites:
  - "[[LIB-405 Attention Mechanism & Transformer Revolution (Agent EN)]]"
  - "[[LIB-602 Modern LLM Architecture & Scaling Laws (Agent EN)]]"
successors:
  - "[[LIB-704 Dual-Process Neural Agent S1-Jev & Reflex CUA-S1 (Agent EN)]]"
  - "[[LIB-903 Capstone Blueprint & Academic Research Evolution (Agent EN)]]"
tags:
  - llm-agents
  - react-protocol
  - tool-use
  - cognitive-architecture
  - memory-hierarchy
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../07_%E5%BC%B7%E5%8C%96%E5%AD%B8%E7%BF%92%E8%88%87%E6%99%BA%E6%85%A7%E4%BB%A3%E7%90%86%E4%BA%BA/LIB-703%20%E7%8F%BE%E4%BB%A3%E5%A4%A7%E6%A8%A1%E5%9E%8B%E4%BB%A3%E7%90%86%E4%BA%BA%20%28LLM%20Agent%29%20%E8%AA%8D%E7%9F%A5%E6%9E%B6%E6%A7%8B%E8%88%87%E6%8E%A8%E8%AB%96%E5%8D%94%E8%AD%B0%20%28LLM%20Agent%20Cognitive%20Architecture%20%26%20Protocols%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Large Language Model Agents: Cognitive Architectures & Execution Protocols

## 1. Conceptual Mental Model

A standard LLM is a static probabilistic auto-regressive function: given prefix $x$, it computes next-token distribution $P(w | x)$. An **Autonomous Agent** transforms this passive predictor into an active cybernetic controller operating inside an environment: perceiving state $s_t$, planning trajectories through internal reasoning chains, executing external tools $a_t \sim \pi(s_t)$, receiving environmental feedback $o_{t+1}$, and updating memory.

---

## 2. Mathematical Formalization

### 1. The ReAct (Reason + Act) POMDP Formulation
We formalize agent operation as a Partially Observable Markov Decision Process (POMDP):
$$\mathcal{M} = (\mathcal{S}, \mathcal{A}, \mathcal{O}, \mathcal{T}, \mathcal{R}, \Omega, \gamma)$$
At timestep $t$:
1. **Observation $o_t \in \mathcal{O}$**: Environmental state projected to text/multimodal tokens.
2. **Thought Trajectory $th_t \in \mathcal{T}_{\text{thought}}$**: Internal scratchpad reasoning:
   $$th_t \sim P_{\text{LLM}}(\cdot \mid c_t), \quad c_t = (o_0, th_0, a_0, o_1, \dots, o_t)$$
3. **Action Execution $a_t \in \mathcal{A}$**: Structured tool call (e.g., JSON-RPC):
   $$a_t = \text{ExtractAction}(th_t)$$
4. **Environment Step**: Transition to next state $s_{t+1} \sim \mathcal{T}(s_t, a_t)$, returning new observation $o_{t+1} \sim \Omega(s_{t+1})$.

### 2. Memory Tier Hierarchy & Eviction Policies
To operate over infinite time horizons within finite token contexts:
- **Short-Term Context Buffer**: Sliding window of recent turns $W_{\text{recent}}$ ($K$ tokens).
- **Working Memory Scratchpad**: Structured state variables (active plan, subgoals, intermediate variables).
- **Long-Term Episodic Memory**: Vector database using dense embeddings:
  $$\text{Query}(q) = \text{Top-k}_{m \in \mathcal{M}} \left( \frac{\langle E(q), E(m) \rangle}{\|E(q)\| \|E(m)\|} \right)$$

---

## 3. Production JSON-RPC Tool Schema Contract

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "name": "execute_python_code",
  "description": "Executes sandboxed Python 3.10 code for mathematical verification.",
  "parameters": {
    "type": "object",
    "properties": {
      "code": {
        "type": "string",
        "description": "Executable Python code. Print results to stdout."
      },
      "timeout_seconds": {
        "type": "integer",
        "default": 10,
        "maximum": 60
      }
    },
    "required": ["code"]
  }
}
```

---

## 4. Agent Invariants & Decision Protocols

- `INV-703-01 (Strict Structured Tool Output)`: Agents invoking external APIs MUST emit strictly parseable JSON conforming to declared JSON-RPC schemas. Markdown backticks or commentary inside the JSON payload is STRICTLY FORBIDDEN.
- `INV-703-02 (Loop Detection Guard)`: Agents MUST track state hashes $H(o_t, a_t)$. If an identical tool call fails 3 consecutive times with the same error, the agent MUST break the execution loop and invoke a reflection self-correction step.
- `INV-703-03 (Idempotent Action Execution)`: Non-idempotent actions (such as git commit, file deletion, database modification) MUST verify pre-conditions prior to dispatch.
