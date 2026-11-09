import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import katex from 'katex';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../../');

export interface KnowledgeHall {
  id: string;
  code: string;
  nameZh: string;
  nameEn: string;
  dirZh: string;
  dirEn: string;
  icon: string;
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
    icon: '🧭',
    descriptionZh: '圖書館總索引、第一性原理基石與全局拓樸導航地圖。',
    descriptionEn: 'Grand Library index, deep learning first principles, and global topological roadmap.'
  },
  {
    id: 'hall-01',
    code: '01',
    nameZh: '數學與理論基石',
    nameEn: 'Mathematics & Foundations',
    dirZh: '01_數學與理論基石',
    dirEn: 'en/01_mathematics',
    icon: '📐',
    descriptionZh: '線性代數、高維幾何、機率統計、資訊理論與凸最佳化收斂性證明。',
    descriptionEn: 'Linear algebra, high-dimensional geometry, probability, variational inference & convex optimization.'
  },
  {
    id: 'hall-02',
    code: '02',
    nameZh: '計算機系統與硬體架構',
    nameEn: 'Computer Systems & Architecture',
    dirZh: '02_計算機系統與硬體架構',
    dirEn: 'en/02_computer_systems',
    icon: '⚡',
    descriptionZh: 'GPU Warp 對齊、Tensor Core Tiling、快取階層與硬體對齊優化。',
    descriptionEn: 'GPU Warp scheduling, Tensor Core tiling, cache hierarchies & hardware-aware deep learning.'
  },
  {
    id: 'hall-03',
    code: '03',
    nameZh: '機器學習與統計學習原理',
    nameEn: 'Machine Learning & Statistical Foundations',
    dirZh: '03_機器學習與統計學習原理',
    dirEn: 'en/03_machine_learning',
    icon: '📊',
    descriptionZh: '資料偏差、領域漂移、空間權重懲罰與古典統計學習理論。',
    descriptionEn: 'Dataset bias, domain shift, spatial penalties, and statistical learning guarantees.'
  },
  {
    id: 'hall-04',
    code: '04',
    nameZh: '深度學習架構與神經機制',
    nameEn: 'Deep Learning Architectures',
    dirZh: '04_深度學習架構與神經機制',
    dirEn: 'en/04_deep_learning_architectures',
    icon: '🧠',
    descriptionZh: 'CNN 歸納偏置、Transformer 注意力機制、擴散模型與流匹配。',
    descriptionEn: 'CNN inductive bias, Transformer attention revolution, score-based diffusion & flow matching.'
  },
  {
    id: 'hall-05',
    code: '05',
    nameZh: '計算機視覺與高維感測',
    nameEn: 'Computer Vision & Spatial Sensing',
    dirZh: '05_計算機視覺與高維感測',
    dirEn: 'en/05_computer_vision',
    icon: '👁️',
    descriptionZh: '質心前處理演算法、對極幾何、NeRF 與 3D 高斯潑濺 (3DGS)。',
    descriptionEn: 'Center-of-mass alignment, projective geometry, NeRF and 3D Gaussian Splatting.'
  },
  {
    id: 'hall-06',
    code: '06',
    nameZh: '自然語言處理與大語言模型',
    nameEn: 'NLP & Large Language Models',
    dirZh: '06_自然語言處理與大語言模型',
    dirEn: 'en/06_nlp_and_llms',
    icon: '💬',
    descriptionZh: '現代 LLM 架構、Scaling Laws、密集檢索、RAG 與 CAG 系統。',
    descriptionEn: 'Modern LLM anatomy, scaling laws, dense retrieval, RAG and Cache-Augmented Generation.'
  },
  {
    id: 'hall-07',
    code: '07',
    nameZh: '強化學習與智慧代理人',
    nameEn: 'Reinforcement Learning & AI Agents',
    dirZh: '07_強化學習與智慧代理人',
    dirEn: 'en/07_reinforcement_learning_and_agents',
    icon: '🤖',
    descriptionZh: 'LLM Agent 認知推論架構、S1 非自迴歸型態決策引擎與反射模型。',
    descriptionEn: 'LLM Agent cognitive architectures, S1 non-autoregressive decision engines & reflex models.'
  },
  {
    id: 'hall-08',
    code: '08',
    nameZh: 'AI系統工程與高效部署',
    nameEn: 'AI Systems Engineering & Deployment',
    dirZh: '08_AI系統工程與高效部署',
    dirEn: 'en/08_ai_systems_engineering',
    icon: '⚙️',
    descriptionZh: '模型校準、不確定性估計、INT8/FP4 量化數學與低精度推論。',
    descriptionEn: 'Model calibration, uncertainty estimation, quantization mathematics & low-precision inference.'
  },
  {
    id: 'hall-09',
    code: '09',
    nameZh: '科研方法論與頂尖專題藍圖',
    nameEn: 'Research Methodology & Capstones',
    dirZh: '09_科研方法論與頂尖專題藍圖',
    dirEn: 'en/09_research_methodology',
    icon: '🎓',
    descriptionZh: 'MNIST 生產級專案復盤、學術推甄藍圖、前沿研究藍圖與認知修訂。',
    descriptionEn: 'Production MNIST post-mortem, capstone blueprints, research corpus & conversational revision.'
  }
];

