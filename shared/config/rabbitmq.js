import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

// Chaque nouvelle connexion RabbitMQ va créer son propre channel
let channel, connection;

export async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    console.log('✅ Connected to RabbitMQ');
    return connection;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
}

function getChannel() {
  return channel;
}

// Vérifie si la queue existe, sinon elle la crée
// Note: RabbitMQ crée automatiquement la queue si elle n'existe pas lors de l'envoi d'un message
async function assertQueue(queue) {
  await channel.assertQueue(queue, { durable: true });
}

/** * Envoie un message à une queue RabbitMQ
 * @param {string} queue - Nom de la queue
 * @param {Object} message - Message à envoyer
 */
// Le message est sérialisé en une chaîne de caractères JSON
// Et ensuite converti en Buffer pour l'envoi
// Note: Un Buffer est un objet de type binaire qui peut être envoyé sur le réseau
async function sendToQueue(queue, message) {
  await assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}

/** * Consomme les messages d'une queue RabbitMQ
 * @param {string} queue - Nom de la queue
 * @param {Function} handler - Fonction de traitement des messages
 */
async function consume(queue, handler) {
  await assertQueue(queue);

  channel.consume(queue, async (msg) => {

    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());

      // Appelle le handler avec le contenu du message
      await handler(content);

      // Accuse la réception du message pour éviter de le consommer à nouveau
      channel.ack(msg);
    }

  });
}

export default {
  connectToRabbitMQ,
  getChannel,
  sendToQueue,
  consume,
};
