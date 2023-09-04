import { NotFoundVoting } from '@errors/vote-validation-error';
import { PrismaClient, VotingState } from '@prisma/client';
import { RedisClientType } from '@redis/client';

export class LazyLoader {
  constructor(
    private readonly PrismaManager: PrismaClient,
    private readonly RedisManager: RedisClientType,
  ) {}

  public async readVotingState(uuid: string): Promise<VotingState> {
    const votingStateKey = `${uuid}:state`;
    const cachedVotingState = await this.RedisManager.get(votingStateKey)
      .then((value) => {
        if (value && Object.keys(VotingState).includes(value)) {
          return value as VotingState;
        }
        return false;
      });
    if (cachedVotingState) return cachedVotingState;

    const storedVotingState = await this.PrismaManager.voting
      .findFirst({ select: { uuid: true }, where: { uuid } })
      .then((value) => {
        if (value && value.uuid && Object.keys(VotingState).includes(value.uuid)) {
          return value.uuid as VotingState;
        }
        return false;
      });
    if (storedVotingState) return storedVotingState;

    throw new NotFoundVoting(uuid);
  }

  public async readVotingOptions(uuid: string): Promise<Array<string>> {
    const votingOptionsKey = `${uuid}:options`;
    const cachedVotingOptions = await this.RedisManager.get(votingOptionsKey)
      .then((value) => {
        if (value) return JSON.parse(value) as Array<string>;
        return false;
      });
    if (cachedVotingOptions) return cachedVotingOptions;

    const storedVotingOptions = await this.PrismaManager.voting
      .findFirst({ select: { availableOptions: true }, where: { uuid } })
      .then((value) => {
        if (value && value.availableOptions) return value.availableOptions;
        return false;
      });
    if (storedVotingOptions) return storedVotingOptions;

    throw new NotFoundVoting(uuid);
  }
}
