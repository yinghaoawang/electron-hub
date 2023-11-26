import { FastifyReply } from 'fastify';
import { BearerToken } from 'shared/shared-types';
import { AuthenticatedRequest } from 'types';
import firebaseAdmin from 'firebase-admin';

export const authenticateMiddleware = async (
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
