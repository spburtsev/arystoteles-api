enum AgeGroup {
  Group1 = 1, // 0 - 1 month
  Group2 = 2, // 1 - 4 months
  Group3 = 3, // 4 - 8 months
  Group4 = 4, // 8 - 12 months
  Group5 = 5, // 12 - 16 months
  Group6 = 6, // 16 - 20 months
  Group7 = 7, // 20 - 24 months
  Group8 = 8, // 24 - 30 months
  Group9 = 9, // 30 - 36 months
  Group10 = 10, // 36 - 48 months
  Group11 = 11, // 48 - 60 months
  Group12 = 12, // 60 - 66 months
  None = 13, // 66+ months
}
export default AgeGroup;

export const matchAgeGroup = (months: number) => {
  if (months < 1) {
    return AgeGroup.Group1;
  }
  if (months < 4) {
    return AgeGroup.Group2;
  }
  if (months < 8) {
    return AgeGroup.Group3;
  }
  if (months < 12) {
    return AgeGroup.Group4;
  }
  if (months < 16) {
    return AgeGroup.Group5;
  }
  if (months < 20) {
    return AgeGroup.Group6;
  }
  if (months < 24) {
    return AgeGroup.Group7;
  }
  if (months < 30) {
    return AgeGroup.Group8;
  }
  if (months < 36) {
    return AgeGroup.Group9;
  }
  if (months < 48) {
    return AgeGroup.Group10;
  }
  if (months < 60) {
    return AgeGroup.Group11;
  }
  if (months < 66) {
    return AgeGroup.Group12;
  }
  return AgeGroup.None;
};
