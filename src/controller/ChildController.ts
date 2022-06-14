import _ from 'lodash';
import ChildRelation from '../model/data/schema/ChildRelation';
import ChildRelationType from '../model/enum/ChildRelationType';
import UserRole from '../model/enum/UserRole';
import AppError from '../model/error/AppError';
import catchAsync from '../lib/helpers/catch-async';
import Child, { IChild } from '../model/data/schema/Child';
import Tip from '../model/data/schema/Tip';
import User, { IUser } from '../model/data/schema/User';
import CrudFactory from './factory/CrudFactory';

const accessAttributes = [
  'firstName',
  'birthDate',
  'birthWeightPrimary',
  'birthWeightSecondary',
  'currentWeightPrimary',
  'currentWeightSecondary',
  'gender',
  'medic',
];

const attach = (user: IUser) => (child: IChild) => async (
  relationType: ChildRelationType,
) => {
  ChildRelation.create({
    user,
    child,
    relationType,
  }).then(rel => {
    user.update({
      $push: {
        childRelations: rel,
      },
    });
    child.update({
      $push: {
        relations: rel,
      },
    });
  });
};

const findCaregiver = async (userId: string) =>
  User.findById(userId)
    .where('role', UserRole.Caregiver)
    .populate({
      path: 'childRelations',
      populate: { path: 'child' },
    });

const findChild = async (childId: string) =>
  Child.findById(childId).populate({
    path: 'relations',
    populate: { path: 'caregiver' },
  });

namespace ChildController {
  export const createChild = catchAsync(async (req, res, next) => {
    const usr = await findCaregiver(req.user.id);
    if (!usr) {
      return next(new AppError('Caregiver not found', 404));
    }

    const childAttributes = _.pick(req.body, accessAttributes) as IChild;
    const { relation } = req.body;
    const child = await Child.create(childAttributes);
    await attach(usr)(child)(relation);

    res.status(200).json({
      status: 'success',
      data: {
        child: child,
        relation,
      },
    });
  });

  export const getChild = catchAsync(async (req, res, next) => {
    const child = await findChild(req.params.id);
    if (!child) {
      return next(new AppError('Child not found', 404));
    }
    if (!child.isRelatedTo(req.user.id)) {
      return next(
        new AppError('You are not authorized to access this child', 403),
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        child,
      },
    });
  });

  export const getRelatedChildren = catchAsync(async (req, res, next) => {
    const usr = await findCaregiver(req.user.id);
    if (!usr) {
      return next(new AppError('Caregiver not found', 404));
    }
    const children = usr.childRelations.map(rel => ({
      child: rel.child,
      relation: rel.relationType,
    }));
    res.status(200).json({
      status: 'success',
      data: {
        total: children.length,
        children,
      },
    });
  });

  export const getTips = catchAsync(async (req, res, next) => {
    const child = await findChild(req.params.id);
    if (!child) {
      return next(new AppError('Child not found', 404));
    }
    if (!child.isRelatedTo(req.user.id)) {
      return next(
        new AppError('You are not authorized to access this child', 403),
      );
    }
    const tips = await Tip.find({ ageGroups: child.ageGroup });
    res.status(200).json({
      status: 'success',
      total: tips.length,
      tips,
    });
  });

  export const updateChild = catchAsync(async (req, res, next) => {
    const child = await findChild(req.params.id);
    if (!child) {
      return next(new AppError('Child not found', 404));
    }
    if (!child.isRelatedTo(req.user.id)) {
      return next(
        new AppError('You are not authorized to access this child', 403),
      );
    }
    const childAttributes = _.pick(req.body, accessAttributes) as IChild;
    await child.update(childAttributes);
    res.status(200).json({
      status: 'success',
      child,
    });
  });

  export const deleteChild = catchAsync(async (req, res, next) => {
    const child = await findChild(req.params.id);
    if (!child) {
      return next(new AppError('Child not found', 404));
    }
    if (!child.isRelatedTo(req.user.id)) {
      return next(
        new AppError('You are not authorized to access this child', 403),
      );
    }
    await child.remove();
    res.status(200).json({
      status: 'success',
    });
  });

  export const getAllChildren = CrudFactory.getAll(Child);
}
export default ChildController;
