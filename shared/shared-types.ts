export type BearerToken = `Bearer ${string}`;
// export interface AuthMessage {
//   headers: {
//     Authorization: BearerToken;
//   };
// }

export interface Room {
  id: bigint;
  name: string;
  channels: Channel[];
  users: User[];
}

export interface RoomInfo {
  id: bigint;
  name: string;
  isJoined: boolean;
  userCount: number;
}

export interface Channel {
  id: bigint;
  name: string;
  posts: PostWithUser[];
  type: ChannelType;
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

// Api payload types
export interface MeAPIResData {
  user: DetailedUser;
}
export interface LoginAPIBody {
  email: string;
  password: string;
}
export interface LoginAPIResData {
  user: DetailedUser;
  token: string;
}
export interface SignupAPIBody {
  displayName: string;
  email: string;
  password: string;
}
export interface SignupAPIResData {
  user: DetailedUser;
  token: string;
}
export interface ExploreAPIData {
  roomInfos: RoomInfo[];
}
export interface RoomIdAPIResData {
  room: Room;
}
export interface RoomsAPIResData {
  rooms: Room[];
}
export interface JoinRoomAPIData {
  roomId: bigint;
}
export interface JoinRoomResAPIData {
  room: Room;
}
export interface LeaveRoomAPIData {
  roomId: bigint;
}
export interface VideoAPIBody {
  roomId: bigint;
}
export interface VideoAPIResData {
  lkToken: string;
}

// Socket payload types
export interface AuthSocketData {
  bearerToken: BearerToken;
}
export interface RoomMessageSocketData {
  message: string;
  roomId: bigint;
  channelId: bigint;
}
export interface RoomMessageServerSocketData {
  post: PostWithUser;
  roomId: bigint;
  channelId: bigint;
}

// Make sure these enums are in sync with /server/schema.prisma
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum ChannelType {
  TEXT = 'TEXT',
  VOICE = 'VOICE'
}
