import { describe, expect, it } from 'vitest';
import { convertMeasure } from '../../app/utils/units';

describe('convertMeasure', () => {
  it('keeps the measure as written by default', () => {
    expect(convertMeasure('3/4 cup', 'original')).toBe('3/4 cup');
  });

  it('converts US measures to metric', () => {
    expect(convertMeasure('3/4 cup', 'metric')).toBe('180 ml');
    expect(convertMeasure('1 1/2 cups', 'metric')).toBe('360 ml');
    expect(convertMeasure('2 lbs', 'metric')).toBe('905 g');
    expect(convertMeasure('12 oz', 'metric')).toBe('340 g');
    expect(convertMeasure('½ cup chopped', 'metric')).toBe('120 ml chopped');
    expect(convertMeasure('5 cups', 'metric')).toBe('1.2 l');
  });

  it('converts metric measures to US', () => {
    expect(convertMeasure('500g', 'us')).toBe('1 lb');
    expect(convertMeasure('200 g', 'us')).toBe('7 oz');
    expect(convertMeasure('350g', 'us')).toBe('12 oz');
    expect(convertMeasure('70g', 'us')).toBe('2 ½ oz');
    expect(convertMeasure('250ml', 'us')).toBe('1 cup');
    expect(convertMeasure('400 ml', 'us')).toBe('1 ⅔ cups');
    expect(convertMeasure('30ml', 'us')).toBe('2 tbsp');
    expect(convertMeasure('5 ml', 'us')).toBe('1 tsp');
    expect(convertMeasure('1 kg', 'us')).toBe('2 ¼ lb');
    expect(convertMeasure('1.5 l', 'us')).toBe('6 ¼ cups');
  });

  it('leaves measures alone that are already in the system or not understood', () => {
    expect(convertMeasure('2 tbsp', 'us')).toBe('2 tbsp');
    expect(convertMeasure('100g', 'metric')).toBe('100g');
    expect(convertMeasure('2 cloves', 'metric')).toBe('2 cloves');
    expect(convertMeasure('Pinch', 'metric')).toBe('Pinch');
    expect(convertMeasure('4 Tablespoons', 'metric')).toBe('4 Tablespoons');
    expect(convertMeasure('1/2 teaspoon', 'metric')).toBe('1/2 teaspoon');
    expect(convertMeasure('1 (12 oz.)', 'metric')).toBe('1 (12 oz.)');
    expect(convertMeasure('175g/6oz', 'us')).toBe('175g/6oz');
    expect(convertMeasure('2 large', 'us')).toBe('2 large');
  });
});
