import { SendMailCase } from './send-mail.case';
import { MailService } from '../../service/mail/mail.service';

describe('Send Mail Case', () => {
  let mailService: MailService;
  let mailerService: any;
  const subject = 'New email from service';
  const text = 'This is a new email';

  beforeEach(() => {
    mailerService = {
      sendMail: jest.fn().mockReturnValueOnce(Promise.resolve()),
    };
    mailService = new MailService(mailerService);
  });

  it('should be able to send a mail', async () => {
    const sendMailCase = new SendMailCase(mailService);

    jest.spyOn(sendMailCase, 'execute');

    await sendMailCase.execute({ subject, text });

    expect(sendMailCase.execute).toHaveBeenCalledWith({ subject, text });
  });

  it('should throw an error if mailerService.sendMail throws an error', async () => {
    const error = new Error('Failed to send email.');
    mailerService.sendMail.mockRejectedValueOnce(error);

    mailService = new MailService(mailerService);

    const sendMailCase = new SendMailCase(mailService);

    jest.spyOn(sendMailCase, 'execute');

    await sendMailCase.execute({ subject, text });

    await expect(sendMailCase.execute({ subject, text })).rejects.toThrow(
      error,
    );
    expect(sendMailCase.execute).toHaveBeenCalledWith({ subject, text });
  });
});
