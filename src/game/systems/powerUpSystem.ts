import { PowerUpType } from "../entities/entity";
import { Player } from "../entities/player";
import { State } from "../state";

export class PowerUpSystem {
  constructor(private state: State) {}

  public addShield(player: Player, type: PowerUpType) {
    player.addShield({ duration: 600, size: 40 });
  }

  public usePowerUp() {
    for (const player of this.state.players.values()) {
      // remove 1 tick if active
      if (player.shield.active) {
        player.shield.duration--;
        if (player.shield.duration <= 0) player.deactivateShield();
      }

      if (player.lastInput.powerUp && !player.shield.active) {
        player.activateShield();
      }

      if (!player.lastInput.powerUp && player.shield.active) {
        player.deactivateShield();
      }

      // use power up / remove duration
    }
  }
}
