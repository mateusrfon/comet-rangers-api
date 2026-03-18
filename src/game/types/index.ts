export type Input = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shoot: boolean;
};

export type InputState = Input[];

export interface PlayerConnection {
  id: string;
  socket: WebSocket;
  roomId?: string;
}
