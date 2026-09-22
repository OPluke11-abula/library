---
call_number: LIB-602
title: 現代大語言模型架構解剖與縮放定律 (Modern LLM Architecture & Scaling Laws)
module: NLP-Large-Language-Models
category: LLM-Architecture
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
status: Verified-Authoritative-Production
math_foundations:
  - Chinchilla Compute-Optimal Frontier (N_opt, D_opt)
  - RMSNorm Scale-Invariance Mathematics
  - SwiGLU Gated Activation Representation Capacity
  - Grouped-Query Attention (GQA) Memory Complexity
hardware_target:
  - PagedAttention Virtual Memory Block Table
  - KV Cache High-Bandwidth Memory (HBM) Footprint
invariants_count: 3
created: 2026-09-17
author: 游啓揚 (Luke, 資訊三乙, 11327229) & AI Research Agent (Antigravity)
prerequisites:
  - "[[LIB-104 凸最佳化理論與一階二階梯度下降幾何 (Optimization Theory & Gradient Descent)]]"
  - "[[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]"
  - "[[LIB-405 注意力機制、Transformer 革命與位置編碼幾何 (Attention Mechanism & Transformer Revolution)]]"
successors:
  - "[[LIB-703 現代大模型代理人 (LLM Agent) 認知架構與推論協議 (LLM Agent Cognitive Architecture & Protocols)]]"
  - "[[LIB-802 現代深度學習模型量化理論與低精度推論架構 (Quantization Mathematics & Low-Precision Inference)]]"
tags:
  - 圖書館
  - 自然語言處理
  - LLM
  - 縮放定律
  - Chinchilla
  - PagedAttention
  - GQA
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/06_nlp_and_llms/LIB-602%20Modern%20LLM%20Architecture%20%26%20Scaling%20Laws%20%28Agent%20EN%29.md)

# 現代大語言模型架構解剖與縮放定律 (Modern LLM Architecture & Scaling Laws)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-101 線性代數與高維幾何變換本質 (Linear Algebra & High-Dimensional Geometry)]]、[[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]、[[LIB-405 注意力機制、Transformer 革命與位置編碼幾何 (Attention Mechanism & Transformer Revolution)]]。
- **後續節點**：[[LIB-703 現代大模型代理人 (LLM Agent) 認知架構與推論協議 (LLM Agent Cognitive Architecture & Protocols)]]、[[LIB-802 現代深度學習模型量化理論與低精度推論架構 (Quantization Mathematics & Low-Precision Inference)]]。
- **權威期刊/會議文獻出處**：
  - Kaplan et al. (arXiv 2020) *Scaling Laws for Neural Language Models*.
  - Hoffmann et al. (DeepMind, NeurIPS 2022) *Training Compute-Optimal Large Language Models (Chinchilla)*.
  - Zhang & Sennrich (NeurIPS 2019) *Root Mean Square Layer Normalization (RMSNorm)*.
  - Shazeer (arXiv 2020) *GLU Variants Improve Transformer (SwiGLU)*.
  - Ainslie et al. (Google Research, EMNLP 2023) *GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints*.
  - Touvron et al. (Meta AI, 2023 / 2024) *LLaMA 1/2/3: Open and Efficient Foundation Language Models*.
  - Kwon et al. (UC Berkeley, SOSP 2023) *Efficient Memory Management for Large Language Model Serving with PagedAttention (vLLM)*.

---

## 一、💡 學士直觀心智模型：現代大腦的解剖學與算力營養學

自從 2017 年經典 Transformer 發表以來，以 LLaMA 3、Mistral、Gemma 為代表的現代開源大語言模型，早已不再使用最初的原始設計。整個架構經過了數輪由硬體物理特性所驅動的「工程進化」：

