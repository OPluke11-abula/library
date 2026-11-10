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

// Start static HTTP server for /library
function startServer(port = 4321) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURIComponent(req.url.split('?')[0]);
      
      // Handle base path /library
      if (reqPath.startsWith('/library')) {
        reqPath = reqPath.slice('/library'.length);
      }
      if (!reqPath || reqPath === '/') {
        reqPath = '/index.html';
      }

      let filePath = path.join(DIST_DIR, reqPath);
      
      // If directory, look for index.html
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

async function runTests() {
  const server = await startServer(4321);
  const browser = await chromium.launch({ headless: true });
  
  const results = [];
  function assert(name, condition, details = '') {
    results.push({ name, passed: Boolean(condition), details });
    const mark = condition ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} : ${name} ${details ? '(' + details + ')' : ''}`);
  }

  try {
    // ----------------------------------------------------
    // TEST SUITE 1: DESKTOP (1440 x 900)
    // ----------------------------------------------------
    console.log('\n=== Executing Desktop Browser Tests (1440x900) ===');
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await desktopContext.newPage();

    // 1. Root redirect
    await page.goto('http://localhost:4321/library/');
    await page.waitForTimeout(400);
    assert('Root redirect to /library/zh/', page.url().includes('/library/zh/'), page.url());

    // 2. Home Page (ZH)
    await page.goto('http://localhost:4321/library/zh/');
    await page.waitForLoadState('networkidle');
    const heroTitle = await page.textContent('.hero-title');
    assert('Home hero title rendered', heroTitle?.includes('Grand Library'));
    
    const metricVolumes = await page.locator('.metric-card:has-text("28")').count();
    assert('Home metrics: 28 volumes displayed', metricVolumes > 0);
    
    const hallsCount = await page.locator('.hall-card').count();
    assert('Home: 10 Knowledge Halls displayed', hallsCount === 10, `Found: ${hallsCount}`);
    
    const featuredCount = await page.locator('.featured-section .article-card').count();
    assert('Home: 6 Featured articles displayed', featuredCount === 6, `Found: ${featuredCount}`);

    // LIB-504 description check (ZH)
    const zhLib504Text = await page.locator('.showcase-card:has-text("LIB-504")').textContent();
    assert('Home ZH LIB-504: Accurately describes NeRF & 3DGS', zhLib504Text?.includes('3D 高斯潑濺') || zhLib504Text?.includes('NeRF'), zhLib504Text?.slice(0, 80));
    assert('Home ZH LIB-504: Zero mention of STN or 空間變換網路', !zhLib504Text?.includes('STN') && !zhLib504Text?.includes('空間變換網路'));

    // Zero horizontal desktop overflow on Home
    const homeOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    assert('Home ZH: Zero desktop horizontal scroll overflow', homeOverflow);

    // Required Screenshot 1: homepage-zh-desktop-1440.png
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'homepage-zh-desktop-1440.png'), fullPage: true });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop-01-home-zh.png'), fullPage: true });

    // 2b. Home Page (EN) - LIB-504 Check
    await page.goto('http://localhost:4321/library/en/');
    await page.waitForLoadState('networkidle');
    const enLib504Text = await page.locator('.showcase-card:has-text("LIB-504")').textContent();
    assert('Home EN LIB-504: Accurately describes 3D Gaussian Splatting', enLib504Text?.includes('3D Gaussian Splatting') || enLib504Text?.includes('NeRF'), enLib504Text?.slice(0, 80));
    assert('Home EN LIB-504: Zero mention of STN or Spatial Transformer', !enLib504Text?.includes('STN') && !enLib504Text?.includes('Spatial Transformer'));

    // 3. Catalog Page (ZH)
    await page.goto('http://localhost:4321/library/zh/library/');
    await page.waitForLoadState('networkidle');
    
    const initialArticles = await page.locator('#catalog-grid .grid-item:visible').count();
    assert('Catalog: Initial articles count is 28', initialArticles === 28, `Found: ${initialArticles}`);

    // Zero horizontal desktop overflow on Catalog BEFORE filtering (verifies all 28 cards)
    const catalogOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    assert('Catalog ZH: Zero desktop horizontal scroll overflow', catalogOverflow);

    // Search test: filter by keyword "質心" (matches LIB-501 & LIB-901)
    await page.fill('#catalog-search', '質心');
    await page.waitForTimeout(300);
    const searchFiltered = await page.locator('#catalog-grid .grid-item:visible').count();
    assert('Catalog search: "質心" filters correctly to 2 volumes', searchFiltered === 2, `Found: ${searchFiltered}`);

    // Search test: filter by call number "LIB-501" (matches 1 volume)
    await page.fill('#catalog-search', 'LIB-501');
    await page.waitForTimeout(300);
    const callnoFiltered = await page.locator('#catalog-grid .grid-item:visible').count();
    assert('Catalog search: "LIB-501" filters exactly to 1 volume', callnoFiltered === 1, `Found: ${callnoFiltered}`);

    // Clear search
    await page.fill('#catalog-search', '');
    await page.waitForTimeout(200);

    // Hall filter test: Hall 01 (Math)
    await page.click('button[data-hall="01"]');
    await page.waitForTimeout(300);
    const mathArticles = await page.locator('#catalog-grid .grid-item:visible').count();
    assert('Catalog hall filter: "01" filters to 3 volumes', mathArticles === 3, `Found: ${mathArticles}`);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop-02-catalog-zh.png') });

    // 4. Reader Page (ZH: LIB-001)
    await page.goto('http://localhost:4321/library/zh/notes/lib-001/');
    await page.waitForLoadState('networkidle');

    const readerTitle = await page.textContent('.reader-title');
    assert('Reader: LIB-001 title rendered', readerTitle?.includes('深度學習第一性原理先修精要'));

    // Single H1 Invariant
    const h1Count = await page.locator('h1').count();
    assert('Reader LIB-001: Exactly one H1 rendered on page', h1Count === 1, `H1 count: ${h1Count}`);

    // Above-the-fold Start Reading button
    const startReadingBtn = await page.locator('.btn-start-reading').isVisible();
    assert('Reader LIB-001: Start Reading entry button present', startReadingBtn);

    // Date format validation: YYYY-MM-DD
    const dateText = await page.locator('.author-date span:last-child').textContent();
    assert('Reader LIB-001: Date formatted strictly as YYYY-MM-DD', /^\d{4}-\d{2}-\d{2}$/.test(dateText?.trim() || ''), dateText);

    const katexCount = await page.locator('.katex').count();
    assert('Reader: KaTeX formulas rendered statically', katexCount > 0, `KaTeX elements: ${katexCount}`);

    const wikilinksCount = await page.locator('.wikilink-badge').count();
    assert('Reader: Obsidian WikiLinks resolved to live links', wikilinksCount > 0, `WikiLinks: ${wikilinksCount}`);

    const prereqNodes = await page.locator('.topo-nodes-grid .topo-column:first-child .topo-link').count();
    assert('Reader: Prerequisites DAG nodes linked', prereqNodes === 1, `Prereqs: ${prereqNodes}`);

    const succNodes = await page.locator('.topo-nodes-grid .topo-column:last-child .topo-link').count();
    assert('Reader: Successors DAG nodes linked', succNodes === 2, `Successors: ${succNodes}`);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop-03-reader-zh.png') });

    // 5. Bilingual Switch: click switch to English
    await page.click('.btn-mirror-link');
    await page.waitForLoadState('networkidle');
    assert('Reader bilingual switch: URL changed to /en/notes/lib-001/', page.url().includes('/en/notes/lib-001/'), page.url());

    const enReaderTitle = await page.textContent('.reader-title');
    assert('Reader EN: English title rendered', enReaderTitle?.includes('Deep Learning First Principles'));
    const enH1Count = await page.locator('h1').count();
    assert('Reader EN LIB-001: Exactly one H1 rendered', enH1Count === 1, `H1 count: ${enH1Count}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop-04-reader-en.png') });

    // 6. KaTeX & Math Invariants: Verify previously failing formulas
    // Check ZH LIB-506 (had unescaped underscore in \text{[SAFETY_BOUND]})
    await page.goto('http://localhost:4321/library/zh/notes/lib-506/');
    await page.waitForLoadState('networkidle');
    const zh506KatexErrors = await page.locator('.katex-error').count();
    assert('Reader LIB-506 (ZH): Zero KaTeX formula rendering errors', zh506KatexErrors === 0, `Errors: ${zh506KatexErrors}`);

    // Check EN LIB-506
    await page.goto('http://localhost:4321/library/en/notes/lib-506/');
    await page.waitForLoadState('networkidle');
    const en506KatexErrors = await page.locator('.katex-error').count();
    assert('Reader LIB-506 (EN): Zero KaTeX formula rendering errors', en506KatexErrors === 0, `Errors: ${en506KatexErrors}`);

    // Check ZH LIB-802 (had unclosed subscript brace)
    await page.goto('http://localhost:4321/library/zh/notes/lib-802/');
    await page.waitForLoadState('networkidle');
    const zh802KatexErrors = await page.locator('.katex-error').count();
    assert('Reader LIB-802 (ZH): Zero KaTeX formula rendering errors', zh802KatexErrors === 0, `Errors: ${zh802KatexErrors}`);

    // Check HTML Entity Double Escaping Invariant
    const rawDom = await page.content();
    assert('Reader LIB-802: Zero double-escaped &amp;amp; entities', !rawDom.includes('&amp;amp;'));
    assert('Reader LIB-802: Zero double-escaped &amp;#39; entities', !rawDom.includes('&amp;#39;'));

    // 7. Learning Paths (ZH)
    await page.goto('http://localhost:4321/library/zh/paths/');
    await page.waitForLoadState('networkidle');

    const pathsCount = await page.locator('.path-card').count();
    assert('Learning Paths: 3 Curated DAG paths displayed', pathsCount === 3, `Paths: ${pathsCount}`);

    const stepsCount = await page.locator('.timeline-step').count();
    assert('Learning Paths: 23 Authentic DAG steps rendered', stepsCount === 23, `Steps: ${stepsCount}`);

    const redundantPills = await page.locator('.direct-edge-pill').count();
    assert('Learning Paths: Zero redundant noisy direct-edge pills', redundantPills === 0, `Pills: ${redundantPills}`);

    const accordionOpen = await page.locator('details.roadmap-accordion').getAttribute('open');
    assert('Learning Paths: SVG Panorama accordion collapsed by default', accordionOpen === null);

    // Zero horizontal desktop overflow on Paths
    const pathsOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    assert('Learning Paths ZH: Zero desktop horizontal scroll overflow', pathsOverflow);

    // Required Screenshot 3: paths-zh-desktop-1440.png
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'paths-zh-desktop-1440.png'), fullPage: true });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop-05-paths-zh.png') });

    // 7b. Learning Paths (EN)
    await page.goto('http://localhost:4321/library/en/paths/');
    await page.waitForLoadState('networkidle');

    const enStepsCount = await page.locator('.timeline-step').count();
    assert('Learning Paths EN: 23 steps rendered symmetrically', enStepsCount === 23, `Steps EN: ${enStepsCount}`);

    const enRedundantPills = await page.locator('.direct-edge-pill').count();
    assert('Learning Paths EN: Zero redundant noisy direct-edge pills', enRedundantPills === 0, `Pills: ${enRedundantPills}`);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop-05-paths-en.png') });

    // 8. Reader Page (ZH: LIB-405) - Verification & Screenshot
    await page.goto('http://localhost:4321/library/zh/notes/lib-405/');
    await page.waitForLoadState('networkidle');
    const lib405Title = await page.textContent('.reader-title');
    assert('Reader LIB-405: Title rendered', lib405Title?.includes('注意力機制'));

    // Check that there are NO leaked asterisks in paragraph prose
    const proseHtml = await page.locator('.rendered-markdown').innerHTML();
    const leakedDoubleAsterisks = (proseHtml.match(/\*\*[^\*<>]+\*\*/g) || []).length;
    assert('Reader LIB-405: Zero leaked asterisks in rendered prose', leakedDoubleAsterisks === 0, `Count: ${leakedDoubleAsterisks}`);

    // Required Screenshot 5: reader-lib405-zh-desktop-1440.png
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'reader-lib405-zh-desktop-1440.png'), fullPage: true });

    // 9. About Page (ZH)
    await page.goto('http://localhost:4321/library/zh/about/');
    await page.waitForLoadState('networkidle');

    const quadCount = await page.locator('.quad-card').count();
    assert('About: 4 Quad-alignment cards displayed', quadCount === 4, `Quads: ${quadCount}`);

    const techCount = await page.locator('.tech-card').count();
    assert('About: Tech stack cards displayed', techCount === 4, `Tech cards: ${techCount}`);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'desktop-06-about-zh.png') });

    await desktopContext.close();

    // ----------------------------------------------------
    // TEST SUITE 2: MOBILE (390 x 844, iPhone 12/13/14 Standard)
    // ----------------------------------------------------
    console.log('\n=== Executing Mobile Browser Tests (390x844) ===');
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    const mPage = await mobileContext.newPage();

    // Mobile Home & Catalog (ZH)
    await mPage.goto('http://localhost:4321/library/zh/library/');
    await mPage.waitForLoadState('networkidle');
    const mCatalogOverflow = await mPage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

    await mPage.goto('http://localhost:4321/library/zh/');
    await mPage.waitForLoadState('networkidle');
    const mHeroVisible = await mPage.locator('.hero-title').isVisible();
    const mHomeOverflow = await mPage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    assert('Mobile Home & Catalog: Hero visible and zero horizontal overflow', mHeroVisible && mHomeOverflow && mCatalogOverflow, `homeOk=${mHomeOverflow}, catalogOk=${mCatalogOverflow}`);

    // Required Screenshot 2: homepage-zh-mobile-390.png
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'homepage-zh-mobile-390.png'), fullPage: true });
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile-01-home-zh.png') });

    // Mobile Navigation Menu Toggle
    const toggleBtn = mPage.locator('#mobile-menu-toggle');
    const isToggleVisible = await toggleBtn.isVisible();
    assert('Mobile Nav: Hamburger button visible on mobile', isToggleVisible);

    await toggleBtn.click();
    await mPage.waitForTimeout(300);
    const menuVisible = await mPage.locator('#mobile-menu').isVisible();
    assert('Mobile Nav: Dropdown menu opens on toggle click', menuVisible);
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile-02-menu-open.png') });

    // Mobile Learning Paths (ZH)
    await mPage.goto('http://localhost:4321/library/zh/paths/');
    await mPage.waitForLoadState('networkidle');
    const mPathsVisible = await mPage.locator('.path-title').first().isVisible();
    const mPathsOverflow = await mPage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    assert('Mobile Paths: Path cards rendered cleanly with zero overflow', mPathsVisible && mPathsOverflow);

    // Required Screenshot 4: paths-zh-mobile-390.png
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'paths-zh-mobile-390.png'), fullPage: true });

    // Mobile Reader (ZH: LIB-405)
    await mPage.goto('http://localhost:4321/library/zh/notes/lib-405/');
    await mPage.waitForLoadState('networkidle');
    const mKatexVisible = await mPage.locator('.katex').first().isVisible();
    const mReaderOverflow = await mPage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    assert('Mobile Reader: KaTeX math rendered cleanly with zero overflow', mKatexVisible && mReaderOverflow);

    // Required Screenshot 6: reader-lib405-zh-mobile-390.png
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'reader-lib405-zh-mobile-390.png'), fullPage: true });
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile-03-reader-zh.png') });

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
