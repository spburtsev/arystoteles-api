import { Model, Schema, Document, model } from 'mongoose';
import Option from '../Option';
import _Option from './types/_Option';
import _Expectation from './types/_Expectation';
import _LocalizedString from './types/_LocalizedString';
import Expectation from '../Expectation';
import QuestionCategory from '../../enum/QuestionCategory';
import LocalizedString from '../LocalizedString';

export interface IQuestion extends Document {
  text: LocalizedString;
  options: Array<Option>;
  expectations: Array<Expectation>;
  category: QuestionCategory;
}

const QuestionSchema = new Schema({
  text: { type: _LocalizedString },
  options: [{ type: _Option }],
  expectations: [{ type: _Expectation }],
  category: { type: String, enum: Object.values(QuestionCategory) },
});

const Question: Model<IQuestion> = model('Question', QuestionSchema);
export default Question;
