import { Asteroid } from "../entities/asteroid";
import { Bullet } from "../entities/bullet";
import { Player } from "../entities/player";
import { State } from "../state";

export type CollisionEvent = {
  type: "bullet-player" | "bullet-asteroid";
  bullet: Bullet;
  player?: Player;
  asteroid?: Asteroid;
  hitX: number;
  hitY: number;
};

export class CollisionSystem {
  update(state: State): CollisionEvent[] {
    const events: CollisionEvent[] = [];

    // detectar e pushar eventos

    return events;
  }
}
