import { NotAuthorClosingVoting, NotFoundVoting } from '@errors/voting-error';
import { PrismaClient } from '@prisma/client';
import { logger } from '@utils/logger';
import { CloseVotingDTO } from './close-voting.d';

export class CloseVoting {
  constructor(
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
      response.error = new NotAuthorClosingVoting(userUUID, votingUUID);
      return response;
    }

    logger.info(`Closing voting with uuid "${votingUUID}"...`);
    await this.PrismaManager.voting
      .update({ where: { uuid: votingUUID }, data: { state: 'CLOSED' } })
      .then(() => {
        response.success = true;
        response.data = { uuid: votingUUID };
      });

    logger.info('Finishing "close-voting" service/use-case.');
    return response;
  }
}
