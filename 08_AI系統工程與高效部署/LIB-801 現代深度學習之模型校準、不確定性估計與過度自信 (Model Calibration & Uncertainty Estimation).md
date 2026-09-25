---
call_number: LIB-801
status: source-verified
invariants_count: 3
title: 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)
module: AI-Systems-Engineering
category: Model-Calibration
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Expected Calibration Error (ECE) Formal Formulation
  - Platt Scaling & Temperature Scaling Optimization
  - Conformal Prediction Finite-Sample Coverage (1 - alpha)
hardware_target:
  - Log-Sum-Exp Numerically Stable Operators
  - Low-Latency Inference Calibration Sidecar
created: 2026-09-17
author: Luke
tags:
  - 圖書館
  - AI系統工程
  - 模型校準
  - ECE
  - 溫度縮放
  - 共形預測
  - RLCD
prerequisites:
  - "[[LIB-104 凸最佳化理論與一階二階梯度下降幾何 (Optimization Theory & Gradient Descent)]]"
  - "[[LIB-301 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)]]"
successors:
  - "[[LIB-704 雙進程神經代理人：S1 非自迴歸型態決策引擎 (Jev) 與字節級介面反射模型 (CUA-S1) 深度解剖 (Dual-Process Neural Agent - S1 Non-Autoregressive Typed Decision Engine (Jev) & Byte-Level Interface Reflex Model (CUA-S1))]]"
  - "[[LIB-802 現代深度學習模型量化理論與低精度推論架構 (Quantization Mathematics & Low-Precision Inference)]]"
  - "[[LIB-901 經典專案實證復盤：從課堂作業到生產級 MNIST 手寫辨識系統 (Classic Project Post-Mortem - From Class Assignment to Production MNIST System)]]"
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/08_ai_systems_engineering/LIB-801%20Model%20Calibration%20%26%20Uncertainty%20Estimation%20%28Agent%20EN%29.md)

# 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-104 凸最佳化理論與一階二階梯度下降幾何 (Optimization Theory & Gradient Descent)]]、[[LIB-301 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)]]。
- **後續節點**：[[LIB-704 雙進程神經代理人：S1 非自迴歸型態決策引擎 (Jev) 與字節級介面反射模型 (CUA-S1) 深度解剖 (Dual-Process Neural Agent - S1 Non-Autoregressive Typed Decision Engine (Jev) & Byte-Level Interface Reflex Model (CUA-S1))]]、[[LIB-802 現代深度學習模型量化理論與低精度推論架構 (Quantization Mathematics & Low-Precision Inference)]]、[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]。
- **主要文獻與官方來源**：
  - Guo, Pleiss, Sun, Weinberger (Cornell University, ICML 2017) *On Calibration of Modern Neural Networks*.
  - Angelopoulos & Bates (UC Berkeley, Foundations and Trends in Machine Learning 2023) *Conformal Prediction: A Gentle Introduction*.
  - Diogo Almeida / TypeSafe AI (2026) *Introducing System One Models & Jev*. TypeSafe AI 官方發布.
  - Platt (1999) *Probabilistic Outputs for Support Vector Machines and Comparisons to Regularized Likelihood Methods*.

---

## 一、💡 學士直觀心智模型：吹牛的考生 vs 誠實嚴謹的學者

在真實測試中，面對一張稍有傾斜的手寫數字 8：
- **未經正則化的 8 層深層模型**高談闊論：「我 **100% 絕對確定** 這是 3！是 8 的機率為 0.000%！」（結果大錯特錯，死記硬背引發盲目自信）。
- **加入 BatchNorm 與 Dropout 的 4 層優化模型**謙遜地給出機率分佈：「這張圖片有模糊性，**8 的機率是 57%（第一名命中！）**，7 的機率是 29%，9 的機率是 6%。」

### 1. 為什麼「信心度看似下降」反而證明模型更強大？
- 真實世界充滿了雜訊、筆劃殘缺與幾何模糊。
- 一個健康的智能系統，必須具備**「知其所不知（Uncertainty Awareness）」**的能力。
- 如果一個自動駕駛系統在前方暴風雪看不清時，依然以 99.99% 的盲目自信認定前面是一片平坦大道，將會引發災難性車禍；只有誠實回報信心度驟降至 50%，自駕系統才會緊急觸發煞車或移交人類司機。

