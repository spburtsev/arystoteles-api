import { Model, Schema, Document, model } from 'mongoose';
import { IUser } from './User';
import UserRole from '../../enum/UserRole';
import BackupMethod from '../../enum/BackupMethod';

export interface IBackup extends Document {
  fileName: string;
  createdBy: IUser;
  createdAt: Date;
  method: BackupMethod;
  preserve: () => Partial<IBackup>;
}

const BackupSchema = new Schema({
  fileName: {
    type: String,
    required: true,
    unique: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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

BackupSchema.methods.preserve = function() {
  return {
    fileName: this.fileName,
    createdBy: this.createdBy,
    createdAt: this.createdAt,
    method: this.method,
  };
};

const Backup: Model<IBackup> = model('Backup', BackupSchema);
export default Backup;
