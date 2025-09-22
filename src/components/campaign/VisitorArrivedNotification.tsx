import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface VisitorArrivedNotificationProps {
  visitorName: string;
  visitorReason: string;
  onAcceptCheck: () => void;
}

export const VisitorArrivedNotification: React.FC<VisitorArrivedNotificationProps> = ({
  visitorName,
  visitorReason,
  onAcceptCheck
}) => {
  return (
    <div className="fixed top-4 right-4 z-40 animate-bounce">
      <Card className="bg-blue-900/90 border-blue-500 shadow-2xl min-w-[300px]">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-full">
              <Icon name="Bell" className="text-blue-400 animate-ping" size={24} />
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">🚪 ПОСЕТИТЕЛЬ!</div>
              <div className="text-blue-300 text-xs">{visitorName}</div>
              <div className="text-blue-200 text-xs">{visitorReason}</div>
            </div>
            <Button 
              onClick={onAcceptCheck}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              <Icon name="User" className="mr-1" size={16} />
              ПРОВЕРИТЬ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};