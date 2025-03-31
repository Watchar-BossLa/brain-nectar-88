
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QuizResults as QuizResultsType } from "@/types/quiz";
import { ArrowRight, Target, Award, BookOpen, Users } from 'lucide-react';

// Import refactored components
import ScoreSummary from './results/ScoreSummary';
import PerformanceByTopic from './results/PerformanceByTopic';
import PerformanceByDifficulty from './results/PerformanceByDifficulty';
import PerformanceChart from './results/PerformanceChart';
import ShareResults from './social/ShareResults';
import { QuizResultsProps } from './results/types';

const QuizResults: React.FC<QuizResultsProps> = ({ 
  results, 
  onRestart,
  onReview,
  sessionId
}) => {
  const scorePercentage = results.questionsAttempted > 0 
    ? Math.round((results.correctAnswers / results.questionsAttempted) * 100) 
    : 0;
  
  const timeInMinutes = Math.floor(results.timeSpent / 60000);
  const timeInSeconds = Math.floor((results.timeSpent % 60000) / 1000);
  
  const scoreData = [
    { name: 'Correct', value: results.correctAnswers, color: '#10b981' },
    { name: 'Incorrect', value: results.incorrectAnswers, color: '#ef4444' },
    { name: 'Skipped', value: results.skippedQuestions, color: '#d1d5db' }
  ];
  
  // Calculate topic performance for charts
  const topicPerformance = Object.entries(results.performanceByTopic).map(([topic, data]) => ({
    topic,
    percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    correct: data.correct,
    total: data.total
  })).sort((a, b) => b.percentage - a.percentage);
  
  // Calculate difficulty performance
  const difficultyData = Object.entries(results.performanceByDifficulty).map(([difficulty, data]) => ({
    name: difficulty,
    value: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    correct: data.correct,
    total: data.total,
    color: difficulty === 'Easy' ? '#10b981' : difficulty === 'Medium' ? '#f59e0b' : '#ef4444'
  }));
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary-50 dark:bg-primary-950/20">
        <CardTitle className="text-center">
          <div className="flex flex-col items-center gap-2">
            <Award className="h-10 w-10 text-primary" />
            <h2 className="text-2xl font-bold">Quiz Results</h2>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <ScoreSummary 
          scorePercentage={scorePercentage}
          correctAnswers={results.correctAnswers}
          questionsAttempted={results.questionsAttempted}
          incorrectAnswers={results.incorrectAnswers}
          skippedQuestions={results.skippedQuestions}
          timeInMinutes={timeInMinutes}
          timeInSeconds={timeInSeconds}
        />
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-1">
            <Target className="h-4 w-4" />
            Performance by Topic
          </h3>
          
          <PerformanceByTopic topics={results.performanceByTopic} />
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Performance Breakdown
            </h3>
            
            <PerformanceChart scoreData={scoreData} />
          </div>
          
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-1">
              <Target className="h-4 w-4" />
              Performance by Difficulty
            </h3>
            
            <PerformanceByDifficulty difficulties={results.performanceByDifficulty} />
          </div>
        </div>
        
        <Separator />
        
        <ShareResults results={results} sessionId={sessionId} />
      </CardContent>
      
      <CardFooter className="flex justify-between p-6 bg-muted/20">
        <Button variant="outline" onClick={onRestart}>
          Restart Quiz
        </Button>
        
        {onReview && (
          <Button onClick={onReview} className="flex items-center gap-1">
            Review Answers
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizResults;