---

## 二、🎓 博士級數學形式化推導：Guo et al. (ICML 2017) 論文、ECE 與共形預測

### 1. 經典文獻：現代神經網路的校準危機
Guo et al. 在 ICML 2017 發表里程碑論文 *《On Calibration of Modern Neural Networks》*，指出了深度學習界近十年的嚴峻現實：
> **自 2012 年 AlexNet 普及以來，隨著網路深度加深、ResNet 與歸一化層的引入，神經網路的 Top-1 分類準確率（Accuracy）大幅飆升；但其預測機率分佈的校準品質（Calibration）卻比 1990 年代的淺層網路糟糕數倍，普遍呈現極度危險的病態「過度自信（Overconfidence）」**。

### 2. 完美機率校準 (Perfect Calibration) 的形式化定義
令神經網路的預測類別為 $\hat{Y}$，其對應的 Softmax 信心度為 $\hat{P} = \max_k P(Y = k \mid X)$。
**定義**：當且僅當對所有可能的信心度水準 $p \in [0, 1]$，條件真實命中機率恰好等於 $p$ 時，稱模型具備完美校準：
$$\mathbb{P}(\hat{Y} = Y \mid \hat{P} = p) = p, \quad \forall p \in [0, 1]$$
即：如果模型以 70% 信心度預測了 100 張圖片，這 100 張圖片中應當恰好有 70 張真正分類正確。

### 3. 預期校準誤差 (Expected Calibration Error, ECE) 計算
將預測區間 $[0, 1]$ 等分為 $M$ 個區間（Bins）$B_m = (\frac{m-1}{M}, \frac{m}{M}]$。
- **區間準確率 (Accuracy in Bin)**：
  $$\text{acc}(B_m) = \frac{1}{|B_m|} \sum_{i \in B_m} \mathbf{1}(\hat{y}_i = y_i)$$
- **區間平均信心度 (Confidence in Bin)**：
  $$\text{conf}(B_m) = \frac{1}{|B_m|} \sum_{i \in B_m} \hat{p}_i$$
**預期校準誤差 (ECE)** 為各區間差距的樣本加權平均：
$$\text{ECE} = \sum_{m=1}^M \frac{|B_m|}{N} \left| \text{acc}(B_m) - \text{conf}(B_m) \right|$$
**最大校準誤差 (MCE, Maximum Calibration Error)**：
$$\text{MCE} = \max_{m \in \{1, \dots, M\}} \left| \text{acc}(B_m) - \text{conf}(B_m) \right|$$

### 4. 溫度縮放 (Temperature Scaling) 後處理最佳化
引入單一純量參數 $T > 0$（Temperature）：
$$\hat{q}_i = \frac{e^{z_i / T}}{\sum_{j=1}^K e^{z_j / T}}$$
- 透過在獨立驗證集上最小化負對數似然損失 (Negative Log-Likelihood, NLL) 求解全域最優 $T^*$：
  $$\min_{T > 0} -\sum_{i=1}^N \log\left(\frac{e^{z_{i, y_i} / T}}{\sum_{j=1}^K e^{z_{i, j} / T}}\right)$$
- 保持 Top-1 預測排序不變；在 Guo et al. (2017) 的實驗中，Temperature Scaling 通常能有效改善模型校準，但改善幅度依模型、資料集與 ECE 分箱設定而異。

### 5. 統計保證前沿：共形預測 (Conformal Prediction, Angelopoulos & Bates 2023)
單純調整溫度依然屬於啟發式方法。在醫療診斷、自駕感測等高風險領域，**共形預測 (Conformal Prediction)** 提供了數學上嚴格的**有限樣本無分佈統計覆蓋保證 (Distribution-Free Guarantee)**。其核心建立在校準資料與測試資料滿足**可交換性（Exchangeability，i.i.d. 為其常見充分條件）**基礎上：
給定任意使用者自訂錯誤率 $\alpha \in (0, 1)$（如 $\alpha = 0.05$，對應 $1 - \alpha = 0.95$ 之邊際覆蓋率），演算法在有限校準樣本上計算非契合度分數（Non-conformity Score）之經驗分位數 $\hat{q}$，輸出一個**預測集合** $\mathcal{C}(X_{\text{test}}) \subseteq \{1, \dots, K\}$，滿足：
$$\mathbb{P}\left(Y_{\text{test}} \in \mathcal{C}(X_{\text{test}})\right) \ge 1 - \alpha$$
**統計保證語意說明**：此處 $1 - \alpha$ 為覆蓋率之**邊際保證（Marginal Coverage）**，係針對校準資料與測試樣本聯合隨機抽樣之平均期望，而非針對特定單一測試樣本或特定預測集合（例如 $\{7, 8\}$）的條件機率保證。若實際部署環境出現任意未受控的資料分佈漂移（Distribution Shift），標準邊際覆蓋保證將不再自動成立；加權共形預測（Weighted Conformal Prediction）等擴展方法需依賴明確的結構假設（如已知或可精準估計的協變量漂移似然比），並非能無條件修復任意未知的領域漂移。

### 6. 前沿校準對齊探索：決策校準強化學習 (RLCD, Reinforcement Learning for Calibrated Decisions)
傳統對齊技術（如 RLHF）針對人類偏好獎勵標量進行最優化，常使模型策略為追求最大獎勵而導致預測分佈尖銳化（Entropy Collapse），加劇預測機率的過度自信（ECE 惡化）。
在 2026 年新一代代理人架構探索中（如 TypeSafe AI 提出的 Jev，詳見 [[LIB-704 雙進程神經代理人：S1 非自迴歸型態決策引擎 (Jev) 與字節級介面反射模型 (CUA-S1) 深度解剖 (Dual-Process Neural Agent - S1 Non-Autoregressive Typed Decision Engine (Jev) & Byte-Level Interface Reflex Model (CUA-S1))]]）：
- **公開文獻陳述 [FACT]**：TypeSafe AI 公開將 RLCD (Reinforcement Learning for Calibrated Decisions) 描述為一種旨在為 Jev 生成校準決策與機率的訓練方法。
- **未公開實作細節 [OPEN_QUESTION]**：在引述的官方資料中，其確切的獎勵函數、評分規則（Scoring Rule）、校準目標、損失函數形式以及策略梯度實作均未公開發表；如何在強化學習策略梯度中直接聯合最佳化具有離散、非平滑分箱特性的 ECE，在學界與產業界仍屬開放性研究挑戰。
---

## 三、⚙️ 計算機體系結構與硬體微架構映射：Log-Sum-Exp 數值防下溢

在 GPU 執行 Softmax 時，大參數網路的 Logits（如 $z_i = 95.0$）會引發 IEEE 754 浮點數硬體溢出：
- FP32 數值上限為 $\approx 3.4 \times 10^{38}$，而 $e^{95} \approx 1.8 \times 10^{41} \to \text{Inf}$。
- **硬體對齊 Log-Sum-Exp 技巧**：
  $$\frac{e^{z_i}}{\sum_j e^{z_j}} = \frac{e^{z_i - c}}{\sum_j e^{z_j - c}}, \quad \text{其中 } c = \max_k(z_k)$$
  在 Warp 內部透過 `__shfl_sync` 快速廣播最大值 $c$，徹底杜絕硬體溢出與 NaN 崩潰。

---

## 四、💻 工業級工程實作：PyTorch 溫度縮放校準器與 ECE 計算引擎

