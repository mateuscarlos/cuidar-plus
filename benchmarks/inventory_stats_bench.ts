import { performance } from 'perf_hooks';

// Mock Enum and Interface
enum ItemStatus {
  AVAILABLE = 'Disponível',
  LOW_STOCK = 'Estoque Baixo',
  OUT_OF_STOCK = 'Sem Estoque',
  EXPIRED = 'Vencido',
  RESERVED = 'Reservado',
}

interface InventoryItem {
  status: ItemStatus;
  // other fields are irrelevant for this benchmark
}

// Generate Data
const DATA_SIZE = 1_000_000;
console.log(`Generating ${DATA_SIZE} items...`);
const data: InventoryItem[] = [];
const statuses = Object.values(ItemStatus);

for (let i = 0; i < DATA_SIZE; i++) {
  data.push({
    status: statuses[Math.floor(Math.random() * statuses.length)],
  });
}

// Baseline: O(3N)
console.log('Running Baseline (Multiple Passes)...');
const startBaseline = performance.now();
const statsBaseline = {
  total: data.length,
  lowStock: data.filter(i => i.status === ItemStatus.LOW_STOCK).length,
  outOfStock: data.filter(i => i.status === ItemStatus.OUT_OF_STOCK).length,
  expired: data.filter(i => i.status === ItemStatus.EXPIRED).length,
};
const endBaseline = performance.now();
const baselineTime = endBaseline - startBaseline;
console.log(`Baseline Time: ${baselineTime.toFixed(4)} ms`);

// Optimized: O(N) - Reduce
console.log('Running Optimized (Reduce)...');
const startOptimizedReduce = performance.now();
const statsOptimizedReduce = data.reduce(
  (acc, item) => {
    acc.total++;
    if (item.status === ItemStatus.LOW_STOCK) acc.lowStock++;
    else if (item.status === ItemStatus.OUT_OF_STOCK) acc.outOfStock++;
    else if (item.status === ItemStatus.EXPIRED) acc.expired++;
    return acc;
  },
  { total: 0, lowStock: 0, outOfStock: 0, expired: 0 }
);
const endOptimizedReduce = performance.now();
const optimizedReduceTime = endOptimizedReduce - startOptimizedReduce;
console.log(`Optimized Reduce Time: ${optimizedReduceTime.toFixed(4)} ms`);

// Optimized: O(N) - Loop
console.log('Running Optimized (For Loop)...');
const startOptimizedLoop = performance.now();
const statsOptimizedLoop = { total: 0, lowStock: 0, outOfStock: 0, expired: 0 };
for (const item of data) {
    statsOptimizedLoop.total++;
    if (item.status === ItemStatus.LOW_STOCK) statsOptimizedLoop.lowStock++;
    else if (item.status === ItemStatus.OUT_OF_STOCK) statsOptimizedLoop.outOfStock++;
    else if (item.status === ItemStatus.EXPIRED) statsOptimizedLoop.expired++;
}
const endOptimizedLoop = performance.now();
const optimizedLoopTime = endOptimizedLoop - startOptimizedLoop;
console.log(`Optimized Loop Time: ${optimizedLoopTime.toFixed(4)} ms`);


// Verification
console.log('Verifying results...');
const isCorrect =
  statsBaseline.total === statsOptimizedReduce.total &&
  statsBaseline.lowStock === statsOptimizedReduce.lowStock &&
  statsBaseline.outOfStock === statsOptimizedReduce.outOfStock &&
  statsBaseline.expired === statsOptimizedReduce.expired &&
  statsBaseline.total === statsOptimizedLoop.total &&
  statsBaseline.lowStock === statsOptimizedLoop.lowStock &&
  statsBaseline.outOfStock === statsOptimizedLoop.outOfStock &&
  statsBaseline.expired === statsOptimizedLoop.expired;


if (isCorrect) {
  console.log('✅ Results match!');
} else {
  console.error('❌ Results do not match!');
}

const improvementReduce = ((baselineTime - optimizedReduceTime) / baselineTime) * 100;
console.log(`Improvement (Reduce): ${improvementReduce.toFixed(2)}%`);

const improvementLoop = ((baselineTime - optimizedLoopTime) / baselineTime) * 100;
console.log(`Improvement (Loop): ${improvementLoop.toFixed(2)}%`);
