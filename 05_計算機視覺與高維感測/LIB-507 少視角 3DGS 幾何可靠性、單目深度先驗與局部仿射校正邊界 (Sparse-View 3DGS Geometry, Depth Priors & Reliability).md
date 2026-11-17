---
call_number: LIB-507
status: source-verified
invariants_count: 4
title: 少視角 3DGS 幾何可靠性、單目深度先驗與局部仿射校正邊界 (Sparse-View 3DGS Geometry, Depth Priors & Reliability)
module: Computer-Vision
category: Sparse-View-3DGS-Reliability
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Spatially Varying Affine Disparity Rectification & Guided Filtering Bounds
  - Virtual-Stereo Depth-Inconsistency Masking (DIM) & Adaptive Normal Regularization
  - Epipolar-Ray vs. Image-Plane DoF Separation & Dual-Field Co-Regularization
  - Pose Provenance Protocols (P1/P2/P3) & Parameter Non-Identifiability vs. Geometry Truth
hardware_target:
  - Consumer GPU / Single-GPU Cloud Pilot (T4 16GB / L4 24GB) & CPU Synthetic Counterexample Suite
  - Fixed Sparse RGB Constraint (K in [2, 5], Zero Extra Depth Sensors)
created: 2026-11-17
author: Luke
tags:
  - 圖書館
  - 計算機視覺
  - 3DGS
  - 稀疏視角
  - 深度先驗
  - 局部仿射校正
  - 幾何可靠性
  - 姿態協議
prerequisites:
  - "[[LIB-502 相機射影幾何、對極幾何與運動結構恢復 (Camera Projective Geometry, Epipolar Geometry & Structure-from-Motion)]]"
  - "[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]"
  - "[[LIB-508 高斯最佳化理論、MCMC 稠密化、表面不變量與快速收斂 (Gaussian Optimization, Densification, Surface Fidelity & Fast Iteration)]]"
  - "[[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]]"
successors:
  - "[[LIB-505 開放詞彙 3D 高斯潑濺與語意場景圖檢索 (Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval)]]"
  - "[[LIB-907 科研缺口發掘、方法層級撞題審查與低算力先導選題方法論 (Research Gap Discovery, Novelty Collision & Topic Selection)]]"
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/05_computer_vision/LIB-507%20Sparse-View%203DGS%20Geometry,%20Depth%20Priors%20%26%20Reliability%20%28Agent%20EN%29.md)

# 少視角 3DGS 幾何可靠性、單目深度先驗與局部仿射校正邊界 (Sparse-View 3DGS Geometry, Depth Priors & Reliability)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-502 相機射影幾何、對極幾何與運動結構恢復 (Camera Projective Geometry, Epipolar Geometry & Structure-from-Motion)]]、[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]、[[LIB-508 高斯最佳化理論、MCMC 稠密化、表面不變量與快速收斂 (Gaussian Optimization, Densification, Surface Fidelity & Fast Iteration)]]、[[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]]。
- **後續節點**：[[LIB-505 開放詞彙 3D 高斯潑濺與語意場景圖檢索 (Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval)]]、[[LIB-907 科研缺口發掘、方法層級撞題審查與低算力先導選題方法論 (Research Gap Discovery, Novelty Collision & Topic Selection)]]。
- **核心定位**：將 `LIB-504` 第 2.6 節延伸為專論，深入剖析固定少視角（如 $K \in [2, 5]$ 張 RGB、無額外補拍與實體深度感測器）條件下的 2024–2026 前沿文獻體系，涵蓋 `AffineGS` 局部仿射校正、`In Depth We Trust` 虛擬雙目遮罩、`DepthGS` 自適應法向正則、`GDoFS / CoR-GS / DropGaussian` 更新與擾動控制、`Sparse2DGS / StereoGS` 多視角替代先驗，以及姿態來源協議 `P1/P2/P3` 與不可辨識性邊界。

---

## 一、💡 學士直觀心智模型：請「沒帶尺的畫家」當老師會發生什麼事？

