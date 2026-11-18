---
call_number: LIB-503
status: source-verified
invariants_count: 4
title: 現代物件偵測架構、定位不確定性與遮擋校準 (Modern Object Detection, Localization & Occlusion Reliability)
module: Computer-Vision
category: 2D-Object-Detection-and-Calibration
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Bipartite Hungarian Matching & Dense One-to-One Supervision (RT-DETR / DEIM)
  - Fine-grained Distribution Refinement (D-FINE FDR) & Edge Shannon Entropy
  - 2D Gaussian Wasserstein Distance (NWD) & Small-Object IoU Collapse
  - Detection Expected Calibration Error (D-ECE), LaECE & Two-Step Conformal Box Bounds
hardware_target:
  - NVIDIA T4 / Consumer 8GB GPU Real-Time Inference & CPU Post-hoc Calibration
  - CUDA Deformable Attention & Overlap Grid Slicing Trade-offs
created: 2026-11-17
author: Luke
tags:
  - 圖書館
  - 計算機視覺
  - 物件偵測
  - RT-DETR
  - D-FINE
  - 模型校準
  - 共形預測
  - 微小目標
  - 遮擋偵測
prerequisites:
  - "[[LIB-401 全連結網路空間極限與卷積神經網路理論必然性 (DNN Spatial Limits & CNN Inductive Bias)]]"
  - "[[LIB-405 注意力機制、Transformer 革命與位置編碼幾何 (Attention Mechanism & Transformer Revolution)]]"
  - "[[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]]"
  - "[[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]]"
successors:
  - "[[LIB-904 學術科研文獻體系與前沿研究對齊 (Academic Research Corpus & Literature Synthesis)]]"
  - "[[LIB-907 科研缺口發掘、方法層級撞題審查與低算力先導選題方法論 (Research Gap Discovery, Novelty Collision & Topic Selection)]]"
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/05_computer_vision/LIB-503%20Modern%20Object%20Detection,%20Localization%20%26%20Occlusion%20Reliability%20%28Agent%20EN%29.md)

# 現代物件偵測架構、定位不確定性與遮擋校準 (Modern Object Detection, Localization & Occlusion Reliability)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-401 全連結網路空間極限與卷積神經網路理論必然性 (DNN Spatial Limits & CNN Inductive Bias)]]、[[LIB-405 注意力機制、Transformer 革命與位置編碼幾何 (Attention Mechanism & Transformer Revolution)]]、[[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]]、[[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]]。
- **後續節點**：[[LIB-904 學術科研文獻體系與前沿研究對齊 (Academic Research Corpus & Literature Synthesis)]]、[[LIB-907 科研缺口發掘、方法層級撞題審查與低算力先導選題方法論 (Research Gap Discovery, Novelty Collision & Topic Selection)]]。
- **核心定位**：填補 2D 影像前處理（LIB-501）與高階科研文獻（LIB-904）之間欠缺的「**現代即時端對端物件偵測理論、困難幾何失效剖析與偵測專項校準**」。涵蓋即時 Transformer 偵測譜系（`RT-DETR`、`D-FINE`、`DEIM`、`RF-DETR`）、微小目標 IoU 崩塌（`NWD` / `RFLA` / `DQ-DETR`）、密集擁擠遮擋與 Amodal 分割邊界辨析，以及 `LaECE` 定位感知校準與統計共形預測區間。

---

## 一、💡 學士直觀心智模型：為什麼「猜對類別」卻「畫錯框」比想像中更危險？

想像一台自動駕駛車輛的車載相機正看著前方車陣：
1. **傳統標量框的盲區**：傳統 YOLO 或早期 DETR 直接輸出四個數字 $(x_1, y_1, x_2, y_2)$ 與「汽車機率 `0.92`」。假設目標車輛的左側車身清晰可見，但右側被一輛貨車徹底擋住。這四個數字無法告訴下游規劃器：「**我左邊線 100% 確定，但右邊線完全是猜的，可能誤差高達兩公尺！**」
2. **微目標的「一像素懸崖」**：對於畫面上只佔 $8 \times 8$ 像素的高空航拍或遠距交通號誌，偵測框稍微向左上方歪了區區 $2$ 像素，交併比（`IoU`）就可能瞬間暴跌超過 $50\%$ 甚至歸零 `[FACT]`。如果訓練指派與匹配仍只看 `IoU`，模型會徹底喪失梯度訊號。
3. **非最大值抑制（NMS）與端對端集合預測的分水嶺**：傳統雙階段與多數 YOLO 依賴手工設計的 NMS 閾值消除重複框——在擁擠人潮中，固定 NMS 閾值會把重疊的兩個真實行人直接誤刪其一；而現代即時 DETR（如 `RT-DETR`、`D-FINE`、`DEIM`）透過二分圖一對一匹配（Hungarian Matching）消除 NMS，但若缺乏密集監督與位置分佈細修，極端遮擋仍會引發查詢飽和（Query Saturation）或雙人合併成單一巨大框（Merged Mega-Box）。

