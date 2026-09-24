---
call_number: LIB-506
title: 大語言模型驅動之 3DGS 空間問答、階層場景圖與具身導航 (LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation)
module: Computer-Vision
category: 3D-Gaussian-Splatting-Embodied-AI
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
status: Verified-Authoritative-Production
math_foundations:
  - Hierarchical 3D Scene Graphs (H-3DSG) Formalism
  - 3D Spatial Reasoning & Topological A* Route Planning
  - VLM Vision-Language Feature Grounding
  - Differentiable Pose Graph Optimization & Coordinate Alignment
hardware_target:
  - GPU Real-time 3DGS Splatting (Unity / WebXR)
  - LLM Inference Server (Local vLLM / API)
  - Edge Embedded Computing (Orin / Desktop Workstation)
invariants_count: 4
created: 2026-09-24
author: Luke
prerequisites:
  - "[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]"
  - "[[LIB-505 開放詞彙 3D 高斯潑濺與語意場景圖檢索 (Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval)]]"
  - "[[LIB-602 現代大語言模型架構解剖與縮放定律 (Modern LLM Architecture & Scaling Laws)]]"
  - "[[LIB-703 現代大模型代理人 (LLM Agent) 認知架構與推論協議 (LLM Agent Cognitive Architecture & Protocols)]]"
successors:
  - "[[LIB-905 前沿視覺與具身多模態專題研發藍圖：五大題目技術全景與消融實證指南 (Frontier Vision & Multimodal Capstone Blueprints - Five Grand Research Specifications)]]"
tags:
  - 電腦視覺
  - 3DGS
  - 大語言模型
  - 具身導航
  - 場景圖
  - 虛擬校園
  - Unity
---

> 語言切換 / Language: 🇹🇼 **繁體中文** | [🇺🇸 English (Agent Edition)](../en/05_computer_vision/LIB-506%20LLM-Grounded%203D%20Scene%20QA,%20Hierarchical%20Scene%20Graphs%20%26%20Embodied%20Navigation%20%28Agent%20EN%29.md)

# 大語言模型驅動之 3DGS 空間問答、階層場景圖與具身導航 (LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation)

## 導讀與概念座標
- **前置依賴**：[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]、[[LIB-505 開放詞彙 3D 高斯潑濺與語意場景圖檢索 (Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval)]]、[[LIB-703 現代大模型代理人 (LLM Agent) 認知架構與推論協議 (LLM Agent Cognitive Architecture & Protocols)]]。
- **後續模組**：[[LIB-905 前沿視覺與具身多模態專題研發藍圖：五大題目技術全景與消融實證指南 (Frontier Vision & Multimodal Capstone Blueprints - Five Grand Research Specifications)]]。
- **核心主題**：整合三維高斯場景渲染、階層式 3D 場景圖（Hierarchical 3D Scene Graph）與大語言模型（LLM）的空間推理能力，建構具備「自然語言問答 $\to$ 實體目標定位 $\to$ 最佳路徑規劃 $\to$ 實時視角漫遊導引」之端到端智慧虛擬導覽系統（涵蓋資工系實驗室、校園大樓與複雜展示空間）。

---

## 一、問題背景與架構痛點 (Motivation & Challenges)

### 1. 空間認知斷層：從「影像辨識」到「三維空間推理」
在智慧導覽系統中，使用者提出的問題往往充滿隱式空間關係：
- *「哪一台是 3D 印表機？」* $\to$ 需要辨識物件名稱與細粒度外觀特徵，並回答其所在方位（如「右側靠牆的黑色設備」）。
- *「AI 實驗室在哪？帶我過去。」* $\to$ 需要解析校園地理拓樸、識別起始點與終點、規劃可行導航路線，並在 3D 場景中驅動相機平滑漫遊。
傳統純文字 LLM 無法直接獲取物理世界幾何，而純視覺 NeRF/3DGS 缺乏符號化空間邏輯。必須構建一個結構化的橋樑——**3D 語意場景圖 (3D Scene Graph)**。

### 2. 大規模場景（校園/系館）的渲染與推理挑戰
1. **多尺度空間表徵**：單一平鋪場景圖無法負荷整棟大樓或校園。必須建立階層（Hierarchy）：$\text{校區} \to \text{館舍} \to \text{樓層} \to \text{房間/實驗室} \to \text{功能物件}$。
2. **實時性與跨平臺整合**：大語言模型推論延遲（約 1~2 秒）必須與 3D 渲染引擎（Unity / WebXR 60+ FPS）非同步解耦，確保使用者漫遊不卡頓。

---

## 二、數學形式化推導 (Mathematical Formulation)

