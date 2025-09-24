import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { GameState } from './GameTypes';

interface ControlPanelProps {
  gameState: GameState;
  toggleLeftDoor: () => void;
  toggleRightDoor: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  gameState, 
  toggleLeftDoor, 
  toggleRightDoor 
}) => {
  return (
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
              <li>• Наблюдение замедляет Кредди</li>
              <li>• Закрытые двери отталкивают его</li>
              <li>• Агрессия растет со временем</li>
              <li>• Экономь энергию!</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};