import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import katex from 'katex';
import { Marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_DIR = path.resolve(__dirname, '../../');
const ROOT_DIR = path.resolve(__dirname, '../../../');
const MERMAID_CACHE_DIR = path.join(SITE_DIR, 'src', 'data', 'mermaid-cache');

export interface KnowledgeHall {
  id: string;
  code: string;
  nameZh: string;
  nameEn: string;
  dirZh: string;
  dirEn: string;
  iconName: string;
  descriptionZh: string;
  descriptionEn: string;
}

export const KNOWLEDGE_HALLS: KnowledgeHall[] = [
  {
    id: 'hall-00',
    code: '00',
    nameZh: '總覽與拓樸導覽',
    nameEn: 'Overview & Topological Navigation',
    dirZh: '00_總覽與拓樸導覽',
    dirEn: 'en/00_overview',
    iconName: 'compass',
    descriptionZh: '圖書館總綱、深度學習第一性原理與全館概念拓樸索引地圖。',
    descriptionEn: 'Grand Library index, deep learning first principles, and global topological roadmap.'
  },
  {
    id: 'hall-01',
    code: '01',
    nameZh: '數學與理論基石',
    nameEn: 'Mathematics & Foundations',
    dirZh: '01_數學與理論基石',
    dirEn: 'en/01_mathematics',
    iconName: 'math',
    descriptionZh: '從線性代數高維幾何出發，建立微積分、機率統計、資訊理論與凸最佳化收斂性證明。',
    descriptionEn: 'Linear algebra, high-dimensional geometry, probability, variational inference & convex optimization.'
  },
  {
    id: 'hall-02',
    code: '02',
    nameZh: '計算機系統與硬體架構',
    nameEn: 'Computer Systems & Architecture',
    dirZh: '02_計算機系統與硬體架構',
    dirEn: 'en/02_computer_systems',
    iconName: 'cpu',
    descriptionZh: '剖析現代 GPU 體系結構：32 執行緒 Warp 對齊、Tensor Core Tiling、快取層級與硬體感知設計。',
    descriptionEn: 'GPU Warp scheduling, Tensor Core tiling, cache hierarchies & hardware-aware deep learning.'
  },
  {
    id: 'hall-03',
    code: '03',
    nameZh: '機器學習與統計學習原理',
    nameEn: 'Machine Learning & Statistical Foundations',
    dirZh: '03_機器學習與統計學習原理',
    dirEn: 'en/03_machine_learning',
    iconName: 'chart',
    descriptionZh: '探索特徵空間分佈、資料偏差、領域漂移、懲罰項幾何與統計泛化界限理論。',
    descriptionEn: 'Dataset bias, domain shift, spatial penalties, and statistical learning guarantees.'
  },
  {
    id: 'hall-04',
    code: '04',
    nameZh: '深度學習架構與神經機制',
    nameEn: 'Deep Learning Architectures',
    dirZh: '04_深度學習架構與神經機制',
    dirEn: 'en/04_deep_learning_architectures',
    iconName: 'network',
    descriptionZh: '從 CNN 空間歸納偏置、Transformer 注意力機制，到生成擴散模型與流匹配前沿演進。',
    descriptionEn: 'CNN inductive bias, Transformer attention revolution, score-based diffusion & flow matching.'
  },
  {
    id: 'hall-05',
    code: '05',
    nameZh: '計算機視覺與高維感測',
    nameEn: 'Computer Vision & Spatial Sensing',
    dirZh: '05_計算機視覺與高維感測',
    dirEn: 'en/05_computer_vision',
    iconName: 'camera',
    descriptionZh: '前處理質心對齊演算法、多視角對極幾何、神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 即時渲染。',
    descriptionEn: 'Center-of-mass alignment, projective geometry, NeRF and 3D Gaussian Splatting.'
  },
  {
    id: 'hall-06',
    code: '06',
    nameZh: '自然語言處理與大語言模型',
    nameEn: 'NLP & Large Language Models',
    dirZh: '06_自然語言處理與大語言模型',
    dirEn: 'en/06_nlp_and_llms',
    iconName: 'text',
    descriptionZh: '剖析當代大語言模型架構、神經縮放定律 (Scaling Laws)、密集向量檢索、RAG 與 CAG 系統。',
    descriptionEn: 'Modern LLM anatomy, scaling laws, dense retrieval, RAG and Cache-Augmented Generation.'
  },
  {
    id: 'hall-07',
    code: '07',
    nameZh: '強化學習與智慧代理人',
    nameEn: 'Reinforcement Learning & AI Agents',
    dirZh: '07_強化學習與智慧代理人',
    dirEn: 'en/07_reinforcement_learning_and_agents',
    iconName: 'bot',
    descriptionZh: '探討 LLM Agent 認知推理架構、雙進程神經決策引擎、工具協議與自我反思機制。',
    descriptionEn: 'LLM Agent cognitive architectures, S1 non-autoregressive decision engines & reflex models.'
  },
  {
    id: 'hall-08',
    code: '08',
    nameZh: 'AI系統工程與高效部署',
    nameEn: 'AI Systems Engineering & Deployment',
    dirZh: '08_AI系統工程與高效部署',
    dirEn: 'en/08_ai_systems_engineering',
    iconName: 'settings',
    descriptionZh: '聚焦模型機率校準 (ECE)、INT8/FP4 量化數學、低精度矩陣乘法與低延遲推論引擎工程。',
    descriptionEn: 'Model calibration, uncertainty estimation, quantization mathematics & low-precision inference.'
  },
  {
    id: 'hall-09',
    code: '09',
    nameZh: '科研方法論與頂尖專題藍圖',
    nameEn: 'Research Methodology & Capstones',
    dirZh: '09_科研方法論與頂尖專題藍圖',
    dirEn: 'en/09_research_methodology',
    iconName: 'academic',
    descriptionZh: '提供 MNIST 生產級專案復盤、學術研究方法論、頂尖專題實證藍圖與同儕評審規範。',
    descriptionEn: 'Production MNIST post-mortem, capstone blueprints, research corpus & conversational revision.'
  }
];

export type PedagogyStage = 'understand' | 'explore' | 'technical' | 'research';

export interface TocItem {
  id: string;
  text: string;
  shortText: string;
  level: number;
  stage: PedagogyStage;
}

export interface ArticleSection {
  stage: PedagogyStage;
  heading: string;
  shortHeading: string;
  id: string;
  html: string;
}

export interface RuleInfo {
  id: string;
  level?: string;
  title: string;
}

export interface ArticleData {
  callNumber: string;        // e.g. "LIB-001"
  slug: string;              // e.g. "lib-001"
  lang: 'zh' | 'en';
  title: string;
  status: string;
  invariantsCount: number;
  module: string;
  category: string;
  audience: string[];
  mathFoundations: string[];
  hardwareTarget: string[];
  created: string;
  author: string;
  tags: string[];
  prerequisitesRaw: string[];
  successorsRaw: string[];
  prerequisiteIds: string[]; // e.g. ["lib-000"]
  successorIds: string[];    // e.g. ["lib-101", "lib-102"]
  hall: KnowledgeHall;
  filePath: string;
  rawMarkdown: string;
  htmlContent: string;
  leadContextHtml: string;
  lessonSections: ArticleSection[];
  researchSections: ArticleSection[];
  takeaways: string[];
  toc: TocItem[];
  rules: RuleInfo[];
  excerpt: string;
  coreFocus: string;
  executiveBrief: string;
}

export interface BilingualPair {
  callNumber: string;
  slug: string;
  zh: ArticleData;
  en: ArticleData;
}

/**
 * Editorial Markdown & LaTeX Renderer
 * Isolates code blocks & math tokens before parsing, and utilizes Marked's native heading & inline tokenization
 * to prevent markdown clobbering, unescaped asterisks, or unparsed CJK emphasis.
 */
// Helper to format Date or date string to YYYY-MM-DD
function formatDate(val: any): string {
  if (!val) return '';
  if (val instanceof Date) {
    const y = val.getUTCFullYear();
    const m = String(val.getUTCMonth() + 1).padStart(2, '0');
    const d = String(val.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const str = String(val).trim();
  const match = str.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  return str;
}

/**
 * Audited display-only exceptions for verified KaTeX typos in immutable SSOT notes.
 * Original Markdown source files are strictly preserved untouched per SSOT rules.
 */
interface KatexExceptionEntry {
  expectedSource: string;
  replacement: string;
}

const EXACT_KATEX_DISPLAY_EXCEPTIONS: Readonly<Record<string, KatexExceptionEntry>> = {
  // Source typo in LIB-802 (zh) line 87: 'X_{j, :]^2]' has ']' instead of '}' (Shift omitted).
  // Displayed on website as 'X_{j, :}^2]' per AWQ diagonal second-moment approximation;
  // row-slice squaring notation should still be checked against the original LIB-802 note.
  '\\arg\\min_{\\hat{W}} \\|W X - \\hat{W} X\\|_F^2 \\approx \\sum_{j=1}^{C_{\\text{in}}} \\|W_{:, j} - \\hat{W}_{:, j}\\|_2^2 \\cdot \\mathbb{E}[X_{j, :]^2]': {
    expectedSource: 'LIB-802 (zh)',
    replacement:
      '\\arg\\min_{\\hat{W}} \\|W X - \\hat{W} X\\|_F^2 \\approx \\sum_{j=1}^{C_{\\text{in}}} \\|W_{:, j} - \\hat{W}_{:, j}\\|_2^2 \\cdot \\mathbb{E}[X_{j, :}^2]',
  },
};

function compileKatex(tex: string, isBlock: boolean, throwOnError: boolean): string {
  const rendered = katex.renderToString(tex, { displayMode: isBlock, throwOnError });
  return isBlock ? `<div class="katex-display-container">${rendered}</div>` : rendered;
}

function texToReadablePlain(tex: string): string {
  return tex
    .replace(/\\%/g, '%')
    .replace(/\\(?:left|right)\b/g, '')
    .replace(/\\[,;:!]/g, ' ')
    .replace(/\\to\b|\\rightarrow\b/g, '→')
    .replace(/\\times\b/g, '×')
    .replace(/\\cdot\b/g, '·')
    .replace(/\\parallel\b/g, '‖')
    .replace(/\\mid\b/g, '|')
    .replace(/\\subset\b/g, '⊂')
    .replace(/\\subseteq\b/g, '⊆')
    .replace(/\\in\b/g, '∈')
    .replace(/\\notin\b/g, '∉')
    .replace(/\\geq?\b/g, '≥')
    .replace(/\\leq?\b/g, '≤')
    .replace(/\\approx\b/g, '≈')
    .replace(/\\sim\b/g, '~')
    .replace(/\\ll\b/g, '≪')
    .replace(/\\gg\b/g, '≫')
    .replace(/\\nexists\b/g, '∄')
    .replace(/\\exists\b/g, '∃')
    .replace(/\\rightsquigarrow\b/g, '⇝')
    .replace(/\\(?:l|c)?dots\b/g, '…')
    .replace(/\\infty\b/g, '∞')
    .replace(/\\nabla\b/g, '∇')
    .replace(/\\top\b/g, 'ᵀ')
    .replace(/\\eta\b/g, 'η')
    .replace(/\\epsilon\b/g, 'ε')
    .replace(/\\alpha\b/g, 'α')
    .replace(/\\beta\b/g, 'β')
    .replace(/\\theta\b/g, 'θ')
    .replace(/\\tau\b/g, 'τ')
    .replace(/\\lambda\b/g, 'λ')
    .replace(/\\Delta\b/g, 'Δ')
    .replace(/\\Omega\b/g, 'Ω')
    .replace(/\\mu\b/g, 'μ')
    .replace(/\\Sigma\b/g, 'Σ')
    .replace(/\\mathcal\{G\}/g, 'G')
    .replace(/\\mathbb\{R\}/g, 'ℝ')
    .replace(/\\mathbb\{Z\}/g, 'ℤ')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\(?:mathbb|mathcal|mathbf|boldsymbol|mathrm|text|operatorname)\{([^}]+)\}/g, '$1')
    .replace(/\\boldsymbol\s+/g, '')
    .replace(/\\(ln|log|exp|sin|cos|max|min|arg)\b/g, '$1')
    .replace(/\^2\b/g, '²')
    .replace(/\^3\b/g, '³')
    .replace(/\^T\b/g, 'ᵀ')
    .replace(/[{}]/g, '')
    .replace(/\\/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripLangBannerAndLeadingH1(rawMarkdown: string): string {
  const withoutLangBanner = rawMarkdown.replace(
    /^(?:\r?\n)*>\s*(?:🌐\s*)?(?:\*\*)?(?:語言(?:切換)?|Language(?:\s+Switch)?)\s*\/\s*(?:Language(?:\s+Switch)?|語言(?:切換)?)(?:\*\*)?:[^\r\n]*(?:\r?\n)+/m,
    ''
  );
  return withoutLangBanner.replace(/^#\s+[^\r\n]+(?:\r?\n|$)/m, '');
}

function buildCoreFocus(
  frontmatter: Record<string, any>,
  title: string,
  hall: KnowledgeHall,
  lang: 'zh' | 'en'
): string {
  const explicit = frontmatter.summary || frontmatter.abstract;
  if (typeof explicit === 'string' && explicit.trim().length > 0) {
    return explicit.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const mathItems = Array.isArray(frontmatter.math_foundations)
    ? frontmatter.math_foundations.map((v: unknown) => String(v).trim()).filter(Boolean).slice(0, 3)
    : [];
  if (mathItems.length > 0) {
    if (lang === 'zh') {
      return `本單元隸屬「${hall.nameZh}」，聚焦 ${mathItems.join('、')}。`;
    }
    const listText = mathItems.length === 1
      ? mathItems[0]
      : `${mathItems.slice(0, -1).join(', ')} and ${mathItems[mathItems.length - 1]}`;
    return `Part of ${hall.nameEn}, focusing on ${listText}.`;
  }
  return buildNeutralOrientation(
    title,
    hall,
    String(frontmatter.category || ''),
    String(frontmatter.module || ''),
    lang
  );
}

function buildNeutralOrientation(
  title: string,
  hall: KnowledgeHall,
  category: string,
  moduleName: string,
  lang: 'zh' | 'en'
): string {
  const topic = category || moduleName || (lang === 'zh' ? hall.nameZh : hall.nameEn);
  if (lang === 'zh') {
    return `本篇隸屬「${hall.nameZh}」（${topic}），主題為《${title}》。`;
  }
  return `Part of ${hall.nameEn} (${topic}), presenting ${title}.`;
}

function cleanProseCandidate(raw: string): string {
  return raw
    .replace(/\$\$([\s\S]*?)\$\$/g, (_m, tex) => texToReadablePlain(tex))
    .replace(/(?<!\$)\$([^\$\n]+?)\$(?!\$)/g, (_m, tex) => texToReadablePlain(tex))
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, target, label) => {
      const text = (label || target).trim();
      return text.replace(/\s*\(Agent EN\)\s*$/i, '').trim();
    })
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`\[(?:FACT|DERIVATION|LITERATURE_RESULT|EMPIRICAL_RESULT|HEURISTIC|DESIGN_DECISION|TARGET|SAFETY_BOUND|HYPOTHESIS|OPEN_QUESTION|RULE-\d{3}-\d{2})\]`/g, '')
    .replace(/\[(?:FACT|DERIVATION|LITERATURE_RESULT|EMPIRICAL_RESULT|HEURISTIC|DESIGN_DECISION|TARGET|SAFETY_BOUND|HYPOTHESIS|OPEN_QUESTION|RULE-\d{3}-\d{2})\]/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|\s)\*([^*\n]+)\*(?=\s|[.,;!?)]|$)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,。，;；!！?？:：])/g, '$1')
    .trim();
}

