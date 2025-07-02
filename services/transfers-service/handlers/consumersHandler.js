import { consume } from '../../../shared/config/rabbitmq.js';

export default async () => {
  // This function is used to start consuming messages from RabbitMQ
  console.log('Starting RabbitMQ consumers...');

  // Consume messages from the 'transfer.create' queue
  // data est déjà parsé en JSON depuis la fonction parent (consume)
  await consume('transfer.create', async (data) => {
    try {
      console.log('Received message:', data);

      // Here you would typically process the data, e.g., create a transfer record
      // For example:
      // await TransferService.createTransfer(data);

      console.log('Transfer created successfully:', data);
    } catch (error) {
      console.error('Error processing message:', error);
      // Optionally, you can requeue the message or handle the error accordingly
    }
  });
}
