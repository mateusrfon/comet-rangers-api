import { Input, InputState } from "../types";
import { Entity } from "./entity";

type PlayerConfig = {
  id: string;
  x: number;
  y: number;
  angle?: number;
  accel?: number;
  rot?: number;
  life?: number;
};

export class Player extends Entity {
  id: string;
  public inputQueue: InputState = new Map();
  public lastInput: Input = {
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false,
  };

  life: number;
  score = 0;
  private readonly spawn: { x: number; y: number; angle: number };

  angle: number;
  rotationSpeed: number;
  acceleration: number;

  friction = 0.99;

  shootCooldown = 6; // 0.1s * tick_rate
  lastShot = this.shootCooldown * -1;

  respawnCooldown = 3;
  currentRespawnCooldown = this.respawnCooldown;

  public angularVelocity = 0;

  private localVertices: { x: number; y: number }[];

  constructor({
    id,
    x,
    y,
    angle = 0,
    accel = 0.1,
    rot = 0.05,
    life = 5,
  }: PlayerConfig) {
    super("player", x, y, 20);
    this.id = id;
    this.x = x;
    this.y = y;
    this.life = life;
    this.angle = angle;
    this.acceleration = accel;
    this.rotationSpeed = rot;
    this.localVertices = [
      { x: this.size, y: 0 }, // tip
      { x: -this.size, y: this.size / 1.5 }, // left
      { x: -this.size, y: -this.size / 1.5 }, // right
    ];
    this.spawn = { x, y, angle };
  }

  canShoot(tick: number): boolean {
    const timeSinceLastShot = tick - this.lastShot;
    return timeSinceLastShot >= this.shootCooldown;
  }

  getWorldVertices(): { x: number; y: number }[] {
    const cos = Math.cos(this.angle);
    const sin = Math.sin(this.angle);
    return this.localVertices.map((v) => ({
      x: this.x + v.x * cos - v.y * sin,
      y: this.y + v.x * sin + v.y * cos,
    }));
  }

  // go to collisionSystem
  public applyImpulse(ix: number, iy: number, hitX: number, hitY: number) {
    // impulso linear
    this.vx += ix; // Should divide by mass if we had it, but we'll assume mass = 1 for simplicity
    this.vy += iy;

    // torque simplificado
    const rx = hitX - this.x;
    const ry = hitY - this.y;

    const torque = rx * iy - ry * ix;
    this.angularVelocity += torque * 0.001; // Fine adjustment factor for feel
  }

  // go to respawnSystem
  respawn() {
    this.x = this.spawn.x;
    this.y = this.spawn.y;
    this.angle = this.spawn.angle;
    this.vx = 0;
    this.vy = 0;
    this.angularVelocity = 0;
    this.isAlive = true;
    this.life -= 1;
  }
}
