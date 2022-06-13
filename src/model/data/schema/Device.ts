import { Model, Schema, Document, model } from 'mongoose';
import { IChild } from './Child';
import _LocalizedString from './types/_LocalizedString';

export interface IDevice extends Document {
  name: string;
  child: IChild;
}

const DeviceSchema = new Schema({
  name: { type: String, required: true },
  child: { type: Schema.Types.ObjectId, ref: 'Child' },
});

const Device: Model<IDevice> = model('Device', DeviceSchema);
export default Device;