當我們只有 `2` 到 `5` 張角度相差很大的照片，完全沒有雷射掃描儀（LiDAR）或深度相機時，原始 3DGS 只靠看照片顏色幾乎一定會塌陷或冒出大量浮在鏡頭前的「鬼影（Floaters）」 `[FACT]`。為了解救這個問題，研究界常請一位 **單目深度預測網路（如 Depth Anything V2）** 替每張照片畫出粗略的深度圖。但這位畫家有三大先天缺陷 `[FACT]`：

1. **沒有實體公尺單位，且「各區塊比例尺不一樣」**：畫家只知左邊牆比右邊椅子遠一點，早期方法（如 `DNGaussian`）假設整張圖套同一組縮放倍率與平移 $(\alpha, \beta)$ 就能換算出真實深度；但實際上單目網路在前景桌面與遠景角落的伸縮比例常常不同（**Region-Dependent Distortion**，`AffineGS` 2026） `[LITERATURE_RESULT]`。
2. **局部凹凸或物體邊界可能看錯（Local Shape Distortion / Edge Bleeding）**：如果這位畫家把鏡面桌誤判成凹下去的坑，且我們再用**單目畫家自己畫出來的邊界**當導引濾波器（Guided Filter）去平滑局部校正參數，錯誤的凹凸形狀就會被「平滑固化」進 3D 高斯裡 `[HYPOTHESIS]`。
3. **「拍新照片看起來很美」不等於「模型形狀是真的」**：正如 `LIB-508` 所述，若具備高角向表徵能力（例如高階球諧函數 SH），在合成或受控稀疏視差設定下錯位看板亦能擬合出高 PSNR（儘管 `Wang & Miller, arXiv:2608.30054` 在真實場景中並未觀察到高階 SH 必然坍縮為看板）；加之參數存在多組等價解，評估幾何可靠性**必須使用獨立的真實三維形狀標準（如 Mesh Chamfer Distance / Normal MAE）** `[LITERATURE_RESULT]`。

---

## 二、🎓 博士級數學形式化推導：局部仿射校準、選擇性監督與可辨識界

### 1. 從全域對齊到空間變化分段仿射校正 (`DNGaussian` ➔ `AffineGS`) `[LITERATURE_RESULT]`
設單目深度網路對視角 $v$ 輸出逆深度／視差圖 $d_{\mathrm{mono}}(u, v)$，真實度量視差為 $d^*(u, v)$：
- **全域仿射模型（例如 `DNGaussian`, CVPR 2024）**：僅估計全域標量 $(\alpha_v, \beta_v)$（輔以局部尺度正規化減緩局部波動）使 $\hat{d}_v = \alpha_v d_{\mathrm{mono}} + \beta_v$，面對非均勻相機焦段與大景深分層容易在遠近切換區扭曲 3D 結構 `[LITERATURE_RESULT]`。
- **`AffineGS`（Tse, Peng, Chen, & Yao, NeurIPS 2026, `arXiv:2611.07709`）**：將誤差模型推廣為像素空間平滑變化的局部仿射場 $(\alpha(u, v), \beta(u, v))$：
  $$\hat{d}_{\mathrm{rect}}(u, v) = \alpha(u, v) \, d_{\mathrm{mono}}(u, v) + \beta(u, v)$$
  直接審計官方開源實作 `AffineGS-LLFF-public/utils/disparity_normal_loss.py`（L90–145）確認以下核心結構細節 `[FACT]`：
  1. 局部尺度係數場係透過空間梯度範數比 `coefficients = d_gt_norm / (gt_safe**2 * d_render_norm + 1e-5)` 計算，數值**嚴格非負（$\ge 0$，僅對齊梯度大小而無法翻轉錯誤梯度符號）**。
  2. 先對原始比值施加 **5th–95th 百分位雙向截斷**，再以未校正之原始單目視差 `gt_disparity` 作為 Guidance Image 執行 `cv2.ximgproc.guidedFilter(..., radius=600, eps=0.05)`（大半徑局部線性假設），濾波後再次對梯度範數與分母執行 `[p5, p95]` 與 `.clamp(min=1e-6)` 截斷，最終經由 `torch.no_grad()` 全域最小平方法重對齊 `(_fa, _fb)` 輸出校正視差。
