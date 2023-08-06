import { PrismaClient, Voting } from '@prisma/client';
import { RedisClientType } from '@redis/client';

export class WriteThrough {
  constructor(
    private readonly PrismaManager: PrismaClient,
    private readonly RedisManager: RedisClientType,
  ) {}

  public async writeVotingSession(voting: Voting) {
    const 
  }
}
