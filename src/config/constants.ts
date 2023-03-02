
export const dateInputFormat = 'DD / MM / YYYY';
export const minMoneyValue = '0.01' as string;
export const simpleCurrencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatDate = (date?: string): string|null => {
  const doesNotHaveContent = (date ?? null) === null;
  if (doesNotHaveContent) {
    return null;
  }
  const dateObj = new Date(date as string);
  return dateObj.toLocaleDateString('as-MX', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
};
export const formatCurrency = (amount?: number): string|null => {
  const doesNotHaveContent = (amount ?? null) === null;
  if (doesNotHaveContent) {
    return null;
  }
  return simpleCurrencyFormat.format(amount as number)
};
