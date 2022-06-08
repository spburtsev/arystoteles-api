import express from 'express';
import ChildController from '../controller/ChildController';
import AuthController from '../controller/AuthController';

const router = express.Router();

router.use(AuthController.protect);
router.get('/', ChildController.getAllChildren);
router.post('/', ChildController.createChild);
router
  .route('/:id')
  .get(ChildController.getChild)
  .patch(ChildController.updateChild)
  .delete(ChildController.deleteChild);

export default router;
