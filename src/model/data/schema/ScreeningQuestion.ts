import { Model, Schema, Document, model } from 'mongoose';
import Option from '../Option';
import LocalizedString from '../LocalizedString';

export interface IScreeningQuestion extends Document {
  text: LocalizedString;
  answerVariants: Array<LocalizedString>;
  options: Array<Option>;
}

// const TipSchema = new Schema({
//   category: {
//     type: String,
//     required: false,
//     default: TipCategory.Other,
//     enum: Object.values(TipCategory),
//   },
//   ageGroups: [{ type: Number, required: true, enum: Object.values(AgeGroup) }],
//   text: { type: Schema.Types._LocalizedString, required: true },
// });

// const Tip: Model<ITip> = model('Tip', TipSchema);
// export default Tip;
