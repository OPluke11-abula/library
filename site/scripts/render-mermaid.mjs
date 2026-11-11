import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_DIR = path.resolve(__dirname, '..');
const ROOT_DIR = path.resolve(SITE_DIR, '..');
const CACHE_DIR = path.join(SITE_DIR, 'src', 'data', 'mermaid-cache');
const MERMAID_BUNDLE_PATH = path.join(SITE_DIR, 'node_modules', 'mermaid', 'dist', 'mermaid.min.js');

const MERMAID_THEME_CONFIG = {
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 20,
    nodeSpacing: 40,
    rankSpacing: 52,
    useMaxWidth: false,
  },
  themeCSS: `
    .cluster-label foreignObject { overflow: visible; }
    .cluster-label .nodeLabel {
      background-color: #0f172a;
      color: #f8fafc !important;
      padding: 2px 10px;
      border-radius: 4px;
      font-weight: 600;
    }
  `,
  themeVariables: {
    darkMode: true,
    background: '#0d1322',
    primaryColor: '#1a2234',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#38bdf8',
    secondaryColor: '#121826',
    secondaryTextColor: '#e2e8f0',
    secondaryBorderColor: '#2e3d55',
    tertiaryColor: '#161e30',
    tertiaryTextColor: '#f8fafc',
    tertiaryBorderColor: '#d4af37',
    lineColor: '#7dd3fc',
    textColor: '#f8fafc',
    mainBkg: '#1a2234',
    nodeBorder: '#38bdf8',
    clusterBkg: '#111827',
    clusterBorder: '#334155',
    titleColor: '#f8fafc',
    edgeLabelBackground: '#0f172a',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Microsoft JhengHei", sans-serif',
    fontSize: '14px',
  },
};

export function hashMermaidSource(source) {
  return crypto.createHash('sha256').update(source.replace(/\r\n?/g, '\n').trim()).digest('hex').slice(0, 16);
}

function collectMermaidBlocks() {
  const blocks = new Map();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (entry.name === 'site' || entry.name === '.git' || entry.name === 'node_modules') continue;
        walk(path.join(dir, entry.name));
      } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name.includes('LIB-')) {
        const filePath = path.join(dir, entry.name);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const regex = /```mermaid\s*\r?\n([\s\S]*?)```/gi;
        let match;
        while ((match = regex.exec(raw)) !== null) {
          const source = match[1].replace(/\r\n?/g, '\n').trim();
          const hash = hashMermaidSource(source);
          if (!blocks.has(hash)) {
            blocks.set(hash, {
              hash,
              source,
              file: path.relative(ROOT_DIR, filePath).replace(/\\/g, '/'),
            });
          }
        }
      }
    }
  };
  walk(ROOT_DIR);
  return Array.from(blocks.values());
}

async function main() {
  if (!fs.existsSync(MERMAID_BUNDLE_PATH)) {
    throw new Error(`Local Mermaid bundle not found at ${MERMAID_BUNDLE_PATH}. Run 'npm install mermaid' in site/.`);
  }

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const blocks = collectMermaidBlocks();
  console.log(`[render-mermaid] Found ${blocks.length} unique Mermaid diagram(s) across corpus.`);

  const mermaidScript = fs.readFileSync(MERMAID_BUNDLE_PATH, 'utf-8');
  const browser = await chromium.launch({ headless: true });
  const manifest = {};

  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
    await page.setContent(`
      <!doctype html>
      <html>
        <head><meta charset="utf-8" /></head>
        <body style="background:#0d1322;color:#f8fafc;font-family:system-ui,-apple-system,'Segoe UI','PingFang TC','Microsoft JhengHei',sans-serif;">
          <div id="host"></div>
          <script>${mermaidScript}</script>
        </body>
      </html>
    `);

    await page.evaluate((cfg) => {
      window.mermaid.initialize(cfg);
    }, MERMAID_THEME_CONFIG);

    for (const block of blocks) {
      const svgId = `mermaid-graph-${block.hash}`;
      const result = await page.evaluate(
        async ({ id, src }) => {
          try {
            const { svg } = await window.mermaid.render(id, src);
            const host = document.getElementById('host');
            host.innerHTML = svg;
            const svgEl = host.querySelector('svg');
            const viewBox = svgEl?.getAttribute('viewBox') || '';
            const rect = svgEl ? svgEl.getBoundingClientRect() : { width: 0, height: 0 };
            return { ok: true, svg, viewBox, width: Math.ceil(rect.width), height: Math.ceil(rect.height) };
          } catch (err) {
            return { ok: false, error: String(err) };
          }
        },
        { id: svgId, src: block.source }
      );

      if (!result.ok) {
        throw new Error(`Mermaid render failed for ${block.file} (${block.hash}): ${result.error}`);
      }

      // Normalize viewBox & dimensions cleanly onto <svg>
      let cleanSvg = result.svg;
      let width = result.width;
      let height = result.height;
      const vbMatch = result.viewBox.match(/[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/);
      if (vbMatch) {
        width = Math.ceil(parseFloat(vbMatch[1]));
        height = Math.ceil(parseFloat(vbMatch[2]));
      }
      cleanSvg = cleanSvg.replace(/<svg\b([^>]*)>/i, (_full, attrs) => {
        const stripped = attrs
          .replace(/\s(?:style|width|height)=["'][^"']*["']/gi, '')
          .trim();
        return `<svg ${stripped} width="${width}" height="${height}">`;
      });

      const outSvgPath = path.join(CACHE_DIR, `${block.hash}.svg`);
      fs.writeFileSync(outSvgPath, cleanSvg, 'utf-8');
      manifest[block.hash] = {
        file: block.file,
        width,
        height,
        viewBox: result.viewBox,
        firstLine: block.source.split('\n')[0],
      };
      console.log(`  Rendered ${block.file} -> ${block.hash}.svg (${width}x${height})`);
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(CACHE_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  console.log(`[render-mermaid] Cache updated in ${path.relative(ROOT_DIR, CACHE_DIR)}`);
}

main().catch((err) => {
  console.error('[render-mermaid] Fatal error:', err);
  process.exit(1);
});
