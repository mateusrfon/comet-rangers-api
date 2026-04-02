import { Room } from "./room";
import { User } from "./user";

export class RoomManager {
  private rooms = new Map<string, Room>();

  public createRoom(host: User) {
    const room = new Room(host);
    host.roomId = room.id;
    this.rooms.set(room.id, room);
    return room.id;
  }

  public joinRoom(roomId: string, player: User) {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    return room.addPlayer(player);
  }

  public leaveRoom(roomId: string, userId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.removeUser(userId);

    if (room.users.length === 0) {
      this.rooms.delete(room.id); // delete room if no players left
      return;
    }
  }

  startRoom(roomId: string, userId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    if (room.host.id !== userId) return false; // Only host can start

    room.startMatch();
    return true;
  }

  endMatch(roomId: string, userId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    if (room.host.id !== userId) return false; // Only host can end
    return room.endMatch();
  }
}
