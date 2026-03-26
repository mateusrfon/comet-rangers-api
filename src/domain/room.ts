import { randomUUID } from "crypto";
import { Match } from "../game/match";
import { User } from "./user";

export class Room {
  id: string;
  users: User[] = [];
  host: User;

  constructor(host: User) {
    this.id = randomUUID(); // Room id
    this.host = host;
    this.users.push(host);
  }

  addPlayer(player: User) {
    if (this.users.length >= 4) return false;
    this.users.push(player);
    return true;
  }

  removeUser(userId: string) {
    const index = this.users.findIndex((p) => p.id === userId);
    if (index === -1) return;

    const [player] = this.users.splice(index, 1);
    player!.room = undefined;

    return player;
  }

  start() {
    if (this.users.length === 0) return;
    const match = new Match(this.users);
    match.start();
  }
}
