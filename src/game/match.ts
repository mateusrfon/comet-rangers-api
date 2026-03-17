import { GameEngine } from "./engine";
import { User } from "../domain/user";
import { ClientState, State } from "./state";

export class Match {
  private engine: GameEngine;
  private world_width = 2000;
  private world_height = 1200;

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

  broadcast(data: { type: "broadcast"; state: ClientState }) {
    for (const user of this.users) {
      user.getConnection().send(data);
    }
  }
}
