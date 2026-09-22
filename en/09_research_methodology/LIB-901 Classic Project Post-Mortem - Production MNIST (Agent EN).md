---
call_number: LIB-901
title: Classic Project Post-Mortem - From Class Assignment to Production MNIST System (Agent Edition)
module: Empirical-PostMortem
category: Methodology-Practice
audience:
  - Autonomous-Agent
  - Senior-ML-Engineer
  - Capstone-Student
status: Verified-Authoritative-Production
math_foundations:
  - Empirical Error Distribution Tracking
  - Real-World Production Degradation Analysis
  - Full-Stack Architecture Transitions
hardware_target:
  - Local GPU Development Workstation to Web Serving
invariants_count: 5
created: 2026-09-17
author: Luke
prerequisites:
  - "[[LIB-001 Deep Learning First Principles (Agent EN)]]"
  - "[[LIB-501 CV Preprocessing & Center of Mass Alignment (Agent EN)]]"
  - "[[LIB-801 Model Calibration & Uncertainty Estimation (Agent EN)]]"
successors:
  - "[[LIB-903 Capstone Blueprint & Academic Research Evolution (Agent EN)]]"
tags:
  - post-mortem
  - production-deployment
  - mnist-case-study
  - gradio
  - tensorrt
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../09_%E7%A7%91%E7%A0%94%E6%96%B9%E6%B3%95%E8%AB%96%E8%88%87%E9%A0%82%E5%B0%96%E5%B0%88%E9%A1%8C%E8%97%8D%E5%9C%96/LIB-901%20%E7%B6%93%E5%85%B8%E5%B0%88%E6%A1%88%E5%AF%A6%E8%AD%89%E5%BE%A9%E7%9B%A4%EF%BC%9A%E5%BE%9E%E8%AA%B2%E5%A0%82%E4%BD%9C%E6%A5%AD%E5%88%B0%E7%94%9F%E7%94%A2%E7%B4%9A%20MNIST%20%E6%89%8B%E5%AF%AB%E8%BE%A8%E8%AD%98%E7%B3%BB%E7%B5%B1%20%28Classic%20Project%20Post-Mortem%20-%20From%20Class%20Assignment%20to%20Production%20MNIST%20System%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Classic Project Post-Mortem: Evolving MNIST from Homework to Production

## 1. Conceptual Mental Model

Most university machine learning courses end with `model.fit(X_train, y_train)` in a Jupyter Notebook, producing an artificial $98\%$ validation accuracy score. In production, however, this represents less than $10\%$ of the complete engineering lifecycle. This case study documents the **six-stage empirical evolution of the canonical MNIST project**, showing how real-world distribution shifts (such as Asian handwriting styles), calibration failures, hardware bottlenecks, and serving requirements force an end-to-end architectural overhaul.

---

## 2. The Six Evolutionary Stages of the System

```
[Stage 1: Naive Notebook] ──(Fails on Asian 7)──> [Stage 2: Real Data Failure]
                                                           │
                                             (LeCun Bounding Box + CoM)
                                                           ▼
[Stage 4: PyTorch Refactor] <──(Overconfidence)── [Stage 3: CV Pipeline & ECE]
             │
   (ONNX / TensorRT)
             ▼
[Stage 5: High-Speed Engine] ──(Interactive UI)──> [Stage 6: Gradio Production Web]
```

### Stage 1: Naive Classroom Notebook
- **Architecture**: 3-layer Dense MLP (`784 -> 128 -> 10`) trained in Jupyter.
- **Flaw**: Flattens spatial 2D grid, ignores translation equivariance, brittle to boundary noise.

### Stage 2: Real-World Distribution Collapse
- **Failure Mode**: When real users test live hand-drawn digits on a canvas, the model misclassifies straight vertical "7" as "1" with $> 99\%$ confidence.
- **Root Cause Analysis**: MNIST dataset training distribution consists of US Census data with slanted/crossed strokes. Straight vertical lines project directly into digit "1" feature clusters.

### Stage 3: Computer Vision Pipeline & Temperature Calibration
- **Intervention 1**: Implement LeCun-compliant OpenCV preprocessing (LIB-501): tight bounding box, aspect-ratio preserved scaling to $20 \times 20$, subpixel Center of Mass shift to $(13.5, 13.5)$.
- **Intervention 2**: Temperature scaling ($T = 1.42$) to deflate spurious overconfidence (LIB-801). Real-world accuracy jumps from $38\%$ to $94\%$.

### Stage 4: Production PyTorch Modular Architecture
- **Refactoring**: Migrate from messy notebook scripts to a modular software repository:
  - `src/models/`: Canonical CNN backbones with batch normalization.
  - `src/data/`: Memory-mapped data loaders with data augmentation.
  - `src/engine/`: Mixed-precision training loops with gradient clipping.

### Stage 5: ONNX Export & TensorRT Acceleration
- Export model graph to ONNX (`opset_version=17`).
- Compile TensorRT engine with FP16 precision: latency drops from $14.2\text{ms}$ (PyTorch GPU) to $0.82\text{ms}$ (TensorRT FP16), enabling $1200+$ requests/second throughput.

### Stage 6: Full-Stack Interactive Web Serving
- Implement real-time Gradio sketchpad frontend with bidirectional REST API.
- Live probability distribution bar chart with ECE uncertainty warnings when confidence $< 0.70$.

---

## 3. Production Serving Contract

```python
import torch
import numpy as np

class ProductionMNISTEngine:
    """
    End-to-end production inference pipeline with CV preprocessing and calibration.
    """
    def __init__(self, model: torch.nn.Module, temperature: float = 1.42):
        self.model = model
        self.model.eval()
        self.temperature = temperature

    @torch.no_grad()
    def predict(self, raw_canvas_image: np.ndarray) -> dict:
        # 1. Computer Vision Preprocessing (LIB-501)
        # tensor: [1, 1, 28, 28] float32 in [0, 1]
        tensor = preprocess_canvas_digit(raw_canvas_image)
        
        # 2. Forward inference (LIB-401)
        logits = self.model(tensor)
        
        # 3. Temperature Scaling Calibration (LIB-801)
        calibrated_logits = logits / self.temperature
        probs = torch.softmax(calibrated_logits, dim=-1)[0]
        
        confidence, predicted_class = torch.max(probs, dim=-1)
        
        return {
            "predicted_digit": int(predicted_class.item()),
            "confidence": float(confidence.item()),
            "probabilities": {str(i): float(probs[i].item()) for i in range(10)},
            "warning": "High Uncertainty" if confidence < 0.70 else "Normal"
        }
```

---

## 4. Agent Invariants & Decision Protocols

- `INV-901-01 (End-to-End Pipeline Cohesion)`: Inference serving MUST link the input preprocessing stage (LIB-501), model backbone (LIB-401), and calibration module (LIB-801) into an atomic, tested pipeline.
- `INV-901-02 (Zero Uncalibrated Predictions)`: Production endpoints MUST NOT expose raw uncalibrated Softmax probabilities directly to end users.
- `INV-901-03 (Edge-Case Fallback)`: If total ink mass $m_{00} < 10^{-4}$ (blank canvas), the inference pipeline MUST return an error code immediately without invoking GPU forward passes.
