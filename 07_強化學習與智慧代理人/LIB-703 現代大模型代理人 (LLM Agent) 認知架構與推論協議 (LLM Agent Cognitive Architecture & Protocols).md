---
call_number: LIB-703
status: source-verified
invariants_count: 7
title: 現代大模型代理人 (LLM Agent) 認知架構與推論協議 (LLM Agent Cognitive Architecture & Protocols)
module: Reinforcement-Learning-Agents
category: Agent-Cognition
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Partially Observable Markov Decision Process (POMDP)
  - ReAct Trajectory Optimization & Thought-Action Synergy
  - Tree-of-Thoughts (ToT) Graph-Search & Heuristic Pruning
hardware_target:
  - Local Filesystem External Cortex (Obsidian Vault OS)
  - Subagent Multi-Process Async Execution Pool
created: 2026-09-17
author: Luke
tags:
  - 圖書館
  - 強化學習
  - 智慧代理人
  - Agent
  - ReAct
  - Obsidian
  - POMDP
prerequisites:
  - "[[LIB-405 注意力機制、Transformer 革命與位置編碼幾何 (Attention Mechanism & Transformer Revolution)]]"
  - "[[LIB-602 現代大語言模型架構解剖與縮放定律 (Modern LLM Architecture & Scaling Laws)]]"
  - "[[LIB-603 密集檢索、檢索增強生成 (RAG) 與緩存增強生成 (CAG) 系統架構 (Dense Retrieval, RAG & Cache-Augmented Generation Architecture)]]"
successors:
  - "[[LIB-506 大語言模型驅動之 3DGS 空間問答、階層場景圖與具身導航 (LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation)]]"
  - "[[LIB-704 雙進程神經代理人：S1 非自迴歸型態決策引擎 (Jev) 與字節級介面反射模型 (CUA-S1) 深度解剖 (Dual-Process Neural Agent - S1 Non-Autoregressive Typed Decision Engine (Jev) & Byte-Level Interface Reflex Model (CUA-S1))]]"
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/07_reinforcement_learning_and_agents/LIB-703%20LLM%20Agent%20Cognitive%20Architecture%20%26%20Protocols%20%28Agent%20EN%29.md)

# 現代大模型代理人 (LLM Agent) 認知架構與推論協議 (LLM Agent Cognitive Architecture & Protocols)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-405 注意力機制、Transformer 革命與位置編碼幾何 (Attention Mechanism & Transformer Revolution)]]、[[LIB-602 現代大語言模型架構解剖與縮放定律 (Modern LLM Architecture & Scaling Laws)]]、[[LIB-603 密集檢索、檢索增強生成 (RAG) 與緩存增強生成 (CAG) 系統架構 (Dense Retrieval, RAG & Cache-Augmented Generation Architecture)]]。
- **後續節點**：[[LIB-506 大語言模型驅動之 3DGS 空間問答、階層場景圖與具身導航 (LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation)]]、[[LIB-704 雙進程神經代理人：S1 非自迴歸型態決策引擎 (Jev) 與字節級介面反射模型 (CUA-S1) 深度解剖 (Dual-Process Neural Agent - S1 Non-Autoregressive Typed Decision Engine (Jev) & Byte-Level Interface Reflex Model (CUA-S1))]]。
- **難度等級**：學士進階 / 前沿系統工程。

---

## 一、💡 學士直觀心智模型：從「鸚鵡學舌」到「具備手腳與筆記本的科學家」

許多初學者將大語言模型（如 ChatGPT）視為一個單純的「問答聊天機器人」。然而在資工博士與系統架構師的眼裡，**LLM 只是中央處理器 (CPU)，而加上了感測器、手腳（工具）、工作記憶（RAM）與長期筆記本（硬碟）的整體系統，才稱之為 AI Agent（自主代理人）**。

### 1. 聊天機器人 vs 自主代理人
- **聊天機器人 (Stateless Chatbot)**：
  - 你問它一個問題，它依據大腦中的機率分佈預測下一字。如果資訊在它的訓練資料裡沒有，它只能胡說八道（幻覺 Hallucination）。
  - 它沒有手和腳，不能查看最新的資料庫，不能編譯代碼，不能點擊網頁。
- **自主代理人 (Autonomous AI Agent)**：
  - 像一個坐在電腦前具備專業技能的工程師。
  - **觀察 (Perceive)**：閱讀使用者的需求與目前環境的報錯資訊。
  - **思考 (Reason)**：制定多步驟實施計畫，拆解依賴關係（ReAct 循環）。
  - **行動 (Act)**：親自打開終端機執行測試、編輯檔案、調用搜尋引擎。
  - **反思 (Reflect)**：如果測試失敗，它不會停下來等人類救它，而是自己讀取 Error Log，推導假說，修改代碼再次驗證，直到目標達成！

### 2. Obsidian Vault：AI Agent 的外部海馬體 (External Cortex)
- 代理人的短期工作記憶（Context Window）極其昂貴且每次重啟都會被抹去（類似 volatile RAM）。
- **Obsidian 雙向鏈結知識庫就是 Agent 的持久化硬碟**：
  - 將踩坑經驗、系統不變量、架構決策（ADR）以 Markdown 存檔。
  - 任何接手的後續 Agent 只要讀取 `index.md` 與各分館 `LIB-XXX`，能在 3 秒內無縫繼承人類團隊數個月沉澱的全部認知。
- **Karpathy 的「LLM Wiki」知識編譯範式 vs. 碎塊化 RAG** `[DESIGN_DECISION]`：
  - 傳統 Naive RAG 將文件盲目切為固定字數碎塊，容易切斷跨段落的數學推導與系統依賴。
  - 在「LLM Wiki」架構中，原始素材（論文、簡報、代碼庫）先放入 `raw/`，再由 LLM 代理「編譯（Compile）」為結構化 Markdown 維基（`wiki/`，對應本庫之 `LIB-000` 總索引與各分館專卷），自動維護摘要、雙向反向連結（Backlinks）與自動化健檢（Linting，如 `validate_library.py` 檢查前後矛盾與斷鏈），使 Agent 在百篇專卷規模（$\sim 400\text{K}$ 字）下無需碎塊化向量切分即可實現 100% 拓樸精準推理。
- **三元角色狀態空間與多供應商統一路由 (`provider:model`)** `[FACT]` `[DESIGN_DECISION]`：
  - 現代對話與代理人 API 嚴格區分 `system`（全局人設、行為約束與領域知識基準 $s_{\mathrm{sys}}$）、`user`（環境或人類輸入 $u_t$）與 `assistant`（模型動作與回應 $a_t$），條件生成分佈形式化為 $P_\theta(a_t \mid s_{\mathrm{sys}}, u_1, a_1, \dots, u_t)$。透過統一抽象層（如吳恩達 `aisuite` 之 `provider:model` 路由協議），Agent 可在單一狀態機內無縫切換雲端前沿推理模型與本地端低延遲模型。

