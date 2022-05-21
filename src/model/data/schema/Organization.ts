import { Model, Schema, Document, model } from 'mongoose';
import { IUser } from './User';
import { IMedic } from './Medic';

export interface IOrganization extends Document {
  name: string;
  description: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  image: string;

  administrator: IUser;
  medics: Array<IMedic>;
}

const OrganizationSchema = new Schema<IOrganization>({
  name: {
    type: String,
    required: false,
    default: '',
  },
  country: {
    type: String,
    required: false,
    default: '',
  },
  city: {
    type: String,
    required: false,
    default: '',
  },
  address: {
    type: String,
    required: false,
    default: '',
  },
  phone: {
    type: String,
    required: false,
    default: '',
  },
  image: {
    type: String,
    required: false,
    default: '',
  },
  administrator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  medics: [{ type: Schema.Types.ObjectId, ref: 'Medic' }],
});

const Organization: Model<IOrganization> = model(
  'Organization',
  OrganizationSchema,
);
export default Organization;
