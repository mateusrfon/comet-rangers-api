export interface InputState {
  tick: number;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shoot: boolean;
}

export interface PlayerConnection {
  id: string;
  socket: WebSocket;
  roomId?: string;
}
