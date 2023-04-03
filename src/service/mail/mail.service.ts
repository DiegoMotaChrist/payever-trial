import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ErrorResponse } from 'src/helpers/Error';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(subject: string, text: string) {
    this.logger.log('Sending Email...');
    await this.mailerService
      .sendMail({
        to: 'diego.christ@outlook.com',
        subject,
        text,
      })
      .catch((error) => {
        this.logger.error(error);
        const errorReponse: ErrorResponse = {
          name: error.name,
          code: error.code,
          message: error.message,
          statusText: error.response?.statusText,
        };
        throw new HttpException(
          errorReponse,
          error.response?.status ?? HttpStatus.BAD_REQUEST,
        );
      });
  }
}
