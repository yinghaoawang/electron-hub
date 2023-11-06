import 'dotenv/config';

import Fastify, { FastifyRequest } from 'fastify';
import cors from 'cors';
import { AuthObject, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

const { ADDRESS = 'localhost', PORT = '8080' } = process.env;

function getAuth(request: FastifyRequest) {
  const auth = (request.raw as any)?.auth as AuthObject | undefined;
  return auth;
}

async function build() {
  const fastify = Fastify();
  await fastify.register(require('@fastify/websocket'));
  await fastify.register(require('@fastify/express'));

  fastify.use(cors());
  fastify.use(ClerkExpressWithAuth());

  fastify.get('/ws', { websocket: true }, (connection, req) => {
    console.log(getAuth(req));
    connection.socket.on('message', (message) => {
      connection.socket.send(`Hello Fastify WebSockets: ${message}`);
    });
  });

  fastify.get('/', async (request, reply) => {
    const auth = getAuth(request);
    console.log(auth);
    return { message: 'Hello world!' };
  });

  fastify.get('/ping', async (request, reply) => {
    return 'pong\n';
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
