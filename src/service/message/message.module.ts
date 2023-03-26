import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [String(process.env.RABBIT_URL)],
          queue: 'user',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
})
export class MessageModule {}
