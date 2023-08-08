import { v1 as uuid } from 'uuid';
import { PrismaClient, Voting } from '@prisma/client';
import { RedisClientType } from '@redis/client';
import { logger } from '@utils/logger';

export class WriteThrough {
  constructor(
    private readonly PrismaManager: PrismaClient,
    private readonly RedisManager: RedisClientType,
  ) {}

  public async writeVotingSession(name: string, options: Array<string>): Promise<Voting> {
    const votingUUID = uuid();
    const votingState = 'OPEN';

    logger.info(`Caching voting options to voting "${name}"...`);
    const votingOptionsKey = `${votingUUID}:options`;
    const votingOptionsValue = options.join(',');
    await this.RedisManager.set(votingOptionsKey, votingOptionsValue);

    logger.info(`Caching voting state to voting "${name}"...`);
    const votingStateKey = `${votingUUID}:state`;
    await this.RedisManager.set(votingStateKey, votingState);

    logger.info(`Storing voting "${name}" in database...`);
    const voting = await this.PrismaManager.voting.create({
      data: {
        uuid: votingUUID, name, availableOptions: options, state: votingState,
      },
    });

    return voting;
  }
}
