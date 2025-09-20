import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from './AuthSystem';
import { CampaignLevel, CAMPAIGN_LEVELS } from './campaign/CampaignData';
import { CampaignBriefing } from './campaign/CampaignBriefing';
import { UserStatsCards } from './campaign/UserStatsCards';
import { CampaignLevelCard } from './campaign/CampaignLevelCard';
import { CampaignBottomPanel } from './campaign/CampaignBottomPanel';

export { CampaignLevel, RadioCall } from './campaign/CampaignData';

export const CampaignScreen: React.FC<{ onBack: () => void; onStartLevel: (level: CampaignLevel) => void }> = ({ 
  onBack, onStartLevel 
}) => {
  const { user, saveProgress } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<CampaignLevel | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);

  const isLevelUnlocked = (levelId: number) => {
    if (!user) return levelId === 1;
    const unlocked = user.unlockedLevels.includes(levelId);
    console.log(`Level ${levelId} unlocked:`, unlocked, 'User unlocked levels:', user.unlockedLevels);
    return true;
  };

  const handleLevelSelect = (level: CampaignLevel) => {
    console.log('handleLevelSelect called with level:', level.title);
    if (!isLevelUnlocked(level.id)) {
      console.log('Level is locked!');
      return;
    }
    console.log('Setting selected level to:', level.title);
    setSelectedLevel(level);
  };

  const handleStartLevel = () => {
    console.log('handleStartLevel called, selectedLevel:', selectedLevel);
    if (selectedLevel) {
      console.log('Starting level:', selectedLevel.title);
      onStartLevel(selectedLevel);
    } else {
      console.log('No level selected');
    }
  };

  const handleShowBriefing = () => {
    setShowBriefing(true);
  };

  const handleCloseBriefing = () => {
    setShowBriefing(false);
  };

  if (showBriefing) {
    return <CampaignBriefing onCloseBriefing={handleCloseBriefing} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-purple-950 to-black p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath d=%22M0 0h100v100H0z%22 fill=%22%23000%22/%3E%3Cpath d=%22M10 10h80v80H10z%22 fill=%22none%22 stroke=%22%23ff0000%22 stroke-width=%22.1%22 opacity=%22.1%22/%3E%3C/svg%3E')] opacity-20"></div>
        <div className="absolute animate-pulse top-20 right-20 w-4 h-4 bg-red-500/30 rounded-full"></div>
        <div className="absolute animate-bounce bottom-32 left-16 w-3 h-3 bg-yellow-500/20 rounded-full"></div>
        <div className="absolute animate-ping top-1/2 left-10 w-2 h-2 bg-blue-500/40 rounded-full"></div>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="text-white">
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            Назад
          </Button>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold horror-title text-red-400 drop-shadow-lg">
              🎆 ОПЕРАЦИЯ "НОЧНОЙ СПАСАТЕЛЬ" 🎆
            </h1>
            <p className="text-lg text-red-300">Служба экстренного реагирования</p>
            <p className="text-sm text-muted-foreground">Классификация: СЕКРЕТНО | Уровень допуска: КРАСНЫЙ</p>
          </div>
          
          <div className="text-right space-y-2">
            <Button 
              onClick={handleShowBriefing}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
            >
              <Icon name="Info" className="mr-2" size={16} />
              БРИФИНГ
            </Button>
            <div className="text-sm text-muted-foreground">Прогресс операции</div>
            <div className="text-2xl font-bold text-primary">
              {user?.campaignProgress || 1}/4
            </div>
          </div>
        </div>

        {user && <UserStatsCards user={user} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CAMPAIGN_LEVELS.map((level) => {
            const unlocked = isLevelUnlocked(level.id);
            const selected = selectedLevel?.id === level.id;
            
            return (
              <CampaignLevelCard
                key={level.id}
                level={level}
                unlocked={unlocked}
                selected={selected}
                onLevelSelect={handleLevelSelect}
              />
            );
          })}
        </div>

        {selectedLevel && (
          <CampaignBottomPanel
            selectedLevel={selectedLevel}
            onStartLevel={handleStartLevel}
            onClearSelection={() => setSelectedLevel(null)}
          />
        )}
      </div>
    </div>
  );
};