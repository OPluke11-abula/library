---
call_number: LIB-905
status: reviewed
invariants_count: 5
title: 前沿視覺與具身多模態專題研發藍圖：五大題目技術全景與消融實證指南 (Frontier Vision & Multimodal Capstone Blueprints - Five Grand Research Specifications)
module: Research-Methodology
category: Capstone-Engineering-Blueprints
audience:
  - Undergraduate
  - Graduate-PhD
  - Autonomous-Agent
math_foundations:
  - Multimodal Contrastive & Diffusion Objective Formulations
  - End-to-End System Evaluation Metrics (mAP, LPIPS, CLIP-Score, Navigation SLA)
  - Full-Stack Pipeline Decomposition & Hardware Budgeting
hardware_target:
  - Workstation with Single/Dual NVIDIA RTX 4090 (24GB)
  - Unity 3D Engine & WebXR / Mobile Edge Deployment
created: 2026-09-24
author: Luke
tags:
  - 專題藍圖
  - 3DGS
  - 影像編輯
  - 物件生成
  - 智慧導覽
  - 國科會專題
prerequisites:
  - "[[LIB-407 指令引導擴散影像編輯與跨注意力非目標內容保持 (Instruction-Guided Diffusion Editing, Cross-Attention Control & Non-Target Preservation)]]"
  - "[[LIB-408 情境感知擴散物件生成、幾何光照分析與無縫影像融合 (Context-Aware Object Generation, Illumination Estimation & Image Compositing)]]"
  - "[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]"
  - "[[LIB-505 開放詞彙 3D 高斯潑濺與語意場景圖檢索 (Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval)]]"
  - "[[LIB-506 大語言模型驅動之 3DGS 空間問答、階層場景圖與具身導航 (LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation)]]"
  - "[[LIB-903 專題基石藍圖、學術推甄與多模態研究演進 (Capstone Blueprint & Academic Research Evolution)]]"
successors: []
---

> 語言切換 / Language: 🇹🇼 **繁體中文** | [🇺🇸 English (Agent Edition)](../en/09_research_methodology/LIB-905%20Frontier%20Vision%20%26%20Multimodal%20Capstone%20Blueprints%20%28Agent%20EN%29.md)

# 前沿視覺與具身多模態專題研發藍圖：五大題目技術全景與消融實證指南 (Frontier Vision & Multimodal Capstone Blueprints - Five Grand Research Specifications)

## 導讀與概念座標
- **前置依賴**：[[LIB-504 3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化 (3D Gaussian Splatting Theory & Rasterization)]]、[[LIB-505 開放詞彙 3D 高斯潑濺與語意場景圖檢索 (Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval)]]、[[LIB-506 大語言模型驅動之 3DGS 空間問答、階層場景圖與具身導航 (LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation)]]、[[LIB-407 指令引導擴散影像編輯與跨注意力非目標內容保持 (Instruction-Guided Diffusion Editing, Cross-Attention Control & Non-Target Preservation)]]、[[LIB-408 情境感知擴散物件生成、幾何光照分析與無縫影像融合 (Context-Aware Object Generation, Illumination Estimation & Image Compositing)]]。
- **核心定位**：本卷冊直接對齊指導教授提出之「五大專題研究題目建議」，將 5 份研發海報與規格書，結構化提煉為大專生專題實作、國科會大專生研究計畫（C801）以及學術競賽與推甄之核心作戰藍圖。

---

## 一、五大專題全景矩陣與技術維度對照

| 題目編號 | 題目名稱 (中/英) | 核心技術基底 | 關鍵學術痛點 | 對應旗艦典籍 | 難度與推薦配置 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Topic 01** | **基於文字語意查詢之 3DGS 場景物件搜尋方法**<br>*(Text-Guided Object Retrieval in 3DGS Scenes)* | 3DGS + CLIP + SAM + 跨視角共識 | 傳統 3DGS 缺乏語意；開放詞彙檢索維度爆炸與多視角邊界漂移 | [[LIB-505 開放詞彙 3D 高斯潑濺與語意場景圖檢索 (Open-Vocabulary 3D Gaussian Splatting & Semantic Retrieval)]] | ★★★★☆<br>RTX 4090 / 24GB |
| **Topic 02** | **結合大語言模型與 3DGS 之智慧場景問答導覽系統**<br>*(Intelligent Scene QA & Navigation using LLMs and 3DGS)* | 3DGS + LLM + 3D 場景圖 + A* 拓樸導航 | 純文字 LLM 無空間幾何感知；神經輻射場缺乏符號邏輯與路徑規劃能力 | [[LIB-506 大語言模型驅動之 3DGS 空間問答、階層場景圖與具身導航 (LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation)]] | ★★★★☆<br>RTX 4090 + Unity |
| **Topic 03** | **基於 3DGS 之智慧虛擬校園導覽系統**<br>*(Intelligent Virtual Campus Tour System Using 3DGS)* | 大規模空拍/地面 3DGS + 階層式校園圖 + Unity MR | 戶外大規模場景重建顯存溢出；多棟館舍跨樓層導覽與即時渲染流暢度 | [[LIB-506 大語言模型驅動之 3DGS 空間問答、階層場景圖與具身導航 (LLM-Grounded 3D Scene QA, Hierarchical Scene Graphs & Embodied Navigation)]] | ★★★☆☆<br>RTX 4080+ / Unity |
| **Topic 04** | **基於區域感知與非目標內容保持之細粒度文字指令影像編輯方法**<br>*(Fine-Grained Instruction-Based Image Editing with Non-Target Preservation)* | 擴散模型 + 跨注意力調製 + 潛空間反演 | 指令編輯容易產生牽一髮動全身的「過度編輯」，非目標背景與物體結構崩塌 | [[LIB-407 指令引導擴散影像編輯與跨注意力非目標內容保持 (Instruction-Guided Diffusion Editing, Cross-Attention Control & Non-Target Preservation)]] | ★★★★☆<br>單卡 16GB+ VRAM |
| **Topic 05** | **基於場景語意與光照一致性之情境感知物件生成與影像融合方法**<br>*(Context-Aware Object Generation & Compositing with Illumination Consistency)* | 條件擴散 (ControlNet) + 深度法線 + 球諧光照 + 陰影合成 | 新生成插入之實體缺乏真實感，透視比例失調、光源方向矛盾、無接觸陰影（生硬貼圖感） | [[LIB-408 情境感知擴散物件生成、幾何光照分析與無縫影像融合 (Context-Aware Object Generation, Illumination Estimation & Image Compositing)]] | ★★★★★<br>單卡 24GB VRAM |

