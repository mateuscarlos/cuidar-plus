import { describe, it, expect } from 'vitest';
import { sanitizeData } from './security';

describe('sanitizeData', () => {
  it('should return null or undefined as is', () => {
    expect(sanitizeData(null)).toBeNull();
    expect(sanitizeData(undefined)).toBeUndefined();
  });

  it('should sanitize simple object with sensitive keys', () => {
    const input = { name: 'John', password: 'test-value-long' };
    const expected = { name: 'John', password: 'tes***ong' };
    expect(sanitizeData(input)).toEqual(expected);
  });

  it('should sanitize nested object with sensitive keys', () => {
    const input = { user: { name: 'Alice', token: 'test-token-value' } };
    const expected = { user: { name: 'Alice', token: 'tes***lue' } };
    expect(sanitizeData(input)).toEqual(expected);
  });

  it('should sanitize array of objects', () => {
    const input = [{ id: 1, secretKey: 'test-key-1' }, { id: 2, secretKey: 'test-key-2' }];
    // length 10 -> masked completely '***'
    const expected = [{ id: 1, secretKey: '***' }, { id: 2, secretKey: '***' }];
    expect(sanitizeData(input)).toEqual(expected);
  });

  it('should handle mixed case keys', () => {
    const input = { UserPassword: 'short', apiKEY: 'test' };
    // length < 10 -> '***'
    const expected = { UserPassword: '***', apiKEY: '***' };
    expect(sanitizeData(input)).toEqual(expected);
  });

  it('should handle non-string sensitive values', () => {
    // Using a short number to avoid looking like a credit card
    const input = { creditCard: 12345 };
    const expected = { creditCard: '***' };
    expect(sanitizeData(input)).toEqual(expected);
  });

  it('should preserve Date objects', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    const input = { date };
    const result = sanitizeData(input) as { date: Date };
    expect(result.date).toBeInstanceOf(Date);
    expect(result.date.toISOString()).toBe('2023-01-01T00:00:00.000Z');
  });

  it('should handle Blob/File objects safely', () => {
    // Mock Blob/File if environment supports it, or just rely on robust check
    if (typeof Blob !== 'undefined') {
      const blob = new Blob(['content'], { type: 'text/plain' });
      const result = sanitizeData(blob);
      expect(result).toBe('[Binary Data]');
    }
  });

  it('should handle deep nesting', () => {
      const input = { a: { b: { c: { secret: 'nested-secret-test' } } } };
      const expected = { a: { b: { c: { secret: 'nes***est' } } } };
      expect(sanitizeData(input)).toEqual(expected);
  });
});
