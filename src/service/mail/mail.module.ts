import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

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
  ],
})
export class MailModule {}