### 1. 算力營養學：Chinchilla 縮放定律 (Scaling Laws)
想像你在培養一位奧運數學選手：
- **模型參數量 ($N$)**：相當於學生的**大腦腦容量**。
- **訓練 Token 數量 ($D$)**：相當於學生做過的**練習題庫總量**。
- **算力預算 ($C$)**：你買給他的營養品總經費。
- **歷史誤區 (Kaplan 2020)**：早期的研究認為「腦容量越大越好」，導致業界訓練了許多參數量極大但只讀過少量資料的「巨大卻飢餓」的模型（如 175B 的 GPT-3 只讀了 300B Tokens）。
- **Chinchilla 的頓悟 (Hoffmann 2022)**：DeepMind 嚴格證明，給一個巨大的腦袋配太少題目是嚴重的資源浪費！**腦容量與題庫量應當以 1:1 的比例等速擴張**。對於 7B 參數的模型，至少需要餵食 140B ~ 1.4T Tokens 才能達到最優智力。

### 2. 現代大腦的三大手術：RMSNorm、SwiGLU 與 GQA
- **手術一：RMSNorm（切除昂貴的均值計算）**：傳統 LayerNorm 每次都要算均值 $\mu$ 再減去，浪費兩次記憶體讀寫。RMSNorm 發現只要保留方差（RMS）縮放，效果完全不變，推論加速 15%！
- **手術二：SwiGLU（靈巧門控通道）**：前饋網路不再是死板的線性變換，而是引入一組「開關通道」（Gating），像閥門一樣動態篩選關鍵資訊。
- **手術三：GQA（KV Cache 減重術）**：多個注意力頭共用同一組 Key/Value 快取，將推論顯存佔用直接砍掉 75%~87.5%，讓消費級顯卡也能跑百億大模型！

---

## 二、🎓 博士級數學形式化推導：計算最優邊界與架構閉式解

### 1. Chinchilla 計算最優縮放定律 (Compute-Optimal Frontier)
給定總浮點計算量預算 $C \approx 6 N D$（FLOPs，前向傳播 $\approx 2ND$，反向傳播 $\approx 4ND$）：
Hoffmann et al. (NeurIPS 2022) 將損失函數 $\mathcal{L}(N, D)$ 建模為參數量 $N$ 與數據量 $D$ 的二維冪律（Power-law）：
$$\mathcal{L}(N, D) = E + \frac{A}{N^\alpha} + \frac{B}{D^\beta}$$
其中 $E$ 為不可約信息熵（Irreducible Loss），$A, B, \alpha, \beta$ 為擬合參數（實測 $\alpha \approx 0.34, \beta \approx 0.28$）。
構建拉格朗日乘子法求解約束最優化問題：
$$\min_{N, D} \mathcal{L}(N, D) \quad \text{s.t.} \quad 6 N D = C$$
最優參數量 $N^*$ 與數據量 $D^*$ 滿足比例漸近：
$$N^* \propto C^a, \quad D^* \propto C^b, \quad \text{其中 } a = \frac{\beta}{\alpha + \beta} \approx 0.45, \; b = \frac{\alpha}{\alpha + \beta} \approx 0.55$$
**定理結論**：在給定算力限制下，若模型參數量翻倍，訓練數據量亦必須等比例增加約 $1.8 \sim 2.0$ 倍，方可維持 Pareto 最優解。現代 LLaMA 3 (8B) 更是採用了超過 $15\text{T}$ Tokens 的超極限訓練（Over-training），換取邊緣部署時的極致性價比。

### 2. RMSNorm (Root Mean Square Layer Normalization)
傳統 LayerNorm 對激活向量 $x \in \mathbb{R}^d$ 的公式為：
$$\text{LN}(x) = \frac{x - \mu}{\sqrt{\sigma^2 + \epsilon}} \odot \gamma + \beta, \quad \text{其中 } \mu = \frac{1}{d}\sum_{i=1}^d x_i, \; \sigma^2 = \frac{1}{d}\sum_{i=1}^d (x_i - \mu)^2$$
Zhang & Sennrich (NeurIPS 2019) 證明：LayerNorm 的泛化收益主要來自於輸入特徵的**尺度不變性 (Scale Invariance)**，而與中心平移無關。RMSNorm 徹底捨棄均值計算：
$$\text{RMSNorm}(x) = \frac{x}{\text{RMS}(x)} \odot \gamma, \quad \text{其中 } \text{RMS}(x) = \sqrt{\frac{1}{d} \sum_{i=1}^d x_i^2 + \epsilon}$$
計算少了一次全域求和與減法，硬體執行緒同步次數直接減半。

