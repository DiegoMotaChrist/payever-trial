import { MailService } from './mail.service';

describe('MailService', () => {
  let mailService: MailService;
  let mailerService: any;
  const subject = 'Test Email';
  const text = 'This is a test email.';
  const to = 'diego.christ@outlook.com';

  describe('sendEmail', () => {
    beforeEach(() => {
      mailerService = {
        sendMail: jest.fn(),
      } as any;
    });
    it('should call mailerService.sendMail with the correct parameters', async () => {
      mailService = new MailService(mailerService);
      await mailService.sendEmail(subject, text);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to,
        subject,
        text,
      });
    });

    it('should throw an error if mailerService.sendMail throws an error', async () => {
      const error = new Error('Failed to send email.');
      mailerService.sendMail.mockRejectedValueOnce(error);

      mailService = new MailService(mailerService);

      await expect(
        mailService.sendEmail('Test Email', 'This is a test email.'),
      ).rejects.toThrow(error);
    });
  });
});
