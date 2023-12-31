import {
  AuthSocketData,
  RoomMessageServerSocketData,
  RoomMessageSocketData,
  Role
} from 'shared/shared-types';
import { Socket } from 'types';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from './middlewares';

export function createSocketListeners(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('auth', async (data: AuthSocketData) => {
      const token = data.bearerToken?.replace('Bearer ', '');
      if (token == null) {
        console.error('Token is not provided');
        socket.disconnect();
        return;
      }
      const decodedUser = await getUserFromToken(token);
      try {
        if (decodedUser == null) {
          throw new Error('Token is invalid');
        }
      } catch (error) {
        console.error('Token is invalid', error);
        socket.disconnect();
        return;
      }

      const user = {
        id: decodedUser.id,
        displayName: decodedUser.displayName,
        email: decodedUser.email,
        role: decodedUser.role as Role
      };

      socket.user = user;

      socket.emit('authSuccessServer');
    });

    socket.on('roomMessage', async (data: RoomMessageSocketData) => {
      if (socket.user == null) {
        console.error('User is not authenticated');
        socket.emit('error', { message: 'User is not authenticated' });
        return;
      }
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

      // get all sockets from pool and check if their id is in dbRoom
      const socketMap: Map<string, Socket> = io.sockets.sockets;
      for (const [key, _socket] of socketMap.entries()) {
        const user = _socket?.user;
        if (user == null) {
          continue;
        }
        const matchingUser = dbRoom.users.find(
          (dbUser) => dbUser.id === user.id
        );
        if (matchingUser == null) {
          continue;
        }

        _socket.emit('roomMessageServer', res);
      }
    });
    console.log('connected');
  });
}
