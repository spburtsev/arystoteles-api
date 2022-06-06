import { Model, Schema, Document, model } from 'mongoose';
import AgeGroup from '../../../model/enum/AgeGroup';
import TipCategory from '../../../model/enum/TipCategory';
import LocalizedString from '../LocalizedString';

export interface ITip extends Document {
  category: TipCategory;
  ageGroups: Array<AgeGroup>;
  text: LocalizedString;
}

const TipSchema = new Schema({
  category: {
    type: String,
    required: false,
    default: TipCategory.Other,
    enum: Object.values(TipCategory),
  },
  ageGroups: [{ type: Number, required: true, enum: Object.values(AgeGroup) }],
  text: { type: Schema.Types._LocalizedString, required: true },
});

const Tip: Model<ITip> = model('Tip', TipSchema);
export default Tip;
