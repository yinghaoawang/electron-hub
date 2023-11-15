export type BearerToken = `Bearer ${string}`;
export interface AuthMessage {
  headers: {
    Authorization: BearerToken;
  };
}

export interface Room {
  id: bigint;
  name: string;
  channels: Channel[];
  users: User[];
}

export interface Channel {
  id: bigint;
  name: string;
  posts: PostWithUser[];
}

export interface Post {
  id: bigint;
  authorId: bigint;
  content: string;
}

export interface PostWithUser extends Post {
  user: User;
}

export interface DetailedUser extends User {
  email: string;
}

export interface User {
  id: bigint;
  displayName: string;
  role: Role;
}

export interface LoginAPIResData {
  user: DetailedUser;
}

export interface SignupAPIResData {
  user: DetailedUser;
}

export interface RoomIdAPIResData {
  room: Room;
}

export interface RoomsAPIResData {
  rooms: Room[];
}

// Make sure this is in sync with /server/schema.prisma
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
