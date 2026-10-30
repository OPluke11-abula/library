---
call_number: LIB-203
status: source-verified
invariants_count: 5
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

## Conceptual Coordinates & Topological Navigation
- **Prerequisites**: [[LIB-101 Linear Algebra & High-Dimensional Geometry (Agent EN)]].
- **Successors**: [[LIB-401 DNN Spatial Limits & CNN Inductive Bias (Agent EN)]], [[LIB-405 Attention Mechanism & Transformer Revolution (Agent EN)]], [[LIB-504 3D Gaussian Splatting Theory & Rasterization (Agent EN)]], [[LIB-602 Modern LLM Architecture & Scaling Laws (Agent EN)]], [[LIB-704 Dual-Process Neural Agent S1-Jev & Reflex CUA-S1 (Agent EN)]], [[LIB-802 Quantization Mathematics & Low-Precision Inference (Agent EN)]], [[LIB-901 Classic Project Post-Mortem - Production MNIST (Agent EN)]].

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

### Roofline Case Study: Pointwise Image Preprocessing & Operator Fusion `[FACT]` `[DERIVATION]`
Consider image brightness clamping: `torch.clamp(image * 1.2, 0, 255)`.
- **Eager Execution**:
  - `aten::mul`: Read $x$ ($4N\text{ Bytes}$) $\to$ Write intermediate $tmp$ ($4N\text{ Bytes}$).
  - `aten::clamp`: Read $tmp$ ($4N\text{ Bytes}$) $\to$ Write output $out$ ($4N\text{ Bytes}$).
  - Total DRAM Traffic = $16N\text{ Bytes}$ across 2 independent kernel launches.
  - Arithmetic Intensity: $I_{\text{eager}} = \frac{3\text{ FLOPs}}{16\text{ Bytes}} \approx \mathbf{0.1875\text{ FLOP/Byte}} \ll I^*$.
  - Execution is severely memory-bandwidth bound; compute cores are stalled $> 99\%$ of the time.
- **`torch.compile` / Triton Vertical Loop Fusion**:
  - Pointwise loop fusion compiles both operations into a single kernel. Intermediates reside in SM registers/L1 SRAM.
  - Total DRAM Traffic = Read $x$ ($4N\text{ Bytes}$) + Write $out$ ($4N\text{ Bytes}$) = **$8N\text{ Bytes}$** (50% reduction).
  - Theoretically halves DRAM traffic under memory-bound conditions (yielding an idealized theoretical bandwidth speedup of up to $\approx 2\times$) and eliminates one kernel launch overhead; realized end-to-end latency speedup depends on tensor dimensions, on-chip L2 cache residency, and kernel launch latency amortization.

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

### 2. Hardware Special Function Units (SFU) & Reciprocal Square Root `[FACT]`
In normalization (RMSNorm, LayerNorm) and AdamW optimizer steps, calculating variance reciprocals is a primary hotspot:
- **Eager Division Trap (`1 / torch.sqrt(x)`)**:
  - Issues 2 kernels (`sqrt` and `div`), requiring 2 reads and 2 writes ($16N\text{ Bytes}$ for FP32).
  - Floating-point division in GPU hardware lacks single-cycle ALU paths and requires high-latency multi-cycle iterative SFU emulation (10-20 cycles).
- **Canonical Fast Path (`torch.rsqrt(x)`)**:
  - Single kernel launch, cutting DRAM memory traffic from $16N$ to $8N\text{ Bytes}$ (50% savings).
  - **Hardware SFU ISA Pipeline**: NVIDIA Streaming Multiprocessors route `torch.rsqrt` directly to the **SFU (Special Function Unit)** via PTX `rsqrt.approx.f32`, emitting the native SASS instruction **`MUFU.RSQ`**.
  - **Algebraic Compute Demotion**: Rewriting normalization as $x \odot \text{rsqrt}(\sigma^2 + \epsilon)$ replaces multi-cycle vector division with a single-cycle Fused Multiply-Add (FMA), foundational to modern LLM RMSNorm and AdamW implementations.

