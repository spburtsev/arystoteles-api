import AgeGroup from '../../model/enum/AgeGroup';
import ActivityCategory from '../../model/enum/ActivityCategory';
import ActivityFrequency from '../../model/enum/ActivityFrequency';
import AppLocale from '../../model/enum/AppLocale';
import LocalizedString from 'src/model/data/LocalizedString';

const activities = [
  {
    category: ActivityCategory.Social,
    ageGroups: [AgeGroup.Group1, AgeGroup.Group2],
    duration: 5,
    frequency: ActivityFrequency.MultiplePerDay,
    title: {
      [AppLocale.English]: 'Bonding with your baby throught talking',
      [AppLocale.Ukrainian]: 'Соціальний',
    },
    description: {
      [AppLocale.English]: `It's only been a few days, but your baby already knows they can rely on you. Talk to them often as an expression love and comfort.`,
      [AppLocale.Ukrainian]: 'Соціальний',
    },
  },
  {
    category: ActivityCategory.Movement,
    ageGroups: [AgeGroup.Group1, AgeGroup.Group2],
    duration: 5,
    frequency: ActivityFrequency.MultiplePerDay,
    title: {
      [AppLocale.English]: 'Holding your baby closely',
      [AppLocale.Ukrainian]: 'Що',
    },
    description: {
      [AppLocale.English]:
        'Though their movements are still random and jerky, your baby can start snuggling by week three. As you hold them, watch how they adjust their posture towards you',
      [AppLocale.Ukrainian]: '',
    },
  },
  {
    category: ActivityCategory.Language,
    ageGroups: [AgeGroup.Group1],
    duration: 5,
    frequency: ActivityFrequency.MultiplePerDay,
    title: {
      [AppLocale.English]: `Mimicking your baby's sounds and expressions`,
      [AppLocale.Ukrainian]: 'Що',
    },
    description: {
      [AppLocale.English]:
        'Have you noticed your baby using their vocals chords in ways other than crying? Babies learn by mimicking, so replay their sounds back to them to promote newborn developmental mmilestones',
      [AppLocale.Ukrainian]: '',
    },
  },
];
export default activities;