function extractStudyOrientation(
  rawMarkdown: string,
  frontmatter: Record<string, any>,
  title: string,
  hall: KnowledgeHall,
  lang: 'zh' | 'en'
): string {
  const explicit = frontmatter.summary || frontmatter.abstract;
  if (typeof explicit === 'string' && explicit.trim().length > 0) {
    return explicit.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const body = stripLangBannerAndLeadingH1(rawMarkdown).replace(/\r\n?/g, '\n');
  const lines = body.split('\n');
  const candidates: { sectionIdx: number; text: string }[] = [];

  let inCodeFence = false;
  let inMathBlock = false;
  let inListItem = false;
  let inTable = false;
  let sectionIdx = 0;
  let buffer: string[] = [];

  const flushBuffer = () => {
    if (buffer.length > 0) {
      candidates.push({ sectionIdx, text: buffer.join(' ') });
      buffer = [];
    }
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (/^```/.test(trimmed)) {
      flushBuffer();
      inCodeFence = !inCodeFence;
      inListItem = false;
      inTable = false;
      continue;
    }
    if (inCodeFence) continue;

    if (!inCodeFence && (rawLine.match(/\$\$/g) || []).length % 2 === 1) {
      flushBuffer();
      inMathBlock = !inMathBlock;
      inListItem = false;
      inTable = false;
      continue;
    }
    if (inMathBlock) continue;

    if (!trimmed) {
      flushBuffer();
      inListItem = false;
      inTable = false;
      continue;
    }

    if (/^#/.test(trimmed)) {
      flushBuffer();
      if (/^##\s+/.test(trimmed)) sectionIdx += 1;
      inListItem = false;
      inTable = false;
      continue;
    }

    if (
      /^[-*_]{3,}$/.test(trimmed) ||
      /^>/.test(trimmed) ||
      /^</.test(trimmed) ||
      /[┌┐└┘│─┬┴├┤▼▲►◄═║╔╗╚╝]/.test(trimmed)
    ) {
      flushBuffer();
      inListItem = false;
      inTable = false;
      continue;
    }

    if (/^\|/.test(trimmed) || (inTable && /\|/.test(trimmed))) {
      flushBuffer();
      inTable = true;
      inListItem = false;
      continue;
    }
    inTable = false;

    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(rawLine)) {
      flushBuffer();
      inListItem = true;
      continue;
    }

    // Continuation lines of indented list items or bibliography entries
    if (inListItem && /^\s{2,}\S/.test(rawLine)) {
      flushBuffer();
      continue;
    }
    inListItem = false;

    // Metadata key-value lines (e.g., "**English title:** ...", "Document role: ...") or standalone bold headings
    if (
      /^\*\*[^*]+[:：]\*\*/.test(trimmed) ||
      /^[A-Za-z][A-Za-z0-9 _-]{1,28}:\s/.test(trimmed) ||
      /^\*\*[^*]+\*\*[。.!?]?$/.test(trimmed)
    ) {
      flushBuffer();
      continue;
    }

    buffer.push(trimmed);
  }
  flushBuffer();

  // Prefer substantive prose from the opening sections (Sections 0..3) before falling back
  const danglingFormulaStarter = /^(?:where\b|which\b|whereby\b|herein\b|here\b|thus\b|therefore\b|hence\b|since\b|this\s+restores\b|because\s+[A-Z]\b|其中\s|即[:：]|此處|上式|代入)/i;
  for (const cand of candidates) {
    if (cand.sectionIdx > 2) break;
    const cleaned = cleanProseCandidate(cand.text);
    const hasCjk = /[\u4e00-\u9fff]/.test(cleaned);
    const minLen = hasCjk ? 24 : 50;
    if (cleaned.length < minLen) continue;
    if (danglingFormulaStarter.test(cleaned)) continue;
    if (/[\$\\{}∄∃∀∈∉⇝]|┌|└|│|---|\|\s*---|\|V\|/.test(cleaned)) continue;
    // Handle colon-terminated paragraphs introducing lists/equations: keep earlier complete sentence(s) if present, else skip
    let candidateText = cleaned;
    if (/[:：]$/.test(candidateText)) {
      const sentenceEndIdx = Math.max(candidateText.lastIndexOf('。'), candidateText.lastIndexOf('. '));
      if (sentenceEndIdx >= (hasCjk ? 24 : 50)) {
        candidateText = candidateText.slice(0, sentenceEndIdx + 1).trim();
      } else {
        continue;
      }
    }
    if (candidateText.length > 180) {
      const cut = candidateText.slice(0, 177);
      const lastBreak = Math.max(cut.lastIndexOf('。'), cut.lastIndexOf('. '), cut.lastIndexOf('，'), cut.lastIndexOf(', '), cut.lastIndexOf(' '));
      const cleanCut = lastBreak > 90 ? cut.slice(0, lastBreak).trimEnd() : cut.trimEnd();
      return `${cleanCut.replace(/[,，、;；:：]+$/, '')}...`;
    }
    return candidateText;
  }

  return buildCoreFocus(frontmatter, title, hall, lang);
}

export const CONCISE_VOLUME_LABELS: Readonly<Record<string, { zh: string; en: string }>> = {
  'lib-000': { zh: 'LIB-000 · 圖書館總覽與導航', en: 'LIB-000 · Library Navigator' },
  'lib-001': { zh: 'LIB-001 · 深度學習第一性原理', en: 'LIB-001 · DL First Principles' },
  'lib-101': { zh: 'LIB-101 · 線性代數與高維幾何', en: 'LIB-101 · Linear Algebra & Geometry' },
  'lib-102': { zh: 'LIB-102 · 機率、資訊論與變分推論', en: 'LIB-102 · Probability & Variational Inference' },
  'lib-104': { zh: 'LIB-104 · 凸最佳化與梯度幾何', en: 'LIB-104 · Convex Optimization' },
  'lib-203': { zh: 'LIB-203 · GPU 體系結構與硬體對齊', en: 'LIB-203 · GPU & Hardware Architecture' },
  'lib-301': { zh: 'LIB-301 · 資料偏差與領域漂移', en: 'LIB-301 · Dataset Bias & Domain Shift' },
  'lib-401': { zh: 'LIB-401 · CNN 空間歸納偏置', en: 'LIB-401 · CNN Inductive Bias' },
  'lib-405': { zh: 'LIB-405 · Transformer 注意力機制', en: 'LIB-405 · Transformer & Attention' },
  'lib-406': { zh: 'LIB-406 · 擴散 SDE 與流匹配', en: 'LIB-406 · Diffusion & Flow Matching' },
  'lib-407': { zh: 'LIB-407 · 指令擴散影像編輯', en: 'LIB-407 · Diffusion Image Editing' },
  'lib-408': { zh: 'LIB-408 · 情境感知生成與融合', en: 'LIB-408 · Context-Aware Object Insertion' },
  'lib-501': { zh: 'LIB-501 · 視覺前處理與質心對齊', en: 'LIB-501 · CV Center-of-Mass Alignment' },
  'lib-502': { zh: 'LIB-502 · 相機射影幾何與 SfM', en: 'LIB-502 · Projective Geometry & SfM' },
  'lib-504': { zh: 'LIB-504 · NeRF 與 3D 高斯潑濺', en: 'LIB-504 · NeRF & 3D Gaussian Splatting' },
  'lib-505': { zh: 'LIB-505 · 開放詞彙 3DGS 語意檢索', en: 'LIB-505 · Open-Vocab 3DGS Retrieval' },
  'lib-506': { zh: 'LIB-506 · LLM + 3DGS 空間問答導覽', en: 'LIB-506 · LLM + 3DGS Scene QA' },
  'lib-602': { zh: 'LIB-602 · 現代 LLM 與縮放定律', en: 'LIB-602 · Modern LLM & Scaling Laws' },
  'lib-603': { zh: 'LIB-603 · 密集檢索、RAG 與 CAG', en: 'LIB-603 · Dense Retrieval, RAG & CAG' },
  'lib-703': { zh: 'LIB-703 · LLM Agent 認知與協議', en: 'LIB-703 · LLM Agent Architecture' },
  'lib-704': { zh: 'LIB-704 · S1 雙進程反射代理人', en: 'LIB-704 · Dual-Process S1 Agents' },
  'lib-801': { zh: 'LIB-801 · 模型校準與不確定性', en: 'LIB-801 · Calibration & Uncertainty' },
  'lib-802': { zh: 'LIB-802 · 模型量化與低精度推論', en: 'LIB-802 · Quantization & Low-Precision' },
  'lib-901': { zh: 'LIB-901 · MNIST 生產系統復盤', en: 'LIB-901 · Production MNIST Post-Mortem' },
  'lib-903': { zh: 'LIB-903 · 專題藍圖與科研演進', en: 'LIB-903 · Capstone Blueprint & Evolution' },
  'lib-904': { zh: 'LIB-904 · 學術文獻體系與對齊', en: 'LIB-904 · Research Literature Synthesis' },
  'lib-905': { zh: 'LIB-905 · 前沿視覺多模態專題藍圖', en: 'LIB-905 · Multimodal Capstone Blueprints' },
  'lib-906': { zh: 'LIB-906 · 對話質疑認知修訂基準', en: 'LIB-906 · Conversational Epistemic Revision' },
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeHtmlAttr(text: string): string {
  return escapeHtml(text).replace(/\r?\n/g, '&#10;');
}

export function formatConciseHeading(plainText: string, maxLen = 40): string {
  let clean = plainText
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/\s+/g, ' ')
    .replace(/、\s+/g, '、')
    .trim();
  // Remove trailing verbose parenthetical translation when CJK heading already conveys topic
  if (/[\u4e00-\u9fff]/.test(clean)) {
    clean = clean.replace(/\s*\([A-Za-z0-9\s,&:/+\-.'’]{14,}\)\s*$/, '').trim();
  }
  clean = clean.replace(/\s*\(Agent\s*(?:EN|Edition)\)\s*$/i, '').trim();
  if (clean.length <= maxLen) return clean;
  const cut = clean.slice(0, maxLen - 1);
  const sep = Math.max(cut.lastIndexOf('：'), cut.lastIndexOf(':'), cut.lastIndexOf('、'), cut.lastIndexOf(' '));
  const shortened = sep > maxLen * 0.45 ? cut.slice(0, sep).trim() : cut.trim();
  return `${shortened}…`;
}

export function formatConciseWikiLabel(
  slug: string,
  rawTarget: string,
  customLabel: string | undefined,
  lang: 'zh' | 'en'
): { display: string; fullTitle: string } {
  const fullTitle = rawTarget.trim();
  if (customLabel && customLabel.trim().length > 0) {
    return { display: customLabel.trim(), fullTitle };
  }
  const preset = CONCISE_VOLUME_LABELS[slug.toLowerCase()];
  if (preset) {
    return { display: preset[lang], fullTitle };
  }
  const callMatch = fullTitle.match(/LIB-\d{3}/i);
  const callNo = callMatch ? callMatch[0].toUpperCase() : slug.toUpperCase();
  const remainder = fullTitle.replace(/^LIB-\d{3}\s*/i, '');
  const shortRemainder = formatConciseHeading(remainder, 24);
  return {
    display: shortRemainder ? `${callNo} · ${shortRemainder}` : callNo,
    fullTitle,
  };
}

let cachedMermaidManifest: Record<string, { file?: string; width: number; height: number; firstLine?: string }> | null = null;
function getMermaidManifest(): Record<string, { file?: string; width: number; height: number; firstLine?: string }> {
  if (cachedMermaidManifest) return cachedMermaidManifest;
  const manifestPath = path.join(MERMAID_CACHE_DIR, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      cachedMermaidManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      return cachedMermaidManifest!;
    } catch {
      cachedMermaidManifest = {};
      return cachedMermaidManifest;
    }
  }
  cachedMermaidManifest = {};
  return cachedMermaidManifest;
}

const SUPPORTED_MERMAID_HEADER_RE = /^(?:flowchart|graph|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie|gitGraph|mindmap|timeline|quadrantChart)\b/i;

function inferMermaidCaption(rawSource: string, lang: 'zh' | 'en'): string {
  const lines = rawSource.replace(/\r\n?/g, '\n').split('\n').map(l => l.trim()).filter(Boolean);
  const commentLine = lines.find(l => l.startsWith('%%') && !l.startsWith('%%{'));
  if (commentLine) {
    const cleaned = commentLine.replace(/^%%+\s*/, '').replace(/\s*\([^)]{10,}\)\s*$/, '').trim();
    if (cleaned.length >= 4) return cleaned;
  }
  const headerLine = lines.find(l => !l.startsWith('%%')) || '';
  if (/^(?:flowchart|graph)\b/i.test(headerLine)) {
    return lang === 'zh' ? '概念架構與拓樸流程圖' : 'Conceptual Flow & Architecture Diagram';
  }
  if (/^sequenceDiagram\b/i.test(headerLine)) {
    return lang === 'zh' ? '系統時序互動圖' : 'System Sequence Diagram';
  }
  return lang === 'zh' ? '視覺圖表' : 'Architecture Diagram';
}

export function renderMermaidBlockHtml(rawSource: string, lang: 'zh' | 'en'): string {
  const normalized = rawSource.replace(/\r\n?/g, '\n').trim();
  const firstCodeLine = normalized.split('\n').map(l => l.trim()).find(l => l && !l.startsWith('%%')) || '';
  const escapedSource = escapeHtml(normalized);
  const caption = inferMermaidCaption(normalized, lang);

  if (!normalized || !SUPPORTED_MERMAID_HEADER_RE.test(firstCodeLine)) {
    const errTitle = lang === 'zh' ? '流程圖語法無法渲染' : 'Diagram Rendering Failed';
    const errDesc = lang === 'zh'
      ? '無法辨識有效的 Mermaid 圖表定義，已保留原始語法以維持內容完整性。'
      : 'Unrecognized or unsupported Mermaid diagram definition; raw source preserved below.';
    return `<figure class="mermaid-figure mermaid-figure-error" role="group" aria-label="${escapeHtmlAttr(errTitle)}">
  <div class="mermaid-error-box" role="alert">
    <strong>${escapeHtml(errTitle)}</strong>
    <p>${escapeHtml(errDesc)}</p>
  </div>
  <details class="mermaid-source-drawer" open>
    <summary>${lang === 'zh' ? '查看原始碼 (Mermaid)' : 'View Mermaid Source'}</summary>
    <pre class="mermaid-raw-source"><code>${escapedSource}</code></pre>
  </details>
</figure>`;
  }

  const hash = crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
  const manifest = getMermaidManifest();
  const svgPath = path.join(MERMAID_CACHE_DIR, `${hash}.svg`);
  const hasCachedSvg = fs.existsSync(svgPath);
  const meta = manifest[hash];
  const diagramHeight = meta?.height || 0;
  const diagramWidth = meta?.width || 0;
  const isTall = diagramHeight > 820;

  const toolbarHtml = `<figcaption class="mermaid-toolbar">
    <div class="mermaid-caption">
      <span class="mermaid-kind-badge">${escapeHtml(firstCodeLine.split(/\s+/)[0].toUpperCase())}</span>
      <span class="mermaid-title-text">${escapeHtml(caption)}</span>
    </div>
    <div class="mermaid-controls" role="group" aria-label="${lang === 'zh' ? '圖表檢視控制' : 'Diagram view controls'}">
      <button type="button" class="mermaid-btn" data-zoom-action="out" aria-label="${lang === 'zh' ? '縮小圖表' : 'Zoom out'}">−</button>
      <button type="button" class="mermaid-btn mermaid-zoom-reset" data-zoom-action="reset" aria-label="${lang === 'zh' ? '重設圖表縮放' : 'Reset zoom'}">100%</button>
      <button type="button" class="mermaid-btn" data-zoom-action="in" aria-label="${lang === 'zh' ? '放大圖表' : 'Zoom in'}">+</button>
      ${isTall ? `<button type="button" class="mermaid-btn mermaid-expand-btn" data-zoom-action="toggle-height" aria-expanded="false">${lang === 'zh' ? '展開全高' : 'Full height'}</button>` : ''}
    </div>
  </figcaption>`;

  const sourceDrawerHtml = `<details class="mermaid-source-drawer">
    <summary>${lang === 'zh' ? '查看原始碼' : 'View Source'}</summary>
    <pre class="mermaid-raw-source"><code>${escapedSource}</code></pre>
  </details>`;

  if (hasCachedSvg) {
    const svgMarkup = fs.readFileSync(svgPath, 'utf-8')
      .replace(/<svg\b/i, `<svg role="img" aria-label="${escapeHtmlAttr(caption)}"`);
    const isWideStrip = diagramWidth > 1050 && diagramHeight > 0 && diagramHeight < 400;
    return `<figure class="mermaid-figure" data-mermaid-rendered="true" data-diagram-width="${diagramWidth}" data-diagram-height="${diagramHeight}"${isWideStrip ? ' data-diagram-wide="true"' : ''}>
  ${toolbarHtml}
  <div class="mermaid-viewport${isTall ? ' is-tall' : ''}" tabindex="0" role="region" aria-label="${escapeHtmlAttr(caption)}">
    <div class="mermaid-svg-stage">${svgMarkup}</div>
  </div>
  ${sourceDrawerHtml}
</figure>`;
  }

  return `<figure class="mermaid-figure mermaid-figure-pending" data-mermaid-pending="true" data-mermaid-hash="${hash}" data-mermaid-src="${escapeHtmlAttr(normalized)}">
  ${toolbarHtml}
  <div class="mermaid-viewport" tabindex="0" role="region" aria-label="${escapeHtmlAttr(caption)}">
    <div class="mermaid-svg-stage">
      <p class="mermaid-loading-note">${lang === 'zh' ? '正在本地載入互動圖表…' : 'Rendering local diagram…'}</p>
    </div>
  </div>
  <div class="mermaid-error-box" role="alert" hidden>
    <strong>${lang === 'zh' ? '圖表渲染失敗' : 'Diagram Rendering Failed'}</strong>
    <p class="mermaid-error-msg"></p>
  </div>
  ${sourceDrawerHtml}
</figure>`;
}

interface RawMarkdownSection {
  heading: string;
  markdown: string;
}

function splitMarkdownByH2(markdownBody: string): { preamble: string; sections: RawMarkdownSection[] } {
  const lines = markdownBody.replace(/\r\n?/g, '\n').split('\n');
  const preambleLines: string[] = [];
  const sections: RawMarkdownSection[] = [];
  let current: { heading: string; lines: string[] } | null = null;
  let inCodeFence = false;
  let inMathBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^```/.test(trimmed)) {
      inCodeFence = !inCodeFence;
    } else if (!inCodeFence && (line.match(/\$\$/g) || []).length % 2 === 1) {
      inMathBlock = !inMathBlock;
    }

    if (!inCodeFence && !inMathBlock) {
      const h2Match = line.match(/^##\s+(.+)$/);
      if (h2Match) {
        if (current) {
          sections.push({ heading: current.heading, markdown: current.lines.join('\n') });
        }
        current = { heading: h2Match[1].trim(), lines: [] };
        continue;
      }
    }

    if (current) {
      current.lines.push(line);
    } else {
      preambleLines.push(line);
    }
  }

  if (current) {
    sections.push({ heading: current.heading, markdown: current.lines.join('\n') });
  }

  return { preamble: preambleLines.join('\n').trim(), sections };
}

function splitCoordinateContent(coordMarkdown: string): { promotedIntroMd: string; adminCoordMd: string } {
  const lines = coordMarkdown.replace(/\r\n?/g, '\n').split('\n');
  const promotedLines: string[] = [];
  const adminLines: string[] = [];
  let targetBucket: 'promoted' | 'admin' = 'admin';
  let inCodeFence = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^```/.test(trimmed)) {
      if (!inCodeFence) {
        // Standalone diagram code blocks in top coordinates (e.g. LIB-904 overview diagram) belong in Concept Overview
        inCodeFence = true;
        targetBucket = 'promoted';
        promotedLines.push(line);
      } else {
        inCodeFence = false;
        promotedLines.push(line);
        targetBucket = 'admin';
      }
      continue;
    }

    if (inCodeFence) {
      promotedLines.push(line);
      continue;
    }

    if (trimmed === '---') {
      continue;
    }

    // Core framing items to promote above prerequisites/bibliography
    if (/^-\s*\*\*(?:核心定位|核心主題|核心目標|學術定位|Core Scope)[:：]?\*\*/i.test(trimmed)) {
      targetBucket = 'promoted';
      promotedLines.push(line.replace(/^-\s*/, ''));
      continue;
    }

    // Administrative / bibliography coordinate items stay in Research Details
    if (
      /^-\s*\*\*(?:前置依賴|後續節點|難度等級|權威期刊|主要文獻|Prerequisites?|Successors?)/i.test(trimmed) ||
      /^\*\*(?:English title|Chinese title|Document role|Current phase|Evidence status):/i.test(trimmed)
    ) {
      targetBucket = 'admin';
      adminLines.push(line);
      continue;
    }

    // Epigraph / Research question blockquotes in coordinates belong in Concept Overview
    if (trimmed.startsWith('>')) {
      targetBucket = 'promoted';
      promotedLines.push(line);
      continue;
    }

    if (!trimmed) {
      if (promotedLines.length > 0 && promotedLines[promotedLines.length - 1] !== '') promotedLines.push('');
      if (adminLines.length > 0 && adminLines[adminLines.length - 1] !== '') adminLines.push('');
      targetBucket = 'admin';
      continue;
    }

    if (targetBucket === 'promoted') {
      promotedLines.push(line);
    } else {
      adminLines.push(line);
    }
  }

  return {
    promotedIntroMd: promotedLines.join('\n').trim(),
    adminCoordMd: adminLines.join('\n').trim(),
  };
}

function classifySectionStage(heading: string, bodyMd: string): 'coordinates' | PedagogyStage {
  if (/^(?:🧭\s*)?拓樸導航與概念座標|^導讀與概念座標|^Conceptual Coordinates/i.test(heading)) {
    return 'coordinates';
  }
  // Visual diagrams (e.g. Mermaid in LIB-000 EN section 5) stay open in Explore so knowledge graphs never hide collapsed
  if (/```mermaid\b/i.test(bodyMd)) {
    return 'explore';
  }
  if (/學士直觀|前言|心智模型|問題背景|老師簡報|Problem Statement|Conceptual Mental Model|Executive Conceptual Mental Model|Physical Formulation|Attention Map Modulation|目錄索引|正式研究定位/i.test(heading)) {
    return 'understand';
  }
  if (/核心基石|推薦路徑|全域拓樸|五大專題全景|十大分館|Taxonomy|Defensible Status|Evidence Provenance|Topological|Five Grand|Failure Modes|失效模式|8-Stage|Six Evolutionary|學習拓樸路徑|總結複習|數學先修|學術科研第一性原理|全棧工程交付矩陣|Solo Full-Stack|Minimum Viable/i.test(heading)) {
    return 'explore';
  }
  if (/數學形式化|Mathematical|博士級|計算機體系|Systems|Pipeline|Microarchitecture|端到端系統|工業級|極簡可執行|Production|模組化生命週期|階段：我們做的|進階實驗|Theoretical Derivations|國科會專題計畫|NSTC|Proposal Framework|Ledger-Backtrack/i.test(heading)) {
    return 'technical';
  }
  if (/AI Agent|Agent Invariant|Agent Protocol|System Invariant|系統架構規範|系統規範|合約|契約|Contract|權威|參考文獻|文獻|Canonical|Peer-Reviewed|推甄|攻略|Audit|Metrics|Baselines|Gap Matrix|Benchmark|Reviewer|Temporal Ground|Research Review|Research State|Paper Result|Technical Guardrails|相關研究|研究狀態|課程對齊|館藏研讀|工作契約|PushBack-Bench|Novelty Hypothesis|Invariants & Implementation/i.test(heading)) {
    return 'research';
  }
  return 'explore';
}

function renderMarkdownFragment(
  rawFragment: string,
  lang: 'zh' | 'en',
  base: string,
  sourceLabel: string,
  stage: PedagogyStage,
  toc: TocItem[]
): string {
  // Extract Mermaid blocks BEFORE general fenced code blocks so diagrams become visual SVGs
  const mermaidTokens: string[] = [];
  let processed = rawFragment.replace(/^```mermaid[ \t]*\r?\n([\s\S]*?)```/gim, (_m, src) => {
    const idx = mermaidTokens.length;
    mermaidTokens.push(renderMermaidBlockHtml(src, lang));
    return `\n\nMERMAIDX${idx}X\n\n`;
  });

  // Protect remaining non-Mermaid fenced code blocks and inline code
  const codeBlocks: string[] = [];
  function saveCode(match: string): string {
    const idx = codeBlocks.length;
    codeBlocks.push(match);
    return `%%%CODEBLOCK_${idx}%%%`;
  }

  processed = processed.replace(/```[\s\S]*?```/g, saveCode);
  processed = processed.replace(/`[^`\n]+`/g, saveCode);

  const mathTokens: string[] = [];
  const rawMathSources: string[] = [];

  function saveMath(math: string, isBlock: boolean): string {
    const idx = mathTokens.length;
    const extractedCodes: string[] = [];
    const rawMath = math
      .replace(/%%%CODEBLOCK_\d+%%%/g, (codeTok) => {
        extractedCodes.push(codeTok);
        return '';
      })
      .trim();
    const suffix = extractedCodes.length > 0 ? ` ${extractedCodes.join(' ')}` : '';
    rawMathSources.push(texToReadablePlain(rawMath));
    if (!rawMath) {
      mathTokens.push('');
      return `KATEXX${idx}X${suffix}`;
    }
    try {
      mathTokens.push(compileKatex(rawMath, isBlock, true));
      return `KATEXX${idx}X${suffix}`;
    } catch (verbatimError) {
      let candidate = rawMath.replace(/\\text\{([^}]+)\}/g, (_m, inner) => {
        return `\\text{${inner.replace(/(?<!\\)_/g, '\\_')}}`;
      });
      if (Object.prototype.hasOwnProperty.call(EXACT_KATEX_DISPLAY_EXCEPTIONS, candidate)) {
        const entry = EXACT_KATEX_DISPLAY_EXCEPTIONS[candidate];
        if (!sourceLabel || sourceLabel === entry.expectedSource) {
          candidate = entry.replacement;
        }
      }

      if (candidate !== rawMath) {
        try {
          mathTokens.push(compileKatex(candidate, isBlock, true));
          return `KATEXX${idx}X${suffix}`;
        } catch (recoveryError) {
          console.error(
            `[KaTeX Parse Error]${sourceLabel ? ` [${sourceLabel}]` : ''} Permitted recovery failed:`,
            rawMath,
            recoveryError
          );
        }
      } else {
        console.error(
          `[KaTeX Parse Error]${sourceLabel ? ` [${sourceLabel}]` : ''} Unrecognized formula parse failure (not rewritten):`,
          rawMath,
          verbatimError
        );
      }

      mathTokens.push(compileKatex(rawMath, isBlock, false));
      return `KATEXX${idx}X${suffix}`;
    }
  }

  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_m, math) => saveMath(math, true));
  processed = processed.replace(/(?<!\$)\$([^\$\n]+?)\$(?!\$)/g, (_m, math) => saveMath(math, false));

  // Transform Obsidian WikiLinks with concise readable labels while preserving canonical route & full source title
  processed = processed.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, target, customLabel) => {
    const cleanTarget = target.trim();
    const libMatch = cleanTarget.match(/LIB-(\d{3})/i);
    if (libMatch) {
      const targetSlug = `lib-${libMatch[1].toLowerCase()}`;
      const targetUrl = `${base}/${lang}/notes/${targetSlug}/`;
      const { display, fullTitle } = formatConciseWikiLabel(targetSlug, cleanTarget, customLabel, lang);
      return `<a class="wikilink-badge" href="${targetUrl}" title="${escapeHtmlAttr(fullTitle)}" aria-label="${escapeHtmlAttr(fullTitle)}">${escapeHtml(display)}</a>`;
    }

    const label = customLabel ? customLabel.trim() : cleanTarget;
    if (cleanTarget.startsWith('assets/') || cleanTarget.includes('.svg') || cleanTarget.includes('.png')) {
      const assetName = path.basename(cleanTarget);
      return `<a class="wikilink-asset" href="${base}/assets/${assetName}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`;
    }

    return `<span class="wikilink-text">${escapeHtml(label)}</span>`;
  });

  processed = processed.replace(/!\[(.*?)\]\(((?:\.\.\/)*assets\/([^)]+))\)/g, (_m, alt, _fullPath, filename) => {
    return `![${alt}](${base}/assets/${filename})`;
  });

  processed = processed.replace(/\[([^\]]+)\]\(([^)]*LIB-(\d{3})[^)]*\.md)\)/gi, (_m, text, url, num) => {
    const slug = `lib-${num.toLowerCase()}`;
    const pointsToEn = /(?:^|\/)en\//i.test(url) || /(?:%28|\()Agent(?:%20|\s)+EN(?:%29|\))/i.test(url);
    const pointsToZh = /(?:^|\/)(?:\.\.\/)*0\d_[^/]*\//i.test(url) && !pointsToEn;
    const targetLang = pointsToEn ? 'en' : (pointsToZh ? 'zh' : lang);
    return `[${text}](${base}/${targetLang}/notes/${slug}/)`;
  });

  processed = processed.replace(/\[(FACT|DERIVATION|LITERATURE_RESULT|EMPIRICAL_RESULT|HEURISTIC|DESIGN_DECISION|TARGET|SAFETY_BOUND|HYPOTHESIS|OPEN_QUESTION)\]/g, (_m, tag) => {
    return `<span class="evidence-pill pill-${tag.toLowerCase()}">${tag}</span>`;
  });

  processed = processed.replace(/\[(RULE-\d{3}-\d{2})\]/g, (_m, ruleId) => {
    return `<span class="rule-pill">${ruleId}</span>`;
  });

  processed = processed.replace(/%%%CODEBLOCK_(\d+)%%%/g, (match, idx) => {
    return codeBlocks[parseInt(idx, 10)] || match;
  });

  const cjkStrongExtension = {
    name: 'cjkStrong',
    level: 'inline' as const,
    start(src: string) { return src.indexOf('**'); },
    tokenizer(this: any, src: string) {
      const rule = /^\*\*([^\*\n]+?)\*\*/;
      const match = rule.exec(src);
      if (match) {
        return {
          type: 'strong',
          raw: match[0],
          text: match[1],
          tokens: this.lexer.inlineTokens(match[1])
        };
      }
    }
  };

  const markedInstance = new Marked();
  markedInstance.use({
    extensions: [cjkStrongExtension],
    renderer: {
      heading(this: any, { tokens, depth }: { tokens: any[]; depth: number }) {
        if (depth === 1) {
          return '';
        }
        const text = this.parser.parseInline(tokens);
        const cleanedInlineHtml = text
          .replace(/(<[^>]+>)|([\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}])/gu, (_m: string, tag: string) => tag || '')
          .replace(/、\s+/g, '、')
          .replace(/\s{2,}/g, ' ')
          .trim();
        const plainText = cleanedInlineHtml
          .replace(/KATEXX(\d+)X/g, (_m: string, i: string) => rawMathSources[parseInt(i, 10)] || '')
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, ' ')
          .trim();
        const plainForConcise = plainText
          .replace(/\[(?:FACT|DERIVATION|LITERATURE_RESULT|EMPIRICAL_RESULT|HEURISTIC|DESIGN_DECISION|TARGET|SAFETY_BOUND|HYPOTHESIS|OPEN_QUESTION)\]/g, '')
          .replace(/\b(?:FACT|DERIVATION|LITERATURE_RESULT|EMPIRICAL_RESULT|HEURISTIC|DESIGN_DECISION|TARGET|SAFETY_BOUND|HYPOTHESIS|OPEN_QUESTION)\b/g, '')
          .replace(/\s+([、，,:：])/g, '$1')
          .replace(/\s{2,}/g, ' ')
          .trim();
        const slugId = plainText
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5\-_]+/g, '-')
          .replace(/^-+|-+$/g, '') || `section-${toc.length + 1}`;
        toc.push({
          id: slugId,
          text: plainForConcise || plainText,
          shortText: formatConciseHeading(plainForConcise || plainText, depth === 2 ? 44 : 40),
          level: depth,
          stage
        });
        return `<h${depth} id="${slugId}">${cleanedInlineHtml}</h${depth}>\n`;
      }
    }
  });

  let html = markedInstance.parse(processed, {
    gfm: true,
    breaks: false,
  }) as string;

  html = html.replace(/KATEXX(\d+)X/g, (match, idx) => {
    return mathTokens[parseInt(idx, 10)] || match;
  });

  // Unwrap standalone MERMAIDX...X tokens from <p>...</p> so <figure> sits cleanly in block flow
  html = html.replace(/<p>\s*MERMAIDX(\d+)X\s*<\/p>/g, (_m, idx) => {
    return mermaidTokens[parseInt(idx, 10)] || '';
  });
  html = html.replace(/MERMAIDX(\d+)X/g, (match, idx) => {
    return mermaidTokens[parseInt(idx, 10)] || match;
  });

  return html;
}

