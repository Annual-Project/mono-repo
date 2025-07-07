import { consume } from '../../../shared/config/rabbitmq.js';

export default async () => {
  // This function is used to start consuming messages from RabbitMQ
  console.log('Starting RabbitMQ consumers...');

  // Consume messages from the 'transfer.create' queue
  // data est déjà parsé en JSON depuis la fonction parent (consume)
  await consume('stock.alert', async (data) => {
    try {
      console.log('[stock.alert] Received message:', data);

      // fetch vers /api/v1/users/role/:roleName de auth-service
      const response1 = await fetch(`http://auth-service:3000/api/v1/users/role/${data.roleName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "x-internal-api-key": process.env.INTERNAL_API_KEY,
        },
      });

      const users = await response1.json();

      // fetch vers /api/v1/notifications de notifications-service
      await fetch('http://notifications-service:3000/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "x-internal-api-key": process.env.INTERNAL_API_KEY,
        },
        body: JSON.stringify({
          userIds: users.map(user => user.id),
          title: data.title,
          message: data.message,
          type: data.type,
          data: data.data,
        }),
      });

      console.log('[stock.alert] Message processed successfully and notifications sent.');
    } catch (error) {
      console.error('[stock.alert] Error processing message:', error);
      // Optionally, you can requeue the message or handle the error accordingly
    }
  });
}
