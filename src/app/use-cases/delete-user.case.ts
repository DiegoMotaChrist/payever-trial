import { Injectable } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { UserAvatarRepository } from '../repositories/user-avatar.repository';

interface DeleteUserCaseRequest {
  userId: string;
}

@Injectable()
export class DeleteUserCase {
  constructor(
    private readonly userAvatarRepository: UserAvatarRepository,
    private readonly userService: UserService,
  ) {}

  async execute(request: DeleteUserCaseRequest): Promise<void> {
    const { userId } = request;

    await this.userService.deleteApiUser(userId);

    await this.userAvatarRepository.delete(Number(userId));
  }
}