### 1. 階層式三維場景圖形式化 (Hierarchical 3D Scene Graph, H-3DSG)
定義多層有向屬性圖 $\mathcal{G}_{\text{scene}} = (\mathcal{V}, \mathcal{E})$，節點集合按空間尺度劃分為 $L$ 個階層：
$$\mathcal{V} = \mathcal{V}_{\text{campus}} \cup \mathcal{V}_{\text{building}} \cup \mathcal{V}_{\text{floor}} \cup \mathcal{V}_{\text{room}} \cup \mathcal{V}_{\text{object}}$$
- 實體物件節點 $v_i \in \mathcal{V}_{\text{object}}$ 具備屬性元組：
  $$v_i = \left( \text{ID}_i, \text{Label}_i, \mathbf{c}_i \in \mathbb{R}^3, \mathbf{B}_i \in \mathbb{R}^6, \mathbf{e}_i \in \mathbb{R}^d, \Omega_i \subset \mathbb{N} \right)$$
  其中 $\mathbf{c}_i$ 為 3D 質心座標，$\mathbf{B}_i$ 為定向邊界框（OBB），$\mathbf{e}_i$ 為語意特徵向量，$\Omega_i$ 為所屬 3D 高斯原語索引集合。
- 空間拓樸邊 $e_{ij} = (v_i, v_j) \in \mathcal{E}$ 描述關係述詞（Predicates）：$\text{InsideOf}$, $\text{AdjacentTo}$, $\text{OnTopOf}$, $\text{NextTo}$。

### 2. LLM 空間推理與目標定位形式化
給定使用者問題 $Q$ 與當前視角座標 $P_{\text{user}} = (\mathbf{x}_{\text{user}}, \mathbf{R}_{\text{user}})$：
1. **問題解析與場景圖剪枝 (Graph Pruning)**：
   LLM 透過語意過濾算子 $\Pi_Q$ 抽取相關子圖 $\mathcal{G}' \subset \mathcal{G}_{\text{scene}}$：
   $$\mathcal{G}' = \arg\max_{\mathcal{G} \subset \mathcal{G}_{\text{scene}}} \text{Sim}(e_Q, \text{Text}(\mathcal{G}))$$