### 3. SwiGLU 門控前饋網路 (Gated Linear Units)
Shazeer (2020) 提出的 SwiGLU 替換了傳統的 $\text{ReLU}(x W_1) W_2$：
$$\text{SwiGLU}(x) = \left(\text{Swish}_\beta(x W_{\text{gate}}) \otimes x W_{\text{up}}\right) W_{\text{down}}$$
其中 $\text{Swish}_\beta(z) = z \cdot \sigma(\beta z)$（通常 $\beta = 1$，即 SiLU 函數），$\otimes$ 為逐元素哈達瑪積（Hadamard Product）。
- 為了在替換原雙矩陣 FFN 時保持相同之 FLOPs 與參數量，隱藏維度 $d_{\text{ffn}}$ 通常設為：
  $$d_{\text{ffn}} = \left\lfloor \frac{8}{3} d_{\text{model}} \right\rfloor$$
  並向下/向上對齊至 256 或 128 的整數倍（硬體對齊）。

### 4. 分組查詢注意力 (Grouped-Query Attention, GQA)
設查詢頭數為 $H_Q$，鍵值頭數為 $H_{KV}$，分組數為 $G = H_Q / H_{KV}$：
- **Multi-Head Attention (MHA)**: $H_{KV} = H_Q$（每個 Q 獨享一個 KV 頭，顯存開銷大）。
- **Multi-Query Attention (MQA)**: $H_{KV} = 1$（所有 Q 共用一個 KV 頭，可能損失表達力）。
- **Grouped-Query Attention (GQA)**: $1 < H_{KV} < H_Q$（例如 LLaMA 3 8B 中 $H_Q = 32, H_{KV} = 8$）。
**KV Cache 記憶體壓縮比**：
$$\text{Ratio} = \frac{H_Q}{H_{KV}} = 4\times \sim 8\times$$
推論時單一序列的顯存頻寬需求下降至原本的 25% 以下，使單卡能容納的並行 Batch Size 激增 4 倍！

---

## 三、⚙️ 計算機體系結構與硬體微架構映射：PagedAttention 與虛擬記憶體分頁

在 LLM 服務系統（如 vLLM）中，傳統 KV Cache 必須為每個請求預先分配連續顯存。由於輸出長度未知，容易造成高達 60%~80% 的內部顯存碎片（Memory Fragmentation）。

Kwon et al. (SOSP 2023) 借鑑了操作系統的**虛擬分頁記憶體 (Virtual Paged Memory)** 概念，發明了 **PagedAttention**：
```
[邏輯 Token 序列]
Token:   [0]   [1]   [2]   [3]   [4]   [5]   [6]   [7]
區塊:    |--- Block 0 ---|   |--- Block 1 ---|

[區塊分頁表 (Block Table)]
Logical Block 0 ---> Physical Frame 7 (GPU VRAM 物理位址)
Logical Block 1 ---> Physical Frame 2

[物理非連續顯存池]
Frame 0: [空閒]
Frame 2: [KV of Token 4, 5, 6, 7]  <-- 非連續存放，隨用隨分！
Frame 7: [KV of Token 0, 1, 2, 3]
```
- 徹底消除顯存碎片，將顯存浪費率壓低至 4% 以下。
- 支援不同請求間 Copy-on-Write 共享前綴（如系統 Prompt、Few-shot 範例），推論吞吐量提升 2~4 倍。

---

## 四、💻 工業級工程實作：現代 LLaMA-Style 核心層組裝

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class RMSNorm(nn.Module):
    def __init__(self, dim: int, eps: float = 1e-6):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: [B, S, D]
        rms = torch.rsqrt(x.pow(2).mean(-1, keepdim=True) + self.eps)
        return x * rms * self.weight

