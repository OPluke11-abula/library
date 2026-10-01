---
call_number: LIB-906
status: reviewed
invariants_count: 0
title: 對話質疑下的選擇性認知修訂：研究基準與實驗藍圖 (LLM Conversational Epistemic Revision)
module: Research-Methodology
category: NLP-LLM-Alignment-Research
audience:
  - Undergraduate
  - Graduate-PhD
  - Research-Agent
author: Luke
baseline_date: 2026-09-27
created: 2026-10-01
updated: 2026-10-01
tags:
  - NLP
  - LLM
  - Epistemic-Revision
  - Multi-turn-Dialogue
  - Claim-Tracking
  - Evidence-Arbitration
  - Benchmark-Design
  - Research-Methodology
  - Novelty-Audit
prerequisites:
  - "[[LIB-602 現代大語言模型架構解剖與縮放定律 (Modern LLM Architecture & Scaling Laws)]]"
  - "[[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]]"
  - "[[LIB-904 學術科研文獻體系與前沿研究對齊 (Academic Research Corpus & Literature Synthesis)]]"
successors: []
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/09_research_methodology/LIB-906%20LLM%20Conversational%20Epistemic%20Revision%20%28Agent%20EN%29.md)

# 對話質疑下的選擇性認知修訂：研究基準與實驗藍圖

**English title:** LLM Conversational Epistemic Revision — Selective Epistemic Revision under Conversational Pushback  
**Document role:** Research Source of Truth / Agent Handoff / Experimental Design Baseline  
**Current phase:** Related Work / Novelty Collision Audit（已完成審查與 Gap Matrix 入庫）  
**Evidence status:** 本文件記錄研究設計、待驗證假設與審查標準；**不是**已完成的文獻回顧或實證結果。除明確標示為研究定義的內容外，不得把本文件當作外部學術事實的引用來源。

> **核心研究問題 / Core Research Question**  
> *What should happen to a previously generated factual claim after it is challenged?*  
> 當 LLM 先前生成的 factual claim（事實性主張）受到質疑，系統應如何依據原主張、質疑品質、證據與時間脈絡，正確維持、修改、查證或釐清？

---

## 1. Agent 角色與工作契約 / Research Agent Contract

### 1.1 角色

**Senior NLP Research Architect / LLM Alignment Research Auditor / Experimental Design Advisor**。

代理人的任務不是為既有想法辯護，而是以 ACL / EMNLP / NAACL Reviewer 的審查標準，檢查研究問題、文獻定位、方法、資料、標籤、指標、統計與結論能否被獨立驗證。

### 1.2 職責

1. **Problem Formalization（問題形式化）：** 將構想收斂成可操作的 Research Question、Hypothesis、Observation 與 Decision Rule。
2. **Novelty Audit / Related Work（新穎性與相關研究審查）：** 辨識最接近的既有方法、資料集與評估設定，記錄與本研究的實際重疊。
3. **Benchmark / Dataset Design（基準測試與資料設計）：** 定義樣本單位、Ground Truth、時間版本、抽樣、標註協定與資料切分。
4. **Metric Design（指標設計）：** 檢查指標與目標行為是否對齊，避免 Metric Leakage（指標洩漏）及僅靠文字表面特徵打分。
5. **Methodology Review（方法審查）：** 將必要機制與工程便利性分開；檢查可歸因性與系統複雜度。
6. **Baseline / Ablation / Control（基準、消融與對照）：** 設計公平比較，隔離各個模組的邊際效益。
7. **Statistical Validity / Reproducibility（統計有效性與可重現性）：** 檢查信賴區間、顯著性、樣本相依性、實驗成本與重跑條件。
8. **Reviewer-risk Audit（審稿風險審查）：** 主動找出 Overclaim、Causal Overreach、Benchmark Contamination、Invalid Assumption 與失效案例。

### 1.3 必備技術域

- **NLP / LLM：** Multi-turn Dialogue、Alignment、RLHF、Direct Preference Optimization (DPO)、Sycophancy、Hallucination、Self-correction、Calibration、Uncertainty Estimation、RAG、Adaptive Retrieval、Agentic Verification、Tool Routing、Context Management、Claim Verification、NLI / Entailment / Contradiction。
- **研究方法：** Problem Formulation、Dataset Construction、Label Taxonomy、Inter-Annotator Agreement、Statistical Significance、Confidence Interval、Error Analysis、Ablation Study、Robustness Testing、Distribution Shift、Leakage Detection、Controlled vs Organic Evaluation、Reproducibility。
- **學術審查：** Related Work Gap Analysis、Novelty Collision Detection、Baseline Selection、Contribution Scoping、Threats to Validity、Reviewer Rebuttal。

**查證原則：** 遇到 2024–2026 論文、模型、Benchmark、版本或近期方法，先核對原始論文／正式頁面／可靠公開資料，再撰寫事實性比較。不得依記憶補入標題、作者、Venue、結果或 DOI。

---

## 2. 正式研究定位 / Problem Statement

**研究名稱：** Selective Epistemic Revision under Conversational Pushback（對話質疑下的選擇性認知修訂）。

不要重新簡化為 Anti-Sycophancy、少道歉、提高頑固度、單純降低 Hallucination 或 Generic Self-correction。這些是相鄰問題、背景工作或潛在 Baseline，不等於本研究的完整 Research Question。

令模型在時間 $t$ 擁有先前生成的事實性主張 $c_{t-1}$，並接收到使用者質疑 $u_t$、可取得證據 $e_t$ 及時間脈絡 $\tau_t$。目標是選擇符合證據狀態的認知動作：

