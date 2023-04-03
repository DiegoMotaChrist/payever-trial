import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class ReceiverController {
  private readonly logger = new Logger(ReceiverController.name);

  @EventPattern('newUser')
  async handleNewUserMessage(data: string) {
    this.logger.debug(JSON.parse(data));
  }
}
