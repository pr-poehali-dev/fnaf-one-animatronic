import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

import { GameState, DIFFICULTY_SETTINGS, GAME_VERSION } from '@/components/GameTypes';
import { useGameAudio } from '@/components/GameAudio';
import { useGameLogic } from '@/components/GameLogic';
import { CameraPanel } from '@/components/CameraPanel';
import { ControlPanel } from '@/components/ControlPanel';
import { SecurityMonitor } from '@/components/SecurityMonitor';
import { GameOverScreen } from '@/components/GameOverScreen';
import { VictoryScreen } from '@/components/VictoryScreen';
import { StartScreen } from '@/components/StartScreen';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>({
    energy: 100,
    leftDoorClosed: false,
    rightDoorClosed: false,
    currentCamera: 0,
    fredyLocation: 0,
    fredyAggression: 1,
    gameTime: '12:00 AM',
    gameActive: false,
    gameOver: false,
    victory: false,
    difficulty: 'medium',
    lastFredyMove: Date.now(),
    fredyStunned: false,
    hour: 0
  });

  const { playSound } = useGameAudio();

  // Используем игровую логику
  useGameLogic({ gameState, setGameState, playSound });

  const startGame = (difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    setGameState(prev => ({
      ...prev,
      gameActive: true,
      gameOver: false,
      victory: false,
      energy: 100,
      fredyLocation: 0,
      fredyAggression: 1,
      gameTime: '12:00 AM',
      difficulty,
      lastFredyMove: Date.now(),
      fredyStunned: false,
      hour: 0,
      leftDoorClosed: false,
      rightDoorClosed: false
    }));
    playSound('gameStart');
  };

  const toggleLeftDoor = () => {
    if (!gameState.gameActive || gameState.gameOver) return;
    setGameState(prev => {
      const newState = { ...prev, leftDoorClosed: !prev.leftDoorClosed };
      
      // Если Фредди у левой двери и мы закрываем дверь, он отступает
      if (!prev.leftDoorClosed && prev.fredyLocation === 5) {
        newState.fredyStunned = true;
        newState.fredyLocation = Math.max(0, prev.fredyLocation - 2);
        setTimeout(() => {
          setGameState(s => ({ ...s, fredyStunned: false }));
        }, 3000);
      }
      
      return newState;
    });
    playSound('doorSlam');
  };

  const toggleRightDoor = () => {
    if (!gameState.gameActive || gameState.gameOver) return;
    setGameState(prev => {
      const newState = { ...prev, rightDoorClosed: !prev.rightDoorClosed };
      
      // Если Фредди у правой двери и мы закрываем дверь, он отступает
      if (!prev.rightDoorClosed && prev.fredyLocation === 6) {
        newState.fredyStunned = true;
        newState.fredyLocation = Math.max(0, prev.fredyLocation - 2);
        setTimeout(() => {
          setGameState(s => ({ ...s, fredyStunned: false }));
        }, 3000);
      }
      
      return newState;
    });
    playSound('doorSlam');
  };

  const switchCamera = (cameraIndex: number) => {
    if (!gameState.gameActive || gameState.gameOver) return;
    setGameState(prev => {
      const newState = { ...prev, currentCamera: cameraIndex };
      
      // Смотря на Фредди через камеру замедляем его на короткое время
      if (prev.fredyLocation === cameraIndex && cameraIndex > 0) {
        newState.fredyStunned = true;
        setTimeout(() => {
          setGameState(s => ({ ...s, fredyStunned: false }));
        }, 2000);
      }
      
      return newState;
    });
    playSound('cameraSwitch');
  };

  if (gameState.gameOver) {
    return <GameOverScreen gameState={gameState} startGame={startGame} />;
  }

  if (gameState.victory) {
    return <VictoryScreen gameState={gameState} startGame={startGame} />;
  }

  if (!gameState.gameActive) {
    return <StartScreen startGame={startGame} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden static">
      <div className="grid grid-cols-12 grid-rows-12 h-screen">
        
        {/* Верхняя панель */}
        <div className="col-span-12 row-span-1 bg-card border-b border-border p-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="text-xl font-bold horror-title text-primary">FNAF Security</div>
            <div className="text-sm text-muted-foreground">v{GAME_VERSION}</div>
            <div className="text-lg">Время: {gameState.gameTime}</div>
            <div className="text-sm">
              Сложность: {gameState.difficulty === 'easy' ? '🟢 Легко' : gameState.difficulty === 'medium' ? '🟡 Средне' : '🔴 Сложно'}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Icon name="Zap" size={20} className="text-yellow-500" />
            <div className="w-32">
              <Progress 
                value={gameState.energy} 
                className={`${gameState.energy < 30 ? 'pulse-red' : ''}`}
              />
            </div>
            <span className="text-sm">{Math.round(gameState.energy)}%</span>
          </div>
        </div>

        {/* Левая панель - Камеры */}
        <CameraPanel gameState={gameState} switchCamera={switchCamera} />

        {/* Центральная область - Монитор */}
        <SecurityMonitor gameState={gameState} />

        {/* Правая панель - Управление */}
        <ControlPanel 
          gameState={gameState} 
          toggleLeftDoor={toggleLeftDoor} 
          toggleRightDoor={toggleRightDoor} 
        />

        {/* Нижняя панель */}
        <div className="col-span-9 row-span-1 bg-card border-t border-border p-4 flex items-center justify-center">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Zap" size={16} />
              <span>
                Расход: {(0.5 + (gameState.leftDoorClosed ? 2 : 0) + (gameState.rightDoorClosed ? 2 : 0) + (gameState.currentCamera > 0 ? 0.3 : 0)) * DIFFICULTY_SETTINGS[gameState.difficulty].energyDrain}/сек
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} />
              <span>До рассвета: {6 - gameState.hour} часов</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Activity" size={16} />
              <span>Агрессия: {gameState.fredyAggression}/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Предупреждения */}
      {gameState.energy < 20 && gameState.energy > 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Card className="p-4 bg-destructive border-destructive-foreground pulse-red">
            <div className="text-center text-destructive-foreground">
              <Icon name="AlertTriangle" size={32} className="mx-auto mb-2" />
              <p className="font-bold">КРИТИЧЕСКИЙ ЗАРЯД!</p>
            </div>
          </Card>
        </div>
      )}

      {gameState.fredyLocation >= 5 && !gameState.fredyStunned && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="p-4 bg-destructive border-destructive-foreground glitch">
            <div className="text-center text-destructive-foreground">
              <Icon name="Skull" size={24} className="mx-auto mb-2" />
              <p className="font-bold">ФРЕДДИ У ДВЕРЕЙ!</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;