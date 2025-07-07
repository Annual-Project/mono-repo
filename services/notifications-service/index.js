import "dotenv/config";
import { createServer } from "node:http";
import app from "./app.js";
import { initRedis } from '../../shared/config/redis.js';
import { initializeSocketServer } from "./config/sockerServer.js";
import { startRabbitMQConnection } from "./config/rabbitmqServer.js";

const httpServer = createServer(app);

await initRedis();

// Initialiser Socket.IO
initializeSocketServer(httpServer);

// Initialiser RabbitMQ
await startRabbitMQConnection();

const PORT = process.env.WEB_SERV_PORT || "3000";
const DOMAIN = process.env.WEB_SERV_DOMAIN || "localhost";

httpServer.listen(PORT, () => {
  console.log(`🚀HTTP Server launched at http://${DOMAIN}:${PORT} 🚀`);
});