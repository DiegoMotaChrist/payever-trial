import { Document } from 'mongoose';

export interface UserModel extends Document {
  readonly name: string;
  readonly id: string;
  readonly job: string;
  readonly created_At: string;
}
