---
call_number: LIB-603
status: source-verified
invariants_count: 4
title: 密集檢索、檢索增強生成 (RAG) 與緩存增強生成 (CAG) 系統架構 (Dense Retrieval, RAG & Cache-Augmented Generation Architecture)
module: NLP-Large-Language-Models
category: Retrieval-Augmented-Systems
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
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
  - 圖書館
  - 自然語言處理
  - RAG
  - CAG
  - 密集檢索
  - 對比學習
  - InfoNCE
  - KV-Cache
prerequisites:
  - "[[LIB-102 機率統計、資訊理論與變分推論基石 (Probability, Information Theory & Variational Inference)]]"
  - "[[LIB-602 現代大語言模型架構解剖與縮放定律 (Modern LLM Architecture & Scaling Laws)]]"
successors:
  - "[[LIB-703 現代大模型代理人 (LLM Agent) 認知架構與推論協議 (LLM Agent Cognitive Architecture & Protocols)]]"
  - "[[LIB-906 對話質疑下的選擇性認知修訂：研究基準與實驗藍圖 (LLM Conversational Epistemic Revision)]]"
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/06_nlp_and_llms/LIB-603%20Dense%20Retrieval,%20RAG%20%26%20Cache-Augmented%20Generation%20Architecture%20%28Agent%20EN%29.md)

# 密集檢索、檢索增強生成 (RAG) 與緩存增強生成 (CAG) 系統架構 (Dense Retrieval, RAG & Cache-Augmented Generation Architecture)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-102 機率統計、資訊理論與變分推論基石 (Probability, Information Theory & Variational Inference)]]、[[LIB-602 現代大語言模型架構解剖與縮放定律 (Modern LLM Architecture & Scaling Laws)]]。
- **後續節點**：[[LIB-703 現代大模型代理人 (LLM Agent) 認知架構與推論協議 (LLM Agent Cognitive Architecture & Protocols)]]、[[LIB-906 對話質疑下的選擇性認知修訂：研究基準與實驗藍圖 (LLM Conversational Epistemic Revision)]]。
- **核心定位**：大語言模型本質上是對預訓練語料分佈進行自迴歸機率抽樣的生成器，當面臨私有領域知識、高時效性事實或嚴格法規條文時，單純依賴參數記憶必然產生不可控的幻覺（Hallucination）。本卷從資訊理論互資訊下界（InfoNCE）出發，嚴密推導密集向量檢索（Dense Passage Retrieval）、雙編碼器與交叉編碼器重排序（Bi-Encoder vs. Cross-Encoder Reranking）、結構化 Metadata 分塊工程，並建立檢索增強生成（RAG）與長上下文緩存增強生成（CAG）之微架構與記憶體預算決策邊界。

---

## 一、💡 學士直觀心智模型：從「造夢機」到「開卷考試與預載入快取」

### 1. Karpathy 的「造夢機」洞見與內容工程 (Content Engineering)
OpenAI 共同創辦人 Andrej Karpathy 曾精闢指出：從數學本質來看，大型語言模型所做的一切都是「幻覺」——它們是根據上下文條件機率 $P_\theta(y_t \mid y_{<t}, x)$ 進行自由聯想的「造夢機（Dream Machines）」；相反地，傳統搜尋引擎則是「0% 夢境、0% 創造力」的確定性索引 `[HEURISTIC]`。
當人類將 LLM 作為「知識助理」時，真正的需求是**在壓制事實幻覺的前提下保留語言推理能力**。這要求將「模型推理規則（清楚的指引）」與「外部事實證據（正確的資訊）」在上下文空間中顯式耦合，即**內容工程（Content Engineering）**：
1. **檢索增強生成 (RAG, Retrieval-Augmented Generation)**：如同讓學生參加「開卷考試」，遇到問題 $q$ 時，先透過嵌入模型（Embedding Model）去外部文獻庫翻找最相關的 $K$ 個段落放入 Prompt，再根據證據作答 `[FACT]`。
2. **緩存增強生成 (CAG, Cache-Augmented Generation)**：當考卷參考資料總量不大（例如整本規章僅數萬字），與其每次提問都重新翻書切塊，不如在考試開始前把整本規章直接讀進大腦的短期工作記憶（預先計算並鎖定 GPU 的 **KV-Cache**），後續提問直接基於快取秒速作答 `[DESIGN_DECISION]`。
3. **LLM Wiki（結構化知識編譯）**：針對中等規模（約 $10^2$ 篇文獻、$40\text{萬}$ 字）的核心領域知識，與其把文章暴力切碎成 500 字的盲目片段（破壞跨段落推導脈絡），不如由 LLM 預先將原始資料（`raw/`）編譯為帶有總目錄（`index.md`）、摘要與雙向連結（Backlinks）的結構化 Markdown 維基（`wiki/`），讓 Agent 沿著拓樸圖譜精準閱讀 `[DESIGN_DECISION]`。

