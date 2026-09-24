---
call_number: LIB-905
title: Frontier Vision & Multimodal Capstone Blueprints - Five Grand Research Specifications (Agent EN)
module: Research-Methodology
category: Capstone-Engineering-Blueprints
audience:
  - Autonomous-Agent
  - AI-Researcher
  - Senior-Systems-Architect
status: Verified-Authoritative-Production
math_foundations:
  - Multimodal Contrastive & Diffusion Objective Formulations
  - End-to-End System Evaluation Metrics (mAP, LPIPS, CLIP-Score, Navigation SLA)
  - Full-Stack Pipeline Decomposition & Hardware Budgeting
hardware_target:
  - Workstation with Single/Dual NVIDIA RTX 4090 (24GB)
  - Unity 3D Engine & WebXR / Mobile Edge Deployment
invariants_count: 5
created: 2026-09-24
author: Luke
prerequisites:
  - "[[LIB-407 Fine-Grained Instruction Image Editing & Cross-Attention Preservation (Agent EN)]]"
  - "[[LIB-408 Context-Aware Object Generation, Illumination Estimation & Image Compositing (Agent EN)]]"
  - "[[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]]"
  - "[[LIB-505 Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval (Agent EN)]]"
  - "[[LIB-506 LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)]]"
  - "[[LIB-903 Capstone Blueprint & Academic Research Evolution (Agent EN)]]"
successors:
  - "[[LIB-000 Grand Library Index & Navigator (Agent EN)]]"
tags:
  - capstone-blueprints
  - 3dgs
  - image-editing
  - object-generation
  - intelligent-tour
  - research-grant-nstc
---

> Language Switch / 語言切換: [🇹🇼 繁體中文](../../09_%E7%A7%91%E7%A0%94%E6%96%B9%E6%B3%95%E8%AB%96%E8%88%87%E9%A0%82%E5%B0%96%E5%B0%88%E9%A1%8C%E8%97%8D%E5%9C%96/LIB-905%20%E5%89%8D%E6%B2%BF%E8%A6%96%E8%A6%BA%E8%88%87%E5%85%B7%E8%BA%AB%E5%A4%9A%E6%A8%A1%E6%85%8B%E5%B0%88%E9%A1%8C%E7%A0%94%E7%99%BC%E8%97%8D%E5%9C%96%EF%BC%9A%E4%BA%94%E5%A4%A7%E9%A1%8C%E7%9B%AE%E6%8A%80%E8%A1%93%E5%85%A8%E6%99%AF%E8%88%87%E6%B6%88%E8%9E%8D%E5%AF%A6%E8%AD%89%E6%8C%87%E5%8D%97%20%28Frontier%20Vision%20%26%20Multimodal%20Capstone%20Blueprints%20-%20Five%20Grand%20Research%20Specifications%29.md) | 🇺🇸 **English (Agent Edition)**

# Frontier Vision & Multimodal Capstone Blueprints: Five Grand Research Specifications

## Conceptual Coordinates & Dependencies
- **Prerequisites**: [[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]], [[LIB-505 Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval (Agent EN)]], [[LIB-506 LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)]], [[LIB-407 Fine-Grained Instruction Image Editing & Cross-Attention Preservation (Agent EN)]], [[LIB-408 Context-Aware Object Generation, Illumination Estimation & Image Compositing (Agent EN)]].
- **Core Scope**: Translates five faculty capstone research proposals into production-grade systems architectures, mathematical models, ablation matrices, and competitive research grant proposals (e.g., NSTC Undergraduate Research Projects).

---

## 1. Five Grand Capstone Projects Matrix

