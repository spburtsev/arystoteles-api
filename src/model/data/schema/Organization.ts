import { Model, Schema, Document, model, Query } from 'mongoose';
import { IUser } from './User';
import { IMedic } from './Medic';
import UserRole from '../../enum/UserRole';

export interface IOrganization extends Document {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  image?: string;
  administrator: IUser;
  medics: Array<IMedic>;
}

const OrganizationSchema = new Schema<IOrganization>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  administrator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  medics: [{ type: Schema.Types.ObjectId, ref: 'Medic' }],
});

OrganizationSchema.pre<Query<Array<IMedic>, IMedic>>(/^find/, function(next) {
  if (!this.getPopulatedPaths().includes('medics')) {
    this.populate({ path: 'medics', populate: { path: 'user' } });
  }
  next();
});

const Organization: Model<IOrganization> = model(
  'Organization',
  OrganizationSchema,
);
export default Organization;
