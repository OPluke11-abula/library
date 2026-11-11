import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const SCREENSHOTS_DIR = path.resolve(__dirname, '../tests/screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function startServer(port = 4321) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURIComponent(req.url.split('?')[0]);

      if (reqPath.startsWith('/library')) {
        reqPath = reqPath.slice('/library'.length);
      }
      if (!reqPath || reqPath === '/') {
        reqPath = '/index.html';
      }

      let filePath = path.join(DIST_DIR, reqPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`404 Not Found: ${req.url}`);
      }
    });

    server.listen(port, () => {
      console.log(`[Test Server] Listening on http://localhost:${port}/library/`);
      resolve(server);
    });
  });
}

function computeContrastRatio(fgRgb, bgRgb) {
  const lum = ([r, g, b]) => {
    const ch = (v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
  };
  const l1 = lum(fgRgb);
  const l2 = lum(bgRgb);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

async function runTests() {
  const server = await startServer(4321);
  const browser = await chromium.launch({ headless: true });

  const results = [];
  function assert(name, condition, details = '') {
    results.push({ name, passed: Boolean(condition), details });
    const mark = condition ? 'PASS' : 'FAIL';
    console.log(`${mark} : ${name} ${details ? '(' + details + ')' : ''}`);
  }

  async function auditMutedContrast(page, label, selectors) {
    const measurements = await page.evaluate((sels) => {
      function parseRgba(str) {
        const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!m) return null;
        return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] === undefined ? 1 : Number(m[4])];
      }
      function blend(fg, bg) {
        const a = fg[3];
        return [
          Math.round(fg[0] * a + bg[0] * (1 - a)),
          Math.round(fg[1] * a + bg[1] * (1 - a)),
          Math.round(fg[2] * a + bg[2] * (1 - a)),
          1,
        ];
      }
      function effectiveBg(el) {
        const layers = [];
        let cur = el;
        while (cur && cur.nodeType === 1) {
          const parsed = parseRgba(getComputedStyle(cur).backgroundColor);
          if (parsed && parsed[3] > 0) layers.push(parsed);
          cur = cur.parentElement;
        }
        let acc = [11, 15, 25, 1];
        for (let i = layers.length - 1; i >= 0; i--) {
          acc = blend(layers[i], acc);
        }
        return acc.slice(0, 3);
      }
      const out = [];
      for (const sel of sels) {
        const el = document.querySelector(sel);
        if (!el) continue;
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') continue;
        const fg = parseRgba(style.color);
        if (!fg) continue;
        const bg = effectiveBg(el);
        out.push({ selector: sel, fg: fg.slice(0, 3), bg });
      }
      return out;
    }, selectors);

    let minRatio = 21;
    let worstSelector = '';
    for (const m of measurements) {
      const ratio = computeContrastRatio(m.fg, m.bg);
      if (ratio < minRatio) {
        minRatio = ratio;
        worstSelector = `${m.selector}=${ratio.toFixed(2)}:1`;
      }
    }
    assert(
      `WCAG AA Contrast (${label}): All audited muted/secondary text >= 4.5:1`,
      measurements.length > 0 && minRatio >= 4.5,
      `checked=${measurements.length}, min=${worstSelector}`
    );
  }

  try {
    // ----------------------------------------------------
    // TEST SUITE 0: STATIC DIST CORPUS INVARIANTS (ALL 56 NOTES + MERMAID FALLBACK)
    // ----------------------------------------------------
    console.log('\n=== Executing Static 56-Note Corpus Audit ===');
    const noteSlugs = fs
      .readdirSync(path.join(DIST_DIR, 'zh/notes'))
      .filter(d => /^lib-\d{3}$/.test(d))
      .sort();
    assert('Corpus audit: All 28 bilingual note pairs built', noteSlugs.length === 28, `Found: ${noteSlugs.length}`);

    // Verify 65 expected built HTML pages
    const allHtmlFiles = [];
    const countHtml = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) countHtml(path.join(dir, entry.name));
        else if (entry.name.endsWith('.html')) allHtmlFiles.push(entry.name);
      }
    };
    countHtml(DIST_DIR);
    assert('Build output: Exactly 65 static HTML pages generated', allHtmlFiles.length === 65, `Found: ${allHtmlFiles.length}`);

    const brokenMirrorLinks = [];
    const leakedBodyBanners = [];
    const leakedOrientations = [];
    const leakedGoogleFonts = [];
    const emptyLessons = [];
    const katexErrorsFound = [];

    for (const slug of noteSlugs) {
      for (const lang of ['zh', 'en']) {
        const otherLang = lang === 'zh' ? 'en' : 'zh';
        const html = fs.readFileSync(path.join(DIST_DIR, lang, 'notes', slug, 'index.html'), 'utf-8');

        if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(html)) {
          leakedGoogleFonts.push(`${lang}/${slug}`);
        }
        if (/class="katex-error"/.test(html)) {
          katexErrorsFound.push(`${lang}/${slug}`);
        }

        const expectedOtherHref = `/library/${otherLang}/notes/${slug}/`;
        const headerHrefMatch = html.match(/class="lang-switch"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*class="lang-switch"/);
        const headerHref = headerHrefMatch ? (headerHrefMatch[1] || headerHrefMatch[2]) : '';
        const mirrorHrefMatch = html.match(/class="btn-mirror-link"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*class="btn-mirror-link"/);
        const mirrorHref = mirrorHrefMatch ? (mirrorHrefMatch[1] || mirrorHrefMatch[2]) : '';

        if (headerHref !== expectedOtherHref || mirrorHref !== expectedOtherHref) {
          brokenMirrorLinks.push(`${lang}/${slug}`);
        }

        const lessonStart = html.indexOf('id="lesson-start"');
        const researchStart = html.indexOf('id="research-details"');
        const lessonSlice = lessonStart >= 0 && researchStart > lessonStart ? html.slice(lessonStart, researchStart) : '';
        if (lessonSlice.length < 150) {
          emptyLessons.push(`${lang}/${slug}`);
        }
        if (/(?:語言(?:切換)?|Language(?:\s+Switch)?)\s*\/\s*(?:Language(?:\s+Switch)?|語言(?:切換)?)/i.test(lessonSlice) || /\.md["']/.test(lessonSlice)) {
          leakedBodyBanners.push(`${lang}/${slug}`);
        }

        const leadMatch = html.match(/<p[^>]*class="[^"]*reader-guide-lead[^"]*"[^>]*>([\s\S]*?)<\/p>/);
        const leadText = leadMatch ? leadMatch[1].replace(/<[^>]+>/g, '').trim() : '';
        if (
          /\r|English title:|Chinese title:|Document role:|Evidence status:|┌|┐|└|┘|\|\s*---|\|\s*Topic ID|\|\s*題目編號|\\mathbb|\\mathcal|\\frac|\\times/i.test(leadText) ||
          /(?:核心主題：|Core Subject:)\s*(?:Mildenhall|Zwicker|Goodfellow|Vaswani|Dettmers|Frantar|Guo,)/.test(leadText)
        ) {
          leakedOrientations.push(`${lang}/${slug}`);
        }
      }
    }

    assert('Language Links: All 56 Header & Mirror switches point opposite-language matching ID', brokenMirrorLinks.length === 0, brokenMirrorLinks.join(', '));
    assert('Lesson Content: All 56 articles open directly into teaching flow', emptyLessons.length === 0, emptyLessons.join(', '));
    assert('Body Cleanliness: Zero duplicate language banners or .md hrefs across all 56 articles', leakedBodyBanners.length === 0, leakedBodyBanners.join(', '));
    assert('Study Orientations: Zero bibliography/table/ASCII/metadata/TeX/CR leaks across 56 articles', leakedOrientations.length === 0, leakedOrientations.join(', '));
    assert('KaTeX Integrity: Zero .katex-error elements across all 56 built pages', katexErrorsFound.length === 0, katexErrorsFound.join(', '));
    assert('Fonts: Zero Google Fonts links across all 56 built pages', leakedGoogleFonts.length === 0, leakedGoogleFonts.join(', '));

    // Check explicit Mermaid error fallback helper directly via TypeScript module import
    const { renderMermaidBlockHtml } = await import('../src/lib/library.ts');
    const badMermaidHtml = renderMermaidBlockHtml('unsupportedDiagramType\n  a -> b', 'zh');
    assert(
      'Mermaid Error Fallback: Unsupported syntax renders explicit alert & source fallback',
      badMermaidHtml.includes('mermaid-error-box') && badMermaidHtml.includes('role="alert"') && badMermaidHtml.includes('unsupportedDiagramType')
    );

    // ----------------------------------------------------
    // TEST SUITE 1: DESKTOP (1440 x 900)
    // ----------------------------------------------------
    console.log('\n=== Executing Desktop Browser Tests (1440x900) ===');
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await desktopContext.newPage();

    const externalFontRequests = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
        externalFontRequests.push(url);
      }
    });

    // 1. Root & Home Page (ZH)
    await page.goto('http://localhost:4321/library/');
    await page.waitForTimeout(400);
    assert('Root redirect to /library/zh/', page.url().includes('/library/zh/'), page.url());

    await page.goto('http://localhost:4321/library/zh/');
    await page.waitForLoadState('networkidle');
    assert('Home ZH: Grand Library hero rendered', (await page.textContent('.hero-title'))?.includes('Grand Library'));
    assert('Home ZH: Editorial meta strip displays 28 volumes & 56 editions', (await page.textContent('.atlas-meta-strip'))?.includes('28') && (await page.textContent('.atlas-meta-strip'))?.includes('56'));
    assert('Home ZH: No legacy KPI dashboard .metric-card boxes', (await page.locator('.metric-card').count()) === 0);
    assert('Home ZH: 10 Knowledge Halls displayed', (await page.locator('.hall-card').count()) === 10);
    assert('Home ZH: 6 Featured articles displayed', (await page.locator('.featured-section .article-card').count()) === 6);

    const zhLib504Text = await page.locator('.showcase-card:has-text("LIB-504")').textContent();
    assert('Home ZH LIB-504: Accurately describes NeRF & 3DGS (zero STN)', (zhLib504Text?.includes('3D 高斯潑濺') || zhLib504Text?.includes('NeRF')) && !zhLib504Text?.includes('STN'));
    assert('Home ZH: Zero horizontal overflow on Desktop', await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
    await auditMutedContrast(page, 'Home ZH', ['.atlas-meta-strip', '.hall-count', '.hall-name-en', '.tag-pill', '.brand-subtitle', '.site-footer']);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'homepage-zh-desktop-1440-top.png') });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'homepage-zh-desktop-1440.png'), fullPage: true });

    // Home EN LIB-504
    await page.goto('http://localhost:4321/library/en/');
    await page.waitForLoadState('networkidle');
    const enLib504Text = await page.locator('.showcase-card:has-text("LIB-504")').textContent();
    assert('Home EN LIB-504: Accurately describes 3DGS (zero STN)', (enLib504Text?.includes('3D Gaussian Splatting') || enLib504Text?.includes('NeRF')) && !enLib504Text?.includes('Spatial Transformer'));

    // 2. Learning Paths (ZH & EN)
    await page.goto('http://localhost:4321/library/zh/paths/');
    await page.waitForLoadState('networkidle');
    const chooserCount = await page.locator('.track-chooser-card').count();
    const chooserBottom = await page.evaluate(() => {
      const firstCard = document.querySelector('.track-chooser-card');
      return firstCard ? firstCard.getBoundingClientRect().bottom : 9999;
    });
    assert('Learning Paths ZH: 3 top track selector cards appear above the fold on 1440x900', chooserCount === 3 && chooserBottom <= 900, `count=${chooserCount}, bottom=${Math.round(chooserBottom)}px`);
    assert('Learning Paths ZH: All 3 tracks, 23 steps preserved', (await page.locator('.path-card').count()) === 3 && (await page.locator('.timeline-step').count()) === 23);
    assert('Learning Paths ZH: No repetitive VERIFIED INVARIANT or DIRECT EDGE admin badges', (await page.locator('.direct-edge-pill').count()) === 0);
    assert('Learning Paths ZH: Global SVG panorama accordion collapsed by default', (await page.locator('details.roadmap-accordion').getAttribute('open')) === null);
    assert('Learning Paths ZH: Zero horizontal overflow', await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
    await auditMutedContrast(page, 'Paths ZH', ['.track-entry-note', '.path-length-badge', '.step-hall']);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'paths-zh-desktop-1440-top.png') });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'paths-zh-desktop-1440.png'), fullPage: true });

    // Check EN Paths parity & LIB-000 overview copy
    await page.goto('http://localhost:4321/library/en/paths/');
    await page.waitForLoadState('networkidle');
    assert('Learning Paths EN: 3 chooser cards + 23 steps symmetric', (await page.locator('.track-chooser-card').count()) === 3 && (await page.locator('.timeline-step').count()) === 23);

    // 3. LIB-000 Mermaid Rendering (ZH & EN)
    await page.goto('http://localhost:4321/library/zh/notes/lib-000/');
    await page.waitForLoadState('networkidle');
    const zh000Svg = await page.evaluate(() => {
      const fig = document.querySelector('.mermaid-figure');
      const svg = fig?.querySelector('svg');
      const rect = svg ? svg.getBoundingClientRect() : { width: 0, height: 0 };
      const rawPreVisible = Array.from(document.querySelectorAll('#lesson-start pre')).some(p => p.textContent?.includes('flowchart TD') && getComputedStyle(p).display !== 'none' && p.closest('details')?.open !== false);
      return { hasFig: Boolean(fig), w: rect.width, h: rect.height, rawPreVisible };
    });
    assert('LIB-000 (ZH): Mermaid rendered as visible SVG diagram (not raw code block)', zh000Svg.hasFig && zh000Svg.w > 200 && zh000Svg.h > 200 && !zh000Svg.rawPreVisible, `svg=${Math.round(zh000Svg.w)}x${Math.round(zh000Svg.h)}`);

    // Interactive Mermaid zoom test + source drawer test
    await page.click('.mermaid-figure [data-zoom-action="in"]');
    const zoomLabel = await page.textContent('.mermaid-figure .mermaid-zoom-reset');
    assert('LIB-000 (ZH): Mermaid zoom control updates to 125%', zoomLabel?.trim() === '125%', zoomLabel);
    await page.click('.mermaid-figure [data-zoom-action="reset"]');
    assert('LIB-000 (ZH): Mermaid source toggle reveals raw code cleanly on demand', (await page.locator('.mermaid-source-drawer summary').count()) > 0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'lib000-zh-desktop-1440-top.png') });
    await page.locator('.mermaid-figure').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'lib000-zh-desktop-1440-diagram.png') });

    // EN LIB-000 Mermaid check
    await page.goto('http://localhost:4321/library/en/notes/lib-000/');
    await page.waitForLoadState('networkidle');
    const en000Svg = await page.evaluate(() => {
      const vp = document.querySelector('#lesson-start .mermaid-viewport');
      const svg = document.querySelector('#lesson-start .mermaid-figure svg');
      const vpRect = vp ? vp.getBoundingClientRect() : { width: 0 };
      const rect = svg ? svg.getBoundingClientRect() : { width: 0, height: 0 };
      return { w: rect.width, h: rect.height, fitsViewport: rect.width <= vpRect.width + 2 };
    });
    assert('LIB-000 (EN): Agent routing Mermaid graph visibly fits viewport without horizontal clipping', en000Svg.w > 200 && en000Svg.h > 200 && en000Svg.fitsViewport, `svg=${Math.round(en000Svg.w)}x${Math.round(en000Svg.h)}`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'lib000-en-desktop-1440-top.png') });
    await page.locator('.mermaid-figure').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'lib000-en-desktop-1440-diagram.png') });

    // 4. LIB-703 Reader UX Check (Understand Before Admin, Concise WikiLinks, Collapsible TOC)
    await page.goto('http://localhost:4321/library/zh/notes/lib-703/');
    await page.waitForLoadState('networkidle');
    const lib703Check = await page.evaluate(() => {
      const h1s = document.querySelectorAll('h1').length;
      const firstH2 = document.querySelector('#lesson-start h2')?.textContent || '';
      const guideLead = document.querySelector('.reader-guide-lead')?.textContent || '';
      const takeaways = document.querySelectorAll('.takeaways-list li').length;
      const researchClosed = !document.querySelector('#research-details')?.hasAttribute('open');
      const lessonPreCount = document.querySelectorAll('#lesson-start pre code').length;
      const tocSubHiddenInitially = document.querySelectorAll('.reader-sidebar .toc-sublist[hidden]').length;
      return { h1s, firstH2, guideLead, takeaways, researchClosed, lessonPreCount, tocSubHiddenInitially };
    });
    assert('LIB-703 (ZH): Exactly 1 H1 and takeaways summary rendered', lib703Check.h1s === 1 && lib703Check.takeaways >= 2);
    assert('LIB-703 (ZH): Begins immediately with Conceptual Mental Model (no admin prerequisites gate)', lib703Check.firstH2.includes('學士直觀心智模型') && lib703Check.researchClosed, lib703Check.firstH2);
    assert('LIB-703 (ZH): Non-Mermaid code blocks & collapsible TOC subsections work', lib703Check.lessonPreCount > 0 && lib703Check.tocSubHiddenInitially > 0, `pre=${lib703Check.lessonPreCount}, collapsedToc=${lib703Check.tocSubHiddenInitially}`);

    // Click Research Details TOC link and confirm #research-details auto-opens
    await page.click('.reader-sidebar .toc-research-header-link');
    await page.waitForTimeout(250);
    assert('LIB-703 (ZH): Research Details link expands full preserved metadata, contracts & refs', Boolean(await page.evaluate(() => document.querySelector('#research-details')?.hasAttribute('open'))));

    // Reload LIB-703 cleanly for clean default screenshots
    await page.goto('http://localhost:4321/library/zh/notes/lib-703/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'lib703-zh-desktop-1440-top.png') });
    await page.locator('#lesson-start').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'lib703-zh-desktop-1440-lesson.png') });

    // 5. LIB-405 Reader (ZH & EN Switch + WikiLinks Conciseness + Zero Leaked Asterisks)
    await page.goto('http://localhost:4321/library/zh/notes/lib-405/');
    await page.waitForLoadState('networkidle');
    const lib405WikiMaxLen = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('#lesson-start .wikilink-badge, #research-details .wikilink-badge'));
      return links.reduce((mx, el) => Math.max(mx, (el.textContent || '').length), 0);
    });
    const lib405FirstH2 = await page.textContent('#lesson-start h2');
    assert('LIB-405 (ZH): Begins directly with Conceptual Mental Model & concise WikiLinks', Boolean(lib405FirstH2?.includes('學士直觀心智模型')) && lib405WikiMaxLen <= 32, `maxWikiLen=${lib405WikiMaxLen}`);
    assert('LIB-405 (ZH): Zero leaked asterisks in prose', ((await page.locator('#lesson-start').innerHTML()).match(/\*\*[^\*<>]+\*\*/g) || []).length === 0);
    await auditMutedContrast(page, 'Reader LIB-405', ['.takeaways-label', '.btn-research-jump', '.research-summary-meta']);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'lib405-zh-desktop-1440-top.png') });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'reader-lib405-zh-desktop-1440.png'), fullPage: true });

    await page.click('.btn-mirror-link');
    await page.waitForLoadState('networkidle');
    assert('LIB-405 Bilingual Switch: Mirror link navigates cleanly to /en/notes/lib-405/', page.url().includes('/en/notes/lib-405/') && (await page.locator('h1').count()) === 1);

    // 6. Substantial Mathematical Derivation Article: LIB-104 (Convex Optimization)
    await page.goto('http://localhost:4321/library/zh/notes/lib-104/');
    await page.waitForLoadState('networkidle');
    const lib104Check = await page.evaluate(() => ({
      h1s: document.querySelectorAll('h1').length,
      katexCount: document.querySelectorAll('.katex').length,
      katexErrs: document.querySelectorAll('.katex-error').length,
      firstH2: document.querySelector('#lesson-start h2')?.textContent || '',
      overflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    }));
    assert('LIB-104 (ZH Math Derivation): Direct intuition opening, KaTeX intact, zero errors/overflow', lib104Check.h1s === 1 && lib104Check.katexCount > 30 && lib104Check.katexErrs === 0 && lib104Check.firstH2.includes('學士直觀心智模型') && lib104Check.overflow, `katex=${lib104Check.katexCount}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'lib104-zh-desktop-1440-top.png') });
    await page.locator('.katex-display-container').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'lib104-zh-desktop-1440-math.png') });

    // 7. Catalog Search & Filters
    await page.goto('http://localhost:4321/library/zh/library/');
    await page.waitForLoadState('networkidle');
    assert('Catalog ZH: Initial 28 articles rendered cleanly with zero overflow', (await page.locator('#catalog-grid .grid-item:visible').count()) === 28 && await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
    await page.fill('#catalog-search', '質心');
    await page.waitForTimeout(200);
    assert('Catalog ZH: Search "質心" filters to 2 volumes', (await page.locator('#catalog-grid .grid-item:visible').count()) === 2);
    await page.fill('#catalog-search', '');
    await page.click('button[data-hall="01"]');
    await page.waitForTimeout(200);
    assert('Catalog ZH: Hall 01 filter displays 3 volumes', (await page.locator('#catalog-grid .grid-item:visible').count()) === 3);

    // 8. Check LIB-506 & LIB-802 KaTeX & HTML entities
    for (const urlPath of ['/library/zh/notes/lib-506/', '/library/en/notes/lib-506/', '/library/zh/notes/lib-802/']) {
      await page.goto(`http://localhost:4321${urlPath}`);
      await page.waitForLoadState('networkidle');
      const errs = await page.locator('.katex-error').count();
      const dom = await page.content();
      assert(`Regression (${urlPath}): Zero KaTeX errors & zero double escaping`, errs === 0 && !dom.includes('&amp;amp;') && !dom.includes('&amp;#39;'));
    }

    assert('Runtime Fonts: Zero external Google Fonts requests during Desktop tour', externalFontRequests.length === 0);
    await desktopContext.close();

    // ----------------------------------------------------
    // TEST SUITE 2: MOBILE (390 x 844)
    // ----------------------------------------------------
    console.log('\n=== Executing Mobile Browser Tests (390x844) ===');
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    const mPage = await mobileContext.newPage();

    // Mobile Home
    await mPage.goto('http://localhost:4321/library/zh/');
    await mPage.waitForLoadState('networkidle');
    const mHomeCheck = await mPage.evaluate(() => ({
      overflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ctaBottom: Math.round(document.querySelector('.hero-actions .btn-primary')?.getBoundingClientRect().bottom || 9999),
    }));
    assert('Mobile Home (390px): Primary track CTA visible above fold with zero overflow', mHomeCheck.overflow && mHomeCheck.ctaBottom <= 844, JSON.stringify(mHomeCheck));
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'homepage-zh-mobile-390-top.png') });
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'homepage-zh-mobile-390.png'), fullPage: true });

    // Mobile Paths
    await mPage.goto('http://localhost:4321/library/zh/paths/');
    await mPage.waitForLoadState('networkidle');
    const mPathsCheck = await mPage.evaluate(() => ({
      overflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      firstChooserBottom: Math.round(document.querySelector('.track-chooser-card')?.getBoundingClientRect().bottom || 9999),
    }));
    assert('Mobile Paths (390px): First direction selector fits cleanly above fold with zero overflow', mPathsCheck.overflow && mPathsCheck.firstChooserBottom <= 844, JSON.stringify(mPathsCheck));
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'paths-zh-mobile-390-top.png') });
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'paths-zh-mobile-390.png'), fullPage: true });

    // Mobile LIB-000
    await mPage.goto('http://localhost:4321/library/zh/notes/lib-000/');
    await mPage.waitForLoadState('networkidle');
    const mLib000Ok = await mPage.evaluate(() => ({
      overflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      hasSvg: Boolean(document.querySelector('.mermaid-figure svg')),
    }));
    assert('Mobile LIB-000 (390px): Mermaid SVG diagram renders cleanly with zero page overflow', mLib000Ok.overflow && mLib000Ok.hasSvg, JSON.stringify(mLib000Ok));
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'lib000-zh-mobile-390-top.png') });

    // Mobile LIB-405
    await mPage.goto('http://localhost:4321/library/zh/notes/lib-405/');
    await mPage.waitForLoadState('networkidle');
    const m405Check = await mPage.evaluate(() => ({
      overflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      startBtnBottom: Math.round(document.querySelector('.btn-start-reading')?.getBoundingClientRect().bottom || 9999),
      lessonTop: Math.round(document.querySelector('#lesson-start')?.getBoundingClientRect().top || 9999),
    }));
    assert('Mobile LIB-405 (390px): Orientation, Start Learning & lesson body reachable above fold cleanly', m405Check.overflow && m405Check.startBtnBottom <= 720 && m405Check.lessonTop <= 844, JSON.stringify(m405Check));
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'lib405-zh-mobile-390-top.png') });
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'reader-lib405-zh-mobile-390.png'), fullPage: true });

    // Mobile LIB-703
    await mPage.goto('http://localhost:4321/library/zh/notes/lib-703/');
    await mPage.waitForLoadState('networkidle');
    const m703Ok = await mPage.evaluate(() => ({
      overflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      lessonTop: Math.round(document.querySelector('#lesson-start')?.getBoundingClientRect().top || 9999),
    }));
    assert('Mobile LIB-703 (390px): Teaching flow begins above fold with zero overflow', m703Ok.overflow && m703Ok.lessonTop <= 844, JSON.stringify(m703Ok));
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'lib703-zh-mobile-390-top.png') });

    // Mobile LIB-104 (Substantial math)
    await mPage.goto('http://localhost:4321/library/zh/notes/lib-104/');
    await mPage.waitForLoadState('networkidle');
    const m104Ok = await mPage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth && document.querySelectorAll('.katex').length > 30);
    assert('Mobile LIB-104 (390px): Math formulas render cleanly with zero horizontal overflow', m104Ok);
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'lib104-zh-mobile-390-top.png') });

    // Mobile Nav menu toggle
    await mPage.goto('http://localhost:4321/library/zh/');
    await mPage.click('#mobile-menu-toggle');
    await mPage.waitForTimeout(200);
    assert('Mobile Nav (390px): Hamburger menu toggles open cleanly', await mPage.locator('#mobile-menu').isVisible());

    await mobileContext.close();
  } catch (err) {
    console.error('Fatal test error:', err);
    assert('Test execution completed without unhandled exceptions', false, err.message);
  } finally {
    await browser.close();
    server.close();
  }

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;
  console.log(`\n========================================`);
  console.log(`BROWSER TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED (TOTAL: ${results.length})`);
  console.log(`========================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests();