export interface RenderedArticleStructure {
  html: string;
  leadContextHtml: string;
  lessonSections: ArticleSection[];
  researchSections: ArticleSection[];
  toc: TocItem[];
  takeaways: string[];
}

export function renderArticleMarkdown(
  rawMarkdown: string,
  lang: 'zh' | 'en',
  base: string = '/library',
  sourceLabel: string = ''
): RenderedArticleStructure {
  const toc: TocItem[] = [];
  const cleanBody = stripLangBannerAndLeadingH1(rawMarkdown);
  const { preamble, sections } = splitMarkdownByH2(cleanBody);

  let leadContextHtml = '';
  const openQueue: { stage: PedagogyStage; heading: string; md: string }[] = [];
  const researchQueue: { stage: PedagogyStage; heading: string; md: string }[] = [];

  if (preamble) {
    // Discard standalone horizontal rules at top preamble
    const trimmedPreamble = preamble.replace(/^---+\s*$/gm, '').trim();
    if (trimmedPreamble) {
      openQueue.push({ stage: 'understand', heading: '', md: trimmedPreamble });
    }
  }

  for (const sec of sections) {
    const role = classifySectionStage(sec.heading, sec.markdown);
    if (role === 'coordinates') {
      const { promotedIntroMd, adminCoordMd } = splitCoordinateContent(sec.markdown);
      if (promotedIntroMd) {
        // Render promoted conceptual framing without registering as a coordinate heading in TOC
        const dummyToc: TocItem[] = [];
        leadContextHtml = renderMarkdownFragment(promotedIntroMd, lang, base, sourceLabel, 'understand', dummyToc);
      }
      if (adminCoordMd) {
        researchQueue.push({ stage: 'research', heading: sec.heading, md: adminCoordMd });
      }
    } else if (role === 'research') {
      researchQueue.push({ stage: 'research', heading: sec.heading, md: sec.markdown });
    } else {
      openQueue.push({ stage: role, heading: sec.heading, md: sec.markdown });
    }
  }

  const renderSectionGroup = (queue: { stage: PedagogyStage; heading: string; md: string }[]): ArticleSection[] => {
    const rendered: ArticleSection[] = [];
    for (const item of queue) {
      const mdToRender = item.heading ? `## ${item.heading}\n\n${item.md}` : item.md;
      const beforeTocLen = toc.length;
      const html = renderMarkdownFragment(mdToRender, lang, base, sourceLabel, item.stage, toc);
      const secToc = toc.slice(beforeTocLen).find(t => t.level === 2);
      rendered.push({
        stage: item.stage,
        heading: secToc?.text || item.heading,
        shortHeading: secToc?.shortText || formatConciseHeading(item.heading),
        id: secToc?.id || '',
        html,
      });
    }
    return rendered;
  };

  const lessonSections = renderSectionGroup(openQueue);
  const researchSections = renderSectionGroup(researchQueue);

  // Derive 2-3 factual topic takeaways directly from this note's open headings (no fabricated summaries)
  const openH2s = toc.filter(t => t.stage !== 'research' && t.level === 2);
  const openH3s = toc.filter(t => t.stage !== 'research' && t.level === 3);
  const takeawaySource = openH2s.length >= 2 ? openH2s : [...openH2s, ...openH3s];
  const takeaways = Array.from(new Set(takeawaySource.map(t => formatConciseHeading(t.text, 56)))).slice(0, 3);

  const html = [
    leadContextHtml,
    ...lessonSections.map(s => s.html),
    ...researchSections.map(s => s.html),
  ]
    .filter(Boolean)
    .join('\n');

  return {
    html,
    leadContextHtml,
    lessonSections,
    researchSections,
    toc,
    takeaways,
  };
}

