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

export const GAME_VERSION = '2.0';

export const DIFFICULTY_SETTINGS = {
  easy: {
    energyDrain: 0.7,
    baseMoveInterval: 6000, // 6 секунд базовый интервал
    moveChance: 0.18,
    aggressionGrowth: 0.3,
    maxAggression: 7,
    smartMovement: 0.4, // 40% умных ходов
    doorSwitchSpeed: 0.5, // чуть быстрее переключается
    lateGameCalm: 0.7, // меньше успокоения
    huntingMode: 0.15, // 15% шанс режима охоты
    trapChance: 0.1 // 10% ловушек
  },
  medium: {
    energyDrain: 1.2,
    baseMoveInterval: 3500, // 3.5 секунды базовый интервал
    moveChance: 0.35,
    aggressionGrowth: 0.6,
    maxAggression: 10,
    smartMovement: 0.65, // 65% умных ходов
    doorSwitchSpeed: 0.75, // быстрее переключается
    lateGameCalm: 0.5, // меньше успокоения
    huntingMode: 0.25, // 25% шанс режима охоты
    trapChance: 0.2 // 20% ловушек
  },
  hard: {
    energyDrain: 1.6,
    baseMoveInterval: 1200, // 1.2 секунды - БЕЗУМИЕ!
    moveChance: 0.65,
    aggressionGrowth: 1.2,
    maxAggression: 20,
    smartMovement: 0.95, // 95% умных ходов - почти всегда умный
    doorSwitchSpeed: 0.98, // мгновенно переключается
    lateGameCalm: 0.15, // почти не успокаивается
    huntingMode: 0.4, // 40% шанс режима охоты
    trapChance: 0.35 // 35% ловушек
  }
};