export const formatCurrency = (value: number | undefined | null): string => {
  if (value == null) return "—";
  return `₪${value.toLocaleString("he-IL")}`;
};

export const formatPercent = (value: number | undefined | null): string => {
  if (value == null) return "—";
  return `${(value * 100).toFixed(2)}%`;
};