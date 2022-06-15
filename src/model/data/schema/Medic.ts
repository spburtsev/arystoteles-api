import { Model, Schema, Document, model } from 'mongoose';
import { IUser } from './User';
import { IOrganization } from './Organization';
import { IChild } from './Child';
import UserRole from '../../enum/UserRole';

export interface IMedic extends Document {
  title: string;
  user: IUser;
  organization: IOrganization;
  children: Array<IChild>;
  isConfirmed: boolean;
}

const MedicSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
  },
  children: {
    type: [Schema.Types.ObjectId],
    ref: 'Child',
  },
  isConfirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Medic: Model<IMedic> = model('Medic', MedicSchema);
export default Medic;
