import { PrismaClient, Voting } from '@prisma/client';
import { RedisClientType } from '@redis/client';
import { WriteThrough } from '@repositories/write-through';
import { PrismaMock } from '@mocks/prisma.mock';
import { RedisMock } from '@mocks/redis.mock';
import { uuidv1Mock } from '@mocks/uuid.mock';
import { CreatedVoting } from './write-through.helper';

jest.mock('uuid');

const WriteThroughSUT = new WriteThrough(
  PrismaMock as any as PrismaClient,
  RedisMock as any as RedisClientType,
);

describe('WriteThrough class', () => {
  describe('(public) writeNewVoting method', () => {
    it('should return voting data if write successfully', () => {
      const uuid = 'f@k3-uuid-h3r3';
      const name = 'voting name';
      const options = ['option1', 'option2', 'option3'];

      uuidv1Mock.mockReturnValueOnce(uuid);
      RedisMock.set.mockResolvedValueOnce('OK');
      RedisMock.set.mockResolvedValueOnce('OK');
      PrismaMock.voting.create.mockResolvedValueOnce(CreatedVoting as Voting);

      WriteThroughSUT.writeNewVoting(name, options).then((value) => {
        expect(value).toEqual(CreatedVoting);
      });
    });
    it('should cache voting options in Redis', () => {
      const uuid = 'f@k3-uuid-h3r3';
      const name = 'voting name';
      const options = ['option1', 'option2', 'option3'];

      const votingOptionsKey = `${uuid}:options`;
      const votingOptionsValue = options.join(',');

      uuidv1Mock.mockReturnValueOnce(uuid);
      RedisMock.set.mockResolvedValueOnce('OK');
      RedisMock.set.mockResolvedValueOnce('OK');
      PrismaMock.voting.create.mockResolvedValueOnce(CreatedVoting as Voting);

      WriteThroughSUT.writeNewVoting(name, options).then(() => {
        expect(RedisMock.set)
          .toHaveBeenNthCalledWith(1, votingOptionsKey, votingOptionsValue);
      });
    });
    it.todo('should cache voting state in Redis');
    it.todo('should store voting data in Postgres');
  });
});
