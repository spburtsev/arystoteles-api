import { Model, Schema, Document, model } from 'mongoose';
import { IActivity } from './Activity';
import { IChild } from './Child';
import { ICaregiver } from './Caregiver';

export interface IDailyActivity extends Document {
  activity: IActivity;
  date: Date;
  child: IChild;
  caregiver?: ICaregiver;
}

const DailyActivitySchema = new Schema({
  activity: { type: Schema.Types.ObjectId, ref: 'Activity' },
  date: { type: Date, required: true },
  child: { type: Schema.Types.ObjectId, ref: 'Child' },
  caregiver: { type: Schema.Types.ObjectId, ref: 'Caregiver', required: false },
});

DailyActivitySchema.virtual<boolean>('isCompleted').get(function(
  this: IDailyActivity,
) {
  return !!this.caregiver;
});

const DailyActivity: Model<IDailyActivity> = model(
  'DailyActivity',
  DailyActivitySchema,
);
export default DailyActivity;
