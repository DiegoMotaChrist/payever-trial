import { Schema } from 'mongoose';

export const UserAvatarSchema = new Schema({
  user_id: Number,
  hash: String,
  content: {
    name: String,
    mime_type: String,
    size: Number,
  },
});
