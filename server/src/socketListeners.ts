import { Socket } from 'types';
import {
  AuthSocketData,
  RoomMessageServerSocketData,
  RoomMessageSocketData
} from 'shared/shared-types';
import { Server } from 'socket.io';
import firebaseAdmin from 'firebase-admin';
import { PrismaClient, Role } from '@prisma/client';

export function createSocketListeners(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('auth', async (data: AuthSocketData) => {
      const token = data.bearerToken?.replace('Bearer ', '');
      if (token == null) {
        console.error('Token is not provided');
        socket.disconnect();
        return;
      }
      let decodedToken;
      try {
        decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        if (decodedToken == null) {
          throw new Error('Token is invalid');
        }
      } catch (error) {
        console.error('Token is invalid', error);
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

      socket.emit('authSuccessServer');
    });

    socket.on('roomMessage', async (data: RoomMessageSocketData) => {
      // check if user is in room
      const dbRoom = await new PrismaClient().room.findUnique({
        where: { id: data.roomId },
        include: {
          users: true
        }
      });
      if (dbRoom == null) {
        console.error('Room not found');
        return;
      }
      const matchingUser = dbRoom.users.find(
        (user) => user.id === socket.user?.id
      );
      if (matchingUser == null) {
        socket.emit('error', { message: 'You are not in this room' });
        return;
      }
      const dbPost = await new PrismaClient().post.create({
        data: {
          authorId: socket.user.id,
          content: data.message,
          channelId: data.channelId
        }
      });

      const post = {
        id: dbPost.id,
        authorId: socket.user.id,
        content: data.message
      };
      const user = {
        id: socket.user.id,
        displayName: socket.user.displayName,
        role: socket.user.role
      };
      const res: RoomMessageServerSocketData = {
        post: {
          ...post,
          user
        },
        channelId: dbPost.channelId,
        roomId: data.roomId
      };
      // Tells JSON.stringify to use BigInt.toString() instead of converting to an object
      (BigInt.prototype as any).toJSON = function () {
        return this.toString();
      };
      console.log(res);
      socket.emit('roomMessageServer', res);
    });
    console.log('connected');
  });
}
