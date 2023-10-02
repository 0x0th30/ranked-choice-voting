import { TokenGenerator } from '@entities/token-generator';
import { RabbitMQ } from '@loaders/rabbitmq';
import { logger } from '@utils/logger';
import { SendTokenDTO } from './send-token.d';

type TokenReason = 'password_recover' | 'account_activation';

export class SendToken {
  private readonly QUEUE_NAME = 'email';

  constructor(
    private readonly TokenGeneratorEntity: TokenGenerator,
    private readonly RabbitMQManager: RabbitMQ,
  ) { }

  public async execute(email: string, reason: TokenReason): Promise<SendTokenDTO> {
    logger.info('Initializing "send-token" service/use-case...');
    const response: SendTokenDTO = { success: false };

    logger.info(`Generating "${reason}" token to user with email "${email}"...`);
    const token = await this.TokenGeneratorEntity.generate(email)
      .catch((error) => {
        response.success = false;
        response.error = error;
      });

    if (token) {
      const emailToBeSent: EmailToBeSent = {
        email, subject: 'foo', body: 'foo',
      };

      await this.RabbitMQManager.sendMessageToQueue(this.QUEUE_NAME, emailToBeSent)
        .then(() => { response.success = true; })
        .catch((error) => {
          logger.error(`Something went wrong during email enqueue. Details: ${error}`);
          response.success = false;
          response.error = error;
        });
    }

    logger.info('Finishing "send-token" service/use-case.');
    return response;
  }
}
