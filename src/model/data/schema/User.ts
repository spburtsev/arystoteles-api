import { Model, Schema, Document, Query, model } from 'mongoose';
import UserRole, { userRoles } from '../../enum/UserRole';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;

  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;

  comparePasswords: (
    candidatePassword: string,
    userPassword: string,
  ) => Promise<boolean>;

  changedPasswordAfter: (JwtTimestamp: Number) => boolean;

  createPasswordResetToken: () => string;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  passwordChangedAt: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  role: { type: String, required: true, enum: userRoles },
  isActive: { type: Boolean, default: true, select: false },
});

UserSchema.pre<IUser>('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

UserSchema.pre<IUser>('save', function(next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

UserSchema.pre<Query<Array<IUser>, IUser>>(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

UserSchema.methods.comparePasswords = async (
  candidatePassword: string,
  userPassword: string,
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function(JwtTimestamp: number) {
  const changedAt = this.passwordChangedAt as Date;
  if (changedAt) {
    const changedTimestamp = changedAt.getTime() / 1000;
    return JwtTimestamp < changedTimestamp;
  }
  return false;
};

UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User: Model<IUser> = model('User', UserSchema);
export default User;
