import { Model, Schema, Document, model } from 'mongoose';
import { IUser } from './User';
import { IOrganization } from './Organization';

export interface IMedic extends Document {
  title: string;
  isConfirmed: boolean;
  user: IUser;
  organization: IOrganization;
}

const MedicSchema = new Schema({
  title: {
    type: String,
    required: false,
    default: '',
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

MedicSchema.virtual('isConfirmed').get(function() {
  return !!this.organization;
});

const Medic: Model<IMedic> = model('Medic', MedicSchema);
export default Medic;
