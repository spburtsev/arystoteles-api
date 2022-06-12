import User from '../model/data/schema/User';
import Medic from '../model/data/schema/Medic';
import Notification from '../model/data/schema/Notification';
import NotificationType from '../model/enum/NotificationType';
import AppLocale from '../model/enum/AppLocale';
import _ from 'lodash';
import AppError from '../model/error/AppError';
import catchAsync from '../lib/helpers/catch-async';
import CrudFactory from './factory/CrudFactory';

namespace MedicController {
  export const getSelf = catchAsync(async (req, res, next) => {
    const medic = await Medic.findOne({ user: req.user.id });
    if (!medic) {
      return next(new AppError('You are not a medic.', 400));
    }
    res.status(200).json({
      status: 'success',
      data: {
        medic,
      },
    });
  });

  export const updateSelf = catchAsync(async (req, res, next) => {
    const filteredBody: {
      organizationId?: string;
      title?: string;
    } = _.pick(req.body, 'organizationId', 'title');
    const medic = await Medic.findOne({ user: req.user.id }).populate('user');
    if (!medic) {
      throw new AppError('Medic not found', 404);
    }
    const updatedMedic = await Medic.findByIdAndUpdate(
      medic._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      },
    );

    if (filteredBody.organizationId) {
      const organization = await User.findById(filteredBody.organizationId);
      if (!organization) {
        throw new AppError('Organization not found', 404);
      }
      const notification = new Notification({
        type: NotificationType.Info,
        user: organization,
        title: {
          [AppLocale.English]: `A new medic`,
          [AppLocale.Ukrainian]: `Новий лікар`,
        },
        text: {
          [AppLocale.English]: `${medic.user.fullName} has been assigned to you`,
          [AppLocale.Ukrainian]: `${medic.user.fullName} бажає до вас приєднатися`,
        },
        createdAt: new Date(),
      });
      await notification.save();
    }

    res.status(200).json({
      status: 'success',
      data: {
        medic: updatedMedic,
      },
    });
  });

  export const getMedic = CrudFactory.getOne(Medic);
  export const getAllMedics = CrudFactory.getAll(Medic);
  export const updateMedic = CrudFactory.updateOne(Medic);
  export const deleteMedic = CrudFactory.deleteOne(Medic);
}

export default MedicController;
