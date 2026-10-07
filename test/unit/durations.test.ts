import { describe, expect, it } from 'vitest';
import { findDurations, formatCountdown } from '../../app/utils/durations';

describe('findDurations', () => {
  it('finds minutes, hours and seconds', () => {
    expect(findDurations('Bake for 35 minutes, then rest 1 hour.')).toEqual([
      { label: '35 minutes', seconds: 2100 },
      { label: '1 hour', seconds: 3600 },
    ]);
    expect(findDurations('Blend for 30 secs.')).toEqual([{ label: '30 secs', seconds: 30 }]);
  });

  it('uses the lower value of a range', () => {
    expect(findDurations('Simmer 20-25 mins')).toEqual([{ label: '20-25 mins', seconds: 1200 }]);
    expect(findDurations('Cook for 5 to 7 minutes')).toEqual([{ label: '5 to 7 minutes', seconds: 300 }]);
  });

  it('reads words, fractions and decimals', () => {
    expect(findDurations('Leave for half an hour')[0]?.seconds).toBe(1800);
    expect(findDurations('Stir for a minute')[0]?.seconds).toBe(60);
    expect(findDurations('Roast for 1 1/2 hours')[0]?.seconds).toBe(5400);
    expect(findDurations('Roast for 1½ hours')[0]?.seconds).toBe(5400);
    expect(findDurations('Chill for 2.5 hrs')[0]?.seconds).toBe(9000);
    expect(findDurations('Fry for ten minutes')[0]?.seconds).toBe(600);
  });

  it('joins hours and minutes written together', () => {
    expect(findDurations('Bake 1 hour and 15 minutes until golden')).toEqual([
      { label: '1 hour and 15 minutes', seconds: 4500 },
    ]);
    expect(findDurations('Cook 2 hours 30 mins')).toEqual([{ label: '2 hours 30 mins', seconds: 9000 }]);
  });

  it('ignores words that only look like units', () => {
    expect(findDurations('Use a minimum of 2 eggs and 350° F.')).toEqual([]);
    expect(findDurations('Cut into 2 inch pieces')).toEqual([]);
  });
});

describe('formatCountdown', () => {
  it('formats minutes and hours', () => {
    expect(formatCountdown(45_000)).toBe('0:45');
    expect(formatCountdown(35 * 60_000)).toBe('35:00');
    expect(formatCountdown(3_900_000)).toBe('1:05:00');
    expect(formatCountdown(-5)).toBe('0:00');
  });
});
