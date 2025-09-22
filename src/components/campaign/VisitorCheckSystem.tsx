import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { VisitorCheck } from './CampaignData';

interface VisitorCheckSystemProps {
  visitor: VisitorCheck;
  onCheckComplete: (success: boolean, visitorWasHuman: boolean) => void;
  onTimeUp: () => void;
}

export const VisitorCheckSystem: React.FC<VisitorCheckSystemProps> = ({
  visitor,
  onCheckComplete,
  onTimeUp
}) => {
  const [timeLeft, setTimeLeft] = useState(visitor.timeLimit);
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const [checkedMethods, setCheckedMethods] = useState<string[]>([]);
  const [robotDetected, setRobotDetected] = useState(false);
  const [showCheckMethods, setShowCheckMethods] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  const nextDialogue = () => {
    if (currentDialogue < visitor.dialogue.length - 1) {
      setCurrentDialogue(prev => prev + 1);
    } else {
      setShowCheckMethods(true);
    }
  };

  const performCheck = (methodIndex: number) => {
    const method = visitor.checkMethods[methodIndex];
    setCheckedMethods(prev => [...prev, method.action]);
    
    if (method.revealsIdentity && !visitor.isHuman) {
      setRobotDetected(true);
    }
  };

  const makeDecision = (letIn: boolean) => {
    if (!visitor.isHuman && letIn) {
      // Пропустили робота - плохо
      onCheckComplete(false, false);
    } else if (visitor.isHuman && !letIn) {
      // Не пропустили человека - плохо  
      onCheckComplete(false, true);
    } else {
      // Правильное решение
      onCheckComplete(true, visitor.isHuman);
    }
  };

  const getEyeColorDisplay = () => {
    switch (visitor.appearance.eyeColor) {
      case 'red': return '🔴 Красные глаза';
      case 'glowing': return '✨ Светящиеся глаза';
      default: return '👁️ Обычные глаза';
    }
  };

  const getMovementDisplay = () => {
    switch (visitor.appearance.movement) {
      case 'robotic': return '🤖 Роботообразные движения';
      case 'jerky': return '⚡ Дерганые движения';
      default: return '🚶 Естественные движения';
    }
  };

  const getSpeechDisplay = () => {
    switch (visitor.appearance.speech) {
      case 'monotone': return '🎵 Монотонная речь';
      case 'glitchy': return '📻 Искаженная речь';
      default: return '💬 Нормальная речь';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-gradient-to-br from-gray-900 to-gray-800 border-red-500 text-white">
        <CardHeader className="border-b border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-red-400 flex items-center">
                <Icon name="User" className="mr-2" />
                ПРОВЕРКА ПОСЕТИТЕЛЯ
              </CardTitle>
              <p className="text-sm text-gray-300">
                Имя: {visitor.name} | Причина: {visitor.reason}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                ⏱️ {timeLeft}с
              </div>
              <div className="text-xs text-gray-400">Время на проверку</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Внешний вид посетителя */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-black/30 rounded border border-gray-600">
            <div className="text-center">
              <div className="text-sm text-gray-400">Глаза</div>
              <div className="text-xs">{getEyeColorDisplay()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Движения</div>
              <div className="text-xs">{getMovementDisplay()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Речь</div>
              <div className="text-xs">{getSpeechDisplay()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Кожа</div>
              <div className="text-xs">
                {visitor.appearance.skin === 'synthetic' ? '🤖 Искусственная' : 
                 visitor.appearance.skin === 'pale' ? '👻 Бледная' : '👨 Обычная'}
              </div>
            </div>
          </div>

          {/* Диалог */}
          {!showCheckMethods && (
            <div className="space-y-4">
              <div className="bg-blue-900/30 p-4 rounded border border-blue-500/50">
                <div className="text-blue-300 text-sm mb-2">Посетитель говорит:</div>
                <div className="text-white text-lg">{visitor.dialogue[currentDialogue]}</div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={nextDialogue}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {currentDialogue < visitor.dialogue.length - 1 ? 'Продолжить диалог' : 'Перейти к проверке'}
                  <Icon name="ArrowRight" className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Методы проверки */}
          {showCheckMethods && (
            <div className="space-y-4">
              <div className="text-center text-yellow-400 font-bold text-lg">
                🔍 ВЫБЕРИТЕ СПОСОБ ПРОВЕРКИ
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visitor.checkMethods.map((method, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      checkedMethods.includes(method.action) 
                        ? 'bg-green-900/30 border-green-500' 
                        : 'bg-gray-800 border-gray-600 hover:border-yellow-500'
                    }`}
                    onClick={() => !checkedMethods.includes(method.action) && performCheck(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <Icon 
                          name={method.type === 'question' ? 'MessageCircle' : 
                                method.type === 'physical' ? 'Hand' : 'Eye'} 
                          className="mr-2 text-yellow-400" 
                        />
                        <span className="font-bold text-white">{method.action}</span>
                      </div>
                      
                      {checkedMethods.includes(method.action) && (
                        <div className="text-sm text-green-300 bg-black/30 p-2 rounded">
                          Результат: {method.response}
                          {method.revealsIdentity && (
                            <div className="text-red-400 font-bold mt-1">
                              ⚠️ РОБОТ ОБНАРУЖЕН!
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {robotDetected && (
                <div className="text-center bg-red-900/50 p-4 rounded border border-red-500 animate-pulse">
                  <div className="text-red-400 font-bold text-xl">
                    🚨 АНИМАТРОНИК ОБНАРУЖЕН! 🚨
                  </div>
                  <div className="text-red-300">Это точно не человек!</div>
                </div>
              )}

              {/* Решение */}
              <div className="flex justify-center space-x-4 pt-4 border-t border-gray-600">
                <Button 
                  onClick={() => makeDecision(false)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3"
                  size="lg"
                >
                  <Icon name="X" className="mr-2" />
                  НЕ ПУСКАТЬ
                </Button>
                <Button 
                  onClick={() => makeDecision(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3"
                  size="lg"
                >
                  <Icon name="Check" className="mr-2" />
                  ПРОПУСТИТЬ
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};