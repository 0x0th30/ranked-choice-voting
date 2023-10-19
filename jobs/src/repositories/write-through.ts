import { PrismaClient, Vote } from '@prisma/client';
import { RedisClientType } from '@redis/client';
import { logger } from '@utils/logger';

export class WriteThrough {
  constructor(
    private readonly PrismaManager: PrismaClient,
    private readonly RedisManager: RedisClientType,
  ) {}

  public async writeVote(votingUUID: string, userUUID:string, sequence: Array<string>)
  : Promise<Vote> {
    logger.info(`Caching vote to voting "${votingUUID}"...`);
    const key = `${userUUID}:${votingUUID}:vote`;
    const value = sequence.join(',');
    await this.RedisManager.set(key, value);

    logger.info(`Storing vote to voting "${votingUUID}" in database...`);
    const vote = await this.PrismaManager.vote.create({
      data: { voting_uuid: votingUUID, user_uuid: userUUID, vote_sequence: sequence },
    });

    return vote;
  }
}
