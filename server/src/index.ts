import 'dotenv/config';

const {
  FASTIFY_ADDRESS = 'localhost',
  FASTIFY_PORT = '8078',
  SOCKET_ADDRESS = 'localhost',
  SOCKET_PORT = '8062'
} = process.env;

import { buildFastifyServer } from './fastifyServer';
import { FastifyInstance } from 'fastify';
import { buildSocketServer } from './socketServer';
buildFastifyServer().then((fastify: FastifyInstance) => {
  fastify.listen(
    { host: FASTIFY_ADDRESS, port: parseInt(FASTIFY_PORT, 10) },
    (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Fastify server listening on ${address}`);
    }
  );
});

buildSocketServer().listen(parseInt(SOCKET_PORT, 10), SOCKET_ADDRESS, () => {
  console.log(`Socket server listening on ${SOCKET_ADDRESS}:${SOCKET_PORT}`);
});
