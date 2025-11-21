import { Worker } from "bullmq";
import redis from "../../utils/redis";
import { WebhookService } from "./webhook.service";
import { getRedisConnection } from "./redisConnection";

const webhookService = new WebhookService();
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
export const webhookWorker = new Worker(
    "graph-webhook-queue",
    async (job) => {
        console.log("Processing Graph webhook job:", job.id);
        await webhookService.handleGraphWebhook(job.data);
    },
    {
        connection:  getRedisConnection(redisUrl),
        concurrency: 10,  // process 10 events in parallel
    }
);

webhookWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

webhookWorker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});
