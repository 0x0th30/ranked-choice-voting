import { logger } from '@utils/logger';
import { CreateVotingDTO } from './create-voting.d';

export class CreateVoting {
  public async execute(name: string, options: Array<string>): Promise<CreateVotingDTO> {
    logger.info('Initializing "create-voting" service/use-case...');
    const response: CreateVotingDTO = { success: false };

    // void method

    logger.info('Finishing "create-voting" service/use-case.');
    return response;
  }
}