---

## 二、🎓 博士級數學形式化推導：端對端分佈精修、微目標 Wasserstein 度量與定位感知校準

### 1. 即時 DETR 演化譜系與 `D-FINE` 邊界機率分佈（FDR）
現代即時 Detection Transformer 的三大推進核心皆直指速度、定位精度與訓練匹配效率 `[LITERATURE_RESULT]`：
- **RT-DETR（Zhao et al., CVPR 2024）**：解耦多尺度融合（Efficient Hybrid Encoder，對高層特徵執行單尺度內部注意力 AIFI 後跨尺度融合 CCFF），並以 **Uncertainty-Minimal Query Selection** 篩選高分類與高定位聯合確定性的編碼器特徵初始化解碼器查詢，於 NVIDIA T4 FP16 達成 `108 FPS`（R50）實時無 NMS 推論 `[LITERATURE_RESULT]`。
- **DEIM（Huang et al., CVPR 2025）**：針對一對一匹配導致每張圖正監督樣本極稀疏之痛點，引入 **Dense O2O Matching** 配合 **Matchability-Aware Loss (MAL)**，在不改架構推論開銷下將訓練收斂週期大幅縮短 `[LITERATURE_RESULT]`；後續 **DEIMv2 (`arXiv:2509.20787`)** 與 **RF-DETR (`arXiv:2511.09554`, ICLR 2026)** 進一步引入視覺基礎模型表徵與權重共享架構搜尋 `[LITERATURE_RESULT]`。
- **D-FINE（Peng et al., ICLR 2025 Spotlight）之細粒度分佈精修（FDR）**：捨棄硬編碼點座標回歸，將每一解碼層 $l$ 對候選框四條邊界 $\{t, b, l, r\}$ 的殘差位移建構為 $K+1$ 個離散區間上的機率質量分佈 $\mathbf{p}_e^{(l)} \in \Delta^{K}$ `[LITERATURE_RESULT]`。最終邊界距離由分段期望加權積分解得 `[DERIVATION]`：
  $$\hat{d}_e^{(l)} = \hat{d}_e^{(l-1)} + H_{\text{box}} \sum_{k=0}^{K} w_k \, p_{e, k}^{(l)}, \qquad p_{e, k}^{(l)} = \mathrm{Softmax}\big(z_{e, k}^{(l)} + z_{e, k}^{(l-1)}\big)$$
  並配合 **GO-LSD（Global Optimal Localization Self-Distillation）** 將深層的邊界機率分佈作為教師傳回淺層，達到零額外推論成本。
  - **關鍵幾何不確定性訊號 `[DERIVATION]`**：對於每條獨立邊界 $e \in \{l, t, r, b\}$，其離散 FDR 分佈的香農熵（Shannon Entropy）：
    $$H(\mathbf{p}_e) = -\sum_{k=0}^{K} p_{e,k} \log \big(p_{e,k} + \varepsilon\big)$$
    直接量化該單側邊界的視覺模糊度與遮擋歧義，而不受其餘三側清晰邊界平均掩蓋。

