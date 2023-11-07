import 'dotenv/config';

import fastifyIO from 'fastify-socket.io';

import Fastify, { FastifyRequest } from 'fastify';
import cors from 'cors';
import clerkClient, {
  AuthObject,
  ClerkExpressWithAuth
} from '@clerk/clerk-sdk-node';
import { Server } from 'socket.io';
import {
  AuthMessage,
  BearerToken,
  PostWithUser,
  PublicUser,
  RoomData,
  RoomIdAPIResData,
  User
} from 'shared/shared-types';
import jwt from 'jsonwebtoken';
import { SessionToken, Socket } from 'types';
import { v4 as uuidv4 } from 'uuid';

const {
  ADDRESS = 'localhost',
  PORT = '8080',
  CLERK_PEM_PUBLIC_KEY
} = process.env;

if (!CLERK_PEM_PUBLIC_KEY) {
  throw new Error('CLERK_PEM_KEY is not defined');
}

function getAuth(request: FastifyRequest) {
  const auth = (request.raw as any)?.auth as AuthObject | undefined;
  return auth;
}

function verifyToken(_token: BearerToken) {
  const token = _token.replace('Bearer ', '');
  try {
    return jwt.verify(token, CLERK_PEM_PUBLIC_KEY as string);
  } catch (err) {
    return null;
  }
}

async function build() {
  const fastify = Fastify();
  await fastify.register(fastifyIO, {
    cors: {
      origin: '*',
      credentials: true
    }
  });
  await fastify.register(require('@fastify/express'));

  fastify.use(cors());
  fastify.use(ClerkExpressWithAuth());

  fastify.ready().then(() => {
    const io = (fastify as any).io as Server;
    io.on('connection', (socket: Socket) => {
      socket.on('auth', async (message: AuthMessage) => {
        const sessToken = verifyToken(
          message.headers.Authorization
        ) as SessionToken | null;
        if (!sessToken) {
          console.error('Session token is invalid');
          socket.emit('auth-failure');
          return;
        }

        const user = await clerkClient.users.getUser(sessToken.sub);
        socket.user = user;

        socket.emit('auth-success');
      });
      console.log('connected');
    });
  });

  fastify.get(
    '/room/:roomId',
    (request: FastifyRequest<{ Params: { roomId: string } }>, reply) => {
      const roomData: RoomData = {
        id: request.params.roomId,
        name: 'Test room'
      };

      const posts: PostWithUser[] = [];
      for (let i = 0; i < 50; i++) {
        posts.push({
          id: uuidv4(),
          authorId: '1',
          content: 'Hello world',
          user: {
            id: '1',
            displayName: 'Test user'
          }
        });
      }

      const users: (PublicUser | User)[] = [
        { id: '1', displayName: 'Test user' },
        { id: '2', displayName: 'Michael Michael jordjackksonMichael jordjackkson' }
      ];

      const res: RoomIdAPIResData = { roomData, posts, users };
      reply.status(200).send(res);
    }
  );

  fastify.get('/', async (request, reply) => {
    const auth = getAuth(request);
    return { message: 'Hello world!' };
  });

  return fastify;
}

build().then((fastify) => {
  fastify.listen(
    { host: ADDRESS, port: parseInt(PORT, 10) },
    (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Fastify server listening on ${address}`);
    }
  );
});
