import { Model, Schema, Document, model } from 'mongoose';

export interface IOrganization extends Document {
  id: string;
  name: string;
  description: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  image: string;
}

const OrganizationSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});

const Organization: Model<IOrganization> = model(
  'Organization',
  OrganizationSchema,
);
export default Organization;
