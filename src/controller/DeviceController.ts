import Device from '../model/data/schema/Device';
import DeviceReport from '../model/data/schema/DeviceReport';
import CrudFactory from './factory/CrudFactory';
import catchAsync from '../lib/helpers/catch-async';

namespace DeviceController {
  export const getReports = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const device = await Device.findById(id).populate({
      path: 'reports',
    });
    if (!device) {
      return next(new Error('No device found'));
    }
    const reports = device.localizedReports(req.locale);
    return res.status(200).json({
      status: 'success',
      total: reports.length,
      reports,
    });
  });
  export const createReport = CrudFactory.createOne(DeviceReport);

  export const createDevice = CrudFactory.createOne(Device);
  export const getDevice = CrudFactory.getOne(Device);
  export const getAllDevices = CrudFactory.getAll(Device);
  export const updateDevice = CrudFactory.updateOne(Device);
  export const deleteDevice = CrudFactory.deleteOne(Device);
}
export default DeviceController;
