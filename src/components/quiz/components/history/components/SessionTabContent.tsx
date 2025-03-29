
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { QuizSessionSummary } from '@/types/quiz-session';
import SessionsTable from './SessionsTable';

interface SessionTabContentProps {
  value: string;
  sessions: QuizSessionSummary[];
  onViewSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

const SessionTabContent: React.FC<SessionTabContentProps> = ({
  value,
  sessions,
  onViewSession,
  onDeleteSession,
}) => {
  return (
    <TabsContent value={value} className="mt-4">
      <SessionsTable
        sessions={sessions}
        onViewSession={onViewSession}
        onDeleteSession={onDeleteSession}
      />
    </TabsContent>
  );
};

export default SessionTabContent;
