import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';

config();

export const LOCALHOST: ClientProviderOptions = {
  name: 'localhost',
  transport: Transport.RMQ,
  options: {
    urls: [String(process.env.RABBIT_URL)],
    queue: 'user',
    queueOptions: {
      durable: false,
    },
  },
};
