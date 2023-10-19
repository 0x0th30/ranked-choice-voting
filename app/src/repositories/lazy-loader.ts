import { NotFoundVoting } from '@errors/voting-error';
import { PrismaClient, VotingState } from '@prisma/client';
import { RedisClientType } from '@redis/client';
import { logger } from '@utils/logger';

export class LazyLoader {
  constructor(
    private readonly PrismaManager: PrismaClient,
    private readonly RedisManager: RedisClientType,
  ) {}

  public async isUniqueVotePerUser(votingUUID: string, userUUID: string)
  : Promise<boolean> {
    const voteKey = `${userUUID}:${votingUUID}:vote`;
    const cachedVoteExists = await this.RedisManager.get(voteKey)
      .then((value) => {
        if (value) {
          logger.info(`Found users's "${userUUID}" vote to voting "${votingUUID}"...`);
          return true;
        }
        return false;
      });
    if (cachedVoteExists) return false;

    const storedVoteExists = await this.PrismaManager.vote
      .findFirst({ where: { voting_uuid: votingUUID, user_uuid: userUUID } })
      .then((value) => {
        if (value) {
          logger.info(`Found users's "${userUUID}" vote to voting "${votingUUID}"...`);
          return true;
        }
        return false;
      });

    console.log(storedVoteExists);
    if (storedVoteExists) return false;

    return true;
  }

  public async readVotingState(uuid: string): Promise<VotingState> {
    const votingStateKey = `${uuid}:state`;

    logger.info(`Searching by "${uuid}" voting state in cache...`);
    const cachedVotingState = await this.RedisManager.get(votingStateKey)
      .then((value) => {
        if (value && Object.keys(VotingState).includes(value)) {
          logger.info(`Cache hit! Current state of "${uuid}" voting is ${value}...`);
          return value as VotingState;
        }
        return false;
      });
    if (cachedVotingState) return cachedVotingState;

    logger.info(`Cache miss! Searching by "${uuid}" voting state in database...`);
    const storedVotingState = await this.PrismaManager.voting
      .findFirst({ select: { uuid: true }, where: { uuid } })
      .then((value) => {
        if (value && value.uuid && Object.keys(VotingState).includes(value.uuid)) {
          logger.info(`Current state of "${uuid}" voting is ${value}...`);
          return value.uuid as VotingState;
        }
        return false;
      });
    if (storedVotingState) return storedVotingState;

    logger.error(`Cannot found "${uuid}" voting.`);
    throw new NotFoundVoting(uuid);
  }

  public async readVotingOptions(uuid: string): Promise<Array<string>> {
    const votingOptionsKey = `${uuid}:options`;

    logger.info(`Searching by "${uuid}" voting options in cache...`);
    const cachedVotingOptions = await this.RedisManager.get(votingOptionsKey)
      .then((value) => {
        if (value) {
          logger.info(`Cache hit! Options to "${uuid}" voting was found.`);
          return value.split(',');
        }
        return false;
      });
    if (cachedVotingOptions) return cachedVotingOptions;

    logger.info(`Cache miss! Searching by "${uuid}" voting options in database...`);
    const storedVotingOptions = await this.PrismaManager.voting
      .findFirst({ select: { available_options: true }, where: { uuid } })
      .then((value) => {
        if (value && value.available_options) {
          logger.info(`Options to "${uuid}" voting was found.`);
          return value.available_options;
        }
        return false;
      });
    if (storedVotingOptions) return storedVotingOptions;

    logger.error(`Cannot found "${uuid}" voting.`);
    throw new NotFoundVoting(uuid);
  }
}
