import type { UnitSystem } from '@/utils/units';

// Measures as written, or converted to metric or US units; remembered in this browser.
export const useUnitSystem = () => useLocalStorage<UnitSystem>('feast-finder:units', 'original');
