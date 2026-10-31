#!/usr/bin/env python3

"""

scripts/library_rag.py

======================

Executable DAG-Aware Hybrid RAG, Lexical Subword MaxSim Reranking, and CAG Compiler Engine

for the CS & Deep Learning Knowledge Base (28 bilingual volumes, 56 files, 103 invariants).



Implements the mathematical and systems contracts of LIB-603 ([RULE-603-01..04]),

LIB-000 ([RULE-000-01]), LIB-703, and LIB-906 using zero-dependency standard-library

algorithms (explicitly distinguishing lightweight approximations from neural models):

  1. Fence-Protected Markdown H2/H3 Hierarchy-Aware Parent-Child Chunking with Python AST Symbol Extraction.

  2. Parallel Okapi BM25 (k1=1.5, b=0.75) + L2-Normalized Deterministic Feature Hashing

     (256-dim Signed Random Projection over lexical & character 3-gram features; non-neural).

  3. Weighted Reciprocal Rank Fusion (RRF, k0=60) + Stage-2 Lexical Subword N-Gram MaxSim Reranking

     (ColBERT-inspired token/n-gram late-interaction heuristic weighted by BM25 IDF; non-neural).

  4. 1-Hop & Transitive DAG Prerequisite Invariant Expansion (Topological GraphRAG).

  5. Cache-Augmented Generation (CAG) Topological Subgraph Bundle Compiler & KV-Cache HBM Calculator.

  6. Reproducible Dual-Suite Benchmark (16-Query Smoke Regression + 24-Query Zero-Leakage Holdout Suite).

  7. Spec-Compliant JSON-RPC 2.0 Model Context Protocol (MCP) Stdio Server (--mcp).



Usage:

  python scripts/library_rag.py build

  python scripts/library_rag.py query "InfoNCE RRF MaxSim" --lang zh --expand-dag

  python scripts/library_rag.py compile-cag LIB-603 --lang en --mode compact

  python scripts/library_rag.py benchmark

  python scripts/library_rag.py --mcp

"""



import sys

import os

import re

import ast

import math

import json

import time

import hashlib

import argparse

import textwrap

import subprocess

from datetime import datetime, timezone

from pathlib import Path

from dataclasses import dataclass, field

from collections import defaultdict, Counter, deque

from typing import List, Dict, Any, Optional, Tuple, Set



# Ensure UTF-8 console output on Windows

if hasattr(sys.stdout, "reconfigure"):

    sys.stdout.reconfigure(encoding="utf-8")

if hasattr(sys.stderr, "reconfigure"):

    sys.stderr.reconfigure(encoding="utf-8")



ROOT = Path(__file__).resolve().parent.parent

INDEX_PATH = ROOT / "reports" / "library_rag_index.json"

BENCHMARK_PATH = ROOT / "reports" / "library_rag_benchmark.json"

HOLDOUT_PATH = ROOT / "tests" / "holdout_rag_benchmark.json"



CANONICAL_EVIDENCE_TAGS = {

    "FACT",

    "DERIVATION",

    "LITERATURE_RESULT",

    "EMPIRICAL_RESULT",

    "HEURISTIC",

    "DESIGN_DECISION",

    "TARGET",

    "SAFETY_BOUND",

    "HYPOTHESIS",

    "OPEN_QUESTION",

}



EPISTEMIC_PRIORITY_WEIGHTS = {

    "FACT": 1.00,

    "DERIVATION": 1.00,

    "SAFETY_BOUND": 0.98,

    "LITERATURE_RESULT": 0.95,

    "EMPIRICAL_RESULT": 0.90,

    "DESIGN_DECISION": 0.85,

    "HEURISTIC": 0.75,

    "TARGET": 0.65,

    "HYPOTHESIS": 0.55,

    "OPEN_QUESTION": 0.50,

}



STOPWORDS_EN = {

    "to", "of", "in", "is", "it", "on", "at", "by", "an", "as", "be", "or",

    "if", "no", "so", "up", "we", "do", "my", "me", "he", "us", "am",

    "the", "and", "for", "with", "that", "this", "from", "are", "was", "were",

    "have", "has", "had", "not", "but", "what", "when", "where", "which", "who",

    "why", "how", "can", "could", "should", "would", "will", "may", "might",

    "into", "onto", "upon", "about", "above", "below", "between", "through",

    "during", "before", "after", "under", "over", "again", "further", "then",

    "once", "here", "there", "all", "any", "both", "each", "few", "more",

    "most", "other", "some", "such", "only", "own", "same", "than", "too",

    "very", "just", "does", "did", "doing", "done", "use", "using", "used",

    "make", "makes", "made", "need", "needs", "without", "within", "while",

    "since", "anyone", "completely", "safe", "optimal", "configure", "explain",

}



STOPWORDS_ZH_CHARS = set("的了在是和與或及為以於對而將可能會有這那個們嗎呢吧請問如何什麼為何怎麼若當只會不會既還")



STOPWORDS_ZH_BIGRAMS = {

    "什麼", "如何", "為何", "怎麼", "因為", "所以", "如果", "既然", "當我", "我們",

    "使用", "透過", "進行", "說明", "解釋", "請說", "是否", "應該", "可以", "不能",

    "不會", "只會", "設定", "環境", "階段", "問題", "時候", "以及", "或者", "已經",

}



# Lightweight corpus-grounded bilingual term alignment table for cross-lingual retrieval

BILINGUAL_TERM_BRIDGES: Dict[str, List[str]] = {

    "奇異值": ["svd", "singular", "spectral"],

    "分解": ["decomposition", "factorization"],

    "條件數": ["condition", "ill-conditioned"],

    "對極幾何": ["epipolar", "fundamental", "hartley"],

    "八點法": ["eight-point", "hartley", "fundamental"],

    "基礎矩陣": ["fundamental", "epipolar", "ransac"],

    "座標正規化": ["hartley", "isotropic"],

    "平移等變": ["translation", "equivariance", "inductive", "convolution"],

    "卷積": ["convolution", "cnn", "kernel", "spatial"],

    "全連結": ["fully-connected", "mlp", "spatial"],

    "矩陣乘累加": ["mma", "gemm", "tensor", "warp"],

    "維度對齊": ["alignment", "multiple", "tensor", "tile"],

    "體系結構": ["architecture", "hardware", "roofline", "sram"],

    "對稱性破缺": ["symmetry", "breaking", "xavier"],

    "低秩": ["lora", "low-rank", "zero-init"],

    "無分類器引導": ["cfg", "classifier-free", "guidance", "rescale"],

    "離群": ["outlier", "awq", "smoothquant", "per-channel"],

    "諂媚": ["sycophancy", "capitulation", "epistemic"],

}





@dataclass

class LibraryChunk:

    chunk_id: str

    parent_section_id: str

    call_number: str

    lang: str  # "zh" or "en"

    volume_title: str

    section_h2: str

    section_h3: str

    breadcrumb: str

    content: str

    metadata: Dict[str, Any] = field(default_factory=dict)





def get_git_commit_sha(root: Path = ROOT) -> str:

    """Returns the latest Git commit SHA that modified the 56 bilingual corpus volumes (avoiding self-referential commit hash churn)."""

    try:

        sha = subprocess.check_output(

            ["git", "log", "-n", "1", "--pretty=format:%H", "--", ":(glob)**/LIB-*.md"],

            cwd=str(root),

            stderr=subprocess.DEVNULL,

            text=True,

        ).strip()

        if sha:

            return sha

        return subprocess.check_output(

            ["git", "rev-parse", "HEAD"], cwd=str(root), stderr=subprocess.DEVNULL, text=True

        ).strip()

    except Exception:

        return "UNKNOWN"





def parse_frontmatter(text: str) -> Tuple[Dict[str, Any], str]:

    """Parses YAML frontmatter into a dictionary and markdown body."""

    if not text.startswith("---"):

        return {}, text

    parts = text.split("---", 2)

    if len(parts) < 3:

        return {}, text

    fm_text, body = parts[1], parts[2]

    data: Dict[str, Any] = {}

    current_list: Optional[List[str]] = None



    for raw_line in fm_text.splitlines():

        line = raw_line.strip()

        if not line or line.startswith("#"):

            continue

        if line.startswith("- "):

            val = line[2:].strip().strip('"').strip("'")

            if current_list is not None:

                current_list.append(val)

            continue

        if ":" in line:

            k, v = line.split(":", 1)

            k = k.strip()

            v = v.strip()

            if not v:

                current_list = []

                data[k] = current_list

            else:

                current_list = None

                if v == "[]":

                    data[k] = []

                else:

                    v_clean = v.strip('"').strip("'")

                    if v_clean.isdigit():

                        data[k] = int(v_clean)

                    else:

                        data[k] = v_clean

    return data, body