function extractCallNumber(filename: string): string | null {
  const match = filename.match(/LIB-\d{3}/i);
  return match ? match[0].toUpperCase() : null;
}

function parseRules(body: string): RuleInfo[] {
  const rules: RuleInfo[] = [];
  const pattern = /###\s+`?\[(RULE-\d{3}-\d{2})\]`?([^\n]*)\n([\s\S]*?)(?=\n###\s+|\n##\s+|\n---|\Z)/g;
  let match;
  while ((match = pattern.exec(body)) !== null) {
    const id = match[1];
    const title = match[2].trim();
    const content = match[3];
    const levelMatch = content.match(/(?:等級|合約等級|分類|Contract Level|Classification)\*\*:\s*`([A-Z_]+)`/) || content.match(/`([A-Z_]+)`/);
    rules.push({
      id,
      title,
      level: levelMatch ? levelMatch[1] : undefined
    });
  }
  return rules;
}

let cachedArticles: { zh: Map<string, ArticleData>; en: Map<string, ArticleData> } | null = null;

function extractCallIds(rawRefs: unknown[]): string[] {
  return rawRefs
    .map((item) => {
      const m = String(item).match(/LIB-\d{3}/i);
      return m ? m[0].toLowerCase() : '';
    })
    .filter(Boolean);
}