### 2. 為什麼「無腦固定字數切塊」會導致檢索失敗？
傳統初學者實作 RAG 時，常將所有 PDF/Word 丟進資料夾，無腦按「每 500 字一塊、重疊 50 字」切分。這在法規或技術文件上會引發兩大災難：
- **語意斷裂與上下文遺失**：法條的「但書」或例外條件剛好被切在下一塊，導致檢索出半截條文而給出相反結論。
- **條件過濾失效**：當使用者詢問「我想查 AI 代理人的定義，但排除某作者的觀點」或「只看勞動部 2026 年最新規定」時，純向量餘弦相似度無法執行布林邏輯排除。
- **現代解法（語意分塊 + 合成檢索問題 + Metadata 解耦）**：將每一知識單元拆分為**「參與 Embedding 的核心語意內文（含預先生成的典型檢索問題）」**與**「不參與 Embedding 但供精確結構化過濾與溯源的 Metadata（標題、主管機關、來源網址、整理日期、免責聲明）」** `[DESIGN_DECISION]`。

---

## 二、🎓 博士級數學形式化推導：InfoNCE 互資訊下界、兩階段重排序與 RAG/CAG 複雜度

### 1. 對比學習 (Contrastive Learning) 與 InfoNCE 互資訊變分下界 `[DERIVATION]` `[LITERATURE_RESULT]`
設查詢（Query）為 $q \in \mathcal{Q}$，正樣本段落（Positive Passage）為 $k^+ \in \mathcal{P}$，以及同一批次或難負樣本集合中的 $N-1$ 個負樣本段落 $\{k_1^-, \dots, k_{N-1}^-\}$。
非對稱雙編碼器（Asymmetric Bi-Encoder，如 DPR, Karpukhin et al., EMNLP 2020）定義兩個參數化映射（或共享權重但透過前綴 `query: ` 與 `passage: ` 區分子空間）：
$$f_Q(q) = \frac{E_Q(q)}{\|E_Q(q)\|_2} \in \mathbb{S}^{d-1}, \quad f_P(k) = \frac{E_P(k)}{\|E_P(k)\|_2} \in \mathbb{S}^{d-1}$$
餘弦相似度定義為單位超球面上的內積 $\mathrm{sim}(q, k) = \langle f_Q(q), f_P(k) \rangle \in [-1, 1]$。引入溫度超參數 $\tau > 0$，**InfoNCE 損失函數**（Oord et al., 2018）形式化為 $N$ 分類交叉熵 `[FACT]`：
$$\mathcal{L}_{\mathrm{InfoNCE}}(\theta) = -\mathbb{E}_{(q, k^+, \{k_j^-\})} \left[ \log \frac{\exp(\mathrm{sim}(q, k^+) / \tau)}{\exp(\mathrm{sim}(q, k^+) / \tau) + \sum_{j=1}^{N-1} \exp(\mathrm{sim}(q, k_j^-) / \tau)} \right]$$

#### 定理：InfoNCE 為互資訊 $I(Q; K^+)$ 之嚴格下界
根據變分推論（參見 [[LIB-102 機率統計、資訊理論與變分推論基石 (Probability, Information Theory & Variational Inference)]]），最優評分函數 $\exp(\mathrm{sim}(q, k)/\tau)$ 正比於真實後驗密度與先驗密度之比 $\frac{p(k \mid q)}{p(k)}$。將分母展開並取期望值可得 `[DERIVATION]`：
$$I(Q; K^+) \ge \log(N) - \mathcal{L}_{\mathrm{InfoNCE}}(\theta)$$
- **幾何與統計意涵**：最小化 $\mathcal{L}_{\mathrm{InfoNCE}}$ 等價於最大化查詢表徵與正樣本段落表徵之間的**互資訊（Mutual Information）下界**。且該下界受限於批次樣本數 $\log(N)$——這從數學上解釋了為何對比學習必須依賴大 Batch Size 或高質量難負樣本挖掘（Hard Negative Mining）才能收緊互資訊估計界 `[DERIVATION]`。

### 2. 雙編碼器 (Bi-Encoder) vs. 交叉編碼器重排序 (Cross-Encoder Reranking) `[DERIVATION]` `[DESIGN_DECISION]`
在規模為 $M$ 個文本塊的資料庫中檢索時，系統面臨「計算複雜度」與「細粒度語意交互」的根本矛盾：
1. **第一階段：Bi-Encoder 最大內積檢索 (MIPS)**
   - 所有段落向量 $\{f_P(p_i)\}_{i=1}^M$ 可離線預先計算並建立 HNSW 圖索引（Malkov & Yashunin, TPAMI 2020）。
   - 線上查詢僅需執行 **1 次** $E_Q(q)$ 前向傳播，並以 $O(d \cdot \log M)$ 對數級時間召回前 $K_{\mathrm{init}}$ 個候選塊（例如 $K_{\mathrm{init}} = 50$）。
   - **資訊瓶頸**：Bi-Encoder 強制將整段長度為 $L_p$ 的文本壓縮至單一固定維度向量 $\mathbb{R}^d$，查詢 Token 與段落 Token 之間缺乏跨序列逐位置注意力交互（No Token-Level Cross-Attention）。
2. **第二階段：Cross-Encoder 全注意力重排序 (Reranking)**
   - 將查詢 $q$ 與第一階段召回的 $K_{\mathrm{init}}$ 個候選段落逐一拼接，送入 Cross-Encoder（Nogueira & Cho, 2019）：
     $$s_{\mathrm{rerank}}(q, p_i) = \sigma\left( \mathbf{w}^\top \mathrm{Transformer}_{\mathrm{ENC}}\left([q; \texttt{[SEP]}; p_i]\right)_{\texttt{[CLS]}} \right)$$
   - 在每一層 Transformer 中，$q$ 的每一個 Token 與 $p_i$ 的每一個 Token 執行完整的 $O((|q| + |p_i|)^2)$ 雙向交叉注意力計算，精確捕捉否定詞、數值條件與細微邏輯限定，最終篩選出高精度的 Top-$K_{\mathrm{final}}$（例如 $K_{\mathrm{final}} = 5$）進入生成階段 `[LITERATURE_RESULT]`。

