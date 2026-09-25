---
call_number: LIB-203
status: source-verified
invariants_count: 4
title: Computer Architecture & Hardware-Aware Deep Learning (Agent Edition)
module: Systems-Hardware
category: Engineering-Core
audience:
  - Autonomous-Agent
  - Systems-Architect
  - HPC-Engineer
math_foundations:
  - Williams Roofline Arithmetic Intensity Model
  - Little's Law & Concurrency Scaling
  - Cache Coherence & Memory Latency Bounds
hardware_target:
  - NVIDIA Ampere/Hopper/Blackwell (A100/H100/B200)
  - Edge Embedded Systems (NVIDIA Jetson AGX Orin)
created: 2026-09-17
author: Luke
tags:
  - computer-architecture
  - cuda
  - roofline-model
  - memory-hierarchy
  - warp-divergence
prerequisites:
  - "[[LIB-101 Linear Algebra & High-Dimensional Geometry (Agent EN)]]"
successors:
  - "[[LIB-401 DNN Spatial Limits & CNN Inductive Bias (Agent EN)]]"
  - "[[LIB-405 Attention Mechanism & Transformer Revolution (Agent EN)]]"
  - "[[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]]"
  - "[[LIB-602 Modern LLM Architecture & Scaling Laws (Agent EN)]]"
  - "[[LIB-704 Dual-Process Neural Agent S1-Jev & Reflex CUA-S1 (Agent EN)]]"
  - "[[LIB-802 Quantization Mathematics & Low-Precision Inference (Agent EN)]]"
  - "[[LIB-901 Classic Project Post-Mortem - Production MNIST (Agent EN)]]"
---

> 🌐 **Language / 語言**: [🇹🇼 繁體中文 (Traditional Chinese)](../../02_%E8%A8%88%E7%AE%97%E6%A9%9F%E7%B3%BB%E7%B5%B1%E8%88%87%E7%A1%AC%E9%AB%94%E6%9E%B6%E6%A7%8B/LIB-203%20%E8%A8%88%E7%AE%97%E6%A9%9F%E9%AB%94%E7%B3%BB%E7%B5%90%E6%A7%8B%E8%88%87%E6%B7%B1%E5%BA%A6%E5%AD%B8%E7%BF%92%E7%A1%AC%E9%AB%94%E5%B0%8D%E9%BD%8A%20%28Computer%20Architecture%20%26%20Hardware-Aware%20Deep%20Learning%29.md) | 🇺🇸 **English (AI Agent & Research Edition)**

# Computer Architecture & Hardware-Aware Deep Learning

## 1. Conceptual Mental Model

Hardware does not execute mathematical abstraction; it executes physical data movement across wires and registers. In modern deep learning systems, computational FLOPs are virtually free, while **memory transfers are exponentially expensive** in energy and latency. Algorithms that align with the physical memory hierarchy dominate algorithms that minimize theoretical arithmetic operation counts.

---

## 2. Mathematical Formalization: The Roofline Model

Performance of any neural workload is strictly upper-bounded by the Williams Roofline Model:
$$P = \min \left( P_{\text{peak}}, \quad I \times B_{\text{mem}} \right)$$
where:
- $P$: Attainable Performance in TFLOP/s.
- $P_{\text{peak}}$: Peak Hardware Theoretical Compute Capacity (e.g., NVIDIA H100 SXM5 Tensor Core FP16 = 989 TFLOP/s).
- $B_{\text{mem}}$: Peak Memory Bandwidth in TB/s (e.g., H100 HBM3 = 3.35 TB/s).
- $I$: **Arithmetic Intensity** in FLOPs/Byte, defined as:
  $$I = \frac{\text{Total Floating Point Operations (FLOPs)}}{\text{Total DRAM Memory Traffic (Bytes)}}$$

