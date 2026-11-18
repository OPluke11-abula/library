---
call_number: LIB-907
status: reviewed
invariants_count: 4
title: 科研缺口發掘、方法層級撞題審查與低算力先導選題方法論 (Research Gap Discovery, Novelty Collision & Topic Selection)
module: Research-Methodology
category: Gap-Discovery-and-Pilot-Engineering
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Four-Pass Primary Literature Verification & 15-Column Provenance Matrix
  - Three-Dimensional Collision Verdict & Representation Substitution Test
  - Failure-First Hard Gate Progression (P0 -> G1 -> G2 -> G3 -> Novelty Gate)
  - Constrained-Compute Minimal Pilot Design & Sequential Stop-Loss Criteria
hardware_target:
  - Constrained Local Hardware (4GB–8GB VRAM Laptop / CPU) & Single-GPU Cloud Quota Budgets
  - Empirical Epistemic Firewall (Author-Reported vs. Estimate vs. Reproduced vs. Unrun)
created: 2026-11-17
author: Luke
tags:
  - 圖書館
  - 科研方法論
  - 缺口發掘
  - 撞題審查
  - 先導實驗
  - 低算力驗證
  - 認識論護欄
prerequisites:
  - "[[LIB-503 現代物件偵測架構、定位不確定性與遮擋校準 (Modern Object Detection, Localization & Occlusion Reliability)]]"
  - "[[LIB-507 少視角 3DGS 幾何可靠性、單目深度先驗與局部仿射校正邊界 (Sparse-View 3DGS Geometry, Depth Priors & Reliability)]]"
  - "[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]"
  - "[[LIB-904 學術科研文獻體系與前沿研究對齊 (Academic Research Corpus & Literature Synthesis)]]"
  - "[[LIB-906 對話質疑下的選擇性認知修訂：研究基準與實驗藍圖 (LLM Conversational Epistemic Revision)]]"
successors: []
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/09_research_methodology/LIB-907%20Research%20Gap%20Discovery,%20Novelty%20Collision%20%26%20Topic%20Selection%20%28Agent%20EN%29.md)

# 科研缺口發掘、方法層級撞題審查與低算力先導選題方法論 (Research Gap Discovery, Novelty Collision & Topic Selection)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-503 現代物件偵測架構、定位不確定性與遮擋校準 (Modern Object Detection, Localization & Occlusion Reliability)]]、[[LIB-507 少視角 3DGS 幾何可靠性、單目深度先驗與局部仿射校正邊界 (Sparse-View 3DGS Geometry, Depth Priors & Reliability)]]、[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]、[[LIB-904 學術科研文獻體系與前沿研究對齊 (Academic Research Corpus & Literature Synthesis)]]、[[LIB-906 對話質疑下的選擇性認知修訂：研究基準與實驗藍圖 (LLM Conversational Epistemic Revision)]]。
- **後續節點**：無（Hall 09 科研選題與實證閘門終端總成卷）。
- **核心定位**：彙整 `LIB-904`（`RULE-904-05`）延展之科研作業系統，建立一套**不受特定題目綁定、專為消費級受限硬體（4GB–8GB 筆電＋有限單卡雲端配額）與高壓發表時程設計的通用科研缺口檢證、撞題排除與最小先導實驗（Minimal Pilot）決策體系**。

---

## 一、💡 學士直觀心智模型：為何「靈感很強」常常變成「花三個月幫別人復現」？

研究新手與 AI 研究助理最容易犯三個致命錯誤 `[FACT]`：
1. **讀完一篇基準論文就以為找到世界唯一缺口**：把某篇 Anchor Paper 的限制條件當作「學界還沒解決」，卻沒去查同年 CVPR/ECCV/NeurIPS 是否已經發了兩篇專修此坑的論文——直接產生 **Novelty Collision（撞題沈沒成本）** `[DESIGN_DECISION]`。
2. **先想「要改哪個 Loss / 加什麼模組」，不先證偽失效是否存在**：把假設性退化當既成事實，砸數週寫好複雜正則項與新網路，跑起來才發現原始方法根本沒出現宣稱的那個錯，或者基準開源程式自己就修掉了 `[FACT]`。
3. **混淆「本機筆電顯存現況」與「研究選題可行性」**：既不能忽略本機 `4GB–8GB VRAM` 的實作條件盲排重算力掃描，**亦嚴禁將本機顯存直接當作全域題目淘汰門檻（`Local GPU VRAM is an observed hardware fact, not a global research-topic elimination threshold`）** `[SAFETY_BOUND]`。

