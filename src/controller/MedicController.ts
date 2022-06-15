import _ from 'lodash';
import Medic from '../model/data/schema/Medic';
import Notification from '../model/data/schema/Notification';
import NotificationType from '../model/enum/NotificationType';
import AppLocale from '../model/enum/AppLocale';
import AppError from '../model/error/AppError';
import catchAsync from '../lib/helpers/catch-async';
import CrudFactory from './factory/CrudFactory';
import Organization from '../model/data/schema/Organization';
import EmailService from '../service/EmailService';

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
    const medic = await Medic.findOne({ user: req.user.id }).populate('user');
    if (!medic) {
      throw new AppError('Medic not found', 404);
    }
    let filteredBody: {
      organizationId?: string;
      title?: string;
      confirmed?: boolean;
    } = _.pick(req.body, 'organizationId', 'title');
    if (filteredBody.organizationId) {
      filteredBody.confirmed = false;
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
      const organization = await Organization.findById(
        filteredBody.organizationId,
      )
        .populate('administrator')
        .exec();
      if (!organization) {
        throw new AppError('Organization not found', 404);
      }
      const notification = new Notification({
        type: NotificationType.Info,
        user: organization.administrator,
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
      const confirmURL = `${req.protocol}://${req.get(
        'host',
      )}/api/v1/medics/confirm/${medic._id}`;
      await new EmailService(
        organization.administrator.email,
        confirmURL,
      ).sendMedicConfirmationRequest(medic);
    }

    res.status(200).json({
      status: 'success',
      data: {
        medic: updatedMedic,
      },
    });
  });

  export const confirm = catchAsync(async (req, res, next) => {
    const medicId = req.params.id;
    const medic = await Medic.findById(medicId);
    if (!medic) {
      return next(new AppError('Medic not found', 404));
    }
    const organization = await Organization.findById(medic.organization)
      .populate('administrator')
      .exec();
    if (!organization || organization.administrator._id !== req.user.id) {
      return next(new AppError('You cannot perform this operation', 400));
    }
    medic.isConfirmed = true;
    await medic.save();
    res.status(200).json({
      status: 'success',
      data: {
        medic,
      },
    });
  });

  export const getMedic = CrudFactory.getOne(Medic, 'user');
  export const getAllMedics = CrudFactory.getAll(Medic);
  export const updateMedic = CrudFactory.updateOne(Medic);
  export const deleteMedic = CrudFactory.deleteOne(Medic);
}

export default MedicController;