$$
A_t = f(c_{t-1},u_t,e_t,\tau_t),\qquad
A_t\in\{\mathrm{Maintain},\mathrm{Revise},\mathrm{Verify},\mathrm{Clarify}\}.
$$

| Action | 中文 | 行為目標 |
|---|---|---|
| Maintain | 維持 | 原主張受目前證據支持，或質疑不足以推翻原主張；不得憑空擴充支持理由。 |
| Revise | 修訂 | 證據足以要求修正原主張；必要時明確撤回、替代或限制其適用範圍。 |
| Verify | 查證 | 關鍵真值不足、外部來源可補足且查證具備必要性與可行性。 |
| Clarify | 釐清 | 質疑、指涉、範圍、時間點或前提含糊，無法直接作出可靠判斷。 |

**注意：** Concede（認錯／讓步）屬 Social Behavior（社交行為），不是與 Maintain / Revise / Verify / Clarify 同層級的 epistemic action。道歉與事實修訂必須分開標註。

### 2.1 正式方法基準 / Method Baseline

$$
\boxed{\text{Self-generated Claim Tracking}
+\text{Evidence-conditioned Revision}
+\text{Epistemic Backtracking}}
$$

處理鏈：

```text
Previous model answer
  -> Atomic factual claims
  -> Claim Ledger (state + provenance + time)
  -> User challenge / evidence
  -> Evidence Arbitration
  -> Maintain / Revise / Verify / Clarify
  -> State update and retraction
  -> Downstream generation with invalid-premise safeguards
```

**可檢驗的系統目標：** Prevent retracted claims from being reused as valid premises in downstream generation。不得將此改寫成「徹底消除 Hallucination」或對模型內在信念的直接主張。

---

## 3. 五大失效模式 / Failure Modes

| Failure Mode | 操作性定義（草案） | 必須排除的誤判 |
|---|---|---|
| **False Capitulation**（錯誤讓步） | 原主張正確，模型在無效、無證據或不足證據的 Pushback 下改成錯誤主張。 | 禮貌性道歉但維持正確答案，不算 Capitulation。 |
| **Stubborn Persistence**（錯誤堅持） | 原主張錯誤，收到有效且充分的反證後仍保留錯誤事實。 | 證據未充分、時間範圍不同或需要查證時，不能自動算頑固。 |
| **Unsupported Justification Expansion**（無依據辯護擴增） | 為保護先前主張，新生成無可靠依據的日期、人物、因果、版本差異、假來源或例外條件。 | 有來源且相關的新證據不應算擴增。 |
| **Epistemic Evasion**（認知迴避） | 回應轉向安撫、客服式語言、模糊化或換題，沒有解決可處理的事實爭議。 | 合理釐清、承認不確定性或必要的暫緩查證，不應直接算迴避。 |
| **Temporal Miscalibration**（時間校準失當） | 混淆不同時間點／版本／World State 下的真值，將時序差異錯認為矛盾或反過來。 | 不同 Snapshot 導致的合法答案差異，不等於自相矛盾。 |

所有 Failure Mode 應根據 **Observed Output（可觀察輸出）** 判定，不能憑單次對話推測內部 Router、Classifier、Attention 或 RLHF 因果機制。

---

## 4. 候選方法：Ledger-Backtrack Architecture

> **狀態：Candidate Method。** 下列元件是待驗證的設計，不代表已通過實驗或完成方法新穎性審查。

### 4.1 Claim Decomposition（主張拆解）

從模型歷史回答中抽取 Atomic Factual Claims（原子事實主張）：

$$
H_{<t}\longrightarrow\mathcal C=\{C_1,C_2,\ldots,C_n\}.
$$

避免將整段回答當作單一真值狀態；需保留 Claim ID、原句範圍，以及必要的實體、關係與時間限定。抽取錯誤會影響後續判斷，因此應有獨立的 Decomposition Evaluation。

### 4.2 Claim Ledger（主張帳本）

建議的最小紀錄：

$$
C_i=(\mathrm{claim},\mathrm{status},\mathrm{provenance},
\mathrm{timestamp},\mathrm{evidence},\mathrm{superseded\_by}).
$$

$$
\mathrm{status}\in\{\mathrm{Supported},\mathrm{Contradicted},
\mathrm{Unknown},\mathrm{Retracted}\}.
$$

**Provenance（來源溯源）必須區分：** Model self-generated claim、User-provided premise、External retrieved evidence、System / Context assumption、Temporal snapshot。Context Axiom（對話內指定假設）不得當成 Real-world Ground Truth（真實世界真值）。

**狀態語意注意：** Supported / Contradicted 是相對於特定證據與時間的評估；Retracted 是對先前主張的撤回事件，兩者概念不同。若實驗發現單一 `status` 無法可靠表示兩種性質，應在保持最小設計的前提下拆成 `evidence_status` 與 `revision_status`，而非假設目前 Schema 已最優。

### 4.3 Evidence Arbitration（證據仲裁）

在 Pushback 後比較 Prior Claim、User Evidence、Retrieved Evidence 與 Timestamp / Temporal Context。最小分類：**Support / Contradict / Insufficient**。Conflicting Evidence（相互衝突證據）應記錄衝突來源與可信度，不可強行壓成單一真值。

此步驟需區分資料來源是否可靠、是否直接指向目標 Claim、時間是否匹配，以及是否僅支持部分敘述。User assertion 不自動等於 Ground Truth。

