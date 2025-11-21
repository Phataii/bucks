import { Queue } from "bullmq";
import { getRedisConnection } from "./redisConnection";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const webhookQueue = new Queue("graph-webhook-queue", {
  connection: getRedisConnection(redisUrl),
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
