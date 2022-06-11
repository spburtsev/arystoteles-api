import Child from '../src/model/data/schema/Child';
import AgeGroup from '../src/model/enum/AgeGroup';

describe('Verify Child schema functionality', () => {
  const child = new Child({
    firstName: 'Anton',
    birthDate: new Date(),
    birthWeightPrimary: 12,
    birthWeightSecondary: 13,
  });

  test("Determining Child's AgeGroup", () => {
    expect(child.ageGroup).toBe(AgeGroup.Group1);
  });
});
