export interface GameState {
  energy: number;
  leftDoorClosed: boolean;
  rightDoorClosed: boolean;
  currentCamera: number;
  fredyLocation: number;
  fredyAggression: number;
  gameTime: string;
  gameActive: boolean;
  gameOver: boolean;
  victory: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  lastFredyMove: number;
  fredyStunned: boolean;
  hour: number;
}

export const CAMERA_LOCATIONS = [
  'Главная сцена',
  'Зал', 
  'Кухня',
  'Левый коридор',
  'Правый коридор',
  'Левая дверь',
  'Правая дверь'
];

export const DIFFICULTY_SETTINGS = {
  easy: { moveChance: 0.15, energyDrain: 0.8, aggressionGrowth: 0.5 },
  medium: { moveChance: 0.25, energyDrain: 1.0, aggressionGrowth: 1.0 },
  hard: { moveChance: 0.35, energyDrain: 1.3, aggressionGrowth: 1.5 }
};