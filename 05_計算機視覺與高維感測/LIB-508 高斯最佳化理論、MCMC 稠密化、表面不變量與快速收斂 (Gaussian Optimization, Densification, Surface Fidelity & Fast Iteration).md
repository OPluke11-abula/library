---
call_number: LIB-508
status: source-verified
invariants_count: 4
title: 高斯最佳化理論、MCMC 稠密化、表面不變量與快速收斂 (Gaussian Optimization, Densification, Surface Fidelity & Fast Iteration)
module: Computer-Vision
category: 3DGS-Optimization-and-Surface-Theory
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Adaptive Density Control (ADC) Gradient Collision & SGLD MCMC Transitions
  - Score-Guided Budgeted Densification & Synchronized Multi-Resolution Scheduling
  - First-Hit Rendering Abstraction & SH Angular Capacity Billboard Failure Theorem
  - Planar Surfel / Continuous Opacity Fields & View-Consistent Alpha Sorting
hardware_target:
  - Low-VRAM Local Execution Profile (e.g., 8GB Laptop Profile Capped at N <= 300k; NOT a Global Research Ceiling)
  - Single-GPU Cloud Environments (16GB T4 / 24GB L4) & 200-Second Multi-Resolution Schedules
created: 2026-11-17
author: Luke
tags:
  - 圖書館
  - 計算機視覺
  - 3DGS
  - 高斯稠密化
  - MCMC
  - 表面重建
  - 球諧函數
  - 顯存預算
prerequisites:
  - "[[LIB-104 凸最佳化理論與一階二階梯度下降幾何 (Optimization Theory & Gradient Descent)]]"
  - "[[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]"
  - "[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]"
successors:
  - "[[LIB-507 少視角 3DGS 幾何可靠性、單目深度先驗與局部仿射校正邊界 (Sparse-View 3DGS Geometry, Depth Priors & Reliability)]]"
  - "[[LIB-905 前沿視覺與具身多模態專題研發藍圖：五大題目技術全景與消融實證指南 (Frontier Vision & Multimodal Capstone Blueprints - Five Grand Research Specifications)]]"
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/05_computer_vision/LIB-508%20Gaussian%20Optimization,%20Densification,%20Surface%20Fidelity%20%26%20Fast%20Iteration%20%28Agent%20EN%29.md)

# 高斯最佳化理論、MCMC 稠密化、表面不變量與快速收斂 (Gaussian Optimization, Densification, Surface Fidelity & Fast Iteration)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-104 凸最佳化理論與一階二階梯度下降幾何 (Optimization Theory & Gradient Descent)]]、[[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]、[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]。
- **後續節點**：[[LIB-507 少視角 3DGS 幾何可靠性、單目深度先驗與局部仿射校正邊界 (Sparse-View 3DGS Geometry, Depth Priors & Reliability)]]、[[LIB-905 前沿視覺與具身多模態專題研發藍圖：五大題目技術全景與消融實證指南 (Frontier Vision & Multimodal Capstone Blueprints - Five Grand Research Specifications)]]。
- **核心定位**：針對 `LIB-504` 建立基礎光柵化後，系統深化 **3DGS 最佳化與表徵穩定性四大核心理論分支**：(1) Adaptive Density Control 缺陷與 MCMC／預算控制取代方案；(2) 高階球諧函數（SH）造成的「假看板（Billboard）」表面欺騙定理與反光場景限制；(3) 抗混疊與視角一致排序（`StopThePop`）；(4) 200 秒級多解析排程（`DashGaussian` / `Taming 3DGS` / `3DGS-LM`）之工程邊界。

---

## 一、💡 學士直觀心智模型：為何「高畫質照片」與「精準 3D 形狀」常常打架？