### 2. 微小物件 `IoU` 崩塌與常態化高斯 Wasserstein 距離 (`NWD`) `[FACT]` `[DERIVATION]`
設預測框與真實框以中心 $(c_x, c_y)$、寬高 $(w, h)$ 參數化。對於極小物件（如 `AI-TOD` 之目標邊長 $\le 16\text{ px}$），亞像素或 $1\text{ px}$ 平移使 $\mathrm{IoU} \to 0$，造成 $\nabla \mathcal{L}_{\mathrm{IoU}} = \mathbf{0}$ 梯度消失 `[FACT]`。
Wang et al.（ICPR 2021）與 Xu et al.（`RFLA`, ECCV 2022）將邊界框內接橢圓建模為二維常態分佈 $\mathcal{N}_a = \mathcal{N}(\boldsymbol{\mu}_a, \boldsymbol{\Sigma}_a)$，其中 $\boldsymbol{\mu}_a = [c_{x,a}, c_{y,a}]^\top, \ \boldsymbol{\Sigma}_a = \mathrm{diag}(w_a^2/4, h_a^2/4)$，推得二階 Wasserstein 平方距離之閉式解 `[DERIVATION]`：
$$W_2^2(\mathcal{N}_a, \mathcal{N}_b) = \left\| \left[c_{x,a}, c_{y,a}, \frac{w_a}{2}, \frac{h_a}{2}\right]^\top - \left[c_{x,b}, c_{y,b}, \frac{w_b}{2}, \frac{h_b}{2}\right]^\top \right\|_2^2$$
再經指數映射常態化距離得處處光滑可微且對尺度變化具平滑響應之相似度（$C$ 為與資料集尺度相關的常數）：
$$\mathrm{NWD}(\mathcal{N}_a, \mathcal{N}_b) = \exp\left(-\frac{\sqrt{W_2^2(\mathcal{N}_a, \mathcal{N}_b)}}{C}\right) \in (0, 1]$$
當結合 `DQ-DETR`（Huang et al., ECCV 2024）以密度估計動態配置查詢數，或採用有重疊率網格切片（參照 `LIB-904` 之 `RULE-904-03`）時，方能防止高密度小目標因 Query 上限或降採樣濾除而大量漏檢 `[LITERATURE_RESULT]`。

### 3. 2D 遮擋框偵測 vs. Amodal 分割邊界辨析 `[FACT]`
在問題定義與評測指標上必須嚴格區分兩種常被誤混之任務：
- **2D Occlusion-Aware Object Detection**：針對擁擠遮擋實例輸出準確分離的可見框（Visible Box）或推估完整外接框（Full Box），基準如 `CrowdHuman`、`CityPersons`，核心痛點為匈牙利匹配塌陷、多實例合併巨大框（Mega-Box）與高 `Miss Rate (MR^-2)`；代表改進機制包含雙/多預測頭＋Set-NMS（`CrowdDet`, CVPR 2020）、密集區別查詢（`DDQ`, CVPR 2023）與顯式位置關係先驗（`Relation-DETR`, ECCV 2024）。
- **Amodal Instance Segmentation**：預測被前方遮擋物遮蔽區域背後的**像素級完整實例遮罩（Full Pixel Mask）**（如 `COCOA`, `SAIL-VOS`，代表如 `Amodal SAM`、`AURA`）。兩者輸出張量幾何空間與評分標準截然不同，不可跨任務混寫為同一基準 `[SAFETY_BOUND]`。

### 4. 偵測器校準陷阱與共形邊界框風險控制 (`ECCV 2024 Orals`) `[LITERATURE_RESULT]` `[DERIVATION]`
在 [[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]] 中，校準僅針對單一影像分類信心。將其遷移至物件偵測時面臨雙重挑戰：
1. **固定閾值 `D-ECE` 評估偏差與定位盲點（Kuzucu et al., ECCV 2024 Oral）**：
   - 傳統 `D-ECE` 先硬設分數門檻（如 `score >= 0.30`）過濾背景再以 `IoU >= 0.5` 二元判定命中。Kuzucu 等人證明不同架構的最優門檻截然不同，固定門檻會嚴重扭曲校準排名；且單純對分類機率做 Temperature Scaling 無法適應偵測中海量負樣本拒絕特性。
   - **定位感知校準（LaECE, Localization-aware ECE）** 以實例級精確率與定位重合度乘積取代純二元對錯，要求預測分數 $\hat{p}$ 同時校準「該框既屬正確類別 **且** 與真值存在高 IoU 重疊」之條件期望 `[LITERATURE_RESULT]`；實務強基準證實適切對接偵測標籤分配的 **Post-hoc Isotonic Regression / Platt Scaling** 可在無重訓前提下勝過複雜訓練期模型（如 `Cal-DETR`）。
