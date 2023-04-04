import { UserService } from '../../service/user/user.service';
import { HttpService } from '@nestjs/axios';
import { DeleteUserCase } from './delete-user.case';
import { InMemoryUserAvatarRepository } from '../../../test/repositories/in-memory-user-avatar.repository';
import { UserAvatarEntity } from '../entities/user-avatar.entity';
import { makeUserAvatar } from '../../../test/factories/user-avatar-factory';
import { catchError, map, of } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('Delete User Case', () => {
  let httpService: HttpService;
  let userService: UserService;

  beforeEach(() => {
    httpService = new HttpService();
    userService = new UserService(httpService);
  });

  it('should be able to delete a user', async () => {
    const userId = '2';
    const userAvatarRepository = new InMemoryUserAvatarRepository();
    const userAvatar: UserAvatarEntity = await makeUserAvatar();
    const deleteUserCase = new DeleteUserCase(
      userAvatarRepository,
      userService,
    );

    userAvatarRepository.create(userAvatar);

    jest.spyOn(deleteUserCase, 'execute');

    await deleteUserCase.execute({ userId });

    expect(deleteUserCase.execute).toHaveBeenCalledWith({ userId });
    expect(userAvatarRepository.userAvatars).toHaveLength(0);
  });

  it('should be able to error in delete a user', async () => {
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
      delete: jest.fn(),
    } as unknown as HttpService;

    jest.spyOn(httpService, 'delete').mockReturnValueOnce(
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

    const deleteUserCase = new DeleteUserCase(
      userAvatarRepository,
      userService,
    );

    jest.spyOn(deleteUserCase, 'execute');

    await expect(deleteUserCase.execute({ userId })).rejects.toThrow(
      HttpException,
    );
  });
});
