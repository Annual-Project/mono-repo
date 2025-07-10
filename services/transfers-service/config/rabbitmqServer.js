import { connectToRabbitMQ } from '../../../shared/config/rabbitmq.js';

export const startRabbitMQConnection = async () => {
  try {
    await connectToRabbitMQ();
    console.log('RabbitMQ connected successfully');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    // process.exit(1); // Exit the process if RabbitMQ connection fails
  }
}
