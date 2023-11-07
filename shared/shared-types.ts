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
  user: PublicUser;
}

export interface PublicUser {
  id: string;
  displayName: string;
}

export interface User extends PublicUser {
  email: string;
}

export interface RoomIdAPIResData {
  roomData: RoomData;
  posts: PostWithUser[];
  users: (PublicUser | User)[];
}
