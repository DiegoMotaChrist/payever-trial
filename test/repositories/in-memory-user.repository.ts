import { UserEntity } from '../../src/app/entities/user.entity';
import { UserRepository } from '../../src/app/repositories/user.repository';

export class InMemoryUserRepository implements UserRepository {
  public users: UserEntity[] = [];

  async create(user: UserEntity): Promise<void> {
    this.users.push(user);
  }
}
