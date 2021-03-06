import express from 'express';
import MedicController from '../controller/MedicController';
import AuthController from '../controller/AuthController';
import UserRole from '../model/enum/UserRole';

const router = express.Router();

router.use(AuthController.protect);

router
  .route('/me')
  .get(MedicController.getSelf)
  .patch(MedicController.updateSelf)
  .post(MedicController.createSelf);

router.patch('/confirm/:id', MedicController.confirm);
router.route('/').get(MedicController.getAllMedics);
router.route('/:id').get(MedicController.getMedic);

router.use(AuthController.restrictTo(UserRole.Seed, UserRole.Admin));
router
  .route('/:id')
  .patch(MedicController.updateMedic)
  .delete(MedicController.deleteMedic);

export default router;
