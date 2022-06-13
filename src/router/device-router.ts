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

router.route('/:id/reports').get(DeviceController.getReports);
router.route('/:id/reports').post(DeviceController.createReport);

export default router;
