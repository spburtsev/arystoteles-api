import express from 'express';
import ChildController from '../controller/ChildController';
import AuthController from '../controller/AuthController';

const router = express.Router();

router.use(AuthController.protect);

router
  .route('/')
  .get(ChildController.getAllChildren)
  .post(ChildController.createChild);

router
  .route('/:id')
  .get(ChildController.getChild)
  .patch(ChildController.updateChild)
  .delete(ChildController.deleteChild);

router.route('/related').get(ChildController.getRelatedChildren);

export default router;
