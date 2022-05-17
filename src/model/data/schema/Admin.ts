import { Schema, model } from 'mongoose';
import AdminType from '../../enums/AdminType';

const admin = new Schema({
  _id: Schema.Types.ObjectId,
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [AdminType.Seed, AdminType.Admin],
    required: true,
  },
});

const Admin = model('Admin', admin);
export default Admin;
