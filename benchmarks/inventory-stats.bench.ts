
// Simulate the enum
enum ItemStatus {
  AVAILABLE = 'Disponível',
  LOW_STOCK = 'Estoque Baixo',
  OUT_OF_STOCK = 'Sem Estoque',
  EXPIRED = 'Vencido',
  RESERVED = 'Reservado',
}

interface InventoryItem {
  status: ItemStatus;
  id: number;
}

// Generate data
const generateData = (count: number): InventoryItem[] => {
  const statuses = Object.values(ItemStatus);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

const runBenchmark = () => {
  const sizes = [100, 1000, 10000, 100000, 1000000];

  console.log('Running Inventory Stats Benchmark...\n');
  console.log('| Size | Original (ms) | Optimized (ms) | Improvement |');
  console.log('|------|---------------|----------------|-------------|');

  for (const size of sizes) {
    const data = generateData(size);

    // Original implementation (filter x3)
    const startOriginal = performance.now();
    for (let i = 0; i < 100; i++) { // Run 100 times to get average/detectable time
      const stats = {
        total: data.length || 0,
        lowStock: data.filter(i => i.status === ItemStatus.LOW_STOCK).length || 0,
        outOfStock: data.filter(i => i.status === ItemStatus.OUT_OF_STOCK).length || 0,
        expired: data.filter(i => i.status === ItemStatus.EXPIRED).length || 0,
      };
    }
    const endOriginal = performance.now();
    const timeOriginal = (endOriginal - startOriginal) / 100;

    // Optimized implementation (reduce x1)
    const startOptimized = performance.now();
    for (let i = 0; i < 100; i++) {
       const stats = data.reduce((acc, item) => {
        if (item.status === ItemStatus.LOW_STOCK) acc.lowStock++;
        if (item.status === ItemStatus.OUT_OF_STOCK) acc.outOfStock++;
        if (item.status === ItemStatus.EXPIRED) acc.expired++;
        return acc;
      }, { total: data.length, lowStock: 0, outOfStock: 0, expired: 0 });
    }
    const endOptimized = performance.now();
    const timeOptimized = (endOptimized - startOptimized) / 100;

    const improvement = ((timeOriginal - timeOptimized) / timeOriginal * 100).toFixed(2);

    console.log(`| ${size.toString().padEnd(4)} | ${timeOriginal.toFixed(4).padEnd(13)} | ${timeOptimized.toFixed(4).padEnd(14)} | ${improvement}% |`);
  }
};

runBenchmark();