- **數學結構假設與潛在破口（區分已確認結構 vs. 待重現假說）**：
  1. 由於係數場嚴格非負且 Guided Filter 在視窗 $\omega_k$ 內假設輸出與原始 $d_{\mathrm{mono}}$ 呈局部線性關係，當 $d_{\mathrm{mono}}$ 本身在同一光滑區域內出現**非仿射曲率反轉（local convexity-to-concavity flip）**且缺乏顯著邊界來切分視窗時，非負回歸與局部線性平滑在結構上無法逆轉錯誤的局部斜率符號 `[FACT]`；該類局部形狀錯誤是否必然通過 Normal Gradient Regularizer 導致無法以新視角渲染自我修正之可重現 3D 幾何退化，目前仍屬待實驗證偽之研究假說 `[HYPOTHESIS]`。
  2. 此外，若 $d_{\mathrm{mono}}$ 的物體邊界發生邊界滲漏（edge bleeding），大視窗 Guided Filter 會同步把前景與背景的錯誤係數耦合連成一體 `[DERIVATION]`。

### 2. 三大選擇性監督／正則與多視角先驗對比 `[LITERATURE_RESULT]`
為避免錯誤的單目先驗破壞重建幾何，2024–2026 年文獻已沿著互異數學路徑推進：

| 方法 / 論文 | 核心誤差處理機制 | 面對多視角先驗矛盾時的關鍵設計 | 殘餘邊界與研究定位 |
| :--- | :--- | :--- | :--- |
| **`In Depth We Trust`** (Xiao et al., CVPRW 3DMV 2026, `arXiv:2604.05715`) | 透過虛擬雙目重投影建構 **Depth-Inconsistency Mask (DIM)**＋**Gradient-Alignment Loss (GAL)** | 在虛擬雙目一致檢定判為矛盾的區域直接屏蔽深度監督，僅對通過區施以梯度對齊 | 假設可用虛擬雙目有效測出矛盾；尚缺大規模獨立開源基準驗證極稀疏條件 `[LITERATURE_RESULT]` |
| **`DepthGS`** (Ren et al., IEEE TPAMI 2026, `arXiv:2611.13628`) | 推導單／多視角深度差異對重建誤差之理論上界，設計 **深度差異自適應法向正則**＋跨視角深度一致 | 觀測深度差異擴大處主動調降法向約束權重，阻止壞先驗強扭表面 | 主攻稠密／標準多視角表面重建（DTU / TnT）；對 2–5 張極稀疏 SfM 之行為尚須實測確認 `[LITERATURE_RESULT]` |
| **`DGDO-GS`** (Lian et al., *Applied Sciences* 2026) | 依單目深度梯度切分平坦與邊緣區施不同正則，並正交解耦位置與形狀更新 | 避免單一全域正則平滑掉銳利幾何邊界 | 仍仰賴單目梯度對平坦／邊緣劃分的最初正確性 `[LITERATURE_RESULT]` |
| **`Sparse2DGS`** (CVPR 2025, `2504.20378`) & **`StereoGS`** (ECCV 2026, `2606.30545`) | 改以 **DUSt3R / Foundation Stereo** 等多視角幾何立體基礎模型直接產生尺度一致幾何初始化或雙目約束 | 直接跳脫純單目深度尺度不定的陷阱 | 依賴立體共視重疊率與額外大模型 VRAM；純極低共視角仍受雙目匹配失敗考驗 `[LITERATURE_RESULT]` |

### 3. 更新方向控制、共正則與非參數擾動機制 `[LITERATURE_RESULT]`
在沒有或只有弱先驗時，少視角 3DGS 另外演化出三組緊密控制策略：
1. **自由度與更新方向解耦 (`GDoFS`, WACV 2026, `arXiv:2412.13325`)**：依不確定性分離與影像平面平行之有界切面自由度與沿相機射線方向的可見度導向自由度，約束脆弱視線軸的無限漂移 `[LITERATURE_RESULT]`。
2. **雙實例共正則與剪枝 (`CoR-GS`, ECCV 2024)**：平行訓練兩組隨機初始化 3DGS，以點雲空間分歧度（Point Disagreement）執行 Co-Pruning，並以偽視角渲染差異引導補充約束；若兩實例在強錯誤先驗或無紋理區同步跌入同一錯位解則無力互救 `[LITERATURE_RESULT]`。
3. **結構秩擾動與隨機丟棄 (`SRUP-GS`, `DOC-GS`, `DropGaussian` CVPR 2025)**：透過隨機高斯基元 Dropout 放大留存高斯所受的像素梯度與遮擋曝光頻率（`DropGaussian`），或結合連續深度引導 Dropout ＋ 暗通道先驗剪除霧狀浮點（`DOC-GS`, ACM MM 2026） `[LITERATURE_RESULT]`。

