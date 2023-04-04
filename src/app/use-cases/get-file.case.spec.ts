import { HttpService } from '@nestjs/axios';
import { GetFileCase } from './get-file.case';
import { HttpException, HttpStatus } from '@nestjs/common';

import { FileService } from '../../service/user/file.service';
import { UserService } from '../../service/user/user.service';
import { catchError, map, of } from 'rxjs';

describe('Get File Case', () => {
  let httpService: HttpService;
  let fileService: FileService;
  let userService: UserService;

  beforeEach(() => {
    httpService = new HttpService();
    userService = new UserService(httpService);
    fileService = new FileService(httpService);
  });

  it('should be able to get a file', async () => {
    const userId = '2';
    const getFileCase = new GetFileCase(fileService);

    const {
      data: { avatar: fileUrl },
    } = await userService.findByApiUserId(userId);

    jest.spyOn(getFileCase, 'execute');

    const { base64, buffer } = await getFileCase.execute({ fileUrl });

    expect(base64).toBeTruthy();
    expect(buffer).toBeTruthy();
    expect(getFileCase.execute).toHaveBeenCalledWith({ fileUrl });
  });

  it('should be able to get a file error service', async () => {
    const fileUrl = '';
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

    fileService = new FileService(httpService);

    const getFileCase = new GetFileCase(fileService);

    jest.spyOn(getFileCase, 'execute');

    await expect(getFileCase.execute({ fileUrl })).rejects.toThrow(
      HttpException,
    );
  });
});
