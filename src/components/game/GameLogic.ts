import { useEffect, useCallback } from 'react';
import { GameState, DIFFICULTY_SETTINGS } from './GameTypes';

export const useGameLogic = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  playSound: (soundType: string) => void
) => {
  // Продвинутое движение Фредди с ИИ
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameOver || gameState.fredyStunned) return;

    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
    const moveInterval = Math.max(1000, 4000 - (gameState.fredyAggression * 200));

    const fredyMoveInterval = setInterval(() => {
      setGameState(prev => {
        // Увеличиваем агрессию со временем
        const newAggression = Math.min(10, prev.fredyAggression + (settings.aggressionGrowth * 0.1));
        
        // Вероятность движения зависит от агрессии и времени
        const moveChance = settings.moveChance + (newAggression * 0.05);
        const shouldMove = Math.random() < moveChance;
        
        if (!shouldMove) {
          return { ...prev, fredyAggression: newAggression };
        }

        let newLocation = prev.fredyLocation;
        
        // Умное движение Фредди
        if (prev.fredyLocation === 0) {
          // Начинает двигаться со сцены
          newLocation = Math.random() < 0.5 ? 1 : 2;
        } else if (prev.fredyLocation < 4) {
          // Движется к коридорам
          if (Math.random() < 0.7) {
            newLocation = prev.fredyLocation + 1;
          } else {
            // Иногда возвращается назад для непредсказуемости
            newLocation = Math.max(0, prev.fredyLocation - 1);
          }
        } else if (prev.fredyLocation === 4) {
          // Выбирает левый или правый коридор
          newLocation = Math.random() < 0.5 ? 5 : 6;
        } else if (prev.fredyLocation >= 5) {
          // У дверей - проверяет атаку
          const doorClosed = newLocation === 5 ? prev.leftDoorClosed : prev.rightDoorClosed;
          
          if (!doorClosed) {
            // Атака!
            playSound('fredyAttack');
            return { 
              ...prev, 
              gameOver: true, 
              fredyLocation: newLocation,
              fredyAggression: newAggression,
              lastFredyMove: Date.now()
            };
          } else {
            // Дверь закрыта, отступает
            newLocation = Math.max(0, prev.fredyLocation - 2);
          }
        }

        // Звуки в зависимости от местоположения
        if (newLocation >= 5) {
          playSound('fredyLaugh');
        } else if (newLocation >= 3 && prev.fredyLocation < 3) {
          playSound('fredyLaugh');
        } else if (newLocation > prev.fredyLocation && newLocation >= 2) {
          playSound('footsteps');
        }

        return { 
          ...prev, 
          fredyLocation: newLocation,
          fredyAggression: newAggression,
          lastFredyMove: Date.now()
        };
      });
    }, moveInterval);

    return () => clearInterval(fredyMoveInterval);
  }, [gameState.gameActive, gameState.gameOver, gameState.fredyStunned, gameState.difficulty, gameState.fredyAggression, playSound, setGameState]);

  // Система энергии
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameOver) return;

    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];

    const energyDrainInterval = setInterval(() => {
      setGameState(prev => {
        let energyDrain = 0.5 * settings.energyDrain; // Базовый расход
        
        if (prev.leftDoorClosed) energyDrain += 2 * settings.energyDrain;
        if (prev.rightDoorClosed) energyDrain += 2 * settings.energyDrain;
        if (prev.currentCamera > 0) energyDrain += 0.3 * settings.energyDrain; // Камеры тоже тратят энергию

        const newEnergy = Math.max(0, prev.energy - energyDrain);
        
        if (newEnergy === 0) {
          playSound('powerOut');
          // При отключении энергии все двери открываются
          return { 
            ...prev, 
            energy: 0, 
            leftDoorClosed: false,
            rightDoorClosed: false
          };
        }

        return { ...prev, energy: newEnergy };
      });
    }, 1000);

    return () => clearInterval(energyDrainInterval);
  }, [gameState.gameActive, gameState.gameOver, gameState.difficulty, playSound, setGameState]);

  // Игровой таймер и победа
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameOver) return;

    const gameTimerInterval = setInterval(() => {
      setGameState(prev => {
        const newHour = prev.hour + 1;
        const times = ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM'];
        
        if (newHour >= 6) {
          playSound('victory');
          return { ...prev, victory: true, gameActive: false };
        }

        return { 
          ...prev, 
          gameTime: times[newHour],
          hour: newHour,
          fredyAggression: prev.fredyAggression + 1 // Увеличиваем агрессию каждый час
        };
      });
    }, 15000); // 15 секунд = 1 час в игре

    return () => clearInterval(gameTimerInterval);
  }, [gameState.gameActive, gameState.gameOver, playSound, setGameState]);

  // Game Over при отсутствии энергии
  useEffect(() => {
    if (gameState.energy === 0 && gameState.gameActive && !gameState.gameOver) {
      const timeout = setTimeout(() => {
        setGameState(prev => ({ ...prev, gameOver: true }));
        playSound('fredyAttack');
      }, 2000); // 2 секунды на отключение света
      
      return () => clearTimeout(timeout);
    }
  }, [gameState.energy, gameState.gameActive, gameState.gameOver, playSound, setGameState]);

  // Фоновые звуки и атмосферные эффекты
  useEffect(() => {
    if (gameState.gameActive && !gameState.gameOver) {
      const ambientInterval = setInterval(() => {
        const rand = Math.random();
        if (rand < 0.1) {
          playSound('ambientHum');
        } else if (rand < 0.15) {
          playSound('staticNoise');
        } else if (rand < 0.18 && gameState.fredyLocation >= 3) {
          playSound('breathing');
        }
      }, 8000);
      
      return () => clearInterval(ambientInterval);
    }
  }, [gameState.gameActive, gameState.gameOver, gameState.fredyLocation, playSound]);
};