2. **兩階段共形邊界框與概率化座標校準（Timans et al., ECCV 2024 Oral；Ries et al., COPA 2026 Oral）**：
   - **Timans et al. (2024, `arXiv:2403.07263`)** 先建構類別預測集合 $\mathcal{C}(X)$，再對已配對偵測框的四條座標施加殘差 $\hat{q}_\alpha$ 形成外擴安全區間 $\hat{\mathcal{B}}_\alpha$；**Ries et al. (COPA 2026 Oral, PMLR v329, `arXiv:2605.07549`, 程式碼 `mos-ks/OD-CP`)** 進一步在單物件與多物件偵測中，以 loss attenuation 訓練之**各向異性偶然不確定性（$\sigma_e$）** 直接縮放每條邊的 Split Conformal 殘差（搭配 Bonferroni $1-4\alpha$ 寬度擴展與兩階段 **RAPS** 類別集合），並於 **KITTI / BDD100K / CODA** 類別分層條件下達成相較未縮放 CP 基線 **`up to 19%` 較高 IoU 與 `39%` 較低 Interval Scores**（`AUTHOR_REPORTED`） `[LITERATURE_RESULT]`。因此，以預測異方差縮放各向異性座標級共形殘差**已是既有公開研究，不得誤列為尚未解決之原始創新** `[SAFETY_BOUND]`。
   - **邊際覆蓋、條件覆蓋與所有前提邊界（Marginal vs. Conditional Coverage & Statistical Preconditions）`[FACT]` `[DERIVATION]`**：上述標準 Split Conformal 方法的保證僅在以下嚴格前提同時滿足時成立 `[SAFETY_BOUND]`：(1) **僅作用於「已成功偵測且與真值配對的 True Positive 目標」**（後處理座標區間**絕對無法涵蓋漏檢的 False Negatives**，故必須獨立追蹤 Recall 與 `LRP Error`）；(2) **影像／場景級可交換性（Exchangeability）與切分隔離**：同一張影像內的多個物件存在空間／脈絡相依性，不可直接打散單框充當獨立同分佈樣本跨越 Calibration Split 與 Test Split；(3) **分佈偏移敏感性（Distribution Shift）**：當測試域出現光照、天候或遮擋結構漂移時，可交換性即失效且保證退化；(4) **邊際 vs. 遮擋條件覆蓋**：全資料集邊際覆蓋 $\mathbb{P}(B_{\text{test}} \subseteq \hat{\mathcal{B}}_\alpha) \ge 1-\alpha$ 容易掩蓋少數難例（如高遮擋子群）的嚴重覆蓋不足，且逐點無分佈條件覆蓋已被證明不可達成 `[FACT]`，必須在獨立 `Image-/Scene-disjoint` 切分上對遮擋分層採用 **Mondrian 分層共形校準（Group/Occlusion-Conditional Calibration）** 並承受有限樣本分位數變異上升之代價 `[SAFETY_BOUND]`。
   - **與 `D-FINE FDR` 及 `Kuzucu (2024)` 的邊界區分 `[FACT]`**：`D-FINE` 原生於解碼器內計算四邊離散分佈（`pred_corners`），本質反映離散位置機率而非具有限樣本統計保證之共形安全集合；`Kuzucu et al. (2024)`（`ECCV 2024 Oral`, `arXiv:2405.20459`）提出 `LaECE` 等局部化期望校準誤差指標以評估不確定性排序與區間校準度，三者分屬「原生特徵分佈」、「離散/回歸誤差診斷」與「後處理共形覆蓋保證」。

---

## 三、⚙️ 計算機體系結構與硬體資源分析：官方程式推論掛鉤與計算成本邊界

