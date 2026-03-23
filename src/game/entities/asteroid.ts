import { Entity } from "./entity";

export class Asteroid extends Entity {
  speed: number;
  readonly angle: number;

  constructor(
    x: number,
    y: number,
    size: number,
    speed: number,
    spawnAngle?: number | undefined,
  ) {
    super("asteroid", x, y, size);

    this.angle = spawnAngle || Math.random() * Math.PI * 2;

    this.speed = speed;
    this.vx = Math.cos(this.angle) * speed;
    this.vy = Math.sin(this.angle) * speed;
  }

  takeDamage(): void {
    super.setIsAlive(false);
  }

  shouldSplit(): boolean {
    if (!this.getIsAlive() && this.size > 10) {
      return true;
    }
    return false;
  }
}
