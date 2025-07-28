import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface GameState {
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

const CAMERA_LOCATIONS = [
  'Главная сцена',
  'Зал', 
  'Кухня',
  'Левый коридор',
  'Правый коридор',
  'Левая дверь',
  'Правая дверь'
];

const DIFFICULTY_SETTINGS = {
  easy: { moveChance: 0.15, energyDrain: 0.8, aggressionGrowth: 0.5 },
  medium: { moveChance: 0.25, energyDrain: 1.0, aggressionGrowth: 1.0 },
  hard: { moveChance: 0.35, energyDrain: 1.3, aggressionGrowth: 1.5 }
};

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

  const gameLoopRef = useRef<NodeJS.Timeout>();
  const fredyMoveRef = useRef<NodeJS.Timeout>();
  const energyDrainRef = useRef<NodeJS.Timeout>();

  const playSound = useCallback((soundType: string) => {
    if (typeof window !== 'undefined') {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const createTone = (freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = type;
          
          gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        };

        switch (soundType) {
          case 'fredyLaugh':
            // Зловещий смех - низкие частоты
            createTone(120, 0.8, 'sawtooth', 0.15);
            setTimeout(() => createTone(100, 0.6, 'sawtooth', 0.12), 200);
            setTimeout(() => createTone(140, 0.4, 'sawtooth', 0.1), 600);
            break;
            
          case 'doorSlam':
            // Звук захлопывающейся двери - резкий удар
            createTone(80, 0.3, 'square', 0.2);
            setTimeout(() => createTone(60, 0.2, 'square', 0.15), 100);
            break;
            
          case 'cameraSwitch':
            // Переключение камеры - электронный звук
            createTone(800, 0.1, 'square', 0.08);
            setTimeout(() => createTone(1000, 0.05, 'square', 0.06), 50);
            break;
            
          case 'powerOut':
            // Отключение энергии - падающий тон
            const powerOsc = audioContext.createOscillator();
            const powerGain = audioContext.createGain();
            powerOsc.connect(powerGain);
            powerGain.connect(audioContext.destination);
            
            powerOsc.frequency.setValueAtTime(200, audioContext.currentTime);
            powerOsc.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + 2);
            powerOsc.type = 'sawtooth';
            
            powerGain.gain.setValueAtTime(0.15, audioContext.currentTime);
            powerGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
            
            powerOsc.start(audioContext.currentTime);
            powerOsc.stop(audioContext.currentTime + 2);
            break;
            
          case 'fredyAttack':
            // Атака - страшный рёв
            createTone(60, 1.5, 'sawtooth', 0.25);
            setTimeout(() => createTone(80, 1.2, 'square', 0.2), 100);
            setTimeout(() => createTone(45, 1.0, 'sawtooth', 0.18), 300);
            break;
            
          case 'footsteps':
            // Шаги - глухие удары
            createTone(40, 0.2, 'square', 0.12);
            setTimeout(() => createTone(35, 0.15, 'square', 0.1), 300);
            break;
            
          case 'ambientHum':
            // Фоновый гул
            createTone(55, 2, 'sine', 0.03);
            break;
            
          case 'victory':
            // Победа - мелодичные тона
            createTone(440, 0.5, 'sine', 0.1);
            setTimeout(() => createTone(554, 0.5, 'sine', 0.1), 250);
            setTimeout(() => createTone(659, 0.8, 'sine', 0.12), 500);
            break;
            
          case 'gameStart':
            // Начало игры - напряженный тон
            createTone(200, 1, 'triangle', 0.08);
            break;
        }
      } catch (e) {
        console.log('Audio not supported');
      }
    }
  }, []);

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

  // Продвинутое движение Фредди с ИИ
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameOver || gameState.fredyStunned) return;

    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
    const timeSinceLastMove = Date.now() - gameState.lastFredyMove;
    const moveInterval = Math.max(1000, 4000 - (gameState.fredyAggression * 200));

    fredyMoveRef.current = setInterval(() => {
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

    return () => {
      if (fredyMoveRef.current) clearInterval(fredyMoveRef.current);
    };
  }, [gameState.gameActive, gameState.gameOver, gameState.fredyStunned, gameState.difficulty, gameState.fredyAggression, playSound]);

  // Система энергии
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameOver) return;

    const settings = DIFFICULTY_SETTINGS[gameState.difficulty];

    energyDrainRef.current = setInterval(() => {
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

    return () => {
      if (energyDrainRef.current) clearInterval(energyDrainRef.current);
    };
  }, [gameState.gameActive, gameState.gameOver, gameState.difficulty, playSound]);

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
          hour: newHour,
          fredyAggression: prev.fredyAggression + 1 // Увеличиваем агрессию каждый час
        };
      });
    }, 15000); // 15 секунд = 1 час в игре

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState.gameActive, gameState.gameOver, playSound]);

  // Game Over при отсутствии энергии
  useEffect(() => {
    if (gameState.energy === 0 && gameState.gameActive && !gameState.gameOver) {
      const timeout = setTimeout(() => {
        setGameState(prev => ({ ...prev, gameOver: true }));
        playSound('fredyAttack');
      }, 2000); // 2 секунды на отключение света
      
      return () => clearTimeout(timeout);
    }
  }, [gameState.energy, gameState.gameActive, gameState.gameOver, playSound]);

  // Фоновые звуки
  useEffect(() => {
    if (gameState.gameActive && !gameState.gameOver) {
      const ambientInterval = setInterval(() => {
        if (Math.random() < 0.3) {
          playSound('ambientHum');
        }
      }, 10000);
      
      return () => clearInterval(ambientInterval);
    }
  }, [gameState.gameActive, gameState.gameOver, playSound]);

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 bg-card border-primary text-center max-w-md">
          <h1 className="horror-title text-6xl text-primary mb-4 glitch">GAME OVER</h1>
          <p className="text-xl mb-4">
            {gameState.energy === 0 ? 'Энергия закончилась...' : 'Фредди поймал тебя...'}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Продержался до: {gameState.gameTime}
          </p>
          <div className="space-y-2">
            <Button onClick={() => startGame(gameState.difficulty)} className="w-full bg-primary hover:bg-primary/80">
              Попробовать снова
            </Button>
            <Button onClick={() => startGame('easy')} variant="outline" className="w-full">
              Легкий уровень
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (gameState.victory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 bg-card border-green-500 text-center max-w-md">
          <h1 className="horror-title text-6xl text-green-500 mb-4">ПОБЕДА!</h1>
          <p className="text-xl mb-4">Ты пережил ночь!</p>
          <p className="text-sm text-muted-foreground mb-6">
            Сложность: {gameState.difficulty === 'easy' ? 'Легкая' : gameState.difficulty === 'medium' ? 'Средняя' : 'Сложная'}
          </p>
          <div className="space-y-2">
            <Button onClick={() => startGame(gameState.difficulty)} className="w-full bg-green-500 hover:bg-green-600">
              Играть снова
            </Button>
            <Button onClick={() => startGame('hard')} variant="outline" className="w-full">
              Сложный уровень
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!gameState.gameActive) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 bg-card border-primary text-center max-w-2xl">
          <h1 className="horror-title text-8xl text-primary mb-6 glitch">FNAF</h1>
          <h2 className="text-3xl font-bold mb-4">Five Nights at Freddy's</h2>
          <p className="text-lg mb-8 text-muted-foreground">
            Выживи одну ночь в пиццерии с аниматроником Фредди. 
            Используй камеры для наблюдения и двери для защиты. 
            Береги энергию - она ограничена!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center gap-3 p-4 border rounded-lg">
              <Icon name="Camera" size={32} className="text-primary" />
              <span className="font-semibold">Следи за Фредди</span>
              <span className="text-sm text-muted-foreground">Наблюдение замедляет его</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-4 border rounded-lg">
              <Icon name="Lock" size={32} className="text-primary" />
              <span className="font-semibold">Закрывай двери</span>
              <span className="text-sm text-muted-foreground">Но это тратит энергию</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-4 border rounded-lg">
              <Icon name="Battery" size={32} className="text-primary" />
              <span className="font-semibold">Экономь энергию</span>
              <span className="text-sm text-muted-foreground">Без неё ты беззащитен</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold">Выбери сложность:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button onClick={() => startGame('easy')} size="lg" variant="outline" className="text-green-500 border-green-500">
                Легко
              </Button>
              <Button onClick={() => startGame('medium')} size="lg" className="bg-primary hover:bg-primary/80">
                Средне
              </Button>
              <Button onClick={() => startGame('hard')} size="lg" variant="outline" className="text-red-500 border-red-500">
                Сложно
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden static">
      <div className="grid grid-cols-12 grid-rows-12 h-screen">
        
        {/* Верхняя панель */}
        <div className="col-span-12 row-span-1 bg-card border-b border-border p-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="text-xl font-bold horror-title text-primary">FNAF Security</div>
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
        <div className="col-span-3 row-span-11 bg-card border-r border-border p-4">
          <h3 className="text-lg font-bold mb-4 text-primary">Камеры</h3>
          <div className="space-y-2">
            {CAMERA_LOCATIONS.map((location, index) => (
              <Button
                key={index}
                variant={gameState.currentCamera === index ? "default" : "outline"}
                className="w-full justify-start text-left text-xs"
                onClick={() => switchCamera(index)}
              >
                <Icon name="Camera" size={14} className="mr-2" />
                {location}

              </Button>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-secondary rounded">
            <h4 className="font-semibold text-sm mb-2">Статус Фредди</h4>
            <div className="space-y-1 text-xs">
              <div>Агрессия: {gameState.fredyAggression}/10</div>
              <div className={`font-bold ${
                gameState.fredyLocation >= 5 ? 'text-destructive' : 
                gameState.fredyLocation >= 3 ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {gameState.fredyStunned ? '😵 Остановлен' :
                 gameState.fredyLocation >= 5 ? '🚨 У ДВЕРЕЙ!' : 
                 gameState.fredyLocation >= 3 ? '⚠️ Близко' : '✅ Далеко'}
              </div>
            </div>
          </div>
        </div>

        {/* Центральная область - Монитор */}
        <div className="col-span-6 row-span-10 bg-black border border-border m-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-green-500">
                {CAMERA_LOCATIONS[gameState.currentCamera]}
              </h2>
              {gameState.fredyLocation === gameState.currentCamera ? (
                <div className={`text-6xl mb-4 ${gameState.fredyStunned ? '' : 'glitch'}`}>
                  {gameState.fredyStunned ? '😵🐻' : '🐻'}
                </div>
              ) : (
                <div className="text-4xl text-gray-600">📹</div>
              )}
              <p className="text-sm text-gray-400">
                {gameState.fredyLocation === gameState.currentCamera 
                  ? gameState.fredyStunned ? "Фредди остановлен наблюдением!" : "ВНИМАНИЕ: АНИМАТРОНИК ОБНАРУЖЕН!" 
                  : "Зона безопасна"}
              </p>
            </div>
          </div>
          
          {/* Эффект отключения энергии */}
          {gameState.energy === 0 && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
              <div className="text-center text-red-500">
                <h2 className="text-4xl font-bold mb-4 glitch">ЭНЕРГИЯ ОТКЛЮЧЕНА</h2>
                <p className="text-xl">Фредди идет...</p>
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 static opacity-20 pointer-events-none"></div>
        </div>

        {/* Правая панель - Управление */}
        <div className="col-span-3 row-span-11 bg-card border-l border-border p-4">
          <h3 className="text-lg font-bold mb-4 text-primary">Управление</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Левая дверь</h4>
              <Button
                variant={gameState.leftDoorClosed ? "destructive" : "outline"}
                className="w-full"
                onClick={toggleLeftDoor}
                disabled={gameState.energy === 0}
              >
                <Icon name={gameState.leftDoorClosed ? "Lock" : "Unlock"} size={16} className="mr-2" />
                {gameState.leftDoorClosed ? "ЗАКРЫТА" : "ОТКРЫТА"}
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Правая дверь</h4>
              <Button
                variant={gameState.rightDoorClosed ? "destructive" : "outline"}
                className="w-full"
                onClick={toggleRightDoor}
                disabled={gameState.energy === 0}
              >
                <Icon name={gameState.rightDoorClosed ? "Lock" : "Unlock"} size={16} className="mr-2" />
                {gameState.rightDoorClosed ? "ЗАКРЫТА" : "ОТКРЫТА"}
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Подсказки</h4>
              <Card className="p-3 bg-secondary text-xs">
                <ul className="space-y-1">
                  <li>• Наблюдение замедляет Фредди</li>
                  <li>• Закрытые двери отталкивают его</li>
                  <li>• Агрессия растет со временем</li>
                  <li>• Экономь энергию!</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>

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