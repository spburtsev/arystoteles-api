import jwtSync from 'jsonwebtoken';
import jwt from 'jwt-promisify';
import crypto from 'crypto';
import AppError from '../model/error/AppError';
import User, { IUser } from '../model/data/schema/User';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../lib/helpers/catch-async';
import UserRole, { securedRoles } from '../model/enum/UserRole';
import EmailService from '../service/EmailService';
import _ from 'lodash';

const userAttributes = [
  'firstName',
  'lastName',
  'email',
  'password',
  'role',
  'birthDate',
  'country',
  'city',
  'preferredLocale',
];

const signToken = (id: string, role: UserRole) => {
  return jwtSync.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createToken = async (
  user: IUser,
  statusCode: number,
  req: Request,
  res: Response,
) => {
  const token = signToken(user.id, user.role);
  const expires = new Date(
    Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000,
  );
  const cookieOptions: {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
  } = {
    expires,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  const secured = user.secured();

  res.status(statusCode).json({
    status: 'success',
    token,
    expires,
    data: {
      user: secured,
    },
  });
};

namespace AuthController {
  export const register = catchAsync(async (req, res, next) => {
    const usr = _.pick(req.body, userAttributes);
    if (securedRoles.includes(usr.role)) {
      return next(
        new AppError(`It is not allowed to register as ${usr.role}`, 400),
      );
    }
    const user = await User.create(usr);
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new EmailService(user.email, url).sendWelcome();
    createToken(user, 201, req, res);
  });

  export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Email or password not specified', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePasswords(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
    createToken(user, 200, req, res);
  });

  export const logout = (_req: Request, res: Response) => {
    res.cookie('jwt', 'loggedOut', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
  };

  export const protect = catchAsync(async (req, res, next) => {
    let token: string;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('Unauthorized', 401));
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user no longer exists.', 401));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('Password changed recently Please log in again.', 401),
      );
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    req.locale = currentUser.preferredLocale;
    res.locals.locale = currentUser.preferredLocale;
    next();
  });

  export const isLoggedIn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (req.cookies.jwt) {
      try {
        const decoded = await jwt.verify(
          req.cookies.jwt,
          process.env.JWT_SECRET,
        );

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
          return next();
        }

        if (currentUser.changedPasswordAfter(decoded.iat)) {
          return next();
        }

        res.locals.user = currentUser;
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  };

  export const restrictTo = (...roles: Array<UserRole>) => {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role)) {
        return next(new AppError('Forbidden', 403));
      }
      next();
    };
  };

  export const forgotPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(new AppError('User not found.', 404));
      }
      const resetToken = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      try {
        const resetURL = `${req.protocol}://${req.get(
          'host',
        )}/api/v1/users/resetPassword/${resetToken}`;

        await new EmailService(user.email, resetURL).sendPasswordReset();

        res.status(200).json({
          status: 'success',
          message: 'Token sent to email!',
        });
      } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('Error sending the email.', 500));
      }
    },
  );

  export const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Invalid or expired token', 400));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createToken(user, 200, req, res);
  });

  export const updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // if (
    //   !(await user.comparePasswords(req.body.currentPassword, user.password))
    // ) {
    //   return next(new AppError('Your current password is wrong.', 401));
    // }
    user.password = req.body.password;
    await user.save();
    createToken(user, 200, req, res);
  });
}
export default AuthController;
