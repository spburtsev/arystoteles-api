import express from 'express';
import NotificationController from '../controller/NotificationController';
import AuthController from '../controller/AuthController';
import UserRole from '../model/enum/UserRole';

const router = express.Router();

router.use(AuthController.protect);
router.get('/', NotificationController.getOwnNotifications);
router.patch('/:id', NotificationController.readNotification);

router.use(AuthController.restrictTo(UserRole.Admin, UserRole.Seed));
router.get('/admin', NotificationController.getAllNotifications);
router.post('/admin', NotificationController.createNotification);
router
  .route('/admin/:id')
  .get(NotificationController.getNotification)
  .patch(NotificationController.updateNotification)
  .delete(NotificationController.deleteNotification);

export default router;
