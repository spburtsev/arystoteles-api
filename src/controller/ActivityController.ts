import Activity from '../model/data/schema/Activity';
import CrudFactory from './factory/CrudFactory';

namespace ActivityController {
  export const createActivity = CrudFactory.createOne(Activity);
  export const getActivity = CrudFactory.getOne(Activity);
  export const getAllActivities = CrudFactory.getAll(Activity);
  export const updateActivity = CrudFactory.updateOne(Activity);
  export const deleteActivity = CrudFactory.deleteOne(Activity);
}
export default ActivityController;
