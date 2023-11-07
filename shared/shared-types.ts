export type BearerToken = `Bearer ${string}`;
export interface AuthMessage {
  headers: {
    Authorization: BearerToken;
  };
}

export interface RoomData {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
}

export interface PostWithUser extends Post {
  user: User;
}

export interface User {
  id: string;
  displayName: string;
  role: Role;
}

export interface RoomIdAPIResData {
  roomData: RoomData;
  posts: PostWithUser[];
  users: User[];
}

// Make sure this is in sync with /server/schema.prisma
enum Role {
  ADMIN,
  USER
}
