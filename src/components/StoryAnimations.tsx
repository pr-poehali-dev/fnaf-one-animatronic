import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface StoryAnimationProps {
  storyType: 'rescue' | 'death';
  scenario: string;
  characterName: string;
  description: string;
  onComplete: () => void;
}

export const StoryAnimation: React.FC<StoryAnimationProps> = ({
  storyType,
  scenario,
  characterName,
  description,
  onComplete
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const phases = [
      { delay: 0, phase: 0 },
      { delay: 1000, phase: 1 },
      { delay: 2500, phase: 2 },
      { delay: 4000, phase: 3 },
      { delay: 6000, phase: 4 }
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => {
        setAnimationPhase(phase);
        if (phase === 2) setShowText(true);
      }, delay);
    });

    setTimeout(() => {
      onComplete();
    }, 7000);
  }, [onComplete]);

  const getRescueAnimation = () => {
    switch (scenario) {
      case 'lost_forest':
        return (
          <div className="relative w-full h-64 bg-gradient-to-b from-green-900 to-green-950 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iIzRhNzc1YSIvPgo8L3N2Zz4=')] opacity-30"></div>
            
            <div className={`absolute left-4 bottom-4 transition-all duration-1000 ${
              animationPhase >= 1 ? 'transform translate-x-48' : ''
            }`}>
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-white" />
              </div>
            </div>
            
            <div className={`absolute right-8 top-4 transition-all duration-500 ${
              animationPhase >= 0 ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                ))}
              </div>
              <div className="text-xs text-yellow-200 mt-1">Фонари</div>
            </div>
            
            {animationPhase >= 3 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
                <div className="text-4xl">✅</div>
              </div>
            )}
          </div>
        );
        
      case 'burning_house':
        return (
          <div className="relative w-full h-64 bg-gradient-to-t from-red-900 to-orange-800 rounded-lg overflow-hidden">
            <div className={`absolute inset-0 transition-opacity duration-2000 ${
              animationPhase >= 1 ? 'opacity-30' : 'opacity-70'
            }`} style={{
              background: 'repeating-linear-gradient(45deg, #ff4444, #ff4444 10px, #ffaa00 10px, #ffaa00 20px)'
            }}></div>
            
            <div className="absolute top-8 left-8 w-16 h-20 bg-gray-600 rounded-t-lg">
              <div className="absolute top-4 left-2 w-3 h-3 bg-yellow-200 rounded opacity-80"></div>
            </div>
            
            <div className={`absolute top-12 left-10 transition-all duration-2000 ${
              animationPhase >= 1 ? 'transform -translate-y-8 translate-x-8' : ''
            }`}>
              <div className="flex space-x-1">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              </div>
            </div>
            
            {animationPhase >= 3 && (
              <div className="absolute bottom-4 right-4 animate-pulse">
                <div className="text-2xl">🚑</div>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="relative w-full h-64 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
            <div className="text-6xl animate-bounce">✅</div>
          </div>
        );
    }
  };

  const getDeathAnimation = () => {
    switch (scenario) {
      case 'lost_forest':
        return (
          <div className="relative w-full h-64 bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4=')] opacity-50"></div>
            
            <div className={`absolute left-4 bottom-4 transition-all duration-2000 ${
              animationPhase >= 1 ? 'transform translate-x-32' : ''
            }`}>
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-white" />
              </div>
            </div>
            
            {animationPhase >= 2 && (
              <div className="absolute right-8 top-8 animate-pulse">
                <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center">
                  <Icon name="Skull" size={24} className="text-red-200" />
                </div>
              </div>
            )}
            
            {animationPhase >= 3 && (
              <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                <div className="text-4xl animate-pulse">💀</div>
              </div>
            )}
          </div>
        );
        
      case 'burning_house':
        return (
          <div className="relative w-full h-64 bg-gradient-to-t from-black via-red-900 to-orange-600 rounded-lg overflow-hidden">
            <div className="absolute inset-0" style={{
              background: 'repeating-linear-gradient(45deg, #ff0000, #ff0000 5px, #000000 5px, #000000 10px)'
            }}></div>
            
            <div className="absolute top-8 left-8 w-16 h-20 bg-gray-900 rounded-t-lg">
              <div className="absolute top-4 left-2 w-3 h-3 bg-red-600 rounded animate-pulse"></div>
            </div>
            
            {animationPhase >= 2 && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">💀</div>
                  <div className="text-red-400 text-sm">Отравление дымом</div>
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="relative w-full h-64 bg-gradient-to-br from-red-900 to-black rounded-lg flex items-center justify-center">
            <div className="text-6xl animate-pulse">💀</div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/95 border-primary/50">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold mb-2 ${
              storyType === 'rescue' ? 'text-green-400' : 'text-red-400'
            }`}>
              {storyType === 'rescue' ? '🎉 СПАСЕНИЕ!' : '💀 ТРАГЕДИЯ...'}
            </h2>
            <p className="text-lg text-foreground">{characterName}</p>
          </div>
          
          <div className="mb-6">
            {storyType === 'rescue' ? getRescueAnimation() : getDeathAnimation()}
          </div>
          
          {showText && (
            <div className={`text-center p-4 rounded-lg transition-all duration-1000 ${
              animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
            } ${
              storyType === 'rescue' 
                ? 'bg-green-900/30 border border-green-400/30' 
                : 'bg-red-900/30 border border-red-400/30'
            }`}>
              <p className="text-foreground">
                {description}
              </p>
            </div>
          )}
          
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    i <= animationPhase ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const StoryResult: React.FC<{
  saved: number;
  lost: number;
  onContinue: () => void;
}> = ({ saved, lost, onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/95 border-primary/50">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-6 text-primary">
            Итоги смены
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400">{saved}</div>
              <div className="text-sm text-green-300">Спасено</div>
            </div>
            <div className="bg-red-900/30 border border-red-400/30 rounded-lg p-4">
              <div className="text-3xl font-bold text-red-400">{lost}</div>
              <div className="text-sm text-red-300">Потеряно</div>
            </div>
          </div>
          
          <div className="mb-6">
            {saved > lost ? (
              <div className="text-center">
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-green-400 font-semibold">Отличная работа!</p>
                <p className="text-sm text-muted-foreground">
                  Ты спас больше жизней, чем потерял
                </p>
              </div>
            ) : saved === lost ? (
              <div className="text-center">
                <div className="text-4xl mb-2">⚖️</div>
                <p className="text-yellow-400 font-semibold">Неплохо</p>
                <p className="text-sm text-muted-foreground">
                  Можешь лучше
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-2">😔</div>
                <p className="text-red-400 font-semibold">Нужно лучше</p>
                <p className="text-sm text-muted-foreground">
                  Слишком много людей погибло
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={onContinue}
            className="w-full bg-primary hover:bg-primary/80 text-primary-foreground py-2 px-4 rounded-lg transition-colors"
          >
            Продолжить
          </button>
        </div>
      </Card>
    </div>
  );
};