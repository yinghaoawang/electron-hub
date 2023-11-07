import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import fastifyIO from 'fastify-socket.io';
import Fastify, { FastifyRequest } from 'fastify';
import cors from 'cors';
import { AuthObject, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { Server } from 'socket.io';
import {
  PostWithUser,
  User,
  RoomData,
  RoomIdAPIResData,
  Role
} from 'shared/shared-types';
import { createSocketListeners } from './socketListeners';

// Tells JSON.stringify to use BigInt.toString() instead of converting to an object
(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

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
    async (request: FastifyRequest<{ Params: { roomId: bigint } }>, reply) => {
      const roomData: RoomData = {
        id: request.params.roomId,
        name: 'Test room'
      };

      const posts: PostWithUser[] = [];

      const prismaClient = new PrismaClient();
      const dbUsers = await prismaClient.user.findMany({});
      console.log(dbUsers);
      const users: User[] = dbUsers.map((user) => ({
        id: user.id,
        displayName: user.displayName,
        role: user.role as Role
      }));

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