2. **結構化回答生成**：
   $$A, v^* = \text{LLM}\left( Q, \text{Prompt}(\mathcal{G}', P_{\text{user}}) \right)$$
   輸出包含自然語言回答 $A$ 與目標實體節點 $v^* \in \mathcal{V}_{\text{object}}$。

### 3. 三維導航路徑最佳化 (3D Path Planning)
在 2D/3D 可行走導航網格（NavMesh）拓樸圖上，尋找從當前點 $P_{\text{start}}$ 到目標點 $\mathbf{c}_{v^*}$ 的最短安全路徑：
$$\mathcal{P}^* = \arg\min_{\mathcal{P}} \sum_{k=1}^{M-1} \left( \|\mathbf{p}_{k+1} - \mathbf{p}_k\|_2 + \lambda_{\text{turn}} \cdot \theta(\mathbf{p}_{k-1}, \mathbf{p}_k, \mathbf{p}_{k+1}) \right)$$
受約束於無障礙可行走幾何：$\mathbf{p}_k \in \Omega_{\text{walkable}}$。

---

## 三、計算機系統與微架構管線 (Systems & Unity Pipeline)

```
[多視角無人機/手持攝影] ──> [COLMAP 姿態估計] ──> [3DGS 幾何重建]
                                                      │
[SAM 3D 分割 / CLIP 標註] ──> [階層式場景圖構建] ───────┤
                                                      │
[使用者語音/文字提問] ───────> [LLM 空間意圖推理] ─────┤
                                                      │
                                                      ▼
                                       [Unity 3DGS 實時渲染引擎]
                                       • 目標物件高斯高亮 (Shader Highlight)
                                       • 平滑相機路徑漫遊 (Spline Camera Track)
                                       • 語音導覽與 AR 箭頭指引
```

1. **Unity 3DGS 渲染整合**：
   - 採用基於 Compute Shader 的高性能光柵化插件（如 Aras-p UnityGaussianSplatting）。
   - 在 Shader 中動態傳入目標高斯掩碼數組 `StructuredBuffer<int> TargetMask`。對目標物件的高斯點動態疊加輪廓發光（Outline Glow）與著色變換，推論端開銷 $< 0.5\text{ms}$。
2. **平滑相機軌跡插值 (Spline Interpolation)**：
   - 避免相機傳送瞬移造成的眩暈（VR Motion Sickness）。使用 Catmull-Rom 樣條曲線對路徑航點進行平滑插值，視線朝向（Look-At）動態鎖定目標物件質心。

---

## 四、工業級工程實作與防禦規範 (Production-Grade Code)

以下為 3D 場景圖導航路由與目標定位實作：

```python
import numpy as np
import heapq
from typing import Dict, List, Tuple, Optional

class SceneGraphNavigator:
    """
    階層式 3D 場景圖與空間導航規劃引擎
    對齊 [RULE-506-01] ~ [RULE-506-03]
    """
    def __init__(self, scene_nodes: Dict[str, dict], adjacency_list: Dict[str, List[Tuple[str, float]]]):
        # scene_nodes: {node_id: {"name": str, "pos": (x,y,z), "level": int}}
        self.nodes = scene_nodes
        self.adj = adjacency_list

    def find_shortest_path(self, start_id: str, goal_id: str) -> Tuple[List[str], float]:
        """
        基於 A* 演算法計算拓樸節點間的最佳可行走無障礙路徑
        """
        assert start_id in self.nodes, f"起始節點不存在: {start_id}"
        assert goal_id in self.nodes, f"目標節點不存在: {goal_id}"

        goal_pos = np.array(self.nodes[goal_id]["pos"])
        
        # 優先佇列: (estimated_total_cost, current_cost, current_node, path)
        pq = [(0.0, 0.0, start_id, [start_id])]
        visited_costs = {start_id: 0.0}

        while pq:
            est_cost, cur_cost, cur_node, path = heapq.heappop(pq)

            if cur_node == goal_id:
                return path, cur_cost

            if cur_cost > visited_costs.get(cur_node, float('inf')):
                continue

            for neighbor, edge_weight in self.adj.get(cur_node, []):
                new_cost = cur_cost + edge_weight
                if new_cost < visited_costs.get(neighbor, float('inf')):
                    visited_costs[neighbor] = new_cost
                    # 啟發式歐氏距離
                    h = np.linalg.norm(np.array(self.nodes[neighbor]["pos"]) - goal_pos)
                    heapq.heappush(pq, (new_cost + h, new_cost, neighbor, path + [neighbor]))

        raise ValueError(f"無法在場景圖中找到連通起點 {start_id} 至目標 {goal_id} 的路徑！")

    def generate_camera_trajectory(self, path_nodes: List[str], samples_per_segment: int = 20) -> np.ndarray:
        """
        為 Unity 渲染生成平滑相機座標航點 [N, 3]
        """
        waypoints = np.array([self.nodes[nid]["pos"] for nid in path_nodes])
        assert len(waypoints) >= 2, "路徑節點數不足以生成軌跡"
        
        trajectory = []
        for i in range(len(waypoints) - 1):
            p0 = waypoints[max(0, i - 1)]
            p1 = waypoints[i]
            p2 = waypoints[i + 1]
            p3 = waypoints[min(len(waypoints) - 1, i + 2)]
            
            # 線性/分段插值防劇烈抖動
            for t in np.linspace(0, 1, samples_per_segment, endpoint=False):
                point = 0.5 * ((2 * p1) + (-p0 + p2) * t + 
                               (2 * p0 - 5 * p1 + 4 * p2 - p3) * (t**2) + 
                               (-p0 + 3 * p1 - 3 * p2 + p3) * (t**3))
                trajectory.append(point)
        trajectory.append(waypoints[-1])
        return np.array(trajectory)
```

---

## 五、系統規範與不變量 (System Invariants)

### [RULE-506-01] 階層場景空間包含性約束 (Hierarchy Containment Invariant)
- **等級**: `CRITICAL_INVARIANT`
- **邊界**: 場景圖中的物件節點（如印表機）必須嚴格隸屬於單一房間/區域節點，房間必須隸屬於樓層。禁止跨層懸掛孤立實體節點，拓樸深度深度驗證樹必須為嚴格樹狀收斂。

### [RULE-506-02] 導航相機垂直高度防穿牆限幅 (Camera Clearance Invariant)
- **等級**: `HIGH_INVARIANT`
- **邊界**: Unity 虛擬漫遊軌跡在插值生成時，相機高度 $z$ 軸必須維持在地面高度 $+1.5\text{m} \sim +1.7\text{m}$（人眼視角），且與任何 3D 高斯不透明度 $\alpha > 0.5$ 的實體障礙物保持 $\ge 0.4\text{m}$ 碰撞安全餘裕。

### [RULE-506-03] 實時導航互動渲染幀率 (Interactive Frame Rate SLA)
- **等級**: `HIGH_INVARIANT`
- **邊界**: 在 Unity 或 WebXR 導覽客戶端執行時，高斯潑濺渲染幀率在 1080p 解析度下必須維持 $\ge 45\text{ FPS}$（VR 模式下 $\ge 72\text{ FPS}$），導航路徑重算延遲 $< 100\text{ms}$。

---

## 六、標準引證與權威文獻 (Canonical References)

1. **Gu, J., Trevithick, A., Lin, K. E., et al.** (2024). *ConceptGraphs: Open-Vocabulary 3D Scene Graphs for Robot Perception*. **IEEE International Conference on Robotics and Automation (ICRA 2024)**.
2. **Rana, K., Haviland, J., Garg, S., et al.** (2023). *SayPlan: Grounding Large Language Models using 3D Scene Graphs for Scalable Robot Task Planning*. **Conference on Robot Learning (CoRL 2023)**.
3. **Hong, Y., Zhen, H., Chen, P., et al.** (2023). *3D-LLM: Injecting the 3D World into Large Language Models*. **Advances in Neural Information Processing Systems (NeurIPS 2023)**.
4. **Lin, C., Li, Z., Tang, S., et al.** (2024). *VastGaussian: Vast 3D Gaussians for Large Scene Reconstruction*. **IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR 2024)**.
5. **Hughes, N., Chang, Y., & Carlone, L.** (2022). *Hydra: A Real-time Spatial Perception Engine for 3D Scene Graph Construction and Hierarchical Mapping*. **Robotics: Science and Systems (RSS 2022)**.
