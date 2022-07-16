import { Model, Schema, Document, model } from 'mongoose';
import { IChildRelation } from './ChildRelation';
import { IJournalPost } from './JournalPost';
import { IDailyActivity } from './DailyActivity';
import { IScreening } from './Screening';
import Question, { IQuestion } from './Question';
import { monthsPassed } from '../../../lib/helpers/month-difference';
import AgeGroup, { matchAgeGroup } from '../../enum/AgeGroup';
import Gender from '../../enum/Gender';
import { IMedic } from './Medic';
import { IDevice } from './Device';

export interface IChild extends Document {
  firstName: string;
  birthDate: Date;
  birthWeightPrimary: number;
  birthWeightSecondary: number;
  currentWeightPrimary?: number;
  currentWeightSecondary?: number;
  medic?: IMedic;
  relations: Array<IChildRelation>;
  journalPosts: Array<IJournalPost>;
  dailyActivities: Array<IDailyActivity>;
  ageGroup: AgeGroup;
  devices: Array<IDevice>;
  gender: Gender;
  isRelatedTo: (caregiverId: string) => boolean;
  isAssignedTo: (medicId: string) => boolean;
  getScreeningQuestions: () => Promise<Array<IQuestion & { _id: any }>>;
}

const ChildSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  birthWeightPrimary: {
    type: Number,
    required: true,
  },
  birthWeightSecondary: {
    type: Number,
    required: true,
  },
  currentWeightPrimary: {
    type: Number,
    required: false,
  },
  currentWeightSecondary: {
    type: Number,
    required: false,
  },
  relations: [{ type: Schema.Types.ObjectId, ref: 'ChildRelation' }],
  gender: {
    type: String,
    enum: Object.values(Gender),
    required: true,
  },
  medic: { type: Schema.Types.ObjectId, ref: 'Medic', required: false },
  journalPosts: [{ type: Schema.Types.ObjectId, ref: 'JournalPost' }],
  dailyActivities: [{ type: Schema.Types.ObjectId, ref: 'DailyActivity' }],
  devices: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
});

ChildSchema.virtual('ageGroup').get(function(this: IChild) {
  const months = monthsPassed(this.birthDate);
  return matchAgeGroup(months);
});

ChildSchema.virtual('birthWeightISO').get(function(this: IChild) {
  return {
    primary: this.birthWeightPrimary,
    secondary: this.birthWeightSecondary,
  };
});

ChildSchema.virtual('birthWeightPound').get(function(this: IChild) {
  return {
    primary: this.birthWeightPrimary * 2.2, // Pounds
    secondary: this.birthWeightSecondary * 0.035274, // Ounces
  };
});

ChildSchema.virtual('currentWeightISO').get(function(this: IChild) {
  return {
    primary: this.currentWeightPrimary,
    secondary: this.currentWeightSecondary,
  };
});

ChildSchema.virtual('currentWeightPound').get(function(this: IChild) {
  return {
    primary: this.currentWeightPrimary * 2.2, // Pounds
    secondary: this.currentWeightSecondary * 0.035274, // Ounces
  };
});

ChildSchema.methods.getScreeningQuestions = async function() {
  const relevantQuestions = await Question.find({
    expectations: { $elemMatch: { ageGroup: this.ageGroup } },
  }).exec();

  return relevantQuestions;
};

ChildSchema.methods.isRelatedTo = function(caregiverId: string) {
  return this.relations.some(
    (relation: IChildRelation) =>
      relation.caregiver._id.toString() === caregiverId,
  );
};

ChildSchema.methods.isAssignedTo = function(medicId: string) {
  return this.medic && this.medic.toString() === medicId;
};

const Child: Model<IChild> = model('Child', ChildSchema);
export default Child;