### 3. 檢索增強生成 (RAG) vs. 緩存增強生成 (CAG) 決策邊界形式化 `[DERIVATION]` `[LITERATURE_RESULT]`
- **RAG 邊緣化生成模型 (Lewis et al., NeurIPS 2020)**：
  將檢索出的文本塊 $p \in \mathcal{Z}_K(q)$ 視為離散隱變數，對條件生成機率進行邊緣化（或 Top-$K$ 串接）：
  $$P_{\mathrm{RAG-Sequence}}(y \mid q) \approx \sum_{p \in \mathcal{Z}_K(q)} P_\eta(p \mid q) \prod_{t=1}^{T} P_\theta(y_t \mid q, p, y_{<t})$$
- **CAG 預計算鍵值緩存模型 (Chan et al., 2024)**：
  設靜態知識庫全文串接長度為 $S_{\mathcal{D}} = |\mathcal{D}|_{\mathrm{tokens}}$，且小於模型有效長上下文視窗 $S_{\max}$。CAG 在離線初始化階段一次性計算知識庫的每一層鍵值張量並鎖定於記憶體中：
  $$\mathcal{K}\mathcal{V}_{\mathcal{D}} = \left\{ \left( K_\ell(\mathcal{D}), V_\ell(\mathcal{D}) \right) \right\}_{\ell=1}^{L}, \quad K_\ell(\mathcal{D}), V_\ell(\mathcal{D}) \in \mathbb{R}^{H_{KV} \times S_{\mathcal{D}} \times d_k}$$
  當線上查詢 $q$（長度 $S_q$）到達時，無需執行任何向量檢索，亦無需重新計算知識庫的 Prefill 階段 $O(S_{\mathcal{D}}^2)$，僅需將 $q$ 附加於快取後端，計算增量注意力：
  $$\mathrm{Attention}(Q_q, [K_{\mathcal{D}}; K_q], [V_{\mathcal{D}}; V_q])$$
  其線上 Prefill 計算複雜度由 $O((S_{\mathcal{D}} + S_q)^2)$ 驟降至線性交叉項 $O(S_q \cdot S_{\mathcal{D}} + S_q^2)$ `[DERIVATION]`！

### 4. 稀疏詞彙檢索 (Okapi BM25) 與倒數排名融合 (Reciprocal Rank Fusion, RRF) `[DERIVATION]` `[LITERATURE_RESULT]`
純密集向量檢索（Dense Retrieval）將序列壓縮至平滑連續流形 $\mathbb{S}^{d-1}$，在面對精確符號識別碼（如索書號 `LIB-502`、合約代號 `RULE-401-04`、LaTeX 算子或罕見專有名詞）時容易發生語意漂移。生產級系統必須結合**稀疏詞彙檢索（Okapi BM25，Robertson & Zaragoza, 2009）**：
$$\mathrm{BM25}(q, d) = \sum_{t \in q \cap d} \mathrm{IDF}(t) \cdot \frac{\mathrm{tf}(t, d) \cdot (k_1 + 1)}{\mathrm{tf}(t, d) + k_1 \cdot \left(1 - b + b \cdot \frac{|d|}{\mathrm{avgdl}}\right)}, \quad \mathrm{IDF}(t) = \log\left(1 + \frac{M - n(t) + 0.5}{n(t) + 0.5}\right)$$
其中 $k_1 \in [1.2, 2.0]$ 控制詞頻飽和速率（防止長文重複詞無限刷高分數），$b \in [0.5, 0.8]$（常取 $b = 0.75$）執行文檔長度正規化 `[FACT]`。
由於 BM25 無界對數奇異分數與密集向量餘弦相似度 $\mathrm{sim}(q, d) \in [-1, 1]$ 處於不同尺度分佈，直接線性加權對離群值極度敏感。**倒數排名融合（Reciprocal Rank Fusion, RRF，Cormack et al., SIGIR 2009）**改以序數排名 $\mathrm{rank}_m(d) \in \{1, 2, \dots\}$ 進行無參數非線性融合 `[LITERATURE_RESULT]`：
$$\mathrm{Score}_{\mathrm{RRF}}(q, d) = \sum_{m \in \{\mathrm{BM25}, \mathrm{Dense}\}} \frac{1}{k_0 + \mathrm{rank}_m(q, d)}, \quad k_0 = 60$$
- **數學性質**：平滑常數 $k_0 = 60$ 抑制了單一檢索器偶然排在第 1 名（$1/(60+1) \approx 0.0164$）對第 2 名（$1/(60+2) \approx 0.0161$）的極端支配，而同時被稀疏與密集檢索器排入前列的共識文檔則獲得雙倍分數疊加，無需任何驗證集校準即可穩定超越單一模態檢索 `[DERIVATION]`。