---

## 二、五大專題模組化生命週期與工程規格

### 題目 1：3DGS 文字語意查詢與場景物件搜尋 (LIB-505)
```
[輸入影像 + COLMAP] ──> [3DGS 重建] ──> [SAM 2D 分割 + CLIP 編碼] ──> [低維特徵蒸餾至 3D 高斯]
                                                                        │
[文字查詢: "找出可以坐的東西"] ──> [CLIP 文字嵌入] ──> [餘弦相似度矩陣乘法] ─────┘
                                                                        │
                                                                        ▼
                                                   [複合評分篩選 & DBSCAN 空間去噪]
                                                                        │
                                                                        ▼
                                                   [Unity / 網頁端目標高亮 Shader 渲染]
```
- **核心數學指標**：$\text{Score} = \alpha S_{\text{text}} + \beta S_{\text{view}} + \gamma S_{\text{conf}}$。
- **評價標準**：Top-1 / Top-3 Accuracy ($\ge 85\%$)、Retrieval mAP ($\ge 0.76$)、查詢延遲 $< 300\text{ms}$。

### 題目 2：LLM + 3DGS 智慧場景問答導覽系統 (LIB-506)
- **核心架構**：
  1. **符號化 3D 場景圖 (ConceptGraphs 範式)**：利用目標檢測器識別實體質心 $c_i$、邊界框與類別名稱，構建 JSON 屬性圖。
  2. **LLM 空間推理鏈 (ReAct / CoT)**：輸入「哪一台是 3D 印表機？」，LLM 解析場景圖並結合相機當前座標回答方位（「右側靠牆黑色設備」），並返回目標節點 ID。
  3. **視角導引與相機平滑移動**：根據計算出的目標位置，Unity 觸發 Catmull-Rom 樣條曲線相機漫遊，視線平滑轉向目標。

### 題目 3：3DGS 智慧虛擬校園導覽系統 (LIB-506)
- **校園級階層場景構建**：
  - **Level 1 (校區/大樓)**：多視角無人機空拍重建（VastGaussian 分塊對齊）。
  - **Level 2 (樓層與走廊)**：手持穩定器廣角錄影，建立穿梭導航網格（NavMesh）。
  - **Level 3 (實驗室/重要景點)**：細粒度毫米級高斯掃描，加入語音標籤與互動看板。
- **亮點實作**：語音輸入「帶我去資工系電腦教室」，系統直接在地圖上渲染 3D 導航虛線箭頭，並自動切換分塊 LOD 高斯模型以確保流暢。

### 題目 4：細粒度指令影像編輯與非目標保持 (LIB-407)
- **核心管線**：
  1. **指令解析**：解析「把汽車輪框改成黑色，其他地方不要變」 $\to$ 目標 Token: `wheels`, 屬性: `black`, 保持: `car body, background`。
  2. **注意力增強與抑制**：$A_{\text{target}} \times 1.5$，$A_{\text{bg}} \times 0.2$。
  3. **非目標特徵鎖定 (MasaCtrl 範式)**：在 U-Net 自注意力層中，背景像素直接抄取 DDIM Inversion 原始影像的 Key/Value，徹底杜絕背景重繪。
- **量化指標**：背景 $\text{LPIPS} \le 0.04$ [TARGET]、編輯成功率 $\ge 90\%$ [TARGET]、CLIP Score $\ge 28.5$ [TARGET]。

