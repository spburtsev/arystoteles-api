import Tip from '../model/data/schema/Tip';
import CrudFactory from '../lib/CrudFactory';

namespace TipController {
  export const createTip = CrudFactory.createOne(Tip);
  export const getTip = CrudFactory.getOne(Tip);
  export const getAllTips = CrudFactory.getAll(Tip);
  export const updateTip = CrudFactory.updateOne(Tip);
  export const deleteTip = CrudFactory.deleteOne(Tip);
}
export default TipController;
