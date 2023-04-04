import { UserService } from '../../service/user/user.service';
import { HttpService } from '@nestjs/axios';
import { FindAvatarByUserCase } from './find-avatar-by-user.case';
import { InMemoryUserAvatarRepository } from '../../../test/repositories/in-memory-user-avatar.repository';
import { GetFileCase } from './get-file.case';
import { FileService } from '../../service/user/file.service';
import { makeUserAvatar } from '../../../test/factories/user-avatar-factory';
import { catchError, map, of } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('Find Avatar By User Case', () => {
  let httpService: HttpService;
  let userService: UserService;
  let fileService: FileService;
  let getFileCase: GetFileCase;

  beforeEach(() => {
    httpService = new HttpService();
    userService = new UserService(httpService);
    fileService = new FileService(httpService);
    getFileCase = new GetFileCase(fileService);
  });

  it('should be able to find avatar by user exists', async () => {
    const userId = '2';
    const userAvatar = await makeUserAvatar();
    const userAvatarRepository = new InMemoryUserAvatarRepository();
    userAvatarRepository.create(userAvatar);

    const findAvatarByUserCase = new FindAvatarByUserCase(
      userService,
      userAvatarRepository,
      getFileCase,
    );

    jest.spyOn(findAvatarByUserCase, 'execute');

    const { file, base64 } = await findAvatarByUserCase.execute({ userId });

    expect(file).toBeTruthy();
    expect(base64).toBeTruthy();
    expect(findAvatarByUserCase.execute).toHaveBeenCalledWith({ userId });
  });

  it('should be able to find avatar by user not exists', async () => {
    const userId = '2';
    const userAvatarRepository = new InMemoryUserAvatarRepository();

    const findAvatarByUserCase = new FindAvatarByUserCase(
      userService,
      userAvatarRepository,
      getFileCase,
    );

    jest.spyOn(findAvatarByUserCase, 'execute');

    const { file, base64 } = await findAvatarByUserCase.execute({
      userId,
    });

    expect(file).toBeFalsy();
    expect(base64).toBeTruthy();
    expect(findAvatarByUserCase.execute).toHaveBeenCalledWith({
      userId,
    });
  });

  it('should be able to not found a user', async () => {
    const userId = 'undefined';
    const userAvatarRepository = new InMemoryUserAvatarRepository();

    const findAvatarByUserCase = new FindAvatarByUserCase(
      userService,
      userAvatarRepository,
      getFileCase,
    );

    jest.spyOn(findAvatarByUserCase, 'execute');

    expect(() => {
      return findAvatarByUserCase.execute({
        userId,
      });
    }).rejects.toThrow();

    expect(findAvatarByUserCase.execute).toHaveBeenCalledWith({ userId });
  });

  it('should be able to error in find user', async () => {
    const userId = '2';
    const userAvatarRepository = new InMemoryUserAvatarRepository();

    const error = {
      message: 'Internal Error',
      name: 'new Error',
      code: '500',
      response: {
        statusText: 'Internal',
      },
    };

    httpService = {
      get: jest.fn(),
    } as unknown as HttpService;

    jest.spyOn(httpService, 'get').mockReturnValueOnce(
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

    const findAvatarByUserCase = new FindAvatarByUserCase(
      userService,
      userAvatarRepository,
      getFileCase,
    );

    jest.spyOn(findAvatarByUserCase, 'execute');

    expect(() => {
      return findAvatarByUserCase.execute({
        userId,
      });
    }).rejects.toThrow();
  });
});
