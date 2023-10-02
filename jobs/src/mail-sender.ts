import amqp from 'amqplib/callback_api';
import nodemailer from 'nodemailer';
import { logger } from '@utils/logger';

export class MailSender {
  private readonly TIMEOUT_IN_MS = 5000;

  private readonly QUEUE_NAME = 'email';

  private readonly RABBITMQ_URI = process.env['RABBITMQ_URI']!;

  constructor(
    private readonly MailTransporter: nodemailer.Transporter,
  ) {}

  public async start(): Promise<void> {
    logger.info('Connecting into RabbitMQ client...');
    amqp.connect(this.RABBITMQ_URI, async (connectionError, connection) => {
      if (connectionError) {
        logger.error('Cannot connect RabbitMQ client, trying again in '
          + `${this.TIMEOUT_IN_MS}ms... Details: ${connectionError}`);
        await new Promise((resolve) => setTimeout(resolve, this.TIMEOUT_IN_MS));
        return this.start();
      }

      logger.info('RabbitMQ client connection was successfully established!'
        + ' Creating channel...');
      connection.createChannel((channelError, channel) => {
        if (channelError) {
          logger.error(`Cannot create channel. Details: ${channelError}`);
          throw channelError;
        }

        logger.info(`Connecting into "${this.QUEUE_NAME}" queue...`);
        channel.assertQueue(this.QUEUE_NAME, { durable: false });
        channel.consume(this.QUEUE_NAME, async (message) => {
          logger.info(`Successfully connected with "${this.QUEUE_NAME}" queue.`);

          if (!message) throw new Error();
          const email = JSON.parse(message.content.toString());

          logger.info(`Sending mail to "${email.email}"...`);
          await this.MailTransporter.sendMail({ to: email.email, subject: email.subject })
            .then((messageId) => {
              logger.info(`Email was successfully sent! Message id: ${messageId}.`);
            })
            .catch((error) => {
              logger.error(`Cannot send mail. Details: ${error}`);
              throw error;
            });
        });
      });
    });
  }
}
