import express from 'express';
import ActivityController from '../controller/ActivityController';

const router = express.Router();

router.get('/', ActivityController.getAllActivities);
router.post('/', ActivityController.createActivity);
router
  .route('/:id')
  .get(ActivityController.getActivity)
  .patch(ActivityController.updateActivity)
  .delete(ActivityController.deleteActivity);

export default router;
