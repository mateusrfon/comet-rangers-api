import { Entity } from "./entity";

export class Bullet extends Entity {
  lifetime = 1;
  prevX: number;
  prevY: number;
  ownerId: string;

  // initial tick to prevent self hit on shoot but allow after travel

  constructor(
    ownerId: string,
    x: number,
    y: number,
    vx: number,
    vy: number,
    angle: number,
    speed: number,
  ) {
    super("bullet", x, y, 2);

    this.ownerId = ownerId;

    this.prevX = x;
    this.prevY = y;

    this.vx = vx * 0.5 + Math.cos(angle) * speed;
    this.vy = vy * 0.5 + Math.sin(angle) * speed;
  }

  takeDamage(): void {
    super.setIsAlive(false);
  }
}
