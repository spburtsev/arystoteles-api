// import catchAsync from '../lib/helpers/catch-async';
// import { IUser } from '../model/data/schema/User';
// import DailyActivity from 'src/model/data/schema/DailyActivity';
// import AppError from 'src/model/error/AppError';

// const restrictChildDataAccess = catchAsync(async (req, res, next) => {
//   // const child = await
//   next();
// })

// namespace DailyActivityController {
//   export const getDailyActivities = catchAsync(async (req, res, next) => {
//     const { id: userId, role: userRole } = req.user;
//     const childId = req.params.childId;

//     const dailyActivities = await DailyActivity.find();
//     res.status(200).json({ dailyActivities });
//   });
// }