class SwiGLUFFN(nn.Module):
    def __init__(self, d_model: int, hidden_dim: int):
        super().__init__()
        self.w_gate = nn.Linear(d_model, hidden_dim, bias=False)
        self.w_up = nn.Linear(d_model, hidden_dim, bias=False)
        self.w_down = nn.Linear(hidden_dim, d_model, bias=False)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Swish(x * W_gate) * (x * W_up) * W_down
        return self.w_down(F.silu(self.w_gate(x)) * self.w_up(x))

class GroupedQueryAttention(nn.Module):
    def __init__(self, d_model: int, n_heads: int = 32, n_kv_heads: int = 8):
        super().__init__()
        self.n_heads = n_heads
        self.n_kv_heads = n_kv_heads
        self.head_dim = d_model // n_heads
        self.num_queries_per_kv = n_heads // n_kv_heads
        
        self.q_proj = nn.Linear(d_model, n_heads * self.head_dim, bias=False)
        self.k_proj = nn.Linear(d_model, n_kv_heads * self.head_dim, bias=False)
        self.v_proj = nn.Linear(d_model, n_kv_heads * self.head_dim, bias=False)
        self.out_proj = nn.Linear(d_model, d_model, bias=False)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, S, _ = x.shape
        q = self.q_proj(x).view(B, S, self.n_heads, self.head_dim).transpose(1, 2)
        k = self.k_proj(x).view(B, S, self.n_kv_heads, self.head_dim).transpose(1, 2)
        v = self.v_proj(x).view(B, S, self.n_kv_heads, self.head_dim).transpose(1, 2)
        
        # 鍵值頭廣播複製以對齊查詢頭 (Repeat KV heads)
        k = k.repeat_interleave(self.num_queries_per_kv, dim=1) # [B, n_heads, S, head_dim]
        v = v.repeat_interleave(self.num_queries_per_kv, dim=1)
        
        scores = torch.matmul(q, k.transpose(-2, -1)) / (self.head_dim ** 0.5)
        attn = torch.softmax(scores, dim=-1)
        out = torch.matmul(attn, v).transpose(1, 2).contiguous().view(B, S, -1)
        return self.out_proj(out)

if __name__ == "__main__":
    d_model = 256
    x = torch.randn(2, 16, d_model)
    norm = RMSNorm(d_model)
    ffn = SwiGLUFFN(d_model, int(8/3 * d_model))
    gqa = GroupedQueryAttention(d_model, n_heads=8, n_kv_heads=2)
    
    out = gqa(norm(x)) + x
    out = ffn(norm(out)) + out
    print(f"輸入尺寸: {x.shape} -> 輸出尺寸: {out.shape}")
    assert out.shape == x.shape, "維度驗證失敗！"
```

---
---
---

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-602-01] Chinchilla 訓練算力分配最優化合約 (Chinchilla Compute Budget Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件 (Pre-conditions)**: 規劃大語言模型預訓練算力預算 $C \approx 6 N D$ FLOPs。
- **量化決策邊界 (Decision Thresholds)**:
  - 參數量 $N$ 與資料量 $D$ 必須嚴格保持 $1:1$ 等比例縮放：
    $$D_{\text{optimal}} \approx 20 \times N_{\text{optimal}}$$
  - 嚴禁出現如 70B 模型僅訓練 300B Tokens 的「嚴重欠訓練 (Under-trained)」架構配置。
- **可執行斷言**:
  ```python
