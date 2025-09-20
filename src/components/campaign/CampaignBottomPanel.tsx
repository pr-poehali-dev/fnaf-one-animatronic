import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { CampaignLevel } from './CampaignData';

interface CampaignBottomPanelProps {
  selectedLevel: CampaignLevel;
  onStartLevel: () => void;
  onClearSelection: () => void;
}

export const CampaignBottomPanel: React.FC<CampaignBottomPanelProps> = ({
  selectedLevel,
  onStartLevel,
  onClearSelection
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-950 via-red-800 to-red-950 border-t-4 border-red-500 shadow-2xl z-50">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-red-500/20 rounded-lg border border-red-500/50">
              <Icon name="AlertTriangle" className="text-red-400" size={32} />
            </div>
            <div className="text-white space-y-1">
              <div className="text-xs text-red-300 font-mono">МИССИЯ #{selectedLevel.id.toString().padStart(3, '0')} | СТАТУС: ГОТОВНОСТЬ К ЗАПУСКУ</div>
              <h3 className="text-2xl font-bold horror-title">🎯 {selectedLevel.title}</h3>
              <p className="text-red-200">⚠️ Подтвердите готовность к началу операции и нажмите кнопку запуска</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={onClearSelection}
              variant="outline"
              className="border-gray-500 text-gray-300 hover:bg-gray-500/20 px-6 py-3"
            >
              <Icon name="X" className="mr-2" size={20} />
              ОТМЕНА
            </Button>
            <Button 
              onClick={onStartLevel}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl px-12 py-4 shadow-2xl transform hover:scale-105 transition-all border-2 border-red-400 animate-pulse"
              size="lg"
            >
              <Icon name="Rocket" className="mr-3" size={28} />
              🚀 НАЧАТЬ МИССИЮ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};