import { Injectable } from '@nestjs/common';
import { RabbitMQService } from 'src/service/messaging/rabbitmq.service';

interface SendMessageCaseRequest {
  message: string;
}

@Injectable()
export class SendMessageCase {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async execute(request: SendMessageCaseRequest): Promise<void> {
    const { message } = request;

    await this.rabbitMQService.sendMessage(message);
  }
}