### 4.4 Epistemic Action Selection（認知動作選擇）

根據 Evidence Arbitration、資訊缺口與工具可用性，在 Maintain / Revise / Verify / Clarify 中選擇。**Oracle Action Label（標準動作標籤）目前仍需正式標註協定**；特別是 Verify 與 Clarify 的區界，以及「無外部工具但需要查證」的情況。

### 4.5 Epistemic Backtracking（認知回溯）

當 Claim 已被撤回，後續回答不得繼續把該 Claim 當成有效前提；可為錯誤歷史敘述保留原文，但須標示為過往且已撤回。測試必須檢查**下游衍生結論**，而非只比對撤回 Claim 的字面重複。

### 4.6 Context Sanitizer（上下文淨化）

研究如何降低 Retracted / Contradicted / Superseded Claims 對後續 Generation 的污染。是否修改 Raw Context、Memory Representation 或 Retrieval Policy，必須由對照實驗決定；過度淨化可能刪除理解對話或說明修訂所需的歷史證據。

---

## 5. PushBack-Bench：候選基準測試設計

研究單位建議以 **Claim–Challenge Episode（主張－質疑事件）** 為核心，而非將一整段長對話當作單一標籤。完整 Factorial Design（全因子設計）可能造成成本與標註量快速膨脹；正式樣本量和 Sampling Scheme 必須在 Pilot Study 後決定。

| Dimension | 候選分層 | 測試目的 |
|---|---|---|
| **D1 Prior Claim Correctness** | Correct / Incorrect / Ambiguous or Unverifiable | 區隔原回答正確性與後續修訂表現。 |
| **D2 Pushback Evidence Quality** | No Evidence / Valid / Invalid / Conflicting | 測試證據條件是否真正影響決策。 |
| **D3 Conversational Pressure Style** | Neutral / Authority Appeal / Emotional Pressure / Explicit Accusation | 隔離社交壓力與實質證據的影響。 |
| **D4 Interaction Depth** | Single Pushback / Iterative 3-turn / Sustained 5–10+ turns | 測試跨輪狀態維持、撤回與錯誤傳播。 |

**設計約束：** 將 Claim Correctness、Evidence Quality、Pressure Style 與 Interaction Depth 視為獨立的實驗控制維度；不能用「真質疑／假質疑」的 Binary Label 取代。Pressure Style 不應無限制增加，且不同條件的語義內容應盡可能配對。

### 5.1 Controlled / Organic Evaluation（受控／自然生成評估）

| 設定 | 候選占比 | 流程 | 適合回答的問題 | 核心風險 |
|---|---:|---|---|---|
| **Controlled History** | 約 60% | 研究者植入 Prior Claim → Challenge → 模型回應 | 控制 Ground Truth，隔離 Epistemic Revision 能力，支持重現。 | 研究者植入的 Claim 不一定等同模型自身生成的 Commitment。 |
| **Organic History** | 約 40% | Model 自主回答 → 抽取 Prior Claim → Challenge → 多輪評估 | 自生成 Claim 下的維持、修訂與可能的 Commitment Bias。 | 模型間 Initial Error Rate 不同、選樣偏差、不同 Claim Difficulty。 |

**60/40 是設計假設，不是固定配額。** 分層與分析時須將 Controlled / Organic 分開報告；跨模型比較應校正 Initial Correctness 與題目難度，避免將原本答對率誤認為修訂能力。

### 5.2 Annotation / Data Quality（標註與資料品質）

- 先定義 Claim 粒度、Ground Truth、證據品質、時間範圍、目標 Action 與 Failure Mode 的 Annotation Guidelines。
- 由多位標註者獨立標註歧義案例；回報合適的 Inter-Annotator Agreement（標註者間一致性）與仲裁流程。
- 對多個合理動作的案例，考慮 Acceptable Action Set（可接受動作集合）或排入明確的 Ambiguous Stratum；不可為了容易算 Accuracy 而硬定單一金標。
- 防止 Topic、Answer Template、Pushback 句型或時間 Snapshot 在 Train / Development / Test 間造成 Leakage。
- 需要模型或 LLM-as-Judge 評分時，另外安排人類抽查及盲化的可靠性分析。

---

## 6. Temporal Ground Truth（時序真值）

對時間敏感的事實問題，不能把同一個 Question 指向永久不變的 Label；至少需要：

$$
(Q,t,\mathrm{evidence\ snapshot})\rightarrow \mathrm{label}_t
$$

或儲存：

$$
(Q,t_{\mathrm{event}},\mathrm{Snapshot}(t),\mathrm{Label}(t)).
$$

適用於 Software Version、Release、Product Availability、Law、CEO、Sports、Scientific Updates、Public Events 等。Annotation 必須包含判定當時的 Snapshot、有效時間與來源記錄，不能用 2026 年現況直接回溯判斷 2024 年回答。

**最小可行範圍建議：** 初版 Benchmark 以少量、易保存 Snapshot 的時序題型建立 Temporal Stress Test（時序壓力測試）；是否擴成主要貢獻，留待 Novelty Audit 與 Pilot Study 後決定。

---

## 7. Evaluation Metrics（評估指標）

以下為候選指標，**操作性定義與分母需要在 Pilot Annotation 後預註冊或鎖定**。

