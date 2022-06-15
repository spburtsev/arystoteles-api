import Organization, { IOrganization } from '../model/data/schema/Organization';
import CrudFactory from './factory/CrudFactory';
import catchAsync from '../lib/helpers/catch-async';
import User from '../model/data/schema/User';
import UserRole from '../model/enum/UserRole';
import AppError from '../model/error/AppError';
import _ from 'lodash';

const accessAttributes = [
  'name',
  'description',
  'address',
  'phone',
  'email',
  'image',
];

namespace OrganizationController {
  export const getSelf = catchAsync(async (req, res, next) => {
    const usr = await User.findById(req.user.id)
      .where('role', UserRole.OrganizationAdministrator)
      .exec();
    if (!usr) {
      return next(new AppError('User not found', 404));
    }
    const org = await Organization.findOne({
      administrator: usr._id,
    }).exec();
    const profile: any = org ? org : 'not created yet';
    res.status(200).json({
      status: 'success',
      profile,
    });
  });

  export const createSelf = catchAsync(async (req, res, next) => {
    const usr = await User.findById(req.user.id)
      .where('role', UserRole.OrganizationAdministrator)
      .exec();
    if (!usr) {
      return next(new AppError('User not found', 404));
    }
    const exOrg = await Organization.findOne({
      administrator: usr._id,
    }).exec();
    if (exOrg) {
      return next(new AppError('Organization already exists', 400));
    }
    const orgAttributes = _.pick(req.body, accessAttributes) as Partial<
      IOrganization
    >;
    const org = await Organization.create({
      ...orgAttributes,
      administrator: usr._id,
    });
    await org.save();
    res.status(200).json({
      status: 'success',
      org,
    });
  });

  export const updateSelf = catchAsync(async (req, res, next) => {
    const usr = await User.findById(req.user.id)
      .where('role', UserRole.OrganizationAdministrator)
      .exec();
    if (!usr) {
      return next(new AppError('User not found', 404));
    }
    const orgAttributes = _.pick(req.body, accessAttributes) as Partial<
      IOrganization
    >;
    const organization = await Organization.findOneAndUpdate(
      {
        administrator: usr._id,
      },
      {
        ...orgAttributes,
      },
    ).exec();
    if (!organization) {
      return next(new AppError('Organization not found', 404));
    }
    res.status(200).json({
      status: 'success',
      organization,
    });
  });

  export const getOrganization = CrudFactory.getOne(Organization);
  export const createOrganization = CrudFactory.createOne(Organization);
  export const getAllOrganizations = CrudFactory.getAll(Organization);
  export const updateOrganization = CrudFactory.updateOne(Organization);
  export const deleteOrganization = CrudFactory.deleteOne(Organization);
}
export default OrganizationController;
