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
    private handleMessage: (msg: ClientMessage) => void,
  ) {
    socket.on("message", (data) => {
      const msg = decodeMessage(data.toString());
      this.handleMessage(msg);
    });
  }

  send(data: ServerMessage) {
    this.socket.send(encodeMessage(data));
  }

  onClose(cb: () => void) {
    this.socket.on("close", cb);
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
