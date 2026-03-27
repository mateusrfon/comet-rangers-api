import { Asteroid } from "./entities/asteroid";
import { Player } from "./entities/player";
import { LevelDefinition, LEVELS } from "./levels";
import { Match } from "./match";
import { State } from "./state";
import { CleanupSystem } from "./systems/cleanupSystem";
import { CollisionSystem } from "./systems/collisionSystem";
import { PhysicsSystem } from "./systems/physicsSystem";
import { ShootingSystem } from "./systems/shootingSystem";
import { SpawnSystem } from "./systems/spawnSystem";

export class GameEngine {
  private state = new State();

  private running = false;
  private lastTime = 0;
  private accumulator = 0;

  private tick_rate = 60;
  private tick_interval = 1000 / this.tick_rate; // ms interval of 60hz
  private physicsSystem: PhysicsSystem;
  private collisionSystem: CollisionSystem;
  private cleanupSystem: CleanupSystem;
  private spawnSystem: SpawnSystem;
  private shootingSystem = new ShootingSystem(this.state);

  constructor(
    private match: Match,
    private worldWidth: number,
    private worldHeight: number,
  ) {
    this.physicsSystem = new PhysicsSystem(this.state, worldWidth, worldHeight);
    this.collisionSystem = new CollisionSystem(
      this.state,
      this.worldWidth,
      this.worldHeight,
    );
    this.cleanupSystem = new CleanupSystem(this.state);
    this.spawnSystem = new SpawnSystem(this.state);
  }

  start() {
    if (this.running === true) return;
    this.spawnSystem.spawnPlayers(
      this.match.users,
      this.worldWidth,
      this.worldHeight,
    );
    this.spawnSystem.spawnLevel(LEVELS[this.state.level]!);
    this.running = true;
    this.lastTime = Date.now();
    this.loop();
  }

  private loop() {
    if (!this.running) return;

    const now = Date.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    this.accumulator += delta;

    while (this.accumulator >= this.tick_interval) {
      this.state.tick++;
      this.update();
      this.accumulator -= this.tick_interval;
    }

    setImmediate(() => this.loop());
  }

  private update() {
    // 1. Update physics
    this.physicsSystem.updatePositions();
    this.shootingSystem.shootBullets();
    // 2. Detect and resolve collisions
    const collisions = this.collisionSystem.getCollisions();
    this.collisionSystem.resolveCollisions(collisions);
    // 3. Spawn entities
    this.spawnSystem.splitAsteroid();
    this.spawnSystem.respawnPlayers();
    // 4. Cleanup entities
    this.cleanupSystem.checkBulletLifetime();
    this.cleanupSystem.cleanupEntities();
    // 5. Broadcast
    this.match.broadcast({
      type: "game_state",
      state: this.state.getStateDTO(),
    });
  }

  stop() {
    this.running = false;
  }
}
