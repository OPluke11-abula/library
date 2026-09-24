---
call_number: LIB-703
status: source-verified
invariants_count: 4
title: LLM Agent Cognitive Architecture & Protocols (Agent Edition)
module: Agent-Cognition
category: Systems-Frontiers
audience:
  - Autonomous-Agent
  - Research-Scientist
  - Systems-Architect
math_foundations:
  - Finite State Automata & ReAct Reasoning Loops
  - JSON-RPC Tool Use Schemas & Type Contracts
  - Memory Hierarchy (Context Buffer vs Episodic Vector Storage)
hardware_target:
  - Distributed Multi-Agent Inference Cluster
created: 2026-09-17
author: Luke
tags:
  - llm-agents
  - react-protocol
  - tool-use
  - cognitive-architecture
  - memory-hierarchy
prerequisites:
  - "[[LIB-405 Attention Mechanism & Transformer Revolution (Agent EN)]]"
  - "[[LIB-602 Modern LLM Architecture & Scaling Laws (Agent EN)]]"
successors:
  - "[[LIB-506 LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)]]"
  - "[[LIB-704 Dual-Process Neural Agent S1-Jev & Reflex CUA-S1 (Agent EN)]]"
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

### [RULE-703-01] ReAct Closed-Loop Tool Execution Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: Autonomous agent cognitive architectures MUST enforce strict closed-loop execution: Thought $	o$ Action $	o$ Observation $	o$ Reflection. Tool execution outputs MUST be formally parsed and validated before advancing to subsequent reasoning steps.
- **Violation Consequence**: Open-loop action sequences hallucinate intermediate tool results, compounding reasoning errors uncontrollably.

### [RULE-703-02] External Cortex Persistence (Obsidian Vault) Invariant
- **Contract Level**: `HIGH_INVARIANT`
- **Specification**: Critical architectural decisions, experiment outcomes, and system state transitions MUST be persisted into human- and agent-readable Markdown files within the local knowledge vault (`AGENTS.md`, `reports/`). Long-term state MUST NOT rely solely on volatile context window memory.
- **Violation Consequence**: Ephemeral conversational context wipes out cumulative architectural memory between session restarts.

### [RULE-703-03] Token Budget Conservation & Working Memory Pruning Heuristic
- **Contract Level**: `OPTIMIZATION_HEURISTIC`
- **Specification**: When active conversation context exceeds $70\%$ of the maximum token window, agents MUST summarize completed execution trajectories into structured summaries and prune redundant intermediate tool outputs.
- **Violation Consequence**: Context exhaustion forces involuntary prompt truncation, triggering attention degradation and task failure.

### [RULE-703-04] Reflexion Retry Limit & Fallback Guardrail
- **Contract Level**: `BOUNDARY_GUARD`
- **Specification**: When tool execution fails, agents MUST limit automated retry attempts to a maximum of 3 consecutive iterations. After 2 consecutive identical failures, the agent MUST trigger internal reflection to modify strategy or escalate to human fallback.
- **Violation Consequence**: Unbounded retries without strategy revision cause infinite loops and rapid API token exhaustion.

