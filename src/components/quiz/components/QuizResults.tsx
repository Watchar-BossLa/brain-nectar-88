
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { QuizResults as QuizResultsType } from "@/types/quiz";
import { ArrowRight, CheckCircle, XCircle, SkipForward, Clock, Target, Award, BookOpen } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface QuizResultsProps {
  results: QuizResultsType;
  onRestart: () => void;
  onReview?: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  results, 
  onRestart,
  onReview 
}) => {
  const scorePercentage = results.questionsAttempted > 0 
    ? Math.round((results.correctAnswers / results.questionsAttempted) * 100) 
    : 0;
  
  const accuracyColor = 
    scorePercentage >= 80 ? 'text-green-500' :
    scorePercentage >= 60 ? 'text-amber-500' : 'text-red-500';
  
  const timeInMinutes = Math.floor(results.timeSpent / 60000);
  const timeInSeconds = Math.floor((results.timeSpent % 60000) / 1000);
  
  const scoreData = [
    { name: 'Correct', value: results.correctAnswers, color: '#10b981' },
    { name: 'Incorrect', value: results.incorrectAnswers, color: '#ef4444' },
    { name: 'Skipped', value: results.skippedQuestions, color: '#d1d5db' }
  ];
  
  // Calculate topic performance for bar charts
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
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={`text-4xl font-bold ${accuracyColor}`}>{scorePercentage}%</span>
            <span className="text-lg text-muted-foreground">
              ({results.correctAnswers}/{results.questionsAttempted})
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Completed in {timeInMinutes}m {timeInSeconds}s</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span className="text-lg font-semibold">{results.correctAnswers}</span>
            </div>
            <span className="text-xs text-muted-foreground">Correct</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-red-500">
              <XCircle className="h-5 w-5" />
              <span className="text-lg font-semibold">{results.incorrectAnswers}</span>
            </div>
            <span className="text-xs text-muted-foreground">Incorrect</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <SkipForward className="h-5 w-5" />
              <span className="text-lg font-semibold">{results.skippedQuestions}</span>
            </div>
            <span className="text-xs text-muted-foreground">Skipped</span>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-1">
            <Target className="h-4 w-4" />
            Performance by Topic
          </h3>
          
          <div className="space-y-3">
            {topicPerformance.map((topic) => (
              <div key={topic.topic}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{topic.topic}</span>
                  <span className="font-medium">
                    {topic.correct}/{topic.total} ({topic.percentage}%)
                  </span>
                </div>
                <Progress value={topic.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Performance Breakdown
            </h3>
            
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {scoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} questions`, '']}
                    itemStyle={{ color: 'inherit' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 flex items-center gap-1">
              <Target className="h-4 w-4" />
              Performance by Difficulty
            </h3>
            
            <div className="space-y-3">
              {difficultyData.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.name}</span>
                    <span className="font-medium">
                      {item.correct}/{item.total} ({item.value}%)
                    </span>
                  </div>
                  <Progress 
                    value={item.value} 
                    className="h-2" 
                    indicatorClassName={
                      item.name === 'Easy' ? "bg-green-500" : 
                      item.name === 'Medium' ? "bg-amber-500" : "bg-red-500"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
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
