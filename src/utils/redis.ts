import { createClient } from 'redis';
import Logger from './logger';

const logger = new Logger('redis-client');
const options = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
};


const redisClient = createClient(options);

(async () => {
  redisClient.on('error', function (error) {
    logger.error('error connecting to redis', { message: error?.message });
  });
  await redisClient.connect();
})();


export async function limitCalls(windowId: string, maxCalls: number, minutes: number) {
  let resendWindow = await redisClient.get(windowId);
  if (!resendWindow) {
    resendWindow = '0';
  }

  if (Number(resendWindow) >= maxCalls) {
    return false
  }

  redisClient.set(windowId, Number(resendWindow) + 1, {
    EX: minutes * 60,
  });

  return true;
}

export default redisClient;