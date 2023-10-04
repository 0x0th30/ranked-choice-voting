import { v4 as uuidv4 } from 'uuid';
import { logger } from '@utils/logger';
import { WriteThrough } from '@repositories/write-through';
import { VotingExceedingOptionsLimit } from '@errors/voting-error';
import { CreateVotingDTO } from './create-voting.d';

export class CreateVoting {
  private VOTING_OPTIONS_LIMIT = 5;

  constructor(
    private readonly WriteThroughManager: WriteThrough,
  ) {}

  public async execute(userUUID: string, name: string, options: Array<string>)
  : Promise<CreateVotingDTO> {
    logger.info('Initializing "create-voting" service/use-case...');
    const response: CreateVotingDTO = { success: false };

    const uuid = uuidv4();
    const state = 'OPEN';

    if (options.length > 5) {
      logger.error(`Received ${options.length} options but limit is `
        + `${this.VOTING_OPTIONS_LIMIT}!`);
      response.success = false;
      response.error = new VotingExceedingOptionsLimit(
        this.VOTING_OPTIONS_LIMIT,
        options.length,
      );
    } else {
      logger.info('Sending voting to write-through...');
      await this.WriteThroughManager.writeVoting(userUUID, uuid, name, options, state)
        .then((voting) => {
          response.success = true;
          response.data = { uuid: voting.uuid };
        })
        .catch((error) => {
          response.success = false;
          response.error = error;
        });
    }

    logger.info('Finishing "create-voting" service/use-case.');
    return response;
  }
}