function loadHallDirectory(
  dirPath: string,
  lang: 'zh' | 'en',
  hall: KnowledgeHall,
  targetMap: Map<string, ArticleData>
): void {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md') && !f.startsWith('README'));

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const { data: frontmatter, content: rawMarkdown } = matter(fileContent);

    const callNumber = frontmatter.call_number || extractCallNumber(file);
    if (!callNumber) continue;

    const slug = callNumber.toLowerCase();
    const rendered = renderArticleMarkdown(rawMarkdown, lang, '/library', `${callNumber} (${lang})`);
    const rules = parseRules(rawMarkdown);

    const prereqsRaw = Array.isArray(frontmatter.prerequisites) ? frontmatter.prerequisites : [];
    const succsRaw = Array.isArray(frontmatter.successors) ? frontmatter.successors : [];
    const title = frontmatter.title || file.replace(/\.md$/, '');
    const excerpt = extractStudyOrientation(rawMarkdown, frontmatter, title, hall, lang);
    const coreFocus = buildCoreFocus(frontmatter, title, hall, lang);

    targetMap.set(slug, {
      callNumber,
      slug,
      lang,
      title,
      status: frontmatter.status || 'source-verified',
      invariantsCount: frontmatter.invariants_count || rules.length,
      module: frontmatter.module || (lang === 'zh' ? hall.nameZh : hall.nameEn),
      category: frontmatter.category || '',
      audience: Array.isArray(frontmatter.audience) ? frontmatter.audience : [],
      mathFoundations: Array.isArray(frontmatter.math_foundations) ? frontmatter.math_foundations : [],
      hardwareTarget: Array.isArray(frontmatter.hardware_target) ? frontmatter.hardware_target : [],
      created: formatDate(frontmatter.created),
      author: frontmatter.author || 'Luke',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      prerequisitesRaw: prereqsRaw,
      successorsRaw: succsRaw,
      prerequisiteIds: extractCallIds(prereqsRaw),
      successorIds: extractCallIds(succsRaw),
      hall,
      filePath: fullPath,
      rawMarkdown,
      htmlContent: rendered.html,
      leadContextHtml: rendered.leadContextHtml,
      lessonSections: rendered.lessonSections,
      researchSections: rendered.researchSections,
      takeaways: rendered.takeaways,
      toc: rendered.toc,
      rules,
      excerpt,
      coreFocus,
      executiveBrief: excerpt,
    });
  }
}