### The Critical Machine Balance
$$\text{Machine Balance } I^* = \frac{P_{\text{peak}}}{B_{\text{mem}}} \approx \frac{989 \times 10^{12}}{3.35 \times 10^{12}} \approx 295.2 \text{ FLOPs/Byte}$$
- If $I < I^*$: The operation is **Memory-Bound**. Arithmetic units remain stalled waiting for DRAM cache lines (e.g., LayerNorm, GeLU, Softmax).
- If $I \ge I^*$: The operation is **Compute-Bound**. GPU execution pipelines are fully saturated (e.g., large-matrix GEMM, Convolution).

---

## 3. GPU Microarchitecture & CUDA Execution Model

### 1. Memory Hierarchy Latency Spectrum
| Memory Level | Typical Size (per GPU) | Latency (Clock Cycles) | Bandwidth |
| :--- | :--- | :--- | :--- |
| **Registers (RF)** | ~256 KB per SM (~20-40 MB total) | ~1 cycle | > 30 TB/s aggregate |
| **Shared Memory (SRAM) / L1** | ~228 KB per SM (~15-30 MB total) | ~20 - 30 cycles | ~15 - 20 TB/s |
| **L2 Cache** | ~50 MB (Ampere) / ~60 MB (Hopper) | ~100 - 200 cycles | ~5 - 12 TB/s |
| **High Bandwidth Memory (HBM3)**| 80 GB - 144 GB | ~400 - 800 cycles | 2.0 - 3.35 TB/s |
| **PCIe Gen 5 Host Transfer** | System DRAM | > 10,000 cycles | 64 GB/s (x16 duplex) |

### 2. The Warp Execution Primitive & Microarchitectural Alignment
On NVIDIA GPUs:
- **Thread Warp**: 32 threads executing concurrently under Single Instruction, Multiple Threads (SIMT).
- **Coalesced Memory Access (32-Byte Sectors)**: Modern NVIDIA architectures utilizing 32-byte memory sectors (e.g., Volta through Hopper/Blackwell) structure 128-byte cache lines into four discrete 32-byte sectors. When 32 threads in a warp access consecutive 4-byte words aligned to a 128-byte boundary, the memory subsystem issues four 32-byte sector transactions to service the warp with near 100% bus utilization. In extreme strided access patterns where each thread requests a 4-byte word landing in a distinct sector, effective bus transaction efficiency can drop to as low as $12.5\%$ ($4\text{ bytes} / 32\text{ bytes}$).
- **Decoupling Layer Sizing from Coalescing**: Layer dimension alignment to multiples of 16/32/64 ($256 \to 128 \to 64 \to 32$) is dictated by **Tensor Core MMA (Matrix Multiply-Accumulate) hardware micro-tile dimensions (e.g., m16n8k16)** and shared memory bank conflict avoidance, NOT global memory coalescing. Global coalescing depends on tensor memory contiguity (`.is_contiguous()`).
- **Host-to-Device Memory Pinning Trade-Offs**: Utilizing `pin_memory=True` locks host memory pages into physical RAM, enabling asynchronous DMA copies via GPU copy engines. However, pinned memory cannot be paged out by the OS virtual memory subsystem; over-allocating pinned RAM across multiple DataLoader workers exhausts host physical RAM and risks host system OOM errors.
- **Warp Divergence Penalty**: If threads within a warp take divergent branches (`if (threadIdx.x % 2 == 0)`), both paths execute serially, reducing compute throughput by up to $50\%$.

---

## 4. Production PyTorch Pin-Memory & CUDA Benchmark Contract

