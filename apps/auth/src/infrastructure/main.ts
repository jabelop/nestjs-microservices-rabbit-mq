import { NestFactory } from '@nestjs/core';
import { AuthModule } from '../auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  const USER = configService.get('RABBITMQ_USER');
  const PASS = configService.get('RABBITMQ_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const AUTH_QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

  console.info("AUTH RABBIT INFO:", USER, PASS, HOST, AUTH_QUEUE);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASS}@${HOST}`],
      noAck: false,
      queue: AUTH_QUEUE,
      queueOptions: {
        durable: true
      }
    }
  });
  app.startAllMicroservices();
  /*const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
   transport: Transport.RMQ,
   options: {
     urls: ['amqp://user:password@rabbitmq:5672'],
     queue: 'auth_queue',
     queueOptions: {
       durable: true
     },
   },
 });
 
 app.init();*/

}
bootstrap();
