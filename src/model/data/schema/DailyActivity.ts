import { Model, Schema, Document, model } from 'mongoose';
import { IActivity } from './Activity';
import { IChild } from './Child';
import { ICaregiver } from './Caregiver';

export interface IDailyActivity extends Document {
  activity: IActivity;
  date: Date;
  child: IChild;
  caregiver?: ICaregiver;
  isCompleted: boolean;

  transform: () => {
    activity: IActivity;
    date: Date;
    child: IChild;
    completed: boolean;
  };

  complete: (value: boolean, caregiver: ICaregiver) => void;
}

const DailyActivitySchema = new Schema({
  activity: { type: Schema.Types.ObjectId, ref: 'Activity' },
  date: { type: Date, required: true },
  child: { type: Schema.Types.ObjectId, ref: 'Child' },
  caregiver: { type: Schema.Types.ObjectId, ref: 'Caregiver', required: false },
});

DailyActivitySchema.virtual('isCompleted').get(function() {
  return !!this.caregiver;
});

DailyActivitySchema.methods.transform = function() {
  return {
    activity: this.activity,
    date: this.date,
    child: this.child,
    isCompleted: this.isCompleted,
  };
};

DailyActivitySchema.methods.complete = function(
  value: boolean,
  caregiver: ICaregiver,
) {
  if (value === this.isCompleted) {
    throw new Error('DailyActivity is already completed');
  }
  this.caregiver = value ? caregiver : undefined;
};

const DailyActivity: Model<IDailyActivity> = model(
  'DailyActivity',
  DailyActivitySchema,
);
export default DailyActivity;
