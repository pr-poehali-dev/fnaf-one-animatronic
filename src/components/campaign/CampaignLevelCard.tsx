import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { CampaignLevel } from './CampaignData';

interface CampaignLevelCardProps {
  level: CampaignLevel;
  unlocked: boolean;
  selected: boolean;
  onLevelSelect: (level: CampaignLevel) => void;
}

export const CampaignLevelCard: React.FC<CampaignLevelCardProps> = ({
  level,
  unlocked,
  selected,
  onLevelSelect
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      case 'nightmare': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Shield';
      case 'medium': return 'AlertTriangle';
      case 'hard': return 'Zap';
      case 'nightmare': return 'Skull';
      default: return 'Circle';
    }
  };

  return (
    <Card
      className={`relative transition-all cursor-pointer transform hover:scale-105 overflow-hidden ${
        unlocked
          ? selected
            ? 'bg-gradient-to-br from-red-900/30 to-purple-900/30 border-red-500 shadow-lg shadow-red-500/30'
            : 'bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-600 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20'
          : 'bg-gradient-to-br from-gray-900/20 to-gray-800/20 border-gray-700/50 opacity-50 cursor-not-allowed'
      }`}
      onClick={() => unlocked && onLevelSelect(level)}
    >
      <div className={`absolute inset-0 ${
        selected ? 'bg-red-500/10' : 'bg-transparent'
      } transition-all duration-300`}></div>
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${getDifficultyColor(level.difficulty)} bg-black/30`}>
              <Icon 
                name={getDifficultyIcon(level.difficulty)} 
                className={getDifficultyColor(level.difficulty)} 
                size={20} 
              />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-mono">МИССИЯ #{level.id.toString().padStart(3, '0')}</div>
              <CardTitle className={`text-lg ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {level.title}
              </CardTitle>
            </div>
          </div>
          {!unlocked ? (
            <div className="flex items-center space-x-2">
              <Icon name="Lock" className="text-red-400" size={20} />
              <span className="text-xs text-red-400 font-bold">ЗАБЛОКИРОВАНО</span>
            </div>
          ) : selected ? (
            <div className="flex items-center space-x-2">
              <Icon name="Target" className="text-red-400 animate-pulse" size={20} />
              <span className="text-xs text-red-400 font-bold">ВЫБРАНО</span>
            </div>
          ) : null}
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
          level.difficulty === 'easy' ? 'bg-green-900/30 border-green-500/50 text-green-300' :
          level.difficulty === 'medium' ? 'bg-yellow-900/30 border-yellow-500/50 text-yellow-300' :
          level.difficulty === 'hard' ? 'bg-red-900/30 border-red-500/50 text-red-300' :
          'bg-purple-900/30 border-purple-500/50 text-purple-300'
        }`}>
          {level.difficulty === 'easy' && '🟢 ЛЕГКО'}
          {level.difficulty === 'medium' && '🟡 СРЕДНЕ'}
          {level.difficulty === 'hard' && '🔴 СЛОЖНО'}
          {level.difficulty === 'nightmare' && '🟣 КОШМАР'}
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-4">
        <div className="bg-black/30 p-4 rounded border border-muted/30">
          <p className="text-sm leading-relaxed text-muted-foreground">{level.description}</p>
        </div>
        
        <div className="space-y-3">
          <div className="text-sm font-bold text-red-400 flex items-center">
            <Icon name="Target" className="mr-2" size={16} />
            ОПЕРАТИВНЫЕ ЦЕЛИ:
          </div>
          <div className="space-y-2">
            {level.objectives.map((objective, idx) => (
              <div key={idx} className="text-xs flex items-start p-2 bg-black/20 rounded border border-muted/20">
                <Icon name="CheckCircle" className="mr-2 text-green-400 mt-0.5 flex-shrink-0" size={12} />
                <span className="text-muted-foreground">{objective}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-muted/30">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center text-blue-400">
              <Icon name="Radio" className="mr-1" size={14} />
              {level.radioCalls.length} вызовов
            </div>
            <div className="flex items-center text-purple-400">
              <Icon name="Users" className="mr-1" size={14} />
              {level.visitorChecks?.length || 0} посетителей
            </div>
            <div className="flex items-center text-yellow-400">
              <Icon name="Star" className="mr-1" size={14} />
              +{level.rewards.experience} XP
            </div>
          </div>
          {unlocked && !selected && (
            <div className="text-xs text-green-400 font-bold animate-pulse">
              ⚙️ КЛИКНИ ДЛЯ ВЫБОРА
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};