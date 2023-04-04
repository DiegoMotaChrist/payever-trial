import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { LOCALHOST } from '../helpers/RabbitMQ';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: 'ad230d7203a904',
          pass: 'd733a3d4eb1829',
        },
      },
    }),
    ClientsModule.register([LOCALHOST]),
  ],
})
export class ServiceModule {}
