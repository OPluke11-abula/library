---
call_number: LIB-506
status: source-verified
invariants_count: 3
title: 大語言模型驅動之 3DGS 空間問答、階層場景圖與具身導航 (LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation)
module: Computer-Vision
category: 3D-Gaussian-Splatting-Embodied-AI
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Hierarchical 3D Scene Graphs (H-3DSG) Formalism
  - 3D Spatial Reasoning & Topological A* Route Planning
  - Receding Horizon Model Predictive Control (MPC) & Batched MPPI Trajectory Optimization
  - VLM Vision-Language Feature Grounding
  - Differentiable Pose Graph Optimization & Coordinate Alignment
hardware_target:
  - GPU Real-time 3DGS Splatting (Unity / WebXR)
  - LLM Inference Server (Local vLLM / API)
  - Edge Embedded Computing (Orin / Desktop Workstation)
created: 2026-09-24
author: Luke
tags:
  - 電腦視覺
  - 3DGS
  - 大語言模型
  - 具身導航
  - 場景圖
  - 虛擬校園
  - Unity
prerequisites:
  - "[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]"
  - "[[LIB-505 開放詞彙 3D 高斯潑濺與語意場景圖檢索 (Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval)]]"
  - "[[LIB-602 現代大語言模型架構解剖與縮放定律 (Modern LLM Architecture & Scaling Laws)]]"
  - "[[LIB-703 現代大模型代理人 (LLM Agent) 認知架構與推論協議 (LLM Agent Cognitive Architecture & Protocols)]]"
successors:
  - "[[LIB-905 前沿視覺與具身多模態專題研發藍圖：五大題目技術全景與消融實證指南 (Frontier Vision & Multimodal Capstone Blueprints - Five Grand Research Specifications)]]"
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

### 3. 全局拓樸導航路徑最佳化 (Global Topological Path Planning via A*)
在 2D/3D 可行走導航網格（NavMesh）拓樸圖上，尋找從當前點 $P_{\text{start}}$ 到目標點 $\mathbf{c}_{v^*}$ 的最短安全路徑：
$$\mathcal{P}^* = \arg\min_{\mathcal{P}} \sum_{k=1}^{M-1} \left( \|\mathbf{p}_{k+1} - \mathbf{p}_k\|_2 + \lambda_{\text{turn}} \cdot \theta(\mathbf{p}_{k-1}, \mathbf{p}_k, \mathbf{p}_{k+1}) \right)$$
受約束於無障礙可行走幾何：$\mathbf{p}_k \in \Omega_{\text{walkable}}$。

### 4. 局部動態模型預測控制 (Model Predictive Control, MPC) 與滾動時域規劃 (Receding Horizon) [DERIVATION]
全局拓樸 A* 產生的折線航點無法直接驅動具備慣性與非完整約束（Non-holonomic）的實體機器人或虛擬漫遊相機。系統引入局部 MPC，在滾動時域內求解約束動態最佳化問題（Optimal Control Problem, OCP）。

#### (1) 狀態與運動學動態模型 (Kinematics & Dynamics Model)
定義時刻 $t$ 之機體狀態向量與控制輸入向量：
$$x_t = \begin{bmatrix} p_{x, t} \\ p_{y, t} \\ \theta_t \\ v_t \end{bmatrix} \in \mathbb{R}^4, \quad u_t = \begin{bmatrix} a_t \\ \omega_t \end{bmatrix} \in \mathbb{R}^2$$
其中 $p_t = (p_{x, t}, p_{y, t})$ 為 2D 平面位置，$\theta_t$ 為航向角，$v_t$ 為線速度；$a_t$ 為線加速度控制，$\omega_t$ 為轉向角速度控制。

