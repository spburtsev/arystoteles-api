import Device from '../model/data/schema/Device';
import CrudFactory from './factory/CrudFactory';

namespace DeviceController {
  export const createDevice = CrudFactory.createOne(Device);
  export const getDevice = CrudFactory.getOne(Device);
  export const getAllDevices = CrudFactory.getAll(Device);
  export const updateDevice = CrudFactory.updateOne(Device);
  export const deleteDevice = CrudFactory.deleteOne(Device);
}
export default DeviceController;
