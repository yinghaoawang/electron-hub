import { createServer } from 'http';
import { Server } from 'socket.io';
import { createSocketListeners } from './socketListeners';

const { SOCKET_PATH = '/socket.io' } = process.env;

export function buildSocketServer() {
    const httpServer = createServer((req, res) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    });

    const io = new Server(httpServer, {
    path: SOCKET_PATH,
    transports: ['websocket'],
    cors: { origin: '*' }
  });
  createSocketListeners(io);
  return httpServer;
}
