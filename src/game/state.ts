import { GameStateDTO } from "../network/protocol";
import type { Asteroid } from "./entities/asteroid";
import type { Bullet } from "./entities/bullet";
import type { Player } from "./entities/player";

export type GameState = {
  tick: number;
  players: Player[];
  bullets: Bullet[];
  asteroids: Asteroid[];
  level: number;
  gameOver: boolean;
};

export class State {
  tick = 0;

  players: Map<string, Player> = new Map(); // convert to Array.from(state.players.values()) is better for JSON.stringify apparently
  bullets: Bullet[] = [];
  asteroids: Asteroid[] = [];

  level: number = 0;
  gameOver = false;

  checkGameStatus() {
    const alivePlayers = Array.from(this.players.values()).filter((player) =>
      player.getIsAlive(),
    );
    if (alivePlayers.length === 0) {
      this.gameOver = true;
      return false;
    }

    return true;
  }

  getStateDTO(): GameStateDTO {
    const data: GameStateDTO = {
      tick: this.tick,
      players: Array.from(this.players.values()).map((player) => {
        return {
          ...player,
          isAlive: player.getIsAlive(),
        };
      }),
      bullets: this.bullets.map((bullet) => ({
        type: "bullet",
        x: bullet.x,
        y: bullet.y,
        size: bullet.size,
        isAlive: bullet.getIsAlive(),
      })),
      asteroids: this.asteroids.map((asteroid) => ({
        type: "asteroid",
        x: asteroid.x,
        y: asteroid.y,
        size: asteroid.size,
        isAlive: asteroid.getIsAlive(),
      })),
      level: this.level,
    };
    return data;
  }
}

// to client
/*
{
  tick: number
  players: {id,x,y,rotation}[]
  bullets: {x,y,vx,vy}[]
  asteroids: {x,y}[]
}
   */