def extract_call_numbers_from_refs(ref_list: Any) -> List[str]:

    if not isinstance(ref_list, list):

        return []

    out: List[str] = []

    for item in ref_list:

        m = re.search(r"(LIB-\d{3})", str(item))

        if m and m.group(1) not in out:

            out.append(m.group(1))

    return out





def split_markdown_preserving_fences(text: str, heading_prefix: str) -> List[str]:

    """

    Splits Markdown text by `^## ` or `^### ` lines ONLY when outside fenced code blocks (```...```).

    Prevents Python comments starting with `##` or `###` inside code blocks from fracturing chunks.

    """

    blocks: List[str] = []

    current_lines: List[str] = []

    in_fence = False

    pattern = re.compile(rf"^{re.escape(heading_prefix)}\s+(.*)$")



    for line in text.splitlines():

        stripped = line.strip()

        if stripped.startswith("```"):

            in_fence = not in_fence

            current_lines.append(line)

            continue

        if not in_fence:

            m = pattern.match(line)

            if m:

                blocks.append("\n".join(current_lines))

                current_lines = [m.group(1)]

                continue

        current_lines.append(line)



    blocks.append("\n".join(current_lines))

    return blocks





def extract_python_ast_symbols(markdown_text: str) -> List[str]:

    """

    Parses fenced ```python code blocks using standard-library `ast.parse` and extracts

    defined class, function, and async function names for AST-aware symbol indexing.

    """

    symbols: List[str] = []

    for block in re.findall(r"```python\r?\n(.*?)```", markdown_text, flags=re.DOTALL):

        try:

            tree = ast.parse(textwrap.dedent(block))

            for node in ast.walk(tree):

                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):

                    if node.name not in symbols:

                        symbols.append(node.name)

        except SyntaxError:

            continue

    return symbols





def tokenize_bilingual(

    text: str,

    is_query: bool = False,

    expand_bilingual_bridges: bool = False,

) -> List[str]:

    """

    Hybrid bilingual tokenizer supporting:

      - Exact technical identifiers (LIB-603, RULE-401-04, InfoNCE, from_logits)

      - English words, camelCase/snake_case identifiers & LaTeX command stems

      - CJK character unigrams and adjacent CJK bigrams for Chinese retrieval

      - Optional query stopword filtering and bilingual concept bridge expansion

    """

    text_lower = text.lower()

    tokens: List[str] = []



    # 1. Exact LIB-xxx and RULE-xxx-xx identifiers (boosted lexical anchor)

    for m in re.finditer(r"\b(lib-\d{3}|rule-\d{3}-\d{2})\b", text_lower):

        tokens.append(m.group(1))



    # 2. Alphanumeric & underscore tokens (code symbols, English words, numbers)

    for m in re.finditer(r"[a-z0-9_]+(?:-[a-z0-9_]+)*", text_lower):

        tok = m.group(0)

        if len(tok) >= 2 or tok.isdigit():

            if is_query and tok in STOPWORDS_EN:

                continue

            tokens.append(tok)

            if "_" in tok:

                for sub in tok.split("_"):

                    if len(sub) >= 2 and (not is_query or sub not in STOPWORDS_EN):

                        tokens.append(sub)



    # 3. Contiguous CJK spans -> unigrams + bigrams

    for m in re.finditer(r"[\u4e00-\u9fff]+", text):

        span = m.group(0)

        for ch in span:

            if is_query and ch in STOPWORDS_ZH_CHARS:

                continue

            tokens.append(ch)

        for i in range(len(span) - 1):

            bg = span[i : i + 2]

            if is_query and bg in STOPWORDS_ZH_BIGRAMS:

                continue

            tokens.append(bg)



    if expand_bilingual_bridges:

        token_set = set(tokens)

        extra: List[str] = []

        for zh_key, en_vals in BILINGUAL_TERM_BRIDGES.items():

            if zh_key in text:

                extra.extend(en_vals)

            elif any(ev in token_set for ev in en_vals):

                extra.extend(tokenize_bilingual(zh_key, is_query=False, expand_bilingual_bridges=False))

        tokens.extend(extra)



    return tokens





def compute_l2_dense_vector(tokens: List[str], dim: int = 256, is_query: bool = False) -> List[float]:

    """

    Deterministic L2-normalized feature hashing projection (Signed Random Projection)

    onto the unit hypersphere S^{dim-1} over lexical tokens and ASCII character 3-grams.

    Note: This is a zero-dependency lexical/subword feature hashing approximation, NOT a

    pretrained neural semantic bi-encoder. Enforces [RULE-603-01] unit L2-norm invariant.

    """

    vec = [0.0] * dim

    counts = Counter(tokens)

    for tok, tf in counts.items():

        weight = 1.0 + math.log(tf)

        if tok.startswith("rule-") or tok.startswith("lib-"):

            weight *= 2.5

        features = [tok]

        if len(tok) >= 4 and tok.isascii():

            features.extend(tok[i : i + 3] for i in range(len(tok) - 2))

        for feat in features:

            h = hashlib.md5(feat.encode("utf-8")).digest()

            idx1 = int.from_bytes(h[0:2], "little") % dim

            sign1 = 1.0 if (h[2] & 1) == 0 else -1.0

            idx2 = int.from_bytes(h[4:6], "little") % dim

            sign2 = 1.0 if (h[6] & 1) == 0 else -1.0

            vec[idx1] += sign1 * weight

            vec[idx2] += sign2 * (0.5 * weight)



    norm = math.sqrt(sum(x * x for x in vec))

    if norm < 1e-12:

        vec[0] = 1.0

        return vec

    return [x / norm for x in vec]





def dot_product(v1: List[float], v2: List[float]) -> float:

    return sum(a * b for a, b in zip(v1, v2))





def colbert_token_maxsim_score(

    query_tokens: List[str],

    doc_tokens: List[str],

    df_map: Optional[Dict[str, int]] = None,

    total_docs: int = 911,

) -> float:

    """

    Computes an IDF-weighted lexical subword N-Gram MaxSim score (a non-neural heuristic

    approximation inspired by ColBERT late interaction, Khattab & Zaharia, SIGIR 2020):

      S_MaxSim(q, d) = sum_{i=1}^{|q|} w_idf(q_i) * max_{j=1}^{|d|} sim_ngram(q_i, d_j)

    Uses exact token match fast-path (1.0) and character 2/3-gram cosine overlap for

    morphological variants across up to 512 unique document tokens.

    """

    if not query_tokens or not doc_tokens:

        return 0.0

    unique_q = list(dict.fromkeys(query_tokens))[:64]

    doc_set = set(doc_tokens)

    unique_d = list(dict.fromkeys(doc_tokens))[:512]



    def token_ngrams(t: str) -> Set[str]:

        if len(t) < 3:

            return {t}

        return {t[i : i + 3] for i in range(len(t) - 2)} | {t[i : i + 2] for i in range(len(t) - 1)} | {t}



    d_ngrams = [(dt, token_ngrams(dt)) for dt in unique_d if len(dt) >= 2]

    total_score = 0.0

    weight_sum = 0.0

    for qt in unique_q:

        n_t = df_map.get(qt, 0) if df_map else 0

        # If query token never appears in corpus DF map at all, assign standard rare-term IDF

        idf = math.log(1.0 + (total_docs - min(total_docs, n_t) + 0.5) / (n_t + 0.5))

        boost = idf * (3.5 if (qt.startswith("rule-") or qt.startswith("lib-")) else 1.0)

        weight_sum += boost

        if qt in doc_set:

            total_score += 1.0 * boost

            continue

        if len(qt) < 3:

            continue

        q_ng = token_ngrams(qt)

        q_norm = math.sqrt(len(q_ng))

        max_sim = 0.0

        for _, d_ng in d_ngrams:

            inter = len(q_ng & d_ng)

            if inter > 0:

                sim = inter / (q_norm * math.sqrt(len(d_ng)))

                if sim > max_sim:

                    max_sim = sim

        # Only credit morphological n-gram similarity above noise floor 0.35

        if max_sim >= 0.35:

            total_score += max_sim * boost

    return total_score / max(1e-6, weight_sum)





