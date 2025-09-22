import React, { useEffect, useState } from 'react';
import { VisitorCheck } from './CampaignData';
import { VisitorArrivedNotification } from './VisitorArrivedNotification';

interface VisitorManagerProps {
  visitors: VisitorCheck[];
  gameActive: boolean;
  onVisitorArrived: (visitor: VisitorCheck) => void;
}

export const VisitorManager: React.FC<VisitorManagerProps> = ({
  visitors,
  gameActive,
  onVisitorArrived
}) => {
  const [visitorsShown, setVisitorsShown] = useState<string[]>([]);
  const [pendingVisitor, setPendingVisitor] = useState<VisitorCheck | null>(null);

  useEffect(() => {
    if (!gameActive || visitors.length === 0) return;

    const intervals: NodeJS.Timeout[] = [];

    // Запускаем посетителей через случайные интервалы
    visitors.forEach((visitor, index) => {
      const delay = (index + 1) * 30000 + Math.random() * 20000; // 30-50 секунд между посетителями
      
      const timeout = setTimeout(() => {
        if (!visitorsShown.includes(visitor.id) && !pendingVisitor) {
          setVisitorsShown(prev => [...prev, visitor.id]);
          setPendingVisitor(visitor);
        }
      }, delay);

      intervals.push(timeout);
    });

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, [gameActive, visitors, pendingVisitor]);

  // Сброс при новой игре
  useEffect(() => {
    if (!gameActive) {
      setVisitorsShown([]);
      setPendingVisitor(null);
    }
  }, [gameActive]);

  const handleAcceptCheck = () => {
    if (pendingVisitor) {
      onVisitorArrived(pendingVisitor);
      setPendingVisitor(null);
    }
  };

  return (
    <>
      {pendingVisitor && (
        <VisitorArrivedNotification
          visitorName={pendingVisitor.name}
          visitorReason={pendingVisitor.reason}
          onAcceptCheck={handleAcceptCheck}
        />
      )}
    </>
  );
};