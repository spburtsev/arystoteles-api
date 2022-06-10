import express from 'express';
import NotificationController from '../controller/NotificationController';

const router = express.Router();

router.get('/', NotificationController.getAllNotifications);
router.post('/', NotificationController.createNotification);
router
  .route('/:id')
  .get(NotificationController.getNotification)
  .patch(NotificationController.updateNotification)
  .delete(NotificationController.deleteNotification);

export default router;