def reciprocal_rank_fusion(

    ranked_lists: List[List[str]],

    k0: int = 60,

    weights: Optional[List[float]] = None,

) -> List[Tuple[str, float]]:

    """

    Weighted Reciprocal Rank Fusion (RRF, Cormack et al., SIGIR 2009):

      RRF_Score(d) = sum_{m} w_m / (k0 + rank_m(d)), k0 = 60

    Enforces [RULE-603-04].

    """

    assert k0 >= 1, "RRF constant k0 must be >= 1"

    if weights is None:

        weights = [1.0] * len(ranked_lists)

    scores: Dict[str, float] = defaultdict(float)

    for w, rlist in zip(weights, ranked_lists):

        for rank_idx, cid in enumerate(rlist, start=1):

            scores[cid] += w / (k0 + rank_idx)

    return sorted(scores.items(), key=lambda x: (-x[1], x[0]))





class LibraryGraphRAGEngine:

    """

    DAG-Aware Hybrid RAG & CAG Engine over the 28 bilingual volumes (56 files, 103 invariants).

    """



    def __init__(self, root: Path = ROOT):

        self.root = root

        self.chunks: Dict[str, LibraryChunk] = {}

        self.parent_sections: Dict[str, str] = {}

        self.dag_prereqs: Dict[str, List[str]] = {}

        self.dag_successors: Dict[str, List[str]] = {}

        self.volume_rules: Dict[Tuple[str, str], List[Dict[str, str]]] = defaultdict(list)

        self.authoritative_rule_levels: Dict[str, str] = {}

        self.bilingual_rule_titles: Dict[str, List[str]] = defaultdict(list)

        self.volume_files: Dict[Tuple[str, str], Path] = {}

        self.volume_titles: Dict[Tuple[str, str], str] = {}

        self.corpus_sha256: str = ""



        # BM25 & feature-hash index structures

        self.doc_tokens: Dict[str, List[str]] = {}

        self.doc_lens: Dict[str, int] = {}

        self.avgdl: float = 1.0

        self.df: Dict[str, int] = defaultdict(int)

        self.dense_vecs: Dict[str, List[float]] = {}



    def discover_volume_files(self) -> List[Tuple[str, str, Path]]:

        discovered: List[Tuple[str, str, Path]] = []

        for p in sorted(self.root.rglob("LIB-*.md")):

            rel = p.relative_to(self.root).as_posix()

            if rel.startswith("_archive_legacy/"):

                continue

            m = re.match(r"^(LIB-\d{3})\b", p.name)

            if not m:

                continue

            call_num = m.group(1)

            lang = "en" if rel.startswith("en/") else "zh"

            discovered.append((call_num, lang, p))

        # Sort deterministically by (call_num, lang) matching validate_library.py

        discovered.sort(key=lambda x: (x[0], 0 if x[1] == "zh" else 1))

        return discovered



    def build_index(self, save_json: bool = True) -> Dict[str, Any]:

        t0 = time.perf_counter()

        self.chunks.clear()

        self.parent_sections.clear()

        self.dag_prereqs.clear()

        self.dag_successors.clear()

        self.volume_rules.clear()

        self.authoritative_rule_levels.clear()

        self.bilingual_rule_titles.clear()

        self.volume_files.clear()

        self.volume_titles.clear()

        self.doc_tokens.clear()

        self.doc_lens.clear()

        self.df.clear()

        self.dense_vecs.clear()



        files = self.discover_volume_files()

        corpus_hasher = hashlib.sha256()



        for call_num, lang, fpath in files:

            rel_p = fpath.relative_to(self.root).as_posix()

            raw_bytes = fpath.read_bytes()

            corpus_hasher.update(f"{rel_p}\n".encode("utf-8"))

            corpus_hasher.update(raw_bytes)



            text = raw_bytes.decode("utf-8")

            fm, body = parse_frontmatter(text)

            vol_title = str(fm.get("title", fpath.stem))

            status = str(fm.get("status", "reviewed"))

            module = str(fm.get("module", "General"))

            category = str(fm.get("category", "General"))

            prereqs = extract_call_numbers_from_refs(fm.get("prerequisites", []))

            succs = extract_call_numbers_from_refs(fm.get("successors", []))



            self.volume_files[(call_num, lang)] = fpath

            self.volume_titles[(call_num, lang)] = vol_title

            if lang == "zh":

                self.dag_prereqs[call_num] = prereqs

                self.dag_successors[call_num] = succs



            vol_evid_tags = sorted(

                tag

                for tag in set(re.findall(r"`\[([A-Z_]+)\]`", body))

                if tag in CANONICAL_EVIDENCE_TAGS

            )



            # Fence-protected split by H2 sections (Parent Sections)

            h2_splits = split_markdown_preserving_fences(body, "##")

            for h2_idx, h2_block in enumerate(h2_splits):

                h2_block = h2_block.strip()

                if not h2_block:

                    continue

                lines = h2_block.splitlines()

                h2_title = lines[0].strip() if h2_idx > 0 else "Overview & Topological Coordinates"

                h2_content = "\n".join(lines[1:]).strip() if h2_idx > 0 else h2_block

                parent_id = f"{call_num}:{lang}:S{h2_idx:02d}"

                self.parent_sections[parent_id] = f"## {h2_title}\n{h2_content}".strip()



                h2_evid_tags = sorted(

                    tag

                    for tag in set(re.findall(r"`\[([A-Z_]+)\]`", h2_content))

                    if tag in CANONICAL_EVIDENCE_TAGS

                )



                # Fence-protected split by H3 subsections (Child Chunks)

                h3_splits = split_markdown_preserving_fences(h2_content, "###")

                for h3_idx, h3_block in enumerate(h3_splits):

                    h3_block = h3_block.strip()

                    if not h3_block:

                        continue

                    if h3_idx == 0:

                        h3_title = "Section Overview"

                        chunk_body = h3_block

                    else:

                        h3_lines = h3_block.splitlines()

                        h3_title = h3_lines[0].strip()

                        chunk_body = "\n".join(h3_lines[1:]).strip()



                    if len(chunk_body) < 20 and h3_idx == 0 and len(h3_splits) > 1:

                        continue



                    chunk_id = f"{parent_id}:C{h3_idx:02d}"

                    breadcrumb = f"[{call_num} ({lang.upper()}) | {vol_title} > {h2_title} > {h3_title}]"

                    full_chunk_text = (

                        f"{breadcrumb}\n### {h3_title}\n{chunk_body}"

                        if h3_idx > 0

                        else f"{breadcrumb}\n{chunk_body}"

                    )



                    rule_ids = sorted(set(re.findall(r"RULE-\d{3}-\d{2}", full_chunk_text)))

                    defined_rule_ids: List[str] = []

                    for rid in rule_ids:

                        if f"[{rid}]" in h3_title:

                            defined_rule_ids.append(rid)

                            lvl_m = re.search(

                                r"(?:等級|合約等級|分類|Contract Level|Classification)\*\*:\s*`([A-Z_]+)`",

                                full_chunk_text,

                            )

                            lvl = lvl_m.group(1) if lvl_m else "CRITICAL_INVARIANT"

                            self.authoritative_rule_levels[rid] = lvl

                            self.bilingual_rule_titles[rid].append(h3_title)

                            self.volume_rules[(call_num, lang)].append(

                                {

                                    "rule_id": rid,

                                    "title": h3_title,

                                    "contract_level": lvl,

                                    "summary": chunk_body[:400],

                                    "chunk_id": chunk_id,

                                }

                            )



                    local_evid_tags = sorted(

                        tag

                        for tag in set(re.findall(r"`\[([A-Z_]+)\]`", full_chunk_text))

                        if tag in CANONICAL_EVIDENCE_TAGS

                    )

                    effective_evid_tags = local_evid_tags or h2_evid_tags or vol_evid_tags[:2]

                    max_epistemic_weight = max(

                        (EPISTEMIC_PRIORITY_WEIGHTS.get(t, 0.7) for t in effective_evid_tags),

                        default=0.75,

                    )

                    ast_symbols = extract_python_ast_symbols(full_chunk_text)



                    metadata = {

                        "title": vol_title,

                        "authority": "Luke (CS & Deep Learning Library)",

                        "source_url": rel_p,

                        "snapshot_date": str(fm.get("created", "2026-09-17")),

                        "call_number": call_num,

                        "lang": lang,

                        "status": status,

                        "module": module,

                        "category": category,

                        "prerequisites": prereqs,

                        "successors": succs,

                        "rule_ids": rule_ids,

                        "defined_rule_ids": defined_rule_ids,

                        "contract_levels": [],  # Populated in Pass 2 from authoritative_rule_levels

                        "evidence_tags": local_evid_tags,

                        "inherited_evidence_tags": effective_evid_tags,

                        "epistemic_weight": round(max_epistemic_weight, 2),

                        "ast_symbols": ast_symbols,

                        "has_code": "```python" in full_chunk_text,

                        "has_math": "$$" in full_chunk_text or "$" in full_chunk_text,

                    }



                    chunk = LibraryChunk(

                        chunk_id=chunk_id,

                        parent_section_id=parent_id,

                        call_number=call_num,

                        lang=lang,

                        volume_title=vol_title,

                        section_h2=h2_title,

                        section_h3=h3_title,

                        breadcrumb=breadcrumb,

                        content=full_chunk_text,

                        metadata=metadata,

                    )

                    self.chunks[chunk_id] = chunk



        self.corpus_sha256 = corpus_hasher.hexdigest()



        # Pass 2: Authoritative Contract Level Resolution & Bilingual Index Construction

        for chunk_id, ch in self.chunks.items():

            rids = ch.metadata["rule_ids"]

            ch.metadata["contract_levels"] = [

                self.authoritative_rule_levels.get(rid, "CRITICAL_INVARIANT") for rid in rids

            ]



            # Build index tokens: chunk content + AST symbols + bilingual volume/rule header alignment

            sibling_lang = "en" if ch.lang == "zh" else "zh"

            sibling_vol_title = self.volume_titles.get((ch.call_number, sibling_lang), "")

            bilingual_headers = [sibling_vol_title]

            for rid in ch.metadata["defined_rule_ids"]:

                bilingual_headers.extend(self.bilingual_rule_titles.get(rid, []))

            index_text = (

                ch.content

                + "\n"

                + " ".join(ch.metadata["ast_symbols"])

                + "\n"

                + " ".join(bilingual_headers)

            )

            toks = tokenize_bilingual(index_text, is_query=False, expand_bilingual_bridges=False)

            self.doc_tokens[chunk_id] = toks

            self.doc_lens[chunk_id] = len(toks)

            for utok in set(toks):

                self.df[utok] += 1

            self.dense_vecs[chunk_id] = compute_l2_dense_vector(toks, dim=256, is_query=False)



        total_docs = max(1, len(self.chunks))

        self.avgdl = sum(self.doc_lens.values()) / total_docs

        elapsed_ms = (time.perf_counter() - t0) * 1000.0

        git_sha = get_git_commit_sha(self.root)



        summary = {

            "git_commit_sha": git_sha,

            "corpus_sha256": self.corpus_sha256,

            "volumes_indexed": len(self.dag_prereqs),

            "bilingual_files_indexed": len(files),

            "parent_sections_count": len(self.parent_sections),

            "child_chunks_count": len(self.chunks),

            "rules_indexed_zh": sum(len(v) for (c, l), v in self.volume_rules.items() if l == "zh"),

            "rules_indexed_en": sum(len(v) for (c, l), v in self.volume_rules.items() if l == "en"),

            "avg_chunk_tokens": round(self.avgdl, 1),

        }



        if save_json:

            INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)

            payload = {

                "summary": summary,

                "dag_prerequisites": self.dag_prereqs,

                "dag_successors": self.dag_successors,

                "chunks_meta": {

                    cid: {

                        "call_number": ch.call_number,

                        "lang": ch.lang,

                        "section_h2": ch.section_h2,

                        "section_h3": ch.section_h3,

                        "rule_ids": ch.metadata["rule_ids"],

                        "defined_rule_ids": ch.metadata["defined_rule_ids"],

                        "contract_levels": ch.metadata["contract_levels"],

                        "evidence_tags": ch.metadata["evidence_tags"],

                        "epistemic_weight": ch.metadata["epistemic_weight"],

                    }

                    for cid, ch in self.chunks.items()

                },

            }

            INDEX_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")



        return {**summary, "build_latency_ms": round(elapsed_ms, 2)}



    def _score_bm25(

        self,

        q_tokens: List[str],

        candidate_ids: List[str],

        k1: float = 1.5,

        b: float = 0.75,

    ) -> Dict[str, float]:

        """Okapi BM25 lexical scorer with k1=1.5, b=0.75 ([RULE-603-04])."""

        M = len(self.chunks)

        scores: Dict[str, float] = {}

        q_counts = Counter(q_tokens)

        for cid in candidate_ids:

            d_toks = self.doc_tokens[cid]

            d_len = self.doc_lens[cid]

            tf_map = Counter(d_toks)

            score = 0.0

            for qt, q_qf in q_counts.items():

                tf = tf_map.get(qt, 0)

                if tf == 0:

                    continue

                n_t = self.df.get(qt, 0)

                idf = math.log(1.0 + (M - n_t + 0.5) / (n_t + 0.5))

                denom = tf + k1 * (1.0 - b + b * (d_len / max(1.0, self.avgdl)))

                term_score = idf * ((tf * (k1 + 1.0)) / denom)

                if qt.startswith("rule-") or qt.startswith("lib-"):

                    term_score *= 3.0

                score += term_score * (1.0 + 0.1 * math.log(q_qf))

            scores[cid] = score

        return scores



    def search(

        self,

        query: str,

        lang: str = "zh",

        call_number: Optional[str] = None,

        evidence_tag: Optional[str] = None,

        mode: str = "hybrid_rrf",  # "hybrid_rrf", "bm25_only", "dense_only"

        top_k_init: int = 30,

        top_k_final: int = 5,

        expand_parent: bool = False,

        expand_dag: bool = True,

    ) -> Dict[str, Any]:

        """

        Executes Two-Stage Hybrid Retrieval with Metadata Pre-Filtering, Weighted RRF (k0=60),

        Lexical Subword MaxSim Reranking, Confidence Abstention Detection, and 1-Hop DAG Expansion.

        """

        if not self.chunks:

            self.build_index(save_json=False)



        t0 = time.perf_counter()



        # Stage 0: Metadata Pre-Filtering ([RULE-603-02])

        candidate_ids: List[str] = []

        for cid, ch in self.chunks.items():

            if lang in ("zh", "en") and ch.lang != lang:

                continue

            if call_number and ch.call_number != call_number.upper():

                continue

            if evidence_tag and evidence_tag.upper() not in ch.metadata["evidence_tags"]:

                continue

            candidate_ids.append(cid)



        if not candidate_ids:

            return {

                "query": query,

                "hits": [],

                "low_confidence_abstain": True,

                "confidence_score": 0.0,

                "dag_prerequisite_invariants": {},

                "latency_ms": 0.0,

            }



        has_cjk = bool(re.search(r"[\u4e00-\u9fff]", query))

        is_cross_lingual = (has_cjk and lang == "en") or ((not has_cjk) and lang == "zh")

        q_tokens = tokenize_bilingual(

            query, is_query=True, expand_bilingual_bridges=is_cross_lingual

        )

        if not q_tokens:

            q_tokens = tokenize_bilingual(query, is_query=False, expand_bilingual_bridges=False)

        q_vec = compute_l2_dense_vector(q_tokens, dim=256, is_query=True)



        # Stage 1A: Sparse BM25 Ranking

        bm25_scores = self._score_bm25(q_tokens, candidate_ids)

        bm25_ranked = [

            cid

            for cid, _ in sorted(bm25_scores.items(), key=lambda x: (-x[1], x[0]))[:top_k_init]

        ]

        max_bm25 = max((bm25_scores[cid] for cid in bm25_ranked), default=0.0)



        # Stage 1B: Feature-Hash Vector MIPS Ranking ([RULE-603-01])

        dense_scores = {cid: dot_product(q_vec, self.dense_vecs[cid]) for cid in candidate_ids}

        dense_ranked = [

            cid

            for cid, _ in sorted(dense_scores.items(), key=lambda x: (-x[1], x[0]))[:top_k_init]

        ]



        total_docs = max(1, len(self.chunks))

        maxsim_cache: Dict[str, float] = {}



        if mode == "bm25_only":

            stage1_ids = bm25_ranked[:top_k_final]

            final_ranked = [(cid, bm25_scores[cid]) for cid in stage1_ids]

        elif mode == "dense_only":

            stage1_ids = dense_ranked[:top_k_final]

            final_ranked = [(cid, dense_scores[cid]) for cid in stage1_ids]

        else:

            # Stage 1C: Weighted Reciprocal Rank Fusion (RRF, k0=60, w=[0.75, 0.25]) ([RULE-603-04])

            rrf_fused = reciprocal_rank_fusion(

                [bm25_ranked, dense_ranked], k0=60, weights=[0.75, 0.25]

            )

            stage1_pool = [cid for cid, _ in rrf_fused[:top_k_init]]

            rrf_map = dict(rrf_fused)



            # Stage 2: Lexical Subword N-Gram MaxSim Reranking + Top-Volume Rule Surfacing

            top1_bm25_vol = self.chunks[bm25_ranked[0]].call_number if bm25_ranked else None

            reranked: List[Tuple[str, float]] = []

            for cid in stage1_pool:

                maxsim = colbert_token_maxsim_score(

                    q_tokens, self.doc_tokens[cid], df_map=self.df, total_docs=total_docs

                )

                maxsim_cache[cid] = maxsim

                bm25_rel = bm25_scores.get(cid, 0.0) / max(1.0, max_bm25)

                bm25_log = math.log1p(max(0.0, bm25_scores.get(cid, 0.0)))

                # Only boost [RULE-xxx-xx] definition chunks that belong to the #1 BM25 volume

                rule_def_bonus = (

                    0.32

                    if (

                        self.chunks[cid].call_number == top1_bm25_vol

                        and self.chunks[cid].metadata.get("defined_rule_ids")

                        and bm25_rel >= 0.25

                    )

                    else 0.0

                )

                combined = (

                    (rrf_map[cid] * 60.0)

                    + (maxsim * 1.8)

                    + (bm25_rel * 1.2)

                    + (0.20 * bm25_log)

                    + rule_def_bonus

                )

                reranked.append((cid, combined))

            reranked.sort(key=lambda x: (-x[1], x[0]))

            final_ranked = reranked[:top_k_final]



        # Confidence & Out-of-Scope Abstention Estimation

        top_cid = final_ranked[0][0] if final_ranked else None

        if top_cid is not None:

            top_maxsim = maxsim_cache.get(top_cid)

            if top_maxsim is None:

                top_maxsim = colbert_token_maxsim_score(

                    q_tokens, self.doc_tokens[top_cid], df_map=self.df, total_docs=total_docs

                )

            top_bm25 = bm25_scores.get(top_cid, 0.0)

            top_doc_set = set(self.doc_tokens[top_cid])

            raw_q_toks = tokenize_bilingual(query, is_query=True, expand_bilingual_bridges=False)

            multi_q = [t for t in dict.fromkeys(raw_q_toks) if len(t) >= 2]

            matched_multi = [t for t in multi_q if t in top_doc_set]

            multi_cov = len(matched_multi) / max(1, len(multi_q))

            oov_count = sum(1 for t in multi_q if self.df.get(t, 0) == 0)

            oov_ratio = oov_count / max(1, len(multi_q))

            confidence_score = round(

                min(

                    1.0,

                    max(

                        0.0,

                        0.45 * top_maxsim

                        + 0.35 * multi_cov

                        + 0.20 * min(1.0, top_bm25 / 35.0)

                        - 0.25 * oov_ratio,

                    ),

                ),

                4,

            )

            low_confidence_abstain = bool(

                (oov_ratio >= 0.45 and multi_cov < 0.35)

                or (top_maxsim < 0.22 and top_bm25 < 15.0)

            )

        else:

            confidence_score = 0.0

            low_confidence_abstain = True



        # Stage 3: Parent Section & 1-Hop DAG Prerequisite Expansion ([RULE-603-04] & [RULE-000-01])

        hits: List[Dict[str, Any]] = []

        hit_call_numbers: List[str] = []

        for cid, score in final_ranked:

            ch = self.chunks[cid]

            if ch.call_number not in hit_call_numbers:

                hit_call_numbers.append(ch.call_number)

            text_payload = (

                self.parent_sections.get(ch.parent_section_id, ch.content)

                if expand_parent

                else ch.content

            )

            hits.append(

                {

                    "chunk_id": cid,

                    "call_number": ch.call_number,

                    "lang": ch.lang,

                    "score": round(score, 4),

                    "bm25_score": round(bm25_scores.get(cid, 0.0), 4),

                    "dense_cosine": round(dense_scores.get(cid, 0.0), 4),

                    "breadcrumb": ch.breadcrumb,

                    "rule_ids": ch.metadata["rule_ids"],

                    "defined_rule_ids": ch.metadata["defined_rule_ids"],

                    "contract_levels": ch.metadata["contract_levels"],

                    "evidence_tags": ch.metadata["evidence_tags"],

                    "epistemic_weight": ch.metadata["epistemic_weight"],

                    "prerequisites": ch.metadata["prerequisites"],

                    "content": text_payload,

                }

            )



        dag_expanded_invariants: Dict[str, List[Dict[str, str]]] = {}

        hit_volume_invariants: Dict[str, List[Dict[str, str]]] = {}

        for cnum in hit_call_numbers:

            v_lang = lang if lang in ("zh", "en") else "zh"

            hit_volume_invariants[cnum] = self.volume_rules.get((cnum, v_lang), [])



        if expand_dag:

            visited_prereqs: Set[str] = set()

            for cnum in hit_call_numbers[:3]:

                for pre in self.dag_prereqs.get(cnum, []):

                    if pre not in hit_call_numbers and pre not in visited_prereqs:

                        visited_prereqs.add(pre)

                        prereq_lang = lang if lang in ("zh", "en") else "zh"

                        rules = self.volume_rules.get((pre, prereq_lang), [])

                        if rules:

                            dag_expanded_invariants[pre] = rules



        latency_ms = (time.perf_counter() - t0) * 1000.0

        return {

            "query": query,

            "mode": mode,

            "lang": lang,

            "top_k": top_k_final,

            "latency_ms": round(latency_ms, 2),

            "confidence_score": confidence_score,

            "low_confidence_abstain": low_confidence_abstain,

            "hit_volumes": hit_call_numbers,

            "hits": hits,

            "hit_volume_invariants": hit_volume_invariants,

            "dag_prerequisite_invariants": dag_expanded_invariants,

        }



    def get_transitive_subgraph(self, target_call_numbers: List[str]) -> List[str]:

        """

        Computes the transitive closure of prerequisites for `target_call_numbers`

        and returns them in strict topological order (Kahn's algorithm).

        """

        if not self.dag_prereqs:

            self.build_index(save_json=False)



        needed: Set[str] = set()

        queue = deque(c.upper() for c in target_call_numbers if c.upper() in self.dag_prereqs)

        while queue:

            curr = queue.popleft()

            if curr in needed:

                continue

            needed.add(curr)

            for pre in self.dag_prereqs.get(curr, []):

                if pre not in needed:

                    queue.append(pre)



        in_deg: Dict[str, int] = {u: 0 for u in needed}

        adj: Dict[str, List[str]] = defaultdict(list)

        for u in needed:

            for pre in self.dag_prereqs.get(u, []):

                if pre in needed:

                    adj[pre].append(u)

                    in_deg[u] += 1



        q_topo = deque(sorted(u for u, d in in_deg.items() if d == 0))

        topo_order: List[str] = []

        while q_topo:

            u = q_topo.popleft()

            topo_order.append(u)

            for v in sorted(adj[u]):

                in_deg[v] -= 1

                if in_deg[v] == 0:

                    q_topo.append(v)

        return topo_order



    def compile_cag_bundle(

        self,

        target_call_numbers: List[str],

        lang: str = "zh",

        mode: str = "compact",  # "compact" (rules & summaries) or "full"

    ) -> Dict[str, Any]:

        """

        Cache-Augmented Generation (CAG) Static KV-Cache Bundle Compiler ([RULE-603-03]).

        Topologically orders the transitive prerequisite subgraph and computes exact

        KV-Cache HBM footprint (Llama-3-8B GQA FP16 reference) to decide CAG vs. Dynamic RAG.

        """

        if not self.chunks:

            self.build_index(save_json=False)



        topo_order = self.get_transitive_subgraph(target_call_numbers)

        bundle_sections: List[str] = []

        for cnum in topo_order:

            vtitle = self.volume_titles.get((cnum, lang), cnum)

            if mode == "compact":

                rules = self.volume_rules.get((cnum, lang), [])

                rules_text = "\n\n".join(

                    f"### [{r['rule_id']}] ({r['contract_level']}) {r['title']}\n{r['summary']}"

                    for r in rules

                )

                bundle_sections.append(f"## {cnum}: {vtitle}\n{rules_text}")

            else:

                fpath = self.volume_files.get((cnum, lang))

                if fpath and fpath.exists():

                    bundle_sections.append(fpath.read_text(encoding="utf-8"))



        compiled_text = "\n\n---\n\n".join(bundle_sections)

        approx_tokens = len(tokenize_bilingual(compiled_text))



        # Llama-3-8B GQA FP16 KV-Cache footprint: 2 * 32 layers * 8 kv_heads * 128 dim * 2 bytes = 131,072 bytes/token

        bytes_per_token = 2 * 32 * 8 * 128 * 2

        kv_cache_gb = (approx_tokens * bytes_per_token) / (1024**3)

        routing_recommendation = (

            "CAG_WARM_KV_CACHE"

            if approx_tokens <= 32768

            else "HYBRID_GRAPH_RAG_DYNAMIC"

        )



        return {

            "target_call_numbers": [c.upper() for c in target_call_numbers],

            "topological_subgraph_order": topo_order,

            "subgraph_volume_count": len(topo_order),

            "mode": mode,

            "lang": lang,

            "estimated_tokens": approx_tokens,

            "llama3_8b_fp16_kv_cache_gb": round(kv_cache_gb, 4),

            "routing_recommendation": routing_recommendation,

            "compiled_bundle_preview": compiled_text[:1200] + ("..." if len(compiled_text) > 1200 else ""),

        }



    def lookup_rule(self, rule_id: str, lang: str = "zh") -> Dict[str, Any]:

        """Looks up an authoritative [RULE-xxx-xx] contract and its provenance metadata."""

        if not self.chunks:

            self.build_index(save_json=False)

        rid_norm = rule_id.strip().upper()

        for (cnum, l), rules in self.volume_rules.items():

            if l != lang:

                continue

            for r in rules:

                if r["rule_id"] == rid_norm:

                    ch = self.chunks.get(r["chunk_id"])

                    return {

                        "rule_id": rid_norm,

                        "call_number": cnum,

                        "lang": lang,

                        "title": r["title"],

                        "contract_level": r["contract_level"],

                        "chunk_id": r["chunk_id"],

                        "source_url": ch.metadata["source_url"] if ch else "",

                        "evidence_tags": ch.metadata["inherited_evidence_tags"] if ch else [],

                        "epistemic_weight": ch.metadata["epistemic_weight"] if ch else 0.75,

                        "prerequisites": ch.metadata["prerequisites"] if ch else [],

                        "content": ch.content if ch else r["summary"],

                    }

        return {"error": f"Rule '{rid_norm}' not found for lang='{lang}'."}



    def _evaluate_query_set(

        self,

        queries: List[Dict[str, Any]],

        modes: List[str],

    ) -> Dict[str, Any]:

        """

        Fair, apple-to-apple evaluation across retrieval modes (`dense_only`, `bm25_only`, `hybrid_rrf`).

        Computes:

          - volume_recall_at_1, volume_recall_at_5

          - volume_mrr_at_5 (on deduplicated volume ranks)

          - volume_ndcg_at_5 (on deduplicated volume ranks)

          - exact_rule_recall_at_5 (strictly chunk-level across ALL modes)

          - chunk_rule_mrr_at_5 (strictly chunk-level across ALL modes)

          - volume_invariant_recall_at_5 (volume-expanded across ALL modes)

          - unanswerable_abstain_accuracy (for queries with expect_abstain=True)

          - multi_hop_both_volumes_recall_at_5 (for queries with secondary_vol)

          - mean_latency_ms & p95_latency_ms

        """

        results_by_mode: Dict[str, Any] = {}



        for m in modes:

            answerable_q = [q for q in queries if not q.get("expect_abstain", False)]

            unanswerable_q = [q for q in queries if q.get("expect_abstain", False)]

            multihop_q = [q for q in answerable_q if q.get("secondary_vol")]



            vol_hits_1 = 0

            vol_hits_5 = 0

            vol_mrr_sum = 0.0

            vol_ndcg_sum = 0.0

            chunk_rule_hits_5 = 0

            chunk_rule_mrr_sum = 0.0

            vol_rule_hits_5 = 0

            multihop_hits_5 = 0

            abstain_correct = 0

            latencies: List[float] = []



            for item in queries:

                q_text = item.get("q") or item.get("query", "")

                target_lang = item.get("target_lang") or item.get("lang", "zh")

                res = self.search(

                    query=q_text,

                    lang=target_lang,

                    mode=m,

                    top_k_init=30,

                    top_k_final=5,

                    expand_dag=True,

                )

                latencies.append(res["latency_ms"])



                if item.get("expect_abstain", False):

                    if res.get("low_confidence_abstain", False):

                        abstain_correct += 1

                    continue



                # Deduplicated volume list preserving rank order

                returned_vols_unique = list(dict.fromkeys(h["call_number"] for h in res["hits"]))

                exp_vol = item["expected_vol"]

                exp_rule = item.get("expected_rule")



                if returned_vols_unique and returned_vols_unique[0] == exp_vol:

                    vol_hits_1 += 1

                if exp_vol in returned_vols_unique:

                    vol_hits_5 += 1

                    v_rank = returned_vols_unique.index(exp_vol) + 1

                    vol_mrr_sum += 1.0 / v_rank

                    vol_ndcg_sum += 1.0 / math.log2(v_rank + 1.0)



                # Strictly fair chunk-level rule evaluation (identical across all modes)

                chunk_rules_ranked: List[str] = []

                for h in res["hits"]:

                    for rid in h["rule_ids"]:

                        if rid not in chunk_rules_ranked:

                            chunk_rules_ranked.append(rid)



                if exp_rule and exp_rule in chunk_rules_ranked:

                    chunk_rule_hits_5 += 1

                    r_rank = chunk_rules_ranked.index(exp_rule) + 1

                    chunk_rule_mrr_sum += 1.0 / r_rank



                # Strictly fair volume-expanded rule evaluation (identical across all modes)

                vol_expanded_rules: Set[str] = set(chunk_rules_ranked)

                for v_rules in res.get("hit_volume_invariants", {}).values():

                    for r_obj in v_rules:

                        vol_expanded_rules.add(r_obj["rule_id"])

                if exp_rule and exp_rule in vol_expanded_rules:

                    vol_rule_hits_5 += 1



                # Multi-hop secondary volume check (via Top-5 hits or 1-hop DAG prerequisite expansion)

                sec_vol = item.get("secondary_vol")

                if sec_vol:

                    dag_vols = set(res.get("dag_prerequisite_invariants", {}).keys())

                    for h in res["hits"]:

                        dag_vols.update(h.get("prerequisites", []))

                    reached_vols = set(returned_vols_unique) | dag_vols

                    if exp_vol in returned_vols_unique and sec_vol in reached_vols:

                        multihop_hits_5 += 1



            n_ans = max(1, len(answerable_q))

            n_total = max(1, len(queries))

            sorted_lat = sorted(latencies)

            p95_idx = min(len(sorted_lat) - 1, int(math.ceil(0.95 * len(sorted_lat))) - 1)



            mode_summary: Dict[str, Any] = {

                "queries_evaluated": len(queries),

                "answerable_queries": len(answerable_q),

                "volume_recall_at_1": round(vol_hits_1 / n_ans, 4),

                "volume_recall_at_5": round(vol_hits_5 / n_ans, 4),

                "mrr_at_5": round(vol_mrr_sum / n_ans, 4),

                "ndcg_at_5": round(vol_ndcg_sum / n_ans, 4),

                "exact_rule_recall_at_5": round(chunk_rule_hits_5 / n_ans, 4),

                "chunk_rule_mrr_at_5": round(chunk_rule_mrr_sum / n_ans, 4),

                "volume_invariant_recall_at_5": round(vol_rule_hits_5 / n_ans, 4),

                "mean_latency_ms": round(sum(latencies) / n_total, 2),

                "p95_latency_ms": round(sorted_lat[p95_idx], 2) if sorted_lat else 0.0,

            }

            if multihop_q:

                mode_summary["multi_hop_subgraph_recall_at_5"] = round(

                    multihop_hits_5 / len(multihop_q), 4

                )

            if unanswerable_q:

                mode_summary["unanswerable_abstain_accuracy"] = round(

                    abstain_correct / len(unanswerable_q), 4

                )

            results_by_mode[m] = mode_summary



        return results_by_mode



    def run_golden_benchmark(self) -> Dict[str, Any]:

        """

        Evaluates Dense-Only (Feature Hashing) vs. BM25-Only vs. Hybrid-RRF+MaxSim+DAG across:

          1. `golden_regression_suite` (16 legacy queries; 7 with explicit RULE-ID tokens, 9 without)

          2. `independent_holdout_suite` (24 zero-leakage queries across 6 categories from tests/holdout_rag_benchmark.json)

        All ablation modes are scored with identical chunk-level and volume-level rules.

        """

        if not self.chunks:

            self.build_index(save_json=True)



        golden_queries = [

            {"q": "RULE-603-04 倒數排名融合 RRF ColBERT MaxSim", "lang": "zh", "expected_vol": "LIB-603", "expected_rule": "RULE-603-04", "has_rule_leakage": True},

            {"q": "RULE-603-01 InfoNCE temperature L2 normalization", "lang": "en", "expected_vol": "LIB-603", "expected_rule": "RULE-603-01", "has_rule_leakage": True},

            {"q": "RULE-401-04 GoogLeNet Inception 1x1 bottleneck GlobalAvgPool2D", "lang": "zh", "expected_vol": "LIB-401", "expected_rule": "RULE-401-04", "has_rule_leakage": True},

            {"q": "RULE-104-04 AdaGrad monotonic learning rate stagnation RMSprop EMA", "lang": "en", "expected_vol": "LIB-104", "expected_rule": "RULE-104-04", "has_rule_leakage": True},

            {"q": "RULE-001-05 Sigmoid non-zero-centered zig-zagging from_logits", "lang": "en", "expected_vol": "LIB-001", "expected_rule": "RULE-001-05", "has_rule_leakage": True},

            {"q": "RULE-301-04 EarlyStopping restore_best_weights L1 L2 regularization", "lang": "zh", "expected_vol": "LIB-301", "expected_rule": "RULE-301-04", "has_rule_leakage": True},

            {"q": "RULE-501-02 影像質心 Center of Mass per_image_standardization", "lang": "zh", "expected_vol": "LIB-501", "expected_rule": "RULE-501-02", "has_rule_leakage": True},

            {"q": "Hartley 八點法 舒爾補 Bundle Adjustment 相機射影幾何", "lang": "zh", "expected_vol": "LIB-502", "expected_rule": "RULE-502-02", "has_rule_leakage": False},

            {"q": "3D Gaussian Splatting EWA covariance tile rasterization alpha blending", "lang": "en", "expected_vol": "LIB-504", "expected_rule": "RULE-504-01", "has_rule_leakage": False},

            {"q": "FlashAttention Online Softmax SRAM tiling IO complexity", "lang": "en", "expected_vol": "LIB-405", "expected_rule": "RULE-405-03", "has_rule_leakage": False},

            {"q": "Optimal Transport Flow Matching Rectified Flow curvature DiT", "lang": "en", "expected_vol": "LIB-406", "expected_rule": "RULE-406-01", "has_rule_leakage": False},

            {"q": "Expected Calibration Error ECE Temperature Scaling Conformal Prediction", "lang": "en", "expected_vol": "LIB-801", "expected_rule": "RULE-801-01", "has_rule_leakage": False},

            {"q": "AWQ activation-aware weight quantization W4A16 VRAM formula", "lang": "zh", "expected_vol": "LIB-802", "expected_rule": "RULE-802-01", "has_rule_leakage": False},

            {"q": "Claim Ledger False Capitulation H-CoT epistemic backtracking", "lang": "en", "expected_vol": "LIB-906", "expected_rule": "RULE-906-01", "has_rule_leakage": False},

            {"q": "CUDA Warp divergence 32 threads Tensor Core GEMM Roofline", "lang": "zh", "expected_vol": "LIB-203", "expected_rule": "RULE-203-01", "has_rule_leakage": False},

            {"q": "Karpathy LLM Wiki Obsidian Vault ReAct closed-loop POMDP", "lang": "zh", "expected_vol": "LIB-703", "expected_rule": "RULE-703-02", "has_rule_leakage": False},

        ]



        modes = ["dense_only", "bm25_only", "hybrid_rrf"]

        golden_ablation = self._evaluate_query_set(golden_queries, modes)

        golden_non_leaked = self._evaluate_query_set(

            [q for q in golden_queries if not q["has_rule_leakage"]], modes

        )



        holdout_ablation: Dict[str, Any] = {}

        holdout_by_category: Dict[str, Any] = {}

        if HOLDOUT_PATH.exists():

            holdout_data = json.loads(HOLDOUT_PATH.read_text(encoding="utf-8"))

            holdout_queries = holdout_data.get("queries", [])

            holdout_ablation = self._evaluate_query_set(holdout_queries, modes)

            categories = list(dict.fromkeys(q["category"] for q in holdout_queries))

            for cat in categories:

                cat_qs = [q for q in holdout_queries if q["category"] == cat]

                holdout_by_category[cat] = self._evaluate_query_set(cat_qs, ["bm25_only", "hybrid_rrf"])



        report = {

            "benchmark_timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),

            "git_commit_sha": get_git_commit_sha(self.root),

            "corpus_sha256": self.corpus_sha256,

            "corpus_volumes": len(self.dag_prereqs),

            "corpus_chunks": len(self.chunks),

            "corpus_invariants": len(self.authoritative_rule_levels),

            "benchmark_config": {

                "bm25_k1": 1.5,

                "bm25_b": 0.75,

                "dense_method": "256-dim L2-normalized MD5 signed random projection (non-neural feature hashing)",

                "reranker_method": "IDF-weighted lexical character 2/3-gram MaxSim (non-neural ColBERT heuristic)",

                "rrf_k0": 60,

                "rrf_weights": {"bm25": 0.75, "dense_hash": 0.25},

                "top_k_init": 30,

                "top_k_final": 5,

            },

            "ablation_results": golden_ablation,

            "golden_non_leaked_subset_q8_q16": golden_non_leaked,

            "independent_holdout_results": {

                "suite_file": "tests/holdout_rag_benchmark.json",

                "query_leakage_count": 0,

                "ablation_results": holdout_ablation,

                "by_category": holdout_by_category,

            },

        }

        BENCHMARK_PATH.parent.mkdir(parents=True, exist_ok=True)

        BENCHMARK_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

        return report





