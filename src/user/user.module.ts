import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAvatarSchema } from '../database/model/user/schema/user-avatar.schema';
import { UserSchema } from '../database/model/user/schema/user.schema';
import { MailService } from '../service/mail/mail.service';
import { MessageService } from '..//service/message/message.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MessageModule } from 'src/service/message/message.module';
import { MailModule } from 'src/service/mail/mail.module';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    MongooseModule.forRoot(String(process.env.MONGO_URL)),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'UserAvatar', schema: UserAvatarSchema },
    ]),
    MailModule,
    HttpModule,
    MessageModule,
  ],
  controllers: [UserController],
  providers: [UserService, MessageService, MailService],
})
export class UserModule {}
