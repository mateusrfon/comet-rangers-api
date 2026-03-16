import { Entity } from "./entity";

export class Asteroid extends Entity {
  speed: number;

  constructor(x: number, y: number, size: number, speed: number) {
    super("asteroid", x, y, size);

    const angle = Math.random() * Math.PI * 2;

    this.speed = speed;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  update({ delta }: { delta: number }): void {
    this.x += this.vx * delta;
    this.y += this.vy * delta;
  }
}
