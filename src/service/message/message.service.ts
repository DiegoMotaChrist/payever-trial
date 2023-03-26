import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class MessageService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@127.0.0.1:5672'],
        queue: 'user',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async sendMessage(message: string) {
    await this.client.connect();

    try {
      await Promise.resolve(
        firstValueFrom(this.client.send('user', message).pipe(timeout(3000))),
      );
    } catch (err: any) {
      console.log(`message.service => ${err.message}: No active consumer`);
    }
    await this.client.close();
  }
}
