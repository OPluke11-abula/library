---
call_number: LIB-506
status: source-verified
invariants_count: 3
title: LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)
module: Computer-Vision
category: 3D-Gaussian-Splatting-Embodied-AI
audience:
  - Autonomous-Agent
  - Graduate-PhD
math_foundations:
  - Hierarchical 3D Scene Graph (H-3DSG) Formal Topology
  - Topological A* Path Planning & Heuristic Distance Fields
  - Receding Horizon Model Predictive Control (MPC) & Batched MPPI Trajectory Optimization
  - Vision-Language Model Spatial Reasoning Grounding
hardware_target:
  - Unity / WebXR Compute Shader Splatting Runtime
  - Asynchronous LLM Spatial Planning Worker
  - GPU Edge / Workstation (RTX 4090 / Orin)
created: 2026-09-24
author: Luke
tags:
  - computer-vision
  - 3dgs
  - llm-agent
  - scene-graphs
  - navigation
  - unity
  - model-predictive-control
prerequisites:
  - "[[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]]"
  - "[[LIB-505 Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval (Agent EN)]]"
  - "[[LIB-602 Modern LLM Architecture & Scaling Laws (Agent EN)]]"
  - "[[LIB-703 LLM Agent Cognitive Architecture & Protocols (Agent EN)]]"
successors:
  - "[[LIB-905 Frontier Vision & Multimodal Capstone Blueprints (Agent EN)]]"
---

> Language / 語言: [🇹🇼 繁體中文](../../05_%E8%A8%88%E7%AE%97%E6%A9%9F%E8%A6%96%E8%A6%BA%E8%88%87%E9%AB%98%E7%B6%AD%E6%84%9F%E6%B8%AC/LIB-506%20%E5%A4%A7%E8%AA%9E%E8%A8%80%E6%A8%A1%E5%9E%8B%E9%A9%85%E5%8B%95%E4%B9%8B%203DGS%20%E7%A9%BA%E9%96%93%E5%95%8F%E7%AD%94%E3%80%81%E9%9A%8E%E5%B1%A4%E5%A0%B4%E6%99%AF%E5%9C%96%E8%88%87%E5%85%B7%E8%BA%AB%E5%B0%8E%E8%88%AA%20%28LLM-Grounded%203D%20Scene%20QA,%20Hierarchical%20Scene%20Graphs%20&%20Embodied%20Navigation%29.md) | 🇺🇸 **English**

# LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation

## Conceptual Coordinates & Topological Navigation
- **Prerequisites**: [[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]], [[LIB-505 Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval (Agent EN)]], [[LIB-602 Modern LLM Architecture & Scaling Laws (Agent EN)]], [[LIB-703 LLM Agent Cognitive Architecture & Protocols (Agent EN)]].
- **Successors**: [[LIB-905 Frontier Vision & Multimodal Capstone Blueprints (Agent EN)]].

## 1. Mathematical Foundations & Hierarchical Architecture

### 1.1 Formalization of Hierarchical 3D Scene Graphs (H-3DSG)
To scale spatial reasoning across multi-building campuses and lab facilities, the environment is modeled as a multi-tier attributed graph:
$$\mathcal{G}_{\text{scene}} = (\mathcal{V}, \mathcal{E})$$
$$\mathcal{V} = \mathcal{V}_{\text{campus}} \cup \mathcal{V}_{\text{building}} \cup \mathcal{V}_{\text{floor}} \cup \mathcal{V}_{\text{room}} \cup \mathcal{V}_{\text{object}}$$

Each object node $v_k \in \mathcal{V}_{\text{object}}$ possesses:
$$v_k = \left( \text{ID}_k, \text{Class}_k, \mathbf{c}_k \in \mathbb{R}^3, \mathbf{B}_k \in \mathbb{R}^6, \mathbf{e}_k \in \mathbb{R}^d, \Omega_k \subset \mathbb{N} \right)$$
where $\mathbf{c}_k$ is the 3D bounding centroid, $\mathbf{B}_k$ represents Oriented Bounding Box dimensions, $\mathbf{e}_k$ is the CLIP embedding, and $\Omega_k$ is the subset of rendering Gaussian indices.

