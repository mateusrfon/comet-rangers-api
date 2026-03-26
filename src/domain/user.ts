import { randomUUID } from "crypto";
import { Connection } from "../network/connection";
import { Room } from "./room";
import { ClientMessage, ServerMessage } from "../network/protocol";
import { RoomManager } from "./roomManager";
import { Player } from "../game/entities/player";
import { Input } from "../game/types";

export class User {
  public readonly id = randomUUID();
  public room?: Room | undefined;
  public player?: Player | undefined;
  public roomManager: RoomManager;
  public ready = false;

  constructor(
    private _connection: Connection,
    roomManager: RoomManager,
  ) {
    this._connection.onMessage(this.handleMessage);
    this.roomManager = roomManager;

    this._connection.onClose(() => {
      console.log(`Client disconnected: ${this.id}`);
    });

    this._connection.send({
      type: "user_connected",
      userId: this.id,
    });
  }

  reconnect(connection: Connection) {
    this._connection.close();
    this._connection = connection;
    this._connection.onMessage(this.handleMessage);
    console.log(`Client reconnected: ${this.id}`);
  }

  send(data: ServerMessage) {
    this._connection.send(data);
  }

  private isSameInput(a: Input, b: Input): boolean {
    return (
      a.up === b.up &&
      a.down === b.down &&
      a.left === b.left &&
      a.right === b.right &&
      a.shoot === b.shoot
    );
  }

  // Handle incoming messages from the client
  private handleMessage = (msg: ClientMessage | null) => {
    if (msg === null) return;
    switch (msg.type) {
      case "create_room": {
        const roomId = this.roomManager.createRoom(this);
        this.send({ type: "room_created", roomId });
        break;
      }

      case "join_room": {
        const joined = this.roomManager.joinRoom(msg.roomId, this);
        this.send(
          joined
            ? { type: "room_joined", roomId: msg.roomId }
            : { type: "room_not_found" },
        );
        break;
      }

      case "leave_room": {
        this.roomManager.leaveRoom(this);
        break;
      }

      case "start_game": {
        if (this.room) {
          this.roomManager.startRoom(this);
        }
        break;
      }

      case "input": {
        if (!this.player) break;
        const lastInput = this.player.lastInput;
        if (!this.isSameInput(lastInput, msg)) {
          this.player.inputQueue.push({
            up: msg.up,
            down: msg.down,
            right: msg.right,
            left: msg.left,
            shoot: msg.shoot,
          });
        }
        break;
      }

      default: {
        console.warn(`Unknown message from ${this.id}:`, msg);
        break;
      }
    }
  };
}
