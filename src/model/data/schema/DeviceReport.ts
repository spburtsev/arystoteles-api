import { Model, Schema, Document, model } from 'mongoose';
import { IDevice } from './Device';
import _LocalizedString from './types/_LocalizedString';
import LocalizedString from '../LocalizedString';

export interface IDeviceReport extends Document {
  cratedAt: Date;
  device: IDevice;
  message: LocalizedString;
  data: string;
}

const DeviceReportSchema = new Schema({
  cratedAt: { type: Date, required: true },
  device: { type: Schema.Types.ObjectId, ref: 'Device' },
  message: { type: _LocalizedString, required: true },
  data: { type: String, required: false },
});

const DeviceReport: Model<IDeviceReport> = model(
  'DeviceReport',
  DeviceReportSchema,
);
export default DeviceReport;
