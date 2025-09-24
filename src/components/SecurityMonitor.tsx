import React from 'react';
import { GameState, CAMERA_LOCATIONS } from './GameTypes';

interface SecurityMonitorProps {
  gameState: GameState;
}

export const SecurityMonitor: React.FC<SecurityMonitorProps> = ({ gameState }) => {
  return (
    <div className="col-span-6 row-span-10 bg-black border border-border m-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-500">
            {CAMERA_LOCATIONS[gameState.currentCamera]}
          </h2>
          {gameState.fredyLocation === gameState.currentCamera ? (
            <div className={`text-6xl mb-4 ${gameState.fredyStunned ? '' : 'glitch'}`}>
              <img 
                src="https://cdn.poehali.dev/files/d7871b22-1d68-4bb3-926d-0e9deb3bbfc8.png" 
                alt="Freddy" 
                className={`w-32 h-32 mx-auto object-contain ${gameState.fredyStunned ? '' : 'animate-pulse'}`}
              />
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
  );
};