1. **原始克隆／分裂的梯度抵消盲區**：原始 3DGS 靠追蹤位置梯度大小決定高斯要不要一分為二。若一顆大高斯覆蓋高頻細節區，左半邊被拉向右、右半邊被拉向左——兩股大小相等方向相反的梯度加總接近零！大高斯因此永遠拒絕分裂，留下模糊殘影（**Gradient Collision**，`AbsGS`, CVPR 2024） `[LITERATURE_RESULT]`。
2. **「會變魔術的錯誤看板（Billboard Illusion）」與真實場景界線**：在合成或受控高頻紋理視差條件下，若給予錯位平坦高斯牆面過高「隨視角變色能力」（高階球諧函數 SH），模型可靠角向變色背誦空間紋理，在**高 PSNR 下隱藏錯誤 3D 形狀**；**然而原論文（Wang & Miller, ECCV 2026）亦明確報告：在多數真實世界拍攝資料集與一般空間紋理下，即使開啟高階 SH，重建仍能維持表面一致性（未普遍觀察到看板塌陷）** `[LITERATURE_RESULT]`。因此「真實高光/細結構場景下是否仍存在特定 billboard 可辨識失效」屬待驗證假說，不得將合成反例直接宣稱為真實場景普遍失效 `[SAFETY_BOUND]`。
3. **無上限繁殖與低顯存本地 Profile 差異**：原始 3DGS 對原語總數沒有硬上限，高解析複雜場景可增長至數百萬顆高斯而超出消費級 `8GB` 筆電本地執行邊界（**此僅為本機執行條件限制，非淘汰 3DGS 研究題目之全域規則，實際研究可於 `16GB/24GB` 單卡雲端執行** `[DESIGN_DECISION]`）；反之在受限顯存下若強行暴力刪點（Coreset 理論已證明一般設定下不存在非平凡乘法 Coreset），細小電線與高曲率結構極易率先流失 `[LITERATURE_RESULT]`。

---

## 二、🎓 博士級數學形式化推導：稠密化動力學、假看板可辨識界與表面場模型

### 1. Adaptive Density Control (ADC) 的失效與 2024–2025 四條修正理論 `[LITERATURE_RESULT]`
- **AbsGS (CVPR 2024) 同向梯度判準**：以**各像素梯度範數之加權和**取代傳統梯度向量的先相加再取範數（避免符號相反互相抵消）：
  $$\left\| \sum_{p} \frac{\partial \mathcal{L}_p}{\partial \boldsymbol{\mu}_i} \right\|_2 \le \sum_{p} \left\| \frac{\partial \mathcal{L}_p}{\partial \boldsymbol{\mu}_i} \right\|_2$$
  並透過 `Pixel-GS`（ECCV 2024）依覆蓋像素足跡與距相機距離縮放梯度，緩解影像邊緣大高斯的漏分裂與近相機漂浮偽影 `[LITERATURE_RESULT]`；`Revising Densification`（Bulò et al., ECCV 2024）進一步修正克隆複製時不透明度合併造成的光學偏差並以每像素誤差主導分配 `[LITERATURE_RESULT]`。
- **3DGS-MCMC（Kheradmand et al., NeurIPS 2024 Spotlight）之 SGLD 物理採樣視角**：拋棄所有 heuristic clone/split/opacity-reset 規則，將高斯分佈視作從潛在場景輻射機率分佈采樣的馬可夫鏈狀態轉移（Stochastic Gradient Langevin Dynamics）：
  $$\boldsymbol{\mu}_i^{(t+1)} = \boldsymbol{\mu}_i^{(t)} - \eta_t \nabla_{\boldsymbol{\mu}_i} \mathcal{L} + \sqrt{2 \eta_t T_{\text{noise}}} \, \boldsymbol{\epsilon}_t \cdot \mathbf{g}_{\mathrm{opac}}(\alpha_i), \qquad \boldsymbol{\epsilon}_t \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$$
  配合對不透明度 $\alpha_i$ 與尺度施以 $\mathcal{L}_1$ 稀疏正則，淘汰死高斯並將預算重移往高誤差區，在對比原始 3DGS 的低原語上限測試與不佳初始化下展現強大韌性 `[LITERATURE_RESULT]`。
  - **殘餘限制 `[HYPOTHESIS]`**：等向探索噪聲與均勻 $\mathcal{L}_1$ 稀疏權重在極低總點數預算（如 `< 200k`）下，對低像素面積但高幾何曲率的細長物體仍存在邊際保留不足風險。
