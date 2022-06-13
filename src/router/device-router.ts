import express from 'express';
import DeviceController from '../controller/DeviceController';

const router = express.Router();

router.get('/', DeviceController.getAllDevices);
router.post('/', DeviceController.createDevice);
router
  .route('/:id')
  .get(DeviceController.getDevice)
  .patch(DeviceController.updateDevice)
  .delete(DeviceController.deleteDevice);

export default router;
