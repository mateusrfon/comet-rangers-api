import { Asteroid } from "./entities/asteroid";

export type LevelDefinition = {
  id: number;
  asteroidCount: number;
  asteroidSpawns: { x: number; y: number; size: number; speed: number }[];
};

export const LEVELS: LevelDefinition[] = [
  {
    id: 0,
    asteroidCount: 4,
    asteroidSpawns: [
      { x: 200, y: 200, size: 80, speed: 10 },
      { x: 800, y: 300, size: 40, speed: 30 },
      { x: 400, y: 700, size: 20, speed: 90 },
      { x: 1000, y: 500, size: 10, speed: 270 },
    ],
  },
];