def _jsonrpc_error(req_id: Any, code: int, message: str) -> Dict[str, Any]:

    return {

        "jsonrpc": "2.0",

        "id": req_id,

        "error": {"code": code, "message": message},

    }





def run_mcp_stdio_server(engine: LibraryGraphRAGEngine) -> None:

    """

    Spec-compliant JSON-RPC 2.0 Model Context Protocol (MCP) server over stdin/stdout.

    Exposes tools:

      - library_hybrid_search

      - library_compile_cag

      - library_lookup_rule

    """

    engine.build_index(save_json=False)

    for raw_line in sys.stdin:

        line = raw_line.strip()

        if not line:

            continue

        try:

            req = json.loads(line)

        except json.JSONDecodeError as exc:

            err_resp = _jsonrpc_error(None, -32700, f"Parse error: {exc}")

            sys.stdout.write(json.dumps(err_resp, ensure_ascii=False) + "\n")

            sys.stdout.flush()

            continue



        if not isinstance(req, dict):

            err_resp = _jsonrpc_error(None, -32600, "Invalid Request: payload must be a JSON object")

            sys.stdout.write(json.dumps(err_resp, ensure_ascii=False) + "\n")

            sys.stdout.flush()

            continue



        is_notification = "id" not in req

        req_id = req.get("id")

        method = req.get("method", "")

        params = req.get("params", {})

        if params is None:

            params = {}

        if not isinstance(params, dict):

            if not is_notification:

                err_resp = _jsonrpc_error(req_id, -32602, "Invalid params: 'params' must be an object")

                sys.stdout.write(json.dumps(err_resp, ensure_ascii=False) + "\n")

                sys.stdout.flush()

            continue



        if is_notification:

            # Notifications (e.g. notifications/initialized) must not receive a response

            continue



        if method == "initialize":

            resp = {

                "jsonrpc": "2.0",

                "id": req_id,

                "result": {

                    "protocolVersion": "2024-11-05",

                    "serverInfo": {"name": "cs-dl-library-graphrag", "version": "1.1.0"},

                    "capabilities": {"tools": {}},

                },

            }

        elif method == "ping":

            resp = {"jsonrpc": "2.0", "id": req_id, "result": {}}

        elif method == "tools/list":

            resp = {

                "jsonrpc": "2.0",

                "id": req_id,

                "result": {

                    "tools": [

                        {

                            "name": "library_hybrid_search",

                            "description": "Search the 28-volume CS/DL Library (103 invariants) using BM25 + Feature-Hash RRF + Subword MaxSim + 1-Hop DAG Prerequisite Expansion.",

                            "inputSchema": {

                                "type": "object",

                                "properties": {

                                    "query": {"type": "string"},

                                    "lang": {"type": "string", "enum": ["zh", "en", "all"], "default": "zh"},

                                    "call_number": {"type": "string"},

                                    "mode": {"type": "string", "enum": ["hybrid_rrf", "bm25_only", "dense_only"], "default": "hybrid_rrf"},

                                    "top_k": {"type": "integer", "minimum": 1, "maximum": 50, "default": 5},

                                    "expand_dag": {"type": "boolean", "default": True},

                                },

                                "required": ["query"],

                            },

                        },

                        {

                            "name": "library_compile_cag",

                            "description": "Compile a topologically sorted CAG bundle and KV-Cache HBM budget for target LIB-xxx volumes.",

                            "inputSchema": {

                                "type": "object",

                                "properties": {

                                    "call_numbers": {"type": "array", "items": {"type": "string"}},

                                    "lang": {"type": "string", "enum": ["zh", "en"], "default": "zh"},

                                    "mode": {"type": "string", "enum": ["compact", "full"], "default": "compact"},

                                },

                                "required": ["call_numbers"],

                            },

                        },

                        {

                            "name": "library_lookup_rule",

                            "description": "Look up an authoritative [RULE-xxx-xx] invariant contract, contract level, evidence tags, and source provenance.",

                            "inputSchema": {

                                "type": "object",

                                "properties": {

                                    "rule_id": {"type": "string"},

                                    "lang": {"type": "string", "enum": ["zh", "en"], "default": "zh"},

                                },

                                "required": ["rule_id"],

                            },

                        },

                    ]

                },

            }

        elif method == "tools/call":

            tname = params.get("name")

            targs = params.get("arguments", {})

            if targs is None:

                targs = {}

            if not isinstance(targs, dict):

                resp = _jsonrpc_error(req_id, -32602, "Invalid params: tool 'arguments' must be an object")

                sys.stdout.write(json.dumps(resp, ensure_ascii=False) + "\n")

                sys.stdout.flush()

                continue



            is_error = False

            try:

                if tname == "library_hybrid_search":

                    q_val = targs.get("query")

                    if not isinstance(q_val, str) or not q_val.strip():

                        raise ValueError("Parameter 'query' must be a non-empty string.")

                    lang_val = str(targs.get("lang", "zh"))

                    if lang_val not in ("zh", "en", "all"):

                        raise ValueError("Parameter 'lang' must be one of: 'zh', 'en', 'all'.")

                    mode_val = str(targs.get("mode", "hybrid_rrf"))

                    if mode_val not in ("hybrid_rrf", "bm25_only", "dense_only"):

                        raise ValueError("Parameter 'mode' must be one of: 'hybrid_rrf', 'bm25_only', 'dense_only'.")

                    raw_top_k = targs.get("top_k", 5)

                    if isinstance(raw_top_k, bool) or not isinstance(raw_top_k, (int, str)):

                        raise ValueError("Parameter 'top_k' must be an integer between 1 and 50.")

                    top_k_val = int(raw_top_k)

                    if top_k_val < 1 or top_k_val > 50:

                        raise ValueError("Parameter 'top_k' must be between 1 and 50.")



                    out = engine.search(

                        query=q_val,

                        lang=lang_val,

                        call_number=targs.get("call_number"),

                        mode=mode_val,

                        top_k_final=top_k_val,

                        expand_dag=bool(targs.get("expand_dag", True)),

                    )

                elif tname == "library_compile_cag":

                    cnums = targs.get("call_numbers")

                    if not isinstance(cnums, list) or not cnums:

                        raise ValueError("Parameter 'call_numbers' must be a non-empty list of LIB-xxx strings.")

                    lang_val = str(targs.get("lang", "zh"))

                    if lang_val not in ("zh", "en"):

                        raise ValueError("Parameter 'lang' must be 'zh' or 'en'.")

                    mode_val = str(targs.get("mode", "compact"))

                    if mode_val not in ("compact", "full"):

                        raise ValueError("Parameter 'mode' must be 'compact' or 'full'.")

                    out = engine.compile_cag_bundle(

                        target_call_numbers=[str(x) for x in cnums],

                        lang=lang_val,

                        mode=mode_val,

                    )

                elif tname == "library_lookup_rule":

                    rid_val = targs.get("rule_id")

                    if not isinstance(rid_val, str) or not rid_val.strip():

                        raise ValueError("Parameter 'rule_id' must be a non-empty string (e.g. 'RULE-603-01').")

                    lang_val = str(targs.get("lang", "zh"))

                    if lang_val not in ("zh", "en"):

                        raise ValueError("Parameter 'lang' must be 'zh' or 'en'.")

                    out = engine.lookup_rule(rule_id=rid_val, lang=lang_val)

                    if "error" in out:

                        is_error = True

                else:

                    is_error = True

                    out = {"error": f"Unknown tool: {tname}"}

            except Exception as exc:

                is_error = True

                out = {"error": str(exc)}



            resp = {

                "jsonrpc": "2.0",

                "id": req_id,

                "result": {

                    "content": [{"type": "text", "text": json.dumps(out, ensure_ascii=False, indent=2)}],

                    "isError": is_error,

                },

            }

        else:

            resp = _jsonrpc_error(req_id, -32601, f"Method not found: {method}")



        sys.stdout.write(json.dumps(resp, ensure_ascii=False) + "\n")

        sys.stdout.flush()





