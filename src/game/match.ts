import { GameEngine } from "./engine";
import { User } from "../domain/user";
import { GameState, State } from "./state";

export class Match {
  private engine: GameEngine;
  private world_width = 1920;
  private world_height = 1080;

  constructor(readonly users: User[]) {
    this.engine = new GameEngine(this, this.world_width, this.world_height);
  }

  start() {
    for (const user of this.users) {
      user.getConnection().send({
        type: "game_started",
        worldHeight: this.world_height,
        worldWidth: this.world_width,
      });
    }
    this.engine.start();
  }

  broadcast(data: { type: "game_state"; state: GameState }) {
    for (const user of this.users) {
      user.getConnection().send(data);
    }
  }
}
