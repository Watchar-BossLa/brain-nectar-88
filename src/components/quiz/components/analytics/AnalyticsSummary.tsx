
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Award, TrendingUp, TrendingDown, Target, Check, X } from 'lucide-react';

interface AnalyticsSummaryProps {
  overallStats: {
    totalQuizzes: number;
    totalQuestions: number;
    averageScore: number;
    bestTopic: string;
    worstTopic: string;
    questionsAnswered: number;
    correctAnswers: number;
    incorrectAnswers: number;
  };
  recentPerformance: {
    correct: number;
    incorrect: number;
    lastFiveAccuracy: number;
  };
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ overallStats, recentPerformance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <Award className="h-8 w-8 text-primary mb-2" />
            <div className="text-3xl font-bold">{overallStats.averageScore}%</div>
            <p className="text-sm text-muted-foreground">Average Score</p>
          </div>
          <div className="mt-4 flex justify-between text-xs text-muted-foreground">
            <span>{overallStats.totalQuizzes} Quizzes</span>
            <span>{overallStats.totalQuestions} Questions</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1 mb-2">
              <Check className="h-6 w-6 text-green-500" />
              <X className="h-6 w-6 text-red-500" />
            </div>
            <div className="text-2xl font-bold">
              {overallStats.correctAnswers} / {overallStats.incorrectAnswers}
            </div>
            <p className="text-sm text-muted-foreground">Correct / Incorrect</p>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2 text-center">
              <div className="text-lg font-medium text-green-700 dark:text-green-300">{overallStats.correctAnswers}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Correct</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2 text-center">
              <div className="text-lg font-medium text-red-700 dark:text-red-300">{overallStats.incorrectAnswers}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Incorrect</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <Target className="h-8 w-8 text-blue-500 mb-2" />
            <div className="flex items-center gap-2">
              <div className="text-lg font-bold">{recentPerformance.lastFiveAccuracy}%</div>
              <div className={recentPerformance.lastFiveAccuracy >= 80 ? "text-green-500" : recentPerformance.lastFiveAccuracy >= 60 ? "text-amber-500" : "text-red-500"}>
                {recentPerformance.lastFiveAccuracy >= overallStats.averageScore ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Last 5 Questions</p>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Best Topic</span>
              </div>
              <span className="font-medium">{overallStats.bestTopic}</span>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>Needs Work</span>
              </div>
              <span className="font-medium">{overallStats.worstTopic}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSummary;
