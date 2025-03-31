import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getQuizSession } from '@/services/quiz/sessionService';
import { Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ScoreDataItem } from '../results/types';
import { PerformanceChart } from '../results/PerformanceChart';

const badgeVariants = {
  correct: "bg-green-100 text-green-800",
  incorrect: "bg-red-100 text-red-800",
  skipped: "bg-gray-100 text-gray-800",
};

const SessionDetail = () => {
  const { sessionId } = useParams();
  
  const { data: session, isLoading, isError } = useQuery(
    ['quizSession', sessionId],
    () => getQuizSession(sessionId || '')
  );
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isError || !session) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-medium mb-2">Error loading session</h3>
          <p className="text-muted-foreground text-center">
            Failed to load quiz session details.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const sessionScore = session.score || 0;
  const averageScore = 75; // Replace with actual average score if available
  
  const performanceData = [
    { name: 'Your Score', score: sessionScore, average: 0, color: '#10b981' },
    { name: 'Average', score: 0, average: averageScore, color: '#6366f1' }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Session Details</CardTitle>
        <CardDescription>
          Details for session {session.id} on {format(new Date(session.created_at), 'MMMM dd, yyyy')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Session Summary</h4>
            <dl className="space-y-1">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Date</dt>
                <dd>{format(new Date(session.created_at), 'MMMM dd, yyyy hh:mm a')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Score</dt>
                <dd>{session.score}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Correct Answers</dt>
                <dd>{session.correct_count}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total Questions</dt>
                <dd>{session.total_count}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Time Taken</dt>
                <dd>{session.time_taken_seconds} seconds</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Performance Chart</h4>
            <PerformanceChart data={performanceData} />
          </div>
        </div>
        
        <h4 className="text-sm font-medium mb-2">Question Breakdown</h4>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {session.quiz_answered_questions?.map((answer) => (
              <Card key={answer.id} className="border">
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <h5 className="font-medium">{answer.question?.question_text}</h5>
                    <Badge variant={answer.is_correct ? 'correct' : 'incorrect'}>
                      {answer.is_correct ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your Answer: {answer.user_answer}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Correct Answer: {answer.question?.correct_answer}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Difficulty: {answer.question?.difficulty}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SessionDetail;