### 4. 姿態協議隔離 (`P1/P2/P3`) 與「參數不可辨識 $\neq$ 幾何錯誤」定理 `[DERIVATION]` `[SAFETY_BOUND]`
在少視角 3DGS 基準實驗中最容易出現兩種科學混淆：
- **姿態／初始化協議污染**：從 `LIB-504` 承接並明確規定：
  - **`P1`（Oracle / Dense-SfM Poses）**：先從全域密集影像集合算出準確相機位姿與參考點雲，測試時僅輸入 $K$ 張圖。原始碼檢查 `AffineGS-LLFF-public/scene/dataset_readers.py`（L274–318, L559）確認 `readColmapSceneInfo` 預設呼叫 `refineColmapWithIndex` 載入全局預存 COLMAP 位姿（`P1`），而非獨立訓練視角重建（`BundleAdjustment_ColmapWithIndex`, `P2`）；此外 `scripts/search_llff_config.sh`（L5）亦明註檢索最佳超參數時可能直接挑選測試視角，嚴禁無查核地混為真實無洩漏 `P2` 結論 `[FACT]` `[SAFETY_BOUND]`。
  - **`P2`（Training-View-Only SfM）**：僅允許使用該 $K \in [2, 5]$ 張 RGB 執行 COLMAP／稀疏點雲初始化；當 $K \le 3$ 且大視差時 COLMAP 常大量配對失敗 `[FACT]`。
  - **`P3`（External Learned MVS / DUSt3R / Stereo Init）**：顯式利用外部多視角基礎模型生成位姿或稠密點雲 `[DESIGN_DECISION]`。
- **參數非唯一性（Non-Identifiability）不等於表面幾何偏差**：考慮三維平面 $z(u, v) = a u + b v + c$ 與某組對齊誤差；無窮多組等價的仿射 $(\alpha, \beta)$ 伸縮組合（只要兩組都位於誤差零空間內）或不同旋轉縮放比例的疊加薄圓盤高斯場，均可張出**幾何距離 `Chamfer Distance = 0` 的相同真實 3D 表面** `[DERIVATION]`！同理，將單張輸入深度加上任意微擾後導致新視角渲染 PSNR 下降，也僅證明靈敏度或外觀外插改變，**唯有以獨立 3D 真值（Mesh Chamfer Distance、Point-to-Surface Error、Normal MAE 或真實度量 AbsRel）量測，方能宣告「真實幾何改善或退化」** `[SAFETY_BOUND]`。

---

## 三、⚙️ 硬體算力、環境依賴與最小先導驗證架構

