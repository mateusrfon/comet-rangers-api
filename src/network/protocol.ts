import { EntityType } from "../game/entities/entity";

export type EntityDTO = {
  type: EntityType;
  x: number;
  y: number;
  size: number;
  isAlive: boolean;
};

export type PlayerDTO = EntityDTO & {
  id: string;
  angle: number;
  life: number;
  score: number;
};

export type BulletDTO = EntityDTO;

export type AsteroidDTO = EntityDTO;

export type GameStateDTO = {
  tick: number;
  players: PlayerDTO[];
  bullets: BulletDTO[];
  asteroids: AsteroidDTO[];
  level: number;
};

export type ClientMessage =
  | { type: "create_room" }
  | { type: "join_room"; roomId: string }
  | { type: "leave_room" }
  | { type: "start_game" }
  | {
      type: "input";
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
  | { type: "room_left"; roomId: string }
  | { type: "room_not_found"; roomId: string }
  | { type: "player_joined"; playerId: string }
  | { type: "player_left"; playerId: string }
  | { type: "room_not_found" }
  | { type: "game_started"; worldWidth: number; worldHeight: number }
  | { type: "game_state"; state: GameStateDTO };

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
