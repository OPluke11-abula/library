import { loadLibraryArticles, getAllPairs, getTopologicalArticles } from '../src/lib/library.ts';

console.log('Testing library article loader...');
const { zh, en } = loadLibraryArticles();
console.log(`Loaded ZH articles: ${zh.size}`);
console.log(`Loaded EN articles: ${en.size}`);

const pairs = getAllPairs();
console.log(`Total Bilingual pairs: ${pairs.length}`);

const topo = getTopologicalArticles('zh');
console.log(`Topologically sorted articles: ${topo.length}`);

for (const pair of pairs) {
  if (!pair.zh) console.error(`Missing ZH for ${pair.slug}`);
  if (!pair.en) console.error(`Missing EN for ${pair.slug}`);
}

console.log('Sample article LIB-001:');
const sample = zh.get('lib-001');
if (sample) {
  console.log('Title:', sample.title);
  console.log('CallNumber:', sample.callNumber);
  console.log('Status:', sample.status);
  console.log('TOC items:', sample.toc.length);
  console.log('Rules:', sample.rules.length);
  console.log('Prereqs:', sample.prerequisiteIds);
  console.log('Successors:', sample.successorIds);
}
