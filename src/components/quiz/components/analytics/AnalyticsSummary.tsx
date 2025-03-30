
import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Award, TrendingUp, TrendingDown, Target, Check, X } from 'lucide-react';
import { AnsweredQuestion } from '../../types';
import { QuizSession } from '@/types/quiz-session';

export interface AnalyticsSummaryProps {
  answeredQuestions?: AnsweredQuestion[];
  sessionData?: QuizSession[];
  overallStats?: {
    totalQuizzes: number;
    totalQuestions: number;
    averageScore: number;
    bestTopic: string;
    worstTopic: string;
    questionsAnswered: number;
    correctAnswers: number;
    incorrectAnswers: number;
  };
  recentPerformance?: {
    correct: number;
    incorrect: number;
    lastFiveAccuracy: number;
  };
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ 
  answeredQuestions = [], 
  sessionData = [],
  overallStats: propOverallStats,
  recentPerformance: propRecentPerformance 
}) => {
  // Calculate statistics from answeredQuestions and sessionData if not provided as props
  const calculatedStats = useMemo(() => {
    if (propOverallStats) return propOverallStats;
    
    const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
    const incorrectAnswers = answeredQuestions.length - correctAnswers;
    
    // Calculate performance by topic
    const topicPerformance: Record<string, { correct: number; total: number }> = {};
    answeredQuestions.forEach(q => {
      if (!q.topic) return;
      
      if (!topicPerformance[q.topic]) {
        topicPerformance[q.topic] = { correct: 0, total: 0 };
      }
      
      topicPerformance[q.topic].total++;
      if (q.isCorrect) {
        topicPerformance[q.topic].correct++;
      }
    });
    
    // Find best and worst topics
    let bestTopic = 'N/A';
    let worstTopic = 'N/A';
    let bestAccuracy = 0;
    let worstAccuracy = 100;
    
    Object.entries(topicPerformance).forEach(([topic, data]) => {
      const accuracy = (data.correct / data.total) * 100;
      
      if (accuracy > bestAccuracy) {
        bestAccuracy = accuracy;
        bestTopic = topic;
      }
      
      if (accuracy < worstAccuracy) {
        worstAccuracy = accuracy;
        worstTopic = topic;
      }
    });
    
    return {
      totalQuizzes: sessionData.length,
      totalQuestions: answeredQuestions.length,
      averageScore: answeredQuestions.length > 0 
        ? Math.round((correctAnswers / answeredQuestions.length) * 100) 
        : 0,
      bestTopic,
      worstTopic,
      questionsAnswered: answeredQuestions.length,
      correctAnswers,
      incorrectAnswers
    };
  }, [answeredQuestions, sessionData, propOverallStats]);
  
  // Calculate recent performance
  const calculatedRecentPerformance = useMemo(() => {
    if (propRecentPerformance) return propRecentPerformance;
    
    const recentQuestions = [...answeredQuestions].slice(-5);
    const correct = recentQuestions.filter(q => q.isCorrect).length;
    const accuracy = recentQuestions.length > 0 
      ? Math.round((correct / recentQuestions.length) * 100)
      : 0;
      
    return {
      correct,
      incorrect: recentQuestions.length - correct,
      lastFiveAccuracy: accuracy
    };
  }, [answeredQuestions, propRecentPerformance]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <Award className="h-8 w-8 text-primary mb-2" />
            <div className="text-3xl font-bold">{calculatedStats.averageScore}%</div>
            <p className="text-sm text-muted-foreground">Average Score</p>
          </div>
          <div className="mt-4 flex justify-between text-xs text-muted-foreground">
            <span>{calculatedStats.totalQuizzes} Quizzes</span>
            <span>{calculatedStats.totalQuestions} Questions</span>
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
              {calculatedStats.correctAnswers} / {calculatedStats.incorrectAnswers}
            </div>
            <p className="text-sm text-muted-foreground">Correct / Incorrect</p>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2 text-center">
              <div className="text-lg font-medium text-green-700 dark:text-green-300">{calculatedStats.correctAnswers}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Correct</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2 text-center">
              <div className="text-lg font-medium text-red-700 dark:text-red-300">{calculatedStats.incorrectAnswers}</div>
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
              <div className="text-lg font-bold">{calculatedRecentPerformance.lastFiveAccuracy}%</div>
              <div className={calculatedRecentPerformance.lastFiveAccuracy >= 80 ? "text-green-500" : calculatedRecentPerformance.lastFiveAccuracy >= 60 ? "text-amber-500" : "text-red-500"}>
                {calculatedRecentPerformance.lastFiveAccuracy >= calculatedStats.averageScore ? (
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
              <span className="font-medium">{calculatedStats.bestTopic}</span>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>Needs Work</span>
              </div>
              <span className="font-medium">{calculatedStats.worstTopic}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSummary;