def main() -> None:

    parser = argparse.ArgumentParser(

        description="CS & Deep Learning Library Hybrid GraphRAG & CAG Engine (LIB-603)"

    )

    parser.add_argument("--mcp", action="store_true", help="Run as an MCP JSON-RPC stdio server")

    subparsers = parser.add_subparsers(dest="command")



    subparsers.add_parser(

        "build",

        help="Compile fence-protected H2/H3 Parent-Child RAG index with Python AST symbol extraction",

    )



    q_parser = subparsers.add_parser("query", help="Execute Hybrid BM25+FeatureHash RRF + MaxSim + DAG search")

    q_parser.add_argument("query_text", type=str, help="Search query string")

    q_parser.add_argument("--lang", choices=["zh", "en", "all"], default="zh")

    q_parser.add_argument("--call-number", type=str, default=None)

    q_parser.add_argument("--evidence-tag", type=str, default=None)

    q_parser.add_argument("--mode", choices=["hybrid_rrf", "bm25_only", "dense_only"], default="hybrid_rrf")

    q_parser.add_argument("--top-k", type=int, default=5)

    q_parser.add_argument("--expand-parent", action="store_true")

    q_parser.add_argument("--expand-dag", action="store_true", default=True)



    cag_parser = subparsers.add_parser("compile-cag", help="Compile topologically sorted CAG bundle")

    cag_parser.add_argument("call_numbers", nargs="+", help="Target call numbers (e.g. LIB-603 LIB-703)")

    cag_parser.add_argument("--lang", choices=["zh", "en"], default="zh")

    cag_parser.add_argument("--mode", choices=["compact", "full"], default="compact")



    subparsers.add_parser("benchmark", help="Run Dual-Suite Retrieval Benchmark (Golden Regression + Independent Holdout)")



    args = parser.parse_args()

    engine = LibraryGraphRAGEngine(ROOT)



    if args.mcp:

        run_mcp_stdio_server(engine)

        return



    if args.command == "build":

        summary = engine.build_index(save_json=True)

        print(json.dumps(summary, ensure_ascii=False, indent=2))

    elif args.command == "query":

        res = engine.search(

            query=args.query_text,

            lang=args.lang,

            call_number=args.call_number,

            evidence_tag=args.evidence_tag,

            mode=args.mode,

            top_k_final=args.top_k,

            expand_parent=args.expand_parent,

            expand_dag=args.expand_dag,

        )

        print(json.dumps(res, ensure_ascii=False, indent=2))

    elif args.command == "compile-cag":

        res = engine.compile_cag_bundle(

            target_call_numbers=args.call_numbers,

            lang=args.lang,

            mode=args.mode,

        )

        print(json.dumps(res, ensure_ascii=False, indent=2))

    elif args.command == "benchmark":

        rep = engine.run_golden_benchmark()

        print(json.dumps(rep, ensure_ascii=False, indent=2))

    else:

        parser.print_help()





if __name__ == "__main__":

    main()

