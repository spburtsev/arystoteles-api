const monthDifference = (preceding: Date, next: Date) => {
  let months: number;
  months = (next.getFullYear() - preceding.getFullYear()) * 12;
  months -= preceding.getMonth();
  months += next.getMonth();
  return months <= 0 ? 0 : months;
};
export default monthDifference;

export const monthsPassed = (date: Date) => {
  const now = new Date();
  const months = monthDifference(date, now);
  return months;
};
