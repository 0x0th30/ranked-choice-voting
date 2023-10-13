import { LazyLoader } from '@repositories/lazy-loader';
import { PrismaMock } from '@mocks/prisma.mock';
import { PrismaClient } from '@prisma/client';
import { RedisClientType } from '@redis/client';
import { RedisMock } from '@mocks/redis.mock';

const LazyLoaderSUT = new LazyLoader(
  PrismaMock as any as PrismaClient,
  RedisMock as any as RedisClientType,
);

describe('LazyLoader class', () => {
  describe('(public) isUniqueVotePerUser method', () => {});
  describe('(public) readVotingState method', () => {});
  describe('(public) readVotingOptions method', () => {});
});

