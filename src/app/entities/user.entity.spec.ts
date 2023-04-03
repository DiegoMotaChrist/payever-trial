import { UserEntity } from './user.entity';

describe('UserEntity', () => {
  it('it should be able to create a user', () => {
    const user = new UserEntity({
      job: 'developer',
      name: 'diego',
    });

    expect(user).toBeTruthy();
  });

  it('it should be able to create a user by API', () => {
    const user = new UserEntity({
      data: {
        avatar: 'any_url',
        email: 'diego.christ@outlook.com',
        first_name: 'diego',
        last_name: 'christ',
        id: 1,
      },
      support: {
        text: 'any_text',
        url: 'any_url',
      },
    });

    expect(user).toBeTruthy();
  });
});