```python
import torch
import torch.nn as nn
import torch.optim as optim

class TemperatureScaler(nn.Module):
    """實作 Guo et al. (ICML 2017) 溫度縮放後處理校準器。
    數學要求：T > 0 嚴格保證 Logits 的排序不變性與單調映射。
    工程啟發式約束：T 限制在 [0.1, 5.0] [HEURISTIC / BOUNDARY_GUARD]，防止極端數值崩潰。
    透過 Sigmoid 參數化嚴格在數學上滿足該區間：T = 0.1 + 4.9 * torch.sigmoid(raw_temperature)。
    初始 raw_temperature = -0.9163 對應 T ≈ 1.5。
    註：NLL 最佳化在經驗上能顯著改善校準度，但在數學上並不保證離散分箱 ECE 的嚴格單調遞減。
    """
    def __init__(self):
        super().__init__()
        # raw_temperature = log((1.5 - 0.1) / (5.0 - 1.5)) = log(0.4) ≈ -0.9163
        self.raw_temperature = nn.Parameter(torch.tensor([-0.9163]))

    @property
    def temperature(self) -> torch.Tensor:
        return 0.1 + 4.9 * torch.sigmoid(self.raw_temperature)

    def forward(self, logits: torch.Tensor) -> torch.Tensor:
        return logits / self.temperature

    def fit(self, val_logits: torch.Tensor, val_labels: torch.Tensor, max_iter: int = 50):
        nll_criterion = nn.CrossEntropyLoss()
        optimizer = optim.LBFGS([self.raw_temperature], lr=0.01, max_iter=max_iter)

        def eval_loss():
            optimizer.zero_grad()
            loss = nll_criterion(self.forward(val_logits), val_labels)
            loss.backward()
            return loss

        optimizer.step(eval_loss)
        print(f"[+] 最佳校準溫度 T* = {self.temperature.item():.4f}")

def compute_ece(probs: torch.Tensor, labels: torch.Tensor, n_bins: int = 10) -> float:
    """計算預期校準誤差 ECE"""
    confidences, predictions = torch.max(probs, dim=1)
    accuracies = predictions.eq(labels)
    ece = torch.zeros(1, device=probs.device)
    bin_boundaries = torch.linspace(0, 1, n_bins + 1)

    for i in range(n_bins):
        bin_lower = bin_boundaries[i]
        bin_upper = bin_boundaries[i + 1]
        in_bin = confidences.gt(bin_lower.item()) * confidences.le(bin_upper.item())
        prop_in_bin = in_bin.float().mean()

        if prop_in_bin.item() > 0:
            accuracy_in_bin = accuracies[in_bin].float().mean()
            avg_confidence_in_bin = confidences[in_bin].mean()
            ece += torch.abs(avg_confidence_in_bin - accuracy_in_bin) * prop_in_bin

    return ece.item()

if __name__ == "__main__":
    val_logits = torch.randn(1000, 10) * 5.0
    val_labels = torch.randint(0, 10, (1000,))
    
    uncalibrated_probs = torch.softmax(val_logits, dim=-1)
    ece_before = compute_ece(uncalibrated_probs, val_labels)
    print(f"校準前 ECE: {ece_before * 100:.2f}%")
    
    scaler = TemperatureScaler()
    scaler.fit(val_logits, val_labels)
    
    calibrated_probs = torch.softmax(scaler(val_logits), dim=-1)
    ece_after = compute_ece(calibrated_probs, val_labels)
    print(f"校準後 ECE: {ece_after * 100:.2f}%")
    # [EMPIRICAL_RESULT] 依據文獻 (Guo et al., 2017)，驗證集 ECE 經驗上多數下降，但因分箱邊界非平滑特性，數學上無單調保證
    if ece_after > ece_before:
        print(f"[!] 警告: 分箱 ECE 未單調下降 (前: {ece_before:.4f}, 後: {ece_after:.4f})，此乃分箱邊界效應所致。")
```

---
---
---

## 五、🤖 AI Agent 推論協議與決策不變量 (Agent Invariants & Actionable Contracts)

### [RULE-801-01] ECE 模型校準檢驗與發布門檻合約 (ECE Calibration Release Gate)
- **合約等級**: `CRITICAL_INVARIANT`
- **前置條件 (Pre-conditions)**: 模型完成訓練準備投入推論部署。
- **量化決策邊界 (Decision Thresholds)**:
  - 必須在獨立留出驗證集（Validation Set）上計算 15-bin 的期望校準誤差（ECE）。
  - 生產上線門檻：$\text{ECE} \le 0.05$（5%）。
  - 若 $\text{ECE} > 0.05$，**嚴禁直接發布**，必須強制進入溫度縮放（Temperature Scaling）後處理優化階段。
- **可執行斷言**:
  ```python
assert ece_val <= 0.05, f"模型校準度不足: ECE={ece_val:.4f} 超出 0.05 上限，禁止上線！"
  ```

