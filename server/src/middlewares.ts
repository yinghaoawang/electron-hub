import { FastifyReply, FastifyRequest } from 'fastify';
import { BearerToken, DetailedUser, Role } from 'shared/shared-types';
import { AuthenticatedRequest, TokenPayload } from 'types';
import { verifyToken } from './auth';
import { PrismaClient } from '@prisma/client';

export const getUserFromRequest = async (
  request: FastifyRequest | AuthenticatedRequest
) => {
  try {
    const { authorization } = request.headers as {
      authorization?: BearerToken;
    };

    const token = authorization?.replace('Bearer ', '');
    if (token == null) {
      throw new Error('Token not provided.');
    }
    return await getUserFromToken(token);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserFromToken = async (token: string) => {
  try {
    const jwtPayload: TokenPayload = await verifyToken(token);
    const dbUser = await new PrismaClient().user.findUnique({
      where: { email: jwtPayload.email }
    });
    if (dbUser == null) {
      throw new Error('User not found.');
    }
    const user: DetailedUser = {
      id: dbUser.id,
      displayName: dbUser.displayName,
      email: dbUser.email,
      role: dbUser.role as Role
    };
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const authenticateMiddleware = async (
  request: AuthenticatedRequest,
  reply: FastifyReply
) => {
  try {
    const user = await getUserFromRequest(request);
    if (user == null) {
      throw new Error('Unauthorized.');
    }
    request.user = user;
  } catch (error) {
    console.log(error);
    reply.status(401).send({ error });
  }
};
