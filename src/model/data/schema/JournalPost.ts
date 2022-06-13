import { Model, Schema, Document, model } from 'mongoose';
import { IChildRelation } from './ChildRelation';
import ChildFeeling from '../../enum/ChildFeeling';

export interface IJournalPost extends Document {
  text: string;
  childFeeling: ChildFeeling;
  private: boolean;
  notifyMedic: boolean;
  relation: IChildRelation;
}

const JournalPostSchema = new Schema({
  text: { type: String, required: true },
  childFeeling: {
    type: String,
    required: false,
    enum: Object.values(ChildFeeling),
    default: ChildFeeling.Neutral,
  },
  private: { type: Boolean, required: false, default: false },
  notifyMedic: { type: Boolean, required: false, default: false },

  relation: { type: Schema.Types.ObjectId, ref: 'ChildRelation' },
});

const JournalPost: Model<IJournalPost> = model(
  'JournalPost',
  JournalPostSchema,
);
export default JournalPost;
