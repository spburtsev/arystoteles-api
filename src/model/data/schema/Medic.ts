import { Model, Schema, Document, model } from 'mongoose';
import { IUser } from './User';
import { IOrganization } from './Organization';

export interface IMedic extends Document {
  firstName: string;
  lastName: string;
  title: string;
  isConfirmed: boolean;

  user: IUser;
  organization: IOrganization;
}

const MedicSchema = new Schema({
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
  title: {
    type: String,
    required: false,
    default: '',
  },
  isConfirmed: {
    type: Boolean,
    required: false,
    default: false,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
  },
});

const Medic: Model<IMedic> = model('Medic', MedicSchema);
export default Medic;
