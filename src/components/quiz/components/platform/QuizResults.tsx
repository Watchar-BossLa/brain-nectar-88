
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, LineChart } from 'lucide-react';
import ScoreSummary from '../results/ScoreSummary';
import PerformanceByTopic from '../results/PerformanceByTopic';
import PerformanceByDifficulty from '../results/PerformanceByDifficulty';
import { QuizQuestion } from '../../types';

interface QuizResultsProps {
  questions: QuizQuestion[];
  answers: string[];
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ questions, answers, onRestart }) => {
  // Calculate results
  const correctAnswers = questions.filter((question, index) => {
    const correctAnswer = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer 
      : [question.correctAnswer];
    return correctAnswer.includes(answers[index]);
  }).length;
  
  const scorePercentage = Math.round((correctAnswers / questions.length) * 100);
  
  // Get performance by topics
  const topicStats = questions.reduce((acc: Record<string, { total: number, correct: number }>, question, index) => {
    const topic = question.topic;
    if (!acc[topic]) {
      acc[topic] = { total: 0, correct: 0 };
    }
    acc[topic].total++;
    
    const correctAnswer = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer 
      : [question.correctAnswer];
    if (correctAnswer.includes(answers[index])) {
      acc[topic].correct++;
    }
    return acc;
  }, {});
  
  // Get performance by difficulty
  const difficultyStats = questions.reduce((acc: Record<string, { total: number, correct: number }>, question, index) => {
    // Convert numerical difficulty to string representation
    let difficultyLabel: string;
    if (typeof question.difficulty === 'number') {
      if (question.difficulty <= 2) difficultyLabel = 'Easy';
      else if (question.difficulty <= 4) difficultyLabel = 'Medium';
      else difficultyLabel = 'Hard';
    } else {
      difficultyLabel = String(question.difficulty);
    }
    
    if (!acc[difficultyLabel]) {
      acc[difficultyLabel] = { total: 0, correct: 0 };
    }
    acc[difficultyLabel].total++;
    
    const correctAnswer = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer 
      : [question.correctAnswer];
    if (correctAnswer.includes(answers[index])) {
      acc[difficultyLabel].correct++;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl">Quiz Results</CardTitle>
        <CardDescription>
          See how well you did and identify areas for improvement
        </CardDescription>
      </CardHeader>
      
      <ScoreSummary 
        score={scorePercentage} 
        correctCount={correctAnswers} 
        totalCount={questions.length} 
      />
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Performance by Topic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceByTopic topics={topicStats} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Performance by Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceByDifficulty difficulties={difficultyStats} />
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button onClick={onRestart} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Restart Quiz
        </Button>
        
        <div className="flex gap-3 flex-1">
          <Button variant="outline" className="flex-1">
            <Download className="mr-2 h-4 w-4" /> Download Results
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="mr-2 h-4 w-4" /> Share Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
