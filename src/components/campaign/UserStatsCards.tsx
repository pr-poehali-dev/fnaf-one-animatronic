import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/components/AuthSystem';

interface UserStatsCardsProps {
  user: User;
}

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({ user }) => {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-gradient-to-r from-green-900/20 to-green-700/20 border-green-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-500/5"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center text-green-400">
            <Icon name="Shield" className="mr-2" />
            ОПЕРАТОР: {user.username}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-black/20 rounded border border-green-500/20">
              <div className="text-3xl font-bold text-green-400">
                {user.stats.peopleSaved}
              </div>
              <div className="text-sm text-green-300">🚑 Спасено</div>
            </div>
            <div className="text-center p-3 bg-black/20 rounded border border-blue-500/20">
              <div className="text-3xl font-bold text-blue-400">
                {user.stats.nightsSurvived}
              </div>
              <div className="text-sm text-blue-300">🌙 Ночей выжил</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-red-900/20 to-red-700/20 border-red-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/5"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center text-red-400">
            <Icon name="AlertTriangle" className="mr-2" />
            СТАТУС МИССИИ
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-black/20 rounded border border-red-500/20">
              <div className="text-3xl font-bold text-red-400">
                {user.stats.peopleLost}
              </div>
              <div className="text-sm text-red-300">☠️ Потеряно</div>
            </div>
            <div className="text-center p-3 bg-black/20 rounded border border-yellow-500/20">
              <div className="text-3xl font-bold text-yellow-400">
                {Math.floor(user.stats.totalPlayTime / 60)}ч
              </div>
              <div className="text-sm text-yellow-300">⏱️ На службе</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};