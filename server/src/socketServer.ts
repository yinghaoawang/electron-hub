import { createServer } from 'http';
import { Server } from 'socket.io';
import { createSocketListeners } from './socketListeners';

export function buildSocketServer() {
  const httpServer = createServer();
  const io = new Server(httpServer, { cors: { origin: '*' } });
  createSocketListeners(io);
  return httpServer;
}
