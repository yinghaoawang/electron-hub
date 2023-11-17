import { Socket as SocketIOSocket } from 'socket.io';

export interface Socket extends SocketIOSocket {
  user?: DetailedUser;
}
