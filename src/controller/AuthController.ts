import jwtSync from 'jsonwebtoken';
import jwt from 'jwt-promisify';
import crypto from 'crypto';
import User from '../model/domain/User';
import AppError from '../model/error/AppError';
import UserModel from '../model/data/schema/User';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../lib/functional';
import UserRole from '../model/enum/UserRole';
import EmailService from '../controller/service/EmailService';

const signToken = (id: string, role: UserRole) => {
  return jwtSync.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN),
  });
};

const createToken = async (
  user: User,
  statusCode: number,
  req: Request,
  res: Response,
) => {
  const token = signToken(user.id, user.role);
  const expires = new Date(
    Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000,
  );

  res.cookie('jwt', token, {
    expires,
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  const transformedUser = user.withoutPassword();

  res.status(statusCode).json({
    status: 'success',
    token,
    expires,
    data: {
      user: transformedUser,
    },
  });
};

namespace AuthController {
  export const register = catchAsync(async (req, res, _next) => {
    const userDoc = await UserModel.create({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    });

    const url = `${req.protocol}://${req.get('host')}/me`;
    await new EmailService(userDoc.email, url).sendWelcome();
    createToken(User.from(userDoc), 201, req, res);
  });

  export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Email or password not specified', 400));
    }
    const userDoc = await UserModel.findOne({ email }).select('+password');

    if (
      !userDoc ||
      !(await userDoc.comparePasswords(password, userDoc.password))
    ) {
      return next(new AppError('Incorrect email or password', 401));
    }
    const user = User.from(userDoc);
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
    const currentUser = await UserModel.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401,
        ),
      );
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401,
        ),
      );
    }

    req.user = currentUser;
    res.locals.user = currentUser;
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

        const currentUser = await UserModel.findById(decoded.id);
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
        return next(
          new AppError(
            'You do not have permission to perform this action',
            403,
          ),
        );
      }
      next();
    };
  };

  export const forgotPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userDoc = await UserModel.findOne({ email: req.body.email });
      if (!userDoc) {
        return next(new AppError('There is no user with email address.', 404));
      }
      const resetToken = userDoc.createPasswordResetToken();
      await userDoc.save({ validateBeforeSave: false });

      try {
        const resetURL = `${req.protocol}://${req.get(
          'host',
        )}/api/v1/users/resetPassword/${resetToken}`;

        await new EmailService(userDoc.email, resetURL).sendPasswordReset();

        res.status(200).json({
          status: 'success',
          message: 'Token sent to email!',
        });
      } catch (err) {
        userDoc.passwordResetToken = undefined;
        userDoc.passwordResetExpires = undefined;
        await userDoc.save({ validateBeforeSave: false });

        return next(
          new AppError(
            'There was an error sending the email. Try again later!',
            500,
          ),
        );
      }
    },
  );

  export const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createToken(User.from(user), 200, req, res);
  });

  export const updatePassword = catchAsync(async (req, res, next) => {
    const user = await UserModel.findById(req.user.id).select('+password');

    if (
      !(await user.comparePasswords(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError('Your current password is wrong.', 401));
    }
    user.password = req.body.password;
    await user.save();

    createToken(User.from(user), 200, req, res);
  });
}
export default AuthController;
