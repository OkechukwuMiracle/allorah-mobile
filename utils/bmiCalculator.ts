export interface BMIResult {
  bmi: number;
  category: string;
  color: string;
}

export const calculateBMI = (weightKg: number, heightM: number): BMIResult => {
  const bmi = weightKg / (heightM * heightM);

  let category: string;
  let color: string;

  if (bmi < 18.5) {
    category = 'Underweight';
    color = '#3B82F6';
  } else if (bmi < 25) {
    category = 'Normal weight';
    color = '#10B981';
  } else if (bmi < 30) {
    category = 'Overweight';
    color = '#F59E0B';
  } else {
    category = 'Obese';
    color = '#EF4444';
  }

  return { bmi: parseFloat(bmi.toFixed(2)), category, color };
};

export const lbsToKg = (lbs: number): number => lbs * 0.453592;
export const inchesToM = (inches: number): number => inches * 0.0254;
export const ftInToM = (feet: number, inches: number): number =>
  (feet * 12 + inches) * 0.0254;
