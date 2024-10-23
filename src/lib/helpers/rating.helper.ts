export const mapRating = (
  rates: { rating: { rate: number } | null }[]
): { rate: number; rateNumber: number } | null => {
  const rateNumber = rates.filter((item) => item.rating !== null).length;
  if (rateNumber === 0) {
    return null;
  }
  const rating = rates
    .map((item) => (item.rating === null ? 0 : item.rating.rate))
    .reduce((acc, curr) => acc + curr, 0) / rateNumber;
  return { rate: rating, rateNumber}
};
