import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from 'src/app/entities/user.entity';
import { UserRepository } from 'src/app/repositories/user.repository';
import { MongoUserMapper } from '../mappers/mongo-user.mapper';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(@InjectModel('User') private userModel: Model<UserEntity>) {}

  async create(user: UserEntity): Promise<void> {
    const raw = MongoUserMapper.toMongo(user);

    const newUser = new this.userModel({
      id: raw.id,
      name: raw.name,
      job: raw.job,
      created_At: raw.created_At,
    });

    await newUser.save();
  }
}
