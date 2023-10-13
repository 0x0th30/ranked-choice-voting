import { PrismaClient, Voting, VotingState } from '@prisma/client';
import { RedisClientType } from '@redis/client';
import { logger } from '@utils/logger';

export class WriteThrough {
  constructor(
    private readonly PrismaManager: PrismaClient,
    private readonly RedisManager: RedisClientType,
  ) {}

  public async writeVoting(
    userUUID: string,
    votingUUID: string,
    name: string,
    options: Array<string>,
    state: VotingState,
  ): Promise<Voting> {
    logger.info(`Caching voting options to voting "${name}"...`);
    const votingOptionsKey = `${votingUUID}:options`;
    const votingOptionsValue = options.join(',');
    await this.RedisManager.set(votingOptionsKey, votingOptionsValue);

    logger.info(`Caching voting state to voting "${name}"...`);
    const votingStateKey = `${votingUUID}:state`;
    await this.RedisManager.set(votingStateKey, state);

    logger.info(`Storing voting "${name}" in database...`);
    const voting = await this.PrismaManager.voting.create({
      data: {
        uuid: userUUID,
        author_uuid: votingUUID,
        name,
        available_options: options,
        state,
      },
    });

    return voting;
  }

  public async updateVotingState(votingUUID: string, state: VotingState): Promise<any> {
    logger.info(`Caching voting state to voting with votingUUID "${votingUUID}"...`);
    const votingStateKey = `${votingUUID}:state`;
    await this.RedisManager.set(votingStateKey, state);

    logger.info(`Updating voting with votingUUID "${votingUUID}" state in database...`);
    const voting = await this.PrismaManager.voting.update({
      where: { uuid: votingUUID },
      data: { state },
    });

    return voting;
  }
}
