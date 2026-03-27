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
      { x: 0, y: 200, size: 80, speed: 10 },
      { x: 800, y: 0, size: 80, speed: 10 },
      { x: 400, y: 0, size: 80, speed: 10 },
      { x: 1920, y: 500, size: 80, speed: 10 },
    ],
  },
];
