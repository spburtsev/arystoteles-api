import { Model, Schema, Document, Query, model } from 'mongoose';
import UserRole from '../../enum/UserRole';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import Organization from './Organization';
import Caregiver from './Caregiver';
import Medic from './Medic';

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  firstName: string;
  lastName: string;

  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;

  comparePasswords: (
    candidatePassword: string,
    userPassword: string,
  ) => Promise<boolean>;

  changedPasswordAfter: (JwtTimestamp: Number) => boolean;

  createPasswordResetToken: () => string;

  secured(): Omit<
    IUser,
    'password' | 'passwordResetToken' | 'passwordResetExpires'
  >;
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
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  passwordChangedAt: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  role: { type: String, required: true, enum: Object.values(UserRole) },
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

UserSchema.post<IUser>('save', async function(doc, next) {
  if (doc.role === UserRole.OrganizationAdministrator) {
    await Organization.create({
      administrator: doc._id,
    });
    return next();
  }
  if (doc.role === UserRole.Caregiver) {
    await Caregiver.create({
      user: doc._id,
    });
    return next();
  }
  if (doc.role === UserRole.Medic) {
    await Medic.create({
      user: doc._id,
    });
    return next();
  }

  next();
});

UserSchema.pre<Query<Array<IUser>, IUser>>(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

UserSchema.methods.comparePasswords = async function(
  candidatePassword: string,
  userPassword: string,
) {
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

UserSchema.methods.secured = function(this: IUser) {
  const {
    password,
    passwordResetToken,
    passwordResetExpires,
    ...user
  } = this.toObject();
  return user;
};

const User: Model<IUser> = model('User', UserSchema);
export default User;