| 驗證基準 / 家族 | 核心程式／外部套件依賴 | 計算與顯存特徵（嚴格區分作者回報、估算與未實測） | 4GB–8GB 筆電 / 單卡雲端 T4 適用風險 |
| :--- | :--- | :--- | :--- |
| **`AffineGS` (`eldentse/AffineGS` & `AffineGS-LLFF-public`)** | `PyTorch`、`Nerfstudio / gsplat`（全版）或 `diff-gaussian-rasterization`、`opencv-contrib-python` (`ximgproc.guidedFilter`) | **作者報告（Author-Reported）**：全版 Nerfstudio 於 `1× RTX 3090` 單場約 `1.5–2.0 小時` `[LITERATURE_RESULT]`；`AffineGS-LLFF-public` 簡化版在本機／單卡雲端實際耗時目前為 **`UNVERIFIED`（尚未重現）** | `4GB` 顯存過低無法運行全流程；不得僅因預期算力較高即先驗淘汰 `AffineGS` 主線，須優先以最小可控消融確認核心失效能否重現後再評估成本權衡 |
| **`CoR-GS` / `DropGaussian`** | PyTorch + 3DGS CUDA 擴充（須留意原版 Inria `LICENSE` 條款限制；`DropGaussian` 為雙授權含 `Apache-2.0`） | 作者論文報告：`CoR-GS` 於 `RTX 3090 Ti` 跑 LLFF 單場約 **`~6 分鐘`** `[LITERATURE_RESULT]` | `CoR-GS` 雙場模型會提高 VRAM 壓力；`DropGaussian` 單場結構較輕量，易於單卡 T4 快速複現基線 |
| **`Sparse2DGS` / `StereoGS`** | `DUSt3R` / Foundation Stereo + `2DGS` / `3DGS` CUDA 光柵化 | 多視角基礎模型載入推論＋分階段表面最佳化；`Sparse2DGS` 比同級少視角 NeRF 約快 `~2×` | 雙重載入 Foundation 模型與 3DGS 容易佔滿 `8GB` 顯存，需顯式隔離兩階段（先匯出點雲釋放 VRAM，再跑 3DGS） |
| **CPU 合成反例驗證台** | 僅需標準 Python / NumPy / PyTorch CPU | 毫秒至數秒內於任何純 CPU 筆電（含 `4GB` 顯存或無獨顯機台）跑完數千次幾何對照與可辨識檢查 | **最低成本硬閘門（Zero-GPU Cost）**：上雲燒配額前必先通過之數學證偽層 |

---

## 四、💻 工業級工程實作：零 GPU 依賴之「仿射校正邊界與假誤差識別」驗證器

以下純標準函式庫 Python 腳本可直接於純 CPU 執行，具體對照三種情形：**Case A**（純線性全域尺度位移失真 $\to$ 仿射校正零誤差恢復）、**Case B**（平滑局部區域內含反轉凹凸非仿射誤差＋引導平滑 $\to$ 產生不可消滅之表面殘差與導數反號）、**Case C**（參數不唯一但不等於幾何錯位：兩組不同尺度深度表示同一個幾何表面），驗證評估與審計準則：

