import { Model, Schema, Document, model } from 'mongoose';
import ChildRelationType from '../../../model/enum/ChildRelationType';
import { IChild } from './Child';
import { IUser } from './User';

export interface IChildRelation extends Document {
  relationType: ChildRelationType;
  child: IChild;
  caregiver: IUser;
}

const ChildRelationSchema = new Schema({
  relationType: {
    type: ChildRelationType,
    required: true,
  },
  child: { type: Schema.Types.ObjectId, ref: 'Child' },
  caregiverld: { type: Schema.Types.ObjectId, ref: 'User' },
});

const ChildRelation: Model<IChildRelation> = model(
  'ChildRelation',
  ChildRelationSchema,
);
export default ChildRelation;
