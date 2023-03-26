import { catchError, of, map } from 'rxjs';
import { HttpService } from '@nestjs/axios/dist';
import { UserService } from './user.service';

describe('User Service', () => {
  let userService: UserService;
  let userModel: any;
  let userAvatarModel: any;
  let messageService: any;
  let mailService: any;
  let httpService: HttpService;

  const createdUser = {
    id: 1,
    name: 'diego',
    job: 'developer',
    createdAt: '2023-03-24',
  };

  const user = {
    data: {
      avatar: 'any_avatar_url',
      email: 'diego.christ@outlook.com',
      first_name: 'Diego',
      id: 1,
      last_name: 'Christ',
    },
    support: {
      url: 'any_support_url',
      text: 'any_text',
    },
  };

  const userAvatar = {
    user_id: 1,
    hash: 'any_hash',
    content: {
      name: 'file_name',
      mime_type: 'image/jpg',
      size: 1000,
    },
  };

  describe('findOne', () => {
    beforeEach(() => {
      httpService = {
        get: jest.fn(),
      } as unknown as HttpService;

      userService = new UserService(
        userModel,
        userAvatarModel,
        messageService,
        httpService,
        mailService,
      );
    });

    it('should return a valid user', async () => {
      const id = '1';
      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          data: user,
        }).pipe(
          map((response) => response),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      );
      const result = await userService.findOne(id);
      expect(result).toEqual(user);
      expect(httpService.get).toHaveBeenCalledWith(
        `https://reqres.in/api/users/${id}`,
      );
    });

    it('should throw an error when fetching an invalid user', async () => {
      const id = 'invalid-id';
      const error = new Error('Usuário não encontrado');
      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of(() => {
          throw error;
        }).pipe(
          map((response) => response()),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      );
      await expect(userService.findOne(id)).rejects.toThrow(error);
      expect(httpService.get).toHaveBeenCalledWith(
        `https://reqres.in/api/users/${id}`,
      );
    });

    it('should throw an error if httpService throws an error', async () => {
      const id = 'any-id';
      const error = new Error('Internal Server Error');
      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of(() => {
          throw error;
        }).pipe(
          map((response) => response()),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      );
      await expect(userService.findOne(id)).rejects.toThrow(error);
    });
  });

  describe('_getFile', () => {
    const file_url = 'http://example.com/image.jpg';
    const name = 'image.jpg';
    const userId = '1';
    const buffer = Buffer.from('test');
    const base64 = buffer.toString('base64');

    beforeEach(() => {
      jest.clearAllMocks();
      httpService = {
        get: jest.fn(),
      } as unknown as HttpService;
    });

    it('should return file and base64 data when user avatar exists', async () => {
      userAvatarModel = {
        findOne: jest.fn().mockReturnValueOnce({
          exec: jest.fn().mockResolvedValueOnce(userAvatar),
        }),
        save: jest.fn().mockResolvedValueOnce(null),
      };

      userService = new UserService(
        userModel,
        userAvatarModel,
        messageService,
        httpService,
        mailService,
      );

      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          data: buffer,
        }).pipe(
          map((response) => response),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      );
      const result = await userService._getFile(file_url, name, userId);
      expect(result.file).toEqual(userAvatar);
      expect(result.base64).toEqual(base64);
    });

    // it('should only return base64 data when user avatar does not exist', async () => {
    //   const buffer = Buffer.from('test');
    //   const base64 = buffer.toString('base64');

    //   // const userAvatarModel: Model<any> = {
    //   //   findOne: jest.fn().mockReturnValueOnce({
    //   //     exec: jest.fn().mockResolvedValueOnce(null),
    //   //   }),
    //   //   save: jest.fn().mockResolvedValueOnce(null),
    //   //   constructor: jest.fn().mockReturnValueOnce(userAvatar),
    //   // } as any;

    //   const userAvatarModel: Model<any> = new Model(userAvatar);

    //   userService = new UserService(
    //     userModel,
    //     userAvatarModel,
    //     messageService,
    //     httpService,
    //     mailService,
    //   );

    //   jest.spyOn(httpService, 'get').mockReturnValueOnce(
    //     of({
    //       data: buffer,
    //     }).pipe(
    //       map((response) => response),
    //       catchError((error) => {
    //         throw error;
    //       }),
    //     ) as any,
    //   );

    //   const result = await userService._getFile(file_url, name, userId);
    //   expect(result.file).toEqual(null);
    //   expect(result.base64).toEqual(base64);
    // });

    it('should throw an error if httpService throws an error', async () => {
      const error = new Error('Internal Server Error');
      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of(() => {
          throw error;
        }).pipe(
          map((response) => response()),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      );

      userService = new UserService(
        userModel,
        userAvatarModel,
        messageService,
        httpService,
        mailService,
      );

      await expect(
        userService._getFile(file_url, name, userId),
      ).rejects.toThrow(error);
    });
  });

  describe('findAvatarByUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      httpService = {
        get: jest.fn(),
      } as unknown as HttpService;
    });

    it('should return error if user not found', async () => {
      const id = 'any-id';
      const error = new Error('User not found');
      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          data: {
            data: { avatar: null },
          },
        }).pipe(
          map((response) => response),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      );

      userService = new UserService(
        userModel,
        userAvatarModel,
        messageService,
        httpService,
        mailService,
      );

      await expect(userService.findAvatarByUser(id)).rejects.toThrow(error);
    });

    it('should only return base64 because there is no file saved', async () => {
      const id = '1';
      const buffer = Buffer.from('test');
      const base64 = buffer.toString('base64');

      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          data: {
            data: { avatar: 'any_url' },
          },
        }).pipe(
          map((response) => response),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      );

      userService = new UserService(
        userModel,
        userAvatarModel,
        messageService,
        httpService,
        mailService,
      );

      const _getFileMock = jest.fn().mockResolvedValueOnce({
        file: null,
        base64,
      });

      userService['_getFile'] = _getFileMock;

      const result = await userService.findAvatarByUser(id);

      expect(result.base64).toBeDefined();
      expect('file' in result).toBeFalsy();
    });

    it('should return file and base64 if file saved', async () => {
      const id = '1';
      const buffer = Buffer.from('test');
      const base64 = buffer.toString('base64');

      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          data: {
            data: { avatar: 'any_url' },
          },
        }).pipe(
          map((response) => response),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      );

      userService = new UserService(
        userModel,
        userAvatarModel,
        messageService,
        httpService,
        mailService,
      );

      const _getFileMock = jest.fn().mockResolvedValueOnce({
        file: userAvatar,
        base64,
      });

      userService['_getFile'] = _getFileMock;

      const result = await userService.findAvatarByUser(id);

      expect(result.base64).toBeDefined();
      expect('file' in result).toBeTruthy();
    });

    it('should throw an error if httpService throws an error', async () => {
      const id = '1';
      const error = new Error('Internal Server Error');
      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of(() => {
          throw error;
        }).pipe(
          map((response) => response()),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      );

      userService = new UserService(
        userModel,
        userAvatarModel,
        messageService,
        httpService,
        mailService,
      );

      await expect(userService.findAvatarByUser(id)).rejects.toThrow(error);
    });

    it('should throw an error in _getFile', async () => {
      const id = '1';

      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          data: {
            data: { avatar: 'any_url' },
          },
        }).pipe(
          map((response) => response),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      );

      userService = new UserService(
        userModel,
        userAvatarModel,
        messageService,
        httpService,
        mailService,
      );

      const _getFileMock = jest.fn().mockResolvedValueOnce(() => {
        throw new Error('Internal Server Error');
      });

      userService['_getFile'] = _getFileMock;

      const result = await userService.findAvatarByUser(id);

      expect(result.base64).toBeUndefined();
      expect('file' in result).toBeFalsy();
    });
  });

  describe('create', () => {
    const newUser = { job: 'developer', name: 'diego' };

    beforeEach(() => {
      jest.clearAllMocks();
      httpService = {
        post: jest.fn(),
      } as unknown as HttpService;
    });

    // it('should return a created user', async () => {
    //   jest.spyOn(httpService, 'post').mockReturnValueOnce(
    //     of({
    //       data: { createdUser },
    //     }).pipe(
    //       map((response) => response),
    //       catchError((error) => {
    //         throw error;
    //       }),
    //     ) as any,
    //   );

    //   userModel = new Model();

    //   userService = new UserService(
    //     userModel,
    //     userAvatarModel,
    //     messageService,
    //     httpService,
    //     mailService,
    //   );

    //   const result = await userService.create(newUser);
    //   expect(result).toEqual(createdUser);
    //   expect(httpService.post).toHaveBeenCalledWith(
    //     `https://reqres.in/api/users/`,
    //     newUser,
    //   );
    // });

    it('should throw an error in sendMessage', async () => {
      return;
    });

    it('should throw an error in sendMail', async () => {
      return;
    });

    it('should throw an error if httpService throws an error', async () => {
      const error = new Error('Internal Server Error');
      jest.spyOn(httpService, 'post').mockReturnValueOnce(
        of(() => {
          throw error;
        }).pipe(
          map((response) => response()),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      );

      userService = new UserService(
        userModel,
        userAvatarModel,
        messageService,
        httpService,
        mailService,
      );

      await expect(userService.create(newUser)).rejects.toThrow(error);
    });
  });

  describe('delete', () => {
    const id = '1';
    beforeEach(() => {
      jest.clearAllMocks();
      httpService = {
        delete: jest.fn(),
      } as unknown as HttpService;
    });

    it('should to delele a user avatar', async () => {
      jest.spyOn(httpService, 'delete').mockReturnValueOnce(
        of({
          status: 204,
        }).pipe(
          map((response) => response),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      );

      userAvatarModel = {
        findOneAndRemove: jest.fn().mockReturnValueOnce({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      };

      userService = new UserService(
        userModel,
        userAvatarModel,
        messageService,
        httpService,
        mailService,
      );

      const result = await userService.delete(id);

      expect(result.status).toEqual(204);
      expect(userAvatarModel.findOneAndRemove).toHaveBeenCalled();
    });

    it('should throw an error if httpService throws an error', async () => {
      const error = new Error('Internal Server Error');
      jest.spyOn(httpService, 'delete').mockReturnValueOnce(
        of(() => {
          throw error;
        }).pipe(
          map((response) => response()),
          catchError((error) => {
            throw error;
          }),
        ) as any,
      );

      userService = new UserService(
        userModel,
        userAvatarModel,
        messageService,
        httpService,
        mailService,
      );

      await expect(userService.delete(id)).rejects.toThrow(error);
    });
  });
});
