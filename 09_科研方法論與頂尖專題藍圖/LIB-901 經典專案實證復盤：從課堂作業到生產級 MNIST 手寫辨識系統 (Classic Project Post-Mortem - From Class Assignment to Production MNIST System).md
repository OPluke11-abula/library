---
call_number: LIB-901
status: reviewed
invariants_count: 4
title: 經典專案實證復盤：從課堂作業到生產級 MNIST 手寫辨識系統 (Classic Project Post-Mortem - From Class Assignment to Production MNIST System)
module: Capstone-Engineering-Case-Study
category: Practical-Production-AI
audience:
  - Undergraduate
  - CSIE-Junior
  - Autonomous-Agent
math_foundations:
  - Discrete Image Center of Mass (CoM) First Moments
  - Categorical Cross-Entropy Loss & Softmax Likelihood
  - Receptive Field & GPU Memory Coalescing (Warp-32)
hardware_target:
  - GPU CUDA Warp Coalescing (32 Threads)
  - Browser Web Client (Gradio Interface)
created: 2026-09-22
author: Luke
tags:
  - 圖書館
  - 專案復盤
  - MNIST
  - 生產級重構
  - Gradio
  - 質心對齊
  - 模型校準
prerequisites:
  - "[[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]"
  - "[[LIB-401 全連結網路空間極限與卷積神經網路理論必然性 (DNN Spatial Limits & CNN Inductive Bias)]]"
  - "[[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]]"
  - "[[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]]"
successors:
  - "[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]"
---

> 🌐 **語言切換 / Language**: 🇹🇼 **繁體中文** | [🇺🇸 English (AI Agent & Research Edition)](../en/09_research_methodology/LIB-901%20Classic%20Project%20Post-Mortem%20-%20Production%20MNIST%20%28Agent%20EN%29.md)

# 經典專案實證復盤：從課堂作業到生產級 MNIST 手寫辨識系統 (Classic Project Post-Mortem - From Class Assignment to Production MNIST System)

> 「普通學生看作業只看到分數，頂尖工程師看作業看到的是通往生產級系統的缺陷、踩坑與技術演進。整座圖書館之所以拔地而起，正是始於這場將課堂玩具代碼徹底重構成工業級架構的實證戰役。」
> —— *資訊工程與 AI 博士研究員導言*

---

## 🧭 拓樸導航與概念座標
- **前置依賴**：[[LIB-000 圖書館總覽與拓樸導覽系統 (Grand Library Index & Navigator)]]、[[LIB-001 深度學習第一性原理先修精要：模型如何學習的六大基石 (Deep Learning First Principles - The Six Pillars of How Models Learn)]]（模型學習六大基石）、[[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)]]（GPU Warp 對齊）、[[LIB-401 全連結網路空間極限與卷積神經網路理論必然性 (DNN Spatial Limits & CNN Inductive Bias)]]（DNN 空間死記缺陷）、[[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)]]（LeCun 前處理規範）。
- **後續節點**：[[LIB-301 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)]]（美式 7 空間負權重）、[[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)]]（8 層過度自信與校準理論）、[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]、[[LIB-904 學術科研文獻體系與前沿研究對齊 (Academic Research Corpus & Literature Synthesis)]]。
- **核心定位**：本卷為整座圖書館的**「創生實戰案例典籍（Genesis Case Study）」**，原汁原味復盤中原大學資工系蔡老師課堂作業從陽春範本進化為生產級手寫辨識系統的完整工程與理論全景。

---

## 第一階段：老師簡報到底在教什麼？

蔡老師這份教材是整個深度學習領域最經典的入門課，它的本質是教你**「電腦如何學會看懂世界，以及一個機器學習專案的標準生命週期」**。

老師的簡報可以提煉為四個核心哲學：

