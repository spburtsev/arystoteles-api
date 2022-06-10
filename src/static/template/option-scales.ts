import AgeGroup from '../../model/enum/AgeGroup';
import ActivityCategory from '../../model/enum/ActivityCategory';
import ActivityFrequency from '../../model/enum/ActivityFrequency';
import AppLocale from '../../model/enum/AppLocale';

export const defaultScale3 = [
  {
    value: 1,
    text: {
      [AppLocale.English]: 'No',
      [AppLocale.Ukrainian]: 'Ні',
    },
  },
  {
    value: 2,
    text: {
      [AppLocale.English]: 'Somewhat',
      [AppLocale.Ukrainian]: 'Більш-менш',
    },
  },
  {
    value: 3,
    text: {
      [AppLocale.English]: 'Very Much',
      [AppLocale.Ukrainian]: 'Так, дуже',
    },
  },
];

export const yesNo = [
  {
    value: 0,
    text: {
      [AppLocale.English]: 'No',
      [AppLocale.Ukrainian]: 'Ні',
    },
  },
  {
    value: 1,
    text: {
      [AppLocale.English]: 'Yes',
      [AppLocale.Ukrainian]: 'Так',
    },
  },
];

export const howOften3 = [
  {
    value: 0,
    text: {
      [AppLocale.English]: 'Never',
      [AppLocale.Ukrainian]: 'Ніколи',
    },
  },
  {
    value: 1,
    text: {
      [AppLocale.English]: 'Sometimes',
      [AppLocale.Ukrainian]: 'Іноді',
    },
  },
  {
    value: 2,
    text: {
      [AppLocale.English]: 'Often',
      [AppLocale.Ukrainian]: 'Часто',
    },
  },
];
