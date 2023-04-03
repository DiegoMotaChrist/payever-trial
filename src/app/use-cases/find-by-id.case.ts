import { Injectable } from '@nestjs/common';
import { UserService } from 'src/service/user/user.service';
import { UserEntity } from '../entities/user.entity';

interface FindByIdCaseRequest {
  userId: string;
}
interface FindByIdCaseResponse {
  user: UserEntity;
}

@Injectable()
export class FindByIdCase {
  constructor(private readonly userService: UserService) {}

  async execute(request: FindByIdCaseRequest): Promise<FindByIdCaseResponse> {
    const { userId } = request;

    const { data, support } = await this.userService.findByApiUserId(userId);

    const user: UserEntity = new UserEntity({ data, support }, userId);

    return { user };
  }
}