export interface TocItem {
  id: string;
  text: string;
  level: number;
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
  toc: TocItem[];
  rules: RuleInfo[];
  excerpt: string;
}

export interface BilingualPair {
  callNumber: string;
  slug: string;
  zh: ArticleData;
  en: ArticleData;
}

// Markdown renderer with KaTeX and WikiLinks
export function renderArticleMarkdown(rawMarkdown: string, lang: 'zh' | 'en', base: string = '/library'): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];

  // Protect code blocks first
  const codeBlocks: string[] = [];
  let processed = rawMarkdown.replace(/```[\s\S]*?```/g, (match) => {
    const idx = codeBlocks.length;
    codeBlocks.push(match);
    return `%%%CODEBLOCK_${idx}%%%`;
  });

  // Extract headings for TOC and add anchor IDs
  processed = processed.replace(/^(#{2,4})\s+(.+)$/gm, (match, hashes, title) => {
    const level = hashes.length;
    // Clean title for id
    const cleanTitle = title.replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').trim();
    const slugId = cleanTitle
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\-_]+/g, '-')
      .replace(/^-+|-+$/g, '') || `section-${toc.length + 1}`;
    
    toc.push({ id: slugId, text: cleanTitle, level });
    return `<h${level} id="${slugId}">${title}</h${level}>`;
  });

  // Render LaTeX Display Math: $$ ... $$
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    try {
      return `<div class="katex-display-container">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch {
      return match;
    }
  });

  // Render LaTeX Inline Math: $ ... $
  processed = processed.replace(/(?<!\$)\$([^\$\n]+?)\$(?!\$)/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return match;
    }
  });

  // Transform Obsidian WikiLinks: [[target]] or [[target|label]]
  processed = processed.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, target, customLabel) => {
    const cleanTarget = target.trim();
    const label = customLabel ? customLabel.trim() : cleanTarget;

    const libMatch = cleanTarget.match(/LIB-(\d{3})/i);
    if (libMatch) {
      const targetSlug = `lib-${libMatch[1].toLowerCase()}`;
      const targetUrl = `${base}/${lang}/notes/${targetSlug}/`;
      return `<a class="wikilink-badge" href="${targetUrl}">📖 ${label}</a>`;
    }

    // Asset link: assets/xxx
    if (cleanTarget.startsWith('assets/') || cleanTarget.includes('.svg') || cleanTarget.includes('.png')) {
      const assetName = path.basename(cleanTarget);
      return `<a class="wikilink-asset" href="${base}/assets/${assetName}" target="_blank">${label}</a>`;
    }

    return `<span class="wikilink-text">${label}</span>`;
  });

  // Transform Markdown image links
  processed = processed.replace(/!\[(.*?)\]\(((?:\.\.\/)*assets\/([^)]+))\)/g, (match, alt, fullPath, filename) => {
    return `![${alt}](${base}/assets/${filename})`;
  });

  // Transform standard Markdown links to notes
  processed = processed.replace(/\[([^\]]+)\]\(([^)]*LIB-(\d{3})[^)]*\.md)\)/gi, (match, text, url, num) => {
    const slug = `lib-${num.toLowerCase()}`;
    return `[${text}](${base}/${lang}/notes/${slug}/)`;
  });

  // Transform Evidence Tags: [FACT], [DERIVATION], etc.
  processed = processed.replace(/\[(FACT|DERIVATION|LITERATURE_RESULT|EMPIRICAL_RESULT|HEURISTIC|DESIGN_DECISION|TARGET|SAFETY_BOUND|HYPOTHESIS|OPEN_QUESTION)\]/g, (match, tag) => {
    return `<span class="evidence-pill pill-${tag.toLowerCase()}">${tag}</span>`;
  });

  // Transform Contract Rule Badges: [RULE-###-##]
  processed = processed.replace(/\[(RULE-\d{3}-\d{2})\]/g, (match, ruleId) => {
    return `<span class="rule-pill">${ruleId}</span>`;
  });

  // Restore code blocks
  processed = processed.replace(/%%%CODEBLOCK_(\d+)%%%/g, (match, idx) => {
    return codeBlocks[parseInt(idx, 10)];
  });

  // Parse Markdown to HTML
  const html = marked.parse(processed, {
    gfm: true,
    breaks: false,
  }) as string;

  return { html, toc };
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

export function loadLibraryArticles(): { zh: Map<string, ArticleData>; en: Map<string, ArticleData> } {
  if (cachedArticles) return cachedArticles;

  const zhMap = new Map<string, ArticleData>();
  const enMap = new Map<string, ArticleData>();

  for (const hall of KNOWLEDGE_HALLS) {
    const zhDir = path.join(ROOT_DIR, hall.dirZh);
    const enDir = path.join(ROOT_DIR, hall.dirEn);

    // Read ZH articles
    if (fs.existsSync(zhDir)) {
      const files = fs.readdirSync(zhDir).filter(f => f.endsWith('.md') && extractCallNumber(f));
      for (const file of files) {
        const fullPath = path.join(zhDir, file);
        const callNumber = extractCallNumber(file)!;
        const slug = callNumber.toLowerCase();
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const { data: fm, content: body } = matter(raw);

        const prereqMatches = (fm.prerequisites || []).map((p: string) => {
          const m = p.match(/LIB-\d{3}/i);
          return m ? m[0].toLowerCase() : null;
        }).filter(Boolean) as string[];

        const succMatches = (fm.successors || []).map((s: string) => {
          const m = s.match(/LIB-\d{3}/i);
          return m ? m[0].toLowerCase() : null;
        }).filter(Boolean) as string[];

        const rules = parseRules(body);
        const { html, toc } = renderArticleMarkdown(body, 'zh');

        // Simple excerpt from first paragraph of body
        const firstPara = body.split('\n\n').find(p => p.trim() && !p.startsWith('#') && !p.startsWith('>') && !p.startsWith('-')) || '';
        const excerpt = firstPara.replace(/[#*`[\]()]/g, '').trim().slice(0, 160) + '...';

        zhMap.set(slug, {
          callNumber,
          slug,
          lang: 'zh',
          title: fm.title || file.replace(/\.md$/, ''),
          status: fm.status || 'verified',
          invariantsCount: fm.invariants_count || rules.length,
          module: fm.module || '',
          category: fm.category || '',
          audience: Array.isArray(fm.audience) ? fm.audience : [],
          mathFoundations: Array.isArray(fm.math_foundations) ? fm.math_foundations : [],
          hardwareTarget: Array.isArray(fm.hardware_target) ? fm.hardware_target : [],
          created: String(fm.created || '2026-09-22'),
          author: fm.author || 'Luke',
          tags: Array.isArray(fm.tags) ? fm.tags : [],
          prerequisitesRaw: fm.prerequisites || [],
          successorsRaw: fm.successors || [],
          prerequisiteIds: prereqMatches,
          successorIds: succMatches,
          hall,
          filePath: fullPath,
          rawMarkdown: raw,
          htmlContent: html,
          toc,
          rules,
          excerpt
        });
      }
    }

    // Read EN articles
    if (fs.existsSync(enDir)) {
      const files = fs.readdirSync(enDir).filter(f => f.endsWith('.md') && extractCallNumber(f));
      for (const file of files) {
        const fullPath = path.join(enDir, file);
        const callNumber = extractCallNumber(file)!;
        const slug = callNumber.toLowerCase();
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const { data: fm, content: body } = matter(raw);

        const prereqMatches = (fm.prerequisites || []).map((p: string) => {
          const m = p.match(/LIB-\d{3}/i);
          return m ? m[0].toLowerCase() : null;
        }).filter(Boolean) as string[];

        const succMatches = (fm.successors || []).map((s: string) => {
          const m = s.match(/LIB-\d{3}/i);
          return m ? m[0].toLowerCase() : null;
        }).filter(Boolean) as string[];

        const rules = parseRules(body);
        const { html, toc } = renderArticleMarkdown(body, 'en');

        const firstPara = body.split('\n\n').find(p => p.trim() && !p.startsWith('#') && !p.startsWith('>') && !p.startsWith('-')) || '';
        const excerpt = firstPara.replace(/[#*`[\]()]/g, '').trim().slice(0, 160) + '...';

        enMap.set(slug, {
          callNumber,
          slug,
          lang: 'en',
          title: fm.title || file.replace(/\.md$/, ''),
          status: fm.status || 'verified',
          invariantsCount: fm.invariants_count || rules.length,
          module: fm.module || '',
          category: fm.category || '',
          audience: Array.isArray(fm.audience) ? fm.audience : [],
          mathFoundations: Array.isArray(fm.math_foundations) ? fm.math_foundations : [],
          hardwareTarget: Array.isArray(fm.hardware_target) ? fm.hardware_target : [],
          created: String(fm.created || '2026-09-22'),
          author: fm.author || 'Luke',
          tags: Array.isArray(fm.tags) ? fm.tags : [],
          prerequisitesRaw: fm.prerequisites || [],
          successorsRaw: fm.successors || [],
          prerequisiteIds: prereqMatches,
          successorIds: succMatches,
          hall,
          filePath: fullPath,
          rawMarkdown: raw,
          htmlContent: html,
          toc,
          rules,
          excerpt
        });
      }
    }
  }

  cachedArticles = { zh: zhMap, en: enMap };
  
  // Strict DAG verification: FAIL IMMEDIATELY if any learning path contains non-direct edges
  const pathCheck = verifyLearningPathsStrictly();
  if (!pathCheck.valid) {
    throw new Error(`[FATAL_DAG_VIOLATION] Learning path direct edge validation failed with ${pathCheck.errors.length} error(s):\n${pathCheck.errors.join('\n')}`);
  }

  return cachedArticles;
}

