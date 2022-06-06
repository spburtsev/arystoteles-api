import { Model, Schema, Document, model } from 'mongoose';
import { IChild } from './Child';
import { ICaregiver } from './Caregiver';
import ChildFeeling from '../../../model/enum/ChildFeeling';

export interface IJournalPost extends Document {
  text: string;
  childFeeling: ChildFeeling;
  private: boolean;
  notifyMedic: boolean;

  child: IChild;
  caregiver: ICaregiver;
}

const JournalPostSchema = new Schema({
  text: { type: String, required: true },
  childFeeling: {
    type: ChildFeeling,
    required: false,
    default: ChildFeeling.Neutral,
  },
  private: { type: Boolean, required: false, default: false },
  notifyMedic: { type: Boolean, required: false, default: false },

  child: { type: Schema.Types.ObjectId, ref: 'Child' },
  caregiver: { type: Schema.Types.ObjectId, ref: 'Caregiver' },
});

const JournalPost: Model<IJournalPost> = model(
  'JournalPost',
  JournalPostSchema,
);
export default JournalPost;
