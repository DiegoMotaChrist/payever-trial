import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    ClientsModule.register([
      {
        name: 'bkplkutk',
        transport: Transport.RMQ,
        options: {
          urls: [String(process.env.RABBIT_URL)],
          queue: 'user',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
})
export class ServiceModule {}
