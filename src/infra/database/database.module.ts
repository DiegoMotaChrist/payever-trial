import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from '../../app/repositories/user.repository';
import { MongoUserRepository } from './mongo/repositories/mongo-user.repository';
import { UserAvatarSchema } from './mongo/schema/user/user-avatar.schema';
import { UserSchema } from './mongo/schema/user/user.schema';
import { config } from 'dotenv';
import { UserAvatarRepository } from '../../app/repositories/user-avatar.repository';
import { MongoUserAvatarRepository } from './mongo/repositories/mongo-user-avatar.repository';

config();

@Module({
  imports: [
    MongooseModule.forRoot(String(process.env.MONGO_URL)),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'UserAvatar', schema: UserAvatarSchema },
    ]),
  ],
  providers: [
    { provide: UserRepository, useClass: MongoUserRepository },
    { provide: UserAvatarRepository, useClass: MongoUserAvatarRepository },
  ],
  exports: [UserRepository, UserAvatarRepository],
})
export class DatabaseModule {}
