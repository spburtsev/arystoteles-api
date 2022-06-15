import _ from 'lodash';
import Medic, { IMedic } from '../model/data/schema/Medic';
import User from '../model/data/schema/User';
import Notification from '../model/data/schema/Notification';
import NotificationType from '../model/enum/NotificationType';
import AppLocale from '../model/enum/AppLocale';
import UserRole from '../model/enum/UserRole';
import AppError from '../model/error/AppError';
import catchAsync from '../lib/helpers/catch-async';
import CrudFactory from './factory/CrudFactory';
import Organization from '../model/data/schema/Organization';
import EmailService from '../service/EmailService';
import { Request } from 'express';

const notifyOrganization = async (
  medic: IMedic,
  orgId: string,
  req: Request,
) => {
  const organization = await Organization.findById(orgId)
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
};

namespace MedicController {
  export const getSelf = catchAsync(async (req, res, next) => {
    const usr = await User.findById(req.user.id)
      .where('role', UserRole.Medic)
      .exec();
    if (!usr) {
      return next(new AppError('User not found', 404));
    }
    const medic = await Medic.findOne({ user: req.user.id });

    const [status, profile] = medic
      ? ['success', medic]
      : ['warning', 'not created yet'];
    res.status(200).json({
      status,
      profile,
    });
  });

  export const createSelf = catchAsync(async (req, res, next) => {
    const usr = await User.findById(req.user.id);
    if (!usr) {
      return next(new AppError('User not found', 404));
    }
    const exMedic = await Medic.findOne({ user: req.user.id });
    if (exMedic) {
      return next(new AppError('Medic already exists', 400));
    }
    const medicAttributes = _.pick(req.body, ['title', 'organizationId']);
    const medic = await Medic.create({ ...medicAttributes, user: req.user.id });
    if (medic.organization) {
      try {
        await notifyOrganization(medic, medicAttributes.organizationId, req);
      } catch (err) {
        return next(new AppError(err.message, 500));
      }
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
      organization?: string;
      title?: string;
      confirmed?: boolean;
    } = _.pick(req.body, 'organizationId', 'title');
    if (filteredBody.organizationId) {
      filteredBody.confirmed = false;
      filteredBody.organization = filteredBody.organizationId;
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
      try {
        await notifyOrganization(medic, filteredBody.organizationId, req);
      } catch (err) {
        return next(new AppError(err.message, 500));
      }
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
    if (
      !organization ||
      organization.administrator._id.toString() !== req.user.id
    ) {
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
