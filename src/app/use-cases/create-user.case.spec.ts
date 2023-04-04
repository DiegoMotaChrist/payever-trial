import { InMemoryUserRepository } from '../../../test/repositories/in-memory-user.repository';
import { CreateUserCase } from './create-user.case';
import { SendMailCase } from './send-mail.case';
import { MailService } from '../../service/mail/mail.service';
import { SendMessageCase } from './send-message.case';
import { UserService } from '../../service/user/user.service';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RabbitMQService } from '../../service/messaging/rabbitmq.service';
import { catchError, map, of } from 'rxjs';

describe('Create User Case', () => {
  let httpService: HttpService;
  let userService: UserService;
  let mailService: MailService;
  let mailerService: any;
  let rabbitMQService: RabbitMQService;
  let sendMailCase: SendMailCase;
  let sendMessageCase: SendMessageCase;

  beforeEach(() => {
    httpService = new HttpService();
    userService = new UserService(httpService);

    mailerService = {
      sendMail: jest.fn().mockResolvedValueOnce(Promise.resolve(null)),
    };

    mailService = new MailService(mailerService);
    rabbitMQService = new RabbitMQService();
    sendMailCase = new SendMailCase(mailService);
    sendMessageCase = new SendMessageCase(rabbitMQService);
  });

  it('should be able to create a new user', async () => {
    const job = 'leader';
    const name = 'morpheus';

    const userRepository = new InMemoryUserRepository();
    const createUserCase = new CreateUserCase(
      userRepository,
      userService,
      sendMailCase,
      sendMessageCase,
    );

    jest.spyOn(createUserCase, 'execute');

    const { user } = await createUserCase.execute({
      job,
      name,
    });

    expect(user).toBeTruthy();
    expect(user.name).toEqual(name);
    expect(user.job).toEqual(job);
    expect(createUserCase.execute).toHaveBeenCalledWith({ job, name });
  });

  it('should be able to error in create a new user', async () => {
    const job = 'leader';
    const name = 'morpheus';

    const error = {
      message: 'Internal Error',
      name: 'new Error',
      code: '500',
      response: {
        statusText: 'Internal',
      },
    };

    const userRepository = new InMemoryUserRepository();

    httpService = {
      post: jest.fn(),
    } as unknown as HttpService;

    jest.spyOn(httpService, 'post').mockReturnValueOnce(
      of(() => {
        throw error;
      }).pipe(
        map((response) => response()),
        catchError((error) => {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }),
      ) as any,
    );

    userService = new UserService(httpService);

    const createUserCase = new CreateUserCase(
      userRepository,
      userService,
      sendMailCase,
      sendMessageCase,
    );

    jest.spyOn(createUserCase, 'execute');

    await expect(createUserCase.execute({ job, name })).rejects.toThrow(
      HttpException,
    );
  });
});
