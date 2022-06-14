import { Model, Schema, Document, Query, model } from 'mongoose';
import UserRole from '../../enum/UserRole';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Medic from './Medic';
import AppLocale from '../../enum/AppLocale';
import ChildRelation, { IChildRelation } from './ChildRelation';

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  firstName: string;
  lastName: string;
  country: string;
  city?: string;
  preferredLocale?: AppLocale;
  childRelations?: Array<IChildRelation>;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  fullName: string;
  comparePasswords: (
    candidatePassword: string,
    userPassword: string,
  ) => Promise<boolean>;
  changedPasswordAfter: (jwtTimestamp: Number) => boolean;
  createPasswordResetToken: () => string;
  secured(): Omit<
    IUser,
    'password' | 'passwordResetToken' | 'passwordResetExpires'
  >;
  findRelation: (childId: string) => IChildRelation | undefined;
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
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: false,
  },
  preferredLocale: {
    type: String,
    required: false,
    enum: Object.values(AppLocale),
    default: AppLocale.English,
  },
  passwordChangedAt: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  role: { type: String, required: true, enum: Object.values(UserRole) },
  childRelations: [
    { type: Schema.Types.ObjectId, ref: 'ChildRelation', required: false },
  ],
  isActive: { type: Boolean, default: true, select: false },
});

UserSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.firstName} ${this.lastName}`;
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

UserSchema.methods.findRelation = function(childId: string) {
  return this.childRelations.find(
    (relation: IChildRelation) => relation.child._id.toString() === childId,
  );
};

const User: Model<IUser> = model('User', UserSchema);
export default User;
