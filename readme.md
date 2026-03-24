game/
├── engine.ts
├── match.ts
├── state.ts
├── entities/
│ ├── player.ts
│ ├── bullet.ts
│ └── asteroid.ts
├── systems/
│ ├── physics.ts
│ ├── shooting.ts
│ └── collision.ts

Client input
↓
WebSocket message
↓
Match receives
↓
Engine.queueInput()
↓
Tick loop
↓
Engine processes inputs
↓
Systems modify GameState
↓
Snapshot built
↓
Match.broadcast()

{
"type": "input",
"tick": 152,
"up": true,
"down": false,
"left": false,
"right": true,
"shoot": true
}

// Front -> Play -> Create/Join -> On Join, search by id/name on list -> Connect to Websocket
