import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import katex from 'katex';
import { Marked } from 'marked';

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

export function renderArticleMarkdown(
  rawMarkdown: string,
  lang: 'zh' | 'en',
  base: string = '/library',
  sourceLabel: string = ''
): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];

  // Stage 1: Protect code blocks and inline code
  const codeBlocks: string[] = [];
  function saveCode(match: string): string {
    const idx = codeBlocks.length;
    codeBlocks.push(match);
    return `%%%CODEBLOCK_${idx}%%%`;
  }

  // Protect fenced code blocks (```...```)
  // Strip leading document title H1 (# Title) to guarantee exactly one H1 per page,
  // matching the reader header H1 and preventing duplicated title rendering.
  const contentWithoutLeadingH1 = rawMarkdown.replace(/^#\s+[^\r\n]+(?:\r?\n|$)/m, '');
  let processed = contentWithoutLeadingH1.replace(/```[\s\S]*?```/g, saveCode);
  // Protect inline code blocks (`...`)
  processed = processed.replace(/`[^`\n]+`/g, saveCode);

  // Stage 2: Protect & Pre-render LaTeX math
  // Use alphanumeric token identifiers without underscores to prevent markdown emphasis interference
  const mathTokens: string[] = [];
  const rawMathSources: string[] = [];
  function texToReadablePlain(tex: string): string {
    return tex
      .replace(/\\to\b/g, '→')
      .replace(/\\times\b/g, '×')
      .replace(/\\nabla\b/g, '∇')
      .replace(/\\eta\b/g, 'η')
      .replace(/\\epsilon\b/g, 'ε')
      .replace(/\\alpha\b/g, 'α')
      .replace(/\\beta\b/g, 'β')
      .replace(/\\theta\b/g, 'θ')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
      .replace(/\\(?:mathbb|mathcal|mathbf|mathrm|text|operatorname)\{([^}]+)\}/g, '$1')
      .replace(/\\(ln|log|exp|sin|cos)\b/g, '$1')
      .replace(/[{}]/g, '')
      .replace(/\\/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function saveMath(math: string, isBlock: boolean): string {
    const idx = mathTokens.length;
    const extractedCodes: string[] = [];
    // Separate any inline code tokens accidentally wrapped inside $...$ so KaTeX neither comments out %%% nor swallows them
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
      // 1. Verbatim-First: valid formulas must compile unmodified
      mathTokens.push(compileKatex(rawMath, isBlock, true));
      return `KATEXX${idx}X${suffix}`;
    } catch (verbatimError) {
      // 2. Permitted safe/audited recoveries when verbatim TeX fails KaTeX parsing:
      //    a) Escape unescaped '_' inside \text{...} (e.g. LIB-506 \text{[SAFETY_BOUND]})
      let candidate = rawMath.replace(/\\text\{([^}]+)\}/g, (_m, inner) => {
        return `\\text{${inner.replace(/(?<!\\)_/g, '\\_')}}`;
      });
      //    b) Exact audited source-typo exception for LIB-802 only (display-only fix; raw Markdown unchanged)
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

      // 3. Unknown parse errors: render visibly as KaTeX error span (.katex-error) without silent rewriting
      mathTokens.push(compileKatex(rawMath, isBlock, false));
      return `KATEXX${idx}X${suffix}`;
    }
  }

  // Display math $$ ... $$
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => saveMath(math, true));
  // Inline math $ ... $ (excluding escaped \$)
  processed = processed.replace(/(?<!\$)\$([^\$\n]+?)\$(?!\$)/g, (match, math) => saveMath(math, false));

  // Stage 3: Transform Obsidian WikiLinks [[target]] or [[target|label]]
  processed = processed.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, target, customLabel) => {
    const cleanTarget = target.trim();
    const label = customLabel ? customLabel.trim() : cleanTarget;

    const libMatch = cleanTarget.match(/LIB-(\d{3})/i);
    if (libMatch) {
      const targetSlug = `lib-${libMatch[1].toLowerCase()}`;
      const targetUrl = `${base}/${lang}/notes/${targetSlug}/`;
      return `<a class="wikilink-badge" href="${targetUrl}">${label}</a>`;
    }

    if (cleanTarget.startsWith('assets/') || cleanTarget.includes('.svg') || cleanTarget.includes('.png')) {
      const assetName = path.basename(cleanTarget);
      return `<a class="wikilink-asset" href="${base}/assets/${assetName}" target="_blank" rel="noopener">${label}</a>`;
    }

    return `<span class="wikilink-text">${label}</span>`;
  });

  // Stage 4: Transform Markdown image links
  processed = processed.replace(/!\[(.*?)\]\(((?:\.\.\/)*assets\/([^)]+))\)/g, (match, alt, fullPath, filename) => {
    return `![${alt}](${base}/assets/${filename})`;
  });

  // Transform standard Markdown links to notes
  processed = processed.replace(/\[([^\]]+)\]\(([^)]*LIB-(\d{3})[^)]*\.md)\)/gi, (match, text, url, num) => {
    const slug = `lib-${num.toLowerCase()}`;
    return `[${text}](${base}/${lang}/notes/${slug}/)`;
  });

  // Stage 5: Transform Evidence Tags & Rules
  processed = processed.replace(/\[(FACT|DERIVATION|LITERATURE_RESULT|EMPIRICAL_RESULT|HEURISTIC|DESIGN_DECISION|TARGET|SAFETY_BOUND|HYPOTHESIS|OPEN_QUESTION)\]/g, (match, tag) => {
    return `<span class="evidence-pill pill-${tag.toLowerCase()}">${tag}</span>`;
  });

  processed = processed.replace(/\[(RULE-\d{3}-\d{2})\]/g, (match, ruleId) => {
    return `<span class="rule-pill">${ruleId}</span>`;
  });

  // Stage 6: Restore code blocks before marked parses markdown
  processed = processed.replace(/%%%CODEBLOCK_(\d+)%%%/g, (match, idx) => {
    return codeBlocks[parseInt(idx, 10)] || match;
  });

  // Stage 7: Setup marked with CJK strong emphasis extension & custom heading renderer
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
          // Suppress duplicate H1 from markdown body; reader header provides the canonical H1
          return '';
        }
        const text = this.parser.parseInline(tokens);
        // Extract pure text for TOC and ID without HTML tags or double-escaped entities
        const plainText = text
          .replace(/KATEXX(\d+)X/g, (_m, i) => rawMathSources[parseInt(i, 10)] || '')
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, ' ')
          .trim();
        const slugId = plainText
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5\-_]+/g, '-')
          .replace(/^-+|-+$/g, '') || `section-${toc.length + 1}`;
        toc.push({ id: slugId, text: plainText, level: depth });
        return `<h${depth} id="${slugId}">${text}</h${depth}>\n`;
      }
    }
  });

  let html = markedInstance.parse(processed, {
    gfm: true,
    breaks: false,
  }) as string;

  // Stage 8: Reinsert KaTeX pre-rendered HTML tokens
  html = html.replace(/KATEXX(\d+)X/g, (match, idx) => {
    return mathTokens[parseInt(idx, 10)] || match;
  });

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
      const files = fs.readdirSync(zhDir).filter(f => f.endsWith('.md') && !f.startsWith('README'));
      for (const file of files) {
        const fullPath = path.join(zhDir, file);
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const { data: frontmatter, content: rawMarkdown } = matter(fileContent);

        const callNumber = frontmatter.call_number || extractCallNumber(file);
        if (!callNumber) continue;

        const slug = callNumber.toLowerCase();
        const { html: htmlContent, toc } = renderArticleMarkdown(rawMarkdown, 'zh', '/library', `${callNumber} (zh)`);
        const rules = parseRules(rawMarkdown);

        // Parse prerequisites and successors
        const prereqsRaw = Array.isArray(frontmatter.prerequisites) ? frontmatter.prerequisites : [];
        const succsRaw = Array.isArray(frontmatter.successors) ? frontmatter.successors : [];

        const prereqIds = prereqsRaw.map((p: string) => {
          const m = p.match(/LIB-\d{3}/i);
          return m ? m[0].toLowerCase() : '';
        }).filter(Boolean);

        const succIds = succsRaw.map((s: string) => {
          const m = s.match(/LIB-\d{3}/i);
          return m ? m[0].toLowerCase() : '';
        }).filter(Boolean);

        // Derive executive brief from raw Markdown intro
        const cleanIntro = rawMarkdown
          .split('\n')
          .filter(l => !l.startsWith('#') && !l.startsWith('>') && !l.startsWith('---') && !l.startsWith('- **') && l.trim().length > 10)
          .slice(0, 2)
          .join(' ')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/\$([^\$]+)\$/g, '$1')
          .slice(0, 160) + '...';

        const excerpt = frontmatter.summary || frontmatter.abstract || cleanIntro;

        zhMap.set(slug, {
          callNumber,
          slug,
          lang: 'zh',
          title: frontmatter.title || file.replace(/\.md$/, ''),
          status: frontmatter.status || 'source-verified',
          invariantsCount: frontmatter.invariants_count || rules.length,
          module: frontmatter.module || hall.nameZh,
          category: frontmatter.category || '',
          audience: Array.isArray(frontmatter.audience) ? frontmatter.audience : [],
          mathFoundations: Array.isArray(frontmatter.math_foundations) ? frontmatter.math_foundations : [],
          hardwareTarget: Array.isArray(frontmatter.hardware_target) ? frontmatter.hardware_target : [],
          created: formatDate(frontmatter.created),
          author: frontmatter.author || 'Luke',
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          prerequisitesRaw: prereqsRaw,
          successorsRaw: succsRaw,
          prerequisiteIds: prereqIds,
          successorIds: succIds,
          hall,
          filePath: fullPath,
          rawMarkdown,
          htmlContent,
          toc,
          rules,
          excerpt,
          executiveBrief: excerpt
        });
      }
    }

    // Read EN articles
    if (fs.existsSync(enDir)) {
      const files = fs.readdirSync(enDir).filter(f => f.endsWith('.md') && !f.startsWith('README'));
      for (const file of files) {
        const fullPath = path.join(enDir, file);
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const { data: frontmatter, content: rawMarkdown } = matter(fileContent);

        const callNumber = frontmatter.call_number || extractCallNumber(file);
        if (!callNumber) continue;

        const slug = callNumber.toLowerCase();
        const { html: htmlContent, toc } = renderArticleMarkdown(rawMarkdown, 'en', '/library', `${callNumber} (en)`);
        const rules = parseRules(rawMarkdown);

        const prereqsRaw = Array.isArray(frontmatter.prerequisites) ? frontmatter.prerequisites : [];
        const succsRaw = Array.isArray(frontmatter.successors) ? frontmatter.successors : [];

        const prereqIds = prereqsRaw.map((p: string) => {
          const m = p.match(/LIB-\d{3}/i);
          return m ? m[0].toLowerCase() : '';
        }).filter(Boolean);

        const succIds = succsRaw.map((s: string) => {
          const m = s.match(/LIB-\d{3}/i);
          return m ? m[0].toLowerCase() : '';
        }).filter(Boolean);

        const cleanIntro = rawMarkdown
          .split('\n')
          .filter(l => !l.startsWith('#') && !l.startsWith('>') && !l.startsWith('---') && !l.startsWith('- **') && l.trim().length > 10)
          .slice(0, 2)
          .join(' ')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/\$([^\$]+)\$/g, '$1')
          .slice(0, 160) + '...';

        const excerpt = frontmatter.summary || frontmatter.abstract || cleanIntro;

        enMap.set(slug, {
          callNumber,
          slug,
          lang: 'en',
          title: frontmatter.title || file.replace(/\.md$/, ''),
          status: frontmatter.status || 'source-verified',
          invariantsCount: frontmatter.invariants_count || rules.length,
          module: frontmatter.module || hall.nameEn,
          category: frontmatter.category || '',
          audience: Array.isArray(frontmatter.audience) ? frontmatter.audience : [],
          mathFoundations: Array.isArray(frontmatter.math_foundations) ? frontmatter.math_foundations : [],
          hardwareTarget: Array.isArray(frontmatter.hardware_target) ? frontmatter.hardware_target : [],
          created: formatDate(frontmatter.created),
          author: frontmatter.author || 'Luke',
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          prerequisitesRaw: prereqsRaw,
          successorsRaw: succsRaw,
          prerequisiteIds: prereqIds,
          successorIds: succIds,
          hall,
          filePath: fullPath,
          rawMarkdown,
          htmlContent,
          toc,
          rules,
          excerpt,
          executiveBrief: excerpt
        });
      }
    }
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
