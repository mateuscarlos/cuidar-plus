import { describe, it, expect } from 'vitest';
import { sanitizeData } from './security';

describe('sanitizeData', () => {
  it('should return null or undefined as is', () => {
    expect(sanitizeData(null)).toBeNull();
    expect(sanitizeData(undefined)).toBeUndefined();
  });

  it('should sanitize simple object with sensitive keys', () => {
    const input = { name: 'John', password: 'secretpassword123' };
    const expected = { name: 'John', password: 'sec***123' };
    expect(sanitizeData(input)).toEqual(expected);
  });

  it('should sanitize nested object with sensitive keys', () => {
    const input = { user: { name: 'Alice', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' } };
    const expected = { user: { name: 'Alice', token: 'eyJ***CJ9' } };
    expect(sanitizeData(input)).toEqual(expected);
  });

  it('should sanitize array of objects', () => {
    const input = [{ id: 1, secretKey: '1234567890' }, { id: 2, secretKey: 'abcdefghij' }];
    // length 10 -> masked completely '***'
    const expected = [{ id: 1, secretKey: '***' }, { id: 2, secretKey: '***' }];
    expect(sanitizeData(input)).toEqual(expected);
  });

  it('should handle mixed case keys', () => {
    const input = { UserPassword: 'mypassword', apiKEY: 'key123' };
    // length 10 -> '***'
    // length 6 -> '***'
    const expected = { UserPassword: '***', apiKEY: '***' };
    expect(sanitizeData(input)).toEqual(expected);
  });

  it('should handle non-string sensitive values', () => {
    const input = { creditCard: 1234567890123456 };
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
      const input = { a: { b: { c: { secret: 'verysecret' } } } };
      const expected = { a: { b: { c: { secret: '***' } } } }; // length 10 -> '***'
      expect(sanitizeData(input)).toEqual(expected);
  });
});
