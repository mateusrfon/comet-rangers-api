import { Entity } from "../entities/entity";
import { State } from "../state";

export class PhysicsSystem {
  private dt = 1 / 60;

  constructor(
    private state: State,
    private worldWidth: number,
    private worldHeight: number,
  ) {}

  public updatePositions() {
    this.updatePlayerPosition();
    this.updateAsteroidPosition();
    this.updateBulletPosition();
  }

  private updatePlayerPosition() {
    for (const player of this.state.players.values()) {
      // Check and apply inputs
      const input = player.inputQueue.shift();

      if (input) {
        player.lastInput = input;
      }

      if (player.lastInput.left)
        player.angle -= player.rotationSpeed * 60 * this.dt;
      if (player.lastInput.right)
        player.angle += player.rotationSpeed * 60 * this.dt;

      if (player.lastInput.up) {
        player.vx +=
          Math.cos(player.angle) * player.acceleration * 60 * this.dt;
        player.vy +=
          Math.sin(player.angle) * player.acceleration * 60 * this.dt;
      }

      // Apply friction
      player.vx *= player.friction;
      player.vy *= player.friction;

      // Update position based on velocity
      player.x += player.vx * 60 * this.dt;
      player.y += player.vy * 60 * this.dt;

      // Update angle based on angular velocity
      player.angle += player.angularVelocity * 60 * this.dt;
      player.angularVelocity *= player.friction; // 0.98 previously;

      this.handleBoundaries(player);
    }
  }

  private updateAsteroidPosition() {
    for (const asteroid of this.state.asteroids) {
      asteroid.x += asteroid.vx * this.dt;
      asteroid.y += asteroid.vy * this.dt;

      this.handleBoundaries(asteroid);
    }
  }

  private updateBulletPosition() {
    for (const bullet of this.state.bullets) {
      bullet.prevX = bullet.x;
      bullet.prevY = bullet.y;

      bullet.x += bullet.vx;
      bullet.y += bullet.vy;

      this.handleBoundaries(bullet);
    }
  }

  private handleBoundaries(entity: Entity) {
    const width = this.worldWidth;
    const height = this.worldHeight;

    entity.x = (entity.x + width) % width;
    entity.y = (entity.y + height) % height;
  }
}

// input to player velocity + shoot check
// physics update positions (maybe boundaries and collision in her)
// boundaries
// handle collisions
// clean entities
