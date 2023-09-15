import { logger } from '@utils/logger';
import { VoteValidator } from '@entities/vote-validator';
import { RabbitMQ } from '@loaders/rabbitmq';
import { VoteDTO } from './vote.d';

export class Vote {
  private readonly QUEUE_NAME = 'vote';

  constructor(
    private readonly VoteValidatorEntity: VoteValidator,
    private readonly RabbitMQManager: RabbitMQ,
  ) {}

  public async execute(vote: VoteToBeCreated): Promise<VoteDTO> {
    logger.info('Initializing "vote" service/use-case...');
    const response: VoteDTO = { success: false };

    logger.info('Sending vote to vote-validator entity...');
    await this.VoteValidatorEntity.validateVote(vote)
      .then(() => { response.success = true; })
      .catch((error) => {
        response.success = false;
        response.error = error;
      });

    logger.info('Sending vote to processing queue...');
    if (response.success) {
      await this.RabbitMQManager.sendMessageToQueue(this.QUEUE_NAME, vote)
        .catch((error) => {
          logger.error(`Something went wrong during vote enqueue. Details: ${error}`);
          response.success = false;
          response.error = error;
        });
    }

    logger.info('Finishing "vote" service/use-case.');
    return response;
  }
}