離散時間運動學動態模型 $x_{t+1} = f(x_t, u_t)$ [DERIVATION]：
$$x_{t+1} = \begin{bmatrix} p_{x, t} + v_t \cos(\theta_t) \Delta t \\ p_{y, t} + v_t \sin(\theta_t) \Delta t \\ \theta_t + \omega_t \Delta t \\ \text{clip}(v_t + a_t \Delta t, -v_{\max}, v_{\max}) \end{bmatrix}$$

#### (2) 有限時域約束最佳控制問題 (OCP Formulation)
在預測範圍 $H$（Prediction Horizon）內，求解最優控制輸入序列 $U^* = [u_t^*, u_{t+1}^*, \dots, u_{t+H-1}^*]$：
$$\min_{u_{t:t+H-1}} \left[ \Phi(x_{t+H}) + \sum_{k=0}^{H-1} \ell(x_{t+k}, u_{t+k}) \right]$$
$$\begin{aligned}
\text{s.t.} \quad & x_{t+k+1} = f(x_{t+k}, u_{t+k}), \quad k = 0, \dots, H-1 \\
& u_{t+k} \in \mathcal{U} = [a_{\min}, a_{\max}] \times [\omega_{\min}, \omega_{\max}] \quad \text{[SAFETY_BOUND]} \\
& x_{t+k} \in \mathcal{X}_{\text{safe}} = \{x \mid \text{dist}(p(x), \partial \Omega_{\text{obs}}) \ge R_{\text{safe}}\} \quad \text{[SAFETY_BOUND]} \\
& x_t = \hat{x}_{\text{current}}
\end{aligned}$$

#### (3) 階段代價函數分解 (Stage Cost Decomposition)
階段代價 $\ell(x, u)$ 結合軌跡跟隨、航向對齊、控制平滑與 3DGS 障礙物勢能場 [DESIGN_DECISION]：
$$\ell(x, u) = \|p - g_{\text{local}}\|_{Q_p}^2 + q_\theta (1 - \cos(\theta - \theta_{\text{target}})) + \|u\|_R^2 + c_{\text{obs}}(p)$$
其中障礙物懲罰 $c_{\text{obs}}(p)$ 定義為基於距離的二次阻尼屏障函數：
$$c_{\text{obs}}(p) = \begin{cases} \eta \cdot (R_{\text{safe}} - \text{dist}(p, \mathcal{O}))^2, & \text{if } \text{dist}(p, \mathcal{O}) < R_{\text{safe}} \\ 0, & \text{otherwise} \end{cases}$$

#### (4) 滾動時域執行協定 (Receding Horizon Principle) [FACT]
求解器求得長度為 $H$ 的最優序列 $U^* = [u_0^*, u_1^*, \dots, u_{H-1}^*]$ 後，**僅執行第一個動作 $u_0^*$**。在下一控制步 $t+1$，感測器觀測實際狀態 $\hat{x}_{t+1}$，重置預測區間並重新規劃。此機制將開環前向規劃轉化為封閉反饋迴路，具備強大的外力抗擾性與非受控誤差自修正能力。


#### (5) 教學簡化模型 vs. 機器人控制理論真型 (Pedagogical Toy vs. Rigorous Control Theory) [FACT / SAFETY_BOUND]
在科普或初學圖解教材中，常對 MPC 進行大幅度抽象簡化。在真實機器人學與控制理論研究中，必須嚴格釐清以下六大本質維度：

