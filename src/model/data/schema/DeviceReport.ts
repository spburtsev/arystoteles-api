import { Model, Schema, Document, model } from 'mongoose';
import { IDevice } from './Device';
import _LocalizedString from './types/_LocalizedString';
import LocalizedString from '../LocalizedString';
import AppLocale from '../../enum/AppLocale';

export interface IDeviceReport extends Document {
  createdAt: Date;
  device: IDevice;
  message: LocalizedString;
  data: string;

  localized: (locale: AppLocale) => any;
}

const DeviceReportSchema = new Schema({
  createdAt: { type: Date, required: true },
  device: { type: Schema.Types.ObjectId, ref: 'Device' },
  message: { type: _LocalizedString, required: true },
  data: { type: String, required: false },
});

DeviceReportSchema.methods.localized = function(locale: AppLocale) {
  return {
    createdAt: this.createdAt,
    message: this.message[locale],
    data: this.data,
  };
};

const DeviceReport: Model<IDeviceReport> = model(
  'DeviceReport',
  DeviceReportSchema,
);
export default DeviceReport;
