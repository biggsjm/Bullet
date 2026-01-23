import { describe, it, expect } from 'vitest';
import { cycleTaskState } from './useEntries';

describe('cycleTaskState', () => {
  it('cycles incomplete to complete', () => {
    expect(cycleTaskState('incomplete')).toBe('complete');
  });

  it('cycles complete to migrated', () => {
    expect(cycleTaskState('complete')).toBe('migrated');
  });

  it('cycles migrated to scheduled', () => {
    expect(cycleTaskState('migrated')).toBe('scheduled');
  });

  it('cycles scheduled back to incomplete', () => {
    expect(cycleTaskState('scheduled')).toBe('incomplete');
  });

  it('returns null for null input', () => {
    expect(cycleTaskState(null)).toBe(null);
  });
});