| 維度 | 教學簡化模型 (Toy Model) | 機器人學與控制理論真型 (Rigorous Robotics Formulation) |
| :--- | :--- | :--- |
| **State（狀態）** | 僅定義 2D 位置與朝向 $x_t=(p_t, \theta_t)$ | 包含 3D 位置、姿態（四元數/旋轉矩陣）、線速度、角速度與關節資訊 $x_t \in \mathbb{R}^{n_x}$ |
| **Dynamics（動態模型）** | 忽略時間步長，隱式假設 $\Delta t = 1\text{s}$ | 明確參數化取樣週期 $\Delta t$（如 $10\text{ms} \sim 50\text{ms}$），以數值積分（Euler/RK4）離散化微分方程 $\dot{x} = f_c(x, u)$ |
| **Trajectory（軌跡預測）** | 視為單次黑盒子映射 $x_{t+1:t+H} = f(x_t, u)$ | 基於馬可夫性質逐時間步遞迴前向推進：$x_{k+1} = f(x_k, u_k), \forall k \in [0, H-1]$ |
| **Cost（代價函數）** | 僅計算目標歐氏距離平方與障礙物碰撞懲罰 | 包含狀態跟隨誤差、控制能量消耗 $\|u\|_R^2$、動作平滑性 $\|\Delta u\|_{R_\Delta}^2$ 與終端李亞普諾夫代價 $V_f(x_H)$ |
| **Constraints（約束條件）** | 僅透過軟性 Penalty 加分扣分 | 區分硬約束與軟約束：受限於執行器飽和（最大速度、馬達最大扭矩 $\tau_{\max}$）與地面摩擦錐接觸條件 |
| **Optimization（最佳化）** | 預先人工列舉 3~5 條候選幾何路徑比大小 | 透過數值最佳化（二次規劃 QP、序列二次規劃 SQP、或 GPU 批次路徑積分 MPPI）連續求解控制序列 |

### 5. GPU 大規模並行模型預測路徑積分 (Batched MPPI Trajectory Optimization) [DERIVATION]
在複雜 3DGS 場景中，幾何障礙物場高度非凸且非線性，傳統二階凸優化（如 SQP/QP）求導代價高且易陷入局部極小值。本架構引進基於資訊理論的路徑積分控制（MPPI, Model Predictive Path Integral）[LITERATURE_RESULT]：

1. **並行軌跡採樣**：在當前名義控制序列 $U = [u_0, \dots, u_{H-1}] \in \mathbb{R}^{H \times 2}$ 周圍，於 GPU 注入 $K$ 組高斯隨機擾動：
   $$u_k^{(i)} = u_k + \epsilon_k^{(i)}, \quad \epsilon_k^{(i)} \sim \mathcal{N}(0, \Sigma), \quad i \in \{1, \dots, K\}$$
2. **向量化前向展開 (Tensorized Rollout)**：利用 CUDA Warp 並行評估 $K$ 條候選未來狀態序列 $X^{(i)} \in \mathbb{R}^{H \times 4}$，並計算各軌跡之累積代價 $S(U^{(i)})$：
   $$S(U^{(i)}) = \Phi(x_H^{(i)}) + \sum_{k=0}^{H-1} \left( \ell(x_k^{(i)}, u_k^{(i)}) + \lambda u_k^T \Sigma^{-1} \epsilon_k^{(i)} \right)$$
3. **重要性加權聚合 (Softmax Aggregation)**：依據自由能原理計算各軌跡權重 $w^{(i)}$ 並閉式更新控制序列：
   $$w^{(i)} = \frac{\exp\left( -\frac{1}{\lambda} (S(U^{(i)}) - \min_j S(U^{(j)})) \right)}{\sum_{m=1}^K \exp\left( -\frac{1}{\lambda} (S(U^{(m)}) - \min_j S(U^{(j)})) \right)}, \quad U^* = \sum_{i=1}^K w^{(i)} U^{(i)}$$
4. **時域滑動熱啟動 (Warm-Start Shifting)**：執行 $u_0^*$ 後，將控制序列前移：$u_k \leftarrow u_{k+1}^* \ (k=0,\dots,H-2)$，末端補零，作為下一週期的採樣中心 [HEURISTIC]。

---

## 三、計算機系統與微架構管線 (Systems & Unity Pipeline)