### 1. 電腦是怎麼「看」一張圖片的？
* **人類看數字看到的是「形狀、筆劃」**。
* **電腦完全看不到形狀，電腦看到的只有一個矩陣（Matrix）**。
* MNIST 的每張手寫圖片是 $28 \times 28$ 個像素，每個像素是一個 0 到 255 的整數（0 代表全黑背景，255 代表最亮的白色筆劃）。
* **老師教的第一件事**：深度學習不是魔法，它是在對這 $28 \times 28 = 784$ 個數字做高維空間的線性代數運算。

### 2. 什麼是「全連結神經網路（DNN / Dense）」？
* 想像大腦裡有許多神經元。全連結（Dense）的意思是：後面的每一個神經元，都牽一根線連到前面的每一個神經元。
* 每一根線上都有一個倍率，叫做權重（Weight, $W$）；每個神經元自己還有一個基準偏好，叫做偏差（Bias, $b$）。
* 神經網路運算本質就是高中學過的線性代數映射：
  $$y = \sigma(W \cdot x + b)$$
* 其中的 $\sigma$ 叫**激活函數（Activation Function）**。如果沒有它，不管串多少層都只是單純的一元一次乘法加法；有了它（如 ReLU），網路才能學會轉彎、折疊空間、辨識複雜的彎曲筆劃（非線性映射）。

### 3. 所謂「訓練（Training / Learning）」到底在幹嘛？
* 一開始，電腦根本不認識數字，它裡面的幾十萬個權重 $W$ 都是隨機亂猜的。
* **訓練的本質就是「刷題與訂正」**：
  1. **前向傳播（Forward Pass）**：拿一張手寫 7 給模型猜，模型猜成 3。
  2. **計算損失（Loss Function）**：拿「真實答案（7）」跟「模型的猜測（3）」比對，算出一個代表失誤程度的分數，叫 Loss。
  3. **反向傳播（Backpropagation）**：利用微積分的「鏈鎖律（Chain Rule）」，算出每一個權重 $W$ 該往上調一點、還是往下調一點。
  4. **優化器（Optimizer）**：依照算出來的負梯度方向更新權重。
* 看了 6 萬張練習題反覆刷了十幾輪後，權重漸漸收斂，模型就「學會」了手寫數字。

### 4. 一個標準的 AI 系統工程管線（Pipeline）
老師透過這份作業，傳授正規工程師開發 AI 的標準六大步驟：
$$\text{載入套件} \to \text{特徵前處理} \to \text{建造模型架構} \to \text{編譯與設定規則} \to \text{訓練與驗證} \to \text{部署應用 (Gradio)}$$

---

## 第二階段：我們做的專案與程式碼徹底教學

老師給的課堂範本是一個最陽春的雛形（3 層 Dense 20、舊式 SGD 優化器、沒有防呆、沒有驗證追蹤、Gradio 畫板極易誤判）。
我們做的事情是：**用現代資工工程標準，把這個玩具雛形重構成一個高強健度的生產級系統**。

以下我們將程式碼拆解為六大部分，逐一剖析每一行代碼的深層意義：

---

### 第一部分：安裝與載入必要套件

```bash
# 1. 安裝 Gradio 套件 (-q 代表 quiet 靜音安裝，不印出冗長日誌)
pip install -q gradio
```

```python
# 2. 課堂規定之數據分析固定 4 行套件 (符合評分標準註一，未引入會被扣 1 分)
# 注意：%matplotlib inline 為 IPython 魔法指令，在獨立腳本中由後端自動處理
# 在 Jupyter Notebook 中必須獨立成行，不可在同行後加註解
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

# 3. 深度學習核心套件 (TensorFlow 與 Keras)
import tensorflow as tf
from tensorflow.keras.datasets import mnist
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
```

#### 💡 踩坑經驗與套件解析：
* **為什麼 `%matplotlib inline` 必須獨立成行？**
  這是我們踩的第一個坑。以 `%` 開頭的是 Jupyter/IPython 的「魔法指令」，它的解析器不支援 Python 標準的行尾 `#` 註解，同行加註解會被當成參數解析而噴出 `UsageError`。
