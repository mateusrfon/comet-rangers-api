import { randomUUID } from "crypto";
import { Match } from "../game/match";
import { User } from "./user";
import { ServerMessage } from "../network/protocol";

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
    this.broadcast({
      type: "player_joined",
      data: {
        room: {
          hostId: this.host.id,
          players: this.users.map((u, i) => ({
            id: u.id,
            name: `Player ${i + 1}`,
          })),
        },
      },
    });
    return true;
  }

  removeUser(userId: string) {
    const index = this.users.findIndex((p) => p.id === userId);
    if (index === -1) return;

    const [player] = this.users.splice(index, 1);
    player!.roomId = undefined;
    player!.send({ type: "room_left", data: { roomId: this.id } });

    if (this.users.length === 0) return;

    if (this.host.id === player!.id) {
      this.host = this.users[0]!; // Assign new host if needed
    }

    this.broadcast({
      type: "player_left",
      data: {
        room: {
          hostId: this.host.id,
          players: this.users.map((u, i) => ({
            id: u.id,
            name: `Player ${i}`,
          })),
        },
      },
    });

    return player;
  }

  public broadcast(data: ServerMessage) {
    for (const user of this.users) {
      user.send(data);
    }
  }

  start() {
    if (this.users.length === 0) return;
    const match = new Match(this, this.users);
    match.start();
  }
}
