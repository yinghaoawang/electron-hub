import 'dotenv/config';

import Fastify, { FastifyRequest } from 'fastify';
import cors from 'cors';
import { AuthObject, ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const { ADDRESS = 'localhost', PORT = '8080' } = process.env;

function getAuth(request: FastifyRequest) {
  const auth = (request.raw as any)?.auth as AuthObject;
  return auth;
}

async function build() {
  const fastify = Fastify();
  await fastify.register(require('@fastify/express'));

  fastify.use(cors());
  fastify.use(ClerkExpressRequireAuth());

  fastify.get('/', async (request, reply) => {
    console.log(getAuth(request));
    return { message: 'Hello world!' };
  });

  fastify.get('/ping', async (request, reply) => {
    return 'pong\n';
  });

  return fastify;
}

build().then((fastify) =>
  fastify.listen(
    { host: ADDRESS, port: parseInt(PORT, 10) },
    (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Fastify server listening on ${address}`);
    }
  )
);
