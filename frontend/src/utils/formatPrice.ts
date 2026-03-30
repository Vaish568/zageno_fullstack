export const formatPrice = (price: number | string): string => {
  const numPrice = Number(price);
  return numPrice.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
