import { Model, Schema, Document, model } from 'mongoose';
import { IActivity } from './Activity';
import { IChild } from './Child';
import { IUser } from './User';
import AppLocale from '../../enum/AppLocale';

export interface IDailyActivity extends Document {
  activity: IActivity;
  date: Date;
  child: IChild;
  caregiver?: IUser;
  isCompleted: boolean;
  localized: (locale: AppLocale) => any;
  complete: (value: boolean, caregiver: IUser) => void;
}

const DailyActivitySchema = new Schema({
  activity: { type: Schema.Types.ObjectId, ref: 'Activity' },
  date: { type: Date, required: true },
  child: { type: Schema.Types.ObjectId, ref: 'Child' },
  caregiver: { type: Schema.Types.ObjectId, ref: 'User', required: false },
});

DailyActivitySchema.virtual('isCompleted').get(function() {
  return !!this.caregiver;
});

DailyActivitySchema.methods.localized = function(locale: AppLocale) {
  return {
    id: this._id,
    activity: this.activity.localized(locale),
    isCompleted: this.isCompleted,
    completedBy: this.isCompleted ? this.caregiver : null,
  };
};

DailyActivitySchema.methods.complete = function(
  value: boolean,
  caregiver: IUser,
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
