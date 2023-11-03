import Fastify from 'fastify';
import cors from 'cors';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const { ADDRESS = 'localhost', PORT = '8080' } = process.env;

async function build() {
  const fastify = Fastify();
  await fastify.register(require('@fastify/express'));

  fastify.use(cors());

  fastify.get('/', async (request, reply) => {
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
