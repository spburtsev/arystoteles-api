import catchAsync from '../lib/helpers/catch-async';
import { IUser } from '../model/data/schema/User';
import DailyActivity, {
  IDailyActivity,
} from '../model/data/schema/DailyActivity';
import Activity from '../model/data/schema/Activity';
import AppError from '../model/error/AppError';
import ChildRelation from '../model/data/schema/ChildRelation';
import Child from '../model/data/schema/Child';
import Caregiver from 'src/model/data/schema/Caregiver';

const populateDailyActivities = async (childId: string) => {
  const child = await Child.findById(childId);
  if (!child) {
    throw new AppError('Child not found', 404);
  }
  const currentDate = new Date();
  const activities = await Activity.find({
    ageGroup: child.ageGroup,
  }).then(items =>
    items.map(item => ({
      activity: item._id,
      date: currentDate,
      child: childId,
    })),
  );
  const dailyActivities: Array<IDailyActivity & { _id: string }> = [];
  activities.forEach(async activity => {
    const item = await DailyActivity.create(activity);
    dailyActivities.push(item);
  });
  child.dailyActivities.push(...dailyActivities);
  await child.save();
  return dailyActivities;
};

namespace DailyActivityController {
  /**
   * Get all daily activities for a child.
   *
   * Expected request params:
   * * `childId: string` - Child id.
   */
  export const getDailyActivities = catchAsync(async (req, res, next) => {
    const childId = req.params.childId;

    let dailyActivities = await DailyActivity.find({
      childId,
    }).exec();
    if (dailyActivities.length === 0) {
      dailyActivities = await populateDailyActivities(childId);
    }
    const mappedActivities = dailyActivities.map(activity =>
      activity.transform(),
    );
    res.status(200).json({ mappedActivities });
  });

  /**
   * Get all daily activities for a child.
   *
   * Expected request params:
   * * `id: string` - DailyActivity id.
   *
   * Expected request body:
   * * `completed: boolean` - completed attribute value to set.
   */
  export const updateDailyActivity = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { completed } = req.body;
    const dailyActivity = await DailyActivity.findById(id);
    if (!dailyActivity) {
      return next(new AppError('Daily activity not found', 404));
    }
    const caregiver = await Caregiver.findOne({ user: req.user.id });
    if (!caregiver) {
      return next(new AppError('You are not a caregiver', 403));
    }
    dailyActivity.complete(completed, caregiver);
    await dailyActivity.save();
    res.status(200).json({ dailyActivity });
  });
}
export default DailyActivityController;
