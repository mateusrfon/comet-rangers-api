import type { Asteroid } from "./entities/asteroid";
import type { Bullet } from "./entities/bullet";
import type { Player } from "./entities/player";

export type ClientState = {
  tick: number;
  players: Player[];
  bullets: Bullet[];
  asteroids: Asteroid[];
  level: number;
};

export class State {
  tick = 0;

  players: Map<string, Player> = new Map(); // convert to Array.from(state.players.values()) is better for JSON.stringify apparently
  bullets: Bullet[] = [];
  asteroids: Asteroid[] = [];

  level: number = 0;
  // gameOver = false;
}

// to client
/*
{
  tick: number
  players: {id,x,y,rotation}[]
  bullets: {x,y,vx,vy}[]
  asteroids: {x,y}[]
}
   */
