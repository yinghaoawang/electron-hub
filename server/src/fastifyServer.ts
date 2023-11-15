import { PrismaClient } from '@prisma/client';
import Fastify, { FastifyRequest } from 'fastify';
import cors from 'cors';
import {
  User,
  Room,
  RoomIdAPIResData,
  Role,
  RoomsAPIResData
} from 'shared/shared-types';

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

