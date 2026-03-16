const WebSocket = require("ws");

let ws = null;
let userId = null;

function connect(existingUserId) {
  const query = existingUserId ? `?userId=${existingUserId}` : "";
  ws = new WebSocket(`ws://localhost:8080${query}`);

  ws.on("open", () => {
    console.log(
      "Connected",
      existingUserId ? `(reconnected with userId: ${existingUserId})` : "",
    );
  });

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());
      console.log("Server ->", msg);

      if (msg.userId && !userId) userId = msg.userId;
    } catch {
      console.log("Server ->", data.toString());
    }
  });

  ws.on("close", () => console.log("Disconnected from server"));
  ws.on("error", (err) => console.error("WS Error:", err.message));
}

function send(data) {
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  } else {
    console.log("Socket not open");
  }
}

process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  const line = chunk.toString().trim();
  const args = line.split(" ");

  switch (args[0]) {
    case "connect":
      connect();
      break;

    case "reconnect":
      if (!userId) return console.log("No userId available. Connect first.");
      connect(userId);
      break;

    case "create_room":
      send({ type: "create_room" });
      break;

    case "start_game":
      send({ type: "start_game" });
      break;

    case "input":
      const input = {
        type: "input",
        up: false,
        down: false,
        left: false,
        right: false,
        shoot: false,
      };

      args.slice(1).forEach((arg) => {
        const [key, value] = arg.split("=");
        if (key in input) input[key] = value === "true";
      });

      console.log(input);

      send(input);
      break;

    case "close":
      ws?.close();
      break;

    case "exit":
      ws?.close();
      process.exit(0);

    default:
      console.log(
        "Commands: connect, reconnect, create_room, start_game, input, close, exit",
      );
  }
});

console.log(
  "Commands: connect, reconnect, create_room, start_game, input, close, exit",
);
