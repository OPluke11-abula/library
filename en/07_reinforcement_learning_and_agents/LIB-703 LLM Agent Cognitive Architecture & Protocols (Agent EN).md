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
  - "[[LIB-603 Dense Retrieval, RAG & Cache-Augmented Generation Architecture (Agent EN)]]"
successors:
  - "[[LIB-506 LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)]]"
  - "[[LIB-704 Dual-Process Neural Agent S1-Jev & Reflex CUA-S1 (Agent EN)]]"
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../07_%E5%BC%B7%E5%8C%96%E5%AD%B8%E7%BF%92%E8%88%87%E6%99%BA%E6%85%A7%E4%BB%A3%E7%90%86%E4%BA%BA/LIB-703%20%E7%8F%BE%E4%BB%A3%E5%A4%A7%E6%A8%A1%E5%9E%8B%E4%BB%A3%E7%90%86%E4%BA%BA%20%28LLM%20Agent%29%20%E8%AA%8D%E7%9F%A5%E6%9E%B6%E6%A7%8B%E8%88%87%E6%8E%A8%E8%AB%96%E5%8D%94%E8%AD%B0%20%28LLM%20Agent%20Cognitive%20Architecture%20%26%20Protocols%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Large Language Model Agents: Cognitive Architectures & Execution Protocols

## Conceptual Coordinates & Topological Navigation
- **Prerequisites**: [[LIB-405 Attention Mechanism & Transformer Revolution (Agent EN)]], [[LIB-602 Modern LLM Architecture & Scaling Laws (Agent EN)]], [[LIB-603 Dense Retrieval, RAG & Cache-Augmented Generation Architecture (Agent EN)]].
- **Successors**: [[LIB-506 LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)]], [[LIB-704 Dual-Process Neural Agent S1-Jev & Reflex CUA-S1 (Agent EN)]].

## 1. Conceptual Mental Model

A standard LLM is a static probabilistic auto-regressive function: given prefix $x$, it computes next-token distribution $P(w | x)$. An **Autonomous Agent** transforms this passive predictor into an active cybernetic controller operating inside an environment: perceiving state $s_t$, planning trajectories through internal reasoning chains, executing external tools $a_t \sim \pi(s_t)$, receiving environmental feedback $o_{t+1}$, and updating memory.

---

## 2. Mathematical Formalization

### 1. The ReAct (Reason + Act) POMDP Formulation
We formalize agent operation as a Partially Observable Markov Decision Process (POMDP) `[FACT]`:
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

### 3. Systems & Hardware Alignment: KV-Cache Prefix Reuse & Memory Tiering
- **Prefix KV-Cache Reuse Across ReAct Turns**: In multi-turn ReAct trajectories $c_t = (o_0, th_0, a_0, \dots, o_t)$, appending tool observations preserves the causal prefix. Serving engines (vLLM PagedAttention, LIB-602) cache KV blocks of prior turns in GPU HBM so only the newly appended observation $o_t$ incurs prefill compute `[DESIGN_DECISION]`.
- **Three-Tier Memory Hierarchy**: High-bandwidth GPU HBM stores active KV-Cache ($W_{\text{recent}}$); host DRAM maintains structured JSON working scratchpads; NVMe-backed HNSW vector indices store long-term episodic trajectories `[HEURISTIC]`.
- **LLM Wiki Compilation vs. Naive Chunked RAG**: Rather than slicing axiomatic documents into arbitrary fixed-length chunks that sever cross-section derivations, agents compile raw sources (`raw/`) into a hierarchically indexed, bidirectionally linked Markdown knowledge graph (`wiki/` + `index.md` + automated consistency linting, LIB-603), enabling exact topological traversal across $\sim 10^2$ volumes ($\sim 400\text{K}$ words) `[DESIGN_DECISION]`.
- **Role-Conditioned State Space & Unified Multi-Provider Routing (`provider:model`)**: Agent APIs formalize dialogue state via `system` ($s_{\mathrm{sys}}$ persona/constraints), `user` ($u_t$), and `assistant` ($a_t$) roles, sampling $P_\theta(a_t \mid s_{\mathrm{sys}}, u_1, a_1, \dots, u_t)$ across interchangeable cloud and local backends via unified `provider:model` routing interfaces `[FACT]` `[DESIGN_DECISION]`.
- **Agentic GraphRAG & Topological Subgraph Compilation (`RULE-603-04`)**: When reasoning across axiomatic knowledge graphs (LIB-603), agents execute a three-stage retrieval protocol: (1) **Child-Chunk Hybrid RRF** (BM25 + Dense/ColBERT MaxSim with $k_0 = 60$) to pinpoint exact formulas or `RULE-xxx-xx` invariants; (2) **Parent Section & 1-Hop DAG Prerequisite Expansion** to inject upstream invariants $\{ \mathrm{Invariants}(u) \mid (u \to v) \in \mathcal{E} \}$; and (3) **Topological CAG Subgraph Pinning**, compiling topologically sorted prerequisite chains ($\le 32\text{K}$ tokens) into PagedAttention prefix blocks for zero-latency multi-turn ReAct execution `[DESIGN_DECISION]`.

