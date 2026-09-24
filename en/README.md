# Computer Science & Deep Learning Notes (Technical Reference)

> Language / 語言: [🇹🇼 繁體中文](../README.md) | 🇺🇸 **English**

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.x-EE4C2C.svg?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00.svg?logo=tensorflow&logoColor=white)](https://tensorflow.org/)
[![Hardware Alignment](https://img.shields.io/badge/Hardware-CUDA_Warp--32-76B900.svg?logo=nvidia&logoColor=white)](https://developer.nvidia.com/cuda-toolkit)
[![Obsidian Vault](https://img.shields.io/badge/Obsidian-Verified-7C3AED.svg?logo=obsidian&logoColor=white)](https://obsidian.md/)
[![System Invariants](https://img.shields.io/badge/System_Rules-84_Invariants-0ea5e9.svg)](00_overview/LIB-000%20Grand%20Library%20Index%20&%20Navigator%20%28Agent%20EN%29.md)

<p align="center">
  <b>Technical Notes on Mathematical Foundations, GPU Systems, and Production Deep Learning</b>
</p>

[Overview](00_overview/LIB-000%20Grand%20Library%20Index%20&%20Navigator%20%28Agent%20EN%29.md) • [Principles](#1-principles) • [Pipeline](#2-code--architecture-pipeline) • [Computer Vision](#3-computer-vision--preprocessing) • [Calibration & Frontiers](#4-calibration--modern-frontiers) • [Roadmap](#5-dependency-graph) • [Catalog](#6-catalog-of-wings--volumes)

</div>

---

## About This Repository

Authored and maintained by **Luke**, this repository contains structured technical notes spanning computer science, deep learning theory, GPU microarchitecture, and computer vision.

Each module is organized across four technical layers:
1. **Motivation & Intuition**: Explains the core failure modes of earlier approaches and the geometric intuition behind modern architectures.
2. **Mathematical Formulation**: Formal definitions, closed-form solutions, and convergence properties backed by peer-reviewed literature (CVPR, ICCV, NeurIPS, ICML, ICLR, MLSys, ACM TOG).
3. **Systems & Microarchitecture**: Cache line utilization, 32-thread CUDA Warp coalescing, Tensor Core GEMM tiling, and memory bandwidth considerations.
4. **Implementation & Invariants**: Executable PyTorch / CUDA code with tensor shape annotations and defensive boundary assertions.

---

## 1. Principles

The foundation of modern deep learning rests upon high-dimensional coordinate transforms and numerical optimization.

<div align="center">
  <img src="../assets/01_principles_navigator.svg" alt="Deep Learning Principles" width="100%" />
</div>

### Six Core Theoretical Pillars
| Pillar ID | Core Principle | Technical Problem Addressed | Reference Note |
| :--- | :--- | :--- | :--- |
| **01 Projection** | **High-Dimensional Geometry ($W x + b$)** | Pixel space rotation, scaling, and hyperplane projection in $\mathbb{R}^{784}$ | [LIB-101 Linear Algebra](01_mathematics/LIB-101%20Linear%20Algebra%20&%20High-Dimensional%20Geometry%20%28Agent%20EN%29.md) |
| **02 Forward** | **Non-Linear Activation** | Dense linear mapping; ReLU/GELU enables universal approximation and preserves gradient flow | [LIB-001 First Principles](00_overview/LIB-001%20Deep%20Learning%20First%20Principles%20%28Agent%20EN%29.md) |
| **03 Loss** | **Distribution Metrics** | Cross-Entropy measures divergence between predicted probabilities and target labels | [LIB-001 First Principles](00_overview/LIB-001%20Deep%20Learning%20First%20Principles%20%28Agent%20EN%29.md) |
| **04 Backpropagation** | **Jacobian Chain Rule** | Automatic differentiation over the computation DAG; gradient points in steepest ascent direction | [LIB-104 Convex Optimization](01_mathematics/LIB-104%20Convex%20Optimization%20&%20Gradient%20Descent%20%28Agent%20EN%29.md) |
| **05 Optimizer** | **Adaptive Moment Estimation** | First-order momentum pushes through plateaus; second-order moment handles ill-conditioned curvature | [LIB-104 Convex Optimization](01_mathematics/LIB-104%20Convex%20Optimization%20&%20Gradient%20Descent%20%28Agent%20EN%29.md) |
| **06 Inductive Bias** | **CNN Translation Equivariance** | Solves coordinate-dependent overfitting in dense MLPs via local receptive fields and weight sharing | [LIB-401 CNN Inductive Bias](04_deep_learning_architectures/LIB-401%20DNN%20Spatial%20Limits%20&%20CNN%20Inductive%20Bias%20%28Agent%20EN%29.md) |

---

## 2. Code & Architecture Pipeline

Taking handwritten digit recognition as a concrete case study, production deployment requires balancing hardware memory alignment, distribution shift mitigation, and inference latency.

<div align="center">
  <img src="../assets/02_code_pipeline.svg" alt="Production Code Pipeline" width="100%" />
</div>

### Lifecycle Modules (LIB-901 Architecture)
1. **Module 01: Environment & CUDA Diagnostics**: Dynamic validation of CUDA runtime, driver capabilities, and memory availability.
2. **Module 02: Dataset Ingestion & Validation**: Safe dimension checking and visualization controls `[RULE-901-01]`.
3. **Module 03: Normalization & One-Hot Encoding**: Exact `float32 / 255.0` scaling without double division `[RULE-901-02]`.
4. **Module 04: Hardware-Aligned Neural Network**:
   - Nodes: $256 \to 128 \to 64 \to 32$, structured as multiples of 16/32 to align with NVIDIA Tensor Core MMA hardware micro-tiles and GEMM block partitions, alongside 32-thread Warp memory coalescing.
   - Normalization: `BatchNormalization()` for covariate shift stabilization, coupled with `Dropout(0.2)`.
   - Parameter budget: 245K parameters, saving 72% compute compared to unconstrained deep MLPs.
5. **Module 05: Convergence Monitoring & Validation**: Loss/Accuracy trajectories evaluated on hold-out splits.
6. **Module 06: Real-Time Inference Service**: Integration of preprocessing logic with Gradio for sub-millisecond local API serving.

---

## 3. Computer Vision & Preprocessing

Real-world user inputs typically suffer from severe scale and centering drift. Naive resizing often degrades thin strokes into disconnected artifacts or shifts strokes into negative-weight penalty zones.

<div align="center">
  <img src="../assets/03_application_cv.svg" alt="Computer Vision Preprocessing" width="100%" />
</div>

### Core Failure Modes and Solutions
- **Scale Collapse on Large Canvases**:
  - *Failure*: Resizing a large canvas directly crushes small strokes into unrecognizable noise.
  - *Solution*: Extract bounding box, scale longest side to 20 px with Lanczos-3 interpolation, and pad to $28 \times 28$.
- **Geometric vs. Mass Centering**:
  - *Failure*: Geometric bounding-box centering pushes upright uncrossed strokes (e.g., upright 7) into off-center negative weight regions.
  - *Solution*: Calculate zero-th and first-order ink moments following LeCun et al. (1998) for the true center of mass:
    $$\bar{x} = \frac{\sum x \cdot I(x, y)}{\sum I(x, y)}, \quad \bar{y} = \frac{\sum y \cdot I(x, y)}{\sum I(x, y)}$$
    Aligning the centroid with $(13.5, 13.5)$, combined with a defensive engineering clamp [SAFETY_BOUND] ($\pm 3\text{ px}$) to prevent eccentric strokes from clipping frame boundaries.
- **Test-Time Augmentation (Bunch TTA)**:
  - Multi-view rotation and reflection convex combination inference to suppress boundary noise (Electronics 2024).

---

## 4. Calibration & Modern Frontiers

<div align="center">
  <img src="../assets/04_logic_calibration_frontiers.svg" alt="Model Calibration and Frontiers" width="100%" />
</div>

1. **Model Calibration**: Unregularized deep networks often output overconfident probabilities (100% vs 0%) on ambiguous inputs. Expected Calibration Error (ECE) and Temperature Scaling restore probabilistic reliability (Guo et al., ICML 2017).
2. **Generative Modeling Frontiers**: Moving from multi-step Score-based SDE diffusion to straight-line Optimal Transport Flow Matching (zero curvature $\kappa = 0$, 5-step Euler integration) and Diffusion Transformers (DiT).
3. **Dual-Process Neural Agents**: System 1 non-autoregressive token/byte reflex models (50ms latency) handling high-frequency interactions, backed by System 2 deliberate planning when uncertainty is high.

---

## 5. Dependency Graph

<div align="center">
  <img src="../assets/00_grand_roadmap.svg" alt="Knowledge Dependency Graph" width="100%" />
</div>

---

## 6. Catalog of Wings & Volumes

| Call Number | Wing | Volume Title | Core Theoretical Focus |
| :--- | :--- | :--- | :--- |
| **LIB-000** | **00 Overview** | [Master Index & Topological Graph](00_overview/LIB-000%20Grand%20Library%20Index%20&%20Navigator%20%28Agent%20EN%29.md) | DAG dependency topology, classification, and system invariants |
| **LIB-001** | **00 Overview** | [Deep Learning First Principles](00_overview/LIB-001%20Deep%20Learning%20First%20Principles%20%28Agent%20EN%29.md) | Six core pillars: geometry, activations, loss, backprop, Adam, CNN bias |
| **LIB-101** | **01 Mathematics** | [Linear Algebra & High-Dimensional Geometry](01_mathematics/LIB-101%20Linear%20Algebra%20&%20High-Dimensional%20Geometry%20%28Agent%20EN%29.md) | Vector spaces, SVD, hyperplanes, geometric projection |
| **LIB-104** | **01 Mathematics** | [Convex Optimization & Gradient Descent](01_mathematics/LIB-104%20Convex%20Optimization%20&%20Gradient%20Descent%20%28Agent%20EN%29.md) | Lipschitz continuity, Hessian conditioning, momentum dynamics |
| **LIB-203** | **02 Systems** | [Computer Architecture & Hardware-Aware Deep Learning](02_computer_systems/LIB-203%20Computer%20Architecture%20&%20Hardware-Aware%20Deep%20Learning%20%28Agent%20EN%29.md) | Memory hierarchy, Warp divergence, Tensor Cores, Roofline model |
| **LIB-301** | **03 Machine Learning** | [Dataset Bias, Domain Shift & Spatial Penalties](03_machine_learning/LIB-301%20Dataset%20Bias,%20Domain%20Shift%20&%20Spatial%20Penalties%20%28Agent%20EN%29.md) | Covariate shift, cultural dataset bias, spatial weight penalties |
| **LIB-401** | **04 Architectures** | [DNN Spatial Limits & CNN Inductive Bias](04_deep_learning_architectures/LIB-401%20DNN%20Spatial%20Limits%20&%20CNN%20Inductive%20Bias%20%28Agent%20EN%29.md) | Coordinate destruction in MLPs, localized receptive fields, equivariance |
| **LIB-405** | **04 Architectures** | [Attention Mechanism & Transformer Revolution](04_deep_learning_architectures/LIB-405%20Attention%20Mechanism%20&%20Transformer%20Revolution%20%28Agent%20EN%29.md) | Scaled Dot-Product Attention, RoPE positional encoding, FlashAttention-3 |
| **LIB-406** | **04 Architectures** | [Generative Frontiers: SDE Diffusion to Flow Matching](04_deep_learning_architectures/LIB-406%20Generative%20Frontiers%20-%20SDE%20Diffusion%20to%20Flow%20Matching%20%28Agent%20EN%29.md) | Score matching, Optimal Transport Flow Matching, DiT scaling |
| **LIB-407** | **04 Architectures** | [Fine-Grained Instruction Image Editing](04_deep_learning_architectures/LIB-407%20Fine-Grained%20Instruction%20Image%20Editing%20&%20Cross-Attention%20Preservation%20%28Agent%20EN%29.md) | Latent inversion, cross-attention modulation, mutual self-attention locking |
| **LIB-408** | **04 Architectures** | [Context-Aware Object Generation & Compositing](04_deep_learning_architectures/LIB-408%20Context-Aware%20Object%20Generation,%20Illumination%20Estimation%20&%20Image%20Compositing%20%28Agent%20EN%29.md) | Metric depth perspective, Spherical Harmonics lighting, contact shadows |
| **LIB-501** | **05 Vision** | [CV Preprocessing & Center of Mass Alignment](05_computer_vision/LIB-501%20CV%20Preprocessing%20&%20Center%20of%20Mass%20Alignment%20%28Agent%20EN%29.md) | Bounding box clamping, ink moment center-of-mass centering |
| **LIB-504** | **05 Vision** | [3D Gaussian Splatting Theory & Rasterization](05_computer_vision/LIB-504%203D%20Gaussian%20Splatting%20Theory%20&%20Rasterization%20%28Agent%20EN%29.md) | Continuous radiance fields vs 3D Gaussians, GPU tile rasterization |
| **LIB-505** | **05 Vision** | [Open-Vocabulary 3DGS & Semantic Retrieval](05_computer_vision/LIB-505%20Open-Vocabulary%203D%20Gaussian%20Splatting%20&%20Semantic%20Retrieval%20%28Agent%20EN%29.md) | 2D-to-3D language distillation, multi-view consensus, open-vocabulary queries |
| **LIB-506** | **05 Vision** | [LLM-Grounded 3D Scene QA & Navigation](05_computer_vision/LIB-506%20LLM-Grounded%203D%20Scene%20QA,%20Hierarchical%20Scene%20Graphs%20&%20Embodied%20Navigation%20%28Agent%20EN%29.md) | ConceptGraphs, spatial reasoning ReAct loops, hierarchical campus tour |
| **LIB-602** | **06 NLP & LLMs** | [Modern LLM Architecture & Scaling Laws](06_nlp_and_llms/LIB-602%20Modern%20LLM%20Architecture%20&%20Scaling%20Laws%20%28Agent%20EN%29.md) | Chinchilla scaling laws, SwiGLU, RMSNorm, Grouped-Query Attention (GQA) |
| **LIB-703** | **07 Agents** | [LLM Agent Cognitive Architecture & Protocols](07_reinforcement_learning_and_agents/LIB-703%20LLM%20Agent%20Cognitive%20Architecture%20&%20Protocols%20%28Agent%20EN%29.md) | ReAct reasoning loops, Plan-and-Solve, structured tool schema |
| **LIB-704** | **07 Agents** | [Dual-Process Neural Agent: S1-Jev & Reflex CUA-S1](07_reinforcement_learning_and_agents/LIB-704%20Dual-Process%20Neural%20Agent%20S1-Jev%20&%20Reflex%20CUA-S1%20%28Agent%20EN%29.md) | Non-autoregressive typed execution, byte-level interface reflex, gating |
| **LIB-801** | **08 Systems Eng** | [Model Calibration & Uncertainty Estimation](08_ai_systems_engineering/LIB-801%20Model%20Calibration%20&%20Uncertainty%20Estimation%20%28Agent%20EN%29.md) | Expected Calibration Error (ECE), Temperature Scaling, reliability diagrams |
| **LIB-802** | **08 Systems Eng** | [Quantization Mathematics & Low-Precision Inference](08_ai_systems_engineering/LIB-802%20Quantization%20Mathematics%20&%20Low-Precision%20Inference%20%28Agent%20EN%29.md) | Affine quantization ($S, Z$), AWQ, GPTQ, INT4/FP8 Tensor Core GEMM |
| **LIB-901** | **09 Methodology** | [Classic Project Post-Mortem: Production MNIST](09_research_methodology/LIB-901%20Classic%20Project%20Post-Mortem%20-%20Production%20MNIST%20%28Agent%20EN%29.md) | End-to-end post-mortem: from exploratory script to production pipeline |
| **LIB-903** | **09 Methodology** | [Capstone Blueprint & Academic Research Evolution](09_research_methodology/LIB-903%20Capstone%20Blueprint%20&%20Academic%20Research%20Evolution%20%28Agent%20EN%29.md) | Research proposal formulation, ablation design, paper structure |
| **LIB-904** | **09 Methodology** | [Academic Research Corpus & Literature Synthesis](09_research_methodology/LIB-904%20Academic%20Research%20Corpus%20&%20Literature%20Synthesis%20%28Agent%20EN%29.md) | Literature review methodology, metric verification, and reproduction |
| **LIB-905** | **09 Methodology** | [Frontier Vision & Multimodal Capstone Blueprints](09_research_methodology/LIB-905%20Frontier%20Vision%20&%20Multimodal%20Capstone%20Blueprints%20%28Agent%20EN%29.md) | Five capstone specifications, full pipelines, NSTC grant templates |

---

## License

MIT License. See [LICENSE](../LICENSE) for details.
```bibtex
@misc{luke2026library,
  author = {Luke},
  title = {Computer Science and Deep Learning Knowledge Base: Theory, Systems, and Implementations},
  year = {2026},
  publisher = {GitHub},
  howpublished = {\url{https://github.com/OPluke11-abula/library}}
}
```