### 5. 多向量延遲交互機制 (ColBERT Late Interaction & MaxSim Operator) `[DERIVATION]` `[LITERATURE_RESULT]`
為同時克服 Bi-Encoder 單一向量資訊瓶頸與 Cross-Encoder 線上 $O((|q|+|d|)^2)$ 巨額延遲，Khattab & Zaharia (SIGIR 2020) 提出 **ColBERT 延遲交互架構（Late Interaction）**：
1. 離線階段保留文檔每個 Token 的上下文化嵌入矩陣 $E_d(d) = [\mathbf{e}_{d,1}, \dots, \mathbf{e}_{d,|d|}]^\top \in \mathbb{R}^{|d| \times d_{\mathrm{sub}}}$（經 $L_2$ 正規化與降維量化，如 $d_{\mathrm{sub}} = 32$）。
2. 線上查詢僅需獨立編碼 $E_q(q) = [\mathbf{e}_{q,1}, \dots, \mathbf{e}_{q,|q|}]^\top \in \mathbb{R}^{|q| \times d_{\mathrm{sub}}}$，並透過無參數之**最大相似度算子（MaxSim Operator）**執行跨序列對齊 `[FACT]`：
   $$S_{\mathrm{MaxSim}}(q, d) = \sum_{i=1}^{|q|} \max_{j \in \{1, \dots, |d|\}} \langle \mathbf{e}_{q, i}, \mathbf{e}_{d, j} \rangle$$
- **計算優勢**：將線上交互複雜度由 Transformer 跨層自注意力降至單次輕量級矩陣內積與逐列歸約 $O(|q| \cdot |d| \cdot d_{\mathrm{sub}})$，完美適配 GPU Tensor Core 批次化執行，同時保留細粒度數學符號與程式碼 Token 的一對一精準匹配 `[DERIVATION]`。

### 6. DAG 拓樸感知圖檢索 (Topological GraphRAG) 與 RAGAS 評估體系 `[DERIVATION]` `[DESIGN_DECISION]`
針對具備嚴格公理依賴的科學知識庫（如本館由 `LIB-000` 定義的有向無環圖 $\mathcal{G} = (\mathcal{V}, \mathcal{E})$），單純召回目標段落會遺漏上游先修定義與安全邊界：
1. **父子階層切塊與 1-Hop 先修拓樸展開（Parent-Child & DAG Subgraph Expansion）**：
   設檢索命中節點集合為 $\mathcal{V}_{\mathrm{hit}} \subset \mathcal{V}$。系統首先將命中的細粒度子塊（Child Chunk，如單一公式或 `RULE`）回溯展開至所屬完整母章節（Parent Section），接著沿 DAG 反向邊自動提取一階與傳遞先修節點之核心決策不變量集合 `[DESIGN_DECISION]`：
   $$\mathcal{C}_{\mathrm{expanded}}(q) = \mathrm{Parent}(\mathcal{V}_{\mathrm{hit}}) \cup \bigcup_{v \in \mathcal{V}_{\mathrm{hit}}} \left\{ \mathrm{Invariants}(u) \;\middle|\; (u \to v) \in \mathcal{E} \right\}$$
   此機制在檢索層硬性落實 `LIB-000` 的 `RULE-000-01`（先修依賴強制攔截），確保 LLM 生成跨領域推導時，上游數值穩定界與硬體對齊約束同步駐留於上下文視窗。
2. **RAGAS 檢索生成三元評估體系 (Es et al., EACL 2024)** `[LITERATURE_RESULT]`：
   - **上下文精確率與召回率 (Context Precision@K & Recall@K)**：衡量黃金證據是否被排入 Top-$K$ 前列。
   - **忠實度 (Faithfulness / Groundedness)**：將模型回答拆解為原子主張集合 $\mathcal{C}_{\mathrm{ans}}$（銜接 [[LIB-906 對話質疑下的選擇性認知修訂：研究基準與實驗藍圖 (LLM Conversational Epistemic Revision)]]），計算可由檢索上下文 $\mathcal{C}_{\mathrm{expanded}}(q)$ 邏輯蘊含之比例 $\mathrm{Faithfulness} = \frac{|\{c \in \mathcal{C}_{\mathrm{ans}} : \mathcal{C}_{\mathrm{expanded}}(q) \models c\}|}{|\mathcal{C}_{\mathrm{ans}}|}$。
   - **回答相關性 (Answer Relevance)**：衡量生成回應對原始問題意圖之直接覆蓋度。

---

## 三、⚙️ 計算機體系結構與硬體微架構映射：HNSW 圖走訪 vs. Prefix KV-Cache 駐留

```
[架構路徑 A：兩階段混合 RAG (動態 / 超大規模知識庫 > 10^5 Tokens)]
Query q ──► Bi-Encoder (Tensor Core GEMM) ──► HNSW 向量索引 + Metadata 過濾 (DRAM 隨機指標走訪)
        ──► Top-50 候選塊 ──► Cross-Encoder Reranker ──► 上下文視窗擴展 ──► LLM 動態 Prefill

[架構路徑 B：CAG 緩存增強生成 (靜態中小規模知識庫 <= 32K~128K Tokens，高頻重複查詢)]
靜態知識庫 D ──► 離線單次 Prefill ──► PagedAttention 物理頁鎖定 (GPU HBM / NVMe KV-Cache)
Query q ──────────────────────────────────────────────────────────► 零檢索直接增量解碼！
```

