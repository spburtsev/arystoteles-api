import _ from 'lodash';
import ChildRelation from '../model/data/schema/ChildRelation';
import ChildRelationType from '../model/enum/ChildRelationType';
import AppError from '../model/error/AppError';
import catchAsync from '../lib/helpers/catch-async';
import Child, { IChild } from '../model/data/schema/Child';
import CrudFactory from './factory/CrudFactory';
import Caregiver, { ICaregiver } from '../model/data/schema/Caregiver';

const accessAttributes = [
  'firstName',
  'birthDate',
  'birthWeightPrimary',
  'birthWeightSecondary',
  'currentWeightPrimary',
  'currentWeightSecondary',
];

const attachChildRelation = async (
  caregiver: ICaregiver,
  child: IChild,
  relationType: ChildRelationType,
) => {
  const rel = await ChildRelation.create({
    user: caregiver.user,
    child: child._id,
    relationType,
  });
  await caregiver.update({
    $push: {
      childRelations: rel._id,
    },
  });
  await child.update({
    $push: {
      relations: rel._id,
    },
  });
};

namespace ChildController {
  export const createChild = catchAsync(async (req, res, next) => {
    const userId = req.user?.id;
    const caregiver = await Caregiver.findOne({ user: userId });
    if (!caregiver) {
      return next(new AppError('Caregiver not found', 404));
    }

    const childAttributes = _.pick(req.body, accessAttributes) as IChild;
    const { relation } = req.body;
    const child = await Child.create(childAttributes);
    await attachChildRelation(caregiver, child, relation);

    res.status(200).json({
      status: 'success',
      data: {
        child: child,
        relation,
      },
    });
  });

  export const getChild = catchAsync(async (req, res, next) => {
    const child = await Child.findById(req.params.id).populate('relations');
    if (!child) {
      return next(new AppError('Child not found', 404));
    }
    if (!child.relations.some(x => x.user._id === req.user?.id)) {
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

  export const getAllChildren = CrudFactory.getAll(Child);
  export const updateChild = CrudFactory.updateOne(Child);
  export const deleteChild = CrudFactory.deleteOne(Child);
}
export default ChildController;