---

## 3. Production JSON-RPC Tool Schema & Closed-Loop Reference Implementation

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

```python
import traceback
from typing import Callable, Dict, Any, List, Optional

class ProductionAgentLoop:
    def __init__(self, tools_dict: Dict[str, Callable[..., str]], max_iterations: int = 10):
        self.tools = tools_dict
        self.max_iterations = max_iterations
        self.trajectory: List[Dict[str, Any]] = []

    def execute_step(self, user_goal: str, reasoning_fn: Callable[..., Dict[str, Any]]) -> Optional[str]:
        for _ in range(self.max_iterations):
            decision = reasoning_fn(user_goal, self.trajectory)
            thought, action, action_input = decision["thought"], decision["action"], decision["action_input"]
            self.trajectory.append({"role": "assistant", "thought": thought, "action": action})
            if action == "finish":
                return str(action_input)
            tool_fn = self.tools.get(action)
            if not tool_fn:
                obs = f"Error: Unknown tool '{action}'"
            else:
                try:
                    obs = tool_fn(**action_input)
                except Exception as e:
                    obs = f"Tool execution exception: {str(e)}\n{traceback.format_exc()}"
            self.trajectory.append({"role": "environment", "observation": obs})
        return None
```

---

## 4. Agent Invariants & Decision Protocols

### [RULE-703-01] ReAct Closed-Loop Tool Execution Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: Autonomous agent cognitive architectures MUST enforce strict closed-loop execution: Thought $\to$ Action $\to$ Observation $\to$ Reflection. Tool execution outputs MUST be formally parsed and validated before advancing to subsequent reasoning steps.
- **Violation Consequence**: Open-loop action sequences hallucinate intermediate tool results, compounding reasoning errors uncontrollably.

### [RULE-703-02] External Cortex Persistence (Obsidian Vault) Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: Critical architectural decisions, experiment outcomes, and system state transitions MUST be persisted into human- and agent-readable Markdown files within the local knowledge vault (`AGENTS.md`, `LIB-XXX`) following the LLM Wiki compilation workflow (`raw/` $\to$ structured volumes + bidirectional DAG links + automated linter verification). Long-term state MUST NOT rely solely on volatile context window memory.
- **Violation Consequence**: Ephemeral conversational context wipes out cumulative architectural memory between session restarts.

### [RULE-703-03] Token Budget Conservation & Working Memory Pruning Heuristic
- **Contract Level**: `RESOURCE_CONSTRAINT`
- **Specification**: When active conversation context exceeds $70\% `[HEURISTIC]`$ of the maximum token window, agents MUST summarize completed execution trajectories into structured summaries and prune redundant intermediate tool outputs.
- **Violation Consequence**: Context exhaustion forces involuntary prompt truncation, triggering attention degradation and task failure.

### [RULE-703-04] Reflexion Retry Limit & Fallback Guardrail
- **Contract Level**: `BOUNDARY_GUARD`
- **Specification**: When tool execution fails, agents MUST limit automated retry attempts to a maximum of 3 consecutive iterations. After 2 consecutive identical failures, the agent MUST trigger internal reflection to modify strategy or escalate to human fallback.
- **Violation Consequence**: Unbounded retries without strategy revision cause infinite loops and rapid API token exhaustion.

---

## 5. Canonical & Peer-Reviewed References

1. **Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., & Cao, Y.** (2023). "ReAct: Synergizing Reasoning and Acting in Language Models." *International Conference on Learning Representations (ICLR 2023)*. [arXiv:2210.03629](https://arxiv.org/abs/2210.03629).
2. **Yao, S., Yu, D., Zhao, J., Shafran, I., Narasimhan, K., & Cao, Y.** (2023). "Tree of Thoughts: Deliberate Problem Solving with Large Language Models." *Advances in Neural Information Processing Systems (NeurIPS 2023)*, 36.
3. **Shinn, N., Cassano, F., Gopinath, A., Narasimhan, K., & Yao, S.** (2023). "Reflexion: Language Agents with Verbal Reinforcement Learning." *Advances in Neural Information Processing Systems (NeurIPS 2023)*, 36.
4. **Schick, T., Dwivedi-Yu, J., Dessì, R., Raileanu, R., Lomeli, M., Zettlemoyer, L., Cancedda, N., & Scialom, T.** (2023). "Toolformer: Language Models Can Teach Themselves to Use Tools." *Advances in Neural Information Processing Systems (NeurIPS 2023)*, 36.