### 1.2 Spatial Query & Global Topological Planning
1. **Query Parsing & Grounding**: Natural language queries are grounded to target node $v^* = \arg\max_v \text{Sim}(e_Q, e_v)$.
2. **Global A* Path Planning**:
   $$\mathcal{P}^* = \arg\min_{\mathcal{P}} \sum_{i=1}^{M-1} \|\mathbf{p}_{i+1} - \mathbf{p}_i\|_2, \quad \text{s.t. } \mathbf{p}_i \in \Omega_{\text{walkable}}$$

### 1.3 Receding Horizon Model Predictive Control (MPC) [DERIVATION]
Global A* piecewise linear waypoints cannot directly drive non-holonomic embodied platforms or virtual inspection cameras with continuous inertia. The local motion controller formulates a constrained Optimal Control Problem (OCP) solved over a finite horizon $H$:

$$\min_{u_{t:t+H-1}} \left[ V_f(x_{t+H}) + \sum_{k=0}^{H-1} \ell(x_{t+k}, u_{t+k}) \right]$$
$$\begin{aligned}
\text{s.t.} \quad & x_{t+k+1} = f(x_{t+k}, u_{t+k}) = \begin{bmatrix} p_{x, k} + v_k \cos(\theta_k) \Delta t \\ p_{y, k} + v_k \sin(\theta_k) \Delta t \\ \theta_k + \omega_k \Delta t \\ \text{clip}(v_k + a_k \Delta t, 0, v_{\max}) \end{bmatrix} \\
& u_{t+k} = [a_{t+k}, \omega_{t+k}]^T \in \mathcal{U} = [-a_{\max}, a_{\max}] \times [-\omega_{\max}, \omega_{\max}] \quad \text{[SAFETY_BOUND]} \\
& x_{t+k} \in \mathcal{X}_{\text{safe}} = \{x \mid \text{dist}(p(x), \partial \Omega_{\text{obs}}) \ge R_{\text{safe}}\} \quad \text{[SAFETY_BOUND]} \\
& x_t = \hat{x}_{\text{current}}
\end{aligned}$$

Where Stage Cost incorporates waypoint tracking, control effort, and obstacle repulsive barrier fields:
$$\ell(x, u) = \|p - g_{\text{local}}\|_{Q_p}^2 + \|u\|_R^2 + c_{\text{obs}}(p)$$
$$c_{\text{obs}}(p) = \begin{cases} \eta \cdot (R_{\text{safe}} - \text{dist}(p, \mathcal{O}))^2, & \text{if } \text{dist}(p, \mathcal{O}) < R_{\text{safe}} \\ 0, & \text{otherwise} \end{cases}$$

**Receding Horizon Principle [FACT]**: Upon finding optimal sequence $U^* = [u_0^*, u_1^*, \dots, u_{H-1}^*]$, the agent executes ONLY $u_0^*$. At $t+1$, state feedback $\hat{x}_{t+1}$ is observed and the optimization is repeated, transforming open-loop trajectories into a robust closed-loop policy.

### 1.4 Pedagogical Toy Model vs. Rigorous Control Theory [FACT] [SAFETY_BOUND]
To prevent conceptual ambiguity between introductory educational material and rigorous robotics engineering:

