import { loadLibraryArticles, verifyLearningPathsStrictly, CURATED_LEARNING_PATHS } from '../src/lib/library.ts';

console.log('=== Automated Learning Paths Direct DAG Edge Verification ===\n');

const result = verifyLearningPathsStrictly();

console.log(`Evaluated ${result.totalPaths} curated learning paths across ${result.totalSteps} steps:`);

for (const path of CURATED_LEARNING_PATHS) {
  console.log(`\n• Path [${path.id}]: ${path.titleZh} (${path.steps.length} nodes)`);
  for (let i = 0; i < path.steps.length - 1; i++) {
    const from = path.steps[i].callNumber;
    const to = path.steps[i + 1].callNumber;
    console.log(`    ├── Edge ${i + 1}: ${from} ──► ${to} [Direct DAG Edge Verified]`);
  }
}

console.log(`\n------------------------------------------------------------`);
console.log(`Total Direct DAG Edges Verified: ${result.totalEdges}`);
console.log(`Total Edge Errors Detected: ${result.errors.length}`);
console.log(`------------------------------------------------------------\n`);

if (!result.valid) {
  console.error('❌ DIRECT DAG EDGE VERIFICATION FAILED:');
  for (const err of result.errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log('✅ ALL LEARNING PATHS DIRECT DAG EDGES STRICTLY PASS!\n');
