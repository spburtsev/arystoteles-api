import UserData from '../model/data/schema/User';
import { Request, Response, NextFunction } from 'express';
import { AnyFn, filterObj } from '../lib/functional';
import multer from 'multer';
import sharp from 'sharp';
import AppError from '../model/error/AppError';
import { catchAsync } from '../lib/functional';
import CrudFactory from './factory/CrudFactory';

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: any, cb: AnyFn) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

namespace UserController {
  export const uploadUserPhoto = upload.single('photo');

  export const resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) {
      return next();
    }

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    next();
  });

  export const getSelf = (req: Request, _res: Response, next: NextFunction) => {
    req.params.id = req.user.id;
    next();
  };

  export const updateSelf = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400,
        ),
      );
    }

    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) {
      filteredBody.photo = req.file.filename;
    }

    const updatedUser = await UserData.findByIdAndUpdate(
      req.user.id!,
      filteredBody,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  });

  export const deleteSelf = catchAsync(async (req, res, _next) => {
    await UserData.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  export const getUser = CrudFactory.getOne(UserData);
  export const getAllUsers = CrudFactory.getAll(UserData);
  export const updateUser = CrudFactory.updateOne(UserData);
  export const deleteUser = CrudFactory.deleteOne(UserData);
}

export default UserController;