---

## 二、🎓 博士級形式化框架：四階段驗證、15 欄撞題矩陣與停損閘門

### 1. Pass 1–4 論文核對與 15 欄來源驗證矩陣 `[DESIGN_DECISION]`
任何可能左右選題的 2024–2026 研究文獻，禁止憑摘要記憶或二手部落格引用，必須建立包含以下 **15 個強制欄位** 的稽核矩陣並嚴格區分認識論標籤 `VERIFIED` / `INFERRED` / `UNVERIFIED`：
1. `Paper`（完整作者、年份、正式會議或期刊名稱）
2. `Source`（官方 DOI / arXiv ID / CVF / OpenReview 連結）
3. `Problem`（解決的明確問題定義）
4. `Mechanism`（數學形式化與核心演算法機制）
5. `Assumptions`（方法暗含的幾何、數據或分佈前提）
6. `Failure`（已知或可推導但尚未實證之失效情境）
7. `Evidence`（對應原論文精確 Section / Table / Figure 編號）
8. `Code`（官方開源儲存庫與明確軟體授權條款，慎防商業／研究衍生限制）
9. `Dataset`（訓練、校準與獨立幾何／定位評估基準集）
10. `Metrics`（直接對齊研究主張的量化指標）
11. `Compute`（嚴格標記作者報告硬體型號與實測秒數／分鐘數）
12. `Single_GPU_Repro_Risk`（在 `4GB / 8GB / 16GB T4` 單卡重現與編譯風險）
13. `Novelty_Collision`（與候選構想之機制重疊度剖析）
14. `Confidence`（區分 `VERIFIED`、`INFERRED`、`UNVERIFIED`）
15. `Actionable_Delta`（該研究仍真正開放且未飽和的剩餘科學問題）

### 2. 三維撞題裁決與表徵替換檢驗 (`Representation Substitution Test`) `[DERIVATION]`
在進入實作前，對候選構想進行三維撞題判定（任一核心軸向過密即拒絕直接立題）：
- **維度 I（Task & Protocol Collision）**：相同輸入條件、相同基準切分與相同任務定義（避免拿不同基準或混淆任務如 Amodal 分割 vs Box 偵測蒙混）。
- **維度 II（Mechanism Collision）**：必須驗證「是否只是把既有論文的置信門控、深度差降權、隨機剪枝、換 Backbone 或換 Loss 重新包裝」？
  - 執行 **表徵替換檢驗**：將擬議公式的符號（如「梯度不一致度」換成「不確定性分數」）遮罩對比最近 3 篇先行工作；若功能角色與更新幾何等價，則判為 `DIRECT_COLLISION_DO_NOT_PURSUE`，不得強行包裝 `[SAFETY_BOUND]`。
- **維度 III（Evaluation Collision）**：宣稱改進的度量指標是否已有強基準（如 Post-hoc Isotonic Regression 之於偵測校準，或 `DepthGS`/`StereoGS` 之於多視角深度）穩健領先？
- **裁決三元組**：僅允許輸出 `CLEAR_GAP`、`PARTIAL_OVERLAP_REQUIRES_SCOPING`（必須明確書寫可消滅重疊之差異條件），或 `DIRECT_COLLISION_DO_NOT_PURSUE` `[DESIGN_DECISION]`。

