import { URL } from "url";

export function getRedisConnection(url: string) {
  const redisUrl = new URL(url);

  return {
    host: redisUrl.hostname,
    port: Number(redisUrl.port),
    password: redisUrl.password || undefined,
  };
}
