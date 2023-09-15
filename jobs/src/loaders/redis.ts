import { createClient } from 'redis';
import { logger } from '@utils/logger';

const TIMEOUT_IN_MS = 5000;

const url = process.env['REDIS_URI'];
const RedisClient = createClient({
  url,
  socket: { reconnectStrategy: TIMEOUT_IN_MS },
});
RedisClient.connect();

RedisClient.on('ready', () => {
  logger.info('Redis connection was successfully established!');
});

RedisClient.on('error', (error) => {
  logger.error(`Redis connection has been failed: ${error}.`
    + ` Trying again in ${TIMEOUT_IN_MS}ms...`);
});

export { RedisClient };
