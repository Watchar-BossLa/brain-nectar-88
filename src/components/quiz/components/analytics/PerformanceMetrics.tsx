
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface PerformanceMetricsProps {
  totalQuizzes?: number;
  averageScore?: number;
  completionRate?: number;
  improvementRate?: number;
  totalQuestions?: number;
  correctAnswers?: number;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  totalQuizzes = 0,
  averageScore = 0,
  completionRate = 0,
  improvementRate = 0,
  totalQuestions = 0,
  correctAnswers = 0,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
          <div className="h-4 w-4 bg-primary rounded-full"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuizzes}</div>
          <p className="text-xs text-muted-foreground">
            Completed assessments
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <div className="h-4 w-4 bg-amber-500 rounded-full"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
          <Progress value={averageScore} className="h-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Improvement</CardTitle>
          <div className="h-4 w-4 bg-green-500 rounded-full"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{improvementRate > 0 ? '+' : ''}{improvementRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            From previous assessments
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
          <Progress value={completionRate} className="h-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
          <div className="h-4 w-4 bg-indigo-500 rounded-full"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{correctAnswers} / {totalQuestions}</div>
          <Progress value={(correctAnswers / (totalQuestions || 1)) * 100} className="h-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
          <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalQuestions ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            Correct answer percentage
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
