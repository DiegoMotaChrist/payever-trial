import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { LOCALHOST } from '../../helpers/RabbitMQ';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);

  private client: ClientProxy = ClientProxyFactory.create(LOCALHOST);

  async sendMessage(message: string) {
    await this.client.connect();

    this.logger.log('Sending Message...');
    await firstValueFrom(
      this.client.emit('newUser', message).pipe(
        catchError((error) => {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }),
      ),
    );

    this.logger.log('Sended Message!');

    await this.client.close();
  }
}
