import { UserAvatarEntity } from 'src/app/entities/user-avatar.entity';

export class MongoUserAvatarMapper {
  static toMongo(userAvatar: UserAvatarEntity) {
    return {
      id: userAvatar.id,
      user_id: userAvatar.userId,
      hash: userAvatar.hash,
      content: {
        mime_type: userAvatar.content.mimeType,
        ...userAvatar.content,
      },
    };
  }

  static toDomainFromAPI(raw: UserAvatarEntity): UserAvatarEntity {
    return new UserAvatarEntity(
      {
        userId: raw.userId,
        hash: raw.hash,
        content: raw.content,
      },
      raw.id,
    );
  }
}
