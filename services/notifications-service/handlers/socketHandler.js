const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client connecté: ${socket.id}`);

    // Le client doit s'identifier avec son userId pour recevoir ses notifications
    socket.on('join', (data) => {
      try {
        const { userId } = data;
        if (!userId) {
          socket.emit('error', { message: 'userId requis pour rejoindre' });
          return;
        }

        // Joindre la room spécifique à l'utilisateur
        socket.join(`user_${userId}`);
        socket.userId = userId;
        
        console.log(`Utilisateur ${userId} a rejoint sa room`);
        socket.emit('joined', { 
          message: 'Connecté aux notifications',
          userId 
        });
      } catch (error) {
        socket.emit('error', { message: 'Erreur lors de la connexion' });
      }
    });

    // Le client peut demander le nombre de notifications non lues
    socket.on('getUnreadCount', async (callback) => {
      try {
        if (!socket.userId) {
          callback({ error: 'Non authentifié' });
          return;
        }

        const prisma = require('../config/db');
        const count = await prisma.notificationRecipient.count({
          where: {
            userId: parseInt(socket.userId),
            read: false,
          },
        });

        callback({ count });
      } catch (error) {
        callback({ error: 'Erreur lors du comptage' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client déconnecté: ${socket.id}`);
      if (socket.userId) {
        console.log(`Utilisateur ${socket.userId} déconnecté`);
      }
    });

    // Gestion des erreurs
    socket.on('error', (error) => {
      console.error('Erreur socket:', error);
    });
  });

  return io;
};

export default socketHandler;
