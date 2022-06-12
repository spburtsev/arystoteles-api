import express from 'express';
import MedicController from '../controller/MedicController';
import AuthController from '../controller/AuthController';
import UserRole from '../model/enum/UserRole';

const router = express.Router();

router.use(AuthController.protect);

router.get('/me', MedicController.getSelf);
router.patch('/updateMe', MedicController.updateSelf);
router.route('/').get(MedicController.getAllMedics);
router.route('/:id').get(MedicController.getMedic);

router.use(AuthController.restrictTo(UserRole.Seed, UserRole.Admin));
router
  .route('/:id')
  .patch(MedicController.updateMedic)
  .delete(MedicController.deleteMedic);

export default router;