### 3. Failure-First 漸進式驗證閘門 (`P0 -> G1 -> G2 -> G3 -> Novelty`) `[DESIGN_DECISION]`
與 `LIB-904`（`RULE-904-05`）雙向銜接，任何複雜專題嚴禁跳過前置門檻直接設計最後演算法：
1. **`P0`（Code & Baseline Compatibility Gate）**：不改一行演算法，先在目標單卡或受限環境內跑通開源官方程式、確認 CUDA / OpenCV 相依套件相容性及實際單回合峰值 VRAM／耗時。
2. **`G1`（Zero-GPU CPU Synthetic Counterexample）**：在純 CPU 上用可控幾何／統計模型驗證核心直覺反例是否真的發生在數學邏輯層（耗時分鐘至數小時，成本為零）。
3. **`G2`（Minimal Single-Run Real-Scene Pilot）**：在 1–2 個具獨立真值的代表場景／驗證子集跑固定單一種子 baseline，**量測主失敗訊號真實強度**。若退化幅度遠小於基準噪音，**立即停止（Pivot / NO-GO）**！
4. **`G3`（Scene-Level Rigorous Statistics）**：達成足夠獨立場景統計樣本＋無洩漏切分（`Scene-disjoint` / `Cal-Test Disjoint`）＋Bootstrap 信賴區間（$B \ge 1{,}000$）。
5. **`Novelty Gate`（Mechanism Synthesis）**：只有在 `P0+G1+G2` 確實抓到既有公開強基準仍會犯錯的證據後，始核准設計對症機制並進行對照消融 `[SAFETY_BOUND]`。

### 4. 認識論標籤隔離矩陣（嚴禁未執行偽裝實證） `[SAFETY_BOUND]`

| 允許狀態標籤 | 嚴格語意定義 | 可作為「立論／簡報已證實依據」？ |
| :--- | :--- | :--- |
| `AUTHOR_REPORTED` | 直接抄錄自原論文正文表格或官方 README，附硬體型號與實驗條件 | **是**（僅代表作者在彼硬體與設定之實績，非本團隊實測） |
| `TEAM_ESTIMATE` | 依模型參數量與單步算子推估本機或雲端單卡預估耗時／VRAM | **否**（必須標明估算邊界與潛在 OOM 風險） |
| `REPRODUCED_BY_TEAM` | 團隊親自執行指令並保留完整 log、種子與檢核產物之結果 | **是**（真實本機實證） |
| `NOT_RUN` | 尚未上機實際運行之實驗構想或待驗先導項目 | **否**（嚴禁寫成 `PASS` 或 `MEASURED`） |

---

## 三、⚙️ 異質硬體調度原則與算力淘汰防錯邊界 (`4GB / 8GB 本機` vs. `單卡雲端`)

> **核心算力政策準則（Compute Policy Principle） `[DESIGN_DECISION]` `[SAFETY_BOUND]`**：
> **Local GPU VRAM is an observed hardware fact, not a global research-topic elimination threshold.**
> 研究需要 `12GB`、`16GB` 或 `24GB VRAM` 並不代表可直接判定 `NO-GO`。凡擬以算力／成本為由做出任何 `NO-GO` 結論前，必須**依可追溯資源與實驗成本分析**完整回答以下六題（**嚴禁** `VRAM > 8GB => NO_GO`、`Cannot run locally => REJECT`、`3DGS training is expensive => REJECT`、`Colab required => REJECT`）：
> 1. **雲端單卡取得性**：是否可在實際取得的單張雲端 GPU（如 Colab T4 / L4）執行？
> 2. **權重複用評估**：是否一定要從頭完整訓練，抑或可採用 Checkpoint 或 Pretrained Models？
> 3. **全套消融總成本**：Baseline 與必要關鍵 Ablation 的總算力與配額成本為何？
> 4. **縮減實驗可行性**：能否合理縮減資料規模、場景數、解析度或實驗設定進行先導檢驗？
> 5. **科學效度保持性**：縮減設定是否仍保留核心機制的科學可驗證性（未破壞研究問題本身）？
> 6. **時程與配額足額度**：研究團隊剩餘時程與實際雲端配額是否足以支撐？

針對多成員異質算力池（輕量 4GB／中階 8GB 本機筆電與雲端單卡配額，未實跑測試一律維持 `NOT_RUN / UNVERIFIED`），高效率研究管線可採 **「運算任務分級調度流（Tiered Offloading）」** `[DESIGN_DECISION]`：
1. **零重訓特徵／張量快取分離（Inference-Cache-then-CPU-Ablation）**：大型 2D 偵測器或基礎模型僅做極少次數前向推論並匯出輕量張量（`logits` / `edge_dists` / `depths`），後續統計校準、Bootstrap 與超參數搜尋降維回 CPU `NumPy/PyTorch` 進行（可高頻迭代且節省雲端配額） `[DESIGN_DECISION]`。
2. **CUDA 重編譯任務配置與「示例性先導預算」**：自訂 3DGS 光柵器可在能編譯之雲端單卡（如 16GB T4 / 24GB L4）或低顯存縮減配置執行單種子驗證；每回先導實驗可依任務特性自訂**示例性／可調整的實驗時間預算（Illustrative / Configurable Pilot Budget，例如僅作參考示意的 `60 min` 單回熔斷閾值——其目的為提醒縮減設定或改至雲端單卡執行，絕非適用於所有研究題目的固定 Hard Gate）** `[SAFETY_BOUND]`。
3. **停止規則三態契約 (`GO / HOLD / NO-GO`)**：每個 Minimal Pilot 在啟動前應預設明確的數值化失敗訊號檢驗規則；超時預算觸發 **`HOLD`（調整規模或遷移單卡雲端）** 而非未經六問評估即草率 `NO-GO` `[DESIGN_DECISION]`。