- **Taming 3DGS（SIGGRAPH Asia 2024）與 DashGaussian（CVPR 2025 Highlight）**：
  - `Taming 3DGS` 改採「純建設性分數導向成長（嚴格封頂指定原語預算）」搭配 Sparse Adam 平行反向傳播，達成訓練期 VRAM 峰值消滅與 `4–5×` 模型精簡加速 `[LITERATURE_RESULT]`。
  - `DashGaussian` 證明訓練初期（原語尚稀疏）渲染高解析圖屬計算浪費，同步排程漸進影像解析度與原語成長，將標準優化時間壓縮至 **`~200 秒`（平均加速 `45.7%`）** `[LITERATURE_RESULT]`。

- **2025–2026 預算化增生／剪枝與免稠密化理論進展 (`Birth-Death 3DGS`, `Provable Coresets`, `EDGS`)** `[LITERATURE_RESULT]`：
  - **`Birth-Death 3DGS`**（`arXiv:2610.34344`, 程式碼 `quanth238/birth-death-3dgs`）：將高斯基元增生與消亡嚴格公式化為一階質量變分導數（First-Variation Mass Derivative）$q_i = -\alpha_i \frac{\partial \widehat{F}}{\partial \alpha_i}$，在固定幾何/光子傳輸下提供解析級 Birth/Death 判準（開源碼相依 Linux + CUDA 12.8 `nvcc` 編譯）。
  - **`Provable Pruning via Coresets`**（`arXiv:2607.02721`, 程式碼 `waseem-m/3dgs_provable_coresets`）：證明在無限制 3DGS 參數域下**不存在非平凡的乘法 Coreset 上界**，並據此設計基於敏感度採樣（Sensitivity-Sampled）之可證明加權 Coreset 剪枝演算法。
  - **`EDGS`**（Eliminating Densification, `arXiv:2504.13204`）：改採密集像素對應直接一次性初始化高品質高斯點雲，藉以完全消除漸進式 Heuristic 稠密化階段之漂移誤差。

### 2. 何時 3DGS 才能恢復真實幾何表面？（ECCV 2026 定理雙面性與鏡面解耦先行體系） `[LITERATURE_RESULT]`
Wang & Miller（ECCV 2026, *When 3D Gaussian Splatting Recovers Real Surfaces*, `arXiv:2608.30054`）建立「第一命中渲染抽象（First-Hit Rendering Abstraction）」分析表面可辨識邊界 `[DERIVATION]` `[LITERATURE_RESULT]`：
- 當高斯基元幾何偏移真實表面 $\Delta\mathbf{X} \neq \mathbf{0}$ 時，相機平移產生的視差（Parallax）會將空間紋理頻率 $\omega_{\text{spatial}}$ 映射為沿視線方向 $\mathbf{d}$ 變化的角向訊號 $\omega_{\text{angular}} \propto \|\Delta\mathbf{X}\| \cdot \omega_{\text{spatial}}$。
- **論文實證的嚴謹雙面性（不可選擇性引用） `[LITERATURE_RESULT]` `[SAFETY_BOUND]`**：
  1. **受控/合成高頻紋理情境**：當角向自由度過大（如高階 SH）且空間頻率極高時，錯位的**不透明看板（Opaque Billboards）**能以視角相關顏色函數背誦視差紋理，在保持高外觀 PSNR 的同時出現嚴重幾何錯位。
  2. **真實拍攝場景實證結果**：在同一論文評測的**真實拍攝資料集與標準 SH/空間紋理設定下，3DGS 重建並未觀察到普遍的 billboard 失效，仍可恢復一致的幾何表面**！因此，任何假設真實場景、標準 SH 設定或鏡面高光下存在新型可控失敗機制的提議，必須先證明可重現失效現象並通過下列既存解耦先行文獻之撞題檢驗 `[SAFETY_BOUND]`。
- **表面重建與鏡面／反光幾何解耦既有文獻譜系（防重造輪子清單）**：
  - **漫反射與平面表面重建**：`2DGS`（平面圓盤＋精確射線交點）、`PGSR`（IEEE TVCG 2024, `arXiv:2406.06521`, 局部平面＋多視角光度一致）、`RaDe-GS`（`arXiv:2406.01467`）與 `GOF`（SIGGRAPH Asia 2024）大幅提升 Lambertian 場景的 Mesh Chamfer Distance，但均在強高光反射處面臨外觀與法向權衡。
  - **鏡面／反光與幾何解耦專門方法**：**`Spec-Gaussian`**（NeurIPS 2024, `arXiv:2402.15870`）直接以**各向異性球面高斯（Anisotropic Spherical Gaussians, ASG）**取代低頻 SH 以精準擬合高頻鏡面高光＋粗到細訓練；**`Ref-GS`**（CVPR 2025, `arXiv:2412.00905`）於 `2DGS` 上結合延遲方向編碼（Deferred Directional Encoding）、球面 Mip-grid 粗糙度與外積分解漫反射/鏡面分支；**`EnvGS`**（CVPR 2025, `arXiv:2412.15215`）更結合 Base Gaussians 與顯式 3D Environment Gaussians 透過硬體光線追蹤求解近場反射 `[LITERATURE_RESULT]`。任何新方法不得在未超越或異質於上述方案下宣稱「首次解決反光與幾何解耦」 `[SAFETY_BOUND]`。