export function getAllPairs(): BilingualPair[] {
  const { zh, en } = loadLibraryArticles();
  const slugs = Array.from(new Set([...zh.keys(), ...en.keys()])).sort();
  
  return slugs.map(slug => {
    const zhArticle = zh.get(slug)!;
    const enArticle = en.get(slug)!;
    return {
      callNumber: (zhArticle || enArticle).callNumber,
      slug,
      zh: zhArticle,
      en: enArticle,
    };
  });
}

export function getTopologicalArticles(lang: 'zh' | 'en' = 'zh'): ArticleData[] {
  const { zh, en } = loadLibraryArticles();
  const map = lang === 'zh' ? zh : en;
  const articles = Array.from(map.values());

  // Kahn's topological sort based on prerequisites
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const art of articles) {
    inDegree.set(art.slug, art.prerequisiteIds.length);
    adj.set(art.slug, []);
  }

  for (const art of articles) {
    for (const pre of art.prerequisiteIds) {
      if (adj.has(pre)) {
        adj.get(pre)!.push(art.slug);
      }
    }
  }

  const queue: string[] = [];
  for (const [slug, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(slug);
  }

  const sorted: ArticleData[] = [];
  while (queue.length > 0) {
    const currSlug = queue.shift()!;
    const art = map.get(currSlug);
    if (art) sorted.push(art);

    const neighbors = adj.get(currSlug) || [];
    for (const next of neighbors) {
      const curDeg = inDegree.get(next)! - 1;
      inDegree.set(next, curDeg);
      if (curDeg === 0) queue.push(next);
    }
  }

  // If any unvisited due to cycle (none in our validated DAG), append remaining
  if (sorted.length < articles.length) {
    const visited = new Set(sorted.map(s => s.slug));
    for (const art of articles) {
      if (!visited.has(art.slug)) sorted.push(art);
    }
  }

  return sorted;
}

