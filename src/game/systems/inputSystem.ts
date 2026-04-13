import { State } from "../state";

export class InputSystem {
  constructor(private state: State) {}

  public updateLastInput() {
    for (const player of this.state.players.values()) {
      const input = player.inputQueue.shift();

      if (input) {
        console.log(input);
        player.lastInput = input;
      }
    }
  }
}
