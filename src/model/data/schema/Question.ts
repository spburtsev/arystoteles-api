import { Model, Schema, Document, model } from 'mongoose';
import Option from '../Option';
import _Option from './types/_Option';
import _Expectation from './types/_Expectation';
import _LocalizedString from './types/_LocalizedString';
import Expectation from '../Expectation';
import QuestionCategory from '../../enum/QuestionCategory';
import AppLocale from '../../enum/AppLocale';
import LocalizedString from '../LocalizedString';

export interface IQuestion extends Document {
  text: LocalizedString;
  options: Array<Option>;
  expectations: Array<Expectation>;
  category: QuestionCategory;

  localized: (locale: AppLocale) => any;
}

const QuestionSchema = new Schema({
  text: { type: _LocalizedString },
  options: [{ type: _Option }],
  expectations: [{ type: _Expectation }],
  category: { type: String, enum: Object.values(QuestionCategory) },
});

QuestionSchema.methods.localized = function(locale: AppLocale) {
  return {
    text: this.text[locale],
    options: this.options.map(option => ({
      text: option.text[locale],
      value: option.value,
    })),
    expectations: this.expectations,
  };
};

const Question: Model<IQuestion> = model('Question', QuestionSchema);
export default Question;
