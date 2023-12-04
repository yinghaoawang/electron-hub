import { PrismaClient } from '@prisma/client';
import { FastifyReply, FastifyInstance } from 'fastify';
import {
  Room,
  RoomIdAPIResData,
  Role,
  RoomsAPIResData,
  DetailedUser,
  MeAPIResData,
  RoomInfo,
  ExploreAPIData,
  JoinRoomResAPIData,
  VideoAPIResData,
  VideoAPIBody
} from 'shared/shared-types';
import { createLKToken } from '../livekit';
import { AuthenticatedRequest } from 'types';
import { dbRoomToRoom } from '../utils';

const privateRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    '/me',
    async (request: AuthenticatedRequest, reply: FastifyReply) => {
      try {
        if (request.user == null) {
          return reply.status(401).send({ message: 'Unauthorized' });
        }

        const dbUser = await new PrismaClient().user.findUnique({
          where: { email: request.user.email }
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
    }
  );

  fastify.post(
    '/logout',
    async (request: AuthenticatedRequest, reply: FastifyReply) => {
      try {
        if (request.user == null) {
          return reply.status(401).send({ message: 'Unauthorized' });
        }

        reply.status(200).send();
      } catch (error) {
        reply.status(500).send({ error });
      }
    }
  );

  fastify.post(
    '/video',
    async (request: AuthenticatedRequest, reply: FastifyReply) => {
      try {
        if (request.user == null) {
          return reply.status(401).send({ message: 'Unauthorized' });
        }

        const { roomId, channelId } = JSON.parse(
          request.body as string
        ) as VideoAPIBody;
        if (roomId == null) {
          return reply.status(400).send({ error: 'Room id not provided.' });
        }
        if (channelId == null) {
          return reply.status(400).send({ error: 'Channel id not provided.' });
        }
        1;

        const dbUser = await new PrismaClient().user.findUnique({
          where: { email: request.user.email }
        });
        if (dbUser == null) {
          throw new Error('User not found.');
        }

        const lkToken = createLKToken({
          roomName: roomId.toString() + '-' + channelId.toString(),
          participantName: dbUser.displayName
        });

        const res: VideoAPIResData = { lkToken };
        reply.status(200).send(res);
      } catch (error) {
        reply.status(500).send({ error });
      }
    }
  );

  fastify.get(
    '/explore',
    async (request: AuthenticatedRequest, reply: FastifyReply) => {
      try {
        if (request.user == null) {
          return reply.status(401).send({ message: 'Unauthorized' });
        }

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
        const roomInfos: RoomInfo[] = dbRooms.map((dbRoom) => ({
          id: dbRoom.id,
          name: dbRoom.name,
          isJoined: dbRoom.users.some(
            (user) => user.email === request.user?.email
          ),
          userCount: dbRoom.users.length
        }));

        const res: ExploreAPIData = { roomInfos };
        reply.status(200).send(res);
      } catch (error) {
        reply.status(500).send({ error });
      }
    }
  );

  fastify.post(
    '/leave-room',
    async (request: AuthenticatedRequest, reply: FastifyReply) => {
      try {
        if (request.user == null) {
          return reply.status(401).send({ message: 'Unauthorized' });
        }

        const { roomId } = JSON.parse(request.body as string) as {
          roomId?: bigint;
        };
        if (roomId == null) {
          return reply.status(400).send({ error: 'Room id not provided.' });
        }

        const prismaClient = new PrismaClient();
        const dbRoom = await prismaClient.room.findUnique({
          where: { id: roomId },
          include: {
            users: true
          }
        });
        if (dbRoom == null) {
          throw new Error(`Room could not be found.`);
        }
        const matchingUser = dbRoom.users.find(
          (user) => user.email === request.user?.email
        );
        if (matchingUser == null) {
          throw new Error(`User is not in this room.`);
        }
        await prismaClient.room.update({
          where: { id: roomId },
          data: {
            users: {
              disconnect: {
                email: request.user?.email
              }
            }
          }
        });
        return reply.status(200).send({ success: true });
      } catch (error) {
        reply.status(500).send({ error });
      }
    }
  );

  fastify.post(
    '/join-room',
    async (request: AuthenticatedRequest, reply: FastifyReply) => {
      try {
        if (request.user == null) {
          return reply.status(401).send({ message: 'Unauthorized' });
        }

        const { roomId } = JSON.parse(request.body as string) as {
          roomId?: bigint;
        };
        if (roomId == null) {
          return reply.status(400).send({ error: 'Room id not provided.' });
        }

        const prismaClient = new PrismaClient();
        const dbRoom = await prismaClient.room.findUnique({
          where: { id: roomId },
          include: {
            users: true
          }
        });
        if (dbRoom == null) {
          throw new Error(`Room could not be found.`);
        }
        const matchingUser = dbRoom.users.find(
          (user) => user.email === request.user?.email
        );
        if (matchingUser != null) {
          throw new Error(`User is already in this room.`);
        }

        const room = await prismaClient.room.update({
          where: { id: roomId },
          data: {
            users: {
              connect: {
                email: request.user.email
              }
            }
          },
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

        const res: JoinRoomResAPIData = { room: dbRoomToRoom(room) };

        reply.status(200).send(res);
      } catch (error) {
        reply.status(500).send({ error });
      }
    }
  );

  fastify.get(
    '/rooms',
    async (request: AuthenticatedRequest, reply: FastifyReply) => {
      try {
        if (request.user == null) {
          return reply.status(401).send({ message: 'Unauthorized' });
        }

        const prismaClient = new PrismaClient();
        const dbRooms = await prismaClient.room.findMany({
          where: { users: { some: { email: request.user?.email } } },
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
      } catch (error) {
        reply.status(500).send({ error });
      }
    }
  );

  fastify.get(
    '/room/:roomId',
    async (
      request: AuthenticatedRequest<{ Params: { roomId: bigint } }>,
      reply
    ) => {
      if (request.user == null) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

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
};

export default privateRoutes;
