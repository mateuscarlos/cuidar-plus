
// Simplified logic from src/shared/ui/chart.tsx
// This script verifies the proposed sanitization logic for preventing XSS/CSS injection in ChartStyle

const THEMES = { light: "", dark: ".dark" } as const;

// Mock types
type ChartConfig = {
  [k in string]: {
    label?: any;
    icon?: any;
    color?: string;
    theme?: Record<keyof typeof THEMES, string>;
  };
};

// Proposed sanitization logic
function sanitizeForStyle(value: string) {
  // Strip dangerous characters:
  // < > : Prevent XSS (closing style tag)
  // ; } : Prevent CSS injection (breaking out of rule)
  // [ ] : Prevent attribute selector injection/modification
  // " ' : Prevent string termination or injection
  return value.replace(/[<>;}"'[\]]/g, "");
}

function generateChartStyle(id: string, config: ChartConfig) {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  // Apply sanitization to ID and color values
  const safeId = sanitizeForStyle(id);

  return Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${safeId}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    // Apply sanitization to color value
    return color ? `  --color-${key}: ${sanitizeForStyle(color)};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n");
}

console.log('--- Verification: Safe Output Generation ---');

// Test case 1: Malicious ID attempting XSS via style tag breakout
const maliciousId = 'chart-"><script>alert("XSS")</script><style>';
const config1 = {
  foo: { color: 'red' }
};

const output1 = generateChartStyle(maliciousId, config1);
console.log('\nInput ID:', maliciousId);
console.log('Sanitized Output:\n', output1);

if (output1 && (output1.includes('<script>') || output1.includes('</style>'))) {
  console.error('FAIL: Output contains dangerous tags!');
  process.exit(1);
} else {
  console.log('PASS: No dangerous tags found in output for malicious ID.');
}


// Test case 2: Malicious Config Color attempting CSS injection and XSS
const maliciousConfig = {
  bar: { color: 'blue; } </style><script>alert("XSS 2")</script><style>' }
};
const safeIdInput = 'chart-123';

const output2 = generateChartStyle(safeIdInput, maliciousConfig);
console.log('\nInput Config Color:', maliciousConfig.bar.color);
console.log('Sanitized Output:\n', output2);

if (output2 && (output2.includes('<script>') || output2.includes('</style>') || output2.includes('} <'))) {
  console.error('FAIL: Output contains dangerous content!');
  process.exit(1);
} else {
  console.log('PASS: No dangerous content found in output for malicious config.');
}

// Test case 3: CSS Injection via attribute selector breakout
const maliciousIdAttr = 'foo] { content: "injected"; } [data-chart=bar';
const output3 = generateChartStyle(maliciousIdAttr, config1);
console.log('\nInput ID (Attribute Injection):', maliciousIdAttr);
console.log('Sanitized Output:\n', output3);

// Check if ] { appears more than twice (once for light, once for dark)
// Actually, it should appear exactly twice because the template generates 2 blocks.
const matches = (output3 || '').match(/\] \{/g);
if (matches && matches.length > 2) {
   console.error(`FAIL: Output contains ${matches.length} attribute selector closers (expected 2)! Breakout occurred.`);
   process.exit(1);
} else {
   console.log('PASS: Attribute selector remains intact (no breakout).');
}