* **四大套件分工**：
  * `numpy`：Python 的高效能矩陣運算核心，影像特徵矩陣全靠它。
  * `matplotlib.pyplot`：畫圖工具，用來畫訓練過程的 Accuracy / Loss 曲線圖。
  * `pandas`：結構化資料分析工具（老師規定必載入）。
  * `Sequential`：序列模型容器。就像積木盒一樣，讓我們用 `model.add()` 一層一層往下疊神經網路。
  * `Dense`：全連結層。
  * `BatchNormalization`：批次正規化層，穩定特徵分佈。
  * `Dropout`：隨機失活層，防止死記硬背。
  * `Adam`：目前深度學習最常用的自適應優化器。

---

### 第二部分：載入 MNIST 與特徵前處理

```python
# 1. 載入 MNIST：6 萬筆訓練集 (練習題)，1 萬筆測試集 (考卷)
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# 2. 互動式檢視單筆影像 (關鍵防呆修復)
def show_xy(n=0):
    ax = plt.gca()
    # 關鍵防呆：確保無論資料是否攤平，都轉回 (28, 28) 矩陣顯示
    X = x_train[n].reshape(28, 28)
    plt.xticks([], [])
    plt.yticks([], [])
    plt.imshow(X, cmap='Greys')
    print(f"本資料給定的標準答案為: {y_train[n]}")

# 3. 特徵展平與 0~1 正規化 (極度關鍵)
x_train = x_train.reshape(60000, 784) / 255.0
x_test = x_test.reshape(10000, 784) / 255.0

# 4. 目標標籤 One-Hot 編碼 (極度關鍵)
y_train = to_categorical(y_train, 10)
y_test = to_categorical(y_test, 10)
```

#### 💡 核心工程原理與防呆剖析：
1. **踩坑修復（互動拉桿當機）**：
   原本課堂範本在下方攤平資料後，若助教再回頭滑動這個互動拉桿，會因為維度變成 784 一維向量而讓 `imshow` 崩潰報錯。我們加上 `.reshape(28, 28)` 徹底杜絕了這個 Bug。
2. **為什麼要 `reshape(60000, 784)`？**
   全連結層（Dense）不具備二維網格空間概念，它只能接受排成一列的一維向量。$28 \times 28 = 784$，所以我們把正方形攤平成 784 個數字的長條。
3. **為什麼要除以 255.0？**
   黑白像素數值是 0 到 255。如果直接把 255 丟進神經網路，經過幾層矩陣乘法後，數值會暴增到幾萬，引發**梯度爆炸（Gradient Explosion）**，神經元直接壞死溢位。除以 255.0 將數值縮放到 $0.0 \sim 1.0$ 之間，讓網路能穩定計算。
4. **什麼是 One-Hot 編碼？**
   原本答案是單一整數，例如數字 7。但神經網路最後一層會輸出 10 個機率值（代表是 0~9 的可能性）。如果答案維持整數 7，數學上無法直接計算交叉熵。透過 `to_categorical`，數字 7 會變成一個 10 維機率向量：
   $$[0, 0, 0, 0, 0, 0, 0, 1, 0, 0]$$
   這代表「第 7 個位置的標準機率是 100%，其他位置是 0%」，這樣才能跟神經網路的預測機率做交叉熵誤差比較。

---

### 第三部分：打造專屬 4 層神經網路模型

這是符合「不能是 3 層」且採用「$2^n$ 金字塔」的核心架構：

