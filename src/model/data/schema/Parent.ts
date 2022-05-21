import { Model, Schema, Document, model } from 'mongoose';
import { IUser } from './User';

export interface IParent extends Document {
  firstName: string;
  lastName: string;
  country: string;
  city: string;

  user: IUser;
}
const ParentSchema = new Schema({
  firstName: {
    type: String,
    required: false,
    default: '?',
  },
  lastName: {
    type: String,
    required: false,
    default: '?',
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Parent: Model<IParent> = model('Parent', ParentSchema);
export default Parent;