### 題目 5：情境感知物件生成與光照幾何一致性影像融合 (LIB-408)
- **五階段物理融合管線**：
  1. **空間語意與可用空間判定**：分析客廳沙發旁地板幾何平面。
  2. **單目深度與透視校正**：Depth Anything V2 深度估計，由相機焦距推算落地燈在該深度下的精確像素高度 $h = \frac{f \cdot H}{Z}$。
  3. **球諧環境光照估計**：估計場景主光源入射角 $\mathbf{L} = (\theta, \phi)$。
  4. **條件式生成**：ControlNet 配合透視邊界框生成落地燈候選圖像。
  5. **物理陰影與色調後調和**：沿 $-\mathbf{L}$ 方向生成接觸投影陰影，並由 Harmonizer 模型統一色溫。

---

## 三、國科會專題計畫（NSTC C801）結構化撰寫策略

若以此五大題目申報國科會大專學生研究計畫，研究計畫書架構建議如下：

```markdown
1. 研究動機與背景 (Research Background & Motivation)
   - 直擊現有 2D 視覺或純文本 LLM 的物理世界盲點。
   - 闡述 3D 高斯潑濺相比傳統 NeRF 具備 100+ FPS 實時光柵化優勢，但缺乏語意結構與幾何推理。
2. 關鍵創新與研究方法 (Novel Methodology)
   - 方法架構圖（參考 LIB-505 / LIB-407 系統圖）。
   - 核心數學模型推導（損失函數、跨視角共識公式、注意力空間調製）。
3. 預期成果與消融驗證 (Expected Deliverables & Ablation Studies)
   - 定量表格對比：與 baseline (LERF / InstructPix2Pix / Inpainting) 進行橫向消融。
   - 可交互展示之原型系統（Unity 3DGS 導覽 Demo / Gradio 編輯畫板）。
4. 經費與設備需求 (Resource Justification)
   - 單張或雙張 NVIDIA RTX 4090 算力伺服器、手持雲台相機、VR 頭顯。
```

---

## 四、全域系統規範與不變量 (System Invariants)

### [RULE-905-01] 3DGS 語意標註多視角一致性防呆
- **等級**: `CRITICAL_INVARIANT`
- **邊界**: 在構建 3D 語意高斯場時，任何實體物件在各訓練視角下的反投影 Intersection-over-Union (IoU) 必須 $\ge 0.65$。若低於此閾值，該視角特徵不得參與三維語意碼本更新。

### [RULE-905-02] 影像編輯非目標區域嚴格無損防護
- **等級**: `CRITICAL_INVARIANT`
- **邊界**: 在細粒度指令影像編輯中，任何標註為「保持不變」的背景像素，在編輯前後的平均絕對誤差（MAE）必須小於 3/255，且結構相似性指標 $\text{SSIM} \ge 0.96$。

### [RULE-905-03] 影像融合接觸陰影衰減物理律
- **等級**: `HIGH_INVARIANT`
- **邊界**: 凡插入重力接觸實體（如落地燈、椅子），必須在地表生成連續接觸陰影。無陰影生成之合成影像判定為無效樣本（Invalid Compositing）。

### [RULE-905-04] 大規模校園 3DGS 分塊記憶體預算
- **等級**: `HIGH_INVARIANT`
- **邊界**: 大規模場景（校園/大樓）必須實施空間八叉樹（Octree）或網格分塊（Spatial Chunking），單一渲染視錐體內的高斯數量上限為 $4.5 \times 10^6$ 點，動態 VRAM 佔用不得超過 14GB。

### [RULE-905-05] 具身路徑規劃零碰撞原則
- **等級**: `CRITICAL_INVARIANT`
- **邊界**: 導航演算法生成的相機或虛擬人移動軌跡，其與場景中任何實體障礙物的幾何距離必須恆大於半徑閾值 $R_{\text{safe}} = 0.35\text{m}$。

---

## 五、標準參考文獻庫 (Canonical Research Corpus)

1. **Kerbl, B., et al.** (2023). *3D Gaussian Splatting for Real-Time Radiance Field Rendering*. **ACM TOG / SIGGRAPH 2023**.
2. **Qin, M., et al.** (2024). *LangSplat: 3D Language Gaussian Splatting*. **CVPR 2024**.
3. **Gu, J., et al.** (2024). *ConceptGraphs: Open-Vocabulary 3D Scene Graphs for Robot Perception*. **ICRA 2024**.
4. **Brooks, T., et al.** (2023). *InstructPix2Pix: Learning to Follow Image Editing Instructions*. **CVPR 2023**.
5. **Cao, M., et al.** (2023). *MasaCtrl: Tuning-Free Mutual Self-Attention Control for Consistent Image Synthesis and Editing*. **ICCV 2023**.
6. **Yang, L., et al.** (2024). *Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data*. **CVPR 2024**.
7. **Zhang, L., et al.** (2023). *Adding Conditional Control to Text-to-Image Diffusion Models*. **ICCV 2023**.
8. **Lin, C., et al.** (2024). *VastGaussian: Vast 3D Gaussians for Large Scene Reconstruction*. **CVPR 2024**.