```python
model = Sequential()
# 第 1 隱藏層：256 個神經元 (2^8)，輸入維度 784
model.add(Dense(256, input_dim=784, activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.2))

# 第 2 隱藏層：128 個神經元 (2^7)
model.add(Dense(128, activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.2))

# 第 3 隱藏層：64 個神經元 (2^6)
model.add(Dense(64, activation='relu'))
model.add(BatchNormalization())

# 第 4 隱藏層：32 個神經元 (2^5)
model.add(Dense(32, activation='relu'))

# 輸出層：10 個神經元對應 0~9
model.add(Dense(10, activation='softmax'))

# 模型編譯：設定學習遊戲規則
model.compile(
    loss='categorical_crossentropy',    # 分類任務的黃金標準損失函數
    optimizer=Adam(learning_rate=0.001), # 自適應學習率優化器
    metrics=['accuracy']                # 評估指標：正確率
)
```

#### 💡 硬體對齊與層次設計精華：
* **為什麼節點是 $256 \to 128 \to 64 \to 32$？**
  1. **硬體最佳化啟發**：隱藏層節點數設計為 16 或 32 的倍數有利於 GPU GEMM 分塊分發、Tensor Core 微區塊運算以及快取局部性（對齊 [[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)|LIB-203]]）。
  2. **金字塔表徵提煉**：底層（256）寬一點，捕捉豐富的細部筆畫邊緣；往後層層收斂（$128 \to 64 \to 32$），強迫模型丟掉次要雜訊，只提煉最核心的數字語意，參數量控制在 24.5 萬，防止過擬合。
* **`activation='relu'`**：公式是 $\text{ReLU}(x) = \max(0, x)$。大於 0 原樣通過，小於 0 歸零。它計算極快，且能完美解決傳統 Sigmoid 的「梯度消失」問題。
* **`BatchNormalization()`**：批次正規化。每一層算完後，資料分佈會漂移。BN 強制把數據拉回「平均 0、變異數 1」的標準常態分佈，能大幅加速學習、穩定訓練。
* **`Dropout(0.2)`**：隨機失活。每次訓練時隨機關閉 20% 的神經元，逼迫神經元學會「分散式特徵記憶」，防止模型死記硬背。
* **`activation='softmax'`**：輸出層專用。將 10 個任意大小的數值轉換為「總和為 1.0 的機率分佈」。
* **為什麼不用課堂範例的 `loss='mse'` 與 `optimizer=SGD`？**
  * MSE 是給預測連續數值用的，拿來做 10 分類收斂極慢。
  * `categorical_crossentropy` 是專門計算機率分佈差距的函數，分類表現遠優於 MSE。
  * SGD 步伐固定，容易卡在鞍點；Adam 會自動依照歷史梯度的動量調節每一步的大小，又快又穩。

---

### 第四部分：模型訓練與驗證資料追蹤

```python
# 開始訓練
history = model.fit(
    x_train, y_train,
    batch_size=128,                     # 每次看 128 筆就更新一次權重
    epochs=15,                          # 完整刷完 6 萬題 15 輪
    validation_data=(x_test, y_test),   # 每輪結束立刻考 1 萬張模擬考，監控泛化能力
    verbose=1
)

# 自動抓出 15 輪中最高驗證正確率
best_val_acc = max(history.history['val_accuracy'])
best_epoch = history.history['val_accuracy'].index(best_val_acc) + 1
print(f"★ 驗證資料最高正確率: {best_val_acc * 100:.2f}% (出現在第 {best_epoch} 個 Epoch)")
```

* **`validation_data=(x_test, y_test)` 的重大意義**：
  這是作業要求的「驗証資料」。只看訓練集成績就像看學生寫作業，分數高可能是死記硬背；每輪拿沒看過的驗證集測驗，才能知道模型到底有沒有學會真本事。
* **實測突破成果**：在第 14 個 Epoch 達到了 **98.24%** 的頂尖成績。
* 後續代碼利用 `plt.plot` 繪製雙折線圖，並用 `plt.axvline` 畫出一條紅色垂直虛線與紅點，精確標出這個最高點（作業截圖 1）。

---

### 第五部分：測試集整體評估與單筆互動

