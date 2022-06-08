import { Model, Schema, Document, model } from 'mongoose';
import { IUser } from './User';
import NotificationType from '../../enum/NotificationType';
import LocalizedString from '../LocalizedString';

interface INotification extends Document {
  type: NotificationType;
  user: IUser;
  title?: LocalizedString;
  text: LocalizedString;
  read: boolean;
  createdAt: Date;
  updatedAt?: Date;
  archived: boolean;
}

const NotificationSchema = new Schema({
  type: { type: String, required: true, enum: Object.values(NotificationType) },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: Schema.Types._LocalizedString, required: false },
  text: { type: Schema.Types._LocalizedString, required: true },
  read: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  archived: { type: Boolean, required: false, default: false },
});

const Notification: Model<INotification> = model(
  'Notification',
  NotificationSchema,
);
export default Notification;
