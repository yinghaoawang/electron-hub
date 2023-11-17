import { Socket } from 'types';
import { AuthSocketMessage } from 'shared/shared-types';
import { Server } from 'socket.io';
import firebaseAdmin from 'firebase-admin';
import { PrismaClient, Role } from '@prisma/client';

export function createSocketListeners(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('auth', async (data: AuthSocketMessage) => {
      const token = data.bearerToken?.replace('Bearer ', '');
      if (token == null) {
        console.error('Token is not provided');
        socket.disconnect();
        return;
      }
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      if (decodedToken == null) {
        console.error('Token is invalid');
        socket.disconnect();
        return;
      }

      const dbUser = await new PrismaClient().user.findUnique({
        where: { email: decodedToken.email }
      });
      if (dbUser == null) {
        console.error('User not found');
        socket.disconnect();
        return;
      }

      const user = {
        id: dbUser.id,
        displayName: dbUser.displayName,
        role: dbUser.role as Role
      };

      socket.user = user;

      console.log(socket.user);
      socket.emit('auth-success');
    });

    socket.on('message', (message: string) => {
      console.log('message', message);
      console.log(socket.user);
    });
    console.log('connected');
  });
}
