import { createClient } from 'redis';

let isFirstConnection = true;

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Tentative de reconnexion Redis #${retries}`);
      return Math.min(retries * 500, 5000);
    },
    keepAlive: 1000,
    connectTimeout: 10000,
  },
});

redisClient.on('connect', () => {
  if (isFirstConnection) {
    isFirstConnection = false;
    console.log('✅ Connected to Redis');
  } else {
    console.log('✅ Redis reconnected successfully');
  }
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

async function initRedis() {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('❌ Failed to connect to Redis', err);
  }
}

export { redisClient, initRedis };
