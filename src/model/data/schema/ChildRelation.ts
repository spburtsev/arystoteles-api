import { Model, Schema, Document, model } from 'mongoose';
import ChildRelationType from '../../enum/ChildRelationType';
import { IChild } from './Child';
import { IUser } from './User';
import { IJournalPost } from './JournalPost';
import { IScreening } from './Screening';

export interface IChildRelation extends Document {
  relationType: ChildRelationType;
  child: IChild;
  caregiver: IUser;
  journalPosts: Array<IJournalPost>;
  screenings: Array<IScreening>;
}

const ChildRelationSchema = new Schema({
  relationType: {
    type: String,
    required: true,
    enum: Object.values(ChildRelationType),
  },
  child: { type: Schema.Types.ObjectId, ref: 'Child' },
  caregiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  journalPosts: [{ type: Schema.Types.ObjectId, ref: 'JournalPost' }],
  screenings: [{ type: Schema.Types.ObjectId, ref: 'Screening' }],
});

const ChildRelation: Model<IChildRelation> = model(
  'ChildRelation',
  ChildRelationSchema,
);
export default ChildRelation;
