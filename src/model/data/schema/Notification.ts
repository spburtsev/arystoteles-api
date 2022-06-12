import { Model, Schema, Document, model } from 'mongoose';
import { IUser } from './User';
import NotificationType from '../../enum/NotificationType';
import AppLocale from '../../enum/AppLocale';
import LocalizedString from '../LocalizedString';

interface INotification extends Document {
  type: NotificationType;
  user: IUser;
  title?: LocalizedString;
  text: LocalizedString;
  read: boolean;
  createdAt: Date;
  updatedAt?: Date;

  localized(locale: AppLocale): any;
}

const NotificationSchema = new Schema({
  type: { type: String, required: true, enum: Object.values(NotificationType) },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: Schema.Types._LocalizedString, required: false },
  text: { type: Schema.Types._LocalizedString, required: true },
  read: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
});

NotificationSchema.methods.localized = function(locale: AppLocale) {
  return {
    type: this.type,
    user: this.user,
    title: this.title ? this.title[locale] : null,
    text: this.text[locale],
    read: this.read,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt || null,
  };
};

const Notification: Model<INotification> = model(
  'Notification',
  NotificationSchema,
);
export default Notification;
