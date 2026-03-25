import { Bullet } from "../entities/bullet";
import { State } from "../state";

export class ShootingSystem {
  constructor(private state: State) {}

  public shootBullets() {
    for (const player of this.state.players.values()) {
      if (player.lastInput.shoot && player.canShoot(this.state.tick)) {
        const playerTip = player.getWorldVertices()[0]!;
        const bullet = new Bullet(
          player.id,
          playerTip.x,
          playerTip.y,
          player.vx,
          player.vy,
          player.angle,
          10,
          this.state.tick,
        );
        this.state.bullets.push(bullet);
        player.registerLastShot(this.state.tick);
      }
    }
  }
}
