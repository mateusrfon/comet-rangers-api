import { ClientState, State } from "../game/state";

export type ClientMessage =
  | { type: "create_room" }
  | { type: "join_room"; roomId: string }
  | { type: "leave_room" }
  | { type: "start_game" }
  | {
      type: "input";
      tick: number;
      up: boolean;
      down: boolean;
      left: boolean;
      right: boolean;
      shoot: boolean;
    };

export type ServerMessage =
  | { type: "user_connected"; userId: string }
  | { type: "room_created"; roomId: string }
  | { type: "room_joined"; roomId: string }
  | { type: "room_not_found" }
  | { type: "game_started"; worldWidth: number; worldHeight: number }
  | { type: "broadcast"; state: ClientState };

export function decodeMessage(data: string): any {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error decoding message:", error);
    return null;
  }
}

export function encodeMessage(msg: ServerMessage) {
  return JSON.stringify(msg);
}
