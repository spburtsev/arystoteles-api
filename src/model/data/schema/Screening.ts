import { Model, Schema, Document, model } from 'mongoose';
import _Option from './types/_Option';
import _Expectation from './types/_Expectation';
import { IQuestion } from './Question';
import { IChild } from './Child';
import { ICaregiver } from './Caregiver';
import ScreeningResult from '../../enum/ScreeningResult';

export interface IScreening extends Document {
  questions: Array<IQuestion>;
  answers: Array<number>;
  child: IChild;
  caregiver: ICaregiver;
  createdAt: Date;
  updatedAt?: Date;
  result?: ScreeningResult;

  estimateResult: () => void;
}

const ScreeningSchema = new Schema({
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  answers: [Number],
  child: { type: Schema.Types.ObjectId, ref: 'Child' },
  caregiver: { type: Schema.Types.ObjectId, ref: 'Caregiver' },
  createdAt: { type: Date },
  updatedAt: { type: Date, required: false },
  result: {
    type: String,
    enum: Object.values(ScreeningResult),
    required: false,
  },
});

ScreeningSchema.methods.estimateResult = async function() {
  let passedAnswers = 0;
  this.questions.forEach((question: IQuestion, index) => {
    const relevantExpectation = question.expectations.find(
      x => x.ageGroup === this.child.ageGroup,
    ).value;
    if (this.options[this.answers[index]] === relevantExpectation) {
      ++passedAnswers;
    }
  });
  const percentage = passedAnswers / this.questions.length;
  this.result =
    percentage >= 0.5
      ? ScreeningResult.MeetsExpectations
      : ScreeningResult.NeedsReview;
};

const Screening: Model<IScreening> = model('Screening', ScreeningSchema);
export default Screening;
