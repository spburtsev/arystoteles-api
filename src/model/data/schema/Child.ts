import { Model, Schema, Document, model } from 'mongoose';
import { IChildRelation } from './ChildRelation';
import { IJournalPost } from './JournalPost';
import { monthsPassed } from 'src/lib/helpers/month-difference';
import { matchAgeGroup } from 'src/model/enum/AgeGroup';

export interface IChild extends Document {
  firstName: string;
  birthDate: Date;

  birthWeightPrimary: number;
  birthWeightSecondary: number;
  currentWeightPrimary: number;
  currentWeightSecondary: number;

  relations: Array<IChildRelation>;
  journalPosts: Array<IJournalPost>;
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
  journalPosts: [{ type: Schema.Types.ObjectId, ref: 'JournalPost' }],
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

const Child: Model<IChild> = model('Child', ChildSchema);
export default Child;