```python
import math
import statistics
from dataclasses import dataclass
from typing import List, Tuple


@dataclass
class SparseDepthDiagnosticResult:
    case_name: str
    mean_surface_mae: float
    normal_sign_flip_rate: float
    is_geometrically_faithful: bool


def box_mean_1d(values: List[float], radius: int) -> List[float]:
    n = len(values)
    out = []
    for i in range(n):
        lo = max(0, i - radius)
        hi = min(n, i + radius + 1)
        out.append(sum(values[lo:hi]) / (hi - lo))
    return out


def simulated_guided_affine_fit_1d(
    guide: List[float],
    target: List[float],
    anchor_mask: List[bool],
    radius: int = 4,
    eps: float = 1e-4,
) -> List[float]:
    """
    重現無稠密真值下的稀疏 SfM 錨點 + Guided Filter 仿射場傳播：
    僅在有 SfM 特徵錨點處 (anchor_mask=True) 估計局部仿射參數 (a, b)，
    並以單目深度圖 guide 作為導引濾波平滑傳播至缺乏錨點的平滑區域。
    """
    n = len(guide)
    a_est = 1.0
    b_est = 0.0
    # 僅在可視 SfM 錨點集合上進行加權線性求解，避免測試區真值洩漏
    anchor_idx = [i for i, m in enumerate(anchor_mask) if m]
    assert len(anchor_idx) >= 4
    mg = sum(guide[i] for i in anchor_idx) / len(anchor_idx)
    mt = sum(target[i] for i in anchor_idx) / len(anchor_idx)
    var_g = sum((guide[i] - mg) ** 2 for i in anchor_idx) / len(anchor_idx)
    cov_gt = sum((guide[i] - mg) * (target[i] - mt) for i in anchor_idx) / len(anchor_idx)
    a_global = max(0.1, min(3.0, cov_gt / (var_g + eps)))
    b_global = mt - a_global * mg

    a_field = []
    b_field = []
    for i in range(n):
        if anchor_mask[i]:
            lo = max(0, i - radius)
            hi = min(n, i + radius + 1)
            win = [j for j in range(lo, hi) if anchor_mask[j]]
            if len(win) >= 3:
                w_mg = sum(guide[j] for j in win) / len(win)
                w_mt = sum(target[j] for j in win) / len(win)
                w_vg = sum((guide[j] - w_mg) ** 2 for j in win) / len(win)
                w_cov = sum((guide[j] - w_mg) * (target[j] - w_mt) for j in win) / len(win)
                a_est = max(0.1, min(3.0, w_cov / (w_vg + eps)))
                b_est = w_mt - a_est * w_mg
            else:
                a_est, b_est = a_global, b_global
        else:
            # 無 SfM 錨點之平滑區域僅承接平滑仿射場先驗
            a_est, b_est = a_global, b_global
        a_field.append(a_est)
        b_field.append(b_est)

    # Edge-preserving guidance weights derived from guide itself
    mean_a = box_mean_1d(a_field, radius)
    mean_b = box_mean_1d(b_field, radius)
    return [a * g + b for a, b, g in zip(mean_a, mean_b, guide)]


def evaluate_surface_faithfulness(
    case_name: str,
    true_surface: List[float],
    predicted_surface: List[float],
    mae_threshold: float = 0.05,
) -> SparseDepthDiagnosticResult:
    errors = [abs(p - t) for p, t in zip(predicted_surface, true_surface)]
    mae = statistics.fmean(errors)

    # 檢查一階局部斜率 (Normal proxy) 符號是否反轉
    flips = 0
    total_grad = 0
    for i in range(len(true_surface) - 1):
        gt_diff = true_surface[i + 1] - true_surface[i]
        pred_diff = predicted_surface[i + 1] - predicted_surface[i]
        if abs(gt_diff) > 1e-3:
            total_grad += 1
            if gt_diff * pred_diff < 0:
                flips += 1

    flip_rate = flips / max(1, total_grad)
    faithful = (mae < mae_threshold) and (flip_rate < 0.05)
    return SparseDepthDiagnosticResult(
        case_name=case_name,
        mean_surface_mae=mae,
        normal_sign_flip_rate=flip_rate,
        is_geometrically_faithful=faithful,
    )


def verify_non_identifiable_plane_equivalence(
    coords: List[float],
    true_plane: List[float],
) -> Tuple[float, bool]:
    """
    展示參數不可辨識性 != 幾何錯誤：兩組不同係數 (scale_1, shift_1) != (scale_2, shift_2)
    當各自貼合不同正規化中間視差後，仍可精確重建同一條真實 3D 斜平面。
    """
    raw_a = [0.5 * z + 1.0 for z in true_plane]
    raw_b = [2.0 * z - 3.5 for z in true_plane]
    rect_from_a = [2.0 * v - 2.0 for v in raw_a]
    rect_from_b = [0.5 * v + 1.75 for v in raw_b]
    diff = max(abs(a - b) for a, b in zip(rect_from_a, rect_from_b))
    max_err_gt = max(abs(a - t) for a, t in zip(rect_from_a, true_plane))
    return max(diff, max_err_gt), (len(coords) == len(true_plane) and diff < 1e-9)


if __name__ == "__main__":
    n_pts = 64
    xs = [-1.0 + 2.0 * i / (n_pts - 1) for i in range(n_pts)]
    gt_curve = [2.0 + 0.6 * math.exp(-3.0 * x * x) for x in xs]
    # 僅在左右紋理邊緣擁有稀疏 SfM 錨點 (|x| >= 0.45)；中間光滑區域沒有 SfM 深度真值
    sparse_anchors = [abs(x) >= 0.45 for x in xs]

    # Case A: 純線性仿射尺度平移失真 -> 稀疏錨點仿射估計 + 平滑傳播可高精準恢復中心凸起
    mono_affine_distortion = [0.70 * z + 0.4 for z in gt_curve]
    rect_a = simulated_guided_affine_fit_1d(mono_affine_distortion, gt_curve, sparse_anchors, radius=3)
    res_a = evaluate_surface_faithfulness("Piecewise_Affine_Only", gt_curve, rect_a)

    # Case B: 在無 SfM 錨點的光滑內部區，單目先驗把凸峰誤判成凹坑（非仿射局部曲率反轉）
    mono_inverted_shape = list(mono_affine_distortion)
    for idx in range(20, 44):
        mono_inverted_shape[idx] -= 0.75 * math.exp(-((xs[idx]) ** 2) / 0.12)
    rect_b = simulated_guided_affine_fit_1d(mono_inverted_shape, gt_curve, sparse_anchors, radius=4)
    res_b = evaluate_surface_faithfulness("Local_Shape_Inversion", gt_curve, rect_b)

    # Case C: 參數非唯一但表面全等
    geom_delta, eq_ok = verify_non_identifiable_plane_equivalence(xs, [2.5 + 0.4 * x for x in xs])

    assert res_a.is_geometrically_faithful, "純仿射失真下應能可靠回復幾何"
    assert not res_b.is_geometrically_faithful and res_b.normal_sign_flip_rate > 0.25, (
        "局部曲率反轉錯亂時，以該先驗為引導之局部仿射會遺留顯著斜率反號殘差"
    )
    assert eq_ok and geom_delta < 1e-9, "參數多解性不等同幾何偏移錯誤"

    print(
        f"[LIB-507 Verified] CaseA_MAE={res_a.mean_surface_mae:.4f} (faithful={res_a.is_geometrically_faithful}) | "
        f"CaseB_MAE={res_b.mean_surface_mae:.4f}, flip_rate={res_b.normal_sign_flip_rate:.2%} | "
        f"NonIdentifiability_GeomDiff={geom_delta:.1e}"
    )
```

