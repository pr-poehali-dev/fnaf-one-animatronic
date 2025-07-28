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
  gameTime: string;
  gameActive: boolean;
  gameOver: boolean;
  victory: boolean;
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

const Index = () => {
  const [gameState, setGameState] = useState<GameState>({
    energy: 100,
    leftDoorClosed: false,
    rightDoorClosed: false,
    currentCamera: 0,
    fredyLocation: 0,
    gameTime: '12:00 AM',
    gameActive: false,
    gameOver: false,
    victory: false
  });

  const gameLoopRef = useRef<NodeJS.Timeout>();
  const fredyMoveRef = useRef<NodeJS.Timeout>();
  const energyDrainRef = useRef<NodeJS.Timeout>();

  // Звуковые эффекты (placeholder для будущих аудио)
  const playSound = useCallback((soundType: string) => {
    console.log(`Playing sound: ${soundType}`);
  }, []);

  // Начать игру
  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameActive: true,
      gameOver: false,
      victory: false,
      energy: 100,
      fredyLocation: 0,
      gameTime: '12:00 AM'
    }));
    playSound('gameStart');
  };

  // Переключить левую дверь
  const toggleLeftDoor = () => {
    if (!gameState.gameActive || gameState.gameOver) return;
    setGameState(prev => ({
      ...prev,
      leftDoorClosed: !prev.leftDoorClosed
    }));
    playSound('doorSlam');
  };

  // Переключить правую дверь
  const toggleRightDoor = () => {
    if (!gameState.gameActive || gameState.gameOver) return;
    setGameState(prev => ({
      ...prev,
      rightDoorClosed: !prev.rightDoorClosed
    }));
    playSound('doorSlam');
  };

  // Переключить камеру
  const switchCamera = (cameraIndex: number) => {
    if (!gameState.gameActive || gameState.gameOver) return;
    setGameState(prev => ({
      ...prev,
      currentCamera: cameraIndex
    }));
    playSound('cameraSwitch');
  };

  // Движение Фредди
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameOver) return;

    fredyMoveRef.current = setInterval(() => {
      setGameState(prev => {
        const shouldMove = Math.random() < 0.3; // 30% шанс движения
        if (!shouldMove) return prev;

        let newLocation = prev.fredyLocation;
        
        // Логика движения Фредди к офису
        if (prev.fredyLocation < 6) {
          newLocation = Math.min(prev.fredyLocation + 1, 6);
        }

        // Проверка атаки
        if (newLocation === 5 && !prev.leftDoorClosed) {
          playSound('fredyAttack');
          return { ...prev, gameOver: true, fredyLocation: newLocation };
        }
        if (newLocation === 6 && !prev.rightDoorClosed) {
          playSound('fredyAttack');
          return { ...prev, gameOver: true, fredyLocation: newLocation };
        }

        if (newLocation >= 5) {
          playSound('fredyLaugh');
        }

        return { ...prev, fredyLocation: newLocation };
      });
    }, 3000);

    return () => {
      if (fredyMoveRef.current) clearInterval(fredyMoveRef.current);
    };
  }, [gameState.gameActive, gameState.gameOver, playSound]);

  // Расход энергии
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameOver) return;

    energyDrainRef.current = setInterval(() => {
      setGameState(prev => {
        let energyDrain = 1;
        if (prev.leftDoorClosed) energyDrain += 2;
        if (prev.rightDoorClosed) energyDrain += 2;
        energyDrain += 0.5; // Базовый расход на камеры

        const newEnergy = Math.max(0, prev.energy - energyDrain);
        
        if (newEnergy === 0) {
          playSound('powerOut');
          return { ...prev, energy: 0, gameOver: true };
        }

        return { ...prev, energy: newEnergy };
      });
    }, 1000);

    return () => {
      if (energyDrainRef.current) clearInterval(energyDrainRef.current);
    };
  }, [gameState.gameActive, gameState.gameOver, gameState.leftDoorClosed, gameState.rightDoorClosed, playSound]);

  // Игровой таймер
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setGameState(prev => {
        const times = ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM'];
        const currentIndex = times.indexOf(prev.gameTime);
        
        if (currentIndex >= 6) {
          playSound('victory');
          return { ...prev, victory: true, gameActive: false };
        }

        return { ...prev, gameTime: times[currentIndex + 1] };
      });
    }, 20000); // 20 секунд = 1 час в игре

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState.gameActive, gameState.gameOver, gameState.gameTime, playSound]);

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 bg-card border-primary text-center">
          <h1 className="horror-title text-6xl text-primary mb-4 glitch">GAME OVER</h1>
          <p className="text-xl mb-6">Фредди поймал тебя...</p>
          <Button onClick={startGame} className="bg-primary hover:bg-primary/80">
            Попробовать снова
          </Button>
        </Card>
      </div>
    );
  }

  if (gameState.victory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 bg-card border-green-500 text-center">
          <h1 className="horror-title text-6xl text-green-500 mb-4">ПОБЕДА!</h1>
          <p className="text-xl mb-6">Ты пережил ночь!</p>
          <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
            Играть снова
          </Button>
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
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <Icon name="Camera" size={24} className="text-primary" />
              <span>Следи за Фредди через камеры</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Lock" size={24} className="text-primary" />
              <span>Закрывай двери при опасности</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Battery" size={24} className="text-primary" />
              <span>Экономь энергию для выживания</span>
            </div>
          </div>
          <Button onClick={startGame} size="lg" className="bg-primary hover:bg-primary/80 text-xl px-8 py-4">
            Начать игру
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden static">
      {/* Главный интерфейс */}
      <div className="grid grid-cols-12 grid-rows-12 h-screen">
        
        {/* Верхняя панель */}
        <div className="col-span-12 row-span-1 bg-card border-b border-border p-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="text-xl font-bold horror-title text-primary">FNAF Security</div>
            <div className="text-lg">Время: {gameState.gameTime}</div>
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
                className={`w-full justify-start text-left ${
                  gameState.fredyLocation === index ? 'border-primary animate-pulse' : ''
                }`}
                onClick={() => switchCamera(index)}
              >
                <Icon name="Camera" size={16} className="mr-2" />
                {location}
                {gameState.fredyLocation === index && (
                  <Icon name="AlertTriangle" size={16} className="ml-auto text-primary" />
                )}
              </Button>
            ))}
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
                <div className="text-6xl mb-4 glitch">🐻</div>
              ) : (
                <div className="text-4xl text-gray-600">📹</div>
              )}
              <p className="text-sm text-gray-400">
                {gameState.fredyLocation === gameState.currentCamera 
                  ? "ВНИМАНИЕ: АНИМАТРОНИК ОБНАРУЖЕН!" 
                  : "Зона безопасна"}
              </p>
            </div>
          </div>
          {/* Статичный эффект */}
          <div className="absolute inset-0 static opacity-20 pointer-events-none"></div>
        </div>

        {/* Правая панель - Управление */}
        <div className="col-span-3 row-span-11 bg-card border-l border-border p-4">
          <h3 className="text-lg font-bold mb-4 text-primary">Управление</h3>
          
          <div className="space-y-6">
            {/* Левая дверь */}
            <div className="space-y-2">
              <h4 className="font-semibold">Левая дверь</h4>
              <Button
                variant={gameState.leftDoorClosed ? "destructive" : "outline"}
                className="w-full"
                onClick={toggleLeftDoor}
              >
                <Icon name={gameState.leftDoorClosed ? "Lock" : "Unlock"} size={16} className="mr-2" />
                {gameState.leftDoorClosed ? "ЗАКРЫТА" : "ОТКРЫТА"}
              </Button>
            </div>

            {/* Правая дверь */}
            <div className="space-y-2">
              <h4 className="font-semibold">Правая дверь</h4>
              <Button
                variant={gameState.rightDoorClosed ? "destructive" : "outline"}
                className="w-full"
                onClick={toggleRightDoor}
              >
                <Icon name={gameState.rightDoorClosed ? "Lock" : "Unlock"} size={16} className="mr-2" />
                {gameState.rightDoorClosed ? "ЗАКРЫТА" : "ОТКРЫТА"}
              </Button>
            </div>

            {/* Статус Фредди */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Статус угрозы</h4>
              <Card className="p-3 bg-secondary">
                <div className="flex items-center justify-between">
                  <span>Фредди:</span>
                  <span className={`font-bold ${
                    gameState.fredyLocation >= 5 ? 'text-destructive' : 
                    gameState.fredyLocation >= 3 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {gameState.fredyLocation >= 5 ? 'ОПАСНО' : 
                     gameState.fredyLocation >= 3 ? 'БЛИЗКО' : 'ДАЛЕКО'}
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Нижняя панель */}
        <div className="col-span-9 row-span-1 bg-card border-t border-border p-4 flex items-center justify-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Icon name="Zap" size={16} />
              <span className="text-sm">
                Расход: {1 + (gameState.leftDoorClosed ? 2 : 0) + (gameState.rightDoorClosed ? 2 : 0) + 0.5}/сек
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} />
              <span className="text-sm">До рассвета: {7 - ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM'].indexOf(gameState.gameTime)} часов</span>
            </div>
          </div>
        </div>
      </div>

      {/* Предупреждения */}
      {gameState.energy < 30 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Card className="p-4 bg-destructive border-destructive-foreground pulse-red">
            <div className="text-center text-destructive-foreground">
              <Icon name="AlertTriangle" size={32} className="mx-auto mb-2" />
              <p className="font-bold">НИЗКИЙ ЗАРЯД БАТАРЕИ!</p>
            </div>
          </Card>
        </div>
      )}

      {gameState.fredyLocation >= 5 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="p-4 bg-destructive border-destructive-foreground glitch">
            <div className="text-center text-destructive-foreground">
              <Icon name="Skull" size={24} className="mx-auto mb-2" />
              <p className="font-bold">ФРЕДДИ ОЧЕНЬ БЛИЗКО!</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;