import "dotenv/config";
import { createServer } from "node:http";
import app from "./app.js";
import { initRedis } from '../../shared/config/redis.js';
import { startRabbitMQConnection } from "./config/rabbitmqServer.js";
import { sendToQueue } from '../../shared/config/rabbitmq.js';

const httpServer = createServer(app);

await initRedis();

await startRabbitMQConnection();

await sendToQueue("transfer.create", { name: 'test' })

const PORT = process.env.WEB_SERV_PORT || "3000";
const DOMAIN = process.env.WEB_SERV_DOMAIN || "localhost";

httpServer.listen(PORT, () => {
  console.log(`🚀HTTP Server launched at http://${DOMAIN}:${PORT} 🚀`);
});