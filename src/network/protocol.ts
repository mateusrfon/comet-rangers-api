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

export type RoomInfo = {
  hostId: string;
  players: { id: string; name: string }[];
};

export type GameStateDTO = {
  tick: number;
  players: PlayerDTO[];
  bullets: BulletDTO[];
  asteroids: AsteroidDTO[];
  level: number;
};

export type ClientMessage =
  | { type: "create_room" }
  | { type: "join_room"; data: { roomId: string } }
  | { type: "leave_room" }
  | { type: "start_game" }
  | { type: "end_match" }
  | {
      type: "input";
      up: boolean;
      down: boolean;
      left: boolean;
      right: boolean;
      shoot: boolean;
    };

export type ServerMessage =
  | { type: "user_connected"; data: { userId: string } }
  | { type: "room_created"; data: { roomId: string } }
  | { type: "room_joined" }
  | { type: "room_not_found" }
  | { type: "room_left"; data: { roomId: string } }
  | { type: "player_joined"; data: { room: RoomInfo } }
  | { type: "player_left"; data: { room: RoomInfo } }
  | { type: "game_started"; data: { worldWidth: number; worldHeight: number } }
  | { type: "game_state"; data: { state: GameStateDTO } };

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
