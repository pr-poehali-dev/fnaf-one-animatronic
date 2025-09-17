import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameState } from './GameTypes';

interface GameOverScreenProps {
  gameState: GameState;
  startGame: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ gameState, startGame }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* СКРИМЕР ЭФФЕКТ */}
      <div className="absolute inset-0 bg-black animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-9xl animate-bounce">
            🐻
          </div>
        </div>
        <div className="absolute top-1/4 left-1/4 text-red-500 text-6xl glitch animate-ping">👁️</div>
        <div className="absolute top-3/4 right-1/4 text-red-500 text-6xl glitch animate-ping">👁️</div>
        <div className="absolute inset-0 bg-red-500 opacity-20 animate-pulse"></div>
      </div>
      
      <Card className="p-8 bg-card border-primary text-center max-w-md z-10 relative">
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
};