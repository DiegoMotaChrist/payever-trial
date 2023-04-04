import { Logger } from '@nestjs/common';

interface CreateApiUserResponse {
  id: string;
  job: string;
  name: string;
  createdAt: Date;
}

export class InMemoryUserService {
  private readonly logger = new Logger(InMemoryUserService.name);
  private httpService: any;

  async createApiUser(
    job: string,
    name: string,
  ): Promise<CreateApiUserResponse> {
    this.logger.log('createApiUser');
    return Promise.resolve({
      id: '2',
      job,
      name,
      createdAt: new Date(),
    });
  }
}
