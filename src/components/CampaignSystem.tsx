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
    title: "Первая смена в аду",
    description: "Добро пожаловать в службу экстренного реагирования. Сегодня твоя первая ночь, и город полон опасностей. Фредди становится агрессивнее с каждым часом, а по рации поступают отчаянные вызовы о помощи. Сможешь ли ты продержаться до рассвета и спасти невинных людей?",
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
    title: "Кровавая полночь",
    description: "Второй день работы, но ты уже не новичок. Криминальная активность в городе возросла в разы. Пожары, аварии, нападения - хаос не прекращается. Фредди чувствует твой страх и становится более непредсказуемым. Каждое твое решение определит, кто увидит рассвет.",
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
    title: "Апокалипсис сегодня",
    description: "Город на грани хаоса. Массовые катастрофы, террористические акты, природные бедствия - все происходит одновременно. Фредди достиг пика агрессии и охотится за тобой с безумной яростью. Время на принятие решений сокращается, а цена ошибки - человеческие жизни. Финальное испытание твоих навыков.",
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
  },
  {
    id: 4,
    title: "Последняя надежда",
    description: "Секретный финальный уровень. Город охвачен пламенем, люди в панике бегут по улицам. Ты - последняя надежда на спасение. Фредди превратился в кошмарное чудовище, а вызовы по рации поступают каждые 10 секунд. Сможешь ли ты стать легендой и спасти город от полного уничтожения?",
    difficulty: 'nightmare',
    unlocked: false,
    completed: false,
    objectives: [
      "Продержаться до 6 утра в кошмарном режиме",
      "Спасти минимум 10 человек",
      "Время ответа не более 10 секунд",
      "Выжить при максимальной агрессии Фредди",
      "Не потерять больше 2 человек"
    ],
    radioCalls: [],
    rewards: {
      experience: 1000,
      unlocks: ["Герой города", "Кошмарный режим"]
    }
  }
];

export const CampaignScreen: React.FC<{ onBack: () => void; onStartLevel: (level: CampaignLevel) => void }> = ({ 
  onBack, onStartLevel 
}) => {
  const { user, saveProgress } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<CampaignLevel | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);

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
                onClick={handleCloseBriefing}
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

        {user && (
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
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CAMPAIGN_LEVELS.map((level) => {
            const unlocked = isLevelUnlocked(level.id);
            const selected = selectedLevel?.id === level.id;
            
            return (
              <Card
                key={level.id}
                className={`relative transition-all cursor-pointer transform hover:scale-105 overflow-hidden ${
                  unlocked
                    ? selected
                      ? 'bg-gradient-to-br from-red-900/30 to-purple-900/30 border-red-500 shadow-lg shadow-red-500/30'
                      : 'bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-600 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20'
                    : 'bg-gradient-to-br from-gray-900/20 to-gray-800/20 border-gray-700/50 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => unlocked && handleLevelSelect(level)}
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
          })}
        </div>

        {selectedLevel && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-950 via-red-800 to-red-950 border-t-4 border-red-500 shadow-2xl z-50">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 max-w-6xl mx-auto p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-red-500/20 rounded-lg border border-red-500/50">
                    <Icon name="AlertTriangle" className="text-red-400" size={32} />
                  </div>
                  <div className="text-white space-y-1">
                    <div className="text-xs text-red-300 font-mono">МИССИЯ #{selectedLevel.id.toString().padStart(3, '0')} | СТАТУС: ГОТОВОСТЬ К ЗАПУСКУ</div>
                    <h3 className="text-2xl font-bold horror-title">🎯 {selectedLevel.title}</h3>
                    <p className="text-red-200">⚠️ Подтвердите готовность к началу операции и нажмите кнопку запуска</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={() => setSelectedLevel(null)}
                    variant="outline"
                    className="border-gray-500 text-gray-300 hover:bg-gray-500/20 px-6 py-3"
                  >
                    <Icon name="X" className="mr-2" size={20} />
                    ОТМЕНА
                  </Button>
                  <Button 
                    onClick={handleStartLevel}
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
        )}
      </div>
    </div>
  );
};