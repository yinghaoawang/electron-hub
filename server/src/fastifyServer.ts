import { PrismaClient } from '@prisma/client';
import Fastify, { FastifyRequest } from 'fastify';
import cors from 'cors';
import {
  User,
  Room,
  RoomIdAPIResData,
  Role,
  RoomsAPIResData,
  LoginAPIResData,
  DetailedUser,
  SignupAPIResData,
  MeAPIResData,
  BearerToken
} from 'shared/shared-types';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getIdToken
} from 'firebase/auth';
import firebaseAdmin from 'firebase-admin';

// Tells JSON.stringify to use BigInt.toString() instead of converting to an object
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

function dbRoomToRoom(dbRoom: any): Room {
  return {
    id: dbRoom.id,
    name: dbRoom.name,
    channels: dbRoom.channels.map((channel: any) => ({
      id: channel.id,
      name: channel.name,
      posts: channel.posts.map((post: any) => ({
        id: post.id,
        authorId: post.authorId,
        content: post.content,
        user: {
          id: post.author.id,
          displayName: post.author.displayName,
          role: post.author.role as Role
        }
      }))
    })),
    users: dbRoom.users.map((user: User) => ({
      id: user.id,
      displayName: user.displayName,
      role: user.role as Role
    }))
  };
}

export async function buildFastifyServer() {
  const fastify = Fastify();
  await fastify.register(require('@fastify/express'));

  fastify.use(cors());

  fastify.post('/me', async (request, reply) => {
    try {
      const { authorization } = request.headers as {
        authorization?: BearerToken;
      };

      const token = authorization?.replace('Bearer ', '');
      if (token == null) {
        return reply.status(400).send({ error: 'Token not provided.' });
      }
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

      const dbUser = await new PrismaClient().user.findUnique({
        where: { email: decodedToken.email }
      });
      if (dbUser == null) {
        throw new Error('User not found.');
      }

      const user: DetailedUser = {
        id: dbUser.id,
        displayName: dbUser.displayName,
        role: dbUser.role as Role,
        email: dbUser.email
      };

      const res: MeAPIResData = { user };
      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({ error });
    }
  });

  fastify.post('/login', async (request, reply) => {
    try {
      const { email, password } = JSON.parse(request.body as string) as {
        email?: string;
        password?: string;
      };
      if (email == null || password == null) {
        return reply
          .status(400)
          .send({ error: 'Email or password not provided.' });
      }
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user == null)
        throw new Error('Firebase user not found.');

      const token = await getIdToken(userCredential.user);

      const dbUser = await new PrismaClient().user.findUnique({
        where: { email: userCredential.user.email as string }
      });

      if (dbUser == null) throw new Error('Db user not found.');

      const user: DetailedUser = {
        id: dbUser.id,
        displayName: dbUser.displayName,
        role: dbUser.role as Role,
        email: dbUser.email
      };

      const res: LoginAPIResData = { user, token };
      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({ error });
    }
  });

  fastify.post('/signup', async (request, reply) => {
    try {
      const { displayName, email, password } = JSON.parse(
        request.body as string
      ) as {
        displayName?: string;
        email?: string;
        password?: string;
      };
      if (displayName == null || email == null || password == null) {
        return reply
          .status(400)
          .send({ error: 'Required fields not provided.' });
      }
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user == null)
        throw new Error('Firebase user not found after creation.');

      const dbUser = await new PrismaClient().user.create({
        data: {
          displayName,
          email
        }
      });

      if (dbUser == null) throw new Error('Db user creation failed.');

      const token = await getIdToken(userCredential.user);

      const user: DetailedUser = {
        id: dbUser.id,
        displayName: dbUser.displayName,
        role: dbUser.role as Role,
        email: dbUser.email
      };
      const res: SignupAPIResData = { user, token };
      reply.status(200).send(res);
    } catch (error) {
      reply.status(500).send({ error });
    }
  });

  fastify.get('/rooms', async (request, reply) => {
    const prismaClient = new PrismaClient();
    const dbRooms = await prismaClient.room.findMany({
      include: {
        users: true,
        channels: {
          include: {
            posts: {
              include: {
                author: true
              }
            }
          }
        }
      }
    });

    if (dbRooms == null) {
      console.error(`Rooms could not be found.`);
      return reply.status(500).send();
    }
    const rooms: Room[] = dbRooms.map((dbRoom) => dbRoomToRoom(dbRoom));

    const res: RoomsAPIResData = { rooms };
    reply.status(200).send(res);
  });

  fastify.get(
    '/room/:roomId',
    async (request: FastifyRequest<{ Params: { roomId: bigint } }>, reply) => {
      const prismaClient = new PrismaClient();
      const dbRoom = await prismaClient.room.findUnique({
        where: { id: request.params.roomId },
        include: {
          users: true,
          channels: {
            include: {
              posts: {
                include: {
                  author: true
                }
              }
            }
          }
        }
      });

      if (dbRoom == null) {
        console.error(`Room not found: ${dbRoom}`);
        return reply.status(500).send();
      }
      const room: Room = dbRoomToRoom(dbRoom);

      const res: RoomIdAPIResData = { room };
      reply.status(200).send(res);
    }
  );

  fastify.get('/', async (request, reply) => {
    return { message: 'Hello world!' };
  });

  return fastify;
}
