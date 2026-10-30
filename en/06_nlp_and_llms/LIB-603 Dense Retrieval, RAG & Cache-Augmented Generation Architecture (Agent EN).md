---
call_number: LIB-603
status: source-verified
invariants_count: 4
title: Dense Retrieval, RAG & Cache-Augmented Generation Architecture (Agent Edition)
module: NLP-Large-Language-Models
category: Retrieval-Augmented-Systems
audience:
  - Autonomous-Agent
  - Graduate-PhD
  - LLM-Systems-Architect
math_foundations:
  - InfoNCE Contrastive Loss & Mutual Information Variational Lower Bound
  - Asymmetric Bi-Encoder MIPS vs Cross-Encoder Quadratic Attention Complexity
  - Marginalized Retrieval-Augmented Generation (RAG) vs Precomputed KV-Cache (CAG)
  - Okapi BM25 Lexical Saturation, Reciprocal Rank Fusion (RRF) & ColBERT MaxSim Late Interaction
  - DAG-Aware Topological Subgraph Expansion (GraphRAG) & Epistemic Provenance Gating
hardware_target:
  - Tensor Core Batched Inner-Product & HNSW Graph Traversal
  - PagedAttention Prefix KV-Cache Pinning in GPU HBM
created: 2026-10-20
author: Luke
tags:
  - nlp
  - rag
  - cag
  - dense-retrieval
  - contrastive-learning
  - infonce
  - kv-cache
  - llm-wiki
prerequisites:
  - "[[LIB-102 Probability, Information Theory & Variational Inference (Agent EN)]]"
  - "[[LIB-602 Modern LLM Architecture & Scaling Laws (Agent EN)]]"
successors:
  - "[[LIB-703 LLM Agent Cognitive Architecture & Protocols (Agent EN)]]"
  - "[[LIB-906 LLM Conversational Epistemic Revision (Agent EN)]]"
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../06_%E8%87%AA%E7%84%B6%E8%AA%9E%E8%A8%80%E8%99%95%E7%90%86%E8%88%87%E5%A4%A7%E8%AA%9E%E8%A8%80%E6%A8%A1%E5%9E%8B/LIB-603%20%E5%AF%86%E9%9B%86%E6%AA%A2%E7%B4%A2%E3%80%81%E6%AA%A2%E7%B4%A2%E5%A2%9E%E5%BC%B7%E7%94%9F%E6%88%90%20%28RAG%29%20%E8%88%87%E7%B7%A9%E5%AD%98%E5%A2%9E%E5%BC%B7%E7%94%9F%E6%88%90%20%28CAG%29%20%E7%B3%BB%E7%B5%B1%E6%9E%B6%E6%A7%8B%20%28Dense%20Retrieval,%20RAG%20%26%20Cache-Augmented%20Generation%20Architecture%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Dense Retrieval, Retrieval-Augmented Generation (RAG) & Cache-Augmented Generation (CAG) System Architecture

## Conceptual Coordinates & Topological Navigation
- **Prerequisites**: [[LIB-102 Probability, Information Theory & Variational Inference (Agent EN)]], [[LIB-602 Modern LLM Architecture & Scaling Laws (Agent EN)]].
- **Successors**: [[LIB-703 LLM Agent Cognitive Architecture & Protocols (Agent EN)]], [[LIB-906 LLM Conversational Epistemic Revision (Agent EN)]].

## 1. Conceptual Mental Model

Autoregressive Large Language Models sample from a parametric distribution $P_\theta(y_t \mid y_{<t}, x)$. Without external grounding, sampling over regions of low training density produces ungrounded hallucinations—acting as unconstrained "dream machines" rather than factual assistants `[HEURISTIC]`. **Content Engineering** anchors conditional generation by injecting verified non-parametric context across three architectural paradigms:
1. **Two-Stage Hybrid RAG (Retrieval-Augmented Generation)**: Dynamically retrieves relevant chunks from massive corpora ($>10^5$ tokens) via asymmetric dense embeddings, filters by structured metadata predicates, re-ranks via cross-attention, and expands local context windows before generation `[FACT]`.
2. **CAG (Cache-Augmented Generation)**: When a static domain corpus $\mathcal{D}$ fits within the effective context window ($\le 32\text{K}\text{--}128\text{K}$ tokens), CAG precomputes and pins the corpus KV-Cache $\mathcal{K}\mathcal{V}_{\mathcal{D}}$ in GPU HBM, bypassing retrieval recall errors and per-query document prefill overhead `[DESIGN_DECISION]`.
3. **LLM Wiki (Structured Knowledge Compilation)**: For medium-scale, high-density knowledge bases (~$10^2$ documents, ~$400\text{K}$ tokens), an LLM compiles raw sources (`raw/`) into a hierarchically indexed, bidirectionally linked Markdown graph (`wiki/` + `index.md` + automated consistency linting), enabling topological navigation without chunk-boundary fragmentation `[DESIGN_DECISION]`.

