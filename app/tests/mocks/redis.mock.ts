import { RedisClient } from '@loaders/redis';

export const RedisMock = {
  set: jest.spyOn(RedisClient, 'set'),
  get: jest.spyOn(RedisClient, 'get'),
};