export function loadLibraryArticles(): { zh: Map<string, ArticleData>; en: Map<string, ArticleData> } {
  if (cachedArticles) return cachedArticles;

  const zhMap = new Map<string, ArticleData>();
  const enMap = new Map<string, ArticleData>();

  for (const hall of KNOWLEDGE_HALLS) {
    loadHallDirectory(path.join(ROOT_DIR, hall.dirZh), 'zh', hall, zhMap);
    loadHallDirectory(path.join(ROOT_DIR, hall.dirEn), 'en', hall, enMap);
  }

  cachedArticles = { zh: zhMap, en: enMap };
  return cachedArticles;
}

export function getAllBilingualPairs(): BilingualPair[] {
  const { zh, en } = loadLibraryArticles();
  const pairs: BilingualPair[] = [];

  for (const [slug, zhArt] of zh.entries()) {
    const enArt = en.get(slug);
    if (enArt) {
      pairs.push({
        callNumber: zhArt.callNumber,
        slug,
        zh: zhArt,
        en: enArt
      });
    }
  }

  // Sort by call number naturally: LIB-000, LIB-001, LIB-101...
  pairs.sort((a, b) => a.callNumber.localeCompare(b.callNumber, undefined, { numeric: true }));
  return pairs;
}

export function getTopologicalSortedArticles(lang: 'zh' | 'en'): ArticleData[] {
  const { zh, en } = loadLibraryArticles();
  const articlesMap = lang === 'zh' ? zh : en;
  const articles = Array.from(articlesMap.values());

  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const art of articles) {
    inDegree.set(art.slug, 0);
    adj.set(art.slug, []);
  }

  for (const art of articles) {
    for (const succ of art.successorIds) {
      if (inDegree.has(succ)) {
        inDegree.set(succ, (inDegree.get(succ) || 0) + 1);
        adj.get(art.slug)?.push(succ);
      }
    }
  }

  const queue: string[] = [];
  for (const [slug, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(slug);
  }

  // Natural sort tie-breaker
  queue.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const sorted: ArticleData[] = [];
  while (queue.length > 0) {
    const curr = queue.shift()!;
    const art = articlesMap.get(curr);
    if (art) sorted.push(art);

    const neighbors = adj.get(curr) || [];
    for (const nxt of neighbors) {
      const newDeg = (inDegree.get(nxt) || 1) - 1;
      inDegree.set(nxt, newDeg);
      if (newDeg === 0) {
        queue.push(nxt);
        queue.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      }
    }
  }

  if (sorted.length < articles.length) {
    const visited = new Set(sorted.map(s => s.slug));
    for (const art of articles) {
      if (!visited.has(art.slug)) sorted.push(art);
    }
  }

  return sorted;
}

export const getTopologicalArticles = getTopologicalSortedArticles;

// Learning Path Definitions with Pedagogical Metadata
export interface LearningPathStep {
  slug: string;
  callNumber: string;
  titleZh: string;
  titleEn: string;
  focusZh: string;
  focusEn: string;
  objectiveZh: string;
  objectiveEn: string;
  whyNextZh?: string;
  whyNextEn?: string;
}

export interface LearningPath {
  id: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  badge: string;
  targetAudienceZh: string;
  targetAudienceEn: string;
  learningOutcomesZh: string[];
  learningOutcomesEn: string[];
  startingVolume: string;
  steps: LearningPathStep[];
}

