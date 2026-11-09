import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootAssets = path.resolve(__dirname, '../../assets');
const targetAssets = path.resolve(__dirname, '../public/assets');

if (!fs.existsSync(targetAssets)) {
  fs.mkdirSync(targetAssets, { recursive: true });
}

if (fs.existsSync(rootAssets)) {
  const files = fs.readdirSync(rootAssets);
  for (const file of files) {
    const src = path.join(rootAssets, file);
    const dest = path.join(targetAssets, file);
    fs.copyFileSync(src, dest);
  }
  console.log(`[sync-assets] Synced ${files.length} assets to site/public/assets/`);
}

// Sync KaTeX assets
const katexDistLocal = path.resolve(__dirname, '../node_modules/katex/dist');
const katexDistParent = path.resolve(__dirname, '../../../node_modules/katex/dist');
const katexDist = fs.existsSync(katexDistLocal) ? katexDistLocal : katexDistParent;
const targetKatex = path.resolve(__dirname, '../public/katex');

if (fs.existsSync(katexDist)) {
  if (!fs.existsSync(targetKatex)) {
    fs.mkdirSync(targetKatex, { recursive: true });
  }
  // Copy katex.min.css
  fs.copyFileSync(path.join(katexDist, 'katex.min.css'), path.join(targetKatex, 'katex.min.css'));
  
  // Copy fonts directory
  const fontsSrc = path.join(katexDist, 'fonts');
  const fontsDest = path.join(targetKatex, 'fonts');
  if (fs.existsSync(fontsSrc)) {
    if (!fs.existsSync(fontsDest)) {
      fs.mkdirSync(fontsDest, { recursive: true });
    }
    const fontFiles = fs.readdirSync(fontsSrc);
    for (const font of fontFiles) {
      fs.copyFileSync(path.join(fontsSrc, font), path.join(fontsDest, font));
    }
    console.log(`[sync-assets] Synced KaTeX CSS and ${fontFiles.length} fonts to site/public/katex/`);
  }
}
