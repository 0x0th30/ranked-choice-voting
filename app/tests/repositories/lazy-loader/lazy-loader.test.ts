import { LazyLoader } from '@repositories/lazy-loader';
import { PrismaMock } from '@mocks/prisma.mock';
import { PrismaClient } from '@prisma/client';
import { RedisClientType } from '@redis/client';
import { RedisMock } from '@mocks/redis.mock';

jest.mock('uuid', () => ({ v1: () => 'f@k3-uuid-h3r3' }));

const userUUID = 'f@k3-uuid-h3r3';
const votingUUID = 'f@k3-uuid-h3r3';
// const name = 'voting name';
// const options = ['option1', 'option2', 'option3'];
// const state = 'OPEN';

const LazyLoaderSUT = new LazyLoader(
  PrismaMock as any as PrismaClient,
  RedisMock as any as RedisClientType,
);

describe('LazyLoader class', () => {
  describe('(public) isUniqueVotePerUser method', () => {
    it('should call "this.RedisManager.get" method to search vote', () => {
      RedisMock.get.mockResolvedValueOnce(undefined as any);
      PrismaMock.voting.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.isUniqueVotePerUser(votingUUID, userUUID).then(() => {
        expect(RedisMock.get).toBeCalled();
      });
    });
    it('should call "this.RedisManager.get" using correct key format', () => {
      const key = `${userUUID}:${votingUUID}:vote`;

      RedisMock.get.mockResolvedValueOnce(undefined as any);
      PrismaMock.voting.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.isUniqueVotePerUser(votingUUID, userUUID).then(() => {
        expect(RedisMock.get).toBeCalledWith(key);
      });
    });
    it.todo('should return false if not found data in Redis');
    it.todo('should return true if found data in Redis');
    it.todo('should call "this.PrismaManager.findFirst" method to search vote');
    it.todo('should call "this.PrismaManager.findFirst" using voting and user UUID');
    it.todo('should return false if not found data in Prisma');
    it.todo('should return true if found data in Prisma');
  });
  describe('(public) readVotingState method', () => {
    it.todo('should call "this.RedisManager.get" method to search voting state');
    it.todo('should call "this.RedisManager.get" using correct key format');
    it.todo('should return voting state if found something in Redis');
    it.todo('should call "this.PrismaManager.findFirst" method to search vote');
    it.todo('should call "this.PrismaManager.findFirst" using voting and user UUID');
    it.todo('should return voting options if found something in Prisma');
    it.todo('should throw "NotFoundVoting" if cannot found it');
  });
  describe('(public) readVotingOptions method', () => {
    it.todo('should call "this.RedisManager.get" method to search voting options');
    it.todo('should call "this.RedisManager.get" using correct key format');
    it.todo('should return voting options if found something in Redis');
    it.todo('should call "this.PrismaManager.findFirst" method to search vote');
    it.todo('should call "this.PrismaManager.findFirst" using voting and user UUID');
    it.todo('should return voting options if found something in Prisma');
    it.todo('should throw "NotFoundVoting" if cannot found it');
  });
});
