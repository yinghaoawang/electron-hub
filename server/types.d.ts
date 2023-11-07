import { User } from '@clerk/clerk-sdk-node';
import { Socket as SocketIOSocket } from 'socket.io';

export interface SessionToken {
  azp: string;
  exp: number;
  iat: number;
  iss: string;
  nbf: number;
  sid: string;
  sub: string;
}

export interface Socket extends SocketIOSocket {
  user?: User;
}
