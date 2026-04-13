import { argon2 } from "node:crypto";
import { Asteroid } from "../entities/asteroid";
import { State } from "../state";
import { User } from "../../domain/user";
import { Player } from "../entities/player";
import { LevelDefinition } from "../levels";
import { PowerUpType } from "../entities/entity";
import { PowerUp } from "../entities/powerUp";

export class SpawnSystem {
  constructor(private state: State) {}
  public spawnPlayers(users: User[], worldWidth: number, worldHeight: number) {
    const offset = 150;

    const positions = [
      { x: offset, y: offset },
      { x: worldWidth - offset, y: offset },
      { x: offset, y: worldHeight - offset },
      { x: worldWidth - offset, y: worldHeight - offset },
    ];

    let i = 0;

    users.forEach((user) => {
      if (i >= 4) return;

      const pos = positions[i];

      const player = new Player({
        id: user.id,
        x: pos!.x,
        y: pos!.y,
        angle: i % 2 === 0 ? 0 : Math.PI,
      });

      user.player = player;
      this.state.players.set(player.id, player);

      i++;
    });
  }

  public spawnLevel(level: LevelDefinition) {
    for (const spawn of level.asteroidSpawns) {
      const asteroid = new Asteroid(spawn.x, spawn.y, spawn.size, spawn.speed);
      this.state.asteroids.push(asteroid);
    }
  }

  public respawnPlayers() {
    Array.from(this.state.players.values()).forEach((p) => {
      if (!p.getIsAlive() && p.life > 0 && p.canRespawn(this.state.tick)) {
        p.removeLife();
        p.resetToSpawn();
        p.respawn();
      }
    });
  }

  private shouldDropPowerUp() {
    const spawnChance = 0.1;

    if (Math.random() < spawnChance) return true;
    return false;
  }

  private randomFromArray(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private spawnPowerUp(x: number, y: number, size: number) {
    // const powerUpTypes: PowerUpType[] = [
    //   "powerUp-shield",
    //   "powerUp-teleport",
    //   "powerUp-repulsion",
    // ];

    // const type = this.randomFromArray(Object.keys(powerUpTypes)) as PowerUpType;
    this.state.powerUps.push(
      new PowerUp("powerUp-shield", x, y, size, this.state.tick),
    );
  }

  public splitAsteroid() {
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

        if (this.shouldDropPowerUp()) this.spawnPowerUp(a.x, a.y, 25);
      }
    });
  }
}
