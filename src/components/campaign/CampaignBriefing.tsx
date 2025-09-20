import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface CampaignBriefingProps {
  onCloseBriefing: () => void;
}

export const CampaignBriefing: React.FC<CampaignBriefingProps> = ({ onCloseBriefing }) => {
  return (
    <div className="min-h-screen bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-purple-900/20 to-black opacity-50"></div>
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-2 h-2 bg-red-500 animate-ping"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-yellow-500 animate-pulse"></div>
        <div className="absolute bottom-20 left-32 w-3 h-3 bg-blue-500 animate-bounce"></div>
        <div className="absolute bottom-40 right-10 w-2 h-2 bg-green-500 animate-ping"></div>
      </div>
      
      <Card className="max-w-4xl w-full bg-card/90 border-red-500/50 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl horror-title text-red-400">
            📻 БРИФИНГ СМЕНЫ
          </CardTitle>
          <div className="text-lg text-muted-foreground">
            Внимание, оператор! Ознакомьтесь с протоколом безопасности.
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary flex items-center">
                <Icon name="AlertTriangle" className="mr-2" />
                УГРОЗЫ
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center p-3 bg-red-900/30 rounded border border-red-500/30">
                  <Icon name="Skull" className="mr-2 text-red-400" size={16} />
                  <span>Фредди Фазбер - агрессивный аниматроник</span>
                </div>
                <div className="flex items-center p-3 bg-orange-900/30 rounded border border-orange-500/30">
                  <Icon name="Zap" className="mr-2 text-orange-400" size={16} />
                  <span>Ограниченный заряд батареи (100%)</span>
                </div>
                <div className="flex items-center p-3 bg-yellow-900/30 rounded border border-yellow-500/30">
                  <Icon name="Clock" className="mr-2 text-yellow-400" size={16} />
                  <span>Смена длится 6 часов (00:00 - 06:00)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary flex items-center">
                <Icon name="Radio" className="mr-2" />
                РАЦИЯ
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center p-3 bg-blue-900/30 rounded border border-blue-500/30">
                  <Icon name="Users" className="mr-2 text-blue-400" size={16} />
                  <span>Экстренные вызовы от граждан</span>
                </div>
                <div className="flex items-center p-3 bg-green-900/30 rounded border border-green-500/30">
                  <Icon name="Timer" className="mr-2 text-green-400" size={16} />
                  <span>Ограниченное время на ответ</span>
                </div>
                <div className="flex items-center p-3 bg-purple-900/30 rounded border border-purple-500/30">
                  <Icon name="Heart" className="mr-2 text-purple-400" size={16} />
                  <span>Каждое решение влияет на жизни</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-muted pt-6">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
              <Icon name="Target" className="mr-2" />
              ЗАДАЧА СМЕНЫ
            </h3>
            <div className="bg-card/50 p-6 rounded-lg border border-primary/30">
              <p className="text-lg leading-relaxed">
                Твоя задача - <span className="text-red-400 font-bold">выжить до рассвета</span> и 
                <span className="text-green-400 font-bold"> спасти как можно больше людей</span>. 
                Используй камеры для отслеживания Фредди, управляй дверями для защиты, 
                и принимай <span className="text-yellow-400 font-bold">быстрые решения</span> по рации. 
                Помни: каждая ошибка может стоить чьей-то жизни.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button 
              onClick={onCloseBriefing}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-bold"
              size="lg"
            >
              <Icon name="CheckCircle" className="mr-2" />
              ПОНЯЛ, ГОТОВ К РАБОТЕ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};