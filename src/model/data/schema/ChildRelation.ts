import { Model, Schema, Document, model } from 'mongoose';
import ChildRelationType from '../../enum/ChildRelationType';
import { IChild } from './Child';
import { IUser } from './User';
import { IJournalPost } from './JournalPost';

export interface IChildRelation extends Document {
  relationType: ChildRelationType;
  child: IChild;
  caregiver: IUser;
  journalPosts: Array<IJournalPost>;
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
});

const ChildRelation: Model<IChildRelation> = model(
  'ChildRelation',
  ChildRelationSchema,
);
export default ChildRelation;
