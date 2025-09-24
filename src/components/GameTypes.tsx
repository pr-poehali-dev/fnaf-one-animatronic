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

export const GAME_VERSION = '1.4';

export const DIFFICULTY_SETTINGS = {
  easy: {
    energyDrain: 0.6,
    baseMoveInterval: 8000, // 8 секунд базовый интервал
    moveChance: 0.12,
    aggressionGrowth: 0.2,
    maxAggression: 6,
    smartMovement: 0.3, // 30% умных ходов
    doorSwitchSpeed: 0.4, // медленно переключается между дверьми
    lateGameCalm: 0.8 // сильно успокаивается к утру
  },
  medium: {
    energyDrain: 1.0,
    baseMoveInterval: 5000, // 5 секунд базовый интервал
    moveChance: 0.25,
    aggressionGrowth: 0.4,
    maxAggression: 8,
    smartMovement: 0.5, // 50% умных ходов
    doorSwitchSpeed: 0.6, // средне переключается
    lateGameCalm: 0.6 // средне успокаивается
  },
  hard: {
    energyDrain: 1.3,
    baseMoveInterval: 2000, // 2 секунды базовый интервал  
    moveChance: 0.45,
    aggressionGrowth: 0.8,
    maxAggression: 15,
    smartMovement: 0.85, // 85% умных ходов
    doorSwitchSpeed: 0.95, // очень быстро переключается
    lateGameCalm: 0.3 // слабо успокаивается
  }
};