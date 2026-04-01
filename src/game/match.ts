import { GameEngine } from "./engine";
import { User } from "../domain/user";
import { GameStateDTO } from "../network/protocol";
import { Room } from "../domain/room";

export class Match {
  private engine: GameEngine;
  private worldWidth = 1920;
  private worldHeight = 1080;

  constructor(
    public room: Room,
    readonly users: User[],
  ) {
    this.engine = new GameEngine(this, this.worldWidth, this.worldHeight);
  }

  start() {
    this.room.broadcast({
      type: "game_started",
      data: { worldHeight: this.worldHeight, worldWidth: this.worldWidth },
    });
    this.engine.start();
  }
}
