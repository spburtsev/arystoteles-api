import Screening, { IScreening } from '../model/data/schema/Screening';
import CrudFactory from './factory/CrudFactory';
import catchAsync from '../lib/helpers/catch-async';
import AppError from '../model/error/AppError';
import Child, { IChild } from '../model/data/schema/Child';
import monthDifference from '../lib/helpers/month-difference';
import User, { IUser } from '../model/data/schema/User';
import ChildRelation, {
  IChildRelation,
} from '../model/data/schema/ChildRelation';

const createNewScreening = async (rel: IChildRelation) => {
  const questions = await rel.child.getScreeningQuestions();
  const screening = new Screening({
    questions,
    relation: rel,
    answers: [],
    createdAt: new Date(),
  });
  const savedScreening = await screening.save();
  rel.screenings.push(savedScreening);
  await rel.save();
  return savedScreening;
};

namespace ScreeningController {
  /**
   * Get a screening history for a child.
   *
   * Expected request params:
   * * `childId: string` - Child id.
   */
  export const getScreeningHistory = catchAsync(async (req, res, next) => {
    const { childId } = req.params;
    const child = await Child.findById(childId);
    if (!child) {
      return next(new AppError('Child not found', 404));
    }
    const caregiver = await User.findById(req.user.id).populate(
      'childRelations',
    );
    if (!caregiver) {
      return next(new AppError('Caregiver not found', 404));
    }
    const screenings = await Screening.find({
      child: childId,
      caregiver: caregiver,
    })
      .populate('questions')
      .sort({ createdAt: 'desc' })
      .exec();

    res.status(200).json({
      total: screenings.length,
      screenings: screenings.map(screening => screening.localized(req.locale)),
    });
  });

  /**
   * Get a monthly screening for a child.
   *
   * Expected request params:
   * * `childId: string` - Child id.
   */
  export const getMonthlyScreening = catchAsync(async (req, res, next) => {
    const { childId } = req.params;
    const caregiver = await User.findById(req.user.id).populate({
      path: 'childRelations',
      populate: { path: 'child' },
    });
    if (!caregiver) {
      return next(new AppError('Caregiver not found', 404));
    }
    const relation = caregiver.findRelation(childId);
    if (!relation) {
      return next(new AppError('Child not found', 404));
    }
    const child = relation.child;

    const currentDate = new Date();
    let screening: IScreening;
    let screenings = await Screening.find({
      relation: relation,
    })
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'relation',
        populate: { path: 'child' },
      })
      .exec();

    if (screenings.length !== 0) {
      const lastScreening = screenings[0];
      const monthsSinceLastScreening = monthDifference(lastScreening.createdAt)(
        currentDate,
      );
      if (monthsSinceLastScreening < 1) {
        return next(
          new AppError('The screening was already provided at this month', 400),
        );
      }
    }
    screening = await createNewScreening(relation);
    res.status(200).json({ screening: screening.localized(req.locale) });
  });

  /**
   * Modify a screening for a child by updating answers.
   *
   * Expected request params:
   * * `id: string` - Screening Id.
   *
   * Expected request body:
   * * `answers: number[]` - Screening answers, must match the questions number.
   */
  export const modifyScreening = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const screening = await Screening.findById(id)
      .populate([
        { path: 'relation', populate: { path: 'child' } },
        { path: 'questions' },
        {
          path: 'relation',
          populate: { path: 'caregiver' },
        },
      ])
      .exec();

    if (!screening) {
      return next(new AppError('Screening not found', 404));
    }
    const { answers }: { answers: any[] } = req.body;
    if (answers.length !== screening.questions.length) {
      return next(new AppError('Invalid number of answers', 400));
    }

    for (let i = 0; i < answers.length; i++) {
      const question = screening.questions[i];
      const answerIsValid =
        answers[i] >= question.minValue && answers[i] <= question.maxValue;
      if (!answerIsValid) {
        return next(new AppError(`Invalid answer at index ${i}`, 400));
      }
    }

    screening.answers = answers;
    screening.updatedAt = new Date();
    screening.estimateResult();
    const savedScreening = await screening.save();
    res.status(200).json({ screening: savedScreening });
  });

  export const createScreening = CrudFactory.createOne(Screening);
  export const getScreening = CrudFactory.getOne(Screening);
  export const getAllScreenings = CrudFactory.getAll(Screening);
  export const updateScreening = CrudFactory.updateOne(Screening);
  export const deleteScreening = CrudFactory.deleteOne(Screening);
}
export default ScreeningController;
