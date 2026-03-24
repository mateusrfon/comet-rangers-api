import { Asteroid } from "../entities/asteroid";
import { Bullet } from "../entities/bullet";
import { Entity } from "../entities/entity";
import { Player } from "../entities/player";
import { State } from "../state";

type CollisionEvent =
  | {
      type: "player-bullet";
      bullet: Bullet;
      player: Player;
      hitX: number;
      hitY: number;
    }
  | {
      type: "player-asteroid";
      asteroid: Asteroid;
      player: Player;
    }
  | {
      type: "bullet-asteroid";
      bullet: Bullet;
      asteroid: Asteroid;
    };

export class CollisionSystem {
  constructor(
    private state: State,
    private worldWidth: number,
    private worldHeight: number,
  ) {}

  public resolveCollisions(collisions: CollisionEvent[]) {
    for (const collision of collisions) {
      switch (collision.type) {
        case "bullet-asteroid": {
          collision.bullet.takeDamage();
          collision.asteroid.takeDamage();
          break;
        }
        case "player-asteroid": {
          collision.player.takeDamage(this.state.tick);
          collision.asteroid.takeDamage();
          break;
        }
        case "player-bullet": {
          collision.bullet.takeDamage();
          this.applyPlayerImpulse(
            collision.player,
            collision.bullet,
            collision.hitX,
            collision.hitY,
          );
          break;
        }
      }
    }
  }

  private applyPlayerImpulse(
    player: Player,
    entity: Bullet,
    hitX: number,
    hitY: number,
  ) {
    const force = 0.5;
    const impulseX = entity.vx * force;
    const impulseY = entity.vy * force;

    // impulso linear
    player.vx += impulseX; // Should divide by mass if we had it, but we'll assume mass = 1 for simplicity
    player.vy += impulseY;

    // torque simplificado
    const rx = hitX - player.x;
    const ry = hitY - player.y;

    const torque = rx * impulseY - ry * impulseX;
    player.angularVelocity += torque * 0.001; // Fine adjustment factor for feel
  }

  public getCollisions(): CollisionEvent[] {
    const playerCollision = this.checkPlayerCollisions();
    const bulletAsteroidCollision = this.checkBulletAsteroidCollision();

    return [...playerCollision, ...bulletAsteroidCollision];
  }

  private checkPlayerCollisions(): CollisionEvent[] {
    const result: CollisionEvent[] = [];
    for (const player of this.state.players.values()) {
      if (!player.getIsAlive()) continue;
      const playerVertices = player.getWorldVertices();
      // Check player-asteroid collisions
      for (const asteroid of this.state.asteroids) {
        if (!asteroid.getIsAlive()) continue;
        if (
          this.circleVsPolygonCollision(
            asteroid.x,
            asteroid.y,
            asteroid.size,
            playerVertices,
          )
        ) {
          result.push({
            type: "player-asteroid",
            asteroid,
            player,
          });
        }
      }
      // Check player-bullet collisions
      for (const bullet of this.state.bullets) {
        if (!bullet.getIsAlive()) continue;
        if (bullet.ownerId === player.id) continue; // Skip self-collisions
        for (let i = 0; i < playerVertices.length; i++) {
          const v1 = playerVertices[i];
          const v2 = playerVertices[(i + 1) % playerVertices.length];
          if (!v1 || !v2) continue;
          const intersection = this.segmentIntersect(
            bullet.prevX,
            bullet.prevY,
            bullet.x,
            bullet.y,
            v1.x,
            v1.y,
            v2.x,
            v2.y,
          );
          if (intersection) {
            const dirX = bullet.vx;
            const dirY = bullet.vy;

            const force = 0.5;
            const impulseX = dirX * force;
            const impulseY = dirY * force;

            result.push({
              type: "player-bullet",
              bullet,
              player,
              hitX: intersection.hitX,
              hitY: intersection.hitY,
            });
            break;
          }
        }
      }
    }
    return result;
  }

  private checkBulletAsteroidCollision(): CollisionEvent[] {
    const result: CollisionEvent[] = [];
    for (const bullet of this.state.bullets) {
      if (!bullet.getIsAlive()) continue;
      for (const asteroid of this.state.asteroids) {
        if (!asteroid.getIsAlive()) continue;
        if (
          this.entityDistanceToroidal(bullet, asteroid) <
          bullet.size + asteroid.size
        ) {
          result.push({
            type: "bullet-asteroid",
            bullet,
            asteroid,
          });
        }
      }
    }
    return result;
  }

  private entityDistanceToroidal(a: Entity, b: Entity): number {
    const width = this.worldWidth;
    const height = this.worldHeight;

    let dx = Math.abs(a.x - b.x);
    let dy = Math.abs(a.y - b.y);

    dx = Math.min(dx, width - dx);
    dy = Math.min(dy, height - dy);

    return Math.sqrt(dx * dx + dy * dy);
  }

  private closestPointOnSegment(
    px: number,
    py: number, // Point position
    ax: number,
    ay: number, // Segment start
    bx: number,
    by: number, // Segment end
  ) {
    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;

    const abLenSq = abx * abx + aby * aby;
    const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / abLenSq));

    return {
      x: ax + abx * t,
      y: ay + aby * t,
    };
  }

  private circleVsPolygonCollision(
    circleX: number,
    circleY: number,
    radius: number,
    vertices: { x: number; y: number }[],
  ): { dx: number; dy: number; distance: number } | null {
    for (let i = 0; i < vertices.length; i++) {
      const v1 = vertices[i];
      const v2 = vertices[(i + 1) % vertices.length];
      if (!v1 || !v2) return null;

      const closest = this.closestPointOnSegment(
        circleX,
        circleY,
        v1.x,
        v1.y,
        v2.x,
        v2.y,
      );

      const dx = circleX - closest.x;
      const dy = circleY - closest.y;

      const distanceSq = dx * dx + dy * dy;

      if (distanceSq < radius * radius) {
        return { dx, dy, distance: Math.sqrt(distanceSq) };
      }
    }

    return null;
  }

  private segmentIntersect(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
  ): { hitX: number; hitY: number; distance: number } | null {
    const width = 1000; // this.renderer.width;
    const height = 1000; // this.renderer.height;

    const d1x = x2 - x1;
    const d1y = y2 - y1;

    let closestHit = null;

    const offsets = [-1, 0, 1];

    for (const ox of offsets) {
      for (const oy of offsets) {
        const ax3 = x3 + ox * width;
        const ay3 = y3 + oy * height;
        const ax4 = x4 + ox * width;
        const ay4 = y4 + oy * height;

        const d2x = ax4 - ax3;
        const d2y = ay4 - ay3;

        const denom = d1x * d2y - d1y * d2x;

        if (denom === 0) continue;

        const dx = ax3 - x1;
        const dy = ay3 - y1;

        const t = (dx * d2y - dy * d2x) / denom;
        const u = (dx * d1y - dy * d1x) / denom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
          const hitX = x1 + t * d1x;
          const hitY = y1 + t * d1y;

          const distSq = (hitX - x1) * (hitX - x1) + (hitY - y1) * (hitY - y1);

          if (!closestHit || distSq < closestHit.distance) {
            closestHit = {
              x: hitX,
              y: hitY,
              distance: distSq,
            };
          }
        }
      }
    }

    if (!closestHit) {
      return null;
    }

    return {
      hitX: closestHit.x,
      hitY: closestHit.y,
      distance: Math.sqrt(closestHit.distance),
    };
  }
}