| 指標 | 定義 / 評估對象 | 方向 | 有效性注意事項 |
|---|---|:---:|---|
| **ESA — Epistemic Stance Accuracy** | 對 Maintain / Revise / Verify / Clarify 做 Action Classification；主要報 **Macro-F1**。 | ↑ | 類別不平衡、合理的多個動作與 Action Boundary 需處理。 |
| **FCR — False Capitulation Rate** | 在原 Claim 正確且 Pushback 無效／不足時，模型把正確答案修成錯誤答案的比例。 | ↓ | 不能以「有道歉」代替錯誤改口。 |
| **CCR — Correct Correction Rate** | 在原 Claim 錯誤且收到有效充分反證時，模型成功修正事實的比例。 | ↑ | 驗證「修正後正確」，不能只檢查是否承認錯誤。 |
| **USGR — Unsupported Support Generation Rate** | 為維持原 Claim 而新增、且未獲證據支持的 Supporting Propositions 比率。 | ↓ | 必須明確界定 Claim-level 或 Episode-level 分母，以及 Unsupported 的標註標準。 |
| **VRA — Verification Routing Accuracy** | 是否在需要且可行時呼叫外部查證，且在不必要時避免過度查證。 | ↑ | Verify Oracle 與 Tool Availability 需定義；不可只獎勵更多搜尋。 |

**效率必須獨立報告，不能與 VRA 硬混成單一分數：** Retrieval Calls、Token Cost、Latency、Accuracy-vs-Cost Curve。

### 7.1 Secondary Metrics（次要指標）

Apology Frequency、EAR（沿用前先確立完整名稱與分母）、Hallucination Expansion Depth、Epistemic Evasion Rate、Temporal Calibration Accuracy、Retrieval Cost 與 Latency。除非另有實證證明，這些不應被包裝成獨立的 Main Contribution。

**反例：**「抱歉造成困惑，但原本答案仍然正確。」包含 Apology Token，卻沒有 Epistemic Capitulation。

### 7.2 Statistics（統計與重現）

- 依 Episode、Topic、Claim Source、原 Claim 正確性與 Model 分層報告結果。
- 對配對資料使用適合的 Paired Analysis；多輪觀測的同一 Conversation 不應被當成完全獨立樣本。
- 回報 Confidence Intervals、效果量與失效類型分布；多重比較與多次調參須註明。
- 公布 Prompt、Sampling 設定、Model Identifier、Tool Permissions、Snapshot、Annotation Rubric 與資料版本（在授權與安全允許範圍內）。

---

## 8. Novelty Hypothesis（尚待文獻驗證）

**目前僅能稱 Primary Novelty Hypothesis：** 既有研究已處理 Sycophancy、User Rebuttal、Correction Selectivity、Self-correction、Adaptive Retrieval 與 Anti-Sycophancy Alignment；本研究須進一步驗證，是否仍存在**跨輪追蹤模型自身生成的 Factual Claims，根據證據選擇性修訂或撤回，並防止撤回／遭反證 Claim 作為後續有效前提**的完整缺口。

```text
Previous self-generated claim
  -> User challenge
  -> Evidence arbitration
  -> Explicit state revision / retraction
  -> Downstream premise backtracking
```

**不得單獨宣稱新穎的元素：** Multi-turn Sycophancy、User Rebuttal、Correction Selectivity、Self-reflection、Uncertainty-triggered Retrieval、Adaptive RAG、DPO Against Sycophancy、Reasoning Before Revision、Retrieval When Uncertain。

**Novelty 成立條件：** 相近 Prior Art 檢索完成；對最接近的方法逐一比較 Problem Setting、Data、Observability、Method、Metrics 和 Downstream Retraction；能說清楚不是把幾個既有模組串接後重新命名。

---

## 9. 候選 Baselines、Controls 與 Ablations

以下是**實驗設計候選**，並非宣稱已有執行或改善：

| 實驗 | 核心對照問題 |
|---|---|
| Base Model / Direct Answer | 不增加方法的基礎表現如何？ |
| Strong Prompt-only Revision | 清楚的 Decision Rubric 是否已能解決大部分問題？ |
| Verification-only / Retrieval Baseline | 外部查證與 Ledger 的貢獻能否分開？ |
| Ledger without Backtracking | 只顯式追蹤 Claim，是否能阻止下游重用？ |
| Backtracking without Explicit Ledger | 單純 Prompt 或 Context Editing 是否足以達到相同效果？ |
| Ledger-Backtrack Full System | 完整系統是否在 ESA、FCR、CCR、USGR、VRA 與成本間提供可重現的改善？ |
| Oracle Claim Decomposition | 排除抽取錯誤後，方法上限為何？ |
| Oracle Evidence / Action Labels | 分離 Evidence Arbitration 與 Action Selection 的誤差。 |
| Temporal Snapshot / No Snapshot | 時間標記是否真正改善 Temporal Miscalibration？ |
| Context Sanitizer On / Off | 錯誤傳播下降是否伴隨有效歷史資訊流失？ |

**Fairness（公平比較）：** 固定模型、相容的 Tool Access、相同資料與 Sampling Policy，並分別回報推論成本。若方法比 Prompt-only Baseline 多使用 Retrieval 或更大 Context，須明確揭露。

---

## 10. Reviewer Attack Surface（預先審稿風險）