在消費級 GPU（例如 `8 GB VRAM` 筆電或單張雲端 GPU）執行現代偵測研究時，須精確區分既有推論結構與實證量測狀態（本機 VRAM 僅為觀測硬體環境限制，非研究題目全域淘汰門檻） `[FACT]`：
1. **官方 `D-FINE` 程式匯出限制與 Hook 機制 (`[FACT]`)**：檢視官方原始碼（`Peterande/D-FINE`: `src/zoo/dfine/dfine_decoder.py` L287–314, L428–456, L890–900 與 `postprocessor.py` L39–93），預訓練 `D-FINE` 雖可透過非均勻 `weighting_function`、`Integral` 與 `LQE` 計算四邊離散 `out_corners` 分佈，**然而在推論/評估模式（`not self.training`）下，`DFINETransformer.forward()` 的 `else` 分支預設丟棄 `pred_corners` 並僅回傳 `pred_logits` 與 `pred_boxes`，`DFINEPostProcessor.forward()` 預設亦不回傳 `topk` 索引或四邊分佈**。若要在不重新訓練骨幹權重下取得對齊後之 `[B, N_topk, 4, reg_max+1]` 張量，研究程式必須修改評估/後處理回傳或掛載 PyTorch `register_forward_hook` 並與解碼後 `pred_boxes` 校驗對齊 `[DESIGN_DECISION]`。
2. **作者回報吞吐量 vs. 端對端耗時邊界**：原論文（`arXiv:2410.13842`）回報 **`D-FINE-L / D-FINE-X`** 於 NVIDIA T4 TensorRT FP16 下達成 `54.0% / 55.8% AP` 與 **`124 / 78 FPS`**（COCO，另官方 README 報告輕量級 `D-FINE-N` 達 `472 FPS / 42.8% APval`，皆屬 `AUTHOR_REPORTED` 純前向推論） `[LITERATURE_RESULT]`；此數字**不包含**資料集解碼、Hook 對齊、GT 配對與 Mondrian 分層統計計算。團隊端於消費級 `4–8 GB VRAM` 或雲端單卡對完整驗證集快取特徵並完成校準迴圈之總耗時目前仍屬 **`NOT_RUN / UNVERIFIED`**，嚴禁提前宣稱僅需數分鐘即可完成 `[SAFETY_BOUND]`。
3. **微目標高解析記憶體牆**：將 $4000 \times 3000$ 影像直接高倍率輸入視覺 Transformer，其編碼器多尺度注意力與高解析度特徵圖激活值會隨面積二次／線性暴增，於低顯存裝置易超過 `8 GB VRAM`。工程上可採小批梯度累積、單張雲端 GPU 或配合早期稀疏熱區導向之 **按需局部切片（Sparse Gated Grid Slicing）** 替代無差別全圖密集掃描 `[DESIGN_DECISION]` `[SAFETY_BOUND]`。

---

## 四、💻 工業級工程實作：FDR 邊界熵、NWD 與定位感知 LaECE 檢驗核心

以下提供零大型依賴的純 PyTorch 驗證核心，計算 `D-FINE` 風格四邊離散分佈（FDR）之香農熵、微目標 `NWD` 相似度及 `LaECE` 評估指標：

