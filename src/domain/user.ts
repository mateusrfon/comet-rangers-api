import { randomUUID } from "crypto";
import { Connection } from "../network/connection";
import WebSocket = require("ws");
import { Room } from "./room";
import { ClientMessage, ServerMessage } from "../network/protocol";
import { RoomManager } from "./roomManager";
import { Player } from "../game/entities/player";

export class User {
  public readonly id = randomUUID();
  public room?: Room | undefined;
  public player?: Player | undefined;
  public roomManager: RoomManager;
  public connection: Connection;
  public ready = false;

  constructor(ws: WebSocket, roomManager: RoomManager) {
    this.roomManager = roomManager;
    this.connection = new Connection(ws, this.handleMessage);

    this.connection.onClose(() => {
      console.log(`Client disconnected: ${this.id}`);
    });

    this.connection.send({
      type: "user_connected",
      userId: this.id,
    });
  }

  reconnect(ws: WebSocket) {
    this.connection.close();
    this.connection = new Connection(ws, this.handleMessage);
    console.log(`Client reconnected: ${this.id}`);
  }

  send(data: ServerMessage) {
    this.connection.send(data);
  }

  // Handle incoming messages from the client
  private handleMessage = (msg: ClientMessage) => {
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
        this.player?.inputQueue.push(msg);
        break;
      }

      default: {
        console.warn(`Unknown message from ${this.id}:`, msg);
        break;
      }
    }
  };
}
