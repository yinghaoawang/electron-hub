import { createServer } from 'http';
import { Server } from 'socket.io';
import { createSocketListeners } from './socketListeners';

const { SOCKET_PATH = '/socket' } = process.env;

export function buildSocketServer() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    path: SOCKET_PATH,
    cors: { origin: '*' }
  });
  createSocketListeners(io);
  return httpServer;
}
