import { GameEngine } from "./engine";
import { User } from "../domain/user";
import { GameStateDTO } from "../network/protocol";

export class Match {
  private engine: GameEngine;
  private worldWidth = 1920;
  private worldHeight = 1080;

  constructor(readonly users: User[]) {
    this.engine = new GameEngine(this, this.worldWidth, this.worldHeight);
  }

  start() {
    for (const user of this.users) {
      user.getConnection().send({
        type: "game_started",
        worldHeight: this.worldHeight,
        worldWidth: this.worldWidth,
      });
    }
    this.engine.start();
  }

  broadcast(data: { type: "game_state"; state: GameStateDTO }) {
    for (const user of this.users) {
      user.getConnection().send(data);
    }
  }
}