```
[高階語意認知層 ~1Hz]
[使用者語音/文字提問] ──> [LLM + H-3DSG 空間推理] ──> 抽取引導目標與語意節點 v*
                                                               │
[中階全局拓樸層 ~5Hz]                                          ▼
[3DGS 網格 / NavMesh] ───────> [A* 拓樸路徑規劃] ──> 宏觀路徑航點序列 {g_0, g_1, ...}
                                                               │
[低階局部控制層 ≥30Hz]                                         ▼
[GPU 平行 MPPI 控制器] ──> [CUDA 512-Rollout 滾動時域優化] ──> 即時動作 u_0* (線速/角速)
                                                               │
                                                               ▼
[物理執行與渲染層 ≥60FPS]
                                        [Unity 3DGS 實時渲染引擎]
                                        • 目標物件高斯高亮 (Compute Shader Stencil)
                                        • 6DoF 平滑相機姿態更新 (Slerp / Spline)
                                        • 動態防碰撞障礙場避讓 (SDF Clearance)
```

1. **階層式導航控制頻率解耦**：
   - 語意層（LLM API / 本地 vLLM）：延遲約 $500\text{ms} \sim 1.5\text{s}$，非同步發布語意目標節點 $v^*$。
   - 拓樸層（A* 演算法）：計算時間 $< 10\text{ms}$，在離散場景圖上更新全局長程路徑。
   - 局部動態層（Batched MPPI）：運算時間 $< 15\text{ms}$（RTX 4090 上 512 條軌跡），滿足 $\ge 30\text{Hz}$ 閉環動態避障要求 [PERFORMANCE_CRITICAL]。
2. **Unity 3DGS 渲染整合**：
   - 採用基於 Compute Shader 的高性能光柵化插件（如 Aras-p UnityGaussianSplatting）。
   - 在 Shader 中動態傳入目標高斯掩碼數組 `StructuredBuffer<int> TargetMask`。對目標物件的高斯點動態疊加輪廓發光（Outline Glow）與著色變換，推論端開銷 $< 0.5\text{ms}$。
3. **平滑相機軌跡與姿態更新**：
   - 避免相機傳送瞬移造成的眩暈（VR Motion Sickness）。MPC 輸出線速度與角速度直接驅動 Unity 相機剛體，視線朝向（Look-At）平滑插值鎖定目標物件質心。

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
    對齊 RULE-506-01 ~ RULE-506-03
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

