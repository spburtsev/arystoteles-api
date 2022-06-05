import { Model, Schema, Document, model } from 'mongoose';
import AgeGroup from 'src/model/enum/AgeGroup';
import TipCategory from 'src/model/enum/TipCategory';
import LocalizedContent, {
  LocalizedStringSchemaType,
} from '../LocalizedContent';

export interface ITip extends Document {
  category: TipCategory;
  ageGroups: Array<AgeGroup>;
  text: LocalizedContent<string>;
}

const TipSchema = new Schema({
  category: { type: TipCategory, required: false, default: TipCategory.Other },
  ageGroups: [{ type: AgeGroup, required: true }],
  text: { type: LocalizedStringSchemaType, required: true },
});

const Tip: Model<ITip> = model('Tip', TipSchema);
export default Tip;
