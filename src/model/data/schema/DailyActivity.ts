import { Model, Schema, Document, model } from 'mongoose';
import { IActivity } from './Activity';
import { IChild } from './Child';
import { ICaregiver } from './Caregiver';

export interface IDailyActivity extends Document {
  activity: IActivity;
  date: Date;
  completed: boolean;
  child: IChild;
  caregiver: ICaregiver;
}

const DailyActivitySchema = new Schema({
  activity: { type: Schema.Types.ObjectId, ref: 'Activity' },
  date: { type: Date, required: true },
  completed: { type: Boolean, required: false, default: false },
  child: { type: Schema.Types.ObjectId, ref: 'Child' },
  caregiver: { type: Schema.Types.ObjectId, ref: 'Caregiver' },
});

const DailyActivity: Model<IDailyActivity> = model(
  'DailyActivity',
  DailyActivitySchema,
);
export default DailyActivity;
