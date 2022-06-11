import Question from '../src/model/data/schema/Question';
import AppLocale from '../src/model/enum/AppLocale';

describe('Verify Question schema functionality', () => {
  const q1 = new Question({
    text: {
      [AppLocale.English]: 'Wow!',
      [AppLocale.Ukrainian]: 'їаві',
    },
  });
  const q2 = new Question({});
  const q3 = new Question({});

  test('Verify question localization', () => {
    const q1En = q1.localized(AppLocale.English);
    const q1Uk = q1.localized(AppLocale.Ukrainian);
    expect(q1En.text).toBe('Wow!');
    expect(q1Uk.text).toBe('їаві');
  });
});