### 3. AI Agent 系統方程式與五大工程演進階梯 (`AI Agent = AI Model + Harness`) `[FACT]` `[DESIGN_DECISION]`
傳統單輪提示（Zero-Shot Prompt $\to$ LLM $\to$ Output）猶如強迫人類作家「不准按退格鍵、不准查資料、不准修改草稿，從第一個字一路寫到交稿」。在真實工程中，將被動語言模型轉化為可靠代理人的核心公式為：
$$\text{AI Agent} = \text{AI Model (機率推論核心)} + \text{Harness (工具執行框架、記憶與驗證護欄)}$$
其系統設計隨任務複雜度呈現五大工程演進階梯 `[DESIGN_DECISION]`：
1. **Prompt Engineering（提示工程）**：單輪指令措辭與輸出格式約束最佳化。
2. **Context Engineering（上下文工程）**：動態檢索並結構化注入背景知識（RAG）、規定條文、範例與受眾條件。
3. **Harness Engineering（框架與護欄工程）**：封裝外部確定性工具（計算機、資料庫、編譯器）、JSON Schema 型別契約與沙盒權限邊界。
4. **Loop Engineering（迴圈工程）**：建立生成、執行、測試、反思（Reflection）與錯誤自動重試之閉環控制流。
5. **Graph Engineering（圖譜與多代理編排工程）**：以有向無環圖（DAG）或有限狀態機編排跨角色多代理人（PM 規劃者、執行者、審計者）與結構化知識圖譜（GraphRAG）。

### 4. 完整 Harness 六大工作裝備、好老闆交辦三要素與 Work Agent vs. Code Agent 架構分野 `[FACT]` `[DESIGN_DECISION]` `[SAFETY_BOUND]`
在實際的 Agentic Work 工作現場（蔡炎龍，TAICA 2026 L09–L10），決定代理人能否穩定交付生產級成果的關鍵不在於頻繁更換底層大模型，而在於**完整 Harness（工作裝備）的六元組建構**與**任務規格定義**：
1. **完整 Harness 的六大核心組件** `[FACT]` `[DESIGN_DECISION]`：
   $$\mathcal{H}_{\text{Agent}} = \langle \text{Workspace}, \; \text{Tools}, \; \text{Connectors (MCP)}, \; \text{Skills (\texttt{SKILL.md})}, \; \text{Rules (\texttt{AGENTS.md})}, \; \text{Schedule} \rangle$$
   - **工作環境（Workspace Sandbox）**：隔離且受版本控制的專案資料夾（而非散落於對話框中的零碎文字）。
   - **原生工具（Native Tools）**：檔案讀寫、終端機命令執行、內建瀏覽器互動與語義檢索。
   - **外部連接器（Connectors / MCP）**：連接雲端硬碟、信箱、GitHub 或本地向量知識庫之標準通道。
   - **技能包（Skills / `SKILL.md`）**：將特定任務之標準作業流程（SOP）、腳本與範例封裝為按需載入（On-demand loading）模組。
   - **規則手冊（Rules / `AGENTS.md`）**：專案級「AI 員工手冊」。跨平台工程實務守則：① `CLAUDE.md` 可直接寫入單行 `@AGENTS.md` 引用指令，實現跨工具單一真理來源（SSOT）；② **嚴防規則雙頭馬車**：在部分環境中 `GEMINI.md` 載入優先序高於 `AGENTS.md`，若兩份檔案並存且內容不同步極易引發行為衝突，故應統一維護單一 `AGENTS.md` `[SAFETY_BOUND]`；③ **規則檔字元上限與拆解原則**：Google Antigravity 對單一規則檔設有 **12,000 字元（Characters）** 讀取上限，因此 `AGENTS.md` 應保持精煉（聚焦目錄結構、核心紅線與驗證指令），並將長篇領域細節拆解至各個 `SKILL.md` 按需載入 `[FACT]` `[SAFETY_BOUND]`。
   - **定時排程（Scheduled Triggers）**：於指定時間或事件自動喚醒 Agent 執行例行任務。
2. **「好老闆交辦三要素」（不要讓 AI 猜）與「先訪談、後建檔」協議** `[DESIGN_DECISION]`：
   - **交辦三要素**：① **要什麼成品（Deliverable Spec）**（明確指定輸出檔案路徑、命名與結構格式）；② **有什麼限制（Boundary Constraints）**（明確界定哪些目錄如 `raw/` 絕對唯讀不可動、哪些可修改）；③ **怎麼算做完（Acceptance Criteria）**（明確定義驗收標準——*「說『檢查一下』不算驗證；說『做好一點』不算規格」*）。
   - **先結構化訪談、後生成 `AGENTS.md`（Interview-First Protocol）**：在啟動大型知識庫（如 LLM Wiki）或複雜系統前，應要求 Agent **「先不要建立任何檔案，一次只問一個問題（共 8–10 題）」**，逐一釐清：(1) 目標讀者、(2) 頁面類型、(3) 主要語言與專有名詞保留規範、(4) 出處引用細度（頁碼/章節/圖表號）、(5) 跨文獻矛盾處理方式（並列標註 vs. 採信最新）、(6) 單篇或批次匯入模式、(7) 下游延伸產物（簡報/QA/報告）、(8) 自動化健檢（Lint）規則。待確認需求摘要後，方才生成專屬 `AGENTS.md` `[DESIGN_DECISION]`。
3. **Work Agent vs. Code Agent 的工程本質差異** `[FACT]`：

| 比較維度 | Work Agent（如 ChatGPT Work、Claude、OpenWorker） | Code Agent（如 Antigravity、Claude Code、Codex、OpenCode） |
| :--- | :--- | :--- |
| **主要介面呈現** | 直接展示「最終成品」與「工作摘要」 | 展示「逐行變更差異（Line-by-Line `diff`）」與執行日誌 |
| **版本控制基石** | 依賴人工手動備份或另存新檔（`v1_final.docx`） | **`git` 為原生基本盤**（Commit、Branch、隨時無損 Rollback） |
| **驗收與完成判準** | 靠人類肉眼閱讀檢查（「看起來不錯」） | **靠可執行腳本與測試說了算**（Exit Code $= 0$，「做完了不是 AI 說了算，是腳本說了算」） |

---

