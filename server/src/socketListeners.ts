import { Socket } from 'types';
import { AuthMessage, BearerToken } from 'shared/shared-types';
import { User } from 'firebase/auth';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

// function verifyToken(_token: BearerToken) {
//   const token = _token.replace('Bearer ', '');
//   try {
//     return jwt.verify(token, CLERK_PEM_PUBLIC_KEY as string);
//   } catch (err) {
//     return null;
//   }
// }

export function createSocketListeners(io: Server) {
  io.on('connection', (socket: Socket) => {
    //   console.log('hey');
    // socket.on('auth', async (message: AuthMessage) => {
    //   const sessToken = verifyToken(
    //     message.headers.Authorization
    //   ) as SessionToken | null;
    //   if (!sessToken) {
    //     console.error('Session token is invalid');
    //     socket.emit('auth-failure');
    //     return;
    //   }

    //   const user = await clerkClient.users.getUser(sessToken.sub);
    //   socket.user = user;

    socket.emit('auth-success');
    // });
    console.log('connected');
  });
}