---

## 四、💻 工業級工程實作：`DecisionGateValidator` 認識論與撞題停損守衛

以下純標準函式庫 Python 驗證器強制檢驗：(1) `NOT_RUN` 實驗不得被標記為過關或已量測；(2) `15-Column Matrix` 無缺少核心來源與 `Confidence` 標籤；(3) 三維撞題或 Pilot 停損觸發時精準攔截：

```python
from dataclasses import dataclass
from typing import Dict, List, Literal

ProvenanceTag = Literal["AUTHOR_REPORTED", "TEAM_ESTIMATE", "REPRODUCED_BY_TEAM", "NOT_RUN"]
ConfidenceTag = Literal["VERIFIED", "INFERRED", "UNVERIFIED"]
CollisionVerdict = Literal[
    "CLEAR_GAP",
    "PARTIAL_OVERLAP_REQUIRES_SCOPING",
    "DIRECT_COLLISION_DO_NOT_PURSUE",
]
PilotDecision = Literal["GO", "HOLD", "NO_GO"]


@dataclass
class LiteratureAuditRecord:
    paper_id: str
    source_link: str
    mechanism: str
    evidence_section: str
    compute_provenance: ProvenanceTag
    confidence: ConfidenceTag


@dataclass
class MinimalPilotGate:
    name: str
    execution_state: ProvenanceTag
    reported_status: str
    estimated_minutes_per_run: float
    max_budget_minutes_per_run: float
    collision_verdict: CollisionVerdict


class ResearchGateAuditor:
    """檢查選題審查之認識論潔淨度、時間預算停損與三維撞題狀態。"""

    @staticmethod
    def validate_literature_matrix(records: List[LiteratureAuditRecord]) -> None:
        assert len(records) >= 1, "文獻審查矩陣不得為空"
        for rec in records:
            assert rec.paper_id.strip(), "論文識別碼不可為空"
            assert rec.source_link.startswith(("http", "arXiv:", "10.")), f"{rec.paper_id} 缺少有效一手來源 DOI/arXiv"
            assert rec.evidence_section.strip(), f"{rec.paper_id} 須明確標註 Section/Table/Figure 證據"
            assert rec.confidence in ("VERIFIED", "INFERRED", "UNVERIFIED")
            assert rec.compute_provenance in (
                "AUTHOR_REPORTED",
                "TEAM_ESTIMATE",
                "REPRODUCED_BY_TEAM",
                "NOT_RUN",
            )

    @staticmethod
    def evaluate_pilot_stop_rule(pilot: MinimalPilotGate) -> Dict[str, str]:
        # Rule 1: 嚴禁未跑實驗宣稱為 PASS / MEASURED
        if pilot.execution_state in ("NOT_RUN", "TEAM_ESTIMATE") and pilot.reported_status in ("PASS", "MEASURED"):
            raise AssertionError(
                f"[SAFETY BREACH] Pilot '{pilot.name}' 狀態為 {pilot.execution_state}，嚴禁偽稱為 {pilot.reported_status}!"
            )

        # Rule 2: 撞題直接阻斷
        if pilot.collision_verdict == "DIRECT_COLLISION_DO_NOT_PURSUE":
            return {"decision": "NO_GO", "reason": "三維方法撞題，禁止強行重新包裝"}

        # Rule 3: 超出當次預設之示例性／可調整時間預算 -> 僅觸發 HOLD（縮減規模或移至雲端單卡），絕不直接淘汰研究題目
        if pilot.estimated_minutes_per_run > pilot.max_budget_minutes_per_run:
            return {"decision": "HOLD", "reason": "超出預設先導時間預算，應評估縮減設定或改於雲端單卡執行（非題目 NO-GO）"}

        # Rule 4: 實證尚未執行前只准處於待啟動或有條件核准籌備態
        if pilot.execution_state != "REPRODUCED_BY_TEAM":
            return {"decision": "HOLD", "reason": "先導機制理論過關，待實際完成 P0/G2 單卡跑測後裁決 GO/NO_GO"}

        return {"decision": "GO", "reason": "通過撞題門檻、時間預算與實機證實檢驗"}


if __name__ == "__main__":
    sample_lit = [
        LiteratureAuditRecord(
            paper_id="AffineGS_NeurIPS2026",
            source_link="arXiv:2611.07709",
            mechanism="Spatially varying affine field + guidedFilter + normal gradient reg",
            evidence_section="Sec. 3.2 & Table 2",
            compute_provenance="AUTHOR_REPORTED",
            confidence="VERIFIED",
        ),
        LiteratureAuditRecord(
            paper_id="D-FINE_ICLR2025",
            source_link="arXiv:2410.13842",
            mechanism="Fine-grained Distribution Refinement (FDR) + GO-LSD",
            evidence_section="Sec. 3 & Table 1",
            compute_provenance="AUTHOR_REPORTED",
            confidence="VERIFIED",
        ),
    ]
    ResearchGateAuditor.validate_literature_matrix(sample_lit)

    # 測試防作弊閘門：未運行不可宣稱 MEASURED
    fraudulent_pilot = MinimalPilotGate(
        name="Synthetic_Fake_Claim",
        execution_state="NOT_RUN",
        reported_status="MEASURED",
        estimated_minutes_per_run=10.0,
        max_budget_minutes_per_run=45.0,
        collision_verdict="CLEAR_GAP",
    )
    caught_breach = False
    try:
        ResearchGateAuditor.evaluate_pilot_stop_rule(fraudulent_pilot)
    except AssertionError:
        caught_breach = True
    assert caught_breach, "未能攔截未執行實驗偽裝為實測結果"

    # 測試直接撞題阻斷
    collision_pilot = MinimalPilotGate(
        name="Naive_Confidence_Mask",
        execution_state="TEAM_ESTIMATE",
        reported_status="PENDING",
        estimated_minutes_per_run=15.0,
        max_budget_minutes_per_run=60.0,
        collision_verdict="DIRECT_COLLISION_DO_NOT_PURSUE",
    )
    res_col = ResearchGateAuditor.evaluate_pilot_stop_rule(collision_pilot)
    assert res_col["decision"] == "NO_GO"

    # 測試合法預備先導實驗
    clean_pilot = MinimalPilotGate(
        name="Fast_Calibration_Pilot",
        execution_state="TEAM_ESTIMATE",
        reported_status="PENDING",
        estimated_minutes_per_run=12.0,
        max_budget_minutes_per_run=30.0,
        collision_verdict="PARTIAL_OVERLAP_REQUIRES_SCOPING",
    )
    res_clean = ResearchGateAuditor.evaluate_pilot_stop_rule(clean_pilot)
    assert res_clean["decision"] == "HOLD"

    print(f"[LIB-907 Verified] breach_blocked={caught_breach}, collision={res_col['decision']}, clean_pending={res_clean['decision']}")
```

