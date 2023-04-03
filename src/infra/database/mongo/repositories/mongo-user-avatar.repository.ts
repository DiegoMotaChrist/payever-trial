import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserAvatarEntity } from 'src/app/entities/user-avatar.entity';
import { MongoUserAvatarMapper } from '../mappers/mongo-user-avatar.mapper';
import { UserAvatarRepository } from 'src/app/repositories/user-avatar.repository';

@Injectable()
export class MongoUserAvatarRepository implements UserAvatarRepository {
  constructor(
    @InjectModel('UserAvatar') private userAvatarModel: Model<UserAvatarEntity>,
  ) {}

  async create(userAvatar: UserAvatarEntity): Promise<void> {
    const raw = MongoUserAvatarMapper.toMongo(userAvatar);

    const newUserAvatar = new this.userAvatarModel({
      id: raw.id,
      user_id: raw.user_id,
      hash: raw.hash,
      content: raw.content,
    });

    await newUserAvatar.save();
  }

  async findOne(userId: number): Promise<UserAvatarEntity | null> {
    return await this.userAvatarModel.findOne({ user_id: userId });
  }

  async delete(userId: number): Promise<void> {
    await this.userAvatarModel.findOneAndRemove({ user_id: userId });
  }
}