---

## 2. Mathematical Formalization

### 1. Contrastive Learning & the InfoNCE Mutual Information Lower Bound `[DERIVATION]` `[LITERATURE_RESULT]`
Given query $q \in \mathcal{Q}$, positive passage $k^+ \in \mathcal{P}$, and $N-1$ negative passages $\{k_1^-, \dots, k_{N-1}^-\}$, an asymmetric Bi-Encoder (Karpukhin et al., EMNLP 2020) projects inputs onto the unit hypersphere $\mathbb{S}^{d-1}$ (using role prefixes `query: ` and `passage: `):
$$f_Q(q) = \frac{E_Q(q)}{\|E_Q(q)\|_2} \in \mathbb{S}^{d-1}, \quad f_P(k) = \frac{E_P(k)}{\|E_P(k)\|_2} \in \mathbb{S}^{d-1}, \quad \mathrm{sim}(q, k) = \langle f_Q(q), f_P(k) \rangle$$
With temperature $\tau > 0$, the **InfoNCE Loss** (Oord et al., 2018) is formulated as categorical cross-entropy over $N$ candidates `[FACT]`:
$$\mathcal{L}_{\mathrm{InfoNCE}}(\theta) = -\mathbb{E}_{(q, k^+, \{k_j^-\})} \left[ \log \frac{\exp(\mathrm{sim}(q, k^+) / \tau)}{\exp(\mathrm{sim}(q, k^+) / \tau) + \sum_{j=1}^{N-1} \exp(\mathrm{sim}(q, k_j^-) / \tau)} \right]$$
By variational bounds on KL divergence (LIB-102), minimizing $\mathcal{L}_{\mathrm{InfoNCE}}(\theta)$ maximizes a formal lower bound on the Mutual Information $I(Q; K^+)$ `[DERIVATION]`:
$$I(Q; K^+) \ge \log(N) - \mathcal{L}_{\mathrm{InfoNCE}}(\theta)$$

### 2. Bi-Encoder MIPS vs. Cross-Encoder Reranking Complexity `[DERIVATION]` `[DESIGN_DECISION]`
1. **Stage-1 Bi-Encoder Maximum Inner Product Search (MIPS)**:
   Passage vectors $\{f_P(p_i)\}_{i=1}^M$ are indexed offline via Hierarchical Navigable Small World (HNSW) graphs (Malkov & Yashunin, TPAMI 2020). Online queries require a single encoder pass plus $O(d \cdot \log M)$ graph traversal to retrieve $K_{\mathrm{init}}$ candidates. However, compressing $p_i$ into a single vector $\mathbb{R}^d$ loses fine-grained token-to-token cross-attention.
2. **Stage-2 Cross-Encoder Reranking**:
   Concatenates $[q; \texttt{[SEP]}; p_i]$ for the $K_{\mathrm{init}}$ candidates ($K_{\mathrm{init}} \ll M$) and applies full self-attention (Nogueira & Cho, 2019):
   $$s_{\mathrm{rerank}}(q, p_i) = \sigma\left( \mathbf{w}^\top \mathrm{Transformer}_{\mathrm{ENC}}\left([q; \texttt{[SEP]}; p_i]\right)_{\texttt{[CLS]}} \right)$$
   This restores $O(K_{\mathrm{init}} \cdot (|q| + |p_i|)^2)$ token-level cross-attention interaction before selecting the final Top-$K_{\mathrm{final}}$ chunks `[LITERATURE_RESULT]`.

