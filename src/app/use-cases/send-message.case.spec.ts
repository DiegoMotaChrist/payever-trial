import { SendMessageCase } from './send-message.case';
import { RabbitMQService } from '../../service/messaging/rabbitmq.service';
import { InMemoryUserRepository } from '../../../test/repositories/in-memory-user.repository';
import { makeUser } from '../../../test/factories/user-factory';
import { catchError, map, of } from 'rxjs';

describe('Send Message Case', () => {
  let rabbitMQService: RabbitMQService;
  let userRepository: any;
  let userMessage: any;

  beforeEach(() => {
    const userEntity = makeUser();
    rabbitMQService = new RabbitMQService();
    userRepository = new InMemoryUserRepository();
    userRepository.create(userEntity);

    userMessage = JSON.stringify(userRepository.users[0]);
  });

  it('should be able to send a message', async () => {
    const sendMessageCase = new SendMessageCase(rabbitMQService);

    jest.spyOn(sendMessageCase, 'execute');

    await sendMessageCase.execute({
      message: userMessage,
    });

    expect(sendMessageCase.execute).toHaveBeenCalledWith({
      message: userMessage,
    });
  });

  it('should throw an error if rabbitMQService.sendMessage throws an error', async () => {
    const error = new Error('Failed to send message.');

    rabbitMQService['client'] = {
      connect: jest.fn(),
      close: jest.fn(),
      emit: jest.fn().mockReturnValueOnce(
        of(() => {
          throw error;
        }).pipe(
          map((response) => response()),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      ),
    } as any;

    const sendMessageCase = new SendMessageCase(rabbitMQService);

    jest.spyOn(sendMessageCase, 'execute');

    await expect(
      sendMessageCase.execute({ message: userMessage }),
    ).rejects.toThrow(error);

    expect(sendMessageCase.execute).toHaveBeenCalledWith({
      message: userMessage,
    });
  });
});
