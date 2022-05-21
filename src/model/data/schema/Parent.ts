import { Model, Schema, Document, model } from 'mongoose';
import { IUser } from './User';
import { IChild } from './Child';

export interface IParent extends Document {
  firstName: string;
  lastName: string;
  country: string;
  city: string;

  children: Array<IChild>;
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

  children: [{ type: Schema.Types.ObjectId, ref: 'Child' }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Parent: Model<IParent> = model('Parent', ParentSchema);
export default Parent;
