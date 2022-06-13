import _ from 'lodash';
import ChildRelation from '../model/data/schema/ChildRelation';
import ChildRelationType from '../model/enum/ChildRelationType';
import UserRole from '../model/enum/UserRole';
import AppError from '../model/error/AppError';
import catchAsync from '../lib/helpers/catch-async';
import Child, { IChild } from '../model/data/schema/Child';
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

namespace ChildController {
  export const createChild = catchAsync(async (req, res, next) => {
    const usr = await User.findById(req.user?.id)
      .where('role', UserRole.Caregiver)
      .populate({
        path: 'childRelations',
        populate: { path: 'child' },
      });
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
    const child = await Child.findById(req.params.id).populate({
      path: 'relations',
      populate: { path: 'user' },
    });
    if (!child) {
      return next(new AppError('Child not found', 404));
    }
    if (!child.relations.some(x => x.caregiver._id === req.user?.id)) {
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
    const usr = await User.findById(req.user?.id)
      .where('role', UserRole.Caregiver)
      .populate({
        path: 'childRelations',
        populate: { path: 'child' },
      });
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

  export const getAllChildren = CrudFactory.getAll(Child);
  export const updateChild = CrudFactory.updateOne(Child);
  export const deleteChild = CrudFactory.deleteOne(Child);
}
export default ChildController;