```python
import torch
import math
from typing import Tuple


def compute_fdr_edge_entropy(edge_probs: torch.Tensor, eps: float = 1e-8) -> torch.Tensor:
    """
    計算 D-FINE 風格邊界離散機率分佈 (FDR) 之四邊獨立香農熵。
    輸入:
      edge_probs: [N, 4, L] 已對最後一維正規化之機率質量分佈 (top, bottom, left, right)
    輸出:
      entropies: [N, 4] 各物件四條獨立邊界之不確定性（單位: nats）
    """
    assert edge_probs.dim() == 3 and edge_probs.shape[1] == 4, "輸入形狀須為 [N, 4, L]"
    row_sums = edge_probs.sum(dim=-1)
    assert torch.allclose(row_sums, torch.ones_like(row_sums), atol=1e-4), "最後一維機率總和須為 1"
    p_safe = torch.clamp(edge_probs, min=eps)
    return -(edge_probs * torch.log(p_safe)).sum(dim=-1)


def compute_nwd_similarity(
    boxes_a: torch.Tensor,
    boxes_b: torch.Tensor,
    scale_constant: float = 12.0,
) -> torch.Tensor:
    """
    計算微目標 2D 高斯常態化 Wasserstein 相似度 NWD（解決小物件 IoU=0 梯度消失）。
    boxes 採中心格式 [N, 4]: (cx, cy, w, h)
    輸出: [N, M] 成對 NWD 相似度矩陣，值域 (0, 1]
    """
    assert boxes_a.shape[-1] == 4 and boxes_b.shape[-1] == 4
    assert scale_constant > 0.0
    ga = torch.stack([boxes_a[:, 0], boxes_a[:, 1], boxes_a[:, 2] * 0.5, boxes_a[:, 3] * 0.5], dim=-1)
    gb = torch.stack([boxes_b[:, 0], boxes_b[:, 1], boxes_b[:, 2] * 0.5, boxes_b[:, 3] * 0.5], dim=-1)
    diff = ga.unsqueeze(1) - gb.unsqueeze(0)  # [N, M, 4]
    w2_dist = torch.sqrt(torch.clamp((diff * diff).sum(dim=-1), min=1e-12))
    return torch.exp(-w2_dist / scale_constant)


def compute_laece(
    confidences: torch.Tensor,
    matched_ious: torch.Tensor,
    n_bins: int = 10,
) -> Tuple[float, float]:
    """
    計算簡化實例層定位感知校準誤差 (LaECE) 與傳統二元 IoU>=0.5 D-ECE 對比。
    輸入:
      confidences: [N] 預測分類信心分數 in [0, 1]
      matched_ious: [N] 配對真實框 IoU（無匹配背景誤報 FP 為 0.0）
    """
    assert confidences.shape == matched_ious.shape
    N = confidences.numel()
    assert N > 0
    bin_bounds = torch.linspace(0.0, 1.0, n_bins + 1, device=confidences.device)
    la_ece = 0.0
    d_ece = 0.0
    tp_binary = (matched_ious >= 0.5).float()

    for m in range(n_bins):
        lo, hi = bin_bounds[m].item(), bin_bounds[m + 1].item()
        mask = (confidences > lo) & (confidences <= hi) if m > 0 else (confidences >= lo) & (confidences <= hi)
        cnt = int(mask.sum().item())
        if cnt == 0:
            continue
        weight = cnt / N
        avg_conf = float(confidences[mask].mean().item())
        avg_bin_acc = float(tp_binary[mask].mean().item())
        avg_la_acc = float((tp_binary[mask] * matched_ious[mask]).mean().item())
        d_ece += weight * abs(avg_conf - avg_bin_acc)
        la_ece += weight * abs(avg_conf - avg_la_acc)

    return la_ece, d_ece


if __name__ == "__main__":
    # 1. 驗證單側遮擋時，左邊清晰（低熵）與右邊遮擋模糊（高熵）可於 FDR 分佈獨立偵測
    L = 32
    sharp = torch.zeros(L)
    sharp[10] = 0.96
    sharp[9] = 0.02
    sharp[11] = 0.02
    occluded = torch.full((L,), 1.0 / L)  # 均勻分散代表高幾何不確定性
    sample_fdr = torch.stack([torch.stack([sharp, sharp, sharp, occluded])])  # [1, 4, 32]
    ent = compute_fdr_edge_entropy(sample_fdr)
    assert ent[0, 3] > 3.0 * ent[0, 0], "單側遮擋邊界熵應遠大於清晰邊界"

    # 2. 驗證 8x8 微小目標偏移 12 像素 (零重疊 IoU=0) 下 NWD 仍保留可微非零梯度訊號
    box_gt = [100.0, 100.0, 8.0, 8.0]
    box_pred = [112.0, 100.0, 8.0, 8.0]
    tiny_gt = torch.tensor(box_gt).unsqueeze(0)
    tiny_pred = torch.tensor(box_pred).unsqueeze(0)
    nwd_val = compute_nwd_similarity(tiny_pred, tiny_gt, scale_constant=12.0).item()
    assert 0.30 < nwd_val < 0.45 and math.isfinite(nwd_val)

    # 3. 驗證高信心但僅勉強擦邊 (IoU=0.52) 時，LaECE 比 D-ECE 更嚴格懲罰定位誤差
    confs = torch.tensor([0.92, 0.90, 0.88, 0.85])
    ious = torch.tensor([0.52, 0.55, 0.51, 0.54])
    la_val, d_val = compute_laece(confs, ious, n_bins=5)
    assert la_val > d_val, "高信心低 IoU 樣本下，LaECE 必須大於二元 D-ECE"
    print(f"[LIB-503 Verified] edge_ent={ent.tolist()}, NWD={nwd_val:.4f}, LaECE={la_val:.4f} > D-ECE={d_val:.4f}")
```

---

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-503-01] 2D 遮擋偵測框與 Amodal 分割邊界隔離合約 (Occlusion Detection vs. Amodal Segmentation Boundary)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件**: 設計或評測遮擋環境下之視覺偵測演算法及比較文獻時。
- **量化決策邊界**:
  - 必須嚴格區分「2D 實例邊界框分離（輸出 `(cx, cy, w, h)` 可見／全身框，指標 `AP / MR^-2 / JI`）」與「Amodal 實例分割（輸出像素級完整遮罩，指標 `Amodal mIoU`）」。
  - 嚴禁將像素級 Amodal Segmentation 論文之指標與數值未經轉化即當作 2D 邊界框偵測之 Baseline 衝突或等效替代。
