import { WebSocketServer, WebSocket } from "ws";
import { RoomManager } from "../domain/roomManager";
import { IncomingMessage } from "http";
import { User } from "../domain/user";

export class Server {
  private wsServer: WebSocketServer;
  private roomManager: RoomManager;

  private users = new Map<string, User>();

  constructor(port: number) {
    this.wsServer = new WebSocketServer({ port });
    this.roomManager = new RoomManager();

    console.log(`Server running on ws://localhost:${port}`);

    this.wsServer.on("connection", (ws, req) => {
      const params = this.getParams(req);

      const user = this.setUser(ws, params);
      console.log(`Client connected: ${user.id}`);
    });
  }

  setUser(ws: WebSocket, params: { userId?: string; roomId?: string }) {
    // Set user connection
    let user = params.userId ? this.users.get(params.userId) : undefined;
    if (user) {
      user.reconnect(ws);
    } else {
      // New user connection
      user = new User(ws, this.roomManager);
      this.users.set(user.id, user);
    }
    return user;
  }

  getParams(req: IncomingMessage): { [key: string]: string } {
    const query = req.url?.split("?")[1] ?? "";
    const result = Object.fromEntries(new URLSearchParams(query));
    return result;
  }
}
