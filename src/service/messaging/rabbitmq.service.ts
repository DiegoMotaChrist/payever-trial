import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { catchError, firstValueFrom } from 'rxjs';
import { ErrorResponse } from 'src/helpers/Error';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);

  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [String(process.env.RABBIT_URL)],
        queue: 'user',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async sendMessage(message: string) {
    await this.client.connect();

    this.logger.log('Sending Message...');
    await firstValueFrom(
      this.client.emit('newUser', message).pipe(
        catchError((error) => {
          this.logger.error(error);
          const errorReponse: ErrorResponse = {
            name: error.name,
            code: error.code,
            message: error.message,
            statusText: error.response?.statusText,
          };
          throw new HttpException(
            errorReponse,
            error.response?.status ?? HttpStatus.BAD_REQUEST,
          );
        }),
      ),
    );

    this.logger.log('Sended Message!');

    await this.client.close();
  }
}
