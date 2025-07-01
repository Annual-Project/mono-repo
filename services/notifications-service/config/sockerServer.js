import { Server } from 'socket.io';
import socketHandler from '../handlers/socketHandler.js';

let io = null;

export const initializeSocketServer = (server) => {
  if (io) {
    console.warn('Socket server is already initialized');
    return io;
  }

  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Initialiser les handlers
  socketHandler(io);

  console.log('Socket.IO server initialized');
  return io;
};

export const getSocketServer = () => {
  if (!io) {
    // throw new Error('Socket server not initialized');
    console.log('Socket server not init.');
  }
  return io;
};
