import { UserEntity } from './user.entity';

describe('UserEntity', () => {
  it('should create a new instance of UserEntity', () => {
    const user = new UserEntity({ name: 'John Doe', job: 'Software Engineer' });
    expect(user).toBeInstanceOf(UserEntity);
    expect(user.name).toBe('John Doe');
    expect(user.job).toBe('Software Engineer');
  });
});
