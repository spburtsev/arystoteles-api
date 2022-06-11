import Screening, { IScreening } from '../model/data/schema/Screening';
import CrudFactory from './factory/CrudFactory';
import catchAsync from '../lib/helpers/catch-async';
import AppError from '../model/error/AppError';
import Child, { IChild } from '../model/data/schema/Child';
import monthDifference from '../lib/helpers/month-difference';
import Caregiver, { ICaregiver } from 'src/model/data/schema/Caregiver';

const createNewScreening = async (child: IChild, caregiver: ICaregiver) => {
  const questions = await child.getScreeningQuestions();
  const screening = new Screening({
    questions,
    child,
    caregiver,
    answers: [],
    createdAt: new Date(),
  });
  const savedScreening = await screening.save();
  child.screenings.push(savedScreening);
  await child.save();
  return savedScreening;
};

namespace ScreeningController {
  /**
   * Get a monthly screening for a child.
   *
   * Expected request params:
   * * `childId: string` - Child id.
   */
  export const getMonthlyScreening = catchAsync(async (req, res, next) => {
    const childId = req.params.childId;
    const child = await Child.findById(childId, 'relations');
    if (!child) {
      return next(new AppError('Child not found', 404));
    }
    const caregiver = await Caregiver.findOne({ user: req.user.id });
    const currentDate = new Date();
    let screening: IScreening;
    let screenings = await Screening.find({
      child: childId,
    })
      .sort({ createdAt: 'desc' })
      .exec();

    if (screenings.length !== 0) {
      const lastScreening = screenings[0];
      const monthsSinceLastScreening = monthDifference(
        lastScreening.createdAt,
        currentDate,
      );
      if (monthsSinceLastScreening < 1) {
        return next(
          new AppError('The screening was already provided at this month', 400),
        );
      }
    }
    screening = await createNewScreening(child, caregiver);

    res.status(200).json({ screening });
  });

  export const createScreening = CrudFactory.createOne(Screening);
  export const getScreening = CrudFactory.getOne(Screening);
  export const getAllScreenings = CrudFactory.getAll(Screening);
  export const updateScreening = CrudFactory.updateOne(Screening);
  export const deleteScreening = CrudFactory.deleteOne(Screening);
}
export default ScreeningController;
