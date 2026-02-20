// Benchmark: Inventory Stats Calculation
// Compares:
// 1. Original: Multiple .filter() calls (O(3N))
// 2. Optimized: Single .reduce() pass (O(N))

console.log('⚡ Starting Benchmark: Inventory Stats Calculation\n');

enum ItemStatus {
  AVAILABLE = 'Disponível',
  LOW_STOCK = 'Estoque Baixo',
  OUT_OF_STOCK = 'Sem Estoque',
  EXPIRED = 'Vencido',
  RESERVED = 'Reservado',
}

interface Item {
  id: string;
  status: ItemStatus;
}

// 1. Generate Data
const DATA_SIZE = 50000; // Large enough to see difference
console.log(`Generating ${DATA_SIZE} items...`);
const items: Item[] = [];
const statuses = Object.values(ItemStatus);

for (let i = 0; i < DATA_SIZE; i++) {
  items.push({
    id: `item-${i}`,
    status: statuses[Math.floor(Math.random() * statuses.length)] as ItemStatus,
  });
}

// 2. Benchmark Original
console.time('Original (Multiple filters)');
let statsOriginal;
for (let i = 0; i < 100; i++) {
  statsOriginal = {
    total: items.length || 0,
    lowStock: items.filter(item => item.status === ItemStatus.LOW_STOCK).length || 0,
    outOfStock: items.filter(item => item.status === ItemStatus.OUT_OF_STOCK).length || 0,
    expired: items.filter(item => item.status === ItemStatus.EXPIRED).length || 0,
  };
}
console.timeEnd('Original (Multiple filters)');

// 3. Benchmark Optimized
console.time('Optimized (Single pass reduce)');
let statsOptimized;
for (let i = 0; i < 100; i++) {
  statsOptimized = items.reduce(
    (acc, item) => {
      acc.total++;
      if (item.status === ItemStatus.LOW_STOCK) acc.lowStock++;
      if (item.status === ItemStatus.OUT_OF_STOCK) acc.outOfStock++;
      if (item.status === ItemStatus.EXPIRED) acc.expired++;
      return acc;
    },
    { total: 0, lowStock: 0, outOfStock: 0, expired: 0 }
  );
}
console.timeEnd('Optimized (Single pass reduce)');

// 4. Verify Correctness
console.log('\nVerifying results...');
const isCorrect =
  statsOriginal.total === statsOptimized.total &&
  statsOriginal.lowStock === statsOptimized.lowStock &&
  statsOriginal.outOfStock === statsOptimized.outOfStock &&
  statsOriginal.expired === statsOptimized.expired;

if (isCorrect) {
  console.log('✅ PASS: Results match exactly.');
  console.log('Original:', JSON.stringify(statsOriginal));
  console.log('Optimized:', JSON.stringify(statsOptimized));
} else {
  console.error('❌ FAIL: Results do not match!');
  console.error('Original:', JSON.stringify(statsOriginal));
  console.error('Optimized:', JSON.stringify(statsOptimized));
  process.exit(1);
}
