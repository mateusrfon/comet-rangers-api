import { GameStateDTO } from "../network/protocol";
import type { Asteroid } from "./entities/asteroid";
import type { Bullet } from "./entities/bullet";
import type { Player } from "./entities/player";
import { PowerUp } from "./entities/powerUp";

export class State {
  tick = 0;

  players: Map<string, Player> = new Map(); // convert to Array.from(state.players.values()) is better for JSON.stringify apparently
  bullets: Bullet[] = [];
  asteroids: Asteroid[] = [];
  powerUps: PowerUp[] = [];

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
          type: player.type,
          x: player.x,
          y: player.y,
          size: player.size,
          isAlive: player.getIsAlive(),
          id: player.id,
          angle: player.angle,
          life: player.life,
          score: player.score,
          shield: player.shield,
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
      powerUps: this.powerUps.map((powerUp) => ({
        type: "asteroid",
        x: powerUp.x,
        y: powerUp.y,
        size: powerUp.size,
        isAlive: powerUp.getIsAlive(),
      })),
      level: this.level,
    };
    return data;
  }
}
