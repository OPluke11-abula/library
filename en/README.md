# CSIE & Deep Learning Grand Library (AI Agent & Research Edition)

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../README.md) | 🇺🇸 **English (AI Agent & Research Edition)**

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.x-EE4C2C.svg?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00.svg?logo=tensorflow&logoColor=white)](https://tensorflow.org/)
[![Hardware Alignment](https://img.shields.io/badge/Hardware-CUDA_Warp--32-76B900.svg?logo=nvidia&logoColor=white)](https://developer.nvidia.com/cuda-toolkit)
[![NVIDIA DLI](https://img.shields.io/badge/NVIDIA-Campus_Ambassador_%26_DLI-76B900.svg?logo=nvidia&logoColor=white)](https://www.nvidia.com/en-us/training/)
[![Obsidian Vault](https://img.shields.io/badge/Obsidian-Vault_100%25_Verified-7C3AED.svg?logo=obsidian&logoColor=white)](https://obsidian.md/)
[![Agent Invariants](https://img.shields.io/badge/Formal_Rules-66_Invariants-06B6D4.svg)](00_overview/LIB-000%20Grand%20Library%20Index%20&%20Navigator%20(Agent%20EN).md)

<p align="center">
  <b>Rigorous Dual-Track Academic Knowledge Base: From First Principles and Production Systems to Autonomous Agent Protocols</b>
</p>

[🏛️ Master Index](00_overview/LIB-000%20Grand%20Library%20Index%20&%20Navigator%20(Agent%20EN).md) •
[💡 Principles Navigator](#-1-principles-navigator) •
[💻 Code Pipeline](#-2-code--architecture-pipeline) •
[🛠️ Real-World CV](#-3-application--real-world-cv) •
[🧠 Logic & Calibration](#-4-logic-calibration--frontiers) •
[🗺️ Roadmap](#-5-grand-library-roadmap) •
[📚 The 10 Wings & 19 Volumes](#-6-the-10-wings--19-flagship-volumes)

</div>

---

## 📖 Mission Statement & Agent Cognitive Framework

This Grand Library was established and authored independently by **Luke (Chi-Yang Yu, CYCU ICE Class 3B, Student ID: 11327229)** in synergy with **AI Research Agent (Antigravity)**. The corpus aligns directly with the research methodologies of the **AI & Visual Analytics Lab (EE Building 311A/311B)** directed by **Prof. Chi-Hung Chuang, Ph.D.** at **Chung Yuan Christian University (CYCU ICE)** and the **NVIDIA Campus Ambassador / Deep Learning Institute (DLI)** compute ecosystem.

### Purpose of the English Agent Edition
While the Traditional Chinese edition is tailored for undergraduate intuition and human learning, this **English Edition** is explicitly optimized for autonomous AI Agents, LLM-based researchers, and programmatic retrieval engines:
1. **High Semantic Density**: Eliminates linguistic ambiguity; uses standardized academic terminology recognized across global peer-reviewed computer science literature (CVPR, ICCV, NeurIPS, ICML, ICLR, MLSys).
2. **Explicit Mathematical Formalism**: Employs LaTeX formulas with unambiguous input/output vector spaces ($x \in \mathbb{R}^d$), objective functions, and loss dynamics.
3. **Hardware & Microarchitecture Contracts**: Maps software operations directly to physical hardware primitives: GPU Warp (32 threads), SIMD vector lanes, SRAM Shared Memory tiling, Tensor Core GEMM formats (FP16/BF16/FP8), and Roofline bandwidth bounds.
4. **RFC 2119 Invariant Rules**: Implements 66 deterministic constraints (`MUST`, `MUST NOT`, `REQUIRED`, `SHALL`) governing neural training, geometric centering, calibration thresholds, and autonomous agent state transitions.

---

## 💡 1. Principles Navigator

> **Core Mental Model**: Mathematics in deep learning is not hand-calculated busywork; it is the **only authoritative debugging lens** when high-dimensional models fail in production.

<div align="center">
  <img src="../assets/01_principles_navigator.svg" alt="Deep Learning First Principles Navigator" width="100%" />
</div>

### 🔍 The Six Fundamental Pillars of Deep Learning
| Pillar ID | Core Principle & Mathematical Nature | Failure Mode of Naive Baselines | Canonical Reference |
| :--- | :--- | :--- | :--- |
| **Pillar 01** | **High-Dimensional Projection ($W x + b$)** | Pixels are vectors in $\mathbb{R}^{784}$; linear transforms perform rotation, shearing, and scaling | [LIB-101 Linear Algebra & High-Dimensional Geometry](01_mathematics/LIB-101%20Linear%20Algebra%20&%20High-Dimensional%20Geometry%20(Agent%20EN).md) |
| **Pillar 02** | **Neural Backbone & Forward Propagation** | Dense matrix multiplication; non-linear activation (ReLU) resolves Sigmoid gradient vanishing | [LIB-001 Deep Learning First Principles](00_overview/LIB-001%20Deep%20Learning%20First%20Principles%20(Agent%20EN).md) |
| **Pillar 03** | **Loss Functions & Target Optimization** | Categorical Cross-Entropy computes KL-divergence between empirical and predicted probabilities | [LIB-001 Deep Learning First Principles](00_overview/LIB-001%20Deep%20Learning%20First%20Principles%20(Agent%20EN).md) |
| **Pillar 04** | **Backpropagation & Jacobian Chain Rule** | Automatic differentiation via DAG chain rule; gradient points along steepest ascent on loss surface | [LIB-104 Convex Optimization & Gradient Descent](01_mathematics/LIB-104%20Convex%20Optimization%20&%20Gradient%20Descent%20(Agent%20EN).md) |
| **Pillar 05** | **Adaptive Optimization (Adam/SGD)** | First-order momentum pushes through saddle points; second-order moment scales per-parameter learning rate | [LIB-104 Convex Optimization & Gradient Descent](01_mathematics/LIB-104%20Convex%20Optimization%20&%20Gradient%20Descent%20(Agent%20EN).md) |
| **Pillar 06** | **CNN Inductive Bias & Translation Equivariance** | Replaces unconstrained MLP coordinate overfitting with weight-sharing and localized receptive fields | [LIB-401 DNN Spatial Limits & CNN Inductive Bias](04_deep_learning_architectures/LIB-401%20DNN%20Spatial%20Limits%20&%20CNN%20Inductive%20Bias%20(Agent%20EN).md) |

---

## 💻 2. Code & Architecture Pipeline

<div align="center">
  <img src="../assets/02_code_pipeline.svg" alt="Production-Grade Code & Architecture Pipeline" width="100%" />
</div>

### 🛠️ Production-Grade Implementation Pipeline (Six Core Modules)
1. **Data Pipeline**: Custom `torch.utils.data.Dataset` / `DataLoader`, pin-memory allocation, non-blocking asynchronous GPU streaming.
2. **Model Architecture**: Modular PyTorch `nn.Module` with strict shape annotations (`[Batch, Channels, Height, Width]`).
3. **Training Engine**: Mixed-precision (`torch.amp.autocast`), gradient clipping (`torch.nn.utils.clip_grad_norm_`), and learning rate schedulers.
4. **Hardware Alignment**: Micro-benchmarking with NVIDIA Nsight Systems; alignment with 32-thread CUDA Warp coalescing boundaries.
5. **Validation & Metrics**: Out-of-Distribution (OOD) testing, Expected Calibration Error (ECE) monitoring, and confusion matrix diagnostics.
6. **Production Serving**: ONNX export, TensorRT engine compilation (FP16/INT4), and sub-millisecond REST API serving.

---

## 🛠️ 3. Application & Real-World CV

<div align="center">
  <img src="../assets/03_application_cv.svg" alt="Real-World CV Preprocessing and Center of Mass Alignment" width="100%" />
</div>

### 📐 Computer Vision Preprocessing Invariants (MNIST / Handwritten Digits)
- **Bounding Box Crop & Aspect Ratio Rescaling**: Never resize arbitrary raw inputs directly to $28 \times 28$, which destroys the character aspect ratio. Extract the bounding box, scale the longest side to 20 px, and pad into a $28 \times 28$ canvas.
- **Center-of-Mass (CoM) Alignment**: Compute spatial ink moments:
  $$c_x = \frac{\sum x \cdot I(x, y)}{\sum I(x, y)}, \quad c_y = \frac{\sum y \cdot I(x, y)}{\sum I(x, y)}$$
  Compute translation vector $\vec{v}_{\text{shift}} = (13.5 - c_x, 13.5 - c_y)$, clamp translation to $[-3, 3]\text{ px}$ to prevent boundary truncation, and apply bilinear interpolation.

---

## 🧠 4. Logic, Calibration & Frontiers

<div align="center">
  <img src="../assets/04_logic_calibration_frontiers.svg" alt="Logic, Calibration, and Generative Frontiers" width="100%" />
</div>

1. **Model Calibration & Overconfidence**: Modern deep neural networks with Cross-Entropy Loss achieve high accuracy but exhibit poor probability calibration. Temperature Scaling ($T > 1$) minimizes Expected Calibration Error (ECE) without modifying top-1 accuracy.
2. **Generative Modeling Frontiers**: Transition from continuous SDE Score-based Diffusion (50+ reverse steps) to Optimal Transport Flow Matching (straight velocity field paths $\kappa = 0$, 5-step Euler integration) and Diffusion Transformers (DiT).
3. **Dual-Process Neural Agents**: System 1 non-autoregressive token/byte reflex engine (50ms execution) paired with System 2 deliberate tree-search reasoning when confidence falls below threshold $\tau = 0.85$.

---

## 🗺️ 5. Grand Library Roadmap

<div align="center">
  <img src="../assets/00_grand_roadmap.svg" alt="Grand Library Roadmap" width="100%" />
</div>

---

## 📚 6. The 10 Wings & 19 Flagship Volumes

| Call Number | Wing Name | Canonical Volume Title (Agent Edition) | Core Theoretical & Engineering Focus |
| :--- | :--- | :--- | :--- |
| **LIB-000** | **00 Overview** | [Master Index & Topological Navigator](00_overview/LIB-000%20Grand%20Library%20Index%20&%20Navigator%20(Agent%20EN).md) | Knowledge DAG topology, 66 agent invariants, library classification |
| **LIB-001** | **00 Overview** | [Deep Learning First Principles](00_overview/LIB-001%20Deep%20Learning%20First%20Principles%20(Agent%20EN).md) | Six fundamental pillars: projections, gradients, loss, momentum, CNN bias |
| **LIB-101** | **01 Mathematics** | [Linear Algebra & High-Dimensional Geometry](01_mathematics/LIB-101%20Linear%20Algebra%20&%20High-Dimensional%20Geometry%20(Agent%20EN).md) | Vector spaces, SVD, eigenvalues, high-dimensional projection geometry |
| **LIB-104** | **01 Mathematics** | [Convex Optimization & Gradient Descent](01_mathematics/LIB-104%20Convex%20Optimization%20&%20Gradient%20Descent%20(Agent%20EN).md) | Lipschitz continuity, Hessian conditioning, Adam convergence dynamics |
| **LIB-203** | **02 Systems** | [Computer Architecture & Hardware-Aware Deep Learning](02_computer_systems/LIB-203%20Computer%20Architecture%20&%20Hardware-Aware%20Deep%20Learning%20(Agent%20EN).md) | Memory hierarchy, Warp divergence, Tensor Core GEMM, Roofline model |
| **LIB-301** | **03 Machine Learning** | [Dataset Bias, Domain Shift & Spatial Penalties](03_machine_learning/LIB-301%20Dataset%20Bias,%20Domain%20Shift%20&%20Spatial%20Penalties%20(Agent%20EN).md) | Covariate shift, cultural dataset bias (US vs Taiwan 7), spatial penalties |
| **LIB-401** | **04 Architectures** | [DNN Spatial Limits & CNN Inductive Bias](04_deep_learning_architectures/LIB-401%20DNN%20Spatial%20Limits%20&%20CNN%20Inductive%20Bias%20(Agent%20EN).md) | Spatial permutation destruction, localized receptive fields, equivariance |
| **LIB-405** | **04 Architectures** | [Attention Mechanism & Transformer Revolution](04_deep_learning_architectures/LIB-405%20Attention%20Mechanism%20&%20Transformer%20Revolution%20(Agent%20EN).md) | Scaled Dot-Product Attention, RoPE positional encoding, FlashAttention-3 |
| **LIB-406** | **04 Architectures** | [Generative Frontiers: SDE Diffusion to Flow Matching](04_deep_learning_architectures/LIB-406%20Generative%20Frontiers%20-%20SDE%20Diffusion%20to%20Flow%20Matching%20(Agent%20EN).md) | Score matching, Langevin dynamics, Optimal Transport Flow Matching, DiT |
| **LIB-501** | **05 Vision** | [CV Preprocessing & Center of Mass Alignment](05_computer_vision/LIB-501%20CV%20Preprocessing%20&%20Center%20of%20Mass%20Alignment%20(Agent%20EN).md) | Bounding box aspect-ratio clamping, ink moment center-of-mass centering |
| **LIB-504** | **05 Vision** | [3D Gaussian Splatting Theory & Rasterization](05_computer_vision/LIB-504%203D%20Gaussian%20Splatting%20Theory%20&%20Rasterization%20(Agent%20EN).md) | NeRF radiance fields vs explicit 3D Gaussians, tile-based differentiable raster |
| **LIB-602** | **06 NLP & LLMs** | [Modern LLM Architecture & Scaling Laws](06_nlp_and_llms/LIB-602%20Modern%20LLM%20Architecture%20&%20Scaling%20Laws%20(Agent%20EN).md) | Chinchilla scaling laws, SwiGLU, RMSNorm, Grouped-Query Attention (GQA) |
| **LIB-703** | **07 Agents** | [LLM Agent Cognitive Architecture & Protocols](07_reinforcement_learning_and_agents/LIB-703%20LLM%20Agent%20Cognitive%20Architecture%20&%20Protocols%20(Agent%20EN).md) | ReAct reasoning loops, Plan-and-Solve, tool use schema, long-term memory |
| **LIB-704** | **07 Agents** | [Dual-Process Neural Agent: S1-Jev & Reflex CUA-S1](07_reinforcement_learning_and_agents/LIB-704%20Dual-Process%20Neural%20Agent%20S1-Jev%20&%20Reflex%20CUA-S1%20(Agent%20EN).md) | Non-autoregressive typed execution (Jev), byte-level interface reflex, gating |
| **LIB-801** | **08 Systems Eng** | [Model Calibration & Uncertainty Estimation](08_ai_systems_engineering/LIB-801%20Model%20Calibration%20&%20Uncertainty%20Estimation%20(Agent%20EN).md) | Expected Calibration Error (ECE), Temperature Scaling, conformal prediction |
| **LIB-802** | **08 Systems Eng** | [Quantization Mathematics & Low-Precision Inference](08_ai_systems_engineering/LIB-802%20Quantization%20Mathematics%20&%20Low-Precision%20Inference%20(Agent%20EN).md) | Affine quantization ($S, Z$), AWQ, GPTQ, INT4/FP8 hardware Tensor Core GEMM |
| **LIB-901** | **09 Methodology** | [Classic Project Post-Mortem: Production MNIST](09_research_methodology/LIB-901%20Classic%20Project%20Post-Mortem%20-%20Production%20MNIST%20(Agent%20EN).md) | End-to-end post-mortem: from toy code to production web deployment |
| **LIB-903** | **09 Methodology** | [Capstone Blueprint & Academic Research Evolution](09_research_methodology/LIB-903%20Capstone%20Blueprint%20&%20Academic%20Research%20Evolution%20(Agent%20EN).md) | NSTC C801 undergraduate proposal blueprint, research paper roadmap |
| **LIB-904** | **09 Methodology** | [Advisor Research Corpus & Lab Synergy](09_research_methodology/LIB-904%20Advisor%20Research%20Corpus%20&%20Lab%20Synergy%20(Agent%20EN).md) | Deep alignment with Prof. Chi-Hung Chuang's lab corpus and NVIDIA DLI compute |

---

## 📜 Academic Citation

```bibtex
@misc{luke2026library,
  author = {Yu, Chi-Yang (Luke) and Antigravity Research Agent},
  title = {CSIE & Deep Learning Grand Library: From First Principles to Production Systems and Agent Protocols},
  year = {2026},
  publisher = {GitHub},
  journal = {GitHub Repository},
  howpublished = {\url{https://github.com/OPluke11-abula/library}}
}
```