### 3. 抗混疊與視角一致光柵排序穩定性 `[LITERATURE_RESULT]`
- **Mip-Splatting (CVPR 2024) / Analytic-Splatting (ECCV 2024)**：引入 3D 平滑濾波限制高斯基元最小世界尺度（匹配最高取樣頻率 Nyquist 限制）與 2D Mip 抗混疊濾波器，修復拉遠或拉近鏡頭時的高頻混疊閃爍。
- **StopThePop (SIGGRAPH 2024)**：標準 3DGS 僅依每顆高斯中心深度進行單一全域鍵值排序，旋轉視角時兩片交錯半透明高斯的繪製順序突變，引發視覺 **Popping 彈跳閃爍**；`StopThePop` 引入視線方向逐瓦片或分層排序修正此一致度，但以更高光柵化計算延遲為代價 `[LITERATURE_RESULT]`。

---

## 三、⚙️ 計算機體系結構與硬體資源約束：低顯存執行剖面（Non-Global）與優化器比較

> **算力範圍限定聲明 `[DESIGN_DECISION]` `[SAFETY_BOUND]`**：**Local GPU VRAM is an observed hardware fact, not a global research-topic elimination threshold.** 下表中 $N_{\max} \le 300\text{k}$ 與 `8 GB` 顯存封頂**僅適用於受限低顯存本機執行 Profile（Low-VRAM Execution Profile）**；若研究演算法本身需 `12 / 16 / 24 GB` VRAM 而可於單張雲端 GPU（如 Colab T4/L4）驗證，不得以低顯存本機剖面作為所有 3DGS 研究的通用上限或淘汰門檻。

| 優化範式 / 基準 | 顯存關鍵瓶頸 | 原語數量與時間尺度（區分 `AUTHOR_REPORTED` vs. `TEAM_ESTIMATE` / `NOT_RUN / UNVERIFIED`） | 低顯存本地 Profile vs. 單卡雲端執行守則 |
| :--- | :--- | :--- | :--- |
| **Vanilla 3DGS / 2DGS** | 無限制 Clone/Split 導致數百萬點梯度緩衝 + Radix Sort 高顯存壓力 | 依場景複雜度劇烈變化：LLFF 3-view 於 `RTX 3090 Ti` 報告 **`2.5 min / 2 GB`**（`CoR-GS` Table 5, `AUTHOR_REPORTED`）；較大型密集場景常見 **`10–40 min`** 範圍屬 **`TEAM_ESTIMATE` / 本機 `NOT_RUN / UNVERIFIED`** `[DESIGN_DECISION]` | 僅於 **`<= 8GB` 受限執行剖面** 建議設定原語上限（例如 $N_{\max} \le 300\text{k}$）或降解析運行 `[SAFETY_BOUND]`；不限制 `16–24GB` 單卡雲端完整重現 |
| **Taming 3DGS / MCMC** | 固定張量陣列可預先配置 VRAM，Sparse Adam 減少零梯度寫回頻寬 | 固定預算（視場景配置），原論文於 budgeted setting 報告約 **`4–5×`** 精簡與加速（`AUTHOR_REPORTED` `[LITERATURE_RESULT]`） | **對低顯存執行剖面特別友善**：顯存用量穩定可預測；實際單卡跑時仍須標註實測或估算 `[DESIGN_DECISION]` |
| **DashGaussian** | 前期低解析度節省 Rasterizer Tile Shared Memory 與梯度張量尺寸 | 作者論文報告（`arXiv:2503.18402`）於單張消費級 GPU 達成 **`~200 秒`（平均加速 `45.7%`）**（`AUTHOR_REPORTED` `[LITERATURE_RESULT]`） | 快速迭代消融參考基線，須額外檢驗早期低頻混疊錯誤固化；本機／Colab 實際跑時未實跑前維持 `NOT_RUN / UNVERIFIED` |
| **3DGS-LM (二階優化)** | Levenberg-Marquardt Jacobian Cache 需額外 HBM 容量（採 Matrix-free 緩解） | 局部極速收斂 | 稀疏初始化或極大相機位移下容易陷入不良非凸局部極小 `[LITERATURE_RESULT]` |