| Topic ID | Topic Title | Core Technical Stack | Key Academic Pain Points | Corresponding Flagship Volume | Hardware & Difficulty |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Topic 01** | **Text-Guided Object Retrieval in 3DGS Scenes** | 3DGS + CLIP + SAM + Cross-View Consensus | Standard 3DGS lacks semantic descriptors; open-vocabulary queries suffer from feature dimension explosion and cross-view boundary drift. | [[LIB-505 Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval (Agent EN)]] | ★★★★☆<br>RTX 4090 / 24GB |
| **Topic 02** | **Intelligent Scene QA & Navigation using LLMs and 3DGS** | 3DGS + LLM + 3D Scene Graphs + A* Topological Navigation | Pure text LLMs lack spatial geometric embodiment; radiance fields lack symbolic reasoning and collision-free path planning. | [[LIB-506 LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)]] | ★★★★☆<br>RTX 4090 + Unity |
| **Topic 03** | **Intelligent Virtual Campus Tour System Using 3DGS** | Aerial/Ground Large-Scale 3DGS + Hierarchical Campus Graph + Unity MR | Memory overflow in large-scale outdoor reconstruction; multi-building cross-floor transitions and real-time high-FPS rendering. | [[LIB-506 LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation (Agent EN)]] | ★★★☆☆<br>RTX 4080+ / Unity |
| **Topic 04** | **Fine-Grained Instruction-Based Image Editing with Non-Target Preservation** | Diffusion Models + Mutual Self-Attention + Latent Inversion | Instruction editing causes unintended cascading alterations ("over-editing"), collapsing background textures and non-target geometry. | [[LIB-407 Fine-Grained Instruction Image Editing & Cross-Attention Preservation (Agent EN)]] | ★★★★☆<br>16GB+ VRAM |
| **Topic 05** | **Context-Aware Object Generation & Compositing with Illumination Consistency** | Conditional Diffusion (ControlNet) + Depth/Normal Estimation + Spherical Harmonics + Shadow Synthesis | Newly inserted objects lack photorealism, showing perspective distortion, conflicting lighting angles, and floating artifacts (missing contact shadows). | [[LIB-408 Context-Aware Object Generation, Illumination Estimation & Image Compositing (Agent EN)]] | ★★★★★<br>24GB VRAM |

---

## 2. Modular Engineering Pipelines & Evaluation Protocols

### Topic 1: Text-Guided Object Retrieval in 3DGS (LIB-505)
```
[RGB Images + COLMAP] ──> [3DGS Reconstruction] ──> [SAM 2D Segmentation + CLIP] ──> [Autoencoder Feature Distillation]
                                                                                               │
[Text Query: "find something to sit on"] ──> [CLIP Text Embedding] ──> [Cosine Similarity Matmul] ──┘
                                                                                               │
                                                                                               ▼
                                                                     [Confidence Thresholding & DBSCAN Clustering]
                                                                                               │
                                                                                               ▼
                                                                     [Unity / WebGL Custom Highlight Shader Display]
```
- **Scoring Formulation**: $\text{Score} = \alpha S_{\text{text}} + \beta S_{\text{view}} + \gamma S_{\text{conf}}$.
- **Metrics**: Top-1 / Top-3 Accuracy ($\ge 85\%$), Retrieval mAP ($\ge 0.76$), Query Latency $< 300\text{ms}$.

### Topic 2: LLM + 3DGS Intelligent Scene QA & Tour Guide (LIB-506)
- **Architecture**:
  1. **Symbolic 3D Scene Graph (ConceptGraphs Paradigm)**: Extract bounding boxes, centroids $c_i$, and object categories into structured JSON graphs.
  2. **Spatial Reasoning Agent (ReAct / CoT)**: Ingest natural query ("Where is the 3D printer?"), query topological graph, compute relative orientation ("Black printer against the right wall"), and return target ID.
  3. **Camera Trajectory Guidance**: Smooth camera transition via Catmull-Rom spline pathing towards the identified target.

### Topic 3: Virtual Campus Tour System (LIB-506)
- **Hierarchical Level-of-Detail (LOD)**:
  - **Level 1 (Macro Campus)**: Drone aerial photogrammetry partitioned via block-based VastGaussian.
  - **Level 2 (Corridor / Floor)**: Handheld gimbal SLAM capturing dense walk-through paths and NavMesh topology.
  - **Level 3 (Indoor Lab / Hall)**: Millimeter-level dense Gaussians with interactive spatial UI widgets.
- **Key Feature**: Voice prompt "Guide me to the Computer Science Lab" generates dynamic 3D directional ribbons overlaying the Gaussian splatting feed.

### Topic 4: Fine-Grained Instruction Image Editing (LIB-407)
- **Pipeline**:
  1. **Instruction Parsing**: "Change the car rims to black, keep everything else unchanged" $\to$ Target: `rims`, Attribute: `black`, Invariant: `car body, background`.
  2. **Cross-Attention Modulation**: $A_{\text{target}} \times 1.5$, $A_{\text{bg}} \times 0.2$.
  3. **Mutual Self-Attention Locking (MasaCtrl Paradigm)**: Inject source image Key/Value states into non-target tokens to prevent hallucinated changes.
- **Quantitative Baselines**: Background $\text{LPIPS} \le 0.04$, Editing Success Rate $\ge 90\%$, CLIP-Score $\ge 28.5$.

