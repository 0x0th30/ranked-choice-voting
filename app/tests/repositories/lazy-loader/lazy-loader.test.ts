import { PrismaClient } from '@prisma/client';
import { RedisClientType } from '@redis/client';
import { LazyLoader } from '@repositories/lazy-loader';
import { PrismaMock } from '@mocks/prisma.mock';
import { RedisMock } from '@mocks/redis.mock';
import { NotFoundVoting } from '@errors/voting-error';
import { Vote, Voting } from './lazy-loader.helper';

jest.mock('uuid', () => ({ v1: () => 'f@k3-uuid-h3r3' }));

const userUUID = 'f@k3-uuid-h3r3';
const votingUUID = 'f@k3-uuid-h3r3';
// const name = 'voting name';
const options = ['option1', 'option2', 'option3'];
const state = 'OPEN';

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
    it('should call "this.PrismaManager.vote.findFirst" if cannot found vote'
    + ' in Redis', () => {
      RedisMock.get.mockResolvedValueOnce(null);
      PrismaMock.vote.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.isUniqueVotePerUser(votingUUID, userUUID).then(() => {
        expect(PrismaMock.vote.findFirst).toBeCalled();
      });
    });
    it('should call "this.PrismaManager.vote.findFirst" using voting and user'
    + ' UUID', () => {
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
    it('should call "this.RedisManager.get" method to search voting state', () => {
      RedisMock.get.mockResolvedValueOnce(state);
      PrismaMock.voting.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.readVotingState(votingUUID).then(() => {
        expect(RedisMock.get).toBeCalled();
      });
    });
    it('should call "this.RedisManager.get" using correct key format', () => {
      const key = `${votingUUID}:state`;

      RedisMock.get.mockResolvedValueOnce(state);
      PrismaMock.voting.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.readVotingState(votingUUID).then(() => {
        expect(RedisMock.get).toBeCalledWith(key);
      });
    });
    it('should return voting state if found it in Redis', () => {
      RedisMock.get.mockResolvedValueOnce(state);
      PrismaMock.voting.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.readVotingState(votingUUID).then((response) => {
        expect(response).toEqual(state);
      });
    });
    it('should call "this.PrismaManager.voting.findFirst" method to search '
      + 'voting', () => {
      RedisMock.get.mockResolvedValueOnce(null);
      PrismaMock.voting.findFirst.mockRestore();
      PrismaMock.voting.findFirst.mockResolvedValueOnce(Voting);

      LazyLoaderSUT.readVotingState(votingUUID).then(() => {
        expect(PrismaMock.voting.findFirst).toBeCalled();
      });
    });
    it('should call "this.PrismaManager.voting.findFirst" using voting and user '
      + 'UUID', () => {
      RedisMock.get.mockResolvedValueOnce(null);
      PrismaMock.voting.findFirst.mockResolvedValueOnce(Voting);

      LazyLoaderSUT.readVotingState(votingUUID).then(() => {
        expect(PrismaMock.voting.findFirst).toBeCalledWith({
          select: { state: true },
          where: { uuid: votingUUID },
        });
      });
    });
    it('should return voting options if found something in Prisma', () => {
      RedisMock.get.mockResolvedValueOnce(null);
      PrismaMock.voting.findFirst.mockResolvedValueOnce(Voting);

      LazyLoaderSUT.readVotingState(votingUUID).then((response) => {
        expect(response).toEqual(state);
      });
    });
    it('should throw "NotFoundVoting" if cannot found it', () => {
      RedisMock.get.mockResolvedValueOnce(null);
      PrismaMock.voting.findFirst.mockResolvedValueOnce(null);

      LazyLoaderSUT.readVotingState(votingUUID).catch((error) => {
        expect(error).toEqual(new NotFoundVoting(votingUUID));
      });
    });
  });
  describe('(public) readVotingOptions method', () => {
    it('should call "this.RedisManager.get" method to search voting options', () => {
      RedisMock.get.mockRestore();
      RedisMock.get.mockResolvedValueOnce(options.join(','));
      PrismaMock.voting.findFirst.mockRestore();
      PrismaMock.voting.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.readVotingOptions(votingUUID).then(() => {
        expect(RedisMock.get).toBeCalled();
      });
    });
    it('should call "this.RedisManager.get" using correct key format', () => {
      const key = `${votingUUID}:options`;

      RedisMock.get.mockResolvedValueOnce(options.join(','));
      PrismaMock.voting.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.readVotingOptions(votingUUID).then(() => {
        expect(RedisMock.get).toBeCalledWith(key);
      });
    });
    it('should return voting options if found something in Redis', () => {
      RedisMock.get.mockResolvedValueOnce(options.join(','));
      PrismaMock.voting.findFirst.mockResolvedValueOnce(undefined as any);

      LazyLoaderSUT.readVotingOptions(votingUUID).then((response) => {
        expect(response).toEqual(options);
      });
    });
    it('should call "this.PrismaManager.findFirst" method to search voting', () => {
      RedisMock.get.mockResolvedValueOnce(null);
      PrismaMock.voting.findFirst.mockRestore();
      PrismaMock.voting.findFirst.mockResolvedValueOnce(Voting);

      LazyLoaderSUT.readVotingOptions(votingUUID).then(() => {
        expect(PrismaMock.voting.findFirst).toBeCalled();
      });
    });
    it('should call "this.PrismaManager.findFirst" using voting and user UUID', () => {
      RedisMock.get.mockResolvedValueOnce(null);
      PrismaMock.voting.findFirst.mockResolvedValueOnce(Voting);

      LazyLoaderSUT.readVotingOptions(votingUUID).then(() => {
        expect(PrismaMock.voting.findFirst).toBeCalledWith({
          select: { available_options: true },
          where: { uuid: votingUUID },
        });
      });
    });
    it('should return voting options if found something in Prisma', () => {
      RedisMock.get.mockResolvedValueOnce(null);
      PrismaMock.voting.findFirst.mockResolvedValueOnce(Voting);

      LazyLoaderSUT.readVotingOptions(votingUUID).then((response) => {
        expect(response).toEqual(options);
      });
    });
    it('should throw "NotFoundVoting" if cannot found it', () => {
      RedisMock.get.mockResolvedValueOnce(null);
      PrismaMock.voting.findFirst.mockResolvedValueOnce(null);

      LazyLoaderSUT.readVotingOptions(votingUUID).catch((error) => {
        expect(error).toEqual(new NotFoundVoting(votingUUID));
      });
    });
  });
});
