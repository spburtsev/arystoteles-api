import Notification from '../model/data/schema/Notification';
import CrudFactory from './factory/CrudFactory';
import AppError from '../model/error/AppError';
import catchAsync from '../lib/helpers/catch-async';

namespace NotificationController {
  export const getOwnNotifications = catchAsync(async (req, res, next) => {
    let notifications = await Notification.find({ user: req.user.id });
    if (!notifications) {
      notifications = [];
    }
    res.status(200).json({
      status: 'success',
      data: {
        total: notifications.length,
        notifications,
      },
    });
  });

  export const readNotification = catchAsync(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id);
    if (notification.user._id !== req.user.id) {
      return next(
        new AppError('You are not authorized to read this notification', 403),
      );
    }
    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }
    notification.read = true;
    await notification.save();
    res.status(200).json({
      status: 'success',
      data: {
        notification,
      },
    });
  });

  export const createNotification = CrudFactory.createOne(Notification);
  export const getNotification = CrudFactory.getOne(Notification);
  export const getAllNotifications = CrudFactory.getAll(Notification);
  export const updateNotification = CrudFactory.updateOne(Notification);
  export const deleteNotification = CrudFactory.deleteOne(Notification);
}
export default NotificationController;
