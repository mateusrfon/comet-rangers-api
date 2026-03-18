import { GameState } from "../game/state";

export type ClientMessage =
  | { type: "create_room" }
  | { type: "join_room"; roomId: string }
  | { type: "leave_room" }
  | { type: "start_game" }
  | {
      type: "input";
      tick: number; // only useful when clientPrediction
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
  | { type: "game_state"; state: GameState };

export function decodeMessage(data: string): ClientMessage | null {
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