### 3. Marginalized RAG vs. Precomputed KV-Cache (CAG) `[DERIVATION]` `[LITERATURE_RESULT]`
- **RAG Formulation (Lewis et al., NeurIPS 2020)**:
  $$P_{\mathrm{RAG}}(y \mid q) \approx \sum_{p \in \mathcal{Z}_K(q)} P_\eta(p \mid q) \prod_{t=1}^{T} P_\theta(y_t \mid q, p, y_{<t})$$
- **CAG Formulation (Chan et al., 2024)**:
  For a static corpus $\mathcal{D}$ of length $S_{\mathcal{D}} \le S_{\max}$, CAG precomputes and pins the key-value tensors $\mathcal{K}\mathcal{V}_{\mathcal{D}} = \{(K_\ell(\mathcal{D}), V_\ell(\mathcal{D}))\}_{\ell=1}^L$ across all $L$ layers. Upon receiving query $q$ of length $S_q$, online prefill complexity drops from quadratic $O((S_{\mathcal{D}} + S_q)^2)$ to linear cross-attention $O(S_q \cdot S_{\mathcal{D}} + S_q^2)$ with zero retrieval recall loss `[DERIVATION]`.

### 4. Sparse Lexical Retrieval (Okapi BM25) & Reciprocal Rank Fusion (RRF) `[DERIVATION]` `[LITERATURE_RESULT]`
Pure dense embeddings project passages onto a smooth manifold $\mathbb{S}^{d-1}$, often suffering recall collapse on exact symbolic identifiers (`LIB-502`, `RULE-401-04`, LaTeX operators, or API tokens). Production pipelines pair dense retrieval with **Okapi BM25** (Robertson & Zaragoza, 2009):
$$\mathrm{BM25}(q, d) = \sum_{t \in q \cap d} \mathrm{IDF}(t) \cdot \frac{\mathrm{tf}(t, d) \cdot (k_1 + 1)}{\mathrm{tf}(t, d) + k_1 \cdot \left(1 - b + b \cdot \frac{|d|}{\mathrm{avgdl}}\right)}, \quad \mathrm{IDF}(t) = \log\left(1 + \frac{M - n(t) + 0.5}{n(t) + 0.5}\right)$$
where $k_1 \in [1.2, 2.0]$ bounds term-frequency saturation and $b \in [0.5, 0.8]$ (typically $b = 0.75$) normalizes document length `[FACT]`. Because unbounded BM25 log-odds and cosine similarities $\mathrm{sim}(q, d) \in [-1, 1]$ exhibit incompatible score distributions, **Reciprocal Rank Fusion (RRF, Cormack et al., SIGIR 2009)** combines ordinal ranks $\mathrm{rank}_m(q, d) \in \{1, 2, \dots\}$ without parametric calibration `[LITERATURE_RESULT]`:
$$\mathrm{Score}_{\mathrm{RRF}}(q, d) = \sum_{m \in \{\mathrm{BM25}, \mathrm{Dense}\}} \frac{1}{k_0 + \mathrm{rank}_m(q, d)}, \quad k_0 = 60$$
The damping constant $k_0 = 60$ prevents outlier dominance at rank $1$ while rewarding consensus passages retrieved by both lexical and semantic modalities `[DERIVATION]`.

### 5. Multi-Vector Late Interaction (ColBERT MaxSim Operator) `[DERIVATION]` `[LITERATURE_RESULT]`
To bridge the single-vector bottleneck of Bi-Encoders without incurring the $O((|q|+|d|)^2)$ online latency of Cross-Encoders, **ColBERT** (Khattab & Zaharia, SIGIR 2020) retains normalized token-level matrices $E_q(q) \in \mathbb{R}^{|q| \times d_{\mathrm{sub}}}$ and $E_d(d) \in \mathbb{R}^{|d| \times d_{\mathrm{sub}}}$ ($d_{\mathrm{sub}} = 32$) and computes the **MaxSim Operator** `[FACT]`:
$$S_{\mathrm{MaxSim}}(q, d) = \sum_{i=1}^{|q|} \max_{j \in \{1, \dots, |d|\}} \langle \mathbf{e}_{q, i}, \mathbf{e}_{d, j} \rangle$$
This reduces online scoring to batched GEMM and row-wise max-reduction $O(|q| \cdot |d| \cdot d_{\mathrm{sub}})$ on Tensor Cores while preserving fine-grained token alignment `[DERIVATION]`.

