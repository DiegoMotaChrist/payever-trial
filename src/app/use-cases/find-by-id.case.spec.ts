import { UserService } from '../../service/user/user.service';
import { HttpService } from '@nestjs/axios';
import { FindByIdCase } from './find-by-id.case';

describe('Find By Id Case', () => {
  let httpService: HttpService;
  let userService: UserService;

  beforeEach(() => {
    httpService = new HttpService();
    userService = new UserService(httpService);
  });

  it('should be able to find a user by id', async () => {
    const userId = '2';
    const findByIdCase = new FindByIdCase(userService);

    jest.spyOn(findByIdCase, 'execute');

    const { user } = await findByIdCase.execute({ userId });

    expect(user).toBeTruthy();
    expect(findByIdCase.execute).toHaveBeenCalledWith({ userId });
  });

  it('should be able to not found a user', async () => {
    const userId = 'undefined';
    const findByIdCase = new FindByIdCase(userService);

    jest.spyOn(findByIdCase, 'execute');

    expect(() => {
      return findByIdCase.execute({
        userId,
      });
    }).rejects.toThrow();

    expect(findByIdCase.execute).toHaveBeenCalledWith({ userId });
  });
});
