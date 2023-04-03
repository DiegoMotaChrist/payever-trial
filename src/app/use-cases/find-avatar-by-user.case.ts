import { Injectable } from '@nestjs/common';
import { UserService } from 'src/service/user/user.service';
import { UserAvatarRepository } from '../repositories/user-avatar.repository';
import { UserAvatarEntity } from '../entities/user-avatar.entity';
import { GetFileCase } from './get-file.case';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

interface FindAvatarByUserCaseRequest {
  userId: string;
}
interface FindAvatarByUserCaseResponse {
  file: UserAvatarEntity | null;
  base64: string;
}

@Injectable()
export class FindAvatarByUserCase {
  private readonly avatarImageSuffix = '-image.jpg';

  constructor(
    private readonly userService: UserService,
    private readonly userAvatarRepository: UserAvatarRepository,
    private readonly getFileCase: GetFileCase,
  ) {}

  async execute(
    request: FindAvatarByUserCaseRequest,
  ): Promise<FindAvatarByUserCaseResponse> {
    const { userId } = request;

    const {
      data: { avatar: fileUrl },
    } = await this.userService.findByApiUserId(userId);

    const savedUserAvatar = await this.userAvatarRepository.findOne(
      Number(userId),
    );

    const { buffer, base64 } = await this.getFileCase.execute({ fileUrl });

    if (!savedUserAvatar) {
      const type: string = this.avatarImageSuffix.split('.')[1];

      const userAvatar: UserAvatarEntity = new UserAvatarEntity({
        userId: Number(userId),
        hash: await bcrypt.hash(randomBytes(20).toString('hex'), 10),
        content: {
          mimeType: `image/${type}`,
          name: `${userId}${this.avatarImageSuffix}`,
          size: buffer.byteLength,
        },
      });

      await this.userAvatarRepository.create(userAvatar);
    }

    return { file: savedUserAvatar, base64 };
  }
}
