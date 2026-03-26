import { Room } from "./room";
import { User } from "./user";

export class RoomManager {
  private rooms = new Map<string, Room>();

  createRoom(host: User) {
    const room = new Room(host);
    host.room = room;
    this.rooms.set(room.id, room);
    return room.id;
  }

  joinRoom(roomId: string, player: User) {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    return room.addPlayer(player);
  }

  leaveRoom(user: User) {
    const room = user.room;
    if (!room) return;

    const leftUser = room.removeUser(user.id);
    leftUser?.send({ type: "room_left", roomId: room.id });

    if (room.users.length === 0) {
      this.rooms.delete(room.id); // delete room if no players left
      return;
    }

    for (const user of room.users) {
      user.send({
        type: "player_left",
        playerId: user.id,
      });
    }

    if (room.host.id === user.id) {
      room.host = room.users[0]!; // Assign new host if needed
    }
  }

  startRoom(player: User) {
    const room = player.room;
    if (!room) return false;

    if (room.host.id !== player.id) return false; // Only host can start

    room.start();
    return true;
  }
}
