export interface StepDuration {
  /** The text as written in the step, e.g. "35 minutes" or "1 hour 15 minutes". */
  label: string;
  seconds: number;
}

const WORDS: Record<string, number> = {
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  fifteen: 15,
  twenty: 20,
  thirty: 30,
  forty: 40,
  'forty-five': 45,
  sixty: 60,
  'half an': 0.5,
  'half a': 0.5,
};
const FRACTIONS: Record<string, number> = { '½': 0.5, '¼': 0.25, '¾': 0.75 };
const UNIT_SECONDS: Record<string, number> = { h: 3600, m: 60, s: 1 };

const NUMBER = `\\d+(?:\\.\\d+)?(?:\\s*[½¼¾])?|\\d+\\s+\\d\\/\\d|\\d\\/\\d|[½¼¾]|${Object.keys(WORDS)
  .sort((a, b) => b.length - a.length)
  .join('|')}`;
// "35 minutes", "20-25 mins", "1 1/2 hours", "half an hour", "an hour and 15 minutes"
const DURATION = new RegExp(
  `\\b(${NUMBER})(?:\\s*(?:-|–|to)\\s*(${NUMBER}))?\\s*(hours?|hrs?|minutes?|mins?|seconds?|secs?)\\b`,
  'gi',
);
// Joins "1 hour" and "15 minutes" when only a space or "and" separates them.
const JOINER = /^\s*(?:and\s+)?$/i;

const parseNumber = (text: string) => {
  const value = text.trim().toLowerCase();
  if (value in WORDS) return WORDS[value]!;
  if (value in FRACTIONS) return FRACTIONS[value]!;
  const mixed = value.match(/^(\d+)\s+(\d)\/(\d)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const fraction = value.match(/^(\d)\/(\d)$/);
  if (fraction) return Number(fraction[1]) / Number(fraction[2]);
  const withSymbol = value.match(/^(\d+(?:\.\d+)?)\s*([½¼¾])$/);
  if (withSymbol) return Number(withSymbol[1]) + FRACTIONS[withSymbol[2]!]!;
  return Number(value);
};

/**
 * Finds cooking times in a recipe step. For a range ("20-25 minutes") the timer uses the lower
 * value, the moment to start checking.
 */
export const findDurations = (step: string): StepDuration[] => {
  const found: (StepDuration & { start: number; end: number; unit: number })[] = [];

  for (const match of step.matchAll(DURATION)) {
    const unit = UNIT_SECONDS[match[3]!.charAt(0).toLowerCase()]!;
    const seconds = Math.round(parseNumber(match[1]!) * unit);
    if (!seconds || seconds > 48 * 3600) continue;

    const start = match.index;
    const end = start + match[0].length;
    const previous = found.at(-1);
    if (previous && previous.unit > unit && JOINER.test(step.slice(previous.end, start))) {
      previous.label = step.slice(previous.start, end);
      previous.seconds += seconds;
      previous.end = end;
      previous.unit = unit;
    } else {
      found.push({ label: match[0], seconds, start, end, unit });
    }
  }

  return found.map(({ label, seconds }) => ({ label, seconds }));
};

/** "1:05:00", "35:00", "0:45" */
export const formatCountdown = (milliseconds: number) => {
  const total = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = String(total % 60).padStart(2, '0');
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${seconds}` : `${minutes}:${seconds}`;
};