---

## 四、💻 工業級工程實作：First-Hit 視差與 SH 角向「看板偽裝」數值驗證核心

以下純 PyTorch 腳本於無 GPU 依賴下驗證 Wang & Miller (ECCV 2026) 的核心幾何判別現象：當平面基元偏離真實表面 $\Delta z > 0$ 時，在多視角下呈現高頻率「空間—視角」角向能量轉移；同時計算 8GB 顯存原語封頂預算檢查：

```python
import torch


def simulate_billboard_parallax_signature(
    z_true: float,
    z_billboard: float,
    spatial_freq: float,
    view_angles_rad: torch.Tensor,
) -> dict:
    """
    模擬 ECCV 2026 First-Hit 抽象下，表面位移 (Delta_z) 如何透過視差將空間紋理
    轉換為角向觀測頻率；並檢驗低階 vs 高階角向基底之近似殘差。
    """
    assert z_true > 0.2 and z_billboard > 0.2, "須滿足相機近平面安全邊界"
    delta_z = z_billboard - z_true
    # 在小角度視差近似下，假看板上固定局部點的視差位移 proportional to delta_z * tan(theta)
    apparent_shift = delta_z * torch.tan(view_angles_rad)
    observed_signal = torch.sin(spatial_freq * apparent_shift)

    # 以截斷三角/球諧多項式階數 L=1 (3 基底) vs L=4 (9 基底) 擬合該視角相關訊號
    def fit_angular_mse(order: int) -> float:
        cols = [torch.ones_like(view_angles_rad)]
        for k in range(1, order + 1):
            cols.append(torch.cos(k * view_angles_rad))
            cols.append(torch.sin(k * view_angles_rad))
        basis = torch.stack(cols, dim=-1)  # [V, 2*order+1]
        coeffs, _, _, _ = torch.linalg.lstsq(basis, observed_signal.unsqueeze(-1))
        recon = (basis @ coeffs).squeeze(-1)
        return float(torch.mean((recon - observed_signal) ** 2).item())

    return {
        "delta_z": round(delta_z, 4),
        "mse_low_sh_L1": fit_angular_mse(1),
        "mse_high_sh_L4": fit_angular_mse(4),
        "angular_tv": float(torch.mean(torch.abs(observed_signal[1:] - observed_signal[:-1])).item()),
    }


def check_vram_primitive_budget(n_gaussians: int, sh_degree: int, vram_limit_gb: float = 8.0) -> float:
    """依可配置 VRAM 上限（預設 8GB 為低顯存本地 Profile 示例）估算 3DGS + Adam 原語狀態顯存佔用 (GB)。"""
    sh_coeffs = (sh_degree + 1) ** 2 * 3
    params_per_gs = 3 + 4 + 3 + 1 + sh_coeffs  # mu, quat, scale, opacity, SH
    # FP32 權重 + 梯度 + Adam (m, v) 共 4 份拷貝
    total_gb = (n_gaussians * params_per_gs * 4 * 4) / (1024 ** 3)
    assert total_gb < vram_limit_gb * 0.45, f"原語狀態參數已超 45% VRAM 警戒線: {total_gb:.2f}GB"
    return total_gb


if __name__ == "__main__":
    angles = torch.linspace(-0.35, 0.35, 32)
    true_surface = simulate_billboard_parallax_signature(2.0, 2.0, spatial_freq=18.0, view_angles_rad=angles)
    fake_billboard = simulate_billboard_parallax_signature(2.0, 2.35, spatial_freq=18.0, view_angles_rad=angles)

    assert true_surface["mse_low_sh_L1"] < 1e-10, "真實對齊表面不應產生視差角向殘差"
    assert fake_billboard["mse_low_sh_L1"] > 0.1, "錯位假看板於低階 SH 下無法偽裝高頻空間紋理"
    assert fake_billboard["mse_high_sh_L4"] < fake_billboard["mse_low_sh_L1"] * 0.25, "高階 SH 可大幅吸收錯位看板殘差"

    param_gb = check_vram_primitive_budget(n_gaussians=250_000, sh_degree=3, vram_limit_gb=8.0)
    print(f"[LIB-508 Verified] true={true_surface['mse_low_sh_L1']:.2e}, fake_L1={fake_billboard['mse_low_sh_L1']:.4f}, fake_L4={fake_billboard['mse_high_sh_L4']:.4f}, state_vram={param_gb:.3f}GB")
```

