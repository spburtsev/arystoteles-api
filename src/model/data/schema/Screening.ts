import { Model, Schema, Document, model } from 'mongoose';
import _Option from './types/_Option';
import _Expectation from './types/_Expectation';
import { IQuestion } from './Question';
import { IChildRelation } from './ChildRelation';
import ScreeningResult from '../../enum/ScreeningResult';
import AppLocale from '../../enum/AppLocale';

export interface IScreening extends Document {
  questions: Array<IQuestion>;
  answers: Array<number>;
  relation: IChildRelation;
  createdAt: Date;
  updatedAt?: Date;
  result?: ScreeningResult;
  localized: (locale: AppLocale) => any;
  estimateResult: () => void;
}

const ScreeningSchema = new Schema({
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  answers: [{ type: Number }],
  relation: { type: Schema.Types.ObjectId, ref: 'ChildRelation' },
  createdAt: { type: Date },
  updatedAt: { type: Date, required: false },
  result: {
    type: String,
    enum: Object.values(ScreeningResult),
    required: false,
  },
});

ScreeningSchema.methods.estimateResult = async function(this: IScreening) {
  let passedAnswers = 0;
  const ageGroup = this.relation.child.ageGroup;
  this.questions.forEach((question: IQuestion, index) => {
    const relevantExpectation = question.expectations.find(
      x => x.ageGroup === ageGroup,
    ).value;
    const relevantOption = question.options[this.answers[index]].value;
    if (relevantOption === relevantExpectation) {
      ++passedAnswers;
    }
  });
  const percentage = passedAnswers / this.questions.length;
  this.result =
    percentage >= 0.5
      ? ScreeningResult.MeetsExpectations
      : ScreeningResult.NeedsReview;
};

ScreeningSchema.methods.localized = function(locale: AppLocale) {
  return {
    _id: this._id,
    totalQuestions: this.questions.length,
    questions: this.questions.map(question => question.localized(locale)),
    answers: this.answers,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    result: this.result,
  };
};

const Screening: Model<IScreening> = model('Screening', ScreeningSchema);
export default Screening;
