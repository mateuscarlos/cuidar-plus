import { describe, it, expect } from 'vitest';
import { sanitizeForStyle } from './chart.utils';

describe('sanitizeForStyle', () => {
  it('should sanitize IDs by removing non-alphanumeric characters', () => {
    expect(sanitizeForStyle('valid-id', 'id')).toBe('valid-id');
    expect(sanitizeForStyle('valid_id_123', 'id')).toBe('valid_id_123');
    expect(sanitizeForStyle('invalid id', 'id')).toBe('invalidid');
    expect(sanitizeForStyle('invalid/id', 'id')).toBe('invalidid');
    expect(sanitizeForStyle('invalid<id>', 'id')).toBe('invalidid');
    expect(sanitizeForStyle('foo] { body { display: none; } } [data-chart=bar', 'id'))
      .toBe('foobodydisplaynonedata-chartbar');
  });

  it('should sanitize keys by removing non-alphanumeric characters', () => {
    expect(sanitizeForStyle('valid-key', 'key')).toBe('valid-key');
    expect(sanitizeForStyle('color', 'key')).toBe('color');
    // Dashes and underscores are allowed by /[^a-zA-Z0-9_-]/g
    expect(sanitizeForStyle('--custom-prop', 'key')).toBe('--custom-prop');

    expect(sanitizeForStyle('foo: bar', 'key')).toBe('foobar');
    expect(sanitizeForStyle('foo; background: red', 'key')).toBe('foobackgroundred');
  });

  it('should sanitize values by removing dangerous characters', () => {
    // Allowed
    expect(sanitizeForStyle('red', 'value')).toBe('red');
    expect(sanitizeForStyle('#ff0000', 'value')).toBe('#ff0000');
    expect(sanitizeForStyle('rgba(0, 0, 0, 0.5)', 'value')).toBe('rgba(0, 0, 0, 0.5)');
    expect(sanitizeForStyle('var(--color-primary)', 'value')).toBe('var(--color-primary)');

    // Dangerous
    expect(sanitizeForStyle('red; background: blue', 'value')).toBe('red background: blue');
    expect(sanitizeForStyle('red } body { display: none', 'value')).toBe('red  body  display: none');
    expect(sanitizeForStyle('"><script>alert(1)</script>', 'value')).toBe('scriptalert(1)/script');
  });

  it('should handle empty input', () => {
      expect(sanitizeForStyle('', 'id')).toBe('');
      expect(sanitizeForStyle(null as unknown as string, 'id')).toBe('');
      expect(sanitizeForStyle(undefined as unknown as string, 'id')).toBe('');
  });
});