```python
import torch
import time

def benchmark_memory_coalescing(batch_size: int = 4096, dim: int = 1024):
    """
    Demonstrates hardware latency difference between contiguous coalesced
    memory transfers and non-contiguous strided memory access on GPU.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Contiguous tensor aligned to memory
    x_contiguous = torch.randn(batch_size, dim, device=device)
    # Strided non-contiguous tensor
    x_strided = torch.randn(dim, batch_size, device=device).t()
    
    # Warmup
    for _ in range(10):
        _ = x_contiguous.sum(dim=-1)
        _ = x_strided.sum(dim=-1)
    torch.cuda.synchronize()
    
    # Coalesced benchmark
    t0 = time.perf_counter()
    for _ in range(100):
        res1 = x_contiguous.sum(dim=-1)
    torch.cuda.synchronize()
    time_coalesced = (time.perf_counter() - t0) / 100
    
    # Non-coalesced benchmark
    t0 = time.perf_counter()
    for _ in range(100):
        res2 = x_strided.sum(dim=-1)
    torch.cuda.synchronize()
    time_strided = (time.perf_counter() - t0) / 100
    
    return {"coalesced_ms": time_coalesced * 1000, "strided_ms": time_strided * 1000}
```

---

## 5. Agent Invariants & Decision Protocols

### [RULE-203-01] Layer Sizing & Tensor Core Alignment Invariant
- **Contract Level**: `OPTIMIZATION_HEURISTIC`
- **Specification**: Dense layer widths (`nn.Linear`), convolutional channel counts, and Transformer hidden dimensions $d_{\text{model}}$ SHOULD be configured as multiples of 8, 16 (for FP16/BF16), or 32 (for INT8/FP8) [OPTIMIZATION_HEURISTIC] to align with Tensor Core MMA micro-tiles and cuBLAS GEMM partitioning. Layer dimension alignment is distinct from global memory coalescing (which depends on physical tensor contiguity); dimension alignment benefits shared memory tiling and avoids boundary warp lane masking depending on the specific GPU architecture, kernel implementation, and data precision.
- **Violation Consequence**: Misaligned layer dimensions may cause GEMM kernels to fall back to non-Tensor-Core execution or apply boundary masking, incurring throughput penalties.

### [RULE-203-02] Batch Sizing & Throughput Optimization Guardrail
- **Contract Level**: `HIGH_INVARIANT`
- **Specification**: Batch sizes $B$ in DataLoader configurations SHOULD be chosen to balance GPU VRAM capacity, gradient variance, and kernel launch saturation [OPTIMIZATION_HEURISTIC]. Multiples of 8, 16, or 32 are recommended to facilitate tile partitioning in GEMM/convolution kernels. Batch size does not directly dictate warp thread counts, and odd batch sizes do not inherently induce warp divergence; configuring batch sizes aligned to multiples of 8, 16, or 32 facilitates GEMM tile partitioning and thread block scheduling to improve compute saturation.
- **Violation Consequence**: Arbitrary or sub-optimal batch sizes underutilize memory bandwidth and fail to saturate Streaming Multiprocessors.

### [RULE-203-03] Memory Layout Channels-Last Invariant
- **Contract Level**: `OPTIMIZATION_HEURISTIC`
- **Specification**: 2D vision models deployed on modern NVIDIA architectures (Ampere, Ada, Hopper) SHOULD utilize the Channels-Last memory format (`torch.channels_last` / NHWC) where supported as a workload-dependent optimization.
- **Violation Consequence**: Operating in default NCHW format requires runtime memory transposition inside cuDNN Tensor Core convolution kernels, introducing unnecessary bandwidth overhead.

### [RULE-203-04] TensorRT Layer Fusion & Compilation Invariant
- **Contract Level**: `OPTIMIZATION_HEURISTIC`
- **Specification**: Production inference pipelines deployed on NVIDIA GPUs with strict latency and throughput SLAs SHOULD undergo graph optimization via TensorRT [OPTIMIZATION_HEURISTIC], enforcing vertical kernel fusion ($\text{Conv} + \text{Bias} + \text{ReLU}$) and horizontal GEMM fusion where supported by the target environment.
- **Violation Consequence**: Operating without kernel fusion writes intermediate activation tensors to DRAM between successive layers, increasing memory bandwidth pressure and latency.

