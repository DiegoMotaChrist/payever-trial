import { Injectable } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { SendMailCase } from './send-mail.case';
import { SendMessageCase } from './send-message.case';

interface CreateUserCaseRequest {
  job: string;
  name: string;
}

interface CreateUserCaseResponse {
  user: UserEntity;
}

@Injectable()
export class CreateUserCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly sendMailCase: SendMailCase,
    private readonly sendMessageCase: SendMessageCase,
  ) {}

  async execute(
    request: CreateUserCaseRequest,
  ): Promise<CreateUserCaseResponse> {
    const { job, name } = request;

    const { id, createdAt } = await this.userService.createApiUser(job, name);

    const user: UserEntity = new UserEntity({ job, name, createdAt }, id);

    await this.userRepository.create(user);

    await this.sendMailCase.execute({
      subject: 'New email from service',
      text: 'This is a new email',
    });

    await this.sendMessageCase.execute({
      message: JSON.stringify({ id, job, name, createdAt }),
    });

    return { user };
  }
}
