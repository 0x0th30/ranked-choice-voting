import { RedisClient } from '@loaders/redis';

export const RedisMock = {
  set: jest.spyOn(RedisClient, 'set'),
};
