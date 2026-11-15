---
call_number: LIB-703
status: source-verified
invariants_count: 7
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
- **The Agent Systems Equation & Five-Stage Engineering Ladder (`AI Agent = AI Model + Harness`)** `[FACT]` `[DESIGN_DECISION]`: Single-turn zero-shot generation (`Prompt -> LLM -> Output`) is analogous to forcing a human writer to draft an entire document or codebase without pressing backspace, consulting references, or running a compiler. An operational agent couples the probabilistic model with an execution harness ($\text{AI Agent} = \text{AI Model} + \text{Harness}$), progressing across five engineering tiers: **Prompt Engineering** (single-turn instruction phrasing) $\to$ **Context Engineering** (structured injection of domain rules, RAG evidence, and constraints) $\to$ **Harness Engineering** (deterministic tool bindings, JSON Schema contracts, and execution sandboxes) $\to$ **Loop Engineering** (closed-loop ReAct/Reflection verification and iterative error recovery) $\to$ **Graph Engineering** (DAG/state-machine orchestration of specialized multi-agent workflows and topological knowledge graphs) `[DESIGN_DECISION]`.

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

### 4. Andrew Ng's Four Agentic Design Patterns, Two-Stage Tool Grounding & MCP vs. A2A Protocol Topology `[FACT]` `[DERIVATION]` `[DESIGN_DECISION]`
1. **Reflection (Heterogeneous Actor-Critic Iterative Refinement)**: Replaces single-pass open-loop generation $y^{(0)} \sim P_{\theta_{\mathrm{gen}}}(y \mid x)$ with alternating evaluation by a critic model $\theta_{\mathrm{critic}}$ (or deterministic verifier) and revision by the generator $\theta_{\mathrm{gen}}$:
   $$c^{(k)} \sim P_{\theta_{\mathrm{critic}}}\left(c \mid x, y^{(k)}\right), \quad y^{(k+1)} \sim P_{\theta_{\mathrm{gen}}}\left(y \mid x, y^{(k)}, c^{(k)}\right)$$
2. **Tool Use (Two-Stage Deterministic Routing & JSON Schema Grounding)** `[DERIVATION]` `[DESIGN_DECISION]`: Because autoregressive LLMs are probabilistic sequence predictors rather than exact arithmetic ALUs or live transactional databases, tool invocations execute in **two distinct stages**:
   - **Stage 1 (Intent Parsing & Structured Call Generation)**: Given declared tool signatures $\mathcal{F} = \{\texttt{get\_menu}(), \texttt{quote\_order}(\texttt{item\_name}, \texttt{quantity})\}$, the LLM maps user intent $u$ into a typed call $a_1 = \texttt{quote\_order("Barley Tea", 20)}$ rather than hallucinating arithmetic.
   - **Stage 2 (Host Deterministic Execution & JSON Grounded Synthesis)**: The host harness executes the function and returns a schema-validated JSON payload $o_1 = \texttt{\{"ok": true, "item\_name": "Barley Tea", "quantity": 20, "unit\_price": 30, "total": 600, "stock": 30, "currency": "TWD", "ordered": false\}}$, conditioning the final synthesis $a_2 \sim P_\theta(a \mid u, a_1, o_1)$ on exact ground-truth figures.
3. **Planning (`<think>` Reasoning Decomposition)** & **Multiagent Collaboration (PM Orchestration)**: A planning or Project Manager (PM) agent decomposes composite objectives $G$ into a task DAG $\{g_1, \dots, g_m\}$ and dispatches specialized sub-agents (computation, retrieval, auditing) in parallel or topological order.
4. **Orthogonal Two-Layer Protocol Stack — Anthropic MCP vs. Google A2A** `[FACT]` `[DESIGN_DECISION]`:
   - **Vertical Layer — MCP (Model Context Protocol, Anthropic)**: Standardizes how a **single agent** discovers, plans, and invokes external tools, local filesystems, and data resources via JSON-RPC 2.0 (`Agent <-> Tools/Data`).
   - **Horizontal Layer — A2A (Agent-to-Agent Protocol, Google)**: Standardizes how **multiple autonomous agents** discover peer capabilities (Agent Cards), negotiate task delegation, and synchronize state across agent boundaries (`Agent <-> Agent`).
5. **The Three Coding Paradigms & Production Boundaries of "Vibe Coding"** `[FACT]` `[SAFETY_BOUND]`:
   Karpathy (2025) contrasts manual coding (no LLM), human-led AI-assisted engineering (human architectural control + strict diff review + automated test verification), and **Vibe Coding** (pure natural-language prompting, blindly clicking `Accept All` without reading diffs, and pasting raw error logs until symptoms disappear). While Vibe Coding accelerates throwaway weekend prototypes, it is strictly forbidden in production systems, safety-critical infrastructure, and axiomatic knowledge repositories, where every diff must pass syntactic AST parsing and deterministic invariant checks `[SAFETY_BOUND]`.

### 5. Complete Harness Six-Tuple, Prompt $\to$ Loop $\to$ Graph Control Topology, Stateless API $\mathcal{O}(T^2)$ Cost & Double-Review Reflection Automaton `[FACT]` `[DERIVATION]` `[EMPIRICAL_RESULT]` `[SAFETY_BOUND]`
1. **The Complete Harness Six-Tuple, Good Boss Delegation Triad & Work Agent vs. Code Agent (Tsai, TAICA 2026 L09–L10)** `[FACT]` `[DESIGN_DECISION]` `[SAFETY_BOUND]`:
   - **Complete Harness Six-Tuple**: $\mathcal{H}_{\text{Agent}} = \langle \text{Workspace}, \; \text{Tools}, \; \text{Connectors (MCP)}, \; \text{Skills (\texttt{SKILL.md})}, \; \text{Rules (\texttt{AGENTS.md})}, \; \text{Schedule} \rangle$. Cross-tool rule interoperability: `CLAUDE.md` can reference `@AGENTS.md` to share a single source of truth; avoid maintaining divergent `GEMINI.md` and `AGENTS.md` files simultaneously (`GEMINI.md` takes higher loading precedence and causes silent rule conflicts); and keep `AGENTS.md` $\le 12,000$ characters (Google Antigravity's per-rule-file ceiling) by offloading long-form SOPs into on-demand `SKILL.md` modules `[FACT]` `[SAFETY_BOUND]`.
   - **Good Boss Delegation Triad & Interview-First Spec Generation**: Every task specification must explicitly state **(1) Deliverable Spec** (exact path and schema), **(2) Boundary Constraints** (read-only vs. mutable directories), and **(3) Executable Acceptance Criteria** (*"Saying 'check it' is not verification; saying 'make it better' is not a specification"*). Before generating `AGENTS.md` for a new knowledge base (e.g., an LLM Wiki), the agent must conduct an **8–10 question single-question-at-a-time structured interview** (target reader, page types, language/terminology, citation granularity, contradiction handling, single vs. batch ingestion, downstream deliverables, lint rules) `[DESIGN_DECISION]`.
   - **Work Agent vs. Code Agent**: Work Agents (ChatGPT Work, Claude Desktop, OpenWorker) present final outputs/summaries and rely on manual file versioning and human reading; Code Agents (Antigravity, Claude Code, Codex, OpenCode) present line-by-line `diff`s, use `git` as the native state baseline, and verify completion via executable scripts (`Exit Code == 0`) `[FACT]`.
2. **Control-Flow Graph Progression (`Prompt` $\to$ `Loop` $\to$ `Graph`)** (Huntley 2025 `Ralph loop`; Osmani 2026 *Loop Engineering*; Tsai 2026 L10) `[FACT]` `[SAFETY_BOUND]`:
   - **Prompt ($G_{\text{prompt}} = (\{A\}, \emptyset)$)**: Single pass; the human acts as the manual glue between steps.
   - **Loop ($G_{\text{loop}} = (\{A\}, \{(A, A)\})$)**: The AI decides the next step inside a self-executing specification. A safe autonomous Loop requires **five mandatory elements**: (1) **Goal**, (2) **Constraints**, (3) **Two-Tier Completion Criteria** (**Deterministic Script Check** + **Fresh-Context Independent AI Review** in a clean conversation given *only* the final artifact and raw sources—never letting the same generation context grade its own output), (4) **Hard Braking Conditions** (hard iteration cap e.g. $K_{\max} \le 3$, abstention when source material is below threshold e.g. $< 3$ pages, and token budget cutoffs), and (5) **Trigger** `[SAFETY_BOUND]`.
   - **Graph ($G_{\text{graph}} = (V, E_{\text{fwd}}, E_{\text{rollback}})$ — File-State Workflow Prototype)**: For multi-stage pipelines (e.g., `sources.md` $\to$ `cards/` $\to$ `outline.md` $\to$ `drafts/` $\to$ `deck.html` $\to$ `report.md`), control returns to the system designer via explicit forward and **targeted rollback edges** (*"Roll back to the exact stage that failed; keep outer loops rare and inner node loops fast"*). Each node enforces **Least-Privilege Read/Write Scoping** (e.g., the HTML rendering node reads approved `drafts/` and is strictly forbidden from mutating a single word of text; the Gatekeeper node only emits `report.md` and triggers targeted rollback edges without self-editing) `[SAFETY_BOUND]`.
3. **Stateless HTTP Inference APIs, $\mathcal{O}(T^2)$ Cumulative Token Growth & Sliding-Window Socratic Debugging (*TraceBack Detective*)** `[FACT]` `[DERIVATION]` `[EMPIRICAL_RESULT]`:
   - Because cloud Chat Completions APIs are stateless, turn $t$ must re-transmit $[S_{\text{sys}}, u_1, a_1, \dots, u_t]$. Without truncation, cumulative input tokens across $T$ turns grow quadratically:
     $$C_{\text{unbounded}}(T) = \sum_{t=1}^{T} \left(L_{\text{sys}} + t \cdot \bar{L}_{\text{turn}}\right) = T \cdot L_{\text{sys}} + \frac{T(T+1)}{2}\bar{L}_{\text{turn}} = \mathcal{O}(T^2)$$
   - Applying sliding-window truncation `history[-2W:]` (e.g., `history[-12:]` retaining the last 6 user/assistant pairs) bounds per-turn input to $\mathcal{O}(L_{\text{sys}} + W \cdot \bar{L}_{\text{turn}})$ and total $T$-turn cost to $\mathcal{O}(T)$, while keeping $S_{\text{sys}}$ at `index 0` maximizes Prefix KV-Cache reuse (Prompt Caching) `[DERIVATION]`.
4. **Four-Stage Double-Review Reflection Automaton (*English Mistake Coach*)** `[DERIVATION]` `[EMPIRICAL_RESULT]` `[SAFETY_BOUND]`:
   - Formal state machine: `Writer` (minimal-edit draft $y^{(0)}$ + typed `edits` list) $\to$ `Reviewer 1` ($d_1 \in \{\texttt{KEEP}, \texttt{REVISE}, \texttt{UNCERTAIN}\}$) $\to$ **Conditional `Reviser`** (invoked iff $d_1 = \texttt{REVISE}$, avoiding unnecessary LLM latency and preventing overcorrection on already-valid inputs) $\to$ **Mandatory `Reviewer 2`** ($d_2$) $\to$ **Fail-Closed Gate**:
     $$\text{Approved}(y^{(1)}) \iff \left(d_2 = \texttt{KEEP}\right) \land \left(d_1 \neq \texttt{UNCERTAIN}\right) \land \left(d_2 \neq \texttt{UNCERTAIN}\right)$$
     Any `UNCERTAIN` flag on semantically ambiguous inputs (e.g., `"I saw her duck."`) halts publication with `NEEDS_CONTEXT` rather than guessing intent (verified on `"we are go in the school"` $\to$ `"We are going to school."` in `2,293` tokens with `VERIFIED_DOUBLE_REVIEW`) `[EMPIRICAL_RESULT]` `[SAFETY_BOUND]`.

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


def quote_order_deterministic(item_name: str, quantity: int) -> Dict[str, Any]:
    """Two-stage deterministic tool execution returning schema-validated JSON state."""
    menu_db = {"Barley Tea": {"unit_price": 30, "stock": 30}}
    item = menu_db.get(item_name)
    if not item:
        return {"ok": False, "error": "Item not found"}
    return {
        "ok": quantity <= item["stock"],
        "item_name": item_name,
        "quantity": quantity,
        "unit_price": item["unit_price"],
        "total": item["unit_price"] * quantity,
        "stock": item["stock"],
        "currency": "TWD",
        "ordered": False,
    }


def evaluate_double_review_gate(
    r1_decision: str, r2_decision: str, draft_text: str, revised_text: Optional[str] = None
) -> Dict[str, Any]:
    """Four-stage Double-Review Reflection fail-closed release gate."""
    reviser_invoked = r1_decision == "REVISE"
    final_candidate = revised_text if (reviser_invoked and revised_text) else draft_text
    if r1_decision == "UNCERTAIN" or r2_decision == "UNCERTAIN":
        status, approved = "NEEDS_CONTEXT", False
    elif r2_decision == "KEEP":
        status, approved = "VERIFIED_DOUBLE_REVIEW", True
    else:
        status, approved = "NOT_APPROVED", False
    return {
        "status": status,
        "approved": approved,
        "reviser_invoked": reviser_invoked,
        "final": final_candidate,
    }
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

### [RULE-703-05] Two-Stage Deterministic Tool Grounding, MCP/A2A Decoupling & Anti-Vibe-Coding Guardrail
- **Contract Level**: `BOUNDARY_GUARD`
- **Specification**: (1) Agents handling arithmetic pricing, inventory, or live system queries MUST enforce two-stage tool routing (Stage 1: structured function call generation $\to$ Stage 2: host execution returning a schema-validated JSON payload for grounded synthesis) rather than mental LLM arithmetic `[DESIGN_DECISION]`; (2) vertical agent-to-tool integration MUST follow **MCP** JSON-RPC schemas while horizontal inter-agent delegation follows **A2A** protocols `[FACT]`; and (3) in production repositories and verified knowledge bases, blind Vibe Coding (`Accept All` without diff inspection and automated validator exit code `0`) is strictly prohibited `[SAFETY_BOUND]`.
- **Violation Consequence**: Direct LLM arithmetic hallucinates transactional figures, conflating tool and peer protocols breaks modularity, and unreviewed Vibe Coding silently introduces structural regressions.

### [RULE-703-06] Autonomous Loop Five-Element, Hard Brake & Fresh-Context Review Invariant
- **Contract Level**: `SAFETY_CRITICAL`
- **Specification**: Every autonomous Loop specification MUST define **(1) Goal, (2) Read/Write Boundary Constraints, (3) Two-Tier Completion Criteria, (4) Hard Braking Conditions, and (5) Trigger**. Completion verification MUST combine deterministic script checks (`Exit Code == 0`) with a **Fresh-Context Independent AI Review** executed in a clean conversation receiving *only* the final artifact and raw sources (never allowing the generation context to grade its own output) `[SAFETY_BOUND]`. Loops MUST enforce hard iteration caps (e.g., $K_{\max} \le 3$) and evidence-insufficiency abstention, and project rule manuals (`AGENTS.md`, referenced via `@AGENTS.md` in `CLAUDE.md`) MUST remain $\le 12,000$ characters by offloading detailed SOPs into `SKILL.md` modules `[FACT]` `[SAFETY_BOUND]`.
- **Violation Consequence**: Unsupervised loops without hard brakes or fresh-context review compound errors indefinitely, rationalize their own hallucinations, and exhaust token budgets.

### [RULE-703-07] Graph Node Least-Privilege Scoping, Targeted Rollback & Double-Review Fail-Closed Gate
- **Contract Level**: `BOUNDARY_GUARD`
- **Specification**: In multi-stage Graph workflows $G=(V, E_{\text{fwd}}, E_{\text{rollback}})$, all intermediate states MUST be persisted as git-tracked files and each node MUST enforce strict least-privilege read/write whitelists: downstream rendering nodes (`drafts/ -> deck.html`) MUST NOT mutate a single word of approved text, and Gatekeeper nodes MUST only emit audit reports and trigger targeted rollback edges to the specific failing upstream stage without self-editing `[SAFETY_BOUND]`. In high-precision revision pipelines (`Writer -> Reviewer 1 -> Conditional Reviser -> Reviewer 2`), the `Reviser` MUST execute iff $d_1 = \texttt{REVISE}$ (preventing overcorrection), and publication MUST fail closed unless $d_2 = \texttt{KEEP}$ and neither reviewer flags `UNCERTAIN` `[EMPIRICAL_RESULT]` `[SAFETY_BOUND]`.
- **Violation Consequence**: Unscoped node permissions allow presentation stages to silently corrupt verified facts, while monolithic loops obscure failure localization across multi-stage pipelines.

---

## 5. Canonical & Peer-Reviewed References

1. **Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., & Cao, Y.** (2023). "ReAct: Synergizing Reasoning and Acting in Language Models." *International Conference on Learning Representations (ICLR 2023)*. [arXiv:2210.03629](https://arxiv.org/abs/2210.03629).
2. **Yao, S., Yu, D., Zhao, J., Shafran, I., Narasimhan, K., & Cao, Y.** (2023). "Tree of Thoughts: Deliberate Problem Solving with Large Language Models." *Advances in Neural Information Processing Systems (NeurIPS 2023)*, 36.
3. **Shinn, N., Cassano, F., Gopinath, A., Narasimhan, K., & Yao, S.** (2023). "Reflexion: Language Agents with Verbal Reinforcement Learning." *Advances in Neural Information Processing Systems (NeurIPS 2023)*, 36.
4. **Schick, T., Dwivedi-Yu, J., Dessì, R., Raileanu, R., Lomeli, M., Zettlemoyer, L., Cancedda, N., & Scialom, T.** (2023). "Toolformer: Language Models Can Teach Themselves to Use Tools." *Advances in Neural Information Processing Systems (NeurIPS 2023)*, 36.
5. **Ng, A.** (2024). "Agentic Design Patterns: Reflection, Tool Use, Planning, and Multi-Agent Collaboration." *DeepLearning.AI*; **Anthropic** (2024). *Model Context Protocol (MCP) Specification*; **Google** (2025). *Agent2Agent (A2A) Open Protocol*.
6. **Tsai, Y.-L. (蔡炎龍)** (2026). *TAICA Generative AI: Theory and Practice — Unit 09 (Agentic Work & Harness) & Unit 10 (Loop, Graph & Workflow Prototype)*. National Chengchi University (NCCU); **Osmani, A.** (2026). *Loop Engineering & Self-Executing Specs*; **Huntley, G.** (2025). *The Ralph Loop Pattern*.