| Dimension | Pedagogical Toy Model | Rigorous Robotics & Control Theory |
| :--- | :--- | :--- |
| **State** | Only 2D position and heading $x_t=(p_t, \theta_t)$ | Full 3D pose (quaternion/SE(3)), linear/angular velocities, and joint kinematics $x_t \in \mathbb{R}^{n_x}$ |
| **Dynamics** | Omits time step; implicitly assumes $\Delta t = 1\text{s}$ | Explicit sampling period $\Delta t$ ($10\text{ms} \sim 50\text{ms}$); numerical integration of ODE $\dot{x} = f_c(x, u)$ |
| **Trajectory** | Black-box single-step mapping $x_{t+1:t+H} = f(x_t, u)$ | Markovian recursive rollout: $x_{k+1} = f(x_k, u_k), \forall k \in [0, H-1]$ |
| **Cost** | Pure goal Euclidean distance + heuristic collision | Tracking quadratic form, control effort $\|u\|_R^2$, slew rate $\|\Delta u\|_{R_\Delta}^2$, terminal Lyapunov cost $V_f(x_H)$ |
| **Constraints** | Soft penalties only | Hard actuator saturation limits ($v_{\max}, \tau_{\max}$) and contact friction cones |
| **Optimization** | Compares 3~5 manually selected route candidates | Numerical optimization (Convex QP, SQP, or GPU-batched stochastic MPPI) over continuous control space |

### 1.5 GPU-Batched Model Predictive Path Integral (MPPI) [DERIVATION]
In dense 3DGS scenes where signed distance fields and opacity gradients are non-convex, sampling-based MPPI optimizes trajectories in parallel on GPU:
1. Inject $K=512$ Gaussian perturbations: $u_k^{(i)} = u_k + \epsilon_k^{(i)}, \ \epsilon_k^{(i)} \sim \mathcal{N}(0, \Sigma)$.
2. Vectorized rollout of $K$ candidate trajectories: $X^{(i)} \in \mathbb{R}^{H \times 4}$, evaluating total cost $S(U^{(i)}) = \Phi(x_H^{(i)}) + \sum_{k=0}^{H-1} (\ell(x_k^{(i)}, u_k^{(i)}) + \lambda u_k^T \Sigma^{-1} \epsilon_k^{(i)})$.
3. Importance sampling weight calculation:
   $$w^{(i)} = \frac{\exp\left( -\frac{1}{\lambda} (S(U^{(i)}) - \min_j S(U^{(j)})) \right)}{\sum_{m=1}^K \exp\left( -\frac{1}{\lambda} (S(U^{(m)}) - \min_j S(U^{(j)})) \right)}, \quad U^* = \sum_{i=1}^K w^{(i)} U^{(i)}$$
4. Execute $u_0^*$ and shift $U^*$ forward for warm-starting the subsequent cycle.

---

## 2. Systems Architecture & Execution Pipeline

```
[Semantic Cognition Layer ~1Hz]
[User Query / Voice Input] ──> [LLM + H-3DSG Reasoning] ──> Target Node v* & Goal Waypoint
                                                                    │
[Global Topological Layer ~5Hz]                                     ▼
[3DGS Octree / NavMesh] ───────> [Topological A* Planner] ──> Macro Waypoint Corridor {g_0, g_1, ...}
                                                                    │
[Local Dynamic MPC Layer ≥30Hz]                                     ▼
[Batched MPPI Controller] ─────> [CUDA 512-Rollout MPC] ─────> Real-time u_0* (Linear/Angular Velocity)
                                                                    │
                                                                    ▼
[Physical Actuation & Rendering ≥60FPS]
                                        [Unity 3DGS Splatting Runtime]
                                        • Compute Shader Target Stencil Glow
                                        • Smooth Camera Kinematics (Slerp / Spline)
                                        • Dynamic SDF Obstacle Clearance [SAFETY_BOUND]
```

---

## 3. Production GPU-Batched MPPI Implementation

