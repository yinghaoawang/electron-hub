import 'dotenv/config';

import fastifyIO from 'fastify-socket.io';

import Fastify, { FastifyRequest } from 'fastify';
import cors from 'cors';
import { AuthObject, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { Server } from 'socket.io';
import { AuthMessage } from 'shared/shared-types';

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
    io.on('connection', (socket) => {
      socket.on('auth', (message: AuthMessage) => {});
      console.log('connected');
    });
  });

  fastify.get('/', async (request, _reply) => {
    const auth = getAuth(request);
    return { message: 'Hello world!' };
  });

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
}

build();
