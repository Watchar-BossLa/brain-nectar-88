
import React, { useState } from 'react';
import { useSessionHistory } from '../../hooks/adaptive-quiz/useSessionHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Clock, Eye, Trophy, Calendar, Award, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { QuizSessionSummary } from '@/types/quiz-session';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NoSessionsMessage: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Trophy className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
    <h3 className="text-xl font-medium mb-2">No Quiz History</h3>
    <p className="text-muted-foreground max-w-md">
      You haven't taken any quizzes yet. Start a quiz to track your progress and see your history here.
    </p>
    <Button variant="outline" className="mt-6">Take a Quiz</Button>
  </div>
);

const SessionItem: React.FC<{
  session: QuizSessionSummary;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ session, onView, onDelete }) => {
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

const SessionsTable: React.FC<{
  sessions: QuizSessionSummary[];
  onViewSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}> = ({ sessions, onViewSession, onDeleteSession }) => {
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

const SessionHistoryTab: React.FC<{
  onViewSession: (sessionId: string) => void;
}> = ({ onViewSession }) => {
  const { getSessionSummaries, deleteSession, clearHistory } = useSessionHistory();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  const sessions = getSessionSummaries();
  
  const handleDeleteSession = (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      deleteSession(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };
  
  const handleClearHistory = () => {
    setShowClearDialog(true);
  };
  
  const confirmClearHistory = () => {
    clearHistory();
    setShowClearDialog(false);
  };
  
  if (sessions.length === 0) {
    return <NoSessionsMessage />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xl font-semibold flex items-center mb-1">
            <BarChart3 className="h-5 w-5 mr-2" /> Quiz History
          </div>
          <p className="text-muted-foreground text-sm">
            Track your progress and review past quiz sessions
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="text-destructive" 
          onClick={handleClearHistory}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Sessions</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="best">Best Scores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <SessionsTable 
            sessions={sessions} 
            onViewSession={onViewSession} 
            onDeleteSession={handleDeleteSession} 
          />
        </TabsContent>
        
        <TabsContent value="recent" className="mt-4">
          <SessionsTable 
            sessions={sessions.slice(0, 5)} 
            onViewSession={onViewSession} 
            onDeleteSession={handleDeleteSession} 
          />
        </TabsContent>
        
        <TabsContent value="best" className="mt-4">
          <SessionsTable 
            sessions={[...sessions].sort((a, b) => b.scorePercentage - a.scorePercentage).slice(0, 5)} 
            onViewSession={onViewSession} 
            onDeleteSession={handleDeleteSession} 
          />
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!confirmDeleteId} onOpenChange={open => !open && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quiz session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All History</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear your entire quiz history? This will delete all {sessions.length} sessions and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SessionHistoryTab;