---

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-508-01] 受限低顯存執行剖面原語預算與顯存記錄合約 (Scoped Low-VRAM Execution Profile & Peak VRAM Guard)
- **合約等級**: `RESOURCE_CONSTRAINT`
- **前置條件**: 僅當刻意在 **受限低顯存本機剖面（`<= 8 GB VRAM` Local Execution Profile）** 執行 3DGS 訓練或稠密化消融實驗（本規則**不**限制可於 `16–24 GB` 單卡雲端執行的 3DGS 研究，亦非選題淘汰標準）。
- **量化決策邊界**:
  - 於低顯存執行剖面運行時，訓練腳本必須顯式配置該剖面適用之原語數量上限（例如 $N_{\max} \le 300{,}000$，參見 `Taming-3DGS` / `3DGS-MCMC` 預算原則）並記錄峰值 GPU 記憶體佔用（Peak Allocated VRAM） `[SAFETY_BOUND]`。
  - 若需不加 $N_{\max} \le 300{,}000$ 封頂之完整場景重建以確保科學效度，應依 `LIB-907` 規劃遷移至單張雲端 GPU 執行，而非草率判定 `NO-GO` `[DESIGN_DECISION]`。

### [RULE-508-02] 角向球諧容量與假看板表面分離檢驗合約 (SH Angular Capacity & Surface Disentanglement Invariant)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件**: 宣稱任何最佳化器、稠密化策略或表面正則項改善了 3DGS 的三維幾何正確性。
- **量化決策邊界**:
  - 嚴禁僅憑開啟高階球諧函數（如 `SH=3`）後的測試視角 RGB 指標（PSNR / SSIM / LPIPS）推論 3D 表面精準 `[LITERATURE_RESULT]`。
  - 必須提供直接幾何評估（Chamfer Distance / Normal MAE / Mesh F-Score）以及低階 vs 高階 SH 容量受控對照，確認改善非來自錯位看板的視角過擬合。

### [RULE-508-03] 漫反射／強鏡面場景隔離與反光解耦既有文獻檢查合約 (Diffuse vs. Specular & Prior-Art Check)
- **合約等級**: `QUALITY_BOUND`
- **前置條件**: 評測表面重建或鏡面反射導向之高斯方法（如 2DGS / PGSR / RaDe-GS / 反射解耦衍伸改進）。
- **量化決策邊界**:
  - 評測套件必須顯式切分並分開彙報「漫反射／Lambertian 主導場（如 DTU 靜物子集）」與「強鏡面／高光／金屬反射場（如 Shiny Blender / Ref-NeRF）」，不得將漫反射平均掩蓋鏡面法向塌陷 `[LITERATURE_RESULT]`。
  - 任何宣稱改良反光與幾何解耦之演算法，必須明確說明與 **`Ref-GS`（2025）、`Spec-Gaussian`（2024）及 `EnvGS`（2025）** 之機制差異，並報告標準 SH 真實場景下表面不一致（若主張）之可重現失敗證據 `[SAFETY_BOUND]`。

### [RULE-508-04] 等品質點加速基準對齊合約 (Iso-Quality Convergence Benchmarking Invariant)
- **合約等級**: `PERFORMANCE_CRITICAL`
- **前置條件**: 評估任何標榜「快速收斂」或「節省訓練時間」的 3DGS 排程、二階最佳化或梯度加速演算法。
- **量化決策邊界**:
  - 必須固定**目標達成品質等值線（Iso-PSNR 或 Iso-Chamfer Distance 目標點）**量測所需 Wall-Clock Time 與 CCU／能源開銷 `[DESIGN_DECISION]`；嚴禁只比較「相同 30k 步但每步省時卻降畫質」或只跑輕量場之單方面數據，且應與 `DashGaussian` / `Taming-3DGS` 強基準對照。

