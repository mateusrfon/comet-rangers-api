import { Entity } from "./entity";

export class Bullet extends Entity {
  lifetime = 1;
  prevX: number;
  prevY: number;
  ownerId: number;

  constructor(
    ownerId: number,
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

  update({ delta }: { delta: number }) {
    this.lifetime -= delta;
    if (this.lifetime <= 0) {
      this.isAlive = false;
      return;
    }
    this.prevX = this.x;
    this.prevY = this.y;

    this.x += this.vx;
    this.y += this.vy;
  }
}
