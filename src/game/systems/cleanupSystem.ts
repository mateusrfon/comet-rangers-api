import { State } from "../state";

export class CleanupSystem {
  constructor(private state: State) {}
  checkLifetime() {
    this.state.bullets.forEach((b) => {
      if (b.isExpired(this.state.tick)) {
        b.setIsAlive(false);
      }
    });

    this.state.powerUps.forEach((p) => {
      if (p.isExpired(this.state.tick)) {
        p.setIsAlive(false);
      }
    });
  }

  cleanupEntities() {
    this.state.bullets.forEach((b) => {
      if (!b.getIsAlive()) {
        this.state.bullets.splice(this.state.bullets.indexOf(b), 1);
      }
    });

    this.state.asteroids.forEach((a) => {
      if (!a.getIsAlive()) {
        this.state.asteroids.splice(this.state.asteroids.indexOf(a), 1);
      }
    });

    this.state.powerUps.forEach((p) => {
      if (!p.getIsAlive()) {
        this.state.powerUps.splice(this.state.powerUps.indexOf(p), 1);
      }
    });
  }
}