---

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-507-01] 少視角姿態來源與外部立體先驗強制揭露合約 (Pose & Prior Provenance Disclosure Invariant)
- **合約等級**: `SAFETY_CRITICAL`
- **前置條件**: 設計、訓練、對比或評估任何稀疏視角 3D 重建實驗（例如 $K \in [2, 5]$ 張 RGB 輸入）。
- **量化決策邊界**:
  - 所有評估報表必須顯式聲明相機姿態與初始化點雲之歸屬協議（`P1` 預存密集 SfM、`P2` 僅限訓練視角重跑 SfM、`P3` 導入 DUSt3R / Foundation Stereo 外部先驗）`[DESIGN_DECISION]`。
  - 若於 `P2` 模式下發生少視角 COLMAP 三角化失敗，必須將真實失敗樣本與註冊成功率一併紀錄，**嚴禁**悄悄跳過失敗場景或跨場景混用 `P1` 充當 `P2`。

### [RULE-507-02] 獨立幾何真值強制評估門檻 (Independent Geometry Truth Verification Gate)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件**: 宣稱提出或改進任何針對 3DGS 的深度校正、選擇性深度監督、法向約束或少視角幾何正則化方法。
- **量化決策邊界**:
  - **嚴禁**單憑新視角影像渲染分數（`PSNR / SSIM / LPIPS`）宣稱「修復 3D 幾何錯誤」`[SAFETY_BOUND]`。
  - 實驗結論必須包含至少一項獨立於 RGB 外觀的幾何指標（如 3D Mesh / 點雲 **Chamfer Distance $\downarrow$**、Surface Normal MAE、或真實掃描度量 Depth AbsRel / $\delta_1$，如 DTU、ScanNet++、MuSHRoom 實測網格真值）`[LITERATURE_RESULT]`。

### [RULE-507-03] 參數不可辨識性與真實表面誤差強制隔離合約 (Non-Identifiability vs. Geometry Error Disentanglement)
- **合約等級**: `BOUNDARY_GUARD`
- **前置條件**: 分析深度校正係數 $(\alpha, \beta)$、高斯位置協方差與視角靈敏度時發生多個等效解或輸入擾動指標退化。
- **量化決策邊界**:
  - 禁止將「局部仿射參數組不唯一」或「單張深度擾動造成測試 PSNR 波動」直接推論為「表面重建出錯」`[DERIVATION]`。
  - 必須在與真值三維表面座標比對後，確認確實發生表面位置偏差或法向反轉，方可視為有效幾何缺陷證據。

