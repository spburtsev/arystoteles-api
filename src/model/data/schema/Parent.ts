import { Schema } from 'mongoose';

const parent = new Schema({
  firstName: String,
  lastName: String,
});
export default parent;