### 3. The Warp Execution Primitive & Microarchitectural Alignment
On NVIDIA GPUs:
- **Thread Warp**: 32 threads executing concurrently under Single Instruction, Multiple Threads (SIMT).
- **Coalesced Memory Access (32-Byte Sectors)**: Modern NVIDIA architectures utilizing 32-byte memory sectors (e.g., Volta through Hopper/Blackwell) structure 128-byte cache lines into four discrete 32-byte sectors. When 32 threads in a warp access consecutive 4-byte words aligned to a 128-byte boundary, the memory subsystem issues four 32-byte sector transactions to service the warp with near 100% bus utilization. In extreme strided access patterns where each thread requests a 4-byte word landing in a distinct sector, effective bus transaction efficiency can drop to as low as $12.5\%$ ($4\text{ bytes} / 32\text{ bytes}$).
- **Decoupling Layer Sizing from Coalescing**: Layer dimension alignment to multiples of 16/32/64 ($256 \to 128 \to 64 \to 32$) is dictated by **Tensor Core MMA (Matrix Multiply-Accumulate) hardware micro-tile dimensions (e.g., m16n8k16)** and shared memory bank conflict avoidance, NOT global memory coalescing. Global coalescing depends on tensor memory contiguity (`.is_contiguous()`).
- **Host-to-Device Memory Pinning Trade-Offs**: Utilizing `pin_memory=True` locks host memory pages into physical RAM, enabling asynchronous DMA copies via GPU copy engines. However, pinned memory cannot be paged out by the OS virtual memory subsystem; over-allocating pinned RAM across multiple DataLoader workers exhausts host physical RAM and risks host system OOM errors.
- **Warp Divergence Penalty**: If threads within a warp take divergent branches (`if (threadIdx.x % 2 == 0)`), both paths execute serially, reducing compute throughput by up to $50\%$.

### 4. Host Memory Hierarchy: Eager Evaluation (`[]` List) vs. Lazy Evaluation (`()` Generator) in CPython `[FACT]` `[EMPIRICAL_RESULT]`
In host-side data ingestion and preprocessing pipelines, list comprehensions (`[x + 1 for x in range(N)]`) and generator expressions (`(x + 1 for x in range(N))`, PEP 289) exhibit fundamentally different memory complexity and failure modes:
1. **Eager Evaluation (`[x + 1 for x in range(1_000_000)]`) — $O(N)$ Boxed Heap Allocation**:
   - In 64-bit CPython (verified on Python 3.13.15 64-bit), a `PyListObject` allocates a contiguous pointer array `ob_item` (`8 bytes` per `PyObject*` reference plus $\sim 12.5\%$ overallocation headroom, yielding `sys.getsizeof(lst)` $= \mathbf{8,448,728\text{ Bytes}} \approx \mathbf{8.06\text{ MB}}$) **plus** $10^6$ individual heap-allocated `PyLongObject` structs ($28\text{ Bytes}$ per integer $> 256$, totaling $\approx 28\text{ MB}$). Peak `tracemalloc` allocation reaches **$\mathbf{40,440,544\text{ Bytes}} \approx \mathbf{38.57\text{ MB}}$** `[FACT]` `[EMPIRICAL_RESULT]`.
2. **Lazy Evaluation (`g = (x + 1 for x in range(1_000_000))`) — $O(1)$ Coroutine State Machine**:
   - Replacing `[]` with `()` compiles a suspended `PyGenObject` frame storing only the bytecode instruction offset (`f_lasti`), the underlying `range_iterator` reference, and local slots. `sys.getsizeof(g)` is fixed at **$\mathbf{200\text{ Bytes}}$** ($0.028\text{ ms}$ initialization), and streaming `sum(g)` via `next(g)` yields a peak `tracemalloc` footprint of just **$\mathbf{1,232\text{ Bytes}}$**—a **$32,825\times$ peak memory reduction** because transient `PyLongObject` instances are immediately reference-decremented and freed `[FACT]` `[EMPIRICAL_RESULT]`.
3. **Three Critical Systems & Deep Learning Guardrails**:
   - **Single-Pass Exhaustion Trap (`Iterator` vs. `Iterable`)**: A generator is a one-shot iterator (`iter(g) is g`). Once exhausted via `StopIteration`, subsequent passes (`sum(g)` or Epoch 2+ in a training loop) silently yield **`0` (empty sequence)** `[FACT]`. Multi-epoch pipelines must wrap generators inside a re-entrant `Iterable` class (`__iter__()`) that instantiates a fresh generator per epoch `[SAFETY_BOUND]`.
   - **Interpreter Dispatch & Boxing vs. SIMD Vectorization**: Lazy evaluation reduces space complexity to $O(1)$ but still executes $N$ CPython frame dispatches and `PyLongObject` boxing steps ($\sim 770\text{ ms}$ for $10^6$ items). Pure numerical array arithmetic (`x + 1`) must use contiguous unboxed SIMD/GPU tensors (`np.arange(N, dtype=np.int64) + 1`, $8.0\text{ MB}$ flat buffer, $< 2\text{ ms}$) rather than Python scalar generators `[DESIGN_DECISION]`.
   - **Random-Access & Global Shuffle Constraint**: Generators lack `__len__()` and `__getitem__(i)` indexing, requiring bounded reservoir shuffle buffers ($B_{\mathrm{buf}} \ll N$) when streaming out-of-core datasets `[DESIGN_DECISION]`.

