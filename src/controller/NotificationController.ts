import Notification from '../model/data/schema/Notification';
import CrudFactory from './factory/CrudFactory';

namespace NotificationController {
  export const createNotification = CrudFactory.createOne(Notification);
  export const getNotification = CrudFactory.getOne(Notification);
  export const getAllNotifications = CrudFactory.getAll(Notification);
  export const updateNotification = CrudFactory.updateOne(Notification);
  export const deleteNotification = CrudFactory.deleteOne(Notification);
}
export default NotificationController;
