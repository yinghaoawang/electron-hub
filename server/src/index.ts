import 'dotenv/config';

import fastifyIO from 'fastify-socket.io';

import Fastify, { FastifyRequest } from 'fastify';
import cors from 'cors';
import { AuthObject, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { Server } from 'socket.io';
import {
  PostWithUser,
  PublicUser,
  RoomData,
  RoomIdAPIResData,
  User
} from 'shared/shared-types';
import { v4 as uuidv4 } from 'uuid';
import { createSocketListeners } from './socketListeners';

const { ADDRESS = 'localhost', PORT = '8080' } = process.env;

function getAuth(request: FastifyRequest) {
  const auth = (request.raw as any)?.auth as AuthObject | undefined;
  return auth;
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
    createSocketListeners(io);
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
        {
          id: '2',
          displayName: 'Michael Michael jordjackksonMichael jordjackkson'
        }
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