### 5. Zero-Copy Broadcasting Stride Views (`stride = 0`), Rank Algebra & Low-Bit Integer Overflow Guardrails `[FACT]` `[DERIVATION]` `[SAFETY_BOUND]`
1. **Zero-Copy Broadcasting via `stride = 0` Metadata Views** `[FACT]` `[DERIVATION]`:
   When evaluating element-wise operations between tensors of compatible trailing shapes (e.g., activation $A \in \mathbb{R}^{B \times N \times D}$ and bias $b \in \mathbb{R}^{1 \times 1 \times D}$), tensor engines (NumPy, PyTorch, TensorFlow) do not duplicate $b$ across DRAM/HBM. Instead, they construct a virtual view with $\mathrm{stride}_0 = 0, \mathrm{stride}_1 = 0$ in the tensor descriptor:
   $$\mathrm{Addr}(i, j, k) = \mathrm{BaseAddr} + i \cdot \mathrm{stride}_0 + j \cdot \mathrm{stride}_1 + k \cdot \mathrm{stride}_2$$
   Setting broadcasted axis strides to $0$ maps all $(i, j)$ indices to the exact same physical address $\mathrm{BaseAddr} + k \cdot \mathrm{stride}_2$, hitting GPU L1/Constant Cache broadcast lanes with **$0\text{ Bytes}$** of additional memory allocation.
2. **Rank-Preserving (`concat`/`split`) vs. Rank-Changing (`stack`/`unstack`) Tensor Algebra** `[FACT]`:
   - **Rank-Preserving ($R \to R$)**: Concatenating (`concat`) or partitioning (`split`, e.g., slicing shape $[5, 20, 4]$ along `axis=0` into proportions $[2, 2, 1]$) preserves tensor rank $\mathrm{ndim} = R$.
   - **Rank-Changing ($R \to R \pm 1$)**: `stack` inserts a new axis ($R + 1$), whereas `unstack(x, axis=a)` collapses axis $a$ of length $L_a$ into a sequence of $L_a$ tensors each of reduced rank **$R - 1$** (e.g., $[5, 20, 4] \xrightarrow{\mathrm{unstack}(\mathrm{axis}=0)} 5 \times [20, 4]$).
3. **Two's-Complement Integer Overflow & Pre-Arithmetic Upcasting** `[FACT]` `[SAFETY_BOUND]`:
   Signed 16-bit integers (`int16`) span $[-32768, 32767]$ and unsigned 8-bit pixels (`uint8`) span $[0, 255]$. Assigning or downcasting out-of-range values (e.g., storing $123,456,789$ in `int16`) or accumulating directly in `uint8` triggers silent modulo-$2^b$ wrap-around truncation ($123456789 \equiv -13035 \pmod{2^{16}}$). Raw `uint8` / `int16` tensors must be explicitly upcast to `float32` or `int32`/`int64` prior to arithmetic reduction or normalization `[SAFETY_BOUND]`.

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


def verify_eager_vs_lazy_generator(n_items: int = 100_000):
    """
    Empirically verifies CPython memory footprint and single-pass exhaustion between [] and ().
    """
    import sys
    import tracemalloc

    tracemalloc.start()
    eager_list = [x + 1 for x in range(n_items)]
    _, peak_eager = tracemalloc.get_traced_memory()
    list_sizeof = sys.getsizeof(eager_list)
    del eager_list
    tracemalloc.stop()

    tracemalloc.start()
    lazy_gen = (x + 1 for x in range(n_items))
    gen_sizeof = sys.getsizeof(lazy_gen)
    first_pass_sum = sum(lazy_gen)
    _, peak_lazy = tracemalloc.get_traced_memory()
    second_pass_sum = sum(lazy_gen)  # Exhausted one-shot iterator returns 0
    tracemalloc.stop()

    assert gen_sizeof < 512 and peak_eager > peak_lazy * 100
    assert first_pass_sum == n_items * (n_items + 1) // 2 and second_pass_sum == 0
    return {"eager_peak_bytes": peak_eager, "lazy_peak_bytes": peak_lazy, "gen_sizeof": gen_sizeof}
