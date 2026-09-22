---
call_number: LIB-801
title: 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)
module: AI-Systems-Engineering
category: Model-Calibration
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
status: Verified-Authoritative-Production
math_foundations:
  - Expected Calibration Error (ECE) Formal Formulation
  - Platt Scaling & Temperature Scaling Optimization
  - Conformal Prediction Finite-Sample Coverage (1 - alpha)
hardware_target:
  - Log-Sum-Exp Numerically Stable Operators
  - Low-Latency Inference Calibration Sidecar
invariants_count: 3
created: 2026-09-17
author: Luke
prerequisites:
  - "[[LIB-104 凸最佳化理論與一階二階梯度下降幾何 (Optimization Theory & Gradient Descent)]]"
  - "[[LIB-301 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)]]"
successors:
  - "[[LIB-704 雙進程神經代理人：S1 非自迴歸型態決策引擎 (Jev) 與字節級介面反射模型 (CUA-S1) 深度解剖 (Dual-Process Neural Agent - S1 Non-Autoregressive Typed Decision Engine (Jev) & Byte-Level Interface Reflex Model (CUA-S1))]]"
  - "[[LIB-802 現代深度學習模型量化理論與低精度推論架構 (Quantization Mathematics & Low-Precision Inference)]]"
  - "[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]"
tags:
  - 圖書館
  - AI系統工程
  - 模型校準
  - ECE
  - 溫度縮放
  - 共形預測
  - RLCD
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/08_ai_systems_engineering/LIB-801%20Model%20Calibration%20%26%20Uncertainty%20Estimation%20%28Agent%20EN%29.md)

# 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-104 凸最佳化理論與一階二階梯度下降幾何 (Optimization Theory & Gradient Descent)]]、[[LIB-301 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)]]。
- **後續節點**：[[LIB-704 雙進程神經代理人：S1 非自迴歸型態決策引擎 (Jev) 與字節級介面反射模型 (CUA-S1) 深度解剖 (Dual-Process Neural Agent - S1 Non-Autoregressive Typed Decision Engine (Jev) & Byte-Level Interface Reflex Model (CUA-S1))]]、[[LIB-802 現代深度學習模型量化理論與低精度推論架構 (Quantization Mathematics & Low-Precision Inference)]]、[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]。
- **權威期刊/會議文獻出處**：
  - Guo, Pleiss, Sun, Weinberger (Cornell University, ICML 2017) *On Calibration of Modern Neural Networks*.
  - Angelopoulos & Bates (UC Berkeley, Foundations and Trends in Machine Learning 2023) *Conformal Prediction: A Gentle Introduction*.
  - Almeida et al. (TypeSafe AI, 2026) *Jev: Reinforcement Learning for Calibrated Decisions (RLCD)*.
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
- 保持 Top-1 預測不變，同時大幅壓平飽和 Logits，將 ECE 下降 50% 以上。

### 5. 統計安全前沿：共形預測 (Conformal Prediction, Angelopoulos & Bates 2023)
單純調整溫度依然屬於啟發式方法。在醫療診斷、自駕感測等高風險領域，**共形預測 (Conformal Prediction)** 提供了數學上嚴格的**免分佈統計覆蓋保證 (Distribution-Free Guarantee)**：
給定任意使用者自訂錯誤率 $\alpha \in (0, 1)$（如 $\alpha = 0.05$，對應 95% 置信度），演算法在有限校準樣本上計算非契合度分數（Non-conformity Score）之經驗分位數 $\hat{q}$，輸出一個**預測集合** $\mathcal{C}(X_{\text{test}}) \subseteq \{1, \dots, K\}$，滿足：
$$\mathbb{P}\left(Y_{\text{test}} \in \mathcal{C}(X_{\text{test}})\right) \ge 1 - \alpha$$
**實例啟發**：當使用者畫出曖昧不清的傾斜 8 時，共形預測系統不會武斷給出單一類別，而是回傳集合 $\{7, 8\}$，以 $95\%$ 的嚴格數學信心保證真實標籤必在其中！

