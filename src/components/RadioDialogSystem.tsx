import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { RadioCall } from './CampaignSystem';

interface RadioDialogProps {
  radioCall: RadioCall;
  onChoice: (choiceIndex: number, correct: boolean, result: string) => void;
  onTimeUp: () => void;
}

export const RadioDialog: React.FC<RadioDialogProps> = ({ 
  radioCall, onChoice, onTimeUp 
}) => {
  const [timeLeft, setTimeLeft] = useState(radioCall.timeLimit);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (isAnswered || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, onTimeUp]);

  const handleChoice = (choiceIndex: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    const choice = radioCall.choices[choiceIndex];
    onChoice(choiceIndex, choice.correct, choice.result);
  };

  const getUrgencyColor = () => {
    switch (radioCall.urgency) {
      case 'low': return 'border-green-500 bg-green-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'critical': return 'border-red-500 bg-red-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getUrgencyText = () => {
    switch (radioCall.urgency) {
      case 'low': return 'НИЗКАЯ';
      case 'medium': return 'СРЕДНЯЯ';
      case 'high': return 'ВЫСОКАЯ';
      case 'critical': return 'КРИТИЧЕСКАЯ';
      default: return 'НЕИЗВЕСТНО';
    }
  };

  const progressPercent = (timeLeft / radioCall.timeLimit) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`max-w-2xl w-full ${getUrgencyColor()} border-2 shadow-2xl`}>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-white">
              <Icon name="Radio" className="mr-3 text-blue-400" size={24} />
              📻 ЭКСТРЕННЫЙ ВЫЗОВ
            </CardTitle>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              radioCall.urgency === 'critical' ? 'bg-red-500 text-white' :
              radioCall.urgency === 'high' ? 'bg-orange-500 text-white' :
              radioCall.urgency === 'medium' ? 'bg-yellow-500 text-black' :
              'bg-green-500 text-white'
            }`}>
              {getUrgencyText()}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Абонент: <span className="text-white font-semibold">{radioCall.caller}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Ситуация: <span className="text-red-400 font-semibold">{radioCall.situation}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Время на ответ:</span>
              <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                {timeLeft}с
              </span>
            </div>
            <Progress 
              value={progressPercent} 
              className={`h-2 ${timeLeft <= 10 ? 'progress-critical' : ''}`}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-black/40 p-4 rounded-lg border border-muted">
            <div className="text-lg text-white leading-relaxed">
              {radioCall.description}
            </div>
          </div>

          {!isAnswered && timeLeft > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-primary">
                Ваш ответ:
              </div>
              {radioCall.choices.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => handleChoice(index)}
                  variant="outline"
                  className="w-full p-4 h-auto text-left justify-start hover:bg-primary/20 hover:border-primary"
                  disabled={isAnswered}
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="text-wrap">{choice.text}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {(isAnswered || timeLeft <= 0) && (
            <div className="text-center text-muted-foreground">
              Ответ отправлен...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface RadioSystemProps {
  radioCalls: RadioCall[];
  onAllCallsComplete: (results: { saved: number; lost: number }) => void;
}

export const RadioSystem: React.FC<RadioSystemProps> = ({ 
  radioCalls, onAllCallsComplete 
}) => {
  const [currentCallIndex, setCurrentCallIndex] = useState(0);
  const [results, setResults] = useState<{ saved: number; lost: number }>({ saved: 0, lost: 0 });
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');

  useEffect(() => {
    if (currentCallIndex >= radioCalls.length) {
      onAllCallsComplete(results);
    }
  }, [currentCallIndex, radioCalls.length, results, onAllCallsComplete]);

  const handleChoice = (choiceIndex: number, correct: boolean, result: string) => {
    setLastResult(result);
    setShowResult(true);
    
    setResults(prev => ({
      saved: prev.saved + (correct ? 1 : 0),
      lost: prev.lost + (correct ? 0 : 1)
    }));

    setTimeout(() => {
      setShowResult(false);
      setCurrentCallIndex(prev => prev + 1);
    }, 3000);
  };

  const handleTimeUp = () => {
    handleChoice(-1, false, "Время вышло! Человек погиб из-за отсутствия помощи...");
  };

  if (currentCallIndex >= radioCalls.length) {
    return null;
  }

  if (showResult) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-card/90 border-primary">
          <CardContent className="p-8 text-center space-y-4">
            <Icon 
              name={lastResult.includes('спас') || lastResult.includes('Спас') ? 'CheckCircle' : 'XCircle'} 
              className={`mx-auto ${lastResult.includes('спас') || lastResult.includes('Спас') ? 'text-green-400' : 'text-red-400'}`} 
              size={48} 
            />
            <div className="text-lg font-semibold text-white">
              {lastResult}
            </div>
            <div className="text-sm text-muted-foreground">
              Переход к следующему вызову...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <RadioDialog
      radioCall={radioCalls[currentCallIndex]}
      onChoice={handleChoice}
      onTimeUp={handleTimeUp}
    />
  );
};