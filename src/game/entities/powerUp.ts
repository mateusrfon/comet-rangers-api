import { Entity, PowerUpType } from "./entity";

export class PowerUp extends Entity {
  public type: PowerUpType;

  constructor(
    type: PowerUpType,
    x: number,
    y: number,
    size: number,
    private createdAt: number,
    private lifetime = 600,
  ) {
    super(type, x, y, size);
    this.type = type;
  }

  isExpired(tick: number) {
    const timeSinceBorn = tick - this.createdAt;
    return timeSinceBorn >= this.lifetime;
  }

  consume(): void {
    super.setIsAlive(false);
  }
}
