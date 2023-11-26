import Fastify from 'fastify';
import cors from 'cors';

import privateRoutes from './privateRoutes';
import publicRoutes from './publicRoutes';
import { authenticateMiddleware } from './middlewares';

export async function buildFastifyServer() {
  const fastify = Fastify();
  await fastify.register(require('@fastify/express'));

  fastify.use(cors());

  fastify.register(async (fastify) => {
    fastify.register(publicRoutes);
  });

  fastify.register(async (fastify) => {
    fastify.addHook('preHandler', authenticateMiddleware);
    fastify.register(privateRoutes);
  });

  return fastify;
}