- **執行保證**: 杜絕任務設定與評測協議誤對齊導致同行評審拒稿。

### [RULE-503-02] 微小目標 IoU 崩塌防護與滑動切片邊界合約 (Tiny-Object Distribution Matching & Grid-Slicing Guard)
- **合約等級**: `BOUNDARY_GUARD`
- **前置條件**: 輸入影像平均目標邊長 $< 16\text{ px}$（如 `AI-TOD` / `VisDrone` 空拍或遠距交通場景）。
- **量化決策邊界**:
  - 嚴禁在極微目標二分圖匹配或正負樣本指派階段僅使用無平滑修正的純二元 `IoU` / `GIoU`（偏移 $1\text{–}2\text{ px}$ 即歸零）；應採用分佈距離（如 `NWD` / 感受野距離 `RFLA`）或重疊切片管線。
  - 若採高解析網格切片（參照 `LIB-904` 之 `RULE-904-03`），切片重疊率須 $\ge 20\%$，並實際量測且揭露切片導致之端到端推論延遲倍率（`Illustrative Example`：如 `2×2` 至 `3×3` 網格切片理論基準倍率可達 `4×–9×` 以上） `[SAFETY_BOUND]`。
- **執行保證**: 防止微小目標訓練梯度歸零漏檢及隱藏切片計算成本之不公平速度比較。

### [RULE-503-03] 偵測器定位感知校準與強基準檢驗合約 (Localization-Aware Calibration & Baseline Integrity Invariant)
- **合約等級**: `QUALITY_BOUND`
- **前置條件**: 宣稱提出新型物件偵測不確定性估計或置信度校準演算法。
- **量化決策邊界**:
  - 嚴禁僅使用單一固定信心閾值（如 `score >= 0.30`）計算並報告 `D-ECE` `[LITERATURE_RESULT]`。
  - 必須同時報告定位感知指標（**`LaECE`** 與 **`LRP Error`**），且必須與經偵測目標調校之 **Post-hoc Isotonic Regression / Platt Scaling** 強基準於獨立 `Image-/Scene-disjoint` 驗證—測試切分下對比。
- **執行保證**: 確保任何訓練期新校準損失確實超越低成本古典後處理校準基準。

### [RULE-503-04] 共形邊界框統計覆蓋語意與漏檢誠實揭露合約 (Conformal Bounding Box Coverage & FN Transparency Invariant)
- **合約等級**: `SAFETY_CRITICAL`
- **前置條件**: 將共形預測應用於預測物體邊界框安全上下界（如 $\alpha = 0.10$ 對應 $90\%$ 目標覆蓋率）。
- **量化決策邊界**:
  - **可交換性與無洩漏切分**：校正集（Calibration Split）與測試集（Test Split）嚴禁重疊、不可直接打散同張影像的多個偵測框充當獨立樣本，必須強制以 `Image-/Scene-disjoint` 層級切分（並搭配影像層級 Cluster Bootstrap 統計區間） `[SAFETY_BOUND]`。
  - **邊際 vs. 條件與漏檢誠實揭露**：標準後處理共形區間僅對**模型成功偵測並與真值配對的目標**提供有限樣本保證，絕不涵蓋完全漏檢（False Negatives）；且評估遮擋場景時，必須對比報告全局 **Marginal Coverage** 與依遮擋分層之 **Occlusion-Conditional (Mondrian) Coverage**、Recall / `MR^-2` 與區間膨脹緊緻度（Tightness / Mean Stretch） `[SAFETY_BOUND]`。
- **執行保證**: 維護自駕／安全部署中統計保證陳述的數學嚴謹性與透明度。

---

## 六、📚 權威論文與同行評審文獻 (Canonical & Peer-Reviewed References)

