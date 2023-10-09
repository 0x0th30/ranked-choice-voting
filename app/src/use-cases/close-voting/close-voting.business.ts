import { UnauthorizedVotingOperation, NotFoundVoting } from '@errors/voting-error';
import { PrismaClient } from '@prisma/client';
import { WriteThrough } from '@repositories/write-through';
import { logger } from '@utils/logger';
import { CloseVotingDTO } from './close-voting.d';

export class CloseVoting {
  constructor(
    private readonly WriteThroughManager: WriteThrough,
    private readonly PrismaManager: PrismaClient,
  ) {}

  public async execute(userUUID: string, votingUUID: string): Promise<CloseVotingDTO> {
    logger.info('Initializing "close-voting" service/use-case...');
    const response: CloseVotingDTO = { success: false };

    logger.info(`Searching by voting with uuid "${votingUUID}"`);
    const voting = await this.PrismaManager.voting
      .findFirst({ where: { uuid: votingUUID } });
    if (!voting) {
      response.success = false;
      response.error = new NotFoundVoting(votingUUID);
      return response;
    }

    logger.info(`Checking "${votingUUID}" author...`);
    const isUserVotingCreator = (voting.author_uuid === userUUID);
    if (!isUserVotingCreator) {
      response.success = false;
      response.error = new UnauthorizedVotingOperation(userUUID, votingUUID);
      return response;
    }

    logger.info(`Closing voting with uuid "${votingUUID}"...`);
    await this.WriteThroughManager
      .updateVotingState(votingUUID, 'CLOSED')
      .then(() => {
        response.success = true;
        response.data = { uuid: votingUUID };
      });

    logger.info('Finishing "close-voting" service/use-case.');
    return response;
  }
}
