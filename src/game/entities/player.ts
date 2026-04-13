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
type PolygonCollider = {
  type: "polygon";
  points: { x: number; y: number }[];
};

type CircleCollider = {
  type: "circle";
  radius: number;
};

type Collider = PolygonCollider | CircleCollider;

export class Player extends Entity {
  id: string;
  public inputQueue: InputState = [];
  public lastInput: Input = {
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false,
    powerUp: false,
  };

  life: number;
  score = 0;
  private readonly spawn: { x: number; y: number; angle: number };

  angle: number;
  rotationSpeed: number;
  acceleration: number;

  friction = 0.99;

  private shootCooldown = 6; // 0.1s * 60 (tick_rate)
  private lastShot = this.shootCooldown * -1;

  respawnCooldown = 180; // 3s * tick_rate
  deathTick = 0;

  public angularVelocity = 0;

  private localVertices: { x: number; y: number }[];

  public collider: Collider;
  public shield = { active: false, duration: 0, size: 0 };

  constructor({
    id,
    x,
    y,
    angle = 0,
    accel = 0.1,
    rot = Math.PI / 60,
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
    this.collider = { type: "polygon", points: this.localVertices };
  }

  public registerLastShot(tick: number) {
    this.lastShot = tick;
  }

  public canShoot(tick: number): boolean {
    if (!this.getIsAlive()) return false;
    const timeSinceLastShot = tick - this.lastShot;
    return timeSinceLastShot >= this.shootCooldown;
  }

  public canRespawn(tick: number): boolean {
    if (this.getIsAlive()) return false;
    const dt = tick - this.deathTick;
    return dt >= this.respawnCooldown;
  }

  public getWorldVertices(): { x: number; y: number }[] {
    const cos = Math.cos(this.angle);
    const sin = Math.sin(this.angle);
    return this.localVertices.map((v) => ({
      x: this.x + v.x * cos - v.y * sin,
      y: this.y + v.x * sin + v.y * cos,
    }));
  }

  public takeDamage(tick: number) {
    if (this.shield.active) {
      // emit shield damage event
      return;
    }
    this.deathTick = tick;
    super.setIsAlive(false);
  }

  public removeLife() {
    this.life--;
  }

  public respawn() {
    super.setIsAlive(true);
  }

  public resetToSpawn() {
    this.x = this.spawn.x;
    this.y = this.spawn.y;
    this.angle = this.spawn.angle;
    this.vx = 0;
    this.vy = 0;
    this.angularVelocity = 0;
  }

  public addShield(shield: { duration: number; size: number }) {
    this.shield = {
      active: false,
      duration: shield.duration,
      size: shield.size,
    };
  }

  public activateShield() {
    if (this.shield.duration <= 0) return;
    this.shield.active = true;
    this.collider = { type: "circle", radius: this.shield.size };
  }

  public deactivateShield() {
    this.shield.active = false;
    this.collider = { type: "polygon", points: this.localVertices };
  }
}
