import { UserEntity } from '../../../../app/entities/user.entity';

export class MongoUserMapper {
  static toMongo(user: UserEntity) {
    return {
      id: user.id,
      job: user.job,
      name: user.name,
      created_At: user.createdAt,
    };
  }

  static toDomainFromAPI(raw: UserEntity): UserEntity {
    return new UserEntity(
      {
        data: raw.data,
        support: raw.support,
      },
      raw.id,
    );
  }
}
