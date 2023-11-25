import Fastify, { FastifyReply } from 'fastify';
import cors from 'cors';
import { BearerToken } from 'shared/shared-types';
import firebaseAdmin from 'firebase-admin';
import { AuthenticatedRequest } from 'types';
import privateRoutes from './privateRoutes';
import publicRoutes from './publicRoutes';

const authenticateMiddleware = async (
  request: AuthenticatedRequest,
  reply: FastifyReply
) => {
  try {
    const { authorization } = request.headers as {
      authorization?: BearerToken;
    };

    const token = authorization?.replace('Bearer ', '');
    if (token == null) {
      throw new Error('Token not provided.');
    }
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    request.decodedToken = decodedToken;
  } catch (error) {
    reply.status(401).send({ error });
  }
};

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
