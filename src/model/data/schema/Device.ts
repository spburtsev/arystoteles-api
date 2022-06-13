import { Model, Schema, Document, model } from 'mongoose';
import { IChild } from './Child';
import { IDeviceReport } from './DeviceReport';
import _LocalizedString from './types/_LocalizedString';
import AppLocale from '../../enum/AppLocale';

export interface IDevice extends Document {
  name: string;
  child: IChild;
  reports: Array<IDeviceReport>;
  localizedReports: (locale: AppLocale) => Array<IDeviceReport>;
}

const DeviceSchema = new Schema({
  name: { type: String, required: true },
  child: { type: Schema.Types.ObjectId, ref: 'Child' },
  reports: [{ type: Schema.Types.ObjectId, ref: 'DeviceReport' }],
});

DeviceSchema.methods.localizedReports = function(locale: AppLocale) {
  return this.reports.map((report: IDeviceReport) => report.localized(locale));
};

const Device: Model<IDevice> = model('Device', DeviceSchema);
export default Device;
