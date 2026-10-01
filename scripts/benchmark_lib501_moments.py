#!/usr/bin/env python3
"""
Benchmark script for LIB-501: Center of Mass Moment Calculation.
Measures performance across:
1. Pure Python nested loops accessing NumPy array (scalar indexing & boxing overhead)
2. Pure Python nested loops accessing native Python list
3. NumPy vectorized calculation with precomputed coordinate grids (SIMD)
"""

import timeit
import platform
import json
import sys

def run_benchmark(num_iterations=5000, img_size=(28, 28)):
    try:
        import numpy as np
    except ImportError:
        print("Error: NumPy is required for this benchmark. Run with 'uv run --with numpy python scripts/benchmark_lib501_moments.py'")
        sys.exit(1)

    np.random.seed(42)
    h, w = img_size
    img_np = np.random.rand(h, w).astype(np.float32)
    img_list = img_np.tolist()

    # Precomputed grid
    y_grid, x_grid = np.indices((h, w), dtype=np.float32)

    # 1. Python loop indexing NumPy array
    def loop_numpy_element(im):
        m00, m10, m01 = 0.0, 0.0, 0.0
        for y in range(h):
            for x in range(w):
                val = float(im[y, x])
                m00 += val
                m10 += x * val
                m01 += y * val
        return m00, m10, m01

    # 2. Python loop indexing Python nested list
    def loop_python_list(im):
        m00, m10, m01 = 0.0, 0.0, 0.0
        for y in range(h):
            for x in range(w):
                val = im[y][x]
                m00 += val
                m10 += x * val
                m01 += y * val
        return m00, m10, m01

    # 3. NumPy vectorized precomputed
    def numpy_vectorized(im):
        m00 = float(np.sum(im))
        m10 = float(np.sum(x_grid * im))
        m01 = float(np.sum(y_grid * im))
        return m00, m10, m01

    # Warmup
    for _ in range(200):
        _ = loop_numpy_element(img_np)
        _ = loop_python_list(img_list)
        _ = numpy_vectorized(img_np)

    # Timing
    t_loop_np = timeit.timeit(lambda: loop_numpy_element(img_np), number=num_iterations) / num_iterations * 1000
    t_loop_list = timeit.timeit(lambda: loop_python_list(img_list), number=num_iterations) / num_iterations * 1000
    t_np_vec = timeit.timeit(lambda: numpy_vectorized(img_np), number=num_iterations) / num_iterations * 1000

    results = {
        "platform": platform.platform(),
        "python_version": platform.python_version(),
        "processor": platform.processor(),
        "image_size": list(img_size),
        "iterations": num_iterations,
        "timings_ms": {
            "python_loop_numpy_index": round(t_loop_np, 4),
            "python_loop_native_list": round(t_loop_list, 4),
            "numpy_vectorized_simd": round(t_np_vec, 4),
        },
        "speedups": {
            "vectorized_vs_numpy_loop": round(t_loop_np / t_np_vec, 2),
            "vectorized_vs_native_list": round(t_loop_list / t_np_vec, 2),
        }
    }

    print("=== LIB-501 Moment Benchmark Results ===")
    print(f"Platform:       {results['platform']}")
    print(f"Python:         {results['python_version']}")
    print(f"Processor:      {results['processor']}")
    print(f"Image Dimensions: {w}x{h} ({w*h} elements)")
    print(f"Iterations:     {num_iterations}")
    print("-" * 55)
    print(f"1. Python Loop over NumPy:     {results['timings_ms']['python_loop_numpy_index']:.4f} ms")
    print(f"2. Python Loop over PyList:    {results['timings_ms']['python_loop_native_list']:.4f} ms")
    print(f"3. NumPy Vectorized (AVX SIMD): {results['timings_ms']['numpy_vectorized_simd']:.4f} ms")
    print("-" * 55)
    print(f"Speedup (Vectorized vs NumPy Loop): {results['speedups']['vectorized_vs_numpy_loop']:.1f}x")
    print(f"Speedup (Vectorized vs PyList):    {results['speedups']['vectorized_vs_native_list']:.1f}x")
    
    return results

if __name__ == "__main__":
    run_benchmark()