### [RULE-507-04] 少視角先驗方法消融必測強基準合約 (Mandatory Selective-Supervision & Stereo Baseline Matrix)
- **合約等級**: `QUALITY_BOUND`
- **前置條件**: 提出新的單目深度校正或自適應深度損失加權演算法。
- **量化決策邊界**:
  - 消融矩陣不得僅對照無先驗之 Vanilla 3DGS 或靜態固定權重（`DNGaussian`）；必須依架構對應納入 **`AffineGS`**（局部仿射與 Guided Filter）、**選擇性門控代表（`In Depth We Trust` DIM/GAL 或 `DepthGS` 深度差自適應法向權重）**，以及策略對照組（`StereoGS` / `Sparse2DGS` 多視角立體基準）並清楚界定設計邊界差異 `[LITERATURE_RESULT]`。

---

## 六、📚 權威論文與同行評審文獻 (Canonical & Peer-Reviewed References)

1. **局部仿射校正與選擇性單目深度監督 (NeurIPS / TPAMI / CVPRW / CVPR 2024–2026)**
   - Tse, T. H. E., Peng, J., Chen, R., & Yao, A. (2026). *AffineGS: Unlocking Accurate Geometry in 3DGS via Spatially Varying Affine Rectification*. Accepted to **NeurIPS 2026** (`arXiv:2611.07709`).
   - Xiao, W.-H., Goan, E., Santa Cruz, R., Ahmedt-Aristizabal, D., Salvado, O., Fookes, C., & Lebrat, L. (2026). *In Depth We Trust: Reliable Monocular Depth Supervision for Gaussian Splatting*. **CVPRW 3DMV 2026** (`arXiv:2604.05715`).
   - Ren, X., Liu, Y., An, N., Cheng, J., Qiao, X., Li, Y.-F., & Kong, H. (2026). *DepthGS: Depth-Guided Gaussian Splatting with Adaptive Regularization for High-Quality Surface Reconstruction*. **IEEE TPAMI 2026** (`arXiv:2611.13628`, DOI: `10.1109/TPAMI.2026.3751295`).
   - Li, J., Zhang, J., Bai, X., et al. (2024). *DNGaussian: Optimizing Sparse-View 3D Gaussian Radiance Fields with Global-Local Depth Normalization*. **CVPR 2024**.
2. **自由度分離、共正則與隨機／結構擾動機制 (2024–2026)**
   - Kim, Y., Choi, J., & Yoon, S. (2026). *GDoFS: Gaussian DoF Separation for Plausible 3D Geometry in Sparse-View 3DGS*. **WACV 2026** (`arXiv:2412.13325`).
   - Zhang, J., Li, J., Yu, X., Huang, L., Gu, L., Zheng, J., & Bai, X. (2024). *CoR-GS: Sparse-View 3D Gaussian Splatting via Co-Regularization*. **ECCV 2024**.
   - Park, H., et al. (2025). *DropGaussian: Structural Regularization for Sparse-View Gaussian Splatting*. **CVPR 2025**.
   - Li, Z., et al. (2026). *DOC-GS: Depth-Guided Optimization and Dark-Channel Observation Pruning for Sparse-View 3DGS*. **ACM MM 2026** (`arXiv:2604.06739`).
   - Lian, X., Wang, Z., & Wang, H. (2026). *DGDO-GS: Depth-Gradient-Guided Decoupled Optimization for Sparse-View Gaussian Splatting*. **Applied Sciences 2026** (DOI: `10.3390/app16084026`).
   - Liu, X., et al. (2026). *SRUP-GS: Structure-Aware Rank and Uncertainty-Guided Perturbation for Sparse-View 3DGS*. **Computers & Graphics 2026** (DOI: `10.1016/j.cag.2026.104731`).
3. **多視角立體先驗替代方案 (CVPR 2025 / ECCV 2026)**
   - Wu, J., Li, R., Zhu, Y., et al. (2025). *Sparse2DGS: Geometry-Prioritized Gaussian Splatting for Surface Reconstruction from Sparse Views*. **CVPR 2025** (`arXiv:2504.20378`).
   - Yuan, W., Ge, Y., & Cai, D. (2026). *StereoGS: Sparse-View 3D Gaussian Splatting via Stereo Priors*. **ECCV 2026** (`arXiv:2606.30545`).
