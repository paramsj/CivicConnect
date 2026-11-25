import IORedis from 'ioredis';

// Construct Redis connection URL supporting standard port 6379 (NOT cloud-only like Upstash)
const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`;

console.log(`[Redis Config] Initializing Redis connection with endpoint: ${redisUrl.replace(/:[^:@]*@/, ':****@')}`);

// 1. App Redis: For general cache, counters, and .del() calls.
// Limited retries prevent the Express event loop from hanging indefinitely if Redis is unavailable.
export const appRedis = new IORedis(redisUrl, {
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        const delay = Math.min(times * 100, 3000);
        return delay;
    }
});

// 2. Queue Redis: Dedicated to BullMQ Queue metadata and pub/sub.
// maxRetriesPerRequest: null is STRICTLY REQUIRED by BullMQ
export const queueRedis = new IORedis(redisUrl, {
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
    retryStrategy(times) {
        const delay = Math.min(times * 100, 3000);
        return delay;
    }
});

// 3. Worker Redis: Dedicated to the BullMQ worker's blocking commands (BRPOP/BZPOPMIN).
// maxRetriesPerRequest: null is STRICTLY REQUIRED by BullMQ
export const workerRedis = new IORedis(redisUrl, {
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
    retryStrategy(times) {
        const delay = Math.min(times * 100, 3000);
        return delay;
    }
});

appRedis.on('connect', () => console.log('✅ App Redis connected successfully'));
appRedis.on('error', (err) => console.error('❌ App Redis Error:', err.message));

queueRedis.on('connect', () => console.log('✅ Queue Redis connected successfully'));
queueRedis.on('error', (err) => console.error('❌ Queue Redis Error:', err.message));

workerRedis.on('connect', () => console.log('✅ Worker Redis connected successfully'));
workerRedis.on('error', (err) => console.error('❌ Worker Redis Error:', err.message));

export default appRedis;
