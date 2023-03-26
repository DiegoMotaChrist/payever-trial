import { MessageService } from './message.service';

describe('MessageService', () => {
  let messageService: MessageService;

  beforeEach(() => {
    messageService = new MessageService();
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      const message = 'Hello, world!';
      messageService['client'] = {
        connect: jest.fn(),
        send: jest.fn(),
        close: jest.fn(),
      } as any;

      await messageService.sendMessage(message);

      expect(messageService['client'].send).toHaveBeenCalledWith(
        'user',
        message,
      );
    });
  });
});