---

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-907-01] 未核實來源與未實測算力嚴禁偽裝實證合約 (Zero Unverified Source & Compute Fabrication Invariant)
- **合約等級**: `SAFETY_CRITICAL`
- **前置條件**: 撰寫研究調查報告、簡報摘要、計畫提案或分析跨論文效能表現。
- **量化決策邊界**:
  - 所有文獻指標與時間成本必須精確區分為 `AUTHOR_REPORTED`、`TEAM_ESTIMATE`、`REPRODUCED_BY_TEAM` 或 `NOT_RUN` `[SAFETY_BOUND]`。
  - 凡未曾親眼讀取原論文表格或官方原始碼細節之欄位，必須老實標註 `UNVERIFIED`；嚴禁編造 DOI、arXiv ID 或將未實跑先導實驗宣稱為 `MEASURED` 或 `PASS`。

### [RULE-907-02] 三維撞題審查與非重新包裝硬門檻合約 (Three-Dimensional Novelty Collision & Non-Repackaging Gate)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件**: 在任何方向提出演算法改進方案並申請進行全規模訓練之前。
- **量化決策邊界**:
  - 必須針對至少 **3 篇以上 2024–2026 最近似研究**完成 `15-Column` 一手查核與 **Representation Substitution Test** `[DESIGN_DECISION]`。
  - 若被判定為 `DIRECT_COLLISION_DO_NOT_PURSUE`（僅替換注意力模組、微調 Loss/信心閾值或套用現成公式命名），須立即攔截退回。