```python
import torch
from typing import Tuple, Optional

class BatchedMPPIController:
    """GPU-Batched Model Predictive Path Integral Controller aligned with RULE-506-02 & RULE-506-03."""
    def __init__(
        self, horizon: int = 15, num_samples: int = 512, dt: float = 0.05,
        temperature_lambda: float = 0.5, v_max: float = 1.5, a_max: float = 2.0,
        w_max: float = 1.0, r_safe: float = 0.4, terminal_weight: float = 5.0,
        device: Optional[str] = None
    ):
        self.H, self.K, self.dt, self.lam = horizon, num_samples, dt, temperature_lambda
        self.v_max, self.a_max, self.w_max, self.r_safe, self.q_f = v_max, a_max, w_max, r_safe, terminal_weight
        self.device = torch.device(device or ("cuda" if torch.cuda.is_available() else "cpu"))
        self.u_nominal = torch.zeros((self.H, 2), dtype=torch.float32, device=self.device)
        self.noise_sigma = torch.tensor([0.5, 0.4], dtype=torch.float32, device=self.device)
        self.inv_sigma_cov = 1.0 / (self.noise_sigma ** 2)

    @torch.no_grad()
    def rollout_and_solve(
        self, state: torch.Tensor, target_pos: torch.Tensor, obstacles: torch.Tensor
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        state = state.to(device=self.device, dtype=torch.float32)
        target_pos = target_pos.to(device=self.device, dtype=torch.float32)
        obstacles = obstacles.to(device=self.device, dtype=torch.float32)

        eps = torch.randn((self.K, self.H, 2), dtype=torch.float32, device=self.device) * self.noise_sigma
        u_samples = self.u_nominal.unsqueeze(0) + eps
        u_samples[:, :, 0] = torch.clamp(u_samples[:, :, 0], -self.a_max, self.a_max)
        u_samples[:, :, 1] = torch.clamp(u_samples[:, :, 1], -self.w_max, self.w_max)
        eps_clamped = u_samples - self.u_nominal.unsqueeze(0)

        x_rollout = torch.zeros((self.K, self.H + 1, 4), dtype=torch.float32, device=self.device)
        x_rollout[:, 0, :] = state.unsqueeze(0)

        for t in range(self.H):
            cx, cy, cth, cv = x_rollout[:, t, 0], x_rollout[:, t, 1], x_rollout[:, t, 2], x_rollout[:, t, 3]
            acc, omega = u_samples[:, t, 0], u_samples[:, t, 1]
            x_rollout[:, t + 1, 0] = cx + cv * torch.cos(cth) * self.dt
            x_rollout[:, t + 1, 1] = cy + cv * torch.sin(cth) * self.dt
            x_rollout[:, t + 1, 2] = cth + omega * self.dt
            x_rollout[:, t + 1, 3] = torch.clamp(cv + acc * self.dt, 0.0, self.v_max)

        pos_seq = x_rollout[:, 1:, 0:2]
        dist_sq = torch.sum((pos_seq - target_pos.view(1, 1, 2)) ** 2, dim=-1)
        ctrl_effort = 0.1 * torch.sum(u_samples ** 2, dim=-1)
        info_cross = self.lam * torch.sum(self.u_nominal.unsqueeze(0) * self.inv_sigma_cov.view(1, 1, 2) * eps_clamped, dim=-1)
        stage_cost = dist_sq + ctrl_effort + info_cross

        if obstacles.numel() > 0:
            obs_pos, obs_rad = obstacles[:, 0:2].view(1, 1, -1, 2), obstacles[:, 2].view(1, 1, -1)
            dist_to_obs = torch.norm(pos_seq.unsqueeze(2) - obs_pos, dim=-1) - obs_rad
            stage_cost = stage_cost + torch.sum(100.0 * (torch.clamp(self.r_safe - dist_to_obs, min=0.0) ** 2), dim=-1)

        terminal_cost = self.q_f * torch.sum((x_rollout[:, -1, 0:2] - target_pos.view(1, 2)) ** 2, dim=-1)
        traj_cost = torch.sum(stage_cost, dim=1) + terminal_cost

        weights = torch.exp(-(traj_cost - torch.min(traj_cost)) / self.lam)
        weights = weights / (torch.sum(weights) + 1e-8)
        self.u_nominal = torch.sum(weights.view(self.K, 1, 1) * u_samples, dim=0)
        action_to_execute = self.u_nominal[0].clone()
        self.u_nominal = torch.roll(self.u_nominal, shifts=-1, dims=0)
        self.u_nominal[-1].zero_()
        return action_to_execute, x_rollout[int(torch.argmin(traj_cost).item()), 1:, 0:2]
```

