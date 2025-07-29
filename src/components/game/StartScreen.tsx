import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface StartScreenProps {
  onStartGame: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="p-8 bg-card border-primary text-center max-w-2xl">
        <h1 className="horror-title text-8xl text-primary mb-6 glitch">FNAF</h1>
        <h2 className="text-3xl font-bold mb-4">Five Nights at Freddy's</h2>
        <p className="text-lg mb-8 text-muted-foreground">
          Выживи одну ночь в пиццерии с аниматроником Фредди. 
          Используй камеры для наблюдения и двери для защиты. 
          Береги энергию - она ограничена!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center gap-3 p-4 border rounded-lg">
            <Icon name="Camera" size={32} className="text-primary" />
            <span className="font-semibold">Следи за Фредди</span>
            <span className="text-sm text-muted-foreground">Наблюдение замедляет его</span>
          </div>
          <div className="flex flex-col items-center gap-3 p-4 border rounded-lg">
            <Icon name="Lock" size={32} className="text-primary" />
            <span className="font-semibold">Закрывай двери</span>
            <span className="text-sm text-muted-foreground">Но это тратит энергию</span>
          </div>
          <div className="flex flex-col items-center gap-3 p-4 border rounded-lg">
            <Icon name="Battery" size={32} className="text-primary" />
            <span className="font-semibold">Экономь энергию</span>
            <span className="text-sm text-muted-foreground">Без неё ты беззащитен</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold">Выбери сложность:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button onClick={() => onStartGame('easy')} size="lg" variant="outline" className="text-green-500 border-green-500">
              Легко
            </Button>
            <Button onClick={() => onStartGame('medium')} size="lg" className="bg-primary hover:bg-primary/80">
              Средне
            </Button>
            <Button onClick={() => onStartGame('hard')} size="lg" variant="outline" className="text-red-500 border-red-500">
              Сложно
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StartScreen;