### 6. DAG-Aware Topological GraphRAG & RAGAS Evaluation Triad `[DERIVATION]` `[DESIGN_DECISION]`
For axiomatic knowledge graphs $\mathcal{G} = (\mathcal{V}, \mathcal{E})$ (such as `LIB-000`), retrieving an isolated passage omits upstream mathematical definitions and safety bounds:
1. **Parent-Child Hierarchy & 1-Hop Prerequisite Expansion**: Given retrieved nodes $\mathcal{V}_{\mathrm{hit}} \subset \mathcal{V}$, the retriever expands fine-grained child chunks to their parent sections and traverses reverse DAG edges $(u \to v) \in \mathcal{E}$ to inject upstream prerequisite invariants `[DESIGN_DECISION]`:
   $$\mathcal{C}_{\mathrm{expanded}}(q) = \mathrm{Parent}(\mathcal{V}_{\mathrm{hit}}) \cup \bigcup_{v \in \mathcal{V}_{\mathrm{hit}}} \left\{ \mathrm{Invariants}(u) \;\middle|\; (u \to v) \in \mathcal{E} \right\}$$
2. **RAGAS Evaluation Triad (Es et al., EACL 2024)** `[LITERATURE_RESULT]`: Evaluates pipelines across **Context Precision/Recall**, **Faithfulness** ($\frac{|\{c \in \mathcal{C}_{\mathrm{ans}} : \mathcal{C}_{\mathrm{expanded}}(q) \models c\}|}{|\mathcal{C}_{\mathrm{ans}}|}$, coupled with `LIB-906` atomic claim verification), and **Answer Relevance**.

---

## 3. Systems & Hardware Alignment: HNSW Traversal vs. Prefix KV-Cache Pinning

1. **CAG HBM Footprint Budgeting**:
   $$\mathrm{Mem}_{\mathrm{CAG}}(\mathrm{Bytes}) = 2 \times L \times H_{KV} \times d_k \times S_{\mathcal{D}} \times \mathrm{BytesPerElement}$$
   On LLaMA-3 8B ($L=32, H_{KV}=8, d_k=128$, FP16), pinning a $32\text{K}$-token static corpus consumes exactly $4.0\text{ GB}$ of HBM via PagedAttention prefix blocks (LIB-602), completely eliminating HNSW irregular pointer-chasing latency and per-query document prefill compute `[DERIVATION]` `[DESIGN_DECISION]`.
2. **Metadata Decoupling & Hybrid Predicate Filtering**:
   Each knowledge unit $u_i = (\tilde{c}_i, q_{\mathrm{syn}, i}, \mathcal{M}_i)$ strictly separates the embedded semantic payload $[\tilde{c}_i; q_{\mathrm{syn}, i}]$ from structured provenance metadata $\mathcal{M}_i = \{\texttt{title}, \texttt{authority}, \texttt{source\_url}, \texttt{snapshot\_date}\}$, preventing metadata boilerplate from diluting dense vector geometry while enabling exact boolean filtering `[DESIGN_DECISION]`.

---

## 4. Production Implementation: Metadata-Decoupled Hybrid RAG & CAG Router

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Tuple

@dataclass
class StructuredKnowledgeChunk:
    """
    Decouples the embedded semantic payload (with synthetic queries) from structured provenance metadata.
    """
    chunk_id: str
    content: str
    synthetic_questions: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    prev_chunk_id: Optional[str] = None
    next_chunk_id: Optional[str] = None

    def embedding_payload(self) -> str:
        questions_str = " ".join(self.synthetic_questions)
        return f"passage: {self.content} {questions_str}".strip()


