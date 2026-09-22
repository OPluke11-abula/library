---
call_number: LIB-703
title: 現代大模型代理人 (LLM Agent) 認知架構與推論協議 (LLM Agent Cognitive Architecture & Protocols)
module: Reinforcement-Learning-Agents
category: Agent-Cognition
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
status: Verified-Authoritative-Production
math_foundations:
  - Partially Observable Markov Decision Process (POMDP)
  - ReAct Trajectory Optimization & Thought-Action Synergy
  - Tree-of-Thoughts (ToT) Graph-Search & Heuristic Pruning
hardware_target:
  - Local Filesystem External Cortex (Obsidian Vault OS)
  - Subagent Multi-Process Async Execution Pool
invariants_count: 4
created: 2026-09-17
author: 游啓揚 (Luke, 資訊三乙, 11327229) & AI Research Agent (Antigravity)
prerequisites:
  - "[[LIB-405 注意力機制、Transformer 革命與位置編碼幾何 (Attention Mechanism & Transformer Revolution)]]"
  - "[[LIB-602 現代大語言模型架構解剖與縮放定律 (Modern LLM Architecture & Scaling Laws)]]"
successors:
  - "[[LIB-704 雙進程神經代理人：S1 非自迴歸型態決策引擎 (Jev) 與字節級介面反射模型 (CUA-S1) 深度解剖 (Dual-Process Neural Agent - S1 Non-Autoregressive Typed Decision Engine (Jev) & Byte-Level Interface Reflex Model (CUA-S1))]]"
  - "[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]"
tags:
  - 圖書館
  - 強化學習
  - 智慧代理人
  - Agent
  - ReAct
  - Obsidian
  - POMDP
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/07_reinforcement_learning_and_agents/LIB-703%20LLM%20Agent%20Cognitive%20Architecture%20%26%20Protocols%20%28Agent%20EN%29.md)

# 現代大模型代理人 (LLM Agent) 認知架構與推論協議 (LLM Agent Cognitive Architecture & Protocols)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-405 注意力機制、Transformer 革命與位置編碼幾何 (Attention Mechanism & Transformer Revolution)]]。
- **後續節點**：[[LIB-704 雙進程神經代理人：S1 非自迴歸型態決策引擎 (Jev) 與字節級介面反射模型 (CUA-S1) 深度解剖 (Dual-Process Neural Agent - S1 Non-Autoregressive Typed Decision Engine (Jev) & Byte-Level Interface Reflex Model (CUA-S1))]]、[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]、自主研究系統。
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

---

## 二、🎓 博士級數學形式化推導：POMDP 形式化、ReAct 迴圈與樹狀思考 (ToT)

### 1. 部分可觀察馬可夫決策過程 (POMDP)
代理人與軟體開發環境的互動在數學上構成一個 POMDP 7 元組：
$$\mathcal{M} = \langle \mathcal{S}, \mathcal{A}, \mathcal{T}, \mathcal{R}, \Omega, \mathcal{O}, \gamma \rangle$$
- $\mathcal{S}$：軟體系統的全域狀態（檔案系統內容、記憶體變數、隱藏環境變數）。
- $\mathcal{A}$：代理人可執行的動作空間（`run_command`, `replace_file_content`, `view_file`）。
- $\mathcal{T}(s' \mid s, a)$：狀態轉移機率。
- $\Omega$：觀察空間（終端機 stdout/stderr、編譯器回傳資訊）。
- $\mathcal{O}(o \mid s', a)$：觀測機率函數（代理人無法一次性讀取整台電腦硬碟，只能透過有界視窗部分感知）。
- 代理人的目標是學習或提示出一個最優策略 $\pi^*(a_t \mid h_t)$，最大化累積任務獎勵 $\mathbb{E}\left[\sum_{t} \gamma^t \mathcal{R}(s_t, a_t)\right]$。

### 2. ReAct (Reasoning + Acting) 動態推論追蹤
Yao et al. (ICLR 2023) 證明了純推論（Chain-of-Thought）容易累積推理錯誤而無外部糾錯，而純行動（Act-only）缺乏長程目標規劃。
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
```

---
---
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
  - 必須強制將架構決策寫入本地 Obsidian Vault Markdown 文件（遵循 `AGENTS.md`, `LIB-XXX` 格式）。
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
