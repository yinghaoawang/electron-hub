import { User as PrismaUser } from '@prisma/client';
import { Role, Room } from 'shared/shared-types';

// Converts a prisma room to a room
export function dbRoomToRoom(dbRoom: any): Room {
  return {
    id: dbRoom.id,
    name: dbRoom.name,
    channels: dbRoom.channels.map((channel: any) => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
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
    users: dbRoom.users.map((user: PrismaUser) => ({
      id: user.id,
      displayName: user.displayName,
      role: user.role as Role
    }))
  };
}
