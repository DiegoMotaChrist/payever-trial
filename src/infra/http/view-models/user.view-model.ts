import { UserEntity } from '../../../app/entities/user.entity';

export class UserViewModel {
  static toHTTP(user: UserEntity) {
    return {
      id: user.id,
      name: user.name,
      job: user.job,
      createdAt: user.createdAt,
    };
  }
  static toHTTPFromAPI(user: UserEntity) {
    return {
      data: user.data,
      support: user.support,
    };
  }
}
