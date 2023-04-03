import { UserAvatarEntity } from '../entities/user-avatar.entity';

export abstract class UserAvatarRepository {
  abstract create(userAvatar: UserAvatarEntity): Promise<void>;
  abstract findOne(userId: number): Promise<UserAvatarEntity | null>;
  abstract delete(userId: number): Promise<void>;
}