export const CURATED_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'deep-learning-foundations',
    titleZh: '深度學習第一性原理與模型架構演進',
    titleEn: 'Deep Learning First Principles & Architecture Evolution',
    descriptionZh: '從計算圖底層物理動機與高維幾何出發，穿透 GPU 體系結構與記憶體階層，直達 Transformer 注意力幾何與現代 LLM 縮放定律。',
    descriptionEn: 'From computational graphs and linear algebra geometry through GPU architecture to Transformer attention mechanics and LLM scaling laws.',
    badge: '理論與模型架構',
    targetAudienceZh: '欲跳脫「套件呼叫者」、渴望建立深度學習底層數學形式化推導與硬體協同心智模型的資訊工程學士與研究新手。',
    targetAudienceEn: 'Students and researchers seeking a rigorous mathematical and hardware-level understanding beyond high-level framework APIs.',
    learningOutcomesZh: [
      '推導反向傳播梯度流、損失曲面凸化與優化器收斂本質',
      '掌握 GPU 32 執行緒 Warp 對齊、記憶體階層與 Tensor Core Tiling',
      '掌握 QKV 注意力矩陣方差縮放、RoPE 複數旋轉位置編碼與 FlashAttention IO 感知計算',
      '理解 Chinchilla 縮放定律與千億參數 LLM 算力／資料配比'
    ],
    learningOutcomesEn: [
      'Derive gradient flows, loss landscape convexification, and optimizer convergence mechanics',
      'Master GPU 32-thread warp scheduling, memory hierarchies, and Tensor Core tiling',
      'Formulate QKV attention variance scaling, RoPE complex rotation, and FlashAttention IO tiling',
      'Apply Chinchilla scaling laws to billion-parameter LLM parameter-data allocations'
    ],
    startingVolume: 'LIB-000',
    steps: [
      {
        slug: 'lib-000',
        callNumber: 'LIB-000',
        titleZh: '圖書館總覽與概念拓樸導航系統',
        titleEn: 'Grand Library Navigator & Concept Coordinates',
        focusZh: '全局知識圖譜、分館索引與學習入口定位',
        focusEn: 'Global knowledge graph, hall index, and learning entry coordinates',
        objectiveZh: '建立全館跨領域知識座標，理解各學術分館的相依拓樸與研究方向。',
        objectiveEn: 'Establish global knowledge coordinates and grasp the cross-domain topological dependencies.'
      },
      {
        slug: 'lib-001',
        callNumber: 'LIB-001',
        titleZh: '深度學習第一性原理先修精要：模型如何學習的六大基石',
        titleEn: 'Deep Learning First Principles: Six Pillars of How Models Learn',
        focusZh: '計算圖、自動微分、梯度流、損失曲面與反向傳播物理本質',
        focusEn: 'Computational graphs, autodiff, gradient flows, and backpropagation mechanics',
        objectiveZh: '以物理直觀與數學形式化，建立模型權重更新與幾何摺疊的核心直觀。',
        objectiveEn: 'Build core geometric intuition for weight updates and loss landscapes via first principles.',
        whyNextZh: '從全域導覽進入具體理論前，必須先確立模型學習的第一性原理基石。',
        whyNextEn: 'Ground theoretical study in the fundamental physical mechanics of learning before advanced topics.'
      },
      {
        slug: 'lib-101',
        callNumber: 'LIB-101',
        titleZh: '線性代數與高維幾何變換本質',
        titleEn: 'Linear Algebra & High-Dimensional Geometry',
        focusZh: '向量空間、矩陣投影、奇異值分解 (SVD) 與特徵幾何直觀',
        focusEn: 'Vector spaces, projections, SVD, and spectral geometry',
        objectiveZh: '破除純符號運算，理解神經網路權重矩陣作為「高維空間幾何旋轉與拉伸」的本質。',
        objectiveEn: 'Understand neural network weights as geometric rotations and stretchings in high-dimensional vector spaces.',
        whyNextZh: '神經網路各層權重皆為線性映射，高維幾何直觀是理解後續架構與特徵空間的數學語言。',
        whyNextEn: 'High-dimensional geometry is the formal mathematical language needed to analyze weight transformations.'
      },
      {
        slug: 'lib-203',
        callNumber: 'LIB-203',
        titleZh: '計算機體系結構與深度學習硬體對齊',
        titleEn: 'Computer Architecture & Hardware-Aware Deep Learning',
        focusZh: 'GPU Warp 32 執行緒對齊、記憶體階層、Cache Line 與 Tensor Core Tiling',
        focusEn: 'GPU 32-thread warp alignment, memory hierarchies, and Tensor Core tiling',
        objectiveZh: '分析現代深度學習從「演算法複雜度」轉移至「硬體記憶體頻寬 (Memory-Bound)」的系統瓶頸。',
        objectiveEn: 'Diagnose modern deep learning bottlenecks shifting from compute FLOPs to memory-bound bandwidth limits.',
        whyNextZh: '高維矩陣運算不能僅停留在數學紙面，必須深入現代 GPU 硬體排程與記憶體存取真實約束。',
        whyNextEn: 'Mathematical matrix operations must be aligned with physical GPU execution and cache realities.'
      },
      {
        slug: 'lib-405',
        callNumber: 'LIB-405',
        titleZh: '注意力機制、Transformer 革命與位置編碼幾何',
        titleEn: 'Attention Mechanism & Transformer Revolution',
        focusZh: 'QKV 矩陣運算、方差除以根號 d_k 推導、RoPE 旋轉編碼與 FlashAttention IO 感知計算',
        focusEn: 'QKV matrix formulation, variance scaling, RoPE complex rotation, and FlashAttention IO awareness',
        objectiveZh: '完整推導自注意力機制的點積相似度、排列等變性防禦，以及 FlashAttention 在 SRAM 內的在線 Softmax 計算。',
        objectiveEn: 'Derive scaled dot-product attention, permutation equivariance, and SRAM online Softmax tiling.',
        whyNextZh: '結合高維幾何投影（LIB-101）與 GPU 記憶體階層架構（LIB-203），推導當代 AI 的核心引擎。',
        whyNextEn: 'Fuses high-dimensional projection geometry with GPU SRAM/HBM hierarchies to build the core AI engine.'
      },
      {
        slug: 'lib-602',
        callNumber: 'LIB-602',
        titleZh: '現代大語言模型架構解剖與縮放定律',
        titleEn: 'Modern LLM Anatomy & Scaling Laws',
        focusZh: 'LLaMA/Mistral 架構解析、RMSNorm、SwiGLU、Chinchilla Scaling Laws 與 KV 快取',
        focusEn: 'Modern decoder-only anatomy, RMSNorm, SwiGLU, Chinchilla scaling, and KV cache inference',
        objectiveZh: '將 Transformer 擴展為千億級生產系統，掌握參數量、計算量與訓練資料量的最優縮放軌跡。',
        objectiveEn: 'Scale attention mechanics to production frontier models via optimal compute-data-parameter allocations.',
        whyNextZh: '掌握注意力機制後，進一步解剖千億級現代大語言模型的工程實踐與推論效能優化。',
        whyNextEn: 'Takes attention mechanics into production-scale LLMs, analyzing frontier architectures and scaling behavior.'
      }
    ]
  },
  {
    id: 'spatial-ai-and-3d-vision',
    titleZh: '高維幾何、電腦視覺與 3D 空間感知前沿',
    titleEn: 'Spatial AI, Computer Vision & 3D Gaussian Splatting',
    descriptionZh: '自卷積空間歸納偏置與影像前處理質心對齊，貫穿相機射影對極幾何與 SfM，深入 NeRF 到 3D 高斯潑濺 (3DGS) 即時光柵化與具身場景問答。',
    descriptionEn: 'From CNN inductive biases and image center-of-mass preprocessing through projective geometry to 3DGS real-time rasterization and embodied scene understanding.',
    badge: '電腦視覺與空間感知',
    targetAudienceZh: '希望深入研究 3D 視覺、神經渲染、自駕感知、SLAM 與具身 AI (Embodied AI) 空間幾何的研發者。',
    targetAudienceEn: 'Developers and researchers diving into 3D reconstruction, neural rendering, SLAM, and spatial scene graphs.',
    learningOutcomesZh: [
      '推導 2D 卷積空間平移等變性與維度計算公式',
      '掌握像素質心對齊、仿射不變量與防範資料洩漏的嚴格資料管線',
      '建立相機針孔投影、基礎矩陣 (F)、本質矩陣 (E) 與運動結構恢復 (SfM)',
      '理解 3D 高斯共變異數矩陣投影、可微視雪光柵化 (Tile-based Rasterization) 與開放詞彙場景圖'
    ],
    learningOutcomesEn: [
      'Derive 2D convolution translational equivariance and spatial dimension formulas',
      'Implement center-of-mass geometric alignment and leak-free preprocessing pipelines',
      'Master pinhole projection, fundamental/essential matrices, and Structure-from-Motion (SfM)',
      'Formulate 3D Gaussian covariance projections, tile-based rasterization, and semantic scene graphs'
    ],
    startingVolume: 'LIB-000',
    steps: [
      {
        slug: 'lib-000',
        callNumber: 'LIB-000',
        titleZh: '圖書館總覽與概念拓樸導航系統',
        titleEn: 'Grand Library Navigator & Concept Coordinates',
        focusZh: '全局知識圖譜與視覺分館入口定位',
        focusEn: 'Global knowledge graph and vision hall entry coordinates',
        objectiveZh: '建立空間感知領域在整體資訊工程體系中的定位與相依脈絡。',
        objectiveEn: 'Establish where 3D vision and spatial perception fit within the broader CS knowledge graph.'
      },
      {
        slug: 'lib-001',
        callNumber: 'LIB-001',
        titleZh: '深度學習第一性原理先修精要',
        titleEn: 'Deep Learning First Principles',
        focusZh: '損失函數、梯度反向傳播與參數優化機制',
        focusEn: 'Loss functions, gradient backpropagation, and optimization mechanics',
        objectiveZh: '掌握影像重建與渲染誤差如何反向傳播更新 3D 空間參數。',
        objectiveEn: 'Understand how visual reconstruction loss gradients backpropagate to update 3D spatial primitives.',
        whyNextZh: '所有神經輻射場與可微渲染均依賴反向傳播梯度優化，必須先具備第一性原理基礎。',
        whyNextEn: 'All differentiable rendering techniques rely on backpropagation to optimize scene parameters.'
      },
      {
        slug: 'lib-101',
        callNumber: 'LIB-101',
        titleZh: '線性代數與高維幾何變換本質',
        titleEn: 'Linear Algebra & High-Dimensional Geometry',
        focusZh: '矩陣旋轉 (SO(3))、剛體變換 (SE(3)) 與射影坐標系',
        focusEn: 'Rotation matrices (SO(3)), rigid transformations (SE(3)), and projective spaces',
        objectiveZh: '為相機外部參數 (Extrinsics) 與 3D 幾何變換奠定嚴謹的旋轉矩陣與四元數數學基礎。',
        objectiveEn: 'Establish mathematical rigor for camera extrinsics and 3D transformations via SO(3)/SE(3).',
        whyNextZh: '3D 空間感知與相機運動本質上是剛體變換群的座標系變換，需線性幾何工具。',
        whyNextEn: 'Spatial AI is built fundamentally on coordinate frame transformations in Lie groups.'
      },
      {
        slug: 'lib-203',
        callNumber: 'LIB-203',
        titleZh: '計算機體系結構與深度學習硬體對齊',
        titleEn: 'Computer Architecture & Hardware-Aware Deep Learning',
        focusZh: 'GPU 執行緒束 (Warp) 排程、記憶體存取對齊與低延遲光柵化',
        focusEn: 'GPU warp scheduling, coalesced memory access, and low-latency rasterization',
        objectiveZh: '掌握 3DGS 瓦片光柵化 (Tile-based Rasterization) 如何利用 GPU 共享記憶體達到 100+ FPS 即時渲染。',
        objectiveEn: 'Understand how tile-based rasterization leverages GPU shared memory for 100+ FPS real-time rendering.',
        whyNextZh: '即時神經渲染極度依賴 GPU 記憶體連續存取與平行排程，需硬體體系結構知識。',
        whyNextEn: 'Real-time rendering speed is bottlenecked directly by memory coalescing and GPU warp utilization.'
      },
      {
        slug: 'lib-401',
        callNumber: 'LIB-401',
        titleZh: '全連結網路空間極限與卷積神經網路歸納偏置',
        titleEn: 'DNN Spatial Limits & CNN Inductive Bias',
        focusZh: '空間平移等變性、局部連接、權重共享與感受野推導',
        focusEn: 'Translational equivariance, local connectivity, weight sharing, and receptive field formulas',
        objectiveZh: '證明為什麼密集全連結無法處理 2D/3D 空間資料，並推導卷積運算的幾何先驗。',
        objectiveEn: 'Prove why dense layers fail on spatial imagery and derive inductive biases of convolution.',
        whyNextZh: '從幾何與硬體過渡至視覺特徵提取，理解視覺架構專屬的空間歸納偏置。',
        whyNextEn: 'Transitions from raw hardware to vision architectures, formalizing spatial inductive biases.'
      },
      {
        slug: 'lib-501',
        callNumber: 'LIB-501',
        titleZh: '電腦視覺前處理規範與影像質心定位演算法',
        titleEn: 'CV Preprocessing & Center of Mass Alignment',
        focusZh: '灰階質心公式、仿射校準矩陣、無偏裁剪與防禦性資料管線',
        focusEn: 'Center-of-mass formula, affine normalization, and leak-proof data pipelines',
        objectiveZh: '掌握經典視覺前處理中消除空間平移擾動的封閉解，杜絕生產環境資料洩漏。',
        objectiveEn: 'Master closed-form center-of-mass alignment to eliminate spatial shifts in clean data pipelines.',
        whyNextZh: '在進入多視角 3D 幾何前，必須確保單張影像的像素座標與前處理符合工業級防護。',
        whyNextEn: 'Ensures pristine pixel normalization and data pipeline hygiene before multi-view 3D math.'
      },
      {
        slug: 'lib-502',
        callNumber: 'LIB-502',
        titleZh: '相機射影幾何、對極幾何與運動結構恢復 (SfM)',
        titleEn: 'Camera Projective Geometry & Structure-from-Motion',
        focusZh: '針孔相機內參矩陣、對極幾何約束、基礎矩陣 (F)、八點演算法與 SfM 稀疏重建',
        focusEn: 'Pinhole intrinsics, epipolar geometry, fundamental matrix, 8-point algorithm, and SfM',
        objectiveZh: '完整推導多視角立體視覺幾何，從未標註多視角影像中恢復相機軌跡與 3D 稀疏點雲。',
        objectiveEn: 'Derive multi-view epipolar constraints to recover camera poses and 3D sparse points from 2D images.',
        whyNextZh: '3DGS 與 NeRF 的起點是相機姿態 (Camera Poses) 與稀疏點雲，這些由 SfM 演算法產出。',
        whyNextEn: 'SfM generates the exact camera poses and initial point clouds required as input to 3DGS.'
      },
      {
        slug: 'lib-504',
        callNumber: 'LIB-504',
        titleZh: '3D 視覺前沿：神經輻射場 (NeRF) 到 3D 高斯潑濺 (3DGS) 理論與光柵化',
        titleEn: '3D Vision Frontiers: NeRF to 3D Gaussian Splatting Theory & Rasterization',
        focusZh: '體積渲染公式、3D 高斯幾何參數化、雅可比投影矩陣 J 與瓦片排序光柵化',
        focusEn: 'Volume rendering, 3D Gaussian covariance, Jacobian projection, and tile-based rasterization',
        objectiveZh: '掌握從連續神經場 (NeRF) 到顯式可微幾何基元 (3DGS) 的範式轉移，推導即時渲染封閉解。',
        objectiveEn: 'Formulate the paradigm shift from implicit neural volumes to explicit 3D Gaussian splatting.',
        whyNextZh: '結合 SfM 相機姿態與 GPU 硬體特性，推導當前最前沿的即時 3D 新視角生成核心演算法。',
        whyNextEn: 'Brings together SfM poses and GPU architecture into state-of-the-art real-time view synthesis.'
      },
      {
        slug: 'lib-505',
        callNumber: 'LIB-505',
        titleZh: '開放詞彙 3D 高斯潑濺與語意場景圖檢索',
        titleEn: 'Open-Vocabulary 3DGS & Semantic Scene Graphs',
        focusZh: 'CLIP/DINO 視覺語言特徵蒸餾、高斯特徵場、語意場景圖與開放詞彙定位',
        focusEn: 'Visual-language feature distillation, Gaussian feature fields, and open-vocabulary localization',
        objectiveZh: '將 2D 大模型的語意理解能力蒸餾至 3D 高斯基元中，實現任意自然語言查詢的 3D 空間物件檢索。',
        objectiveEn: 'Distill 2D vision-language representations into 3D Gaussians for open-vocabulary spatial querying.',
        whyNextZh: '3D 重建不只要外觀逼真，更需要具備語意理解能力，為具身智慧代理人鋪路。',
        whyNextEn: 'Extends purely photometric 3D Gaussians with open-vocabulary semantics for AI agents.'
      },
      {
        slug: 'lib-506',
        callNumber: 'LIB-506',
        titleZh: 'LLM 驅動之 3DGS 空間問答、階層場景圖與具身導航',
        titleEn: 'LLM-Grounded 3D Scene QA & Embodied Navigation',
        focusZh: '3D 階層場景圖 (HSG)、具身任務規劃、空間關聯推論與機器人導航決策',
        focusEn: 'Hierarchical scene graphs (HSG), embodied task planning, and robotic navigation policies',
        objectiveZh: '結合大語言模型推理與 3D 空間語意，建立機器人感知、推理到具身導航的完整認知閉環。',
        objectiveEn: 'Close the loop between spatial representation, LLM reasoning, and embodied robotic actions.',
        whyNextZh: '將 3D 空間感知（LIB-504/505）與語言模型推理深度融合，抵達具身 AI 空間智慧終點。',
        whyNextEn: 'Reaches the frontier where 3D spatial perception converges with intelligent embodied decision-making.'
      }
    ]
  },
  {
    id: 'intelligent-agents-and-systems',
    titleZh: '智慧代理人認知架構、推論協議與神經決策',
    titleEn: 'Intelligent Agents, Cognitive Protocols & Neural Decisions',
    descriptionZh: '自第一性原理與 GPU 體系結構出發，經 Transformer 注意力引擎，深入現代 LLM Agent 認知推論架構、Tool-Use 協議與 S1 雙進程神經代理人。',
    descriptionEn: 'From first principles and GPU architecture through Transformer attention to modern LLM Agent cognitive loops, tool protocols, and dual-process S1 decision agents.',
    badge: '系統與代理人架構',
    targetAudienceZh: '希望擺脫「Prompt 拼接」表層應用、建立生產級自治 Agent 認知架構與推論協議的工程師與研究員。',
    targetAudienceEn: 'Engineers and researchers building robust, protocol-driven autonomous agent architectures beyond prompt templates.',
    learningOutcomesZh: [
      '建立反向傳播與硬體排程如何支撐大模型自迴歸推論的底層心智模型',
      '掌握自注意力機制、KV 快取與長上下文窗口之計算記憶體權衡',
      '分析 ReAct、Plan-and-Solve、反射回路 (Reflexion) 與確定性工具調用協議',
      '掌握 S1 非自迴歸型態決策引擎 (S1-Jev) 與快慢思維雙進程神經架構'
    ],
    learningOutcomesEn: [
      'Understand how foundational systems support high-throughput autoregressive inference',
      'Formulate attention KV cache footprints and long-context memory trade-offs',
      'Analyze ReAct loops, planning frameworks, reflection systems, and strict tool protocols',
      'Master non-autoregressive decision engines (S1-Jev) and dual-process fast/slow cognitive architectures'
    ],
    startingVolume: 'LIB-000',
    steps: [
      {
        slug: 'lib-000',
        callNumber: 'LIB-000',
        titleZh: '圖書館總覽與概念拓樸導航系統',
        titleEn: 'Grand Library Navigator & Concept Coordinates',
        focusZh: '全局知識圖譜與系統分館入口定位',
        focusEn: 'Global knowledge graph and systems hall entry coordinates',
        objectiveZh: '掌握智慧代理人體系在現代 AI 堆疊中的系統架構定位。',
        objectiveEn: 'Grasp the architectural positioning of autonomous agents in the modern AI stack.'
      },
      {
        slug: 'lib-001',
        callNumber: 'LIB-001',
        titleZh: '深度學習第一性原理先修精要',
        titleEn: 'Deep Learning First Principles',
        focusZh: '損失函數收斂、預測分佈與神經網路擬合能力邊界',
        focusEn: 'Loss convergence, probability distributions, and capacity boundaries',
        objectiveZh: '理解神經網路本質是高維機率分佈預測器，確立 Agent 決策不確定性的數學根源。',
        objectiveEn: 'Recognize neural networks as probability predictors, formalizing agent decision uncertainty.',
        whyNextZh: 'Agent 的基石是神經決策模型，必須先理解模型擬合與預測的理論邊界。',
        whyNextEn: 'Autonomous agents rely on neural models; understanding capability bounds is required first.'
      },
      {
        slug: 'lib-101',
        callNumber: 'LIB-101',
        titleZh: '線性代數與高維幾何變換本質',
        titleEn: 'Linear Algebra & High-Dimensional Geometry',
        focusZh: '高維向量距離度量、內積相似度與語意嵌入空間',
        focusEn: 'Vector distance metrics, dot-product similarity, and embedding spaces',
        objectiveZh: '建立記憶檢索 (Memory Retrieval) 與向量資料庫 RAG 的高維幾何空間數學直觀。',
        objectiveEn: 'Establish mathematical rigor for vector embeddings, similarity search, and agent memory.',
        whyNextZh: 'Agent 的外部記憶 (Vector Memory) 與工具語意比對本質是高維向量空間度量。',
        whyNextEn: 'External memory retrieval and semantic tool matching operate in high-dimensional vector spaces.'
      },
      {
        slug: 'lib-203',
        callNumber: 'LIB-203',
        titleZh: '計算機體系結構與深度學習硬體對齊',
        titleEn: 'Computer Architecture & Hardware-Aware Deep Learning',
        focusZh: 'GPU 推論延遲瓶頸、記憶體頻寬極限與並行排程',
        focusEn: 'GPU inference latency, memory bandwidth limits, and parallel execution',
        objectiveZh: '理解 Agent 呼叫大模型推論時的 Token 生成延遲 (Time-to-First-Token, Inter-Token Latency) 物理成因。',
        objectiveEn: 'Diagnose agent latency bottlenecks (TTFT, ITL) rooted in GPU memory bandwidth and scheduling.',
        whyNextZh: '自主 Agent 的多輪思考迴圈受限於推論延遲，必須掌握系統底層的硬體約束。',
        whyNextEn: 'Multi-turn autonomous loops are latency-bound; hardware memory limits dictate practical viability.'
      },
      {
        slug: 'lib-405',
        callNumber: 'LIB-405',
        titleZh: '注意力機制、Transformer 革命與位置編碼幾何',
        titleEn: 'Attention Mechanism & Transformer Revolution',
        focusZh: '自注意力矩陣、長上下文衰減、RoPE 位置編碼與在線 Softmax 計算',
        focusEn: 'Self-attention, context decay, RoPE geometry, and online Softmax execution',
        objectiveZh: '掌握 Agent 思考的核心引擎，理解上下文長度 (Context Window) 的計算複雜度與注意力分散極限。',
        objectiveEn: 'Master the core engine of modern LLM reasoning and the limits of long-context attention.',
        whyNextZh: '當代 Agent 的「大腦」即為 Transformer 架構，其注意力機制決定了上下文理解深度。',
        whyNextEn: 'Transformers form the cognitive reasoning engine for agents; attention governs memory integration.'
      },
      {
        slug: 'lib-703',
        callNumber: 'LIB-703',
        titleZh: '現代大模型代理人 (LLM Agent) 認知架構與推論協議',
        titleEn: 'LLM Agent Cognitive Architecture & Protocols',
        focusZh: 'ReAct 循環、規劃分解、工具呼叫協議、記憶體階層與自我修正機制',
        focusEn: 'ReAct loops, task planning, tool schemas, memory hierarchies, and reflex error correction',
        objectiveZh: '建立生產級 Agent 認知閉環：從目標拆解、確定性工具呼叫、外部記憶檢索到反思重試。',
        objectiveEn: 'Construct a production agent cognitive architecture with planning, tool schemas, and error recovery.',
        whyNextZh: '從 Transformer 注意力核心邁入自主智慧代理人架構，整合感知、記憶、工具與推論。',
        whyNextEn: 'Elevates foundational attention mechanics into full autonomous agent loops with tools and memory.'
      },
      {
        slug: 'lib-704',
        callNumber: 'LIB-704',
        titleZh: '雙進程神經代理人：S1 非自迴歸型態決策引擎與反射模型',
        titleEn: 'Dual-Process Neural Agent S1-Jev & Reflex CUA-S1',
        focusZh: '快慢思維 (System 1 / System 2)、非自迴歸反射策略、潛在空間直接採樣與混合決策架構',
        focusEn: 'Dual-process fast/slow cognition, non-autoregressive reflex policy, and hybrid action selection',
        objectiveZh: '突破純自迴歸大模型高延遲瓶頸，推導「System 1 反射神經」與「System 2 慢思考」協同的次世代 Agent 決策引擎。',
        objectiveEn: 'Formulate hybrid fast/slow cognitive agents combining non-autoregressive reflex actions with slow planning.',
        whyNextZh: '在掌握標準 Agent 架構（LIB-703）後，深入解決生產環境即時反應瓶頸，完成認知代理人巔峰演進。',
        whyNextEn: 'Solves real-time latency bottlenecks by synthesizing fast reflex policies with deliberative planning.'
      }
    ]
  }
];

