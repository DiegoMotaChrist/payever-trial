import { UserController } from './user.controller';

describe('User Controller', () => {
  let userService: any;
  let userController: UserController;
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
    const id = '1';

    it('should return a user by id', async () => {
      userService = {
        findOne: jest.fn().mockResolvedValueOnce(user),
      };

      userController = new UserController(userService);

      const result = await userController.findOne(id);

      expect(result).toEqual(user);
      expect(userService.findOne).toHaveBeenCalledWith(id);
    });

    it('should return null if user is not found', async () => {
      userService = {
        findOne: jest.fn().mockResolvedValueOnce(null),
      };

      userController = new UserController(userService);

      const result = await userController.findOne(id);

      expect(result).toBeNull();
      expect(userService.findOne).toHaveBeenCalledWith(id);
    });

    it('should return a error', async () => {
      userService = {
        findOne: jest
          .fn()
          .mockResolvedValueOnce(
            Promise.reject(new Error('Internal Server Error')),
          ),
      };

      userController = new UserController(userService);

      await expect(userController.findOne(id)).rejects.toThrowError(
        'Internal Server Error',
      );
      expect(userService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('findAvatarByUser', () => {
    const id = '1';

    it('should return a base64', async () => {
      const base64 = Buffer.from('test').toString('base64');
      userService = {
        findAvatarByUser: jest.fn().mockResolvedValueOnce({ base64 }),
      };

      userController = new UserController(userService);

      const result = await userController.findAvatarByUser(id);

      expect(result?.base64).toEqual(base64);
      expect(userService.findAvatarByUser).toHaveBeenCalledWith(id);
    });

    it('should return a base64 and file', async () => {
      const base64 = Buffer.from('test').toString('base64');
      userService = {
        findAvatarByUser: jest
          .fn()
          .mockResolvedValueOnce({ file: userAvatar, base64 }),
      };

      userController = new UserController(userService);

      const result = await userController.findAvatarByUser(id);

      expect(result?.base64).toEqual(base64);
      expect('file' in result).toBeTruthy();
      expect(userService.findAvatarByUser).toHaveBeenCalledWith(id);
    });

    it('should return a error', async () => {
      userService = {
        findAvatarByUser: jest
          .fn()
          .mockResolvedValueOnce(
            Promise.reject(new Error('Internal Server Error')),
          ),
      };

      userController = new UserController(userService);

      await expect(userController.findAvatarByUser(id)).rejects.toThrowError(
        'Internal Server Error',
      );
      expect(userService.findAvatarByUser).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    const newUser = { job: 'developer', name: 'diego' };

    it('should return created user', async () => {
      userService = {
        create: jest.fn().mockResolvedValueOnce(createdUser),
      };

      userController = new UserController(userService);

      const result = await userController.create(newUser);

      expect(result).toEqual(createdUser);
      expect(userService.create).toHaveBeenCalledWith(newUser);
    });

    it('should return a error', async () => {
      userService = {
        create: jest
          .fn()
          .mockResolvedValueOnce(
            Promise.reject(new Error('Internal Server Error')),
          ),
      };
      userController = new UserController(userService);

      await expect(userController.create(newUser)).rejects.toThrowError(
        'Internal Server Error',
      );
      expect(userService.create).toHaveBeenCalledWith(newUser);
    });
  });

  describe('delete', () => {
    const id = '1';
    const status = 204;

    it('should return delete status', async () => {
      userService = {
        delete: jest.fn().mockResolvedValueOnce({ status }),
      };

      userController = new UserController(userService);

      const result = await userController.delete(id);

      expect(result.status).toEqual(status);
      expect(userService.delete).toHaveBeenCalledWith(id);
    });

    it('should return a error', async () => {
      userService = {
        delete: jest
          .fn()
          .mockResolvedValueOnce(
            Promise.reject(new Error('Internal Server Error')),
          ),
      };
      userController = new UserController(userService);

      await expect(userController.delete(id)).rejects.toThrowError(
        'Internal Server Error',
      );
      expect(userService.delete).toHaveBeenCalledWith(id);
    });
  });
});
