import { WebSocket } from "ws";
import {
  ClientMessage,
  decodeMessage,
  encodeMessage,
  ServerMessage,
} from "./protocol";

export class Connection {
  constructor(
    private socket: WebSocket,
    readonly params: {
      [key: string]: string;
    },
  ) {}

  send(data: ServerMessage) {
    this.socket.send(encodeMessage(data));
  }

  onClose(cb: () => void) {
    this.socket.on("close", cb);
  }

  onMessage(cb: (msg: ClientMessage | null) => void) {
    this.socket.on("message", (data) => {
      const msg = decodeMessage(data.toString());
      cb(msg);
    });
  }

  close() {
    if (this.socket.readyState < this.socket.CLOSING) {
      this.socket.close();
    }
  }

  isReady() {
    return this.socket.readyState === this.socket.OPEN;
  }
}
