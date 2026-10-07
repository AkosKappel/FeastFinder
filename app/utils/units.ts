export type UnitSystem = 'original' | 'metric' | 'us';

type Kind = 'volume' | 'mass';
interface Unit {
  kind: Kind;
  system: 'metric' | 'us';
  /** Millilitres or grams in one unit. */
  base: number;
}

// Measures are free text, so only "<amount> <unit> [anything else]" is converted.
const UNITS: [RegExp, Unit][] = [
  [/^(?:cups?|c)$/i, { kind: 'volume', system: 'us', base: 240 }],
  [/^(?:tablespoons?|tbsp?s?|tbls?|tbl)$/i, { kind: 'volume', system: 'us', base: 15 }],
  [/^(?:teaspoons?|tsps?)$/i, { kind: 'volume', system: 'us', base: 5 }],
  [/^(?:fl\.?\s?oz|fluid ounces?)$/i, { kind: 'volume', system: 'us', base: 29.57 }],
  [/^(?:pints?|pt)$/i, { kind: 'volume', system: 'us', base: 473 }],
  [/^(?:quarts?|qt)$/i, { kind: 'volume', system: 'us', base: 946 }],
  [/^(?:oz|ounces?)$/i, { kind: 'mass', system: 'us', base: 28.35 }],
  [/^(?:lbs?|pounds?)$/i, { kind: 'mass', system: 'us', base: 453.6 }],
  [/^(?:ml|millilit(?:re|er)s?)$/i, { kind: 'volume', system: 'metric', base: 1 }],
  [/^(?:cl|centilit(?:re|er)s?)$/i, { kind: 'volume', system: 'metric', base: 10 }],
  [/^(?:dl|decilit(?:re|er)s?)$/i, { kind: 'volume', system: 'metric', base: 100 }],
  [/^(?:l|lit(?:re|er)s?)$/i, { kind: 'volume', system: 'metric', base: 1000 }],
  [/^(?:g|grams?|gr|grammes?)$/i, { kind: 'mass', system: 'metric', base: 1 }],
  [/^(?:kg|kilos?|kilograms?)$/i, { kind: 'mass', system: 'metric', base: 1000 }],
];

const VULGAR: Record<string, number> = { '½': 1 / 2, '⅓': 1 / 3, '⅔': 2 / 3, '¼': 1 / 4, '¾': 3 / 4, '⅛': 1 / 8 };
const AMOUNT = String.raw`\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?\s*[½⅓⅔¼¾⅛]?|[½⅓⅔¼¾⅛]`;
const MEASURE = new RegExp(
  String.raw`^\s*(${AMOUNT})\s*([a-z]+(?:\.?\s?oz)?|fluid ounces?)\.?(?=\s|$|[,(/])(.*)$`,
  'i',
);

const parseAmount = (text: string) => {
  const value = text.trim().replace(',', '.');
  const mixed = value.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const fraction = value.match(/^(\d+)\/(\d+)$/);
  if (fraction) return Number(fraction[1]) / Number(fraction[2]);
  const vulgar = value.match(/^(\d*(?:\.\d+)?)\s*([½⅓⅔¼¾⅛])$/);
  if (vulgar) return Number(vulgar[1] || 0) + VULGAR[vulgar[2]!]!;
  return Number(value);
};

const decimal = new Intl.NumberFormat('en', { maximumFractionDigits: 1 });

// Kitchen fractions for US measures: 1 ½ cups, ¾ tsp.
const FRACTION_SYMBOLS: [number, string][] = [
  [0, ''],
  [1 / 4, '¼'],
  [1 / 3, '⅓'],
  [1 / 2, '½'],
  [2 / 3, '⅔'],
  [3 / 4, '¾'],
  [1, ''],
];
const formatFraction = (value: number) => {
  const whole = Math.floor(value);
  const [fraction, symbol] = FRACTION_SYMBOLS.reduce((best, candidate) =>
    Math.abs(value - whole - candidate[0]) < Math.abs(value - whole - best[0]) ? candidate : best,
  );
  const wholePart = whole + (fraction === 1 ? 1 : 0);
  if (!wholePart) return symbol || decimal.format(value);
  return symbol ? `${wholePart} ${symbol}` : String(wholePart);
};

const roundMetric = (value: number) => {
  if (value < 15) return Math.round(value * 2) / 2;
  if (value < 100) return Math.round(value);
  return Math.round(value / 5) * 5;
};

const toMetric = (kind: Kind, amount: number) => {
  if (kind === 'volume') return amount >= 1000 ? `${decimal.format(amount / 1000)} l` : `${roundMetric(amount)} ml`;
  return amount >= 1000 ? `${decimal.format(amount / 1000)} kg` : `${roundMetric(amount)} g`;
};

const toUs = (kind: Kind, amount: number) => {
  if (kind === 'mass') {
    if (amount >= 453.6) return `${formatFraction(amount / 453.6)} lb`;
    const ounces = amount / 28.35;
    return `${ounces >= 4 ? Math.round(ounces) : formatFraction(ounces)} oz`;
  }
  if (amount < 15) return `${formatFraction(amount / 5)} tsp`;
  if (amount < 60) return `${formatFraction(amount / 15)} tbsp`;
  const cups = amount / 240;
  return `${formatFraction(cups)} ${cups > 1.1 ? 'cups' : 'cup'}`;
};

/** Converts a measure such as "3/4 cup" or "500g" to metric or US units; anything else is returned as written. */
export const convertMeasure = (measure: string, system: UnitSystem) => {
  if (system === 'original') return measure;
  const match = measure.match(MEASURE);
  if (!match) return measure;

  const unit = UNITS.find(([pattern]) => pattern.test(match[2]!.trim()))?.[1];
  const amount = parseAmount(match[1]!);
  if (!unit || unit.system === system || !Number.isFinite(amount) || amount <= 0) return measure;
  // Spoons are used in metric kitchens too.
  if (system === 'metric' && unit.kind === 'volume' && unit.base <= 15) return measure;

  const rest = match[3]!;
  // "175g/6oz" already gives both: leave it.
  if (/^\s*\//.test(rest)) return measure;
  const converted = (system === 'metric' ? toMetric : toUs)(unit.kind, amount * unit.base);
  return `${converted}${rest}`.trim();
};
