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

const Screening: Model<IScreening> = model('Screening', ScreeningSchema);
export default Screening;