### [RULE-907-03] 最小先導實驗必備數值停損合約 (Minimal Pilot Numerical Stop-Loss Invariant)
- **合約等級**: `HIGH_INVARIANT`
- **前置條件**: 核准啟動任何新選題方向的實證驗證流程。
- **量化決策邊界**:
  - 每個 Minimal Pilot 必須於執行前寫明 Baseline、無洩漏數據切分、主要失敗訊號指標、可重現相依清單以及精確之 `GO / HOLD / NO-GO` 數值翻盤閾值 `[DESIGN_DECISION]`。
  - 須嚴格遵守 `P0 -> G1 -> G2 -> G3 -> Novelty Gate` 次序；若 `G2` 顯示目標失效並不存在或已被強基準涵蓋，立即執行 `NO-GO` 停損。

### [RULE-907-04] 算力預算來源標記、硬體事實與禁止過早淘汰合約 (Compute Provenance, Hardware Truth & Non-Elimination Invariant)
- **合約等級**: `RESOURCE_CONSTRAINT`
- **前置條件**: 評估多場景訓練排程、消融成本或團隊本機／雲端單卡算力可行性。
- **量化決策邊界**:
  - **Local GPU VRAM is an observed hardware fact, not a global research-topic elimination threshold**：嚴禁私自假設無限叢集或把實機狀態寫為 `REPRODUCED_BY_TEAM`，**亦嚴禁因本機僅有 `4GB–8GB` VRAM、需使用 Colab 單卡、或需 `12–24GB` VRAM 即直接輸出研究題目 `NO-GO`**；任何資源性 `NO-GO` 必須附帶雲端取得性、Checkpoint 重用、總消融成本與科學保真縮減評估表 `[SAFETY_BOUND]`。
  - Pilot 時間上限（如 `60 min`）僅作依場景可調整之示例預算（Configurable Budget），超預算只應觸發 `HOLD` 調整驗證剖面，未實跑 GPU 實驗一律維持 `NOT_RUN / UNVERIFIED`；若屬後處理統計分析則優先採「張量一次快取＋CPU 消融」降低配額消耗 `[DESIGN_DECISION]`。

---

## 六、📚 權威論文與科研方法論基石文獻 (Canonical References)

1. Cohen, J. (1994). *The Earth Is Round ($p < .05$)*. **American Psychologist**, 49(12), 997–1003. (統計推論真實效應量 vs. 二分顯著性誤區基石).
2. Popper, K. (1959). *The Logic of Scientific Discovery*. Routledge. (可證偽性與「先證偽後建構」科學哲學原型).
3. Sculley, D., Holt, G., Golovin, D., Davydov, E., Phillips, T., Ebner, D., Chaudhary, V., Young, M., Crespo, J.-F., & Dennison, D. (2015). *Hidden Technical Debt in Machine Learning Systems*. **NeurIPS 2015**. (ML 系統相依債與管線污染診斷).
4. Recht, B., Roelofs, R., Schmidt, L., & Shankar, V. (2019). *Do ImageNet Classifiers Generalize to ImageNet?* **ICML 2019** (`arXiv:1902.10811`). (測試集過擬合與資料切分洩漏實證研究).
5. Angelopoulos, A. N., & Bates, S. (2023). *Conformal Prediction: A Gentle Introduction*. **Foundations and Trends in Machine Learning** (`arXiv:2107.07511`). (無分佈假設風險控制與有限樣本覆蓋保證工具論).
6. 跨典籍銜接體系：參見本館 [[LIB-904 學術科研文獻體系與前沿研究對齊 (Academic Research Corpus & Literature Synthesis)]] (`RULE-904-05`) 與 [[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]]。
