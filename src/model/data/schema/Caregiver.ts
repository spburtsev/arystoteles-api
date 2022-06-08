import { Model, Schema, Document, model } from 'mongoose';
import { IUser } from './User';
import { IChildRelation } from './ChildRelation';

export interface ICaregiver extends Document {
  country: string;
  city: string;
  childRelations: Array<IChildRelation>;
  user: IUser;
}

const CaregiverSchema = new Schema({
  country: String,
  city: String,
  childRelations: [{ type: Schema.Types.ObjectId, ref: 'ChildRelation' }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Caregiver: Model<ICaregiver> = model('Caregiver', CaregiverSchema);
export default Caregiver;
