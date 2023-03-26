import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(subject: string, text: string) {
    try {
      console.log('Sending Email...');

      await this.mailerService.sendMail({
        to: 'diego.christ@outlook.com',
        subject,
        text,
      });
    } catch (err) {
      throw err;
    }
  }
}