// Learning Path Definition
export interface LearningPath {
  id: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  badge: string;
  steps: {
    slug: string;
    callNumber: string;
    focusZh: string;
    focusEn: string;
  }[];
}

export const CURATED_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'deep-learning-foundations',
    titleZh: '深度學習第一性原理與模型架構演進',
    titleEn: 'Deep Learning First Principles & Architecture Evolution',
    descriptionZh: '基於嚴格直接相依拓樸（6 節點 / 5 條有向邊）：自概念總覽與第一性原理，經高維幾何與計算機體系硬體對齊，直通注意力機制與現代大語言模型架構。',
    descriptionEn: 'Strictly direct DAG path (6 nodes / 5 directed edges): from overview & first principles through linear geometry & GPU hardware alignment to Attention and Modern LLMs.',
    badge: '理論與架構 (Core Architecture)',
    steps: [
      { slug: 'lib-000', callNumber: 'LIB-000', focusZh: '圖書館總覽與概念拓樸定位', focusEn: 'Grand Library Navigator & Concept Coordinates' },
      { slug: 'lib-001', callNumber: 'LIB-001', focusZh: '深度學習第一性原理與六大基石', focusEn: 'First Principles & Six Pillars of Learning' },
      { slug: 'lib-101', callNumber: 'LIB-101', focusZh: '線性代數與高維幾何空間映射', focusEn: 'Linear Algebra & High-Dimensional Geometry' },
      { slug: 'lib-203', callNumber: 'LIB-203', focusZh: '計算機體系結構與深度學習硬體對齊 (Warp-32/Tensor Core)', focusEn: 'Computer Architecture & Hardware Alignment' },
      { slug: 'lib-405', callNumber: 'LIB-405', focusZh: '注意力機制、Transformer 革命與位置編碼幾何', focusEn: 'Attention Mechanism & Transformer Revolution' },
      { slug: 'lib-602', callNumber: 'LIB-602', focusZh: '現代大語言模型架構解剖與縮放定律', focusEn: 'Modern LLM Anatomy & Scaling Laws' },
    ]
  },
  {
    id: 'spatial-ai-and-3d-vision',
    titleZh: '高維幾何、電腦視覺與 3D 空間感知前沿',
    titleEn: 'Spatial AI, Computer Vision & 3D Gaussian Splatting',
    descriptionZh: '基於嚴格直接相依拓樸（10 節點 / 9 條有向邊）：自硬體對齊與卷積歸納偏置出發，貫穿質心前處理、對極幾何、NeRF 到 3DGS 光柵化，最終至具身導航問答。',
    descriptionEn: 'Strictly direct DAG path (10 nodes / 9 directed edges): from hardware alignment and CNN inductive biases through center-of-mass preprocessing to 3DGS and embodied navigation.',
    badge: '電腦視覺 (Spatial AI)',
    steps: [
      { slug: 'lib-000', callNumber: 'LIB-000', focusZh: '圖書館總覽與視覺分館入口', focusEn: 'Grand Library Index & Vision Halls' },
      { slug: 'lib-001', callNumber: 'LIB-001', focusZh: '深度學習第一性原理基礎', focusEn: 'Deep Learning First Principles' },
      { slug: 'lib-101', callNumber: 'LIB-101', focusZh: '線性代數與高維空間幾何變換本質', focusEn: 'Linear Algebra & High-Dimensional Geometry' },
      { slug: 'lib-203', callNumber: 'LIB-203', focusZh: '計算機體系結構與記憶體階層硬體協同', focusEn: 'Computer Architecture & Memory Hierarchies' },
      { slug: 'lib-401', callNumber: 'LIB-401', focusZh: '全連結網路空間極限與卷積神經網路歸納偏置', focusEn: 'DNN Spatial Limits & CNN Inductive Bias' },
      { slug: 'lib-501', callNumber: 'LIB-501', focusZh: 'CV 前處理規範與影像質心定位演算法', focusEn: 'CV Preprocessing & Center of Mass Alignment' },
      { slug: 'lib-502', callNumber: 'LIB-502', focusZh: '相機射影幾何、對極幾何與運動結構恢復 (SfM)', focusEn: 'Camera Projective Geometry & Structure-from-Motion' },
      { slug: 'lib-504', callNumber: 'LIB-504', focusZh: 'NeRF 到 3D 高斯潑濺 (3DGS) 理論與光柵化', focusEn: '3D Gaussian Splatting Theory & Rasterization' },
      { slug: 'lib-505', callNumber: 'LIB-505', focusZh: '開放詞彙 3D 高斯潑濺與語意場景圖檢索', focusEn: 'Open-Vocabulary 3DGS & Semantic Scene Graphs' },
      { slug: 'lib-506', callNumber: 'LIB-506', focusZh: 'LLM 驅動之 3DGS 空間問答、階層場景圖與具身導航', focusEn: 'LLM-Grounded 3D Scene QA & Embodied Navigation' },
    ]
  },
  {
    id: 'intelligent-agents-and-systems',
    titleZh: '智慧代理人認知架構、推論協議與神經決策',
    titleEn: 'Intelligent Agents, Cognitive Protocols & Neural Decisions',
    descriptionZh: '基於嚴格直接相依拓樸（7 節點 / 6 條有向邊）：自第一性原理與 GPU 體系結構，經 Transformer 注意力引擎，直達現代 LLM Agent 認知推論架構與 S1 雙進程神經代理人。',
    descriptionEn: 'Strictly direct DAG path (7 nodes / 6 directed edges): from first principles & GPU architecture through Transformer attention to LLM Agent protocols & S1 dual-process agents.',
    badge: '系統與代理 (Systems & Agents)',
    steps: [
      { slug: 'lib-000', callNumber: 'LIB-000', focusZh: '圖書館總覽與系統導引', focusEn: 'Grand Library Navigator' },
      { slug: 'lib-001', callNumber: 'LIB-001', focusZh: '深度學習第一性原理先修精要', focusEn: 'Deep Learning First Principles' },
      { slug: 'lib-101', callNumber: 'LIB-101', focusZh: '線性代數與高維向量空間基石', focusEn: 'Linear Algebra & High-Dimensional Vectors' },
      { slug: 'lib-203', callNumber: 'LIB-203', focusZh: '計算機體系結構與深度學習硬體對齊', focusEn: 'Computer Architecture & Hardware-Aware Deep Learning' },
      { slug: 'lib-405', callNumber: 'LIB-405', focusZh: '注意力機制、Transformer 革命與上下文表徵', focusEn: 'Attention Mechanism & Context Representations' },
      { slug: 'lib-703', callNumber: 'LIB-703', focusZh: '現代大模型代理人 (LLM Agent) 認知架構與推論協議', focusEn: 'LLM Agent Cognitive Architecture & Protocols' },
      { slug: 'lib-704', callNumber: 'LIB-704', focusZh: '雙進程神經代理人：S1 非自迴歸型態決策引擎與反射模型', focusEn: 'Dual-Process Neural Agent S1-Jev & Reflex CUA-S1' },
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