export interface PathEdgeValidationResult {
  valid: boolean;
  totalPaths: number;
  totalEdges: number;
  totalSteps: number;
  errors: string[];
  edges: {
    pathId: string;
    from: string;
    to: string;
    fromTitle: string;
    toTitle: string;
  }[];
}

export function verifyLearningPathsStrictly(): PathEdgeValidationResult {
  const { zh, en } = loadLibraryArticles();
  const errors: string[] = [];
  const verifiedEdges: PathEdgeValidationResult['edges'] = [];
  let totalSteps = 0;

  for (const path of CURATED_LEARNING_PATHS) {
    totalSteps += path.steps.length;
    if (path.steps.length < 2) {
      errors.push(`[${path.id}] Learning path must have at least 2 steps`);
      continue;
    }

    for (let i = 0; i < path.steps.length - 1; i++) {
      const stepA = path.steps[i];
      const stepB = path.steps[i + 1];

      const zhA = zh.get(stepA.slug);
      const zhB = zh.get(stepB.slug);
      const enA = en.get(stepA.slug);
      const enB = en.get(stepB.slug);

      if (!zhA || !enA) {
        errors.push(`[${path.id}] Node A '${stepA.callNumber}' (${stepA.slug}) not found in library!`);
      }
      if (!zhB || !enB) {
        errors.push(`[${path.id}] Node B '${stepB.callNumber}' (${stepB.slug}) not found in library!`);
      }

      if (zhA && zhB) {
        // Condition 1: B's prerequisites must declare A
        const bHasPreA = zhB.prerequisiteIds.includes(stepA.slug);
        if (!bHasPreA) {
          errors.push(`[${path.id}] Direct edge violation: '${stepB.callNumber}' does NOT declare '${stepA.callNumber}' in prerequisites! Declared: [${zhB.prerequisiteIds.join(', ')}]`);
        }

        // Condition 2: A's successors must declare B
        const aHasSuccB = zhA.successorIds.includes(stepB.slug);
        if (!aHasSuccB) {
          errors.push(`[${path.id}] Direct edge violation: '${stepA.callNumber}' does NOT declare '${stepB.callNumber}' in successors! Declared: [${zhA.successorIds.join(', ')}]`);
        }

        if (bHasPreA && aHasSuccB) {
          verifiedEdges.push({
            pathId: path.id,
            from: stepA.callNumber,
            to: stepB.callNumber,
            fromTitle: zhA.title,
            toTitle: zhB.title,
          });
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    totalPaths: CURATED_LEARNING_PATHS.length,
    totalEdges: verifiedEdges.length,
    totalSteps,
    errors,
    edges: verifiedEdges,
  };
}