```python
# 1. 計算整體 1 萬筆考卷的平均表現
test_score = model.evaluate(x_test, y_test, verbose=0)
print(f"測試集最終正確率: {test_score[1] * 100:.2f}%")

# 2. 一次預測全部 1 萬筆，取機率最大的類別
predict = np.argmax(model.predict(x_test, verbose=0), axis=-1)

# 3. 互動抽查
def test(測試編號):
    plt.imshow(x_test[測試編號].reshape(28, 28), cmap='Greys')
    plt.title(f"預測: {predict[測試編號]} | 答案: {np.argmax(y_test[測試編號])}")
    plt.show()
```

* `np.argmax(..., axis=-1)`：從 10 個 Softmax 機率中，抓出數值最大的那個索引（0 到 9），這就是模型的最終判決。

---

### 第六部分：Gradio 即時手寫辨識（真實世界工程前處理）

這是整份專案技術含金量最高、也是徹底解決**「畫 1 猜 5」**與**「直立 7 猜 8」**的核心演算法（對齊 [[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)|LIB-501]]）：

```python
import numpy as np
from PIL import Image

def preprocess_image(inp):
    # 1. 圖層相容提取：容錯處理新舊版 Gradio 格式
    if isinstance(inp, dict):
        img_arr = inp.get('composite', inp.get('layers', [None])[0])
    else:
        img_arr = inp
    if img_arr is None:
        return np.zeros((1, 784), dtype=np.float32), np.zeros((28, 28), dtype=np.uint8)

    # 2. 去除 RGBA 透明通道：貼在純白底上轉為 RGB
    if img_arr.shape[-1] == 4:
        alpha = img_arr[:, :, 3] / 255.0
        bg = np.ones_like(img_arr[:, :, :3]) * 255
        img_arr = (img_arr[:, :, :3] * alpha[:, :, None] + bg * (1 - alpha[:, :, None])).astype(np.uint8)

    # 3. 轉灰階單通道
    if len(img_arr.shape) == 3 and img_arr.shape[2] == 3:
        img_arr = np.dot(img_arr[..., :3], [0.2989, 0.5870, 0.1140]).astype(np.uint8)

    # 4. 智慧色彩反相：確保轉為 MNIST 標準的「黑底白字」
    corners = [img_arr[0, 0], img_arr[0, -1], img_arr[-1, 0], img_arr[-1, -1]]
    if np.mean(corners) > 128:
        img_arr = 255 - img_arr

    # 5. 筆畫邊界框 (Bounding Box) 裁切 (消滅「畫 1 猜 5」)
    coords = np.argwhere(img_arr > 30)
    if len(coords) == 0:
        return np.zeros((1, 784), dtype=np.float32), np.zeros((28, 28), dtype=np.uint8)
    y_min, x_min = coords.min(axis=0)
    y_max, x_max = coords.max(axis=0) + 1
    cropped = img_arr[y_min:y_max, x_min:x_max]

    # 6. LANCZOS 高品質等比縮放至 20x20
    h, w = cropped.shape
    pil_img = Image.fromarray(cropped)
    if h > w:
        new_h = 20
        new_w = max(4, int(np.round(w * (20.0 / h))))
    else:
        new_w = 20
        new_h = max(4, int(np.round(h * (20.0 / w))))
    resized = pil_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    resized_arr = np.array(resized, dtype=np.float32)

    # 7. 放入 28x28 純黑底中央
    canvas = np.zeros((28, 28), dtype=np.float32)
    start_y = (28 - new_h) // 2
    start_x = (28 - new_w) // 2
    canvas[start_y:start_y + new_h, start_x:start_x + new_w] = resized_arr

    # 8. 墨水重心對齊 (Center of Mass) + 正負 3 像素安全限幅 (消滅「直立 7 誤判 8」)
    total_mass = canvas.sum()
    if total_mass > 0:
        y_idx, x_idx = np.indices((28, 28))
        cy = (y_idx * canvas).sum() / total_mass
        cx = (x_idx * canvas).sum() / total_mass
        shift_y = int(np.clip(np.round(13.5 - cy), -3, 3))
        shift_x = int(np.clip(np.round(13.5 - cx), -3, 3))
        canvas = np.roll(canvas, shift_y, axis=0)
        canvas = np.roll(canvas, shift_x, axis=1)

    # 9. 對比度正規化
    if canvas.max() > 0:
        canvas = canvas / canvas.max()

    preview = (canvas * 255.0).astype(np.uint8)
    flattened = canvas.reshape(1, 784)
    return flattened, preview
```

