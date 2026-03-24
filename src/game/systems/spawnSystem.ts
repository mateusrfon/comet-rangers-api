import { argon2 } from "node:crypto";
import { Asteroid } from "../entities/asteroid";
import { State } from "../state";

export class SpawnSystem {
  constructor(private state: State) {}
  respawnPlayers() {
    Array.from(this.state.players.values()).forEach((p) => {
      if (!p.getIsAlive() && p.life > 0 && p.canRespawn(this.state.tick)) {
        p.removeLife();
        p.resetToSpawn();
        p.respawn();
      }
    });
  }

  splitAsteroid() {
    this.state.asteroids.forEach((a) => {
      if (a.shouldSplit()) {
        const a1 = new Asteroid(
          a.x,
          a.y,
          a.size / 2,
          a.speed * 3,
          a.angle + Math.PI / 8,
        );
        this.state.asteroids.push(a1);
        const a2 = new Asteroid(
          a.x,
          a.y,
          a.size / 2,
          a.speed * 3,
          a.angle - Math.PI / 8,
        );
        this.state.asteroids.push(a2);
      }
    });
  }
}