---

## 4. Invariants & Implementation Specifications

### [RULE-506-01] Hierarchical Spatial Containment Invariant
- **Contract Level**: `CRITICAL_INVARIANT`
- **Specification**: In hierarchical 3D scene graphs (Building $\to$ Floor $\to$ Room $\to$ Object), every object node MUST maintain a strict single-parent containment relationship with exactly one room node. Cyclic or multi-parent containment graphs are prohibited.
- **Violation Consequence**: Cyclic or multi-parent topological relationships create infinite loops in LLM spatial navigation and hierarchical question answering.

### [RULE-506-02] Camera Elevation & Obstacle Clearance Invariant
- **Contract Level**: `SAFETY_CRITICAL`
- **Specification**: Navigational trajectories planned for embodied agents or Unity cameras MUST maintain camera/sensor ground clearance between $[1.5\text{m}, 1.7\text{m}]$ and satisfy obstacle clearance boundary constraint $\mathcal{X}_{\text{safe}} = \{x \mid \text{dist}(p(x), \partial \Omega_{\text{obs}}) \ge 0.4\text{m}\}$ against all 3D Gaussian primitives with opacity $\alpha > 0.5$ [SAFETY_BOUND].
- **Violation Consequence**: Violating ground or obstacle clearance bounds produces camera clipping through physical geometries and collisions in physical robotic execution.

### [RULE-506-03] Real-Time Scene QA & Navigation Interactive Frame Rate SLA
- **Contract Level**: `PERFORMANCE_CRITICAL`
- **Specification**: Interactive embodied navigation clients MUST sustain Gaussian Splatting rendering frame rates of $\ge 45\text{ FPS}$ at 1080p ($\ge 72\text{ FPS}$ in VR mode). Local MPPI rollout solve latency MUST be bounded under $< 15\text{ms}$ ($\ge 30\text{Hz}$), global A* route replanning under $< 100\text{ms}$, and LLM spatial question-answering query latency under $< 800\text{ms}$ [TARGET].
- **Violation Consequence**: Control solve latencies exceeding $15\text{ms}$ degrade tracking stability and cause VR motion sickness or controller divergence.

---

## 5. Canonical References

1. **Gu, J., Trevithick, A., Lin, K. E., et al.** (2024). *ConceptGraphs: Open-Vocabulary 3D Scene Graphs for Robot Perception*. **ICRA 2024**.
2. **Rana, K., Haviland, J., Garg, S., et al.** (2023). *SayPlan: Grounding Large Language Models using 3D Scene Graphs for Scalable Robot Task Planning*. **CoRL 2023**.
3. **Hong, Y., Zhen, H., Chen, P., et al.** (2023). *3D-LLM: Injecting the 3D World into Large Language Models*. **NeurIPS 2023**.
4. **Lin, C., Li, Z., Tang, S., et al.** (2024). *VastGaussian: Vast 3D Gaussians for Large Scene Reconstruction*. **CVPR 2024**.
5. **Hughes, N., Chang, Y., & Carlone, L.** (2022). *Hydra: A Real-time Spatial Perception Engine for 3D Scene Graph Construction and Hierarchical Mapping*. **RSS 2022**.
6. **Williams, G., Drews, P., Goldfain, B., et al.** (2017). *Information-Theoretic Model Predictive Control: Theory and Applications to Autonomous Driving*. **IEEE Transactions on Robotics (T-RO 2017)**.
7. **Rawlings, J. B., Mayne, D. Q., & Diehl, M.** (2017). *Model Predictive Control: Theory, Computation, and Design* (2nd ed.). **Nob Hill Publishing**.
