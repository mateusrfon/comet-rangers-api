import { Asteroid } from "./entities/asteroid";
import { Player } from "./entities/player";
import { LevelDefinition, LEVELS } from "./levels";
import { Match } from "./match";
import { State } from "./state";
import { PhysicsSystem } from "./systems/physicsSystem";
import { ShootingSystem } from "./systems/shootingSystem";

export class GameEngine {
  private state = new State();

  private running = false;
  private lastTime = 0;
  private accumulator = 0;

  private tick_rate = 60;
  private tick_interval = 1000 / this.tick_rate; // ms interval of 60hz
  private physicsSystem: PhysicsSystem;
  private shootingSystem = new ShootingSystem(this.state);

  constructor(
    private match: Match,
    private world_width: number,
    private world_height: number,
  ) {
    this.physicsSystem = new PhysicsSystem(
      this.state,
      world_width,
      world_height,
    );
  }

  start() {
    this.spawnPlayers();
    this.spawnLevel(LEVELS[this.state.level]!);
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

  private spawnPlayers() {
    const offset = 80;

    const positions = [
      { x: offset, y: offset },
      { x: this.world_width - offset, y: offset },
      { x: offset, y: this.world_height - offset },
      { x: this.world_width - offset, y: this.world_height - offset },
    ];

    let i = 0;

    this.match.users.forEach((user) => {
      if (i >= 4) return;

      const pos = positions[i];

      const player = new Player({
        id: user.id,
        x: pos!.x,
        y: pos!.y,
      });

      user.player = player;
      this.state.players.set(player.id, player);

      i++;
    });
  }

  private spawnLevel(level: LevelDefinition) {
    for (const spawn of level.asteroidSpawns) {
      const asteroid = new Asteroid(spawn.x, spawn.y, spawn.size, spawn.speed);
      this.state.asteroids.push(asteroid);
    }
  }

  private update() {
    // 1. Update physics (with inputs from player as well)
    this.physicsSystem.updatePositions();
    this.shootingSystem.shootBullets();
    // 2. Detect collisions
    // 3. Cleanup entities
    // 4. Build snapshot
    // 5. Broadcast
    this.match.broadcast({
      type: "game_state",
      state: { ...this.state, players: [...this.state.players.values()] },
    });
  }

  stop() {
    this.running = false;
  }
}
