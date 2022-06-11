import express from 'express';
import DailyActivityController from '../controller/DailyActivityController';
import AuthController from '../controller/AuthController';

const router = express.Router();

router.use(AuthController.protect);
router
  .route('/by-child/:childId')
  .get(DailyActivityController.getDailyActivities);
router.route('/:id').patch(DailyActivityController.updateDailyActivity);

export default router;
