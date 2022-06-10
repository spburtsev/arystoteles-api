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
      [AppLocale.English]: 'Makes sounds like "ga", "ma" or "ba"',
      [AppLocale.Ukrainian]: 'Говорить звуки "га", "ма" чи "ба"',
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
];
export default questions;