token_param_ratio = num_training_tokens / num_params
assert token_param_ratio >= 18.0, f"Token 與參數比例 {token_param_ratio:.1f} 低於 Chinchilla 最優界限 (20:1)，算力分配無效！"
  ```

### [RULE-602-02] KV 快取顯存預算與分頁合約 (KV Cache Memory Allocation Invariant)
- **合約等級**: `RESOURCE_CONSTRAINT`
- **前置條件 (Pre-conditions)**: 部署高並發 LLM 推論服務（vLLM / TensorRT-LLM）。
- **量化決策邊界 (Decision Thresholds)**:
  - 單請求 KV Cache 記憶體大小精確公式：
    $$\text{Mem}_{\text{KV}} = 2 \times 2 \times n_{\text{layers}} \times d_{\text{head}} \times n_{\text{kv\_heads}} \times L_{\text{seq}} \quad (\text{Bytes, FP16})$$
  - 服務端必須強制啟用 **PagedAttention** 分頁管理機制，消除內部與外部記憶體碎片。
- **執行保證**: 保證在高並發情境下無碎片浪費，顯存有效利用率提升至 96% 以上。

### [RULE-602-03] RMSNorm 數值穩定性防溢出合約 (RMSNorm Numerical Stability Guardrail)
- **合約等級**: `BOUNDARY_GUARD`
- **前置條件 (Pre-conditions)**: 執行 RMSNorm 前向運算：$x \cdot \text{rsqrt}(\text{mean}(x^2) + \epsilon)$。
- **量化決策邊界 (Decision Thresholds)**:
  - 數值穩定常數 $\epsilon = 10^{-6}$。
  - 在 FP16 混合精度下，計算 $\text{mean}(x^2)$ 必須強制轉型為 FP32 累積求和，再轉回 FP16。
- **例外回退 (Fallback Protocol)**: 嚴禁直接在 FP16 下平方求和，防止激活值平方超出 FP16 最大值 65504 引發 `Inf` / `NaN`。
---

## 六、📚 權威論文、經典著作與同行評審文獻 (Canonical & Peer-Reviewed References)

1. **Chinchilla 縮放定律奠基作 (NeurIPS 頂會 Oral)**
   - *Paper*: Hoffmann, J., Borgeaud, S., Mensch, A., Buchatskaya, E., Cai, T., Rutherford, E., ... & Sifre, L. (2022). "Training Compute-Optimal Large Language Models." *Advances in Neural Information Processing Systems (NeurIPS 2022)*, 35, 30016-30030.
   - *Core Contribution*: 修正 Kaplan 早期定律，證明在給定總訓練算力 $C$ 下，模型參數量 $N$ 與訓練 Token 數 $D$ 應以等同比例 $1:1$ 縮放，揭示早期 LLM 均處於嚴重「欠訓練 (Under-trained)」狀態。
2. **OpenAI 早期縮放定律開山作**
   - *Paper*: Kaplan, J., McCandlish, S., Henighan, T., Brown, T. B., Chess, B., Child, R., ... & Amodei, D. (2020). "Scaling Laws for Neural Language Models." *arXiv:2001.08361*.
   - *Core Contribution*: 首次以跨越 7 個數量級之實驗證明，交叉熵損失隨參數量、資料集大小與計算量呈平滑冪律 (Power-law) 下降。
3. **LLaMA 開源大模型架構里程碑**
   - *Paper*: Touvron, H., Lavril, T., Izacard, G., et al. (2023). "LLaMA: Open and Efficient Foundation Language Models." *arXiv:2302.13971*.
   - *Core Contribution*: 整合 RMSNorm 預歸一化、SwiGLU 非線性激活與 RoPE 旋轉位置編碼，確立現代大語言模型之工業界標準拓樸。
4. **PagedAttention 記憶體分頁 Serving 經典 (SOSP 頂會)**
   - *Paper*: Kwon, W., Li, Z., Zhuang, S., Sheng, Y., Zheng, L., Yu, C. H., ... & Stoica, I. (2023). "Efficient Memory Management for Large Language Model Serving with PagedAttention." *ACM Symposium on Operating Systems Principles (SOSP 2023)*, pp. 611-626. DOI: [10.1145/3600006.3613165](https://doi.org/10.1145/3600006.3613165).
   - *Core Contribution*: 借鏡作業系統虛擬記憶體分頁原理，解決 KV Cache 記憶體碎裂問題，使 vLLM 伺服吞吐量提升 2-4 倍。
5. **GQA 分組查詢注意力**
   - *Paper*: Ainslie, J., Ontanon, S., Alberti, C., et al. (2023). "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints." *EMNLP 2023*. arXiv: [2305.13245](https://arxiv.org/abs/2305.13245).
   - *Core Contribution*: 在維持 MHA 表現力的同時將 KV 快取顯存頻寬開銷縮減至 $1/8$，支援超長上下文推論。
