import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { RadioCall } from './CampaignSystem';

interface RadioSystemProps {
  radioCalls: RadioCall[];
  onCallComplete: (callId: string, success: boolean) => void;
  gameActive: boolean;
}

interface ActiveCall {
  call: RadioCall;
  timeLeft: number;
  answered: boolean;
  showResult: boolean;
  result?: string;
  success?: boolean;
}

export const RadioSystem: React.FC<RadioSystemProps> = ({ 
  radioCalls, onCallComplete, gameActive 
}) => {
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [callQueue, setCallQueue] = useState<RadioCall[]>([]);
  const [callHistory, setCallHistory] = useState<{call: RadioCall, success: boolean, result: string}[]>([]);
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (gameActive && radioCalls.length > 0) {
      setCallQueue([...radioCalls]);
      
      const firstCallDelay = Math.random() * 30000 + 10000;
      setTimeout(() => {
        triggerNextCall();
      }, firstCallDelay);
    }
  }, [gameActive, radioCalls]);

  const triggerNextCall = () => {
    setCallQueue(prev => {
      if (prev.length === 0 || activeCall) return prev;
      
      const nextCall = prev[0];
      const remainingCalls = prev.slice(1);
      
      setActiveCall({
        call: nextCall,
        timeLeft: nextCall.timeLimit,
        answered: false,
        showResult: false
      });
      
      setIsRadioOpen(true);
      
      if (remainingCalls.length > 0) {
        const nextDelay = Math.random() * 60000 + 45000;
        setTimeout(() => {
          if (!activeCall) triggerNextCall();
        }, nextDelay);
      }
      
      return remainingCalls;
    });
  };

  useEffect(() => {
    if (activeCall && !activeCall.answered && !activeCall.showResult) {
      timerRef.current = setInterval(() => {
        setActiveCall(prev => {
          if (!prev) return null;
          
          const newTimeLeft = prev.timeLeft - 1;
          
          if (newTimeLeft <= 0) {
            const timeoutResult = {
              call: prev.call,
              success: false,
              result: "Время вышло... Человек погиб из-за того что вы не ответили."
            };
            
            setCallHistory(history => [...history, timeoutResult]);
            onCallComplete(prev.call.id, false);
            
            setTimeout(() => {
              setActiveCall(null);
              setTimeout(triggerNextCall, 5000);
            }, 3000);
            
            return {
              ...prev,
              timeLeft: 0,
              showResult: true,
              result: timeoutResult.result,
              success: false
            };
          }
          
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeCall?.answered, activeCall?.showResult]);

  const handleChoice = (choiceIndex: number) => {
    if (!activeCall || activeCall.answered) return;
    
    const choice = activeCall.call.choices[choiceIndex];
    const success = choice.correct;
    
    const result = {
      call: activeCall.call,
      success,
      result: choice.result
    };
    
    setCallHistory(history => [...history, result]);
    onCallComplete(activeCall.call.id, success);
    
    setActiveCall(prev => prev ? {
      ...prev,
      answered: true,
      showResult: true,
      result: choice.result,
      success
    } : null);
    
    setTimeout(() => {
      setActiveCall(null);
      setTimeout(triggerNextCall, 5000);
    }, 4000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'high': return 'text-orange-400 border-orange-400';
      case 'critical': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'Info';
      case 'medium': return 'AlertTriangle';
      case 'high': return 'AlertCircle';
      case 'critical': return 'Zap';
      default: return 'Radio';
    }
  };

  if (!gameActive) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsRadioOpen(!isRadioOpen)}
          className={`rounded-full w-16 h-16 ${
            activeCall ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Icon name="Radio" size={24} />
          {activeCall && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              !
            </div>
          )}
        </Button>
      </div>

      {isRadioOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-card/95 border-primary/50 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-primary">
                  <Icon name="Radio" className="mr-2" />
                  Аварийная рация
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsRadioOpen(false)}
                  disabled={activeCall && !activeCall.showResult}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {activeCall ? (
                <div className="space-y-4">
                  <div className={`border-2 rounded-lg p-4 ${getUrgencyColor(activeCall.call.urgency)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Icon 
                          name={getUrgencyIcon(activeCall.call.urgency)} 
                          className={`mr-2 ${getUrgencyColor(activeCall.call.urgency).split(' ')[0]}`}
                        />
                        <span className="font-semibold">
                          {activeCall.call.caller} - {activeCall.call.situation}
                        </span>
                      </div>
                      {!activeCall.showResult && (
                        <div className="text-lg font-bold">
                          {activeCall.timeLeft}с
                        </div>
                      )}
                    </div>
                    
                    {!activeCall.showResult && (
                      <Progress 
                        value={(activeCall.timeLeft / activeCall.call.timeLimit) * 100} 
                        className="mb-3"
                      />
                    )}
                    
                    <p className="text-foreground mb-4">
                      {activeCall.call.description}
                    </p>
                    
                    {activeCall.showResult ? (
                      <div className="bg-background/50 rounded-lg p-4">
                        <div className={`text-lg font-bold mb-2 ${
                          activeCall.success ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {activeCall.success ? '✓ СПАСЕН!' : '✗ ПОГИБ...'}
                        </div>
                        <p className="text-foreground">
                          {activeCall.result}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-primary mb-2">
                          Ваш ответ:
                        </div>
                        {activeCall.call.choices.map((choice, index) => (
                          <Button
                            key={index}
                            onClick={() => handleChoice(index)}
                            className={`w-full text-left justify-start h-auto py-3 px-4 ${
                              index === 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                            disabled={activeCall.answered}
                          >
                            <div className="flex items-start">
                              <div className="mr-3 mt-1">
                                {String.fromCharCode(65 + index)}:
                              </div>
                              <div>{choice.text}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Icon name="Radio" className="mx-auto mb-4" size={48} />
                  <p>Ожидание вызовов...</p>
                  {callQueue.length > 0 && (
                    <p className="text-sm mt-2">
                      Осталось вызовов: {callQueue.length}
                    </p>
                  )}
                </div>
              )}
              
              {callHistory.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-primary mb-2">
                    История вызовов:
                  </h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {callHistory.map((entry, index) => (
                      <div 
                        key={index}
                        className={`text-xs p-2 rounded ${
                          entry.success ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                        }`}
                      >
                        <div className="font-semibold">
                          {entry.call.caller}: {entry.success ? 'СПАСЕН' : 'ПОГИБ'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};