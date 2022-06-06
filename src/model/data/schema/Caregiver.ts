import { Model, Schema, Document, model } from 'mongoose';
import { IUser } from './User';
import { IChildRelation } from './ChildRelation';

export interface ICaregiver extends Document {
  firstName: string;
  lastName: string;
  country: string;
  city: string;

  childRelations: Array<IChildRelation>;
  user: IUser;
}

const CaregiverSchema = new Schema({
  firstName: {
    type: String,
    required: false,
    default: '',
  },
  lastName: {
    type: String,
    required: false,
    default: '',
  },

  childRelations: [{ type: Schema.Types.ObjectId, ref: 'ChildRelation' }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Caregiver: Model<ICaregiver> = model('Caregiver', CaregiverSchema);
export default Caregiver;
