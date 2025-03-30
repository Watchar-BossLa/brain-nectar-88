
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { QuizSession } from '@/types/quiz-session';

export interface AnalyticsSummaryProps {
  sessionData: QuizSession[];
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ sessionData }) => {
  // Calculate the statistics from the session data
  const totalQuestions = sessionData.reduce((sum, session) => 
    sum + (session.results.questionsAttempted || 0), 0);
    
  const totalCorrect = sessionData.reduce((sum, session) => 
    sum + (session.results.correctAnswers || 0), 0);
    
  const avgScore = totalQuestions > 0 
    ? Math.round((totalCorrect / totalQuestions) * 100) 
    : 0;
    
  const totalTime = sessionData.reduce((sum, session) => 
    sum + (session.results.timeSpent || 0), 0);
    
  const avgTimePerQuestion = totalQuestions > 0 
    ? Math.round(totalTime / totalQuestions / 1000) 
    : 0;
    
  const sessionsCompleted = sessionData.length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard title="Sessions" value={sessionsCompleted.toString()} />
      <StatCard title="Questions" value={totalQuestions.toString()} />
      <StatCard title="Avg Score" value={`${avgScore}%`} />
      <StatCard title="Correct" value={totalCorrect.toString()} />
      <StatCard title="Incorrect" value={(totalQuestions - totalCorrect).toString()} />
      <StatCard title="Avg Time" value={`${avgTimePerQuestion}s`} />
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <Card>
    <CardContent className="p-4 text-center">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default AnalyticsSummary;