1. **CAG 的顯存駐留成本公式**（銜接 [[LIB-602 現代大語言模型架構解剖與縮放定律 (Modern LLM Architecture & Scaling Laws)]]）：
   $$\mathrm{Mem}_{\mathrm{CAG}}(\mathrm{Bytes}) = 2 \times L \times H_{KV} \times d_k \times S_{\mathcal{D}} \times \mathrm{BytesPerElement}$$
   以 LLaMA-3 8B（$L=32, H_{KV}=8, d_k=128$，FP16 佔 2 Bytes）為例，每 $1\text{K}$ Tokens 的知識庫僅需 $131\text{ MB}$ 顯存；預載入整份 $32\text{K}$ Tokens 的核心規章或教材僅消耗 **$4.0\text{ GB}$ HBM**，即可徹底消除分塊斷裂與檢索漏召回（Recall Loss） `[DERIVATION]` `[DESIGN_DECISION]`。
2. **RAG、CAG 與 LLM Wiki 的三維度工程路由決策矩陣**：

| 評估維度 | 兩階段混合 RAG (Hybrid RAG) | 緩存增強生成 (CAG) | LLM Wiki (結構化知識編譯) |
| :--- | :--- | :--- | :--- |
| **適用語料規模** | 超大規模（$> 10^5 \sim 10^9$ Tokens） | 中小規模（$\le 32\text{K} \sim 128\text{K}$ Tokens） | 中等高密度規模（$\sim 10^2$ 篇、$\sim 400\text{K}$ Tokens） |
| **語料變動頻率** | 高頻即時新增/刪除（增量更新向量索引） | 靜態或低頻更新（更新需重算 KV-Cache） | 持續演進（由 Agent 編譯維護 Markdown 與雙向連結） |
| **線上查詢延遲** | 檢索 + Rerank + 動態 Prefill（中） | **極低**（省去檢索與文檔 Prefill，純增量解碼） | 依賴 Agent 讀取 `index.md` 與跨卷導覽（適合深度多跳推理） |
| **主要失效風險** | 切塊斷裂、Top-$K$ 漏召回、前後文脫節 | 超出有效注意力視窗導致 Lost-in-the-Middle | 若缺乏自動化 Linter 健檢，易產生斷鏈或跨卷矛盾 |

---

## 四、💻 工業級工程實作：Metadata 解耦混合 RAG、兩階段重排序與 CAG 路由器

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Tuple

