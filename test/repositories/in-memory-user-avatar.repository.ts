import { UserAvatarRepository } from 'src/app/repositories/user-avatar.repository';
import { UserAvatarEntity } from 'src/app/entities/user-avatar.entity';

export class InMemoryUserAvatarRepository implements UserAvatarRepository {
  public userAvatars: UserAvatarEntity[] = [];

  async create(userAvatar: UserAvatarEntity): Promise<void> {
    this.userAvatars.push(userAvatar);
  }

  async findOne(userId: number): Promise<UserAvatarEntity | null> {
    const userAvatar = this.userAvatars.find(
      (userAvatar) => userAvatar.userId == userId,
    );

    return userAvatar ?? null;
  }

  async delete(userId: number): Promise<void> {
    const index = this.userAvatars.findIndex(
      (userAvatar) => userAvatar.userId == userId,
    );
    this.userAvatars.splice(index, 1);
  }
}