1. **RT-DETR 即時端對端檢測器 (CVPR 2024)**
   - *Paper*: Zhao, Y., Lv, W., Xu, S., Wei, J., Wang, G., Dang, Q., Liu, Y., & Chen, J. (2024). "DETRs Beat YOLOs on Real-time Object Detection." *IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR 2024)*. [arXiv:2304.08069](https://arxiv.org/abs/2304.08069) | Code: [`lyuwenyu/RT-DETR`](https://github.com/lyuwenyu/RT-DETR).
2. **D-FINE 邊界細粒度分佈精修 (ICLR 2025 Spotlight)**
   - *Paper*: Peng, Y., Li, H., Wu, P., Zhang, Y., Sun, X., & Wu, F. (2025). "D-FINE: Redefine Regression Task of DETRs as Fine-grained Distribution Refinement." *International Conference on Learning Representations (ICLR 2025 Spotlight)*. [arXiv:2410.13842](https://arxiv.org/abs/2410.13842) | Code: [`Peterande/D-FINE`](https://github.com/Peterande/D-FINE) (Apache-2.0).
3. **DEIM 密集匹配與快速收斂 (CVPR 2025) & DEIMv2 / RF-DETR**
   - *Paper*: Huang, S., Lu, Z., Cun, X., Yu, Y., Zhou, X., & Shen, X. (2025). "DEIM: DETR with Improved Matching for Fast Convergence." *CVPR 2025*. [arXiv:2412.04234](https://arxiv.org/abs/2412.04234) | Code: [`Intellindust-AI-Lab/DEIM`](https://github.com/Intellindust-AI-Lab/DEIM).
   - *Follow-ups*: Huang, S., et al. (2025). *DEIMv2* ([arXiv:2509.20787](https://arxiv.org/abs/2509.20787)); Robinson, I., et al. (2026). *RF-DETR* (*ICLR 2026*, [arXiv:2511.09554](https://arxiv.org/abs/2511.09554)).
4. **偵測器校準陷阱與 LaECE 基準 (ECCV 2024 Oral)**
   - *Paper*: Kuzucu, S., Oksuz, K., Sadeghi, J., & Dokania, P. K. (2024). "On Calibration of Object Detectors: Pitfalls, Evaluation and Baselines." *European Conference on Computer Vision (ECCV 2024 Oral)*. [arXiv:2405.20459](https://arxiv.org/abs/2405.20459) | Code: [`fiveai/detection_calibration`](https://github.com/fiveai/detection_calibration).
5. **兩階段共形邊界框與機率偵測校準 (ECCV 2024 Oral / COPA 2026 Oral)**
   - *Paper*: Timans, A., Straehle, C.-N., Sakmann, K., & Nalisnick, E. (2024). "Adaptive Bounding Box Uncertainties via Two-Step Conformal Prediction." *ECCV 2024 Oral*. [arXiv:2403.07263](https://arxiv.org/abs/2403.07263).
   - *Paper*: Ries, C., Kassem Sbeyti, M., Bianco, N., & Klein, N. (2026). "Probabilistic Object Detection with Conformal Prediction." Accepted Oral at *COPA 2026* (PMLR v329). [arXiv:2605.07549](https://arxiv.org/abs/2605.07549) | Code: [`mos-ks/OD-CP`](https://github.com/mos-ks/OD-CP).
   - *Preprint / Related*: Andéol, L., et al. (2025). "Conformal Object Detection by Sequential Risk Control." [arXiv:2505.24038](https://arxiv.org/abs/2505.24038); Conde, P., Lopes, R. L., & Premebida, C. (2024). [arXiv:2309.00464](https://arxiv.org/abs/2309.00464).
6. **微小目標與擁擠遮擋偵測核心基準 (ICPR / ECCV / CVPR)**
   - *Tiny Objects*: Wang, J., et al. (2021). *NWD* (*ICPR 2021*, [arXiv:2110.13389](https://arxiv.org/abs/2110.13389)); Xu, C., et al. (2022). *RFLA* (*ECCV 2022*, [arXiv:2208.08738](https://arxiv.org/abs/2208.08738)); Huang, Y.-X., Liu, H.-I., Shuai, H.-H., & Cheng, W.-H. (2024). *DQ-DETR* (*ECCV 2024*, [arXiv:2404.03507](https://arxiv.org/abs/2404.03507)).
   - *Crowded Occlusion*: Chu, X., et al. (2020). *CrowdDet* (*CVPR 2020*, [arXiv:2003.09163](https://arxiv.org/abs/2003.09163)); Zhang, S., et al. (2023). *DDQ* (*CVPR 2023*, [arXiv:2303.13481](https://arxiv.org/abs/2303.13481)); Hou, X., et al. (2024). *Relation-DETR* (*ECCV 2024*, [arXiv:2407.11699](https://arxiv.org/abs/2407.11699)).