### Topic 5: Context-Aware Generation & Illumination Compositing (LIB-408)
- **Five-Stage Physical Integration Pipeline**:
  1. **Semantic Grounding**: Segment spatial plane on floor near sofa.
  2. **Metric Depth & Perspective Scaling**: Depth Anything V2 estimates depth $Z$; compute pixel height via pinhole model $h = \frac{f \cdot H}{Z}$.
  3. **Illumination Estimation**: Estimate Spherical Harmonics light vector $\mathbf{L} = (\theta, \phi)$.
  4. **Guided Diffusion Synthesis**: Generate candidate object conditioned on perspective wireframe.
  5. **Contact Shadow & Color Harmonization**: Cast directional shadow along $-\mathbf{L}$; execute Poisson blending and neural color harmonization.

---

## 3. NSTC Undergraduate Research Grant (C801) Proposal Framework

```markdown
1. Research Motivation & Theoretical Gaps
   - Contrast 2D generative limits with physical 3D world inconsistencies.
   - Emphasize 3DGS real-time rendering advantages (100+ FPS) over NeRF, identifying lack of semantic grounding.
2. Novel Methodology & Technical Framework
   - Complete system diagram (refer to LIB-505 / LIB-407 architectures).
   - Mathematical model derivations (loss formulations, attention masks, geometric projection).
3. Deliverables & Quantitative Ablations
   - Comparative evaluation against SOTA baselines (LERF, InstructPix2Pix, ControlNet).
   - Interactive deployment demo (Unity WebGL / Gradio dashboard).
4. Budget & Hardware Resource Allocation
   - Compute infrastructure: Single/Dual NVIDIA RTX 4090 (24GB VRAM), depth sensors, VR head-mounted displays.
```

---

## 4. System Invariants & Quality Bounds

### [RULE-905-01] Multi-View Semantic Consensus Safeguard
- **Classification**: `CRITICAL_INVARIANT`
- **Bound**: When building 3D semantic Gaussian fields, multi-view back-projected IoU must satisfy $\ge 0.65$. Views below this threshold are disqualified from feature codebook updates.

### [RULE-905-02] Background Non-Target Lossless Preservation
- **Classification**: `CRITICAL_INVARIANT`
- **Bound**: For instruction editing, background invariant pixels must satisfy $\text{MAE} \le 3/255$ and $\text{SSIM} \ge 0.96$ against original inputs.

### [RULE-905-03] Gravitational Contact Shadow Physicality
- **Classification**: `HIGH_INVARIANT`
- **Bound**: Grounded objects must generate continuous contact drop shadows along the negative light vector $-\mathbf{L}$. Non-shadowed composited outputs are flagged as invalid samples.

### [RULE-905-04] Large-Scale 3DGS Spatial Octree Memory Budget
- **Classification**: `HIGH_INVARIANT`
- **Bound**: Large campus scenes must enforce octree spatial chunking. Active frustum Gaussian points must not exceed $4.5 \times 10^6$, maintaining dynamic VRAM $\le 14\text{GB}$.

### [RULE-905-05] Collision-Free Topological Navigation Clearance
- **Classification**: `CRITICAL_INVARIANT`
- **Bound**: Navigational trajectories generated by spatial pathing algorithms must maintain Euclidean clearance $R_{\text{safe}} \ge 0.35\text{m}$ from all reconstructed obstacle centroids.

---

## 5. Canonical Research Literature

1. **Kerbl, B., et al.** (2023). *3D Gaussian Splatting for Real-Time Radiance Field Rendering*. **ACM TOG / SIGGRAPH 2023**.
2. **Qin, M., et al.** (2024). *LangSplat: 3D Language Gaussian Splatting*. **CVPR 2024**.
3. **Gu, J., et al.** (2024). *ConceptGraphs: Open-Vocabulary 3D Scene Graphs for Robot Perception*. **ICRA 2024**.
4. **Brooks, T., et al.** (2023). *InstructPix2Pix: Learning to Follow Image Editing Instructions*. **CVPR 2023**.
5. **Cao, M., et al.** (2023). *MasaCtrl: Tuning-Free Mutual Self-Attention Control for Consistent Image Synthesis and Editing*. **ICCV 2023**.
6. **Yang, L., et al.** (2024). *Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data*. **CVPR 2024**.
7. **Zhang, L., et al.** (2023). *Adding Conditional Control to Text-to-Image Diffusion Models*. **ICCV 2023**.
8. **Lin, C., et al.** (2024). *VastGaussian: Vast 3D Gaussians for Large Scene Reconstruction*. **CVPR 2024**.
