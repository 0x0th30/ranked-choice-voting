import { logger } from '@utils/logger';
import { WriteThrough } from '@repositories/write-through';
import { CreateVotingDTO } from './create-voting.d';

export class CreateVoting {
  constructor(
    private readonly WriteThroughManager: WriteThrough,
  ) {}

  public async execute(name: string, options: Array<string>): Promise<CreateVotingDTO> {
    logger.info('Initializing "create-voting" service/use-case...');
    const response: CreateVotingDTO = { success: false };

    logger.info('Sending voting to write-through...');
    await this.WriteThroughManager.writeVoting(name, options)
      .then((voting) => {
        response.success = true;
        response.data = { uuid: voting.uuid };
      })
      .catch((error) => {
        response.success = false;
        response.error = error;
      });

    logger.info('Finishing "create-voting" service/use-case.');
    return response;
  }
}
