export type BearerToken = `Bearer ${string}`;
export interface AuthMessage {
  headers: {
    Authorization: BearerToken;
  };
}

export interface RoomData {
  id: bigint;
  name: string;
}

export interface Post {
  id: bigint;
  authorId: bigint;
  content: string;
}

export interface PostWithUser extends Post {
  user: User;
}

export interface User {
  id: bigint;
  displayName: string;
  role: Role;
}

export interface RoomIdAPIResData {
  roomData: RoomData;
  posts: PostWithUser[];
  users: User[];
}

// Make sure this is in sync with /server/schema.prisma
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