### 6. 2026 前沿校準對齊：決策校準強化學習 (RLCD, Reinforcement Learning for Calibrated Decisions)
傳統對齊技術（如 RLHF）針對人類偏好獎勵標量進行最優化，會迫使模型策略為了追求最大獎勵而使預測分佈尖銳化（Entropy Collapse），產生嚴重的過度自信（ECE 惡化）。
在 2026 年最新突破（如 TypeSafe AI 推出的 Jev，詳見 [[LIB-704 雙進程神經代理人：S1 非自迴歸型態決策引擎 (Jev) 與字節級介面反射模型 (CUA-S1) 深度解剖 (Dual-Process Neural Agent - S1 Non-Autoregressive Typed Decision Engine (Jev) & Byte-Level Interface Reflex Model (CUA-S1))]]）中，提出了 **RLCD** 架構：
- **嚴格評分規則 (Strictly Proper Scoring Rules)**：以 Brier Score 作為正則化項，迫使模型輸出真實後驗機率：
  $$\mathcal{B}(\mathbf{p}, y^*) = \sum_{k=1}^K (p_k - \mathbf{1}_{y^* = k})^2$$
- **策略梯度校準約束**：
  $$\nabla_\theta \mathcal{J}_{\text{RLCD}}(\theta) = \mathbb{E}_{(s, a)} \left[ \nabla_\theta \log \pi_\theta(a \mid s) \cdot 2(\mathbf{1}_{a=y^*} - \pi_\theta(a \mid s)) - \lambda \nabla_\theta \text{ECE}(\pi_\theta) \right]$$
- **對齊成果**：徹底杜絕模型「瞎猜卻給出 99% 置信度」的幻覺病態，使 Softmax 輸出具備頻率學派的嚴格置信度，為 S1/S2 雙進程代理人提供了堅實的機率閘控基礎！

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
    """實作 Guo et al. (ICML 2017) 溫度縮放後處理校準器"""
    def __init__(self):
        super().__init__()
        self.temperature = nn.Parameter(torch.ones(1) * 1.5)

    def forward(self, logits: torch.Tensor) -> torch.Tensor:
        return logits / self.temperature

    def fit(self, val_logits: torch.Tensor, val_labels: torch.Tensor):
        nll_criterion = nn.CrossEntropyLoss()
        optimizer = optim.LBFGS([self.temperature], lr=0.01, max_iter=50)

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
    assert ece_after <= ece_before, "校準後誤差應當下降！"
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
  - 最佳化溫度參數必須嚴格落入有限實數區間：$T \in [0.1, 5.0]$。
  - 若擬合結果出現 $T > 5.0$ 或 $T < 0.1$，判定模型特徵存在嚴重退化或驗證集分佈嚴重失真，觸發異常警報。
- **執行保證**: 杜絕過度平滑導致所有預測退化為均勻分佈。

### [RULE-801-03] 共形預測高可靠性覆蓋保證合約 (Conformal Prediction Coverage Guarantee)
- **合約等級**: `SAFETY_CRITICAL`
- **前置條件 (Pre-conditions)**: 應用於高風險醫療、自駕或工業視覺檢測。
- **量化決策邊界 (Decision Thresholds)**:
  - 設定信賴水平 $1 - \alpha = 0.95$（95% 統計覆蓋率保證）。
  - 當模型輸出的預測集合（Prediction Set）大小 $|\mathcal{C}(X)| \ge 3$ 時，判定該樣本存在極高語意多義性，必須強制轉交人工覆核。
---

## 六、📚 權威論文、經典著作與同行評審文獻 (Canonical & Peer-Reviewed References)

1. **現代神經網路校準開創巨作 (ICML 頂會)**
   - *Paper*: Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). "On Calibration of Modern Neural Networks." *International Conference on Learning Representations / ICML 2017*, PMLR 70, pp. 1321-1330.
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