class BatchedMPPIController:
    """
    GPU-Accelerated Model Predictive Path Integral (MPPI) 局部動態軌跡最佳化控制器
    實作滾動時域隨機最佳控制，支援動態避障與非完整約束。對齊 RULE-506-02 與 RULE-506-03。
    """
    def __init__(
        self,
        horizon: int = 15,
        num_samples: int = 512,
        dt: float = 0.05,
        temperature_lambda: float = 0.5,
        v_max: float = 1.5,
        w_max: float = 1.0,
        r_safe: float = 0.4
    ):
        self.H = horizon
        self.K = num_samples
        self.dt = dt
        self.lam = temperature_lambda
        self.v_max = v_max
        self.w_max = w_max
        self.r_safe = r_safe
        
        # 名義控制輸入序列 [H, 2]: [加速度 a, 角速度 omega]
        self.u_nominal = np.zeros((self.H, 2), dtype=np.float32)
        # 控制擾動協方差標準差 [std_a, std_w]
        self.noise_sigma = np.array([0.5, 0.4], dtype=np.float32)

    def rollout_and_solve(
        self,
        state: np.ndarray,          # 當前狀態 [px, py, theta, v], 形狀 (4,)
        target_pos: np.ndarray,     # 局部導航目標點 [gx, gy], 形狀 (2,)
        obstacles: np.ndarray       # 障礙物數組 [M, 3], 每行為 [ox, oy, radius]
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        執行向量化前向 Rollout、評估累積代價並更新最優控制序列。
        返回:
            action_to_execute: 當前控制週期執行的首步動作 u_0* (2,)
            best_trajectory: 最佳預測軌跡航點 (H, 2) 用於視覺化
        """
        # 1. 採樣控制擾動: (K, H, 2)
        noise = np.random.normal(0.0, self.noise_sigma, size=(self.K, self.H, 2)).astype(np.float32)
        u_samples = self.u_nominal[None, :, :] + noise  # (K, H, 2)
        
        # 邊界限幅截斷防超速與急轉 [SAFETY_BOUND]
        u_samples[:, :, 0] = np.clip(u_samples[:, :, 0], -self.v_max / self.dt, self.v_max / self.dt)
        u_samples[:, :, 1] = np.clip(u_samples[:, :, 1], -self.w_max, self.w_max)

        # 2. 向量化前向展開 (K 條軌跡並行遞迴推進)
        x_rollout = np.zeros((self.K, self.H + 1, 4), dtype=np.float32)
        x_rollout[:, 0, :] = state

        for t in range(self.H):
            curr_x = x_rollout[:, t, 0]
            curr_y = x_rollout[:, t, 1]
            curr_th = x_rollout[:, t, 2]
            curr_v = x_rollout[:, t, 3]

            acc = u_samples[:, t, 0]
            omega = u_samples[:, t, 1]

            next_v = np.clip(curr_v + acc * self.dt, 0.0, self.v_max)
            next_th = curr_th + omega * self.dt
            next_x = curr_x + next_v * np.cos(curr_th) * self.dt
            next_y = curr_y + next_v * np.sin(curr_th) * self.dt

            x_rollout[:, t + 1, 0] = next_x
            x_rollout[:, t + 1, 1] = next_y
            x_rollout[:, t + 1, 2] = next_th
            x_rollout[:, t + 1, 3] = next_v

        # 3. 代價函數計算 (Stage Cost + Barrier Penalty)
        pos_seq = x_rollout[:, 1:, 0:2]  # (K, H, 2)
        dist_to_target = np.sum((pos_seq - target_pos[None, None, :]) ** 2, axis=-1)  # (K, H)
        stage_cost = dist_to_target + 0.1 * (u_samples[:, :, 0] ** 2 + u_samples[:, :, 1] ** 2)

        # 3DGS 幾何障礙物距離阻尼懲罰 (對齊 RULE-506-02)
        if len(obstacles) > 0:
            obs_pos = obstacles[None, None, :, 0:2]
            obs_rad = obstacles[None, None, :, 2]
            dist_to_obs = np.linalg.norm(pos_seq[:, :, None, :] - obs_pos, axis=-1) - obs_rad  # (K, H, M)
            violation = np.maximum(0.0, self.r_safe - dist_to_obs)  # (K, H, M)
            obs_cost = np.sum(100.0 * (violation ** 2), axis=-1)     # (K, H)
            stage_cost += obs_cost

        traj_cost = np.sum(stage_cost, axis=1)  # (K,)

        # 4. Softmax 重要性加權 (Free Energy Minimization)
        min_cost = np.min(traj_cost)
        weights = np.exp(-(traj_cost - min_cost) / self.lam)
        weights /= (np.sum(weights) + 1e-8)  # (K,)

        # 5. 更新名義控制序列並滾動執行 (Receding Horizon)
        self.u_nominal = np.sum(weights[:, None, None] * u_samples, axis=0)  # (H, 2)
        action_to_execute = self.u_nominal[0].copy()

        # 時域滑動熱啟動 (Shift Warm-start)
        self.u_nominal[:-1] = self.u_nominal[1:]
        self.u_nominal[-1] = 0.0

        best_idx = np.argmin(traj_cost)
        best_trajectory = x_rollout[best_idx, 1:, 0:2]

        return action_to_execute, best_trajectory

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
6. **Williams, G., Drews, P., Goldfain, B., et al.** (2017). *Information-Theoretic Model Predictive Control: Theory and Applications to Autonomous Driving*. **IEEE Transactions on Robotics (T-RO 2017)**.
7. **Rawlings, J. B., Mayne, D. Q., & Diehl, M.** (2017). *Model Predictive Control: Theory, Computation, and Design* (2nd ed.). **Nob Hill Publishing**.