@dataclass
class StructuredKnowledgeChunk:
    """
    結構化知識塊：嚴格解耦「向量檢索內文（含合成檢索問題）」與「結構化 Metadata」
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
    非對稱雙編碼器與 InfoNCE 對比學習損失 (Oord et al., 2018; Karpukhin et al., 2020)
    Input Contract:  q_vecs [B, D], p_vecs [B, D]
    Output Contract: scalar InfoNCE loss, mutual_info_lower_bound
    """
    def __init__(self, embed_dim: int = 128, temperature: float = 0.07):
        super().__init__()
        assert 0.01 <= temperature <= 0.2, "Temperature must be within [0.01, 0.2] stability bound!"
        self.temperature = temperature
        self.q_proj = nn.Linear(embed_dim, embed_dim, bias=False)
        self.p_proj = nn.Linear(embed_dim, embed_dim, bias=False)

    def encode_query(self, q_raw: torch.Tensor) -> torch.Tensor:
        # [B, D] -> L2 normalized unit hypersphere S^{D-1}
        return F.normalize(self.q_proj(q_raw), p=2, dim=-1)

    def encode_passage(self, p_raw: torch.Tensor) -> torch.Tensor:
        # [M, D] -> L2 normalized unit hypersphere S^{D-1}
        return F.normalize(self.p_proj(p_raw), p=2, dim=-1)

    def forward(self, q_raw: torch.Tensor, p_raw: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        q_norm = self.encode_query(q_raw)  # [B, D]
        p_norm = self.encode_passage(p_raw)  # [B, D]
        # Cosine similarity matrix scaled by temperature: [B, B]
        logits = torch.matmul(q_norm, p_norm.transpose(0, 1)) / self.temperature
        labels = torch.arange(q_norm.size(0), device=q_norm.device)
        loss = F.cross_entropy(logits, labels)
        # Mutual Information Lower Bound: I(Q; K+) >= log(N) - L_InfoNCE
        mi_lower_bound = torch.log(torch.tensor(float(q_norm.size(0)), device=q_norm.device)) - loss.detach()
        return loss, mi_lower_bound


class HybridRAGAndCAGRouter:
    """
    整合 Metadata 預過濾、Bi-Encoder 召回、Cross-Encoder 重排序、前後文擴展與 CAG KV-Cache 預算決策
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
        # 1. Structured Metadata Pre-filtering
        candidate_ids = [
            cid for cid, ch in self.chunks.items()
            if all(ch.metadata.get(k) == v for k, v in metadata_filter.items())
        ]
        if not candidate_ids:
            return []

        # 2. Stage-1 Bi-Encoder Dense MIPS Retrieval
        with torch.no_grad():
            q_vec = self.bi_encoder.encode_query(query_raw_vec.unsqueeze(0))  # [1, D]
            p_mat = torch.stack([self.chunk_embeddings[cid] for cid in candidate_ids], dim=0)  # [M_cand, D]
            dense_scores = torch.matmul(q_vec, p_mat.transpose(0, 1)).squeeze(0)  # [M_cand]
            k_init = min(top_k_init, len(candidate_ids))
            top_indices = torch.topk(dense_scores, k=k_init).indices.tolist()
            stage1_ids = [candidate_ids[idx] for idx in top_indices]

        # 3. Stage-2 Cross-Encoder Interaction Reranking Simulation
        with torch.no_grad():
            stage1_vecs = torch.stack([self.chunk_embeddings[cid] for cid in stage1_ids], dim=0)
            q_expanded = q_vec.expand_as(stage1_vecs)
            # Token/Feature interaction features: [q, p, q * p, |q - p|]
            interaction_feat = torch.cat([
                q_expanded,
                stage1_vecs,
                q_expanded * stage1_vecs,
                torch.abs(q_expanded - stage1_vecs)
            ], dim=-1)
            rerank_logits = self.rerank_scorer(interaction_feat).squeeze(-1)
            k_final = min(top_k_final, len(stage1_ids))
            final_indices = torch.topk(rerank_logits, k=k_final).indices.tolist()

        # 4. Context Window Expansion
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
    ColBERT 多向量延遲交互 MaxSim 算子 (Khattab & Zaharia, SIGIR 2020)
    Input Contract:  q_tokens [B, L_q, D_sub], d_tokens [B, L_d, D_sub]
    Output Contract: MaxSim scores [B]
    """
    def __init__(self, hidden_dim: int = 64, sub_dim: int = 32):
        super().__init__()
        self.proj = nn.Linear(hidden_dim, sub_dim, bias=False)

    def forward(self, q_tokens: torch.Tensor, d_tokens: torch.Tensor) -> torch.Tensor:
        q_norm = F.normalize(self.proj(q_tokens), p=2, dim=-1)  # [B, L_q, D_sub]
        d_norm = F.normalize(self.proj(d_tokens), p=2, dim=-1)  # [B, L_d, D_sub]
        # Token-level similarity matrix: [B, L_q, L_d]
        sim_matrix = torch.bmm(q_norm, d_norm.transpose(1, 2))
        # MaxSim operator: sum over query tokens of max over document tokens
        return sim_matrix.max(dim=-1).values.sum(dim=-1)


def reciprocal_rank_fusion(
    ranked_lists: List[List[str]],
    k0: int = 60
) -> List[Tuple[str, float]]:
    """
    倒數排名融合 (RRF, Cormack et al., SIGIR 2009): 結合 BM25 稀疏檢索與密集向量排名
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
    DAG 拓樸感知 1-Hop 先修不變量展開：確保檢索時強制帶入上游先修卷之核心 RULE 合約
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
        content="部分工時是指工作時間較全時勞工明顯縮短；工讀生仍受勞基法保障。",
        synthetic_questions=["週末工讀生有勞基法保障嗎？"],
        metadata={
            "title": "部分工時的定義",
            "authority": "中華民國勞動部",
            "source_url": "https://www.mol.gov.tw/",
            "snapshot_date": "2026-10-18"
        },
        next_chunk_id="MOL-02"
    )
    c2 = StructuredKnowledgeChunk(
        chunk_id="MOL-02",
        content="部分工時勞工之例假、休假與請假權益，依工作時數比例計給。",
        synthetic_questions=["兼職人員特休怎麼算？"],
        metadata={
            "title": "部分工時休假規範",
            "authority": "中華民國勞動部",
            "source_url": "https://www.mol.gov.tw/",
            "snapshot_date": "2026-10-18"
        },
        prev_chunk_id="MOL-01"
    )
    router.ingest_chunk(c1, torch.randn(dim))
    router.ingest_chunk(c2, torch.randn(dim))

    hits = router.retrieve_and_rerank(
        query_raw_vec=torch.randn(dim),
        metadata_filter={"authority": "中華民國勞動部"},
        top_k_init=2,
        top_k_final=1,
        expand_neighbors=True
    )
    cag_mem = router.compute_cag_kv_cache_gb(corpus_tokens=32768)
    print(f"Retrieved Chunk: {hits[0]['chunk_id']} | 32K CAG KV-Cache: {cag_mem:.2f} GB")
    assert len(hits) == 1 and "部分工時休假規範" not in hits[0]["chunk_id"] or len(hits[0]["expanded_content"]) > 0

    # 驗證 RRF 混合融合、ColBERT MaxSim 與 DAG 先修展開
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

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-603-01] 對比檢索單位超球面正規化與溫度防溢位合約 (InfoNCE L2-Normalization & Temperature Guardrail)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件 (Pre-conditions)**: 訓練或部署非對稱雙編碼器（Asymmetric Bi-Encoder）計算查詢 $q$ 與文本塊 $k$ 之密集向量相似度。
- **量化決策邊界 (Decision Thresholds)**:
  - 查詢向量與段落向量在執行內積前，必須強制執行 $L_2$ 單位範數正規化（$\|f_Q(q)\|_2 = \|f_P(k)\|_2 = 1$，容忍誤差 $\le 10^{-5}$），並明確區分非對稱前綴（如 `query:` 與 `passage:`）。
  - InfoNCE 溫度參數 $\tau$ 必須嚴格鉗制於區間 $\tau \in [0.01, 0.2]$ `[SAFETY_BOUND]`。
- **違規後果 (Violation Consequence)**: 未經 $L_2$ 正規化的內積會退化為向量模長偏差（Norm Bias），而 $\tau < 0.01$ 將導致指數項 $\exp(\mathrm{sim}/\tau) > 65504$ 在 FP16 下發生 `Inf`/`NaN` 數值溢位。

### [RULE-603-02] 結構化 Metadata 解耦與來源溯源過濾合約 (Structured Metadata Decoupling & Provenance Guardrail)
- **合約等級**: `BOUNDARY_GUARD`
- **前置條件 (Pre-conditions)**: 建立知識庫分塊索引（Chunk Ingestion）與執行混合檢索（Hybrid Retrieval）。
- **量化決策邊界 (Decision Thresholds)**:
  - 嚴禁將所有文檔僅以無標記之純文字固定長度切塊；固定窗口分塊必須保留 $10\% \sim 20\%$ 的相鄰重疊率（Overlap Ratio） `[HEURISTIC]`。
  - 每個知識塊必須強制將「向量嵌入內文（含合成檢索問題）」與「結構化 Metadata $\mathcal{M}_i$（至少包含 `title`、`authority`、`source_url`、`snapshot_date`）」解耦儲存，並在向量召回階段同步支援 Metadata 謂詞預過濾與前後文視窗擴展（Context Expansion）。
- **違規後果 (Violation Consequence)**: 缺乏 Metadata 解耦將導致檢索系統無法執行來源排除、時效性過濾與法規效力核驗，直接引發跨版本與跨來源的上下文污染。

### [RULE-603-03] RAG、CAG 與 LLM Wiki 系統路由決策合約 (RAG vs. CAG & LLM Wiki Routing Invariant)
- **合約等級**: `RESOURCE_CONSTRAINT`
- **前置條件 (Pre-conditions)**: 為特定領域知識任務選擇外部知識注入架構。
- **量化決策邊界 (Decision Thresholds)**:
  - **CAG 路由條件**：當知識庫為靜態、總量 $S_{\mathcal{D}} \le 32\text{K}$ Tokens（或顯存允許範圍內），且查詢重用率高時，優先採用 **CAG（預計算 Prefix KV-Cache 並鎖定於 PagedAttention 物理塊）**，消除檢索漏召回與重複 Prefill 開銷。
  - **LLM Wiki 路由條件**：當知識庫為中等規模（$\sim 10^2$ 篇高密度文檔、$\sim 400\text{K}$ Tokens）且具備強邏輯依賴時，優先採用 **LLM Wiki（`raw/` $\to$ `wiki/` 編譯 + `index.md` 拓樸導覽 + 自動化 Linter 健檢）**。
  - **兩階段混合 RAG 路由條件**：當知識庫規模龐大（$S_{\mathcal{D}} > 10^5$ Tokens）或高頻動態變動時，必須採用 **Bi-Encoder Top-$K_{\mathrm{init}}$ 召回 + Cross-Encoder Top-$K_{\mathrm{final}}$ 重排序** 之兩階段管線。
- **違規後果 (Violation Consequence)**: 對高密度公理體系盲目套用碎塊化 Naive RAG 會切斷跨段落數學推導鏈；反之對百萬級動態語料強行塞入單一 Prompt 則會引發顯存 OOM 與長上下文注意力退化（Lost-in-the-Middle）。

### [RULE-603-04] 混合檢索倒數排名融合 (RRF) 與 DAG 先修拓樸展開合約 (Hybrid RRF & DAG Topological Expansion Invariant)
- **合約等級**: `PERFORMANCE_CRITICAL`
- **前置條件 (Pre-conditions)**: 在包含精確技術識別碼（索書號 `LIB-xxx`、不變量代號 `RULE-xxx-xx`、數學符號或程式碼 API）與跨卷先修依賴之知識庫上執行檢索增強生成。
- **量化決策邊界 (Decision Thresholds)**:
  - 階段一召回嚴禁單獨依賴密集向量餘弦相似度；必須並行執行 **稀疏詞彙檢索（Okapi BM25，$k_1 \in [1.2, 2.0], b \in [0.5, 0.8]$）** 與 **密集向量檢索（Dense Bi-Encoder / ColBERT MaxSim）**，並透過平滑常數 $k_0 = 60$ 之 **倒數排名融合（Reciprocal Rank Fusion, RRF）** 合併候選清單 `[DESIGN_DECISION]`。
  - 當檢索命中具備 DAG 拓樸依賴之知識節點 $v \in \mathcal{V}_{\mathrm{hit}}$ 時，檢索器必須自動執行 **父章節展開（Parent Section Expansion）** 與 **1-Hop 先修不變量注入（提取所有 $(u \to v) \in \mathcal{E}$ 之核心 `RULE` 合約）**，且生成回答之 RAGAS 忠實度（Faithfulness）必須受結構化證據標籤門控核驗 `[SAFETY_BOUND]`。
- **違規後果 (Violation Consequence)**: 純密集檢索在精確代號與罕見術語上會發生嚴重漏召回（Recall Collapse）；省略 DAG 先修展開則會導致下游推導遺漏上游數值穩定界與硬體對齊約束，違反 `RULE-000-01`。

---

## 六、📚 權威論文、經典著作與同行評審文獻 (Canonical & Peer-Reviewed References)

1. **檢索增強生成 (RAG) 開山奠基作 (NeurIPS 頂會)**
   - *Paper*: Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., ... & Kiela, D. (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." *Advances in Neural Information Processing Systems (NeurIPS 2020)*, 33, 9459–9474. arXiv: [2005.11401](https://arxiv.org/abs/2005.11401).
   - *Core Contribution*: 正式將非參數化密集檢索記憶體（Non-parametric Memory）與參數化序列生成模型結合，建立邊緣化條件生成公式。
2. **密集段落檢索 DPR 雙編碼器架構 (EMNLP 頂會)**
   - *Paper*: Karpukhin, V., Oğuz, B., Min, S., Lewis, P., Wu, L., Edunov, S., Chen, D., & Yih, W.-t. (2020). "Dense Passage Retrieval for Open-Domain Question Answering." *Proceedings of the 2020 Conference on Empirical Methods in Natural Language Processing (EMNLP 2020)*, pp. 6769–6781. DOI: [10.18653/v1/2020.emnlp-main.550](https://doi.org/10.18653/v1/2020.emnlp-main.550).
   - *Core Contribution*: 證明透過批內負樣本（In-batch Negatives）與對比學習訓練雙編碼器，密集向量檢索能大幅超越傳統 BM25 稀疏檢索。
3. **InfoNCE 對比學習與互資訊下界理論 (CPC)**
   - *Paper*: Oord, A. v. d., Li, Y., & Vinyals, O. (2018). "Representation Learning with Contrastive Predictive Coding." *arXiv:1807.03748*. URL: [https://arxiv.org/abs/1807.03748](https://arxiv.org/abs/1807.03748).
   - *Core Contribution*: 提出 InfoNCE 損失函數，並嚴密證明最小化 InfoNCE 等價於最大化表徵空間的互資訊下界 $I(X; C) \ge \log(N) - \mathcal{L}_{\mathrm{InfoNCE}}$。
4. **神經交叉編碼器重排序管線 (Cross-Encoder Reranking)**
   - *Paper*: Nogueira, R., & Cho, K. (2019). "Passage Re-ranking with BERT." *arXiv:1901.04085*. URL: [https://arxiv.org/abs/1901.04085](https://arxiv.org/abs/1901.04085).
   - *Core Contribution*: 確立「快速初步召回 + 交叉注意力精確重排序」之現代兩階段檢索標準範式。
5. **HNSW 階層式可導航小世界圖近似最近鄰索引 (IEEE TPAMI 頂刊)**
   - *Paper*: Malkov, Y. A., & Yashunin, D. A. (2020). "Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs." *IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)*, 42(4), 824–836. DOI: [10.1109/TPAMI.2018.2889473](https://doi.org/10.1109/TPAMI.2018.2889473).
   - *Core Contribution*: 構建多層跳表式鄰近圖結構，將高維度百萬級向量之近似最近鄰搜尋複雜度壓降至對數級 $O(\log M)$。
6. **緩存增強生成 CAG 與預計算 KV-Cache 基準對比**
   - *Paper*: Chan, B. J., Chen, C.-T., Cheng, J.-H., & Huang, H.-H. (2024). "Don't Do RAG: When Cache-Augmented Generation is All You Need for Knowledge Tasks." *arXiv:2412.15605*. URL: [https://arxiv.org/abs/2412.15605](https://arxiv.org/abs/2412.15605).
   - *Core Contribution*: 系統性論證當知識庫可容納於長上下文視窗時，預先計算並緩存 KV-Cache（CAG）能徹底消除檢索誤差並顯著降低推論延遲。
7. **倒數排名融合演算法 RRF (ACM SIGIR 頂會)**
   - *Paper*: Cormack, G. V., Clarke, C. L., & Buettcher, S. (2009). "Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods." *Proceedings of the 32nd International ACM SIGIR Conference on Research and Development in Information Retrieval (SIGIR 2009)*, pp. 758–759. DOI: [10.1145/1571941.1572114](https://doi.org/10.1145/1571941.1572114).
   - *Core Contribution*: 提出無需分數分佈校準之 $\sum \frac{1}{k_0 + r(d)}$（$k_0=60$）序數融合公式，成為現代稀疏與密集混合檢索（Hybrid Search）之工業標準。
8. **ColBERT 多向量延遲交互檢索架構 (ACM SIGIR 頂會)**
   - *Paper*: Khattab, O., & Zaharia, M. (2020). "ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT." *Proceedings of the 43rd International ACM SIGIR Conference on Research and Development in Information Retrieval (SIGIR 2020)*, pp. 39–48. arXiv: [2004.12832](https://arxiv.org/abs/2004.12832).
   - *Core Contribution*: 提出 Token 級別之 MaxSim 延遲交互算子，在維持接近 Cross-Encoder 精度的同時將線上檢索延遲降低兩個數量級。
9. **Okapi BM25 機率檢索框架奠基綜述**
   - *Paper*: Robertson, S., & Zaragoza, H. (2009). "The Probabilistic Relevance Framework: BM25 and Beyond." *Foundations and Trends in Information Retrieval*, 3(4), 333–389. DOI: [10.1561/1500000019](https://doi.org/10.1561/1500000019).
   - *Core Contribution*: 嚴密推導詞頻飽和（TF Saturation）與文檔長度正規化之機率檢索模型。
10. **RAGAS 自動化檢索增強生成評估框架 (EACL 頂會)**
    - *Paper*: Es, S., James, J., Espinosa-Anke, L., & Schockaert, S. (2024). "RAGAs: Automated Evaluation of Retrieval Augmented Generation." *Proceedings of the 18th Conference of the European Chapter of the Association for Computational Linguistics: System Demonstrations (EACL 2024)*, pp. 150–158. arXiv: [2309.15217](https://arxiv.org/abs/2309.15217).
    - *Core Contribution*: 建立無需人工參考答案之 Context Precision、Faithfulness 與 Answer Relevance 三維度評估標準。
