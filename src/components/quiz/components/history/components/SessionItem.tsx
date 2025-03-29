
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Clock, Eye, Trash2 } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuizSessionSummary } from '@/types/quiz-session';

interface SessionItemProps {
  session: QuizSessionSummary;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, onView, onDelete }) => {
  const formattedDate = format(parseISO(session.date), 'MMM d, yyyy h:mm a');
  const minutes = Math.floor(session.timeSpent / 60000);
  const seconds = Math.floor((session.timeSpent % 60000) / 1000);
  
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{formattedDate}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <span className={`font-semibold ${
            session.scorePercentage >= 80 ? 'text-green-500' : 
            session.scorePercentage >= 60 ? 'text-amber-500' : 'text-red-500'
          }`}>
            {session.scorePercentage}%
          </span>
          <span className="text-muted-foreground ml-2">
            ({session.correctAnswers}/{session.totalQuestions})
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={
          session.difficulty === 'Easy' ? 'outline' : 
          session.difficulty === 'Medium' ? 'secondary' : 'destructive'
        }>
          {session.difficulty}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
          <span>{minutes}m {seconds}s</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onView(session.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(session.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default SessionItem;
