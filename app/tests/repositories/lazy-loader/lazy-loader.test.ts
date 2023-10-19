import { PrismaClient } from '@prisma/client';
import { RedisClientType } from '@redis/client';
import { LazyLoader } from '@repositories/lazy-loader';
import { PrismaMock } from '@mocks/prisma.mock';
import { RedisMock } from '@mocks/redis.mock';
import { Vote } from './lazy-loader.helper';

jest.mock('uuid', () => ({ v1: () => 'f@k3-uuid-h3r3' }));

const userUUID = 'f@k3-uuid-h3r3';
const votingUUID = 'f@k3-uuid-h3r3';
// const name = 'voting name';
const options = ['option1', 'option2', 'option3'];
// const state = 'OPEN';

const LazyLoaderSUT = new LazyLoader(
  PrismaMock as any as PrismaClient,
  RedisMock as any as RedisClientType,
);

describe('LazyLoader class', () => {
  describe('(public) isUniqueVotePerUser method', () => {
    it('should call "this.RedisManager.get" method to search vote', () => {
      RedisMock.get.mockResolvedValueOnce(undefined as any);
      PrismaMock.vote.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.isUniqueVotePerUser(votingUUID, userUUID).then(() => {
        expect(RedisMock.get).toBeCalled();
      });
    });
    it('should call "this.RedisManager.get" using correct key format', () => {
      const key = `${userUUID}:${votingUUID}:vote`;

      RedisMock.get.mockResolvedValueOnce(undefined as any);
      PrismaMock.vote.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.isUniqueVotePerUser(votingUUID, userUUID).then(() => {
        expect(RedisMock.get).toBeCalledWith(key);
      });
    });
    it('should return false if found vote in Redis', () => {
      RedisMock.get.mockResolvedValueOnce(options.join(','));
      PrismaMock.vote.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.isUniqueVotePerUser(votingUUID, userUUID).then((response) => {
        expect(response).toEqual(false);
      });
    });
    it('should call "this.PrismaManager.findFirst" if cannot found vote in Redis', () => {
      RedisMock.get.mockResolvedValueOnce(null);
      PrismaMock.vote.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.isUniqueVotePerUser(votingUUID, userUUID).then(() => {
        expect(PrismaMock.vote.findFirst).toBeCalled();
      });
    });
    it('should call "this.PrismaManager.findFirst" using voting and user UUID', () => {
      RedisMock.get.mockResolvedValueOnce(null);
      PrismaMock.vote.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.isUniqueVotePerUser(votingUUID, userUUID).then(() => {
        expect(PrismaMock.vote.findFirst).toBeCalledWith({
          where: { voting_uuid: votingUUID, user_uuid: userUUID },
        });
      });
    });
    it('should return false if found vote in Prisma', () => {
      RedisMock.get.mockResolvedValueOnce(null);
      PrismaMock.vote.findFirst.mockRestore();
      PrismaMock.vote.findFirst.mockResolvedValueOnce(Vote);

      LazyLoaderSUT.isUniqueVotePerUser(votingUUID, userUUID).then((response) => {
        expect(response).toEqual(false);
      });
    });
    it('should return true if found nothing in Redis and Prisma', () => {
      RedisMock.get.mockResolvedValueOnce(null);
      PrismaMock.vote.findFirst.mockResolvedValueOnce(null);

      LazyLoaderSUT.isUniqueVotePerUser(votingUUID, userUUID).then((response) => {
        expect(response).toEqual(true);
      });
    });
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

