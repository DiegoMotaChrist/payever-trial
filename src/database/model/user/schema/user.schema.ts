import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  id: Number,
  name: String,
  job: String,
  created_At: Date,
});