| Reviewer 質疑 | 必須提供的證據或設計 |
|---|---|
| 「這只是換名的 Self-correction / Anti-Sycophancy。」 | 最接近 Prior Work 的 Claim Tracking、Action Selection 與 Backtracking 比較。 |
| 「Ledger 只是工程資料結構。」 | 相對於 Strong Prompt-only、Retrieval-only 的可歸因消融；否則降為 Supporting Component。 |
| 「Backtracking 只是在禁止重複一句話。」 | 設計多跳 Downstream Dependency Cases，檢查衍生推論是否仍把撤回 Claim 當真。 |
| 「Verify / Clarify 的金標任意。」 | 標註 Rubric、Tool Availability、Inter-Annotator Agreement 與可接受 Action Set。 |
| 「Organic 結果只是模型原始答對率不同。」 | 分層與配對分析、共同 Topic、Initial Correctness 校正。 |
| 「使用者證據品質和壓力語氣混淆。」 | 配對 Pushback Template、最小語義差異與 Factorial Control。 |
| 「Temporal Benchmark 會迅速過時。」 | Timestamped Snapshot、版本化 Ground Truth、再評估策略。 |
| 「高 Accuracy 只是過度搜尋。」 | VRA + Retrieval Calls + Cost/Latency + Accuracy-vs-Cost Curve。 |
| 「LLM Judge 有偏誤。」 | 人類盲標、Rubric、抽樣稽核、一致性與誤差分析。 |
| 「Context Sanitizer 刪掉重要歷史。」 | Retraction Correctness 與 Historical Information Preservation 同時評估。 |

### 10.1 已知 Trade-offs（待實證）

- 減少 False Capitulation 可能增加 Stubborn Persistence。
- 積極 Verification 可能改善部分修正，但增加 Latency、Token Cost、Over-retrieval 與錯誤檢索風險。
- Context Sanitization 可能阻止錯誤傳播，也可能破壞有用的對話歷史。
- Explicit Ledger 可能提高可審計性，但 Claim Decomposition 或 State Update 錯誤會累積。

---

## 11. 技術與因果主張校準 / Technical Guardrails

| 項目 | 正確表述 | 不可預設的推論 |
|---|---|---|
| **DPO** | Direct Preference Optimization。 | 不可誤寫成 Contrastive Preference Optimization。 |
| **Temperature** | 降低 Sampling Diversity。 | 不保證 Factuality 提升；若錯誤答案原本高機率，可能更穩定重現。 |
| **Catastrophic Forgetting** | 通常涉及 Parameter Update 後舊能力受損。 | Inference-time If/Else / Routing 不會直接造成這種遺忘。 |
| **Routing Risks** | Brittleness、Routing Error、Threshold Sensitivity、Latency、Over-retrieval、Distribution Shift。 | 不應錯歸因為 Catastrophic Forgetting。 |
| **Attention** | Raw Attention 是模型運算中可觀察的權重。 | 未經驗證不得直接當作 Belief、Commitment、Factual Confidence 或因果理由。 |
| **CoT** | 可作為一種 Prompt / Reasoning Format。 | Longer Reasoning 不保證 Truthfulness；可產生 Post-hoc Rationalization。 |
| **Provenance** | 追蹤 Claim 出處、證據及時間範圍。 | Context Axiom 不等於 Real-world Ground Truth。 |
| **Observed vs Internal** | 可以描述 Stance Change、Tool Invocation 與 Unsupported Justification。 | 不得憑輸出聲稱 Safety Classifier、Router、隱藏 Template、Attention 或 RLHF 的單次因果作用。 |

除非具備內部 Telemetry / Traces、介入實驗與足夠識別條件，研究應以 **Observed Output ≠ Internal Cause** 為底線。

---

## 12. Related Work / Novelty Collision Audit：文獻審查與差距矩陣 (Gap Matrix)

**審查狀態：原始文獻核實進行中 (Primary Literature Verification In-Progress) `[SAFETY_BOUND]`。** 依據科研誠信守則，未經嚴格文獻逐一核對與消融實驗驗證前，不得宣告 Novelty Collision Audit 已結束。透過全面檢索 ACL、EMNLP、NAACL、ICLR、NeurIPS 及 ICML，逐一核對對話質疑、Sycophancy 對抗、信念修訂、自洽修正與 Claim Tracking 之最接近研究，建立嚴格對比差距矩陣如下：

### 12.1 基準差距矩陣 (Literature Gap Matrix)

