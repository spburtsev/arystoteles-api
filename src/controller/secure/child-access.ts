import catchAsync from '../../lib/helpers/catch-async';
import AppError from '../../model/error/AppError';
import ChildRelation from '../../model/data/schema/ChildRelation';

const secureChildDataAccess = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { childId } = req.params;

  const isRelated = await ChildRelation.find({
    user: id,
    child: childId,
  });
  if (!isRelated) {
    return next(new AppError('You are not related to this child', 403));
  }
  next();
});
export default secureChildDataAccess;
