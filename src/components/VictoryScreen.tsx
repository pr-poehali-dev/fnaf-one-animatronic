import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameState } from './GameTypes';

interface VictoryScreenProps {
  gameState: GameState;
  startGame: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ gameState, startGame }) => {
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
};