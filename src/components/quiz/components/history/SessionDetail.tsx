
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import PerformanceChart from '../results/PerformanceChart';
import { ScoreDataItem } from '../results/types';

interface SessionDetailProps {
  sessionId: string;
}

const fetchSessionDetail = async (sessionId: string) => {
  // Placeholder implementation - replace with actual API call
  // This should be implemented in src/services/quiz/sessionService.ts
  
  // Wait for 1 second to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: sessionId,
    score_percentage: 75,
    correct_answers: 15,
    total_questions: 20,
    time_spent: 600, // in seconds
    created_at: new Date().toISOString(),
    date: format(new Date(), 'MMM d, yyyy'),
    difficulty: 3,
    initial_difficulty: 2,
    selected_topics: ['Accounting Basics', 'Financial Statements'],
    quiz_answered_questions: [
      { id: '1', question_text: 'What is accounting?', is_correct: true, topic: 'Accounting Basics' },
      { id: '2', question_text: 'What is a balance sheet?', is_correct: false, topic: 'Financial Statements' }
      // More questions would be here...
    ]
  };
};

const SessionDetail: React.FC<SessionDetailProps> = ({ sessionId }) => {
  const { data: session, isLoading, error } = useQuery({
    queryKey: ['sessionDetail', sessionId],
    queryFn: () => fetchSessionDetail(sessionId)
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="p-8">
        <p className="text-destructive">Error loading session details.</p>
      </div>
    );
  }
  
  // Prepare chart data
  const chartData: ScoreDataItem[] = [
    { name: 'Session', score: session.score_percentage, average: 65 }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Session from {format(new Date(session.created_at), 'MMM d, yyyy')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Score:</span>
              <span className="font-medium">{session.score_percentage}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Correct Answers:</span>
              <span className="font-medium">{session.correct_answers}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Questions:</span>
              <span className="font-medium">{session.total_questions}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Spent:</span>
              <span className="font-medium">
                {Math.floor(session.time_spent / 60)}m {session.time_spent % 60}s
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Difficulty:</span>
              <span className="font-medium">{session.difficulty}/5</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-muted-foreground">Topics:</span>
              <div className="flex flex-wrap gap-1">
                {session.selected_topics.map((topic) => (
                  <Badge key={topic} variant="outline">{topic}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <PerformanceChart data={chartData} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {session.quiz_answered_questions.map((question: any) => (
              <li key={question.id} className="flex items-start gap-2">
                <Badge variant={question.is_correct ? "secondary" : "destructive"}>
                  {question.is_correct ? 'Correct' : 'Incorrect'}
                </Badge>
                <span>{question.question_text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionDetail;
