
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QuizSessionSummary } from '@/types/quiz-session';
import SessionItem from './SessionItem';

interface SessionsTableProps {
  sessions: QuizSessionSummary[];
  onViewSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

const SessionsTable: React.FC<SessionsTableProps> = ({ 
  sessions, 
  onViewSession, 
  onDeleteSession 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map(session => (
            <SessionItem 
              key={session.id} 
              session={session} 
              onView={onViewSession} 
              onDelete={onDeleteSession} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionsTable;
