import AgeGroup from '../../model/enum/AgeGroup';
import AppLocale from '../../model/enum/AppLocale';
import QuestionCategory from '../../model/enum/QuestionCategory';
import { defaultScale3, yesNo, howOften3 } from '../template/option-scales';

const defaultExpectations = [
  {
    ageGroup: AgeGroup.Group1,
    value: 2,
  },
  {
    ageGroup: AgeGroup.Group2,
    value: 3,
  },
];

const questions = [
  {
    category: QuestionCategory.Developmental,
    text: {
      [AppLocale.English]: 'Looks when you call his or her name',
      [AppLocale.Ukrainian]: 'Виглядає коли ви викликаєте її назву',
    },
    options: defaultScale3,
    expectations: defaultExpectations,
  },
  {
    category: QuestionCategory.Developmental,
    text: {
      [AppLocale.English]: 'Makes sounds like "ga", "ma" or "ba"',
      [AppLocale.Ukrainian]: 'Говорить звуки "га", "ма" чи "ба"',
    },
    options: defaultScale3,
    expectations: defaultExpectations,
  },
  {
    category: QuestionCategory.Developmental,
    text: {
      [AppLocale.English]: 'Rolls over',
      [AppLocale.Ukrainian]: 'Перевертається',
    },
    options: defaultScale3,
    expectations: defaultExpectations,
  },
  {
    category: QuestionCategory.Developmental,
    text: {
      [AppLocale.English]: 'Passes a toy from one hand to the other',
      [AppLocale.Ukrainian]: 'Передає іграшку з однієї руки в іншу',
    },
    options: defaultScale3,
    expectations: defaultExpectations,
  },
  {
    category: QuestionCategory.Developmental,
    text: {
      [AppLocale.English]: 'Looks for you or another caregiver when upset',
      [AppLocale.Ukrainian]: 'Шукає вас чи іншого опікуна, коли засмучений',
    },
    options: defaultScale3,
    expectations: defaultExpectations,
  },
  {
    category: QuestionCategory.Developmental,
    text: {
      [AppLocale.English]: 'Holds two objects and bangs them together',
      [AppLocale.Ukrainian]: "Затискає два об'єкти і з'їжджає їх один з одним",
    },
    options: defaultScale3,
    expectations: defaultExpectations,
  },
  {
    category: QuestionCategory.Developmental,
    text: {
      [AppLocale.English]: 'Holds up arms to be picked up',
      [AppLocale.Ukrainian]: 'Піднімає руки, щоб його підняли',
    },
    options: defaultScale3,
    expectations: defaultExpectations,
  },
  {
    category: QuestionCategory.Developmental,
    text: {
      [AppLocale.English]: 'Gets into a sitting position by him or herself',
      [AppLocale.Ukrainian]: 'Приймає себе в сидячу позицію',
    },
    options: defaultScale3,
    expectations: defaultExpectations,
  },
  {
    category: QuestionCategory.Developmental,
    text: {
      [AppLocale.English]: 'Picks up food and eats it',
      [AppLocale.Ukrainian]: 'Бере їжу і їсть її',
    },
    options: defaultScale3,
    expectations: defaultExpectations,
  },
  {
    category: QuestionCategory.Developmental,
    text: {
      [AppLocale.English]: 'Pulls up to standing',
      [AppLocale.Ukrainian]: 'Підтягується до стояння',
    },
    options: defaultScale3,
    expectations: defaultExpectations,
  },
];
export default questions;
