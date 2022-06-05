import { Model, Schema, Document, model } from 'mongoose';
import ActivityCategory from 'src/model/enum/ActivityCategory';
import ActivityFrequency from 'src/model/enum/ActivityFrequency';
import AgeGroup from 'src/model/enum/AgeGroup';
import {
  LocalizedString,
  LocalizedStringSchemaType,
} from '../LocalizedContent';

export interface IActivity extends Document {
  category: ActivityCategory;
  ageGroups: Array<AgeGroup>;
  duration: number;
  frequency: ActivityFrequency;
  title: LocalizedString;
  description: LocalizedString;
}

const ActivitySchema = new Schema({
  category: { type: ActivityCategory, required: true },
  ageGroups: [{ type: AgeGroup, required: true }],
  duration: { type: Number, required: true },
  frequency: { type: ActivityFrequency, required: true },
  title: { type: LocalizedStringSchemaType, required: true },
  description: { type: LocalizedStringSchemaType, required: true },
});

const Activity: Model<IActivity> = model('Activity', ActivitySchema);
export default Activity;
