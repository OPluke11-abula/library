---
call_number: LIB-506
title: LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)
module: Computer-Vision
category: 3D-Gaussian-Splatting-Embodied-AI
audience:
  - Autonomous-Agent
  - Graduate-PhD
status: Verified-Authoritative-Production
math_foundations:
  - Hierarchical 3D Scene Graph (H-3DSG) Formal Topology
  - Topological A* Path Planning & Heuristic Distance Fields
  - Vision-Language Model Spatial Reasoning Grounding
hardware_target:
  - Unity / WebXR Compute Shader Splatting Runtime
  - Asynchronous LLM Spatial Planning Worker
invariants_count: 3
created: 2026-09-24
author: Luke
prerequisites:
  - "[[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]]"
  - "[[LIB-505 Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval (Agent EN)]]"
  - "[[LIB-703 LLM Agent Cognitive Architecture & Protocols (Agent EN)]]"
successors:
  - "[[LIB-905 Frontier Vision & Multimodal Capstone Blueprints (Agent EN)]]"
tags:
  - computer-vision
  - 3dgs
  - llm-agent
  - scene-graphs
  - navigation
  - unity
---

> Language / 語言: [🇹🇼 繁體中文](../../05_%E8%A8%88%E7%AE%97%E6%A9%9F%E8%A6%96%E8%A6%BA%E8%88%87%E9%AB%98%E7%B6%AD%E6%84%9F%E6%B8%AC/LIB-506%20%E5%A4%A7%E8%AA%9E%E8%A8%80%E6%A8%A1%E5%9E%8B%E9%A9%85%E5%8B%95%E4%B9%8B%203DGS%20%E7%A9%BA%E9%96%93%E5%95%8F%E7%AD%94%E3%80%81%E9%9A%8E%E5%B1%A4%E5%A0%B4%E6%99%AF%E5%9C%96%E8%88%87%E5%85%B7%E8%BA%AB%E5%B0%8E%E8%88%AA%20%28LLM-Grounded%203D%20Scene%20QA,%20Hierarchical%20Scene%20Graphs%20&%20Embodied%20Navigation%29.md) | 🇺🇸 **English**

# LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation

## 1. Formalization of Hierarchical 3D Scene Graphs (H-3DSG)

To scale spatial reasoning across multi-building campuses and lab facilities, the environment is modeled as a multi-tier attributed graph:
$$\mathcal{G}_{\text{scene}} = (\mathcal{V}, \mathcal{E})$$
$$\mathcal{V} = \mathcal{V}_{\text{campus}} \cup \mathcal{V}_{\text{building}} \cup \mathcal{V}_{\text{floor}} \cup \mathcal{V}_{\text{room}} \cup \mathcal{V}_{\text{object}}$$

Each object node $v_k \in \mathcal{V}_{\text{object}}$ possesses:
$$v_k = \left( \text{ID}_k, \text{Class}_k, \mathbf{c}_k \in \mathbb{R}^3, \mathbf{B}_k \in \mathbb{R}^6, \Omega_k \subset \mathbb{N} \right)$$
where $\mathbf{c}_k$ is the 3D bounding centroid, $\mathbf{B}_k$ represents Oriented Bounding Box dimensions, and $\Omega_k$ is the subset of rendering Gaussian indices.

### Spatial Query & Navigation Pipeline
1. **Query Parsing**: Natural language queries ("Where is the 3D printer?") are decomposed into target labels and relative spatial predicates.
2. **LLM Spatial Grounding**: The LLM queries $\mathcal{G}_{\text{scene}}$ to identify node $v^*$ and outputs localized descriptions relative to user camera coordinates.
3. **Collision-Free Path Generation**: Topological A* planning over the walkable mesh:
   $$\mathcal{P}^* = \arg\min_{\mathcal{P}} \sum_{i=1}^{M-1} \|\mathbf{p}_{i+1} - \mathbf{p}_i\|_2, \quad \text{s.t. } \text{dist}(\mathbf{p}_i, \partial \Omega_{\text{obs}}) \ge R_{\text{safe}}$$
4. **Unity Compute Shader Splatting**: Highlights $\Omega^*$ target Gaussians via stencil buffer modulation and renders real-time navigation spline corridors.

---

## 2. Invariants & Implementation Specifications

- `INV-506-01 (Strict Hierarchy Invariant)`: Object nodes MUST strictly belong to exactly one parent room node. Cyclic multi-parent relationships are prohibited.
- `INV-506-02 (Camera Clearance Invariant)`: Generated camera flight paths MUST maintain vertical ground clearance between $[1.5\text{m}, 1.7\text{m}]$ and barrier clearance $\ge 0.4\text{m}$.
- `INV-506-03 (Frame Rate SLA)`: Real-time 3DGS rendering in Unity / WebXR MUST sustain $\ge 45\text{ FPS}$ on desktop targets.

---

## 3. Canonical References

1. **Gu, J., et al.** (2024). *ConceptGraphs: Open-Vocabulary 3D Scene Graphs for Robot Perception*. **ICRA 2024**.
2. **Rana, K., et al.** (2023). *SayPlan: Grounding Large Language Models using 3D Scene Graphs for Scalable Robot Task Planning*. **CoRL 2023**.
3. **Hong, Y., et al.** (2023). *3D-LLM: Injecting the 3D World into Large Language Models*. **NeurIPS 2023**.