class AsymmetricBiEncoderInfoNCE(nn.Module):
    """
    Asymmetric Bi-Encoder with InfoNCE loss & Mutual Information lower bound (Oord et al., 2018).
    Input Contract:  q_raw [B, D], p_raw [B, D]
    Output Contract: (loss, mi_lower_bound)
    """
    def __init__(self, embed_dim: int = 128, temperature: float = 0.07):
        super().__init__()
        assert 0.01 <= temperature <= 0.2, "Temperature must be within [0.01, 0.2] stability bound!"
        self.temperature = temperature
        self.q_proj = nn.Linear(embed_dim, embed_dim, bias=False)
        self.p_proj = nn.Linear(embed_dim, embed_dim, bias=False)

    def encode_query(self, q_raw: torch.Tensor) -> torch.Tensor:
        return F.normalize(self.q_proj(q_raw), p=2, dim=-1)

    def encode_passage(self, p_raw: torch.Tensor) -> torch.Tensor:
        return F.normalize(self.p_proj(p_raw), p=2, dim=-1)

    def forward(self, q_raw: torch.Tensor, p_raw: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        q_norm = self.encode_query(q_raw)
        p_norm = self.encode_passage(p_raw)
        logits = torch.matmul(q_norm, p_norm.transpose(0, 1)) / self.temperature
        labels = torch.arange(q_norm.size(0), device=q_norm.device)
        loss = F.cross_entropy(logits, labels)
        mi_lower_bound = torch.log(torch.tensor(float(q_norm.size(0)), device=q_norm.device)) - loss.detach()
        return loss, mi_lower_bound


class HybridRAGAndCAGRouter:
    """
    Combines metadata pre-filtering, Stage-1 Bi-Encoder MIPS, Stage-2 Reranking, Context Expansion, and CAG budgeting.
    """
    def __init__(self, bi_encoder: AsymmetricBiEncoderInfoNCE, rerank_scorer: nn.Linear):
        self.bi_encoder = bi_encoder
        self.rerank_scorer = rerank_scorer
        self.chunks: Dict[str, StructuredKnowledgeChunk] = {}
        self.chunk_embeddings: Dict[str, torch.Tensor] = {}

    def ingest_chunk(self, chunk: StructuredKnowledgeChunk, raw_vec: torch.Tensor) -> None:
        required_keys = {"title", "authority", "source_url", "snapshot_date"}
        missing = required_keys - set(chunk.metadata.keys())
        assert not missing, f"Chunk {chunk.chunk_id} missing mandatory provenance metadata: {missing}"
        self.chunks[chunk.chunk_id] = chunk
        with torch.no_grad():
            self.chunk_embeddings[chunk.chunk_id] = self.bi_encoder.encode_passage(raw_vec.unsqueeze(0)).squeeze(0)

    @staticmethod
    def compute_cag_kv_cache_gb(
        corpus_tokens: int,
        n_layers: int = 32,
        n_kv_heads: int = 8,
        head_dim: int = 128,
        bytes_per_elem: int = 2
    ) -> float:
        total_bytes = 2 * n_layers * n_kv_heads * head_dim * corpus_tokens * bytes_per_elem
        return total_bytes / (1024 ** 3)

    def retrieve_and_rerank(
        self,
        query_raw_vec: torch.Tensor,
        metadata_filter: Dict[str, Any],
        top_k_init: int = 4,
        top_k_final: int = 2,
        expand_neighbors: bool = True
    ) -> List[Dict[str, Any]]:
        candidate_ids = [
            cid for cid, ch in self.chunks.items()
            if all(ch.metadata.get(k) == v for k, v in metadata_filter.items())
        ]
        if not candidate_ids:
            return []

        with torch.no_grad():
            q_vec = self.bi_encoder.encode_query(query_raw_vec.unsqueeze(0))
            p_mat = torch.stack([self.chunk_embeddings[cid] for cid in candidate_ids], dim=0)
            dense_scores = torch.matmul(q_vec, p_mat.transpose(0, 1)).squeeze(0)
            k_init = min(top_k_init, len(candidate_ids))
            top_indices = torch.topk(dense_scores, k=k_init).indices.tolist()
            stage1_ids = [candidate_ids[idx] for idx in top_indices]

        with torch.no_grad():
            stage1_vecs = torch.stack([self.chunk_embeddings[cid] for cid in stage1_ids], dim=0)
            q_expanded = q_vec.expand_as(stage1_vecs)
            interaction_feat = torch.cat([
                q_expanded,
                stage1_vecs,
                q_expanded * stage1_vecs,
                torch.abs(q_expanded - stage1_vecs)
            ], dim=-1)
            rerank_logits = self.rerank_scorer(interaction_feat).squeeze(-1)
            k_final = min(top_k_final, len(stage1_ids))
            final_indices = torch.topk(rerank_logits, k=k_final).indices.tolist()

        results = []
        for idx in final_indices:
            cid = stage1_ids[idx]
            ch = self.chunks[cid]
            expanded_text = ch.content
            if expand_neighbors:
                if ch.prev_chunk_id and ch.prev_chunk_id in self.chunks:
                    expanded_text = self.chunks[ch.prev_chunk_id].content + "\n" + expanded_text
                if ch.next_chunk_id and ch.next_chunk_id in self.chunks:
                    expanded_text = expanded_text + "\n" + self.chunks[ch.next_chunk_id].content
            results.append({
                "chunk_id": cid,
                "rerank_score": float(rerank_logits[idx].item()),
                "expanded_content": expanded_text,
                "metadata": ch.metadata
            })
        return results


class ColBERTLateInteractionScorer(nn.Module):
    """
    ColBERT multi-vector Late Interaction MaxSim operator (Khattab & Zaharia, SIGIR 2020).
    Input Contract:  q_tokens [B, L_q, D_sub], d_tokens [B, L_d, D_sub]
    Output Contract: MaxSim scores [B]
    """
    def __init__(self, hidden_dim: int = 64, sub_dim: int = 32):
        super().__init__()
        self.proj = nn.Linear(hidden_dim, sub_dim, bias=False)

    def forward(self, q_tokens: torch.Tensor, d_tokens: torch.Tensor) -> torch.Tensor:
        q_norm = F.normalize(self.proj(q_tokens), p=2, dim=-1)
        d_norm = F.normalize(self.proj(d_tokens), p=2, dim=-1)
        sim_matrix = torch.bmm(q_norm, d_norm.transpose(1, 2))
        return sim_matrix.max(dim=-1).values.sum(dim=-1)


def reciprocal_rank_fusion(
    ranked_lists: List[List[str]],
    k0: int = 60
) -> List[Tuple[str, float]]:
    """
    Reciprocal Rank Fusion (RRF, Cormack et al., SIGIR 2009) merging BM25 and Dense rankings.
    """
    assert k0 >= 1, "RRF constant k0 must be positive!"
    rrf_scores: Dict[str, float] = {}
    for rank_list in ranked_lists:
        for rank_idx, doc_id in enumerate(rank_list, start=1):
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + 1.0 / (k0 + rank_idx)
    return sorted(rrf_scores.items(), key=lambda item: (-item[1], item[0]))


def expand_dag_prerequisites(
    hit_call_numbers: List[str],
    dag_prereqs: Dict[str, List[str]],
    volume_invariants: Dict[str, List[str]]
) -> Dict[str, List[str]]:
    """
    DAG-aware 1-Hop prerequisite invariant expansion enforcing RULE-000-01 at retrieval time.
    """
    expanded_rules: Dict[str, List[str]] = {}
    for call_num in hit_call_numbers:
        for prereq in dag_prereqs.get(call_num, []):
            expanded_rules[prereq] = volume_invariants.get(prereq, [])
    return expanded_rules


if __name__ == "__main__":
    torch.manual_seed(42)
    dim = 64
    bi_enc = AsymmetricBiEncoderInfoNCE(embed_dim=dim, temperature=0.07)
    q_batch = torch.randn(16, dim)
    p_batch = q_batch + 0.1 * torch.randn(16, dim)
    loss_val, mi_bound = bi_enc(q_batch, p_batch)
    print(f"InfoNCE Loss: {loss_val.item():.4f} | MI Lower Bound: {mi_bound.item():.4f} nats")

    reranker = nn.Linear(dim * 4, 1)
    router = HybridRAGAndCAGRouter(bi_enc, reranker)

    c1 = StructuredKnowledgeChunk(
        chunk_id="MOL-01",
        content="Part-time employment reduces hours relative to full-time staff but retains Labor Standards Act protections.",
        synthetic_questions=["Are weekend part-time workers protected by labor law?"],
        metadata={
            "title": "Part-Time Work Definition",
            "authority": "Ministry of Labor",
            "source_url": "https://www.mol.gov.tw/",
            "snapshot_date": "2026-10-18"
        },
        next_chunk_id="MOL-02"
    )
    c2 = StructuredKnowledgeChunk(
        chunk_id="MOL-02",
        content="Leave entitlements for part-time workers are prorated by regular working hours.",
        synthetic_questions=["How is annual leave calculated for part-time staff?"],
        metadata={
            "title": "Part-Time Leave Rules",
            "authority": "Ministry of Labor",
            "source_url": "https://www.mol.gov.tw/",
            "snapshot_date": "2026-10-18"
        },
        prev_chunk_id="MOL-01"
    )
    router.ingest_chunk(c1, torch.randn(dim))
    router.ingest_chunk(c2, torch.randn(dim))

    hits = router.retrieve_and_rerank(
        query_raw_vec=torch.randn(dim),
        metadata_filter={"authority": "Ministry of Labor"},
        top_k_init=2,
        top_k_final=1,
        expand_neighbors=True
    )
    cag_mem = router.compute_cag_kv_cache_gb(corpus_tokens=32768)
    print(f"Retrieved Chunk: {hits[0]['chunk_id']} | 32K CAG KV-Cache: {cag_mem:.2f} GB")
    assert len(hits) == 1 and len(hits[0]["expanded_content"]) > 0

    fused = reciprocal_rank_fusion([["MOL-02", "MOL-01"], ["MOL-01", "MOL-02"]], k0=60)
    colbert = ColBERTLateInteractionScorer(hidden_dim=dim, sub_dim=32)
    maxsim_score = colbert(torch.randn(2, 6, dim), torch.randn(2, 16, dim))
    dag_rules = expand_dag_prerequisites(
        hit_call_numbers=["LIB-603"],
        dag_prereqs={"LIB-603": ["LIB-102", "LIB-602"]},
        volume_invariants={"LIB-102": ["RULE-102-01"], "LIB-602": ["RULE-602-03"]}
    )
    print(f"RRF Top-1: {fused[0][0]} ({fused[0][1]:.4f}) | ColBERT MaxSim: {maxsim_score[0].item():.2f} | DAG Prereqs: {list(dag_rules.keys())}")
    assert len(fused) == 2 and maxsim_score.shape == (2,) and "LIB-102" in dag_rules
```

---

## 5. Agent Invariants & Decision Protocols

### [RULE-603-01] InfoNCE L2-Normalization & Temperature Stability Guardrail
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: Asymmetric Bi-Encoder retrieval pipelines MUST enforce unit $L_2$-norm normalization ($\|f_Q(q)\|_2 = \|f_P(k)\|_2 = 1$ within tolerance $\le 10^{-5}$) and role prefixes (`query:` vs. `passage:`) prior to inner-product scoring. The InfoNCE temperature $\tau$ MUST be clamped within $\tau \in [0.01, 0.2]$ `[SAFETY_BOUND]`.
- **Violation Consequence**: Unnormalized inner products degenerate into magnitude bias, while $\tau < 0.01$ triggers $\exp(\mathrm{sim}/\tau) > 65504$ FP16 overflow (`Inf`/`NaN`).

### [RULE-603-02] Structured Metadata Decoupling & Provenance Guardrail
- **Contract Level**: `BOUNDARY_GUARD`
- **Specification**: Document ingestion pipelines MUST decouple the embedded semantic payload (text + synthetic retrieval queries) from structured provenance metadata $\mathcal{M}_i$ (`title`, `authority`, `source_url`, `snapshot_date`). Fixed-window chunking MUST maintain a $10\%\text{--}20\%$ token overlap `[HEURISTIC]` and support neighbor context expansion.
- **Violation Consequence**: Monolithic unlabelled chunks prevent boolean source/temporal filtering and sever conditional exceptions across chunk boundaries.

### [RULE-603-03] RAG vs. CAG & LLM Wiki Architectural Routing Invariant
- **Contract Level**: `RESOURCE_CONSTRAINT`
- **Specification**: Knowledge-grounded systems MUST route architectures by corpus scale and mutability: (1) Static corpora with $S_{\mathcal{D}} \le 32\text{K}$ tokens and high query reuse MUST use **CAG** (precomputed PagedAttention Prefix KV-Cache); (2) Medium-scale structured domains ($\sim 10^2$ docs, $\sim 400\text{K}$ tokens) with topological dependencies MUST use **LLM Wiki** (`raw/` $\to$ `wiki/` + `index.md` + automated linter); (3) Dynamic or massive corpora ($>10^5$ tokens) MUST deploy **Two-Stage Hybrid RAG** (Bi-Encoder Top-$K_{\mathrm{init}}$ + Cross-Encoder Reranker Top-$K_{\mathrm{final}}$).
- **Violation Consequence**: Applying naive chunked RAG to axiomatic knowledge bases severs multi-paragraph derivations, whereas stuffing megabyte corpora into uncached prompts causes HBM OOM and Lost-in-the-Middle degradation.

### [RULE-603-04] Hybrid RRF & DAG Topological Expansion Invariant
- **Contract Level**: `PERFORMANCE_CRITICAL`
- **Specification**: For corpora containing exact symbolic identifiers (`LIB-xxx`, `RULE-xxx-xx`, mathematical operators, or API symbols) and DAG dependencies, Stage-1 retrieval MUST execute parallel **Okapi BM25 lexical search** ($k_1 \in [1.2, 2.0], b \in [0.5, 0.8]$) and **Dense / ColBERT MaxSim retrieval**, merging candidate rankings via **Reciprocal Rank Fusion (RRF)** with damping constant $k_0 = 60$ `[DESIGN_DECISION]`. Retrieving any node $v \in \mathcal{V}_{\mathrm{hit}}$ MUST trigger parent section expansion and 1-Hop prerequisite invariant injection ($\{ \mathrm{Invariants}(u) \mid (u \to v) \in \mathcal{E} \}$), with generated claims gated by RAGAS Faithfulness verification `[SAFETY_BOUND]`.
- **Violation Consequence**: Pure dense retrieval suffers severe recall collapse on exact identifiers, while omitting DAG prerequisite expansion violates `RULE-000-01` by stripping upstream numerical stability and hardware alignment bounds.

---

## 6. Canonical & Peer-Reviewed References

1. **Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., ... & Kiela, D.** (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." *Advances in Neural Information Processing Systems (NeurIPS 2020)*, 33, 9459–9474. [arXiv:2005.11401](https://arxiv.org/abs/2005.11401).
2. **Karpukhin, V., Oğuz, B., Min, S., Lewis, P., Wu, L., Edunov, S., Chen, D., & Yih, W.-t.** (2020). "Dense Passage Retrieval for Open-Domain Question Answering." *Proceedings of the 2020 Conference on Empirical Methods in Natural Language Processing (EMNLP 2020)*, pp. 6769–6781. DOI: [10.18653/v1/2020.emnlp-main.550](https://doi.org/10.18653/v1/2020.emnlp-main.550).
3. **Oord, A. v. d., Li, Y., & Vinyals, O.** (2018). "Representation Learning with Contrastive Predictive Coding." [arXiv:1807.03748](https://arxiv.org/abs/1807.03748).
4. **Nogueira, R., & Cho, K.** (2019). "Passage Re-ranking with BERT." [arXiv:1901.04085](https://arxiv.org/abs/1901.04085).
5. **Malkov, Y. A., & Yashunin, D. A.** (2020). "Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs." *IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)*, 42(4), 824–836. DOI: [10.1109/TPAMI.2018.2889473](https://doi.org/10.1109/TPAMI.2018.2889473).
6. **Chan, B. J., Chen, C.-T., Cheng, J.-H., & Huang, H.-H.** (2024). "Don't Do RAG: When Cache-Augmented Generation is All You Need for Knowledge Tasks." [arXiv:2412.15605](https://arxiv.org/abs/2412.15605).
7. **Cormack, G. V., Clarke, C. L., & Buettcher, S.** (2009). "Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods." *Proceedings of the 32nd International ACM SIGIR Conference on Research and Development in Information Retrieval (SIGIR 2009)*, pp. 758–759. DOI: [10.1145/1571941.1572114](https://doi.org/10.1145/1571941.1572114).
8. **Khattab, O., & Zaharia, M.** (2020). "ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT." *Proceedings of the 43rd International ACM SIGIR Conference on Research and Development in Information Retrieval (SIGIR 2020)*, pp. 39–48. [arXiv:2004.12832](https://arxiv.org/abs/2004.12832).
9. **Robertson, S., & Zaragoza, H.** (2009). "The Probabilistic Relevance Framework: BM25 and Beyond." *Foundations and Trends in Information Retrieval*, 3(4), 333–389. DOI: [10.1561/1500000019](https://doi.org/10.1561/1500000019).
10. **Es, S., James, J., Espinosa-Anke, L., & Schockaert, S.** (2024). "RAGAs: Automated Evaluation of Retrieval Augmented Generation." *Proceedings of the 18th Conference of the European Chapter of the Association for Computational Linguistics: System Demonstrations (EACL 2024)*, pp. 150–158. [arXiv:2309.15217](https://arxiv.org/abs/2309.15217).
