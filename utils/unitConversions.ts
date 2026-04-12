export type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume';

export interface Unit {
  label: string;
  value: string;
}

export const UNIT_CATEGORIES: { label: string; value: UnitCategory }[] = [
  { label: 'Length', value: 'length' },
  { label: 'Weight', value: 'weight' },
  { label: 'Temperature', value: 'temperature' },
  { label: 'Volume', value: 'volume' },
];

// All non-temperature units: toBase multiplier (base unit listed first)
const UNITS: Record<Exclude<UnitCategory, 'temperature'>, { label: string; value: string; factor: number }[]> = {
  length: [
    { label: 'Meter (m)', value: 'm', factor: 1 },
    { label: 'Kilometer (km)', value: 'km', factor: 1000 },
    { label: 'Centimeter (cm)', value: 'cm', factor: 0.01 },
    { label: 'Millimeter (mm)', value: 'mm', factor: 0.001 },
    { label: 'Inch (in)', value: 'in', factor: 0.0254 },
    { label: 'Foot (ft)', value: 'ft', factor: 0.3048 },
    { label: 'Yard (yd)', value: 'yd', factor: 0.9144 },
    { label: 'Mile (mi)', value: 'mi', factor: 1609.344 },
  ],
  weight: [
    { label: 'Kilogram (kg)', value: 'kg', factor: 1 },
    { label: 'Gram (g)', value: 'g', factor: 0.001 },
    { label: 'Milligram (mg)', value: 'mg', factor: 0.000001 },
    { label: 'Pound (lb)', value: 'lb', factor: 0.453592 },
    { label: 'Ounce (oz)', value: 'oz', factor: 0.0283495 },
    { label: 'Tonne (t)', value: 't', factor: 1000 },
  ],
  volume: [
    { label: 'Liter (L)', value: 'L', factor: 1 },
    { label: 'Milliliter (mL)', value: 'mL', factor: 0.001 },
    { label: 'US Gallon (gal)', value: 'gal', factor: 3.78541 },
    { label: 'US Fluid Oz (fl oz)', value: 'fl_oz', factor: 0.0295735 },
    { label: 'US Cup', value: 'cup', factor: 0.236588 },
    { label: 'Tablespoon (tbsp)', value: 'tbsp', factor: 0.0147868 },
    { label: 'Teaspoon (tsp)', value: 'tsp', factor: 0.00492892 },
  ],
};

const TEMP_UNITS = [
  { label: 'Celsius (°C)', value: 'C' },
  { label: 'Fahrenheit (°F)', value: 'F' },
  { label: 'Kelvin (K)', value: 'K' },
];

export const getUnitsForCategory = (cat: UnitCategory): Unit[] => {
  if (cat === 'temperature') return TEMP_UNITS;
  return UNITS[cat].map(({ label, value }) => ({ label, value }));
};

const toBase = (value: number, from: string, cat: Exclude<UnitCategory, 'temperature'>): number => {
  const unit = UNITS[cat].find((u) => u.value === from);
  if (!unit) throw new Error(`Unknown unit: ${from}`);
  return value * unit.factor;
};

const fromBase = (base: number, to: string, cat: Exclude<UnitCategory, 'temperature'>): number => {
  const unit = UNITS[cat].find((u) => u.value === to);
  if (!unit) throw new Error(`Unknown unit: ${to}`);
  return base / unit.factor;
};

const convertTemp = (value: number, from: string, to: string): number => {
  let celsius: number;
  if (from === 'C') celsius = value;
  else if (from === 'F') celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15;

  if (to === 'C') return celsius;
  if (to === 'F') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
};

export const convert = (value: number, from: string, to: string, cat: UnitCategory): number => {
  if (from === to) return value;
  if (cat === 'temperature') return convertTemp(value, from, to);
  const base = toBase(value, from, cat as Exclude<UnitCategory, 'temperature'>);
  return fromBase(base, to, cat as Exclude<UnitCategory, 'temperature'>);
};

export const formatResult = (n: number): string => {
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-4 && n !== 0)) {
    return n.toExponential(4);
  }
  const str = n.toPrecision(8);
  return parseFloat(str).toString();
};
