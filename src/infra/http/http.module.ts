import { Module } from '@nestjs/common';
import { CreateUserCase } from '../../app/use-cases/create-user.case';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './controllers/user.controller';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { UserService } from '../../service/user/user.service';
import { FindByIdCase } from '../../app/use-cases/find-by-id.case';
import { DeleteUserCase } from '../../app/use-cases/delete-user.case';
import { FindAvatarByUserCase } from '../../app/use-cases/find-avatar-by-user.case';
import { FileService } from '../../service/user/file.service';
import { GetFileCase } from '../../app/use-cases/get-file.case';
import { SendMailCase } from '../../app/use-cases/send-mail.case';
import { MailService } from '../../service/mail/mail.service';
import { SendMessageCase } from '../../app/use-cases/send-message.case';
import { RabbitMQService } from '../../service/messaging/rabbitmq.service';
import { ReceiverController } from './controllers/receiver.controller';

@Module({
  imports: [AxiosHttpModule, HttpModule, DatabaseModule],
  controllers: [UserController, ReceiverController],
  providers: [
    CreateUserCase,
    FindByIdCase,
    DeleteUserCase,
    FindAvatarByUserCase,
    GetFileCase,
    SendMailCase,
    SendMessageCase,
    UserService,
    FileService,
    MailService,
    RabbitMQService,
  ],
})
export class HttpModule {}