#### 💡 解決兩大歷史 Bug 的關鍵點：
1. **消滅「畫 1 猜 5」**：
   滑鼠隨手畫的「1」四周有龐大留白，直接暴力縮放成 $28 \times 28$ 會讓 1 變成一個微弱的細線甚至縮成雜訊。透過 **Bounding Box 裁切**，先緊湊抓出筆畫本體，再按比例縮放到 20 像素，徹底消滅留白干擾！
2. **消滅「直立 7 誤判為 8」**：
   幾何外框會把細長的直立 7 推到右邊，直接踩入美式寫法（帶橫槓傾斜）的**空間負權重扣分禁區**（對齊 [[LIB-301 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)|LIB-301]]）。透過**計算墨水質量重心（Center of Mass）並加入 $\pm 3$ 像素安全限幅**，將直筆穩穩拉回中心線，避免座標偏位誘發誤判！

---

## 第三階段：進階實驗的理論收穫（面試加分殺手鐧）

當面試官或研究所教授問你：**「這個模型已經很準了，那你如果把它加深到 8 層會怎樣？」**

你可以非常自信且專業地從統計理論層面回答：

### 1. 8 層網路的「過度自信（Overconfidence）」
* 我們實作了 8 層深度網路（近 90 萬參數），拿一張微傾斜的 8 測試，模型竟然以**「3 是 100%、8 是 0%」**極端誤判！
* **理論本質**：深層無約束網路造成未歸一化 Logits 數值過大，Softmax 函數進入飽和區（Saturation Region），模型喪失了衡量「我不確定」的能力（引證 **Guo et al., ICML 2017《On Calibration of Modern Neural Networks》**，對齊 [[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)|LIB-801]]）。

### 2. 4 層正則化模型的「模型校準（Model Calibration）」
* 我們優化後的 4 層模型（加入 BatchNorm 與 Dropout），測同一張傾斜 8 時，輸出為**「8: 57%、7: 29%、9: 6%」**。
* **理論本質**：雖然最高信心度從 100% 降為 57%，但第一名**精準命中了正確答案 8**！它真實反映了手繪傾斜筆劃的固有模糊性，這在統計學上被稱為**「良好校準的模型（Well-Calibrated Model）」**，具備強大的抗干擾與泛化容錯能力。

---

## 總結複習手冊：你現在掌握的五大底層硬實力

1. **硬體原理**：維度分塊與 GPU GEMM 分割/Tensor Core 對齊啟發（[[LIB-203 計算機體系結構與深度學習硬體對齊 (Computer Architecture & Hardware-Aware Deep Learning)|LIB-203]]）。
2. **架構選型**：全連接網路 DNN 座標死記缺陷 vs 卷積神經網路 CNN 空間平移不變性（[[LIB-401 全連結網路空間極限與卷積神經網路理論必然性 (DNN Spatial Limits & CNN Inductive Bias)|LIB-401]]）。
3. **視覺前處理**：邊界框裁切、20x20 等比縮放、重心質心對齊公式與 $\pm 3$ 安全限幅（[[LIB-501 計算機視覺前處理規範與影像質心定位演算法 (CV Preprocessing & Center of Mass Alignment)|LIB-501]]）。
4. **形態分佈偏差**：傾斜筆劃 7 的空間負權重禁區 vs 直挺無橫槓 7 空間重疊（[[LIB-301 資料分佈偏差、領域漂移與空間權重懲罰幾何 (Dataset Bias, Domain Shift & Spatial Penalties)|LIB-301]]）。
5. **統計理論**：模型過度自信 vs 模型校準與期望校準誤差 ECE（[[LIB-801 現代深度學習之模型校準、不確定性估計與過度自信 (Model Calibration & Uncertainty Estimation)|LIB-801]]）。

