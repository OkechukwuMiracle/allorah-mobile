export interface TipResult {
  tipAmount: number;
  totalAmount: number;
  perPerson: number;
  tipPerPerson: number;
}

export const calculateTip = (
  billAmount: number,
  tipPercent: number,
  people: number
): TipResult => {
  const tipAmount = billAmount * (tipPercent / 100);
  const totalAmount = billAmount + tipAmount;
  const perPerson = totalAmount / people;
  const tipPerPerson = tipAmount / people;

  return {
    tipAmount: parseFloat(tipAmount.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    perPerson: parseFloat(perPerson.toFixed(2)),
    tipPerPerson: parseFloat(tipPerPerson.toFixed(2)),
  };
};
