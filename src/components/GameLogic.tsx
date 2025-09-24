import { useEffect, useRef } from 'react';
import { GameState, DIFFICULTY_SETTINGS } from './GameTypes';

interface GameLogicProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  playSound: (soundType: string) => void;
}

export const useGameLogic = ({ gameState, setGameState, playSound }: GameLogicProps) => {
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const fredyMoveRef = useRef<NodeJS.Timeout>();
  const energyDrainRef = useRef<NodeJS.Timeout>();

  // Супер продвинутое движение Фредди с адаптивным ИИ
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameOver || gameState.fredyStunned) return;

    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
    
    // Динамический интервал на основе времени, агрессии и близости к утру
    const timeBasedCalm = gameState.hour >= 4 ? settings.lateGameCalm : 1;
    const aggressionMultiplier = Math.min(gameState.fredyAggression / settings.maxAggression, 1);
    const moveInterval = Math.max(500, settings.baseMoveInterval * (1 - aggressionMultiplier * 0.8) * timeBasedCalm);

    fredyMoveRef.current = setInterval(() => {
      setGameState(prev => {
        // В 6 утра Фредди полностью останавливается
        if (prev.hour >= 6) {
          return { ...prev, fredyLocation: 0 };
        }

        // Успокоение к утру (особенно сильное в 5 утра)
        const hourCalm = prev.hour === 5 ? 0.3 : (prev.hour >= 4 ? timeBasedCalm : 1);
        
        // Увеличиваем агрессию более интенсивно
        const aggressionIncrease = settings.aggressionGrowth * (prev.hour + 1) * 0.05;
        const newAggression = Math.min(settings.maxAggression, prev.fredyAggression + aggressionIncrease);
        
        // Вероятность движения с учетом всех факторов
        const baseChance = settings.moveChance * hourCalm;
        const aggressionBonus = (newAggression / settings.maxAggression) * 0.3;
        const moveChance = Math.min(0.95, baseChance + aggressionBonus);
        
        const shouldMove = Math.random() < moveChance;
        
        if (!shouldMove) {
          return { ...prev, fredyAggression: newAggression };
        }

        let newLocation = prev.fredyLocation;
        
        // Супер умное движение Фредди
        if (prev.fredyLocation === 0) {
          // Начинает движение - выбирает случайный путь
          newLocation = Math.random() < 0.5 ? 1 : 2;
        } else if (prev.fredyLocation < 4) {
          // Движется к коридорам с учетом умности
          const smartChoice = Math.random() < settings.smartMovement;
          
          if (smartChoice) {
            // Умное движение - всегда вперед
            newLocation = prev.fredyLocation + 1;
          } else {
            // Случайное движение
            if (Math.random() < 0.8) {
              newLocation = prev.fredyLocation + 1;
            } else {
              newLocation = Math.max(0, prev.fredyLocation - 1);
            }
          }
        } else if (prev.fredyLocation === 4) {
          // Выбор коридора с учетом состояния дверей
          const leftDoorOpen = !prev.leftDoorClosed;
          const rightDoorOpen = !prev.rightDoorClosed;
          
          if (Math.random() < settings.smartMovement) {
            // Умный выбор - идет к открытой двери
            if (leftDoorOpen && rightDoorOpen) {
              newLocation = Math.random() < 0.5 ? 5 : 6;
            } else if (leftDoorOpen) {
              newLocation = 5;
            } else if (rightDoorOpen) {
              newLocation = 6;
            } else {
              // Обе двери закрыты - ждет
              newLocation = 4;
            }
          } else {
            // Случайный выбор
            newLocation = Math.random() < 0.5 ? 5 : 6;
          }
        } else if (prev.fredyLocation >= 5) {
          // У дверей - сложная логика атаки и переключения
          const isLeftDoor = prev.fredyLocation === 5;
          const currentDoorClosed = isLeftDoor ? prev.leftDoorClosed : prev.rightDoorClosed;
          const otherDoorClosed = isLeftDoor ? prev.rightDoorClosed : prev.leftDoorClosed;
          
          if (!currentDoorClosed) {
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
            // Дверь закрыта - решает что делать
            const switchChance = settings.doorSwitchSpeed * (1 + aggressionMultiplier);
            
            if (Math.random() < switchChance && !otherDoorClosed) {
              // Быстро переключается на другую дверь (особенно на сложной сложности)
              newLocation = isLeftDoor ? 6 : 5;
              playSound('fredyLaugh');
            } else if (Math.random() < 0.3) {
              // Отступает в коридор
              newLocation = 4;
            } else {
              // Остается у двери, ожидая
              newLocation = prev.fredyLocation;
            }
          }
        }

        // Звуки в зависимости от действий
        if (newLocation >= 5 && prev.fredyLocation !== newLocation) {
          playSound('fredyLaugh');
        } else if (newLocation === 4 && prev.fredyLocation < 4) {
          playSound('breathing');
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

    return () => {
      if (fredyMoveRef.current) clearInterval(fredyMoveRef.current);
    };
  }, [gameState.gameActive, gameState.gameOver, gameState.fredyStunned, gameState.difficulty, 
      gameState.fredyAggression, gameState.hour, gameState.leftDoorClosed, gameState.rightDoorClosed, 
      playSound, setGameState]);

  // Система энергии
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameOver) return;

    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];

    energyDrainRef.current = setInterval(() => {
      setGameState(prev => {
        let energyDrain = 0.5 * settings.energyDrain;
        
        if (prev.leftDoorClosed) energyDrain += 2 * settings.energyDrain;
        if (prev.rightDoorClosed) energyDrain += 2 * settings.energyDrain;
        if (prev.currentCamera > 0) energyDrain += 0.3 * settings.energyDrain;

        const newEnergy = Math.max(0, prev.energy - energyDrain);
        
        if (newEnergy === 0) {
          playSound('powerOut');
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

    return () => {
      if (energyDrainRef.current) clearInterval(energyDrainRef.current);
    };
  }, [gameState.gameActive, gameState.gameOver, gameState.difficulty, playSound, setGameState]);

  // Игровой таймер и победа
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setGameState(prev => {
        const times = ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM'];
        const newHour = prev.hour + 1;
        
        if (newHour >= 6) {
          playSound('victory');
          return { ...prev, victory: true, gameActive: false };
        }

        return { 
          ...prev, 
          gameTime: times[newHour],
          hour: newHour
        };
      });
    }, 15000); // 15 секунд = 1 час в игре

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState.gameActive, gameState.gameOver, playSound, setGameState]);

  // Game Over при отсутствии энергии
  useEffect(() => {
    if (gameState.energy === 0 && gameState.gameActive && !gameState.gameOver) {
      const timeout = setTimeout(() => {
        setGameState(prev => ({ ...prev, gameOver: true }));
        playSound('fredyAttack');
      }, 2000);
      
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