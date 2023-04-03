import { Injectable } from '@nestjs/common';
import { MailService } from 'src/service/mail/mail.service';

interface SendMailCaseRequest {
  subject: string;
  text: string;
}

@Injectable()
export class SendMailCase {
  constructor(private readonly mailService: MailService) {}

  async execute(request: SendMailCaseRequest): Promise<void> {
    const { subject, text } = request;

    await this.mailService.sendEmail(subject, text);
  }
}