### [RULE-801-02] 溫度縮放參數數值邊界合約 (Temperature Parameter Range Guardrail)
- **合約等級**: `BOUNDARY_GUARD`
- **前置條件 (Pre-conditions)**: 透過驗證集負對數似然（NLL）擬合溫度標量 $T$。
- **量化決策邊界 (Decision Thresholds)**:
  - 數學不變量：溫度標量必須滿足 $T > 0$，以保證 Logit 排秩與 Softmax 映射之嚴格單調性（Top-1 準確率完全守恆）。
  - 工程啟發邊界：$T \in [0.1, 5.0]$ 屬於工程防護邊界 [HEURISTIC / BOUNDARY_GUARD]，由 Sigmoid 參數化 $T = 0.1 + 4.9 \cdot \sigma(\theta)$ 於數學上予以保證，防範極端分佈平滑或數值不穩定。
- **執行保證**: 杜絕過度平滑導致所有預測退化為均勻分佈。

### [RULE-801-03] 共形預測統計邊際覆蓋保證合約 (Conformal Prediction Coverage Guarantee)
- **合約等級**: `SAFETY_CRITICAL`
- **前置條件 (Pre-conditions)**: 應用於高風險醫療、自駕或工業視覺檢測，且校準資料與測試資料滿足**可交換性（Exchangeability，i.i.d. 為其常見充分條件）**假定。
- **量化決策邊界 (Decision Thresholds)**:
  - 設定顯著水準 $\alpha = 0.05$（獲得 $1 - \alpha = 0.95$ 之邊際覆蓋率保證）。注意：此保證為跨校準與測試抽樣之邊際統計覆蓋，非針對單一樣本的條件保證；且在任意未受控分佈漂移（Distribution Shift）下，標準邊際保證不再成立。
  - 當模型輸出的預測集合（Prediction Set）大小 $|\mathcal{C}(X)| \ge 3$ 時，判定該樣本存在極高語意多義性，必須強制轉交人工覆核。
---

## 六、📚 權威論文、經典著作與同行評審文獻 (Canonical & Peer-Reviewed References)

1. **現代神經網路校準開創巨作 (ICML 頂會)**
   - *Paper*: Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). "On Calibration of Modern Neural Networks." *Proceedings of the 34th International Conference on Machine Learning (ICML 2017)*, PMLR 70, 1321–1330.
   - *Core Contribution*: 首次揭露現代深層神經網路（如 ResNet）因過度參數化與跨熵最小化，雖然分類準確率極高但預測機率存在嚴重「過度自信」；實證證明溫度縮放 (Temperature Scaling) 為最簡潔有效的單參數校準法。
2. **共形預測 (Conformal Prediction) 權威綜述導論**
   - *Monograph*: Angelopoulos, A. N., & Bates, S. (2023). "Conformal Prediction: A Gentle Introduction." *Foundations and Trends in Machine Learning*, 16(4), 494-591. DOI: [10.1561/2200000101](https://doi.org/10.1561/2200000101).
   - *Core Contribution*: 提供無分佈假定 (Distribution-free) 之有限樣本覆蓋率保證 $1-\alpha$，將點預測升級為具有嚴密統計可靠性之預測集合 (Prediction Sets)。
3. **Platt 縮放奠基文獻**
   - *Paper*: Platt, J. (1999). "Probabilistic Outputs for Support Vector Machines and Comparisons to Regularized Likelihood Methods." *Advances in Large Margin Classifiers*, 10(3), 61-74.
   - *Core Contribution*: 提出利用 Sigmoid Logistic 變換將未校準分數映射為後驗機率之基礎原理。
4. **期望校準誤差 (ECE) 形式化指標作**
   - *Paper*: Naeini, M. P., Cooper, G., & Hauskrecht, M. (2015). "Obtaining well calibrated probabilities using Bayesian binning into quantiles." *AAAI Conference on Human Computation and Crowdsourcing (AAAI 2015)*.
   - *Core Contribution*: 提出將預測機率分箱以計算準確率與置信度絕對殘差之 ECE 指標，成為所有 AI 系統可靠性評估之工業標準。