## 二、🎓 博士級數學形式化推導：POMDP 形式化、ReAct 迴圈與樹狀思考 (ToT)

### 1. 部分可觀察馬可夫決策過程 (POMDP) `[FACT]`
代理人與軟體開發環境的互動在數學上構成一個 POMDP 7 元組：
$$\mathcal{M} = \langle \mathcal{S}, \mathcal{A}, \mathcal{T}, \mathcal{R}, \Omega, \mathcal{O}, \gamma \rangle$$
- $\mathcal{S}$：軟體系統的全域狀態（檔案系統內容、記憶體變數、隱藏環境變數）。
- $\mathcal{A}$：代理人可執行的動作空間（`run_command`, `replace_file_content`, `view_file`）。
- $\mathcal{T}(s' \mid s, a)$：狀態轉移機率。
- $\Omega$：觀察空間（終端機 stdout/stderr、編譯器回傳資訊）。
- $\mathcal{O}(o \mid s', a)$：觀測機率函數（代理人無法一次性讀取整台電腦硬碟，只能透過有界視窗部分感知）。
- 代理人的目標是學習或提示出一個最優策略 $\pi^*(a_t \mid h_t)$，最大化累積任務獎勵 $\mathbb{E}\left[\sum_{t} \gamma^t \mathcal{R}(s_t, a_t)\right]$。

### 2. ReAct (Reasoning + Acting) 動態推論追蹤
Yao et al. (ICLR 2023) `[LITERATURE_RESULT]` 證明了純推論（Chain-of-Thought）容易累積推理錯誤而無外部糾錯，而純行動（Act-only）缺乏長程目標規劃。
ReAct 將推論軌跡 $\tau_t$ 與動作 $a_t$ 交替交織：
$$\tau_t = \text{LLM}(\text{Prompt}, o_1, a_1, \dots, o_{t-1}, a_{t-1}) \quad \text{[思考：分析當前現狀與下一步假說]}$$
$$a_t = \text{Extractor}(\tau_t) \quad \text{[行動：調用具體 API / Tool]}$$
$$o_t = \text{Environment}(a_t) \quad \text{[觀察：執行結果回饋]}$$
透過環境的反饋 $o_t$ 對思考 $\tau_t$ 進行動態接地（Grounding），打破開迴路幻覺。

### 3. 樹狀思考 (Tree of Thoughts, ToT) 與蒙地卡羅決策搜尋
面對複雜架構設計時，單純線性 Greedy 解碼容易陷入局部死胡同。ToT 將決策建模為樹狀探索：
- 每個節點代表一個部分思考狀態 $s = [x, z_{1 \dots i}]$。
- 狀態評估函數 $V(s)$ 評估當前路徑的可行性（Sure / Likely / Impossible）。
- 結合廣度優先搜尋 (BFS) 或深度優先搜尋 (DFS) 與回溯機制（Backtracking），實現自適應錯誤剪枝。

### 4. 吳恩達 (Andrew Ng) 四大 Agentic Design Patterns、兩階段工具路由與 MCP / A2A 雙層協定拓樸 `[FACT]` `[DERIVATION]` `[DESIGN_DECISION]`
現代代理人工作流（Agentic Workflows，Ng 2024）可歸納為四大正交設計模式與雙層通訊協定：
1. **Reflection（自我反思與異構雙模型審稿迴圈）**：
   將單次開迴路生成 $y^{(0)} \sim P_{\theta_{\mathrm{gen}}}(y \mid x)$ 改為「作者模型 $\theta_{\mathrm{gen}}$」與「評論員模型 $\theta_{\mathrm{critic}}$（可配置異構推理模型或單元測試驗證器）」之交替修正算子：
   $$c^{(k)} \sim P_{\theta_{\mathrm{critic}}}\left(c \mid x, y^{(k)}\right), \quad y^{(k+1)} \sim P_{\theta_{\mathrm{gen}}}\left(y \mid x, y^{(k)}, c^{(k)}\right)$$
2. **Tool Use（兩階段確定性工具路由與 JSON Schema 接地）** `[DERIVATION]` `[DESIGN_DECISION]`：
   自迴歸語言模型本質上不擅長精確算術、即時庫存查詢或外部狀態變更。標準工具調用必須嚴格拆解為**兩階段 LLM 參與閉環（Two-Stage Tool Routing）**：
   - **第一階段（意圖解析與函數參數生成）**：向 LLM 宣告可用工具簽章集合 $\mathcal{F} = \{\texttt{get\_menu}(), \texttt{quote\_order}(\texttt{item\_name}, \texttt{quantity})\}$。當使用者輸入 $u = \text{「我想訂 20 杯麥茶」}$ 時，LLM 不直接心算價格，而是輸出結構化呼叫指令 $a_1 = \texttt{quote\_order("麥茶", 20)}$。
   - **第二階段（宿主確定性執行與 JSON 表單接地合成）**：宿主框架（Harness）攔截並執行真實 Python/資料庫函數，回傳具嚴格欄位名稱之 JSON 資料表單：
     $$o_1 = \texttt{\{"ok": true, "item\_name": "麥茶", "quantity": 20, "unit\_price": 30, "total": 600, "stock": 30, "currency": "TWD", "ordered": false\}}$$
     再將 $(u, a_1, o_1)$ 一併餵回 LLM 生成最終自然語言回覆 $a_2 \sim P_\theta(a \mid u, a_1, o_1)$，確保金額與庫存 $100\%$ 零幻覺。
3. **Planning（先驗任務規劃與 `<think>` 思維鏈拆解）** 與 **Multiagent Collaboration（多代理協作與 PM 分工）**：
   在執行前先由規劃模型（或具備 `<think>...</think>` 顯式推論標籤之推理模型，如 DeepSeek-R1）將複合需求拆解為子任務序列 $\{g_1, g_2, \dots, g_m\}$，並由 PM（Project Manager）代理依專長分派予對應之計算、檢索或審計子代理協同完成。
4. **雙層標準化通訊協定正交解耦：Anthropic MCP vs. Google A2A** `[FACT]` `[DESIGN_DECISION]`：
   - **垂直層 — MCP (Model Context Protocol, Anthropic)**：定義**單一 Agent 如何規劃與調用外部工具、本地檔案或資料來源**之標準化 JSON-RPC 2.0 介面（Agent $\leftrightarrow$ Tools/Data）。
   - **水平層 — A2A (Agent-to-Agent Protocol, Google)**：定義**多個自主 Agent 之間如何交換狀態、探索彼此能力（Agent Card）與協同指派任務**之跨代理通訊協定（Agent $\leftrightarrow$ Agent）。

### 5. AI 時代三種開發模式與「Vibe Coding」之生產工程邊界 `[FACT]` `[SAFETY_BOUND]`
Andrej Karpathy (2025) 將當代軟體工程劃分為三種範式：(1) **純手工編碼**（完全不用 LLM，已不符算力槓桿效益）；(2) **人類主導 + AI 輔助工程（AI-Assisted Engineering）**（人類負責系統架構、審查每一處 Diff 並執行嚴格驗證測試）；(3) **Vibe Coding（直覺流/隨興式編碼）**（完全以自然語言描述需求、不閱讀程式碼、一律點擊 `Accept All`、遇到報錯僅複製貼上 Error Log 讓 AI 盲目修改）。
- **生產級工程安全邊界** `[SAFETY_BOUND]`：Vibe Coding 僅適用於**週末拋棄式玩具專案（Throwaway Weekend Projects）、個人低風險小工具或早期 UI 原型探索**；在**正式上線之生產環境、安全關鍵系統或本知識庫（CS & DL Library）之維護**中，嚴禁採用不看 Diff、不跑驗證的 Vibe Coding 模式，任何變更均須通過 AST 語法、拓樸不變量與單元測試之強制檢驗。

### 6. 從 Prompt、Loop 到 Graph 的控制流圖論演進與雙重審查（Double-Review Reflection）狀態機 `[FACT]` `[DERIVATION]` `[EMPIRICAL_RESULT]` `[SAFETY_BOUND]`
當工作複雜度超越單輪問答時，AI 代理工作流在圖論與控制權歸屬上演化出三種結構範式（Huntley 2025 `Ralph loop`; Osmani 2026 *Loop Engineering*; 蔡炎龍 TAICA 2026 L10）：
1. **Prompt $\to$ Loop $\to$ Graph 的控制流拓樸對照** `[FACT]` `[DESIGN_DECISION]`：
   - **Prompt（單節點開迴路 $G_{\text{prompt}} = (\{A\}, \emptyset)$）**：只執行一次，人類必須在每輪之間充當「人肉黏著劑（Human Glue）」決定下一步。
   - **Loop（自迴圈閉環 $G_{\text{loop}} = (\{A\}, \{(A, A)\})$）**：節點 $A$ 具自迴圈邊（例如 Geoffrey Huntley 2025 之 `Ralph loop`: `while :; do cat PROMPT.md | claude ; done`），由 **AI 在自我執行規格（Self-Executing Spec）內決定下一步**，直到滿足驗收條件。一個具備生產安全性的 Loop 必須具備**五要素（Five Elements of a Safe Loop）**：
     1. **目標（Goal）**：明確的交付檔案位置與格式。
     2. **限制（Constraints）**：哪些來源檔（如 `raw/`）絕對唯讀、禁止填補來源未載明之資訊。
     3. **完成標準（Completion Criteria — 雙層驗收）**：
        - **確定性程式檢查（Deterministic Script Check）**：檢查檔案存在、YAML/JSON 結構、字數與連結有效性。
        - **開啟全新獨立對話之 AI 審查（Fresh-Context Independent AI Review）**——*「不要叫它審自己的作品！」* 同一對話視窗內的模型會受自身先前生成軌跡的注意力錨定（Self-Preference / Confirmation Bias）影響；必須開啟**全新對話（Fresh Context）或異構 Critic 模型**，僅餵入「最終成品」與「原始來源」進行盲審 `[SAFETY_BOUND]`。
     4. **停止剎車條件（Braking Conditions）**：*「沒人看管的 loop，就是在沒人看管下犯錯的 loop。」* 必須強制配置：**硬上限輪數**（例如最多重試 $K_{\max} = 3$ 輪）、**證據不足拒答門檻**（如來源少於 3 頁或缺少實驗數據時直接停機回報缺件，嚴禁硬湊腦補）、以及 **Token 成本熔斷** `[SAFETY_BOUND]`。
     5. **觸發（Trigger）**：手動執行、檔案變更或定時排程。
   - **Graph（有向狀態機與檔案工作流原型 $G_{\text{graph}} = (V, E_{\text{fwd}}, E_{\text{rollback}})$）**：
     - **控制權回歸系統設計者**：當任務由多個異質階段組成（例如「多篇論文 $\to$ 證據卡 $\to$ 大綱 $\to$ 逐頁稿 $\to$ HTML 簡報 $\to$ 驗收報告」），不能把整包工作塞進單一巨大 Loop，否則一旦最後一關出錯，AI 不知道該重讀論文、改大綱還是只修排版。Graph 將控制權交還給**設計者預先定義的有向轉移邊與定向退回邊（Targeted Rollback Edges）**：
       $$\text{設計原則：錯在哪一關，就退回哪一關；大圈很少轉，小圈轉得很快；錯誤在離源頭最近處攔截。}$$
       且每一個 Graph 節點內部仍是一個有界局部小 Loop（例如節點內自我修正上限 $\le 2$ 輪），所有中繼狀態皆持久化為可進 `git` 版本控制的實體檔案（`sources.md` $\to$ `cards/` $\to$ `outline.md` $\to$ `drafts/` $\to$ `deck.html` $\to$ `report.md`）。
     - **節點最小權限讀寫隔離（Least-Privilege Node Context Scoping）** `[SAFETY_BOUND]`：
       - `Node 1 (證據卡提取)`：每次僅准讀取 1 篇論文，輸出 `cards/paper_i.md`（每條主張強制標註頁碼/章節/圖表號）。
       - `Node 2 (大綱規劃)`：僅准讀取 `cards/`，輸出 `outline.md`。
       - `Node 3 (逐頁稿撰寫)`：僅准讀取 `outline.md` 與該頁對應之 `cards/`，輸出 `drafts/slide_k.md`。
       - `Node 4 (HTML 視覺渲染)`：僅准讀取已定稿之 `drafts/`，輸出 `deck.html`，**嚴格禁止改動逐頁稿內文任何一個字（Zero-Text-Mutation Constraint）**。
       - `Node 5 (守門員檢查 Gatekeeper)`：僅准讀取成品與證據卡並輸出 `report.md`，**只負責檢查與觸發定向退回邊（如事實無依據退回 `Node 3`、排版溢位退回 `Node 4`），禁止自己動手改稿**。
2. **四階段雙重審查反思狀態機（Double-Review Reflection Automaton — *English Mistake Coach* 實證）** `[DERIVATION]` `[EMPIRICAL_RESULT]` `[SAFETY_BOUND]`：
   在需要極高精確度與零過度修正（Zero Overcorrection）的序列編修任務中，單次 Reflection 仍可能因 Reviser 引入新語病而劣化。形式化**四階段雙重審查狀態機**定義如下：
   - **Stage 1 (`Writer`)**：輸入原始文本 $x$，依循「最小必要修正（Minimal Necessary Edits）」與「原意保留最高優先（Meaning Preservation First）」原則，輸出初稿候選 $y^{(0)}$ 與結構化差異清單 `edits: [{before, after, category, reason_zh}]`（強制 JSON Schema `additionalProperties: false`）。
   - **Stage 2 (`Reviewer 1` — 獨立初審閘門)**：在不預設立場下檢驗 $(x, y^{(0)})$，輸出三態決策 $d_1 \in \{\texttt{KEEP}, \texttt{REVISE}, \texttt{UNCERTAIN}\}$ 與殘留問題清單。
   - **Stage 3 (條件式 `Reviser` — Conditional Invocation)**：
     $$y^{(1)} = \begin{cases} \text{Reviser}(x, y^{(0)}, c_1), & \text{if } d_1 = \texttt{REVISE} \\ y^{(0)}, & \text{if } d_1 \in \{\texttt{KEEP}, \texttt{UNCERTAIN}\} \end{cases}$$
     當初稿已通過初審（$d_1 = \texttt{KEEP}$）或原句存在語意歧義（$d_1 = \texttt{UNCERTAIN}$）時，**直接跳過 `Reviser`**，不僅節省 1 次 LLM 推論延遲與 Token 成本，更杜絕「沒壞卻硬改（Overcorrection）」之退化風險 `[DESIGN_DECISION]`。
   - **Stage 4 (`Reviewer 2` + Fail-Closed 終審發布閘門)**：對最終候選句 $y^{(1)}$ 執行強制二審並輸出 $d_2 \in \{\texttt{KEEP}, \texttt{REVISE}, \texttt{UNCERTAIN}\}$。系統僅在滿足嚴格合取條件時批准為 `VERIFIED_DOUBLE_REVIEW`：
     $$\text{Approved}(y^{(1)}) \iff \left(d_2 = \texttt{KEEP}\right) \land \left(d_1 \neq \texttt{UNCERTAIN}\right) \land \left(d_2 \neq \texttt{UNCERTAIN}\right)$$
     若任一審稿員標記 `UNCERTAIN`（例如經典雙關歧義句 `"I saw her duck."`），狀態機立即轉入 `NEEDS_CONTEXT` 並向使用者請求上下文澄清，嚴禁擅自猜測竄改原意（實證測試：`"we are go in the school"` 經 4 階段審查消耗 `2,293` Tokens 精準收斂至 `"We are going to school."`；已正確句 `"She went to the library yesterday."` 維持 `is_correct = True` 零誤改） `[EMPIRICAL_RESULT]` `[SAFETY_BOUND]`。

---

## 三、⚙️ 計算機體系結構與硬體微架構映射：記憶體分層與 Token 經濟學

AI Agent 的運算受制於底層計算機資源限制：

```
[Agent 認知記憶體分層架構]
+-------------------------------------------------------------+
| L1: 暫存器級 Context Window (4K ~ 128K Tokens, 即時推論, 成本極高) |
+-------------------------------------------------------------+
                              ▲ 檢索注入 (RAG)
+-------------------------------------------------------------+
| L2: 工作記憶快取 (Scratchpad / Session Journal, 局部任務狀態)  |
+-------------------------------------------------------------+
                              ▲ 雙向同步
+-------------------------------------------------------------+
| L3: 長效外腦儲存庫 (Obsidian Vault OS / Git 知識圖譜, 無上限) |
+-------------------------------------------------------------+
```

### 1. 顯存 KV Cache 擠壓與注意力退化 (Context Saturation)
- 隨著 ReAct 迴圈次數增加，上下文長度 $L$ 急速膨脹，GPU KV Cache 記憶體佔用呈線性暴增。
- 更嚴重的是**「大海撈針效應 (Lost in the Middle)」**：當 Context 超過 32k 時，LLM 對中間區域系統指令的注意力加權顯著下降。
- **最佳實踐**：Agent 必須定期將關鍵事實總結寫入 `scratch/` 或持久化筆記，並對歷史上下文進行有界截斷（Context Compaction）。

### 2. Agentic GraphRAG 與拓樸子圖動態編譯路由 `[DESIGN_DECISION]`
當 Agent 在本知識庫執行跨卷深度推理時，遵循 [[LIB-603 密集檢索、檢索增強生成 (RAG) 與緩存增強生成 (CAG) 系統架構 (Dense Retrieval, RAG & Cache-Augmented Generation Architecture)]] 之 `RULE-603-04`，將檢索動作封裝為三階段認知協議：(1) **小塊精準定位（Child Chunk Hybrid RRF）**：以 BM25 + Dense RRF 鎖定目標公式、代碼塊或 `RULE-xxx-xx`；(2) **母段落與 1-Hop DAG 先修展開**：自動回溯母章節並提取 `prerequisites` 前置卷之全數核心合約；(3) **CAG 子圖預載入編譯**：針對特定專題子圖（$\le 32\text{K}$ Tokens），離線拓樸排序所有上游先修卷並一次性鎖定於 PagedAttention Prefix KV-Cache，使多輪 ReAct 迴圈零檢索延遲存取完整公理鏈 `[DESIGN_DECISION]`。

### 3. 無狀態推論 API（Stateless HTTP API）之 $\mathcal{O}(T^2)$ Token 累積成本、滑動視窗截斷與蘇格拉底式引導除錯 `[FACT]` `[DERIVATION]` `[EMPIRICAL_RESULT]`
在建構多輪對話助教或除錯代理人（如 *TraceBack Detective*，使用 `aisuite` 路由 `groq:openai/gpt-oss-120b`）時，必須從底層網路協定理解為何「每輪對話都必須重送 `system_prompt` 與歷史紀錄」：
1. **HTTP 推論端點的無狀態性（Stateless Inference Protocol）與二次方 Token 累積** `[FACT]` `[DERIVATION]`：
   - 雲端 LLM Chat Completions API 本質為**無狀態（Stateless）函數呼叫**：伺服器不會因為第 1 輪收過 `system_prompt` 就在下一輪自動記住系統人設或對話上下文。在第 $t$ 輪請求中，客戶端必須傳送完整訊息序列 $M_t = [S_{\text{sys}}, u_1, a_1, \dots, u_{t-1}, a_{t-1}, u_t]$。
   - 設系統提示詞長度為 $L_{\text{sys}}$，每輪問答平均新增 Token 數為 $\bar{L}_{\text{turn}} = |u_k| + |a_k|$。若不進行任何歷史截斷，第 $t$ 輪之單次輸入 Token 為 $L_{\text{in}}(t) = L_{\text{sys}} + t \cdot \bar{L}_{\text{turn}}$，而經歷 $T$ 輪對話後的**累積輸入 Token 總量**呈二次方增長：
     $$C_{\text{unbounded}}(T) = \sum_{t=1}^{T} \left(L_{\text{sys}} + t \cdot \bar{L}_{\text{turn}}\right) = T \cdot L_{\text{sys}} + \frac{T(T+1)}{2} \bar{L}_{\text{turn}} = \mathcal{O}(T^2)$$
2. **滑動視窗截斷（Sliding-Window Truncation `history[-2W:]`）與五階 Token 優化策略** `[DERIVATION]` `[DESIGN_DECISION]`：
   - 透過固定保留最近 $W$ 輪對話（例如 `history[-12:]` 保留最近 6 輪 `user`/`assistant` 訊息對，即 $2W = 12$），第 $t$ 輪之訊息負載收斂為：
     $$M_t^{(W)} = [S_{\text{sys}}] \oplus H_{\max(1, \, t-W) \dots t-1} \oplus [u_t], \quad L_{\text{in}}^{(W)}(t) \le L_{\text{sys}} + (W + 1)\bar{L}_{\text{turn}} = \mathcal{O}(1)$$
     使 $T$ 輪累積成本由 $\mathcal{O}(T^2)$ 降階為線性 $\mathcal{O}(T)$！
   - **五階工程控制路線**：① **滑動視窗截斷**（`history[-2W:]`）；② **早期歷史摘要壓縮（Conversation Summarization）**（將滑出視窗的舊對話濃縮為結構化狀態摘要，防止長程除錯遺忘最初的報錯環境）；③ **前綴提示詞快取（Prompt Caching / Prefix KV-Cache）**（將固定不動的 $S_{\text{sys}}$ 置於訊息陣列最前端 `index 0`，讓推論引擎直接命中顯存 KV-Cache 前綴）；④ **單次輸出上限（`max_tokens` Budget）與 Usage 遙測**；⑤ **蘇格拉底式引導人設（Socratic Guided Debugging Persona）**——相較於一次傾倒數百行完整解答的直答模式（`Persona v1`），蘇格拉底除錯教練（`Persona v2`）每次僅執行「錯誤分類 $\to$ 定位單一可疑行 $\to$ 提出一個驗證問題」，在提升學習者除錯認知遷移的同時大幅壓低每輪 Output Tokens `[EMPIRICAL_RESULT]`。

---

## 四、💻 工業級工程實作：強健型 Agent 執行迴圈與錯誤恢復引擎

```python
import json
import traceback

class ProductionAgentLoop:
    def __init__(self, tools_dict, max_iterations=10):
        self.tools = tools_dict
        self.max_iterations = max_iterations
        self.trajectory = []

    def execute_step(self, user_goal: str):
        print(f"[*] 啟動 Agent 認知閉環，目標: {user_goal}")
        for step_idx in range(self.max_iterations):
            # 1. 思考與決策生成 (此處模擬 LLM 結構化輸出)
            decision = self.mock_llm_reasoning(user_goal, self.trajectory)
            thought = decision.get("thought")
            action = decision.get("action")
            action_input = decision.get("action_input")
            
            print(f"\n[Step {step_idx + 1}] 思考: {thought}")
            self.trajectory.append({"role": "assistant", "thought": thought, "action": action})
            
            if action == "finish":
                print(f"[+] 任務圓滿達成: {action_input}")
                return action_input
                
            # 2. 安全執行工具
            tool_fn = self.tools.get(action)
            if not tool_fn:
                obs = f"錯誤: 未知工具 '{action}'"
            else:
                try:
                    obs = tool_fn(**action_input)
                except Exception as e:
                    obs = f"工具執行崩潰: {str(e)}\n{traceback.format_exc()}"
                    
            print(f"[Step {step_idx + 1}] 觀察反饋: {obs[:100]}...")
            self.trajectory.append({"role": "environment", "observation": obs})
            
        print("[-] 超出最大疊代限制，觸發安全終止。")
        return None

    def mock_llm_reasoning(self, goal, history):
        # 示範自動化三步驗證
        if len(history) == 0:
            return {"thought": "首先檢視現有目錄結構以確認狀態", "action": "list_files", "action_input": {"path": "."}}
        elif len(history) == 2:
            return {"thought": "已獲取檔案清單，開始執行單元測試驗證", "action": "run_test", "action_input": {"test_name": "test_matrix"}}
        else:
            return {"thought": "測試通過，向使用者回報完成", "action": "finish", "action_input": "系統構建完成且全數通過測試"}

if __name__ == "__main__":
    demo_tools = {
        "list_files": lambda path: "LIB-000.md, LIB-101.md, LIB-203.md",
        "run_test": lambda test_name: "PASSED: 12 unit tests executed with 0 errors."
    }
    agent = ProductionAgentLoop(demo_tools)
    agent.execute_step("驗證並升級深度學習圖書館")

    # 示範兩階段確定性工具路由 (Two-Stage Tool Routing: quote_order JSON Grounding)
    menu_db = {"麥茶": {"unit_price": 30, "stock": 30}}
    def quote_order(item_name: str, quantity: int) -> str:
        item = menu_db.get(item_name)
        if not item:
            return json.dumps({"ok": False, "error": "Item not found"}, ensure_ascii=False)
        total = item["unit_price"] * quantity
        return json.dumps({
            "ok": quantity <= item["stock"],
            "item_name": item_name,
            "quantity": quantity,
            "unit_price": item["unit_price"],
            "total": total,
            "stock": item["stock"],
            "currency": "TWD",
            "ordered": False
        }, ensure_ascii=False)

    tool_json = json.loads(quote_order("麥茶", 20))
    assert tool_json["ok"] is True and tool_json["total"] == 600

    # 示範三：無狀態 API 滑動視窗截斷 (history[-12:]) 與 O(T^2) -> O(T) Token 複雜度驗證
    def build_stateless_messages(system_prompt: str, history: list, user_msg: str, window_messages: int = 12) -> list:
        trimmed = history[-window_messages:] if window_messages > 0 else []
        return [{"role": "system", "content": system_prompt}, *trimmed, {"role": "user", "content": user_msg}]

    mock_hist = [{"role": "user" if i % 2 == 0 else "assistant", "content": f"turn_{i}"} for i in range(20)]
    payload = build_stateless_messages("You are TraceBack Detective.", mock_hist, "Why KeyError?", window_messages=12)
    assert payload[0]["role"] == "system" and len(payload) == 1 + 12 + 1

    # 示範四：四階段雙重審查反思狀態機 (Double-Review Reflection Fail-Closed Gate)
    def evaluate_double_review_gate(r1_decision: str, r2_decision: str, draft_text: str, revised_text: str | None) -> dict:
        reviser_invoked = (r1_decision == "REVISE")
        final_candidate = revised_text if (reviser_invoked and revised_text) else draft_text
        if r1_decision == "UNCERTAIN" or r2_decision == "UNCERTAIN":
            status, approved = "NEEDS_CONTEXT", False
        elif r2_decision == "KEEP":
            status, approved = "VERIFIED_DOUBLE_REVIEW", True
        else:
            status, approved = "NOT_APPROVED", False
        return {"status": status, "approved": approved, "reviser_invoked": reviser_invoked, "final": final_candidate}

    res_ok = evaluate_double_review_gate("KEEP", "KEEP", "We are going to school.", None)
    res_ambig = evaluate_double_review_gate("UNCERTAIN", "UNCERTAIN", "I saw her duck.", None)
    assert res_ok["approved"] is True and res_ok["reviser_invoked"] is False
    assert res_ambig["approved"] is False and res_ambig["status"] == "NEEDS_CONTEXT"
```

---

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-703-01] ReAct 軌跡嚴格閉環合約 (ReAct Closed-Loop Execution Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件 (Pre-conditions)**: Agent 進行任何多步推論與工具調用。
- **決策邊界**: 必須嚴格遵循三部曲閉環：`Thought` $\to$ `Action` $\to$ `Observation`。
- **執行保證**: 嚴禁在未接收真實環境 `Observation` 輸出之前，擅自臆測或偽造工具執行結果；嚴禁連續發動兩個依賴性變更動作。

### [RULE-703-02] 外部神經認知皮層 (Obsidian Vault) 本地持久化合約 (External Cortex Persistence Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件 (Pre-conditions)**: 執行架構重構、重大錯誤修復、演算法調優或任務交接。
- **決策邊界**: 
  - 禁止將關鍵長期記憶僅保留在揮發性的上下文窗口（Context Window）中。
  - 必須強制將架構決策寫入本地 Obsidian Vault Markdown 文件（遵循 `AGENTS.md`, `LIB-XXX` 格式），並透過「LLM Wiki」編譯流程（`raw/` $\to$ 結構化專卷 + 雙向 DAG 連結 + 自動化 Linter 健檢）消除知識碎片與跨卷矛盾。
- **執行保證**: 保證跨 Agent Session、跨進程具備 100% 可重播之確定性長程記憶。

### [RULE-703-03] Token 預算經濟學與動態滑動摘要合約 (Token Budget & Memory Pruning Heuristic)
- **合約等級**: `RESOURCE_CONSTRAINT`
- **前置條件 (Pre-conditions)**: 多輪對話與執行軌跡累積。
- **量化決策邊界 (Decision Thresholds)**:
  - 當當前 Context Window 消耗達到上限之 $70\%$ 時，Agent 必須強制觸發記憶壓縮。
  - 將歷史軌跡壓縮為結構化摘要（保留：已證實結論、已排除假說、關鍵變更檔案路徑），釋放注意力空間。

### [RULE-703-04] 故障自我反思與重試上限熔斷合約 (Reflexion Retry Limit & Fallback Guardrail)
- **合約等級**: `BOUNDARY_GUARD`
- **前置條件 (Pre-conditions)**: 工具調用或代碼執行拋出異常。
- **量化決策邊界 (Decision Thresholds)**:
  - 單一工具或路徑之連續重試上限嚴格為 **3 次**。
  - 若連續失敗 2 次，必須啟動自我反思（Reflexion），分析失敗根因並切換至備選演算法或回滾，禁止陷入同錯誤無休止死循環。

### [RULE-703-05] 兩階段確定性工具路由、MCP/A2A 協定解耦與生產級反 Vibe Coding 驗證合約 (Two-Stage Tool Grounding, MCP/A2A & Anti-Vibe-Coding Guardrail)
- **合約等級**: `BOUNDARY_GUARD`
- **前置條件 (Pre-conditions)**: Agent 處理涉及精確算術、即時狀態查詢（如報價、庫存、系統指標）或提交生產級程式碼與知識庫變更。
- **量化決策邊界 (Decision Thresholds)**:
  - **兩階段確定性工具剝離**：凡涉及算術計價、資料庫狀態或環境查詢，嚴禁由 LLM 直接心算生成數值；必須強制執行兩階段路由（Stage 1: 生成結構化函數呼叫 $\to$ Stage 2: 宿主執行並回傳 JSON Schema 狀態表單供 LLM 接地回覆） `[DESIGN_DECISION]`。
  - **MCP 與 A2A 正交邊界**：單一代理對外部工具/資料源之垂直存取採用 **MCP** JSON-RPC 介面；跨代理人之水平任務分派與狀態協商採用 **A2A** 雙向訊息協議 `[FACT]`。
  - **生產環境禁止盲目 Vibe Coding**：在生產級代碼庫與核心知識庫分支中，嚴禁在未審查 Diff 與未執行自動化驗證腳本（Exit Code $= 0$）前直接合併 AI 生成內容 `[SAFETY_BOUND]`。

### [RULE-703-06] 自主迴圈（Loop）五要素、硬上限剎車與獨立對話審查合約 (Autonomous Loop Five-Element, Hard Brake & Fresh-Context Review Invariant)
- **合約等級**: `SAFETY_CRITICAL`
- **前置條件 (Pre-conditions)**: 設計或啟動任何具備自我迭代能力之自主代理迴圈（Loop Engineering / Ralph Loop）或員工手冊（`AGENTS.md`）。
- **量化決策邊界 (Decision Thresholds)**:
  - **迴圈五要素與雙層驗收強制令**：任何自主 Loop 規格必須完整定義 **(1) 目標、(2) 唯讀與邊界限制、(3) 完成標準、(4) 停止剎車條件、(5) 觸發方式**。其完成標準必須結合**確定性腳本檢查（Exit Code $= 0$）**與**開啟全新獨立對話視窗之 AI 審查（Fresh-Context Independent Review，只給最終成品與原始來源，嚴禁在同一生成對話中讓 AI 自己審自己的作品）** `[SAFETY_BOUND]`。
  - **硬上限剎車與缺件拒答**：必須配置連續迭代硬上限（如 $K_{\max} \le 3$ 輪）與來源不足拒答門檻（當原始證據缺漏或少於最低頁數門檻時立即停機回報缺件，嚴禁腦補硬湊） `[SAFETY_BOUND]`。
  - **規則檔單一真理來源與字元上限**：跨代理規則檔應統一以 `AGENTS.md` 為單一來源（`CLAUDE.md` 以 `@AGENTS.md` 引用，避免與 `GEMINI.md` 雙份並存衝突），且單一規則檔須控制在 **$\le 12,000$ 字元**內，超過之SOP 細節必須拆分至 `SKILL.md` 按需載入 `[FACT]` `[SAFETY_BOUND]`。
- **違規後果**: 缺乏剎車條件與獨立上下文審查的 Loop 將淪為「在沒人看管下無限犯錯、自我合理化並耗盡 Token 預算」的失控迴圈。

### [RULE-703-07] 圖工作流（Graph）節點最小權限讀寫隔離、定向退回與雙重審查閉鎖合約 (Graph Node Least-Privilege Scoping, Targeted Rollback & Double-Review Fail-Closed Gate)
- **合約等級**: `BOUNDARY_GUARD`
- **前置條件 (Pre-conditions)**: 編排多階段複雜知識工程或內容生成管線（如多篇論文轉簡報、精確文本編修、多代理狀態機）。
- **量化決策邊界 (Decision Thresholds)**:
  - **節點最小權限讀寫隔離與零竄改紅線**：在有向圖工作流 $G=(V, E_{\text{fwd}}, E_{\text{rollback}})$ 中，每個節點必須綁定嚴格的輸入/輸出檔案白名單（中繼產物全數落地為可進 `git` 之實體檔案）；下游視覺/排版渲染節點（如 `drafts/ -> deck.html`）**嚴禁竄改上游定稿文字之任何一字**，而守門員審查節點（Gatekeeper）**僅准輸出檢查報告與觸發定向退回邊（錯在哪一關就退回哪一關），嚴禁自行動手改稿** `[SAFETY_BOUND]`。
  - **雙重審查 Fail-Closed 發布閘門**：在高精確度編修管線（`Writer -> Reviewer 1 -> 條件式 Reviser -> Reviewer 2`）中，僅當 $d_1 = \texttt{REVISE}$ 時才呼叫 `Reviser`（防範過度修正 Overcorrection），且最終成品必須通過 `Reviewer 2 == KEEP` 且無任何 `UNCERTAIN` 語意歧義標記方可發布 `[EMPIRICAL_RESULT]` `[SAFETY_BOUND]`。
- **違規後果**: 跨階段權限混雜將導致排版節點暗中破壞事實準確度，或在大迴圈中因無法定位錯誤源頭而反覆重工。
---

## 六、📚 權威論文、經典著作與同行評審文獻 (Canonical & Peer-Reviewed References)

1. **ReAct 代理人架構開山巨作 (ICLR 頂會)**
   - *Paper*: Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., & Cao, Y. (2023). "ReAct: Synergizing Reasoning and Acting in Language Models." *International Conference on Learning Representations (ICLR 2023)*. arXiv: [2210.03629](https://arxiv.org/abs/2210.03629).
   - *Core Contribution*: 提出交替循環之推論與行動軌跡（Thought $\to$ Action $\to$ Observation），徹底突破純 Chain-of-Thought 無法與外在環境動態互動之死穴。
2. **Tree of Thoughts (ToT) 樹狀思考架構 (NeurIPS 頂會)**
   - *Paper*: Yao, S., Yu, D., Zhao, J., Shafran, I., Narasimhan, K., & Cao, Y. (2023). "Tree of Thoughts: Deliberate Problem Solving with Large Language Models." *Advances in Neural Information Processing Systems (NeurIPS 2023)*, 36.
   - *Core Contribution*: 讓 LLM 具備自主生成多重候選想法、自我評估價值並進行啟發式搜尋（BFS/DFS 與回溯剪枝）的能力。
3. **Reflexion 言語強化學習代理人 (NeurIPS 頂會)**
   - *Paper*: Shinn, N., Cassano, F., Gopinath, A., Narasimhan, K., & Yao, S. (2023). "Reflexion: Language Agents with Verbal Reinforcement Learning." *Advances in Neural Information Processing Systems (NeurIPS 2023)*, 36.
   - *Core Contribution*: 透過短期工作記憶與自我反思軌跡評估錯誤，無需微調模型權重即可在試錯中自我進化。
4. **大模型智慧代理人權威綜述**
   - *Paper*: Wang, L., Ma, C., Feng, X., Zhang, Z., Yang, H., Zhang, J., ... & Ji, H. (2024). "A Survey on Large Language Model based Autonomous Agents." *Frontiers of Computer Science*, 18(6), 186345. DOI: [10.1007/s11704-024-40231-1](https://doi.org/10.1007/s11704-024-40231-1).
   - *Core Contribution*: 系統化定義現代 Agent 之 Profiling, Memory, Planning, Action 四大核心模組標準。
5. **人工智慧經典聖經**
   - *Book*: Russell, S., & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson. ISBN: 978-0134610993.
   - *Core Contribution*: 部分可觀察馬可夫決策過程 (POMDP)、效用理論與理性代理人形式化定義。
6. **Agentic Design Patterns 與模型上下文協定 (MCP / A2A)**
   - *Reference*: Ng, A. (2024). "Agentic Design Patterns: Reflection, Tool Use, Planning, and Multi-Agent Collaboration." *DeepLearning.AI*; Anthropic (2024). *Model Context Protocol (MCP) Specification*; Google (2025). *Agent2Agent (A2A) Open Protocol*.
   - *Core Contribution*: 確立現代 AI Agent 四大設計模式，以及垂直工具呼叫（MCP）與水平跨代理協作（A2A）之雙層開放協定標準。
7. **Loop Engineering、Ralph Loop 與 Graph 工作流編排實務**
   - *Reference*: Tsai, Y.-L. (蔡炎龍) (2026). *TAICA 生成式 AI：文字與圖像生成的原理與實務 — Unit 09 (換你當老闆：Agentic Work 與 AI 工作現場) & Unit 10 (把你的工作拆成 AI 能做的流程：Loop、Graph 與 Workflow Prototype)*. National Chengchi University (NCCU); Osmani, A. (2026). *Loop Engineering & Self-Executing Specs*; Huntley, G. (2025). *The Ralph Loop Pattern*.
   - *Core Contribution*: 確立完整 Harness 六大裝備、好老闆交辦三要素、Loop 五要素（含獨立對話審查與硬上限剎車）以及 Graph 節點最小權限讀寫隔離與定向退回狀態機。