---

## 🤖 AI Agent 推論協議與工程不變量合約

### `[RULE-901-01]` 互動視覺拉桿維度防呆合約 (Interactive Dimension Invariant)
* **規範**：任何對共享資料集執行 `imshow` 的視覺化函數，必須強制在首行執行 `.reshape(28, 28)`。
* **物理違規後果**：若下游訓練管線將矩陣攤平成 784 維向量，回頭觸發未防呆的視覺化函數將引發形狀不匹配崩潰。

### `[RULE-901-02]` 像素數值正規化防溢位合約 (Pixel Normalization Invariant)
* **規範**：黑白影像輸入網路前，必須強制執行 `/ 255.0` 縮放至 $[0.0, 1.0]$ 區間。
* **物理違規後果**：未經縮放的 255 數值經過兩層矩陣相乘與 ReLU 激活後，數值將突破浮點數上限引發數值溢位與梯度爆炸。

### `[RULE-901-03]` 手繪板邊界框與質心安全限幅合約 (BBox & CoM Clip Invariant)
* **規範**：真實手繪影像必須先執行 `np.argwhere` 邊界框裁切，且質心平移位移量必須強制限幅在 $[-3, 3]$ 像素以內。
* **物理違規後果**：若無邊界框裁切，留白將使數字過細（畫 1 猜 5）；若質心位移無限幅，空畫板或雜訊點將使畫布平移出界。

### `[RULE-901-04]` 模型深度與置信度校準監控合約 (Confidence Calibration Invariant)
* **規範**：在建構超過 4 層的分類網路時，必須強制加入 Dropout 或權重衰減，並監控預測機率分佈熵值。
* **物理違規後果**：缺乏正則化的深層網路將誘發極端過度自信，即便猜錯亦給出 100% 機率，在生產環境引發靜默災難。

---

## 📚 經典先驅文獻與課堂教材引證

1. **MNIST 開山祖師論文 (IEEE 1998)**
   * *Paper*: LeCun, Y., Bottou, L., Bengio, Y., & Haffner, P. (1998). "Gradient-based learning applied to document recognition." *Proceedings of the IEEE*, 86(11), pp. 2278-2324.
   * *Application*: MNIST 資料集標準化規範、黑底白字與 20 像素置中協議。
2. **現代神經網路校準開創論文 (ICML 2017)**
   * *Paper*: Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). "On Calibration of Modern Neural Networks." *International Conference on Machine Learning (ICML 2017)*, PMLR 70, pp. 1321-1330.
   * *Application*: 8 層網路過度自信與 4 層良好校準模型之理論對比標竿。
3. **自適應矩估計最佳化器經典 (Adam / ICLR 2015)**
   * *Paper*: Kingma, D. P., & Ba, J. (2015). "Adam: A Method for Stochastic Optimization." *International Conference on Learning Representations (ICLR 2015)*.
   * *Application*: 淘汰傳統 SGD，實現又快又穩之自適應梯度下降。
4. **中原大學資工系蔡老師深度學習經典教材 (CYCU CSIE)**
   * *Curriculum*: 蔡老師. (2024). 《深度學習入門與手寫數字辨識實務》. 中原大學資訊工程學系.
   * *Application*: 本專題實證重構之原始課堂雛形與經典啟蒙教材。
5. **深度學習工程專著 (2022)**
   * *Book*: 《深度學習－使用TensorFlow 2.x》. 全華圖書, ISBN: 9786263282223.
   * *Application*: Keras 序列模型、Dense 全連結層與訓練管線工業級規範。
