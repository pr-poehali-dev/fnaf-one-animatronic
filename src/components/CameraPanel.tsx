import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { GameState, CAMERA_LOCATIONS } from './GameTypes';

interface CameraPanelProps {
  gameState: GameState;
  switchCamera: (cameraIndex: number) => void;
}

export const CameraPanel: React.FC<CameraPanelProps> = ({ gameState, switchCamera }) => {
  return (
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
        <h4 className="font-semibold text-sm mb-2">Статус Кредди</h4>
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
  );
};