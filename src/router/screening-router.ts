import express from 'express';
import ScreeningController from '../controller/ScreeningController';
import AuthController from '../controller/AuthController';
import UserRole from '../model/enum/UserRole';

const router = express.Router();

router.use(AuthController.protect);
router.post('/monthly/:childId', ScreeningController.getMonthlyScreening);
router.get('/history/:childId', ScreeningController.getScreeningHistory);
router.patch('/modify/:id', ScreeningController.modifyScreening);

router.use(AuthController.restrictTo(UserRole.Admin, UserRole.Seed));
router.get('/', ScreeningController.getAllScreenings);
router.post('/', ScreeningController.createScreening);
router
  .route('/:id')
  .get(ScreeningController.getScreening)
  .patch(ScreeningController.updateScreening)
  .delete(ScreeningController.deleteScreening);

export default router;
