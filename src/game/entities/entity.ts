export type EntityType = "player" | "bullet" | "asteroid";

export abstract class Entity {
  readonly type: EntityType;
  x: number;
  y: number;
  vx = 0;
  vy = 0;
  size: number;
  private isAlive = true;

  constructor(type: EntityType, x: number, y: number, size: number) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.size = size;
  }

  setIsAlive(isAlive: boolean) {
    this.isAlive = isAlive;
  }

  getIsAlive() {
    return this.isAlive;
  }
}
