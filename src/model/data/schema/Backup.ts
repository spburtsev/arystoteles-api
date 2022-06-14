import { Model, Schema, Document, model } from 'mongoose';
import { IUser } from './User';
import UserRole from '../../enum/UserRole';
import BackupMethod from '../../enum/BackupMethod';

export interface IBackup extends Document {
  fileName: string;
  createdBy: IUser;
  createdAt: Date;
}

const BackupSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: (usr: IUser) =>
        usr.role === UserRole.Admin || usr.role === UserRole.Seed,
    },
  },
  createdAt: {
    type: Date,
    required: true,
  },
  method: {
    type: String,
    required: true,
    enum: Object.values(BackupMethod),
  },
});

const Backup: Model<IBackup> = model('Backup', BackupSchema);
export default Backup;
