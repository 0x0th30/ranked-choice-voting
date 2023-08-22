import { PrismaClient, VotingState } from '@prisma/client';
import { RedisClientType } from '@redis/client';

export class LazyLoader {
  constructor(
    private readonly PrismaManager: PrismaClient,
    private readonly RedisManager: RedisClientType,
  ) {}

  public readVotingState(uuid: string): Promise<VotingState> {}

  public readVotingOptions(uuid: string): Promise<Array<string>> {}
}
