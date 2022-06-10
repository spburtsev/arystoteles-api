import { Model, Schema, Document, model } from 'mongoose';
import Option from '../Option';
import _Option from './types/_Option';
import _Expectation from './types/_Expectation';
import Expectation from '../Expectation';

export interface IQuestion extends Document {
  options: Array<Option>;
  expectations: Array<Expectation>;
}

const QuestionSchema = new Schema({
  options: [_Option],
  expectations: [_Expectation],
});

const Question: Model<IQuestion> = model('Question', QuestionSchema);
export default Question;
