import Question from '../model/data/schema/Question';
import CrudFactory from '../lib/CrudFactory';

namespace QuestionController {
  export const createQuestion = CrudFactory.createOne(Question);
  export const getQuestion = CrudFactory.getOne(Question);
  export const getAllQuestions = CrudFactory.getAll(Question);
  export const updateQuestion = CrudFactory.updateOne(Question);
  export const deleteQuestion = CrudFactory.deleteOne(Question);
}
export default QuestionController;
