import { PrismaClient, Voting } from '@prisma/client';
import { RedisClientType } from '@redis/client';
import { WriteThrough } from '@repositories/write-through';
import { PrismaMock } from '@mocks/prisma.mock';
import { RedisMock } from '@mocks/redis.mock';
import { CreatedVoting } from './write-through.helper';

jest.mock('uuid', () => ({ v1: () => 'f@k3-uuid-h3r3' }));

const authorUUID = 'f@k3-uuid-h3r3';
const uuid = 'f@k3-uuid-h3r3';
const name = 'voting name';
const options = ['option1', 'option2', 'option3'];
const state = 'OPEN';

const WriteThroughSUT = new WriteThrough(
  PrismaMock as any as PrismaClient,
  RedisMock as any as RedisClientType,
);

describe('WriteThrough class', () => {
  describe('(public) writeVoting method', () => {
    it('should return voting data if write successfully', () => {
      RedisMock.set.mockResolvedValueOnce('OK');
      RedisMock.set.mockResolvedValueOnce('OK');
      PrismaMock.voting.create.mockResolvedValueOnce(CreatedVoting as Voting);

      WriteThroughSUT.writeVoting(authorUUID, uuid, name, options, state)
        .then((value) => {
          expect(value).toEqual(CreatedVoting);
        });
    });
    it('should cache voting options in Redis', () => {
      const votingOptionsKey = `${uuid}:options`;
      const votingOptionsValue = options.join(',');

      RedisMock.set.mockResolvedValueOnce('OK');
      RedisMock.set.mockResolvedValueOnce('OK');
      PrismaMock.voting.create.mockResolvedValueOnce(CreatedVoting as Voting);

      WriteThroughSUT.writeVoting(authorUUID, uuid, name, options, state).then(() => {
        expect(RedisMock.set)
          .toHaveBeenNthCalledWith(1, votingOptionsKey, votingOptionsValue);
      });
    });
    it('should cache voting state in Redis', () => {
      const votingStateKey = `${uuid}:state`;
      const votingStateValue = 'OPEN';

      RedisMock.set.mockResolvedValueOnce('OK');
      RedisMock.set.mockResolvedValueOnce('OK');
      PrismaMock.voting.create.mockResolvedValueOnce(CreatedVoting as Voting);

      WriteThroughSUT.writeVoting(authorUUID, uuid, name, options, state).then(() => {
        expect(RedisMock.set)
          .toHaveBeenNthCalledWith(2, votingStateKey, votingStateValue);
      });
    });
    it('should store voting data in Postgres', () => {
      const voting = {
        data: {
          author_uuid: authorUUID, uuid, name, available_options: options, state,
        },
      };

      RedisMock.set.mockResolvedValueOnce('OK');
      RedisMock.set.mockResolvedValueOnce('OK');
      PrismaMock.voting.create.mockResolvedValueOnce(CreatedVoting as Voting);

      WriteThroughSUT.writeVoting(authorUUID, uuid, name, options, state).then(() => {
        expect(PrismaMock.voting.create).toBeCalledWith(voting);
      });
    });
  });
});
