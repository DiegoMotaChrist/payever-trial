import { HttpService } from '@nestjs/axios/dist';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';
import { FindUserModel } from '../database/model/user/find-user.model';
import { FileModel } from '../database/model/file/file-model';
import { UserModel } from '../database/model/user/user.model';
import { MailService } from '../service/mail/mail.service';
import { MessageService } from '../service/message/message.service';
import { CreateUserModel } from '../database/model/user/create-user.model';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  private readonly reqresURL = `https://reqres.in/api` || '';
  private readonly avatarImageSuffix = '-image.jpg';

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserModel>,
    @InjectModel('UserAvatar')
    private readonly userAvatarModel: Model<FileModel>,
    private readonly messageService: MessageService,
    private httpService: HttpService,
    private readonly mailService: MailService,
  ) {}

  async _getFile(
    file_url: string,
    name: string,
    userId: string,
  ): Promise<{ file: FileModel | null; base64: string }> {
    const { data } = await firstValueFrom(
      this.httpService.get(file_url, { responseType: 'arraybuffer' }).pipe(
        catchError((error: any) => {
          throw error;
        }),
      ),
    );

    const savedUserAvatar = await this.userAvatarModel
      .findOne({ user_id: userId })
      .exec();

    const buffer = Buffer.from(data);
    const base64 = buffer.toString('base64');

    if (!savedUserAvatar) {
      const type: string = this.avatarImageSuffix.split('.')[1];

      const createdUserAvatar = new this.userAvatarModel({
        user_id: userId,
        hash: await bcrypt.hash(randomBytes(20).toString('hex'), 10),
        content: {
          mime_type: `image/${type}`,
          name,
          size: buffer.byteLength,
        },
      });

      await createdUserAvatar.save();
    }

    return { file: savedUserAvatar, base64 };
  }

  async findOne(id: string): Promise<FindUserModel | null> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.reqresURL}/users/${id}`).pipe(
        catchError((error: any) => {
          throw error;
        }),
      ),
    );
    return data;
  }

  async findAvatarByUser(
    id: string,
  ): Promise<{ file: FileModel | null; base64: string } | { base64: string }> {
    const {
      data: {
        data: { avatar },
      },
    } = await firstValueFrom(
      this.httpService.get(`${this.reqresURL}/users/${id}`).pipe(
        catchError((error: any) => {
          throw error;
        }),
      ),
    );

    if (!avatar) {
      throw new Error('User not found');
    }

    const { file, base64 } = await this._getFile(
      avatar,
      `${id}${this.avatarImageSuffix}`,
      id,
    );

    return file ? { file, base64 } : { base64 };
  }

  async create(user: CreateUserModel): Promise<UserModel> {
    const {
      data: { id, name, job, createdAt },
    } = await firstValueFrom(
      this.httpService.post(`${this.reqresURL}/users`, user).pipe(
        catchError((error: any) => {
          throw error;
        }),
      ),
    );

    const createdUser = new this.userModel({
      id,
      name,
      job,
      created_At: createdAt,
    });
    const savedUser = await createdUser.save();

    await this.messageService.sendMessage(JSON.stringify(savedUser));
    await this.mailService.sendEmail(
      'new User from payever-trial service',
      'Hi! A new user was created!',
    );

    return savedUser;
  }

  async delete(user_id: string): Promise<any> {
    const { status } = await firstValueFrom(
      this.httpService.delete(`${this.reqresURL}/users/${user_id}`).pipe(
        catchError((error: any) => {
          throw error;
        }),
      ),
    );

    this.userAvatarModel.findOneAndRemove({ user_id: user_id }).exec();

    return { status };
  }
}
