import amqp from 'amqplib/callback_api';
import { logger } from '@utils/logger';
import { WriteThrough } from './repositories/write-through';
import { PrismaClient } from '@prisma/client';
import { RedisClient } from '@loaders/redis';
import { RedisClientType } from '@redis/client';

export class VoteProcessor {
  private readonly TIMEOUT_IN_MS = 5000;
  
  private readonly QUEUE_NAME = 'vote'
  
  private readonly RABBITMQ_URI = process.env['RABBITMQ_URI']!;

  constructor(
    private readonly WriteThroughManager: WriteThrough,
  ) {}

  public async start(): Promise<void> {
    logger.info('Connecting into RabbitMQ client...');
    amqp.connect(this.RABBITMQ_URI, async (connectionError, connection) => {
      if (connectionError) {
        logger.error('Cannot connect RabbitMQ client, trying again in '
          + `${this.TIMEOUT_IN_MS}ms.... Details: "${connectionError}"`);
        await new Promise((resolve) => setTimeout(resolve, this.TIMEOUT_IN_MS));
        return this.start();
      }
      
      logger.info('RabbitMQ client connection was successfully established!'
        + ' Creating channel...');
      connection.createChannel((channelError, channel) => {
        if (channelError) {
          logger.error(`Cannot create channel. Details: "${connectionError}"`);
          throw channelError;
        }
        
        logger.info(`Connecting into "${this.QUEUE_NAME}" queue...`);
        channel.assertQueue(this.QUEUE_NAME, { durable: false });
        channel.consume(this.QUEUE_NAME, async (message) => {
          logger.info(`Successfully connected with "${this.QUEUE_NAME}" queue.`);
      
          if (!message) throw Error();
          const vote = JSON.parse(message.content.toString());

          await this.WriteThroughManager.writeVote(vote.uuid, vote.sequence);
        });
      });
    });
  }
}

const worker = new VoteProcessor(
  new WriteThrough(new PrismaClient(), RedisClient as RedisClientType)
);

worker.start();