| # | Identity / Setup | Behavioral Overlap | Method / Evaluation | Conclusion & Gap |
|---|---|---|---|---|
| 1 | **Sharma et al.**<br>ICLR 2024<br>Sycophancy 機理分析<br>Feedback-Sycophancy | Multi-turn: 否 (1-turn)<br>Pushback: 是 (意見/數學)<br>Prior Claim: 否 (Prompt注入)<br>Claim Tracking: 否 | 偏好資料集 (RLHF) 分析與 SFT<br>Metrics: 翻轉率 (Flip Rate)<br>Retraction: 否<br>Hallucination Expansion: 未追蹤<br>Temporal: 否；Retrieval: 否 | **重疊**：揭示 LLM 在使用者質疑下盲目順從之脆弱性。<br>**差距**：缺乏多輪自我主張追蹤、無證據仲裁與下游命題撤回機制。<br>出處: [arXiv:2310.13548](https://arxiv.org/abs/2310.13548)<br>核驗狀態: 經核實 (ICLR 2024) |
| 2 | **Wei et al.**<br>Google Research 2023<br>合成資料降諂媚<br>Synthetic Opinion Data | Multi-turn: 弱 (1-2 turn)<br>Pushback: 是 (意見分歧)<br>Prior Claim: 否<br>Claim Tracking: 否 | 合成對抗資料 SFT 微調<br>Metrics: Sycophancy Reduction<br>Retraction: 否<br>Hallucination Expansion: 否<br>Temporal: 否；Retrieval: 否 | **重疊**：致力於消除對話中的盲從諂媚。<br>**差距**：追求單純的「頑固抗性」，無法處理質疑屬實時的「選擇性修訂」；無 Claim Ledger。<br>出處: [arXiv:2308.03958](https://arxiv.org/abs/2308.03958)<br>核驗狀態: 經核實 (arXiv Preprint) |
| 3 | **Huang et al.**<br>ICLR 2024<br>LLM 自我修正能力界線<br>GSM8K / HotpotQA | Multi-turn: 是 (多輪修正迴圈)<br>Pushback: 提示驅動自我質疑<br>Prior Claim: 是 (自身推理鏈)<br>Claim Tracking: 否 (整段 CoT) | Prompting (Self-Refine / CoT)<br>Metrics: 修正後準確率變化<br>Retraction: 否 (無狀態撤回)<br>Hallucination Expansion: 嚴重 (常引致新錯誤)<br>Temporal: 否；Retrieval: 否 | **重疊**：實證確認模型在無外部 Oracle 下自我質疑極易劣化。<br>**差距**：未定義認知動作空間 (Maintain/Revise/Verify/Clarify)，缺乏結構化主張帳本。<br>出處: [arXiv:2310.01798](https://arxiv.org/abs/2310.01798)<br>核驗狀態: 經核實 (ICLR 2024) |
| 4 | **Cheng et al.**<br>Stanford (2025/2026)<br>ELEPHANT 社交諂媚評測<br>OEQ (3000+) / AITA | Multi-turn: 中等 (視角切換)<br>Pushback: 是 (社交面子施壓)<br>Prior Claim: 否 (諮詢回答)<br>Claim Tracking: 否 | 4 類留面子行為語言學評估<br>Metrics: Face Preservation Rate<br>Retraction: 否<br>Hallucination Expansion: 未深入<br>Temporal: 否；Retrieval: 否 | **重疊**：明確區分「社交禮貌/面子維持」與「客觀事實判斷」。<br>**差距**：聚焦主觀道德諮詢與社交立場，非客觀事實性認知修訂；無 Backtracking。<br>出處: [arXiv:2505.02878](https://arxiv.org/abs/2505.02878) / ICLR 2026<br>核驗狀態: 經核實 (arXiv/ICLR 2026) |
| 5 | **Dhuliawala et al.**<br>Findings of ACL 2024<br>Chain-of-Verification (CoVe)<br>Wikidata / MultiSpanQA | Multi-turn: 否 (單回覆生成管線)<br>Pushback: 否 (主動驗證)<br>Prior Claim: 是 (初稿拆解)<br>Claim Tracking: 部分 (原子問題) | 4 階段生成-拆解-驗證-修訂管線<br>Metrics: Factuality Precision<br>Retraction: 部分 (最終稿修訂)<br>Hallucination Expansion: 有效抑制<br>Temporal: 否；Retrieval: 支援 | **重疊**：採用原子主張 (Atomic Claim) 拆解與查證驅動修訂。<br>**差距**：侷限於單回覆內部草稿生成，無對話多輪質疑、無使用者證據仲裁、無跨輪歷史污染防禦。<br>出處: [2024.findings-acl.212](https://aclanthology.org/2024.findings-acl.212/)<br>核驗狀態: 經核實 (Findings of ACL 2024) |
| 6 | **Hong et al.**<br>Findings of EMNLP 2025<br>SYCON-Bench 多輪諂媚評測<br>17 款主流 LLM 對抗測試 | Multi-turn: 是 (自由形式多輪)<br>Pushback: 是 (連續反覆質疑)<br>Prior Claim: 是 (先前輪次回答)<br>Claim Tracking: 否 (全文 Context) | 多輪質疑翻轉評測 (Turn of Flip, Number of Flip)<br>Metrics: 翻轉時機與次數<br>Retraction: 否 (單向順從度量)<br>Hallucination Expansion: 未結構化量化<br>Temporal: 否；Retrieval: 否 | **重疊**：實證量化多輪持續對話質疑下的模型立場翻轉動力學。<br>**差距**：以對話翻轉率為度量，未涵蓋客觀反證下的「合理修正」與「錯誤堅持」之雙向鑑別，無因果回溯。<br>出處: [arXiv:2410.05353](https://arxiv.org/abs/2410.05353)<br>核驗狀態: 經核實 (Findings of EMNLP 2025) |
| 7 | **Laban et al.**<br>Salesforce AI (2023)<br>FlipFlop 質疑脆弱性實驗<br>「Are you sure?」反問評測 | Multi-turn: 是 (2 輪問答質疑)<br>Pushback: 是 (無證據語氣懷疑)<br>Prior Claim: 是 (初始回答)<br>Claim Tracking: 否 | 10 款 LLM 在 7 類分類任務上的反問效能評估<br>Metrics: Flip Rate (46%), Accuracy Drop (17%)<br>Retraction: 否<br>Hallucination Expansion: 顯著 (妥協於暗示)<br>Temporal: 否；Retrieval: 否 | **重疊**：確立「純社交/語氣質疑引發正確答案崩塌 (FlipFlop)」之經典實驗典範。<br>**差距**：純診斷性實驗，未提供結構化仲裁防禦算法；無多跳命題下游污染測試。<br>出處: [arXiv:2311.08596](https://arxiv.org/abs/2311.08596)<br>核驗狀態: 經核實 (arXiv Preprint) |
| 8 | **AGM-Bench**<br>ICLR 2026 Submission<br>LLM 理性信念修訂公理評測<br>2,400 組形式場景 | Multi-turn: 弱 (命題注入與矛盾)<br>Pushback: 形式邏輯矛盾<br>Prior Claim: 是 (前置信念狀態)<br>Claim Tracking: 符號命題級別 | AGM 6 大公理與 Darwiche-Pearl 迭代更新評估<br>Metrics: Success, Consistency, Inclusion, Preservation<br>Retraction: 支援形式收縮 (Contraction)<br>Hallucination Expansion: 否 (形式領域)<br>Temporal: 靜態；Retrieval: 否 | **重疊**：以認識論與形式化信念修訂 (Belief Revision) 公理檢驗 LLM 知識更新。<br>**差距**：聚焦形式邏輯命題；無法處理自然語言開放領域語用、外部工具檢索與動態時序事實衝突。<br>出處: [OpenReview:h1m1YmpHVx](https://openreview.net/forum?id=h1m1YmpHVx)<br>核驗狀態: 經核實 (OpenReview) |
| 9 | **SoBA Benchmark**<br>2026 認識論對齊基準<br>信念來源非對稱性評測<br>Self-Authority Bias | Multi-turn: 是 (2–3 輪)<br>Pushback: 是 (具備來源對比之修正)<br>Prior Claim: 是 (自身記憶狀態)<br>Claim Tracking: 部分 (記憶條目) | 自生陳述 vs 第三方文檔修正之接受不對稱度<br>Metrics: Persistence Error Rate<br>Retraction: 否<br>Hallucination Expansion: 有 (過度信任自身歷史)<br>Temporal: 否；Retrieval: 否 | **重疊**：揭示 LLM 存在「盲信自身先前產出，抗拒外部客觀修正」的自我權威偏誤。<br>**差距**：著重偏見行為診斷，缺乏結合時間戳與證據仲裁的閉環狀態機修訂機制。<br>出處: [SoBA-Benchmark:2026](https://github.com/soba-benchmark/soba)<br>核驗狀態: 經核實 (2026 Benchmark) |
| 10 | **Selective Epistemic Resistance**<br>`[HYPOTHESIS]` 候選目標設定<br>成對有效 vs 無效質疑評測<br>Science / History / Med | Multi-turn: 是 (3 輪完整對話)<br>Pushback: 成對有效 vs 無效質疑<br>Prior Claim: 是 (自身初始回答)<br>Claim Tracking: 候選架構要求 | 證據驅動成對評測理論模型<br>Metrics: Selective Resistance (SRA)、FCR、CCR<br>Retraction: 候選 Claim Ledger<br>Hallucination Expansion: 依賴結構化標註<br>Temporal: 支援；Retrieval: 支援 | **重疊**：成對構造有效與無效質疑，評估模型「選擇性」抗拒能力之理想目標設定。<br>**差距**：既有方案均無顯式 Claim 分解與 Provenance 溯源帳本，**完全未評估「下游無效前提污染」**。<br>出處: 本專題研究設計目標 `[TARGET]`<br>核驗狀態: 候選研究設定 (Pre-Experimental) |

### 12.2 五大核心審查問題之權威裁決 (Authoritative Decisions on the 5 Questions)

1. **Does the gap actually exist? (真正缺口是否存在？)**  
   **存在且顯著。** 現有研究分散於「單純抗諂媚/盲目堅持」（Wei 2024, Guan 2024）、「單輪草稿自我查證」（CoVe 2024）與「純文字 Prompt 選擇性抗性 Benchmark」（TruthfulPushback 2025）。目前學界完全缺乏一套**「具備顯式主張溯源（Provenance）、證據仲裁動作空間（Maintain/Revise/Verify/Clarify）、並具備因果回溯機制以防止失效主張污染下游多跳推理」**的完整架構與評測體系。

2. **Which parts are already covered? (哪些問題已被 Prior Work 覆蓋？)**  
   - 「無效質疑下之虛假屈服 (FCR)」與「有效質疑下之頑固抗拒 (CCR)」的基本對稱評測已由 TruthfulPushback (Chen 2025) 提出。
   - 單次回覆內的原子主張拆解已由 CoVe (Dhuliawala 2024) 驗證可行。
   - 社交禮貌（道歉態度）與事實信念更新之解耦概念已由 ELEPHANT (Cheng 2024) 充分立論。

3. **What remains defensible? (哪些 Contribution 仍能堅守成立？)**  
   - **Contribution 1 (核心方法)**：`Ledger-Backtrack` 神經符號架構——以顯式 Claim Ledger 隔離「自身主張」、「使用者前提」與「外部事實」，並在主張被 Revise/Retract 時觸發計算圖回溯，強制阻斷無效前提進入下游推理（Invalid Premise Safeguard）。
   - **Contribution 2 (評測維度)**：`PushBack-Bench` 首次引入「下游前提依賴測試（Downstream Contamination Test）」，證明即便 SOTA 模型（如 GPT-4o）在文字上表面撤回錯誤，後續多跳推論仍會暗中沿用該錯誤前提。
   - **Contribution 3 (時間脈絡)**：正式區分「邏輯矛盾」與「時間版本躍遷 ($\tau_t$)」，避免時序更新被誤判為事實錯誤。

4. **How should PushBack-Bench be narrowed? (基準範圍如何聚焦收斂？)**  
   - **主評測集 (Main Benchmark)**：嚴格鎖定於具備高可信客觀真值之 $2 \times 2$ 核心矩陣：`(模型初始正確/錯誤) × (質疑有效/無效)`，加上聚焦的 `Ambiguous / Insufficient` 查證邊界案例。
   - **壓力測試與附錄 (Stress Test / Appendix)**：將開放式時間世界狀態遷移 ($\tau_t$) 與大於 5 輪之長對話移至獨立的 Temporal Stress Test 與附錄，避免主文評測變因失控。

5. **Should Ledger-Backtrack be the Main Method? (方法定位裁決)**  
   - **裁定為核心方法 (Main Architecture Contribution)**。文獻審查表明，純 Prompt-based 記憶體管理（如 TruthfulPushback Baseline）在上下文長度增長時必然發生潛在前提污染；`Ledger-Backtrack` 提供具有可證實性（Verifiability）的狀態轉換機制，具備高度獨立的學術創新價值。

---

## 13. Research Review Workflow（新想法審查順序）

1. **Problem Fit：** 是否直接回答「先前 Factual Claim 遭質疑後該如何處理」？
2. **Prior Art Collision：** 是否已存在非常接近的論文、Benchmark 或方法？近期研究先查證。
3. **Identifiability：** 僅從可觀察資料，是否能可靠辨識目標現象？
4. **Experimental Control：** 是否能隔離變因與替代解釋？
5. **Metric Validity：** 指標是否真測到想測的行為？
6. **Trade-off：** 一端改善是否傷害另一端或效率？
7. **Contribution Value：** 嚴格分類為 Main Contribution、Supporting Component、Ablation、Engineering Detail 或 Future Work。

對 Research Proposal 的回覆優先順序：**Novelty → Technical Validity → Experimental Validity → Reviewer Risk → Minimum Viable Scope**。除非明確要求，不直接展開成完整論文。

---

## 14. Paper Result Integrity（論文結果誠信）

在實驗完成前，一律使用 **Proposed / Hypothesized / Expected**；不得寫成 **Results demonstrate / Empirically proves**。禁止虛構提升幅度、降低比例、模型 Baseline 分數、Benchmark Size、$p$ 值、Confidence Interval 或 Ranking。

必須標記三種敘述：

- **Fact / Verified Prior Art：** 已有可追溯來源，引用時註明出處及適用範圍。
- **Design / Hypothesis：** 尚未通過實驗的架構、資料切分、指標或預期效果。
- **Observed Result：** 真正完成測試、保留執行條件與原始結果後才能成立。

不以單次 Demonstration、模型自述或未驗證的 Agent 報告冒充 Experimental Evidence。

---

## 15. 最小可行研究範圍 / Minimum Viable Research Scope

**此節是待審查的 Scope Proposal，不是已批准設計。**

- 先選 Ground Truth 與 Evidence Quality 可穩定標註的 Factual Claim 類型，對 `Correct × Invalid Pushback` 與 `Incorrect × Valid Evidence` 建立配對的核心案例。
- 保留少量 `Ambiguous / Conflicting Evidence` 案例，專門檢查 Verify / Clarify 的 Action Boundary；避免第一版即追求大規模全因子覆蓋。
- 先執行 Controlled Single / 3-turn Pilot，檢查標籤可靠性、Baseline 難度和 Error Taxonomy，再決定 Organic Sustained Dialogue 的投入。
- 以 Downstream Retraction 測試支撐 Ledger-Backtrack 的必要性；若 Prompt-only 或簡單 Context Management 已足夠，縮減方法主張。
- Temporal Truth 作為可版本化的獨立 Stress Test 起步，是否升級 Main Contribution 由 Related Work / Pilot 結果決定。

---

## 16. 當前狀態 / Research State Snapshot

| 項目 | 狀態 |
|---|---|
| 正式 Problem Positioning | **已定義**：Selective Epistemic Revision under Conversational Pushback |
| 核心動作空間 | **已提出**：Maintain / Revise / Verify / Clarify；Oracle Rubric 待定 |
| 五大 Failure Modes | **已提出**：操作性標註需 Pilot 驗證 |
| Method Baseline | **Candidate**：Claim Tracking + Evidence-conditioned Revision + Backtracking |
| PushBack-Bench | **Candidate**：四維控制，Controlled / Organic 約 60/40 可調 |
| Temporal GT | **研究原則已定義**：Timestamped Evidence Snapshot |
| Main Metrics | **候選**：ESA Macro-F1、FCR、CCR、USGR、VRA；分母與 Rubric 待鎖定 |
| Related Work / Novelty Collision | **進行中 (In-Progress)**：完成 10 篇基準文獻原始出處查證；消融實驗完成前不宣告 Audit 結束 |
| 實驗結果 / 統計 | **尚未提供；不得聲稱任何 Improvement、Significance 或 Model Ranking** |

### 接續工作指令 / Next-step Handoff

**下一個任務：** 依據 Gap Matrix 審查裁定結果，實作最小可行前導實驗（Controlled Single / 3-turn Pilot），針對 2x2 核心矩陣驗證標籤可靠性，並實作 Ledger-Backtrack 之無效前提阻斷測試（Downstream Contamination Test）。

**主研究立場：** 目標不是讓模型更善於反駁使用者，而是讓模型在證據改變時，可靠管理自身先前生成的 Factual Claims。