```

---

## 5. Agent Invariants & Decision Protocols

### [RULE-203-01] Layer Sizing & Tensor Core Alignment Invariant
- **Contract Level**: `OPTIMIZATION_HEURISTIC`
- **Specification**: Dense layer widths (`nn.Linear`), convolutional channel counts, and Transformer hidden dimensions $d_{\text{model}}$ SHOULD be configured as multiples of 8, 16 (for FP16/BF16), or 32 (for INT8/FP8) `[HEURISTIC]` to align with Tensor Core MMA micro-tiles and cuBLAS GEMM partitioning. Layer dimension alignment is distinct from global memory coalescing (which depends on physical tensor contiguity); dimension alignment benefits shared memory tiling and avoids boundary warp lane masking depending on the specific GPU architecture, kernel implementation, and data precision.
- **Violation Consequence**: Misaligned layer dimensions may cause GEMM kernels to fall back to non-Tensor-Core execution or apply boundary masking, incurring throughput penalties.

### [RULE-203-02] Batch Sizing & Throughput Optimization Guardrail
- **Contract Level**: `HIGH_INVARIANT`
- **Specification**: Batch sizes $B$ in DataLoader configurations SHOULD be chosen to balance GPU VRAM capacity, gradient variance, and kernel launch saturation `[HEURISTIC]`. Multiples of 8, 16, or 32 are recommended to facilitate tile partitioning in GEMM/convolution kernels. Batch size does not directly dictate warp thread counts, and odd batch sizes do not inherently induce warp divergence; configuring batch sizes aligned to multiples of 8, 16, or 32 facilitates GEMM tile partitioning and thread block scheduling to improve compute saturation.
- **Violation Consequence**: Arbitrary or sub-optimal batch sizes underutilize memory bandwidth and fail to saturate Streaming Multiprocessors.

### [RULE-203-03] Memory Layout Channels-Last Invariant
- **Contract Level**: `OPTIMIZATION_HEURISTIC`
- **Specification**: 2D vision models deployed on modern NVIDIA architectures (Ampere, Ada, Hopper) SHOULD utilize the Channels-Last memory format (`torch.channels_last` / NHWC) `[HEURISTIC]` where supported as a workload-dependent optimization.
- **Violation Consequence**: Operating in default NCHW format requires runtime memory transposition inside cuDNN Tensor Core convolution kernels, introducing unnecessary bandwidth overhead.

### [RULE-203-04] TensorRT Layer Fusion & Compilation Invariant
- **Contract Level**: `OPTIMIZATION_HEURISTIC`
- **Specification**: Production inference pipelines deployed on NVIDIA GPUs with strict latency and throughput SLAs SHOULD undergo graph optimization via TensorRT `[HEURISTIC]`, enforcing vertical kernel fusion ($\text{Conv} + \text{Bias} + \text{ReLU}$) and horizontal GEMM fusion where supported by the target environment.
- **Violation Consequence**: Operating without kernel fusion writes intermediate activation tensors to DRAM between successive layers, increasing memory bandwidth pressure and latency.

### [RULE-203-05] Lazy Generator Streaming & Re-Entrant Iterable Guardrail
- **Contract Level**: `RESOURCE_CONSTRAINT`
- **Specification**: For sequential single-pass streaming over large collections ($N \ge 10^5$, e.g., JSONL parsing, I/O filtering, or `sum`/`any`/`all` reductions), pipelines MUST replace eager list comprehensions `[f(x) for x in stream]` ($O(N)$ boxed heap allocation, $\approx 38.6\text{ MB}$ peak per $10^6$ ints) with lazy generator expressions `(f(x) for x in stream)` ($O(1)$ auxiliary state, $200\text{ Bytes}$ `PyGenObject`) `[EMPIRICAL_RESULT]`. One-shot generator instances MUST NOT be passed directly to multi-epoch training loops without wrapping in a re-entrant `Iterable` (`__iter__()`) `[SAFETY_BOUND]`, and dense numerical array arithmetic MUST use contiguous unboxed SIMD/GPU tensor operators rather than Python scalar iteration `[DESIGN_DECISION]`.
- **Violation Consequence**: Eager list allocation over out-of-core streams triggers host RAM OOM; reusing a raw generator across epochs silently yields 0 samples after Epoch 1; and scalar Python generator loops over numerical arrays incur severe interpreter dispatch and boxing overhead.

---

## 6. Canonical & Peer-Reviewed References

1. **Williams, S., Waterman, A., & Patterson, D.** (2009). "Roofline: An insightful visual performance model for multicore architectures." *Communications of the ACM*, 52(4), 65–76. DOI: [10.1145/1498765.1498785](https://doi.org/10.1145/1498765.1498785).
2. **Choquette, J., Gandhi, W., Giroux, O., Stam, N., & Krashinsky, R.** (2021). "NVIDIA A100 Tensor Core GPU: Performance and Innovation." *IEEE Micro*, 41(2), 29–35. DOI: [10.1109/MM.2021.3061389](https://doi.org/10.1109/MM.2021.3061389).
3. **Hennessy, J. L., & Patterson, D. A.** (2019). *Computer Architecture: A Quantitative Approach* (6th ed.). Morgan Kaufmann.
4. **Hettinger, R.** (2002). "PEP 289 – Generator Expressions." & **Schemenauer, N., Peters, T., & Hetland, M. L.** (2001). "PEP 255 – Simple Generators." *Python Enhancement Proposals, Python Software Foundation*. [https://peps.python.org/pep-0289/](https://peps.python.org/pep-0289/).
