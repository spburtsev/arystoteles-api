import { Model, Schema, Document, model } from 'mongoose';
import AppLocale from '../../enum/AppLocale';
import ActivityCategory from '../../enum/ActivityCategory';
import ActivityFrequency from '../../enum/ActivityFrequency';
import AgeGroup from '../../enum/AgeGroup';
import LocalizedString from '../LocalizedString';
import _LocalizedString from './types/_LocalizedString';

export interface IActivity extends Document {
  category: ActivityCategory;
  ageGroups: Array<AgeGroup>;
  duration: number;
  frequency: ActivityFrequency;
  title: LocalizedString;
  description: LocalizedString;

  localized: (locale: AppLocale) => any;
}

const ActivitySchema = new Schema({
  category: {
    type: String,
    required: true,
    enum: Object.values(ActivityCategory),
  },
  ageGroups: [{ type: String, required: true, enum: Object.values(AgeGroup) }],
  duration: { type: Number, required: true },
  frequency: {
    type: String,
    required: true,
    enum: Object.values(ActivityFrequency),
  },
  title: { type: _LocalizedString, required: true },
  description: { type: _LocalizedString, required: true },
});

ActivitySchema.methods.localized = function(locale: AppLocale) {
  return {
    category: this.category,
    duration: this.duration,
    frequency: this.frequency,
    title: this.title[locale],
    description: this.description[locale],
  };
};

const Activity: Model<IActivity> = model('Activity', ActivitySchema);
export default Activity;
