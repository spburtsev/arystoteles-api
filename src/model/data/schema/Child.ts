import { Model, Schema, Document, model } from 'mongoose';
import { IParent } from './Parent';

export interface IChild extends Document {
  firstName: string;

  parents: Array<IParent>;
}

const ParentSchema = new Schema({
  firstName: {
    type: String,
    required: false,
    default: '',
  },

  parents: [{ type: Schema.Types.ObjectId, ref: 'Parent' }],
});

const Parent: Model<IParent> = model('Parent', ParentSchema);
export default Parent;
