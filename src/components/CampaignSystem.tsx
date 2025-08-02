import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useAuth } from './AuthSystem';

export interface CampaignLevel {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'nightmare';
  unlocked: boolean;
  completed: boolean;
  objectives: string[];
  radioCalls: RadioCall[];
  rewards: {
    experience: number;
    unlocks: string[];
  };
}

export interface RadioCall {
  id: string;
  caller: string;
  situation: string;
  description: string;
  choices: {
    text: string;
    correct: boolean;
    result: string;
  }[];
  timeLimit: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

const CAMPAIGN_LEVELS: CampaignLevel[] = [
  {
    id: 1,
    title: "Первая смена",
    description: "Твоя первая ночь на работе. Изучи основы безопасности и спаси жизни по рации.",
    difficulty: 'easy',
    unlocked: true,
    completed: false,
    objectives: [
      "Продержаться до 6 утра",
      "Ответить на все вызовы по рации",
      "Не потерять больше 1 человека"
    ],
    radioCalls: [
      {
        id: "lost_forest",
        caller: "Турист Алексей",
        situation: "Заблудился в лесу",
        description: "Помогите! Я заблудился в темном лесу. Вижу две тропы - одна идет налево к свету фонарей, другая направо в глубь леса. Слышу странные звуки...",
        choices: [
          {
            text: "Иди к свету фонарей (налево)",
            correct: true,
            result: "Алексей добрался до дороги в безопасности! Спасен!"
          },
          {
            text: "Иди в глубь леса (направо)", 
            correct: false,
            result: "Алексей углубился в лес и попал к маньяку... Погиб."
          }
        ],
        timeLimit: 30,
        urgency: 'high'
      }
    ],
    rewards: {
      experience: 100,
      unlocks: ["Уровень 2"]
    }
  },
  {
    id: 2,
    title: "Ночь ужаса",
    description: "Фредди стал агрессивнее. Больше вызовов, больше ответственности.",
    difficulty: 'medium',
    unlocked: false,
    completed: false,
    objectives: [
      "Продержаться до 6 утра",
      "Ответить на все вызовы по рации",
      "Спасти минимум 3 человек",
      "Не тратить энергию зря"
    ],
    radioCalls: [
      {
        id: "burning_house",
        caller: "Мать семейства Анна",
        situation: "Пожар в доме",
        description: "У нас пожар! Дым везде! Есть два выхода - главный через прихожую, но там много дыма, или через окно на втором этаже. Что делать?!",
        choices: [
          {
            text: "Прикройте нос и идите через прихожую",
            correct: false,
            result: "Семья отравилась дымом и погибла в коридоре..."
          },
          {
            text: "Выпрыгивайте из окна на второй этаж",
            correct: true,
            result: "Семья успешно спаслась через окно! Все живы!"
          }
        ],
        timeLimit: 25,
        urgency: 'critical'
      },
      {
        id: "car_accident",
        caller: "Водитель Сергей",
        situation: "Авария на дороге",
        description: "Попал в аварию! Машина перевернулась, бензин подтекает. Пытаться выбраться самому или ждать спасателей? Очень болит нога...",
        choices: [
          {
            text: "Не двигайтесь, ждите спасателей",
            correct: true,
            result: "Сергей дождался помощи и был спасен медиками!"
          },
          {
            text: "Пытайтесь выбраться сами",
            correct: false,
            result: "При попытке выбраться машина загорелась... Сергей погиб."
          }
        ],
        timeLimit: 35,
        urgency: 'high'
      }
    ],
    rewards: {
      experience: 200,
      unlocks: ["Уровень 3", "Новые звуки рации"]
    }
  },
  {
    id: 3,
    title: "Кризисная ночь",
    description: "Катастрофа в городе. Множественные чрезвычайные ситуации. Каждое решение критично.",
    difficulty: 'hard',
    unlocked: false,
    completed: false,
    objectives: [
      "Продержаться до 6 утра",
      "Спасти минимум 5 человек",
      "Время ответа не более 20 секунд",
      "Выжить при максимальной агрессии Фредди"
    ],
    radioCalls: [
      {
        id: "subway_collapse",
        caller: "Машинист метро Павел",
        situation: "Обрушение в метро",
        description: "Туннель обрушился! У меня полный вагон людей. Воздуха мало. Пытаться эвакуировать через служебный туннель или ждать спасательную команду?",
        choices: [
          {
            text: "Ведите людей через служебный туннель",
            correct: false,
            result: "Служебный туннель тоже обрушился... Все погибли."
          },
          {
            text: "Сохраняйте воздух, ждите спасателей",
            correct: true,
            result: "Спасательная команда пробилась вовремя! Все спасены!"
          }
        ],
        timeLimit: 20,
        urgency: 'critical'
      },
      {
        id: "hostage_situation",
        caller: "Заложница Мария",
        situation: "Захват заложников",
        description: "Меня захватили! Преступник требует деньги. Я могу попытаться убежать через заднюю дверь или дождаться полиции...",
        choices: [
          {
            text: "Ждите полицию, не рискуйте",
            correct: true,
            result: "Полиция арестовала преступника! Мария спасена!"
          },
          {
            text: "Попытайтесь убежать",
            correct: false,
            result: "Преступник заметил попытку побега... Мария убита."
          }
        ],
        timeLimit: 15,
        urgency: 'critical'
      }
    ],
    rewards: {
      experience: 500,
      unlocks: ["Финальный уровень", "Мастер спасатель"]
    }
  }
];

export const CampaignScreen: React.FC<{ onBack: () => void; onStartLevel: (level: CampaignLevel) => void }> = ({ 
  onBack, onStartLevel 
}) => {
  const { user, saveProgress } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<CampaignLevel | null>(null);

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

  const isLevelUnlocked = (levelId: number) => {
    if (!user) return levelId === 1;
    const unlocked = user.unlockedLevels.includes(levelId);
    console.log(`Level ${levelId} unlocked:`, unlocked, 'User unlocked levels:', user.unlockedLevels);
    // Временно разблокируем все уровни для тестирования
    return true; // unlocked;
  };

  const handleLevelSelect = (level: CampaignLevel) => {
    if (!isLevelUnlocked(level.id)) return;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-red-900 to-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="text-white">
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            Назад
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold horror-title text-red-400">
              РЕЖИМ КАМПАНИИ
            </h1>
            <p className="text-muted-foreground">Спасай жизни. Переживи ужас.</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Прогресс</div>
            <div className="text-lg font-bold text-primary">
              {user?.campaignProgress || 1}/3
            </div>
          </div>
        </div>

        {user && (
          <Card className="mb-6 bg-card/80 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Icon name="User" className="mr-2" />
                {user.username} - Статистика
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {user.stats.peopleSaved}
                  </div>
                  <div className="text-sm text-muted-foreground">Спасено</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {user.stats.peopleLost}
                  </div>
                  <div className="text-sm text-muted-foreground">Потеряно</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {user.stats.nightsSurvived}
                  </div>
                  <div className="text-sm text-muted-foreground">Ночей</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {Math.floor(user.stats.totalPlayTime / 60)}ч
                  </div>
                  <div className="text-sm text-muted-foreground">Время игры</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CAMPAIGN_LEVELS.map((level) => {
            const unlocked = isLevelUnlocked(level.id);
            const selected = selectedLevel?.id === level.id;
            
            return (
              <Card
                key={level.id}
                className={`transition-all cursor-pointer transform hover:scale-105 ${
                  unlocked
                    ? selected
                      ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20'
                      : 'bg-card/80 border-muted hover:border-primary/50'
                    : 'bg-muted/20 border-muted/50 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => unlocked && handleLevelSelect(level)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`flex items-center ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      <Icon 
                        name={getDifficultyIcon(level.difficulty)} 
                        className={`mr-2 ${getDifficultyColor(level.difficulty)}`} 
                        size={24} 
                      />
                      Уровень {level.id}: {level.title}
                    </CardTitle>
                    {!unlocked && <Icon name="Lock" className="text-muted-foreground" size={20} />}
                  </div>
                  <div className={`text-sm ${getDifficultyColor(level.difficulty)} font-semibold uppercase`}>
                    {level.difficulty === 'easy' && 'Легко'}
                    {level.difficulty === 'medium' && 'Средне'}
                    {level.difficulty === 'hard' && 'Сложно'}
                    {level.difficulty === 'nightmare' && 'Кошмар'}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4">{level.description}</p>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-primary">Цели:</div>
                    {level.objectives.map((objective, idx) => (
                      <div key={idx} className="text-sm flex items-center">
                        <Icon name="Target" className="mr-2 text-yellow-400" size={14} />
                        {objective}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Вызовов по рации: {level.radioCalls.length}
                    </div>
                    <div className="text-sm text-primary">
                      +{level.rewards.experience} опыта
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedLevel && (
          <Card className="mt-6 bg-primary/10 border-primary">
            <CardHeader>
              <CardTitle className="text-primary">
                Выбран: {selectedLevel.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-2">
                    Готов начать миссию? Помни - каждое решение влияет на жизни людей.
                  </p>
                  <div className="text-sm text-yellow-400">
                    ⚠️ Во время игры будут поступать экстренные вызовы по рации
                  </div>
                </div>
                <Button 
                  onClick={handleStartLevel}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <Icon name="Play" className="mr-2" />
                  Начать миссию
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};