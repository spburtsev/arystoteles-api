import { Model, Schema, Document, model } from 'mongoose';
import ActivityCategory from '../../../model/enum/ActivityCategory';
import ActivityFrequency from '../../../model/enum/ActivityFrequency';
import AgeGroup from '../../../model/enum/AgeGroup';
import LocalizedString from '../LocalizedString';
import _LocalizedString from './types/_LocalizedString';

export interface IActivity extends Document {
  category: ActivityCategory;
  ageGroups: Array<AgeGroup>;
  duration: number;
  frequency: ActivityFrequency;
  title: LocalizedString;
  description: LocalizedString;
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

const Activity: Model<IActivity> = model('Activity', ActivitySchema);
export default Activity;