---

## 六、📚 權威論文與同行評審文獻 (Canonical & Peer-Reviewed References)

1. **稠密化機制診斷與 MCMC / 預算控制 (CVPR / ECCV / NeurIPS / SIGGRAPH Asia 2024–2025)**
   - Ye, Z., et al. (2024). *AbsGS: Recovering Fine Details for 3D Gaussian Splatting*. **CVPR 2024**.
   - Zhang, Z., et al. (2024). *Pixel-GS: Density Control with Pixel-aware Gradient*. **ECCV 2024** (`arXiv:2403.15530`).
   - Rota Bulò, S., Porzi, L., & Kontschieder, P. (2024). *Revising Densification in Gaussian Splatting*. **ECCV 2024** (`arXiv:2404.06109`).
   - Kheradmand, S., Rebain, D., Sharma, G., Sun, W., Tseng, Y.-C., Isack, H., Kar, A., Tagliasacchi, A., & Yi, K. M. (2024). *3D Gaussian Splatting as Markov Chain Monte Carlo*. **NeurIPS 2024 (Spotlight)** (`arXiv:2404.10578`).
   - Mallick, S. S., Goel, R., Kerbl, B., Carrasco, F. V., Steinberger, M., & De La Torre, F. (2024). *Taming 3DGS: High-Quality Radiance Fields with Limited Resources*. **SIGGRAPH Asia 2024** (`arXiv:2406.15643`).
2. **極速多解析排程與渲染穩定性 (CVPR 2025 / SIGGRAPH 2024)**
   - Chen, Y., Jiang, J., Jiang, K., Tang, X., Li, Z., Liu, X., & Nie, Y. (2025). *DashGaussian: Optimizing 3D Gaussian Splatting in 200 Seconds*. **CVPR 2025 (Highlight)** (`arXiv:2503.18402`).
   - Radl, L., Steiner, M., Parger, M., Weinrauch, A., Kerbl, B., & Steinberger, M. (2024). *StopThePop: Sorted Gaussian Splatting for View-Consistent Real-time Rendering*. **ACM TOG / SIGGRAPH 2024**.
   - Yu, Z., Chen, A., Huang, B., Sattler, T., & Geiger, A. (2024). *Mip-Splatting: Alias-free 3D Gaussian Splatting*. **CVPR 2024 (Best Student Paper)** (`arXiv:2311.16493`).
3. **表面重建、反射解耦與 2025–2026 幾何理論 (CVPR / NeurIPS / SIGGRAPH Asia / ECCV 2026)**
   - Wang, S., & Miller, D. J. (2026). *When 3D Gaussian Splatting Recovers Real Surfaces*. Accepted to **ECCV 2026** (`arXiv:2608.30054`).
   - Tang, J., et al. (2025). *Ref-GS: Directional Factorization for 2D Gaussian Splatting*. **CVPR 2025** (`arXiv:2412.00905`); Xie, T., et al. (2024). *Spec-Gaussian: Anisotropic View-Dependent Appearance for 3D Gaussian Splatting*. **NeurIPS 2024** (`arXiv:2402.15870`); Xie, T., et al. (2025). *EnvGS: Modeling View-Dependent Appearance with Environment Gaussian*. **CVPR 2025** (`arXiv:2412.15215`).
   - Yu, Z., Sattler, T., & Geiger, A. (2024). *Gaussian Opacity Fields (GOF)*. **ACM TOG / SIGGRAPH Asia 2024**; Chen, D., et al. (2024). *PGSR*. **IEEE TVCG** (`arXiv:2406.06521`); Zhang, B., et al. (2024). *RaDe-GS* (`arXiv:2406.01467`).
   - *2025–2026 Densification/Coreset/Init*: **Birth-Death 3DGS** (`arXiv:2610.34344`, Code: `quanth238/birth-death-3dgs`); **Provable Pruning via Coresets** (`arXiv:2607.02721`, Code: `waseem-m/3dgs_provable_coresets`); **EDGS** (`arXiv:2504.13204`).
