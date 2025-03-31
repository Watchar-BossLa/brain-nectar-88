
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RotateCcw, BarChart2 } from 'lucide-react';
import { QuizQuestion, AnsweredQuestion } from '../../types';
import { useToast } from '@/components/ui/use-toast';

interface QuizResultsProps {
  questions: QuizQuestion[];
  answers: string[];
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  answers,
  onRestart
}) => {
  const { toast } = useToast();

  // Calculate results
  const totalQuestions = questions.length;
  const correctAnswers = questions.reduce((count, question, index) => {
    const isCorrect = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer.includes(answers[index])
      : question.correctAnswer === answers[index];
    return isCorrect ? count + 1 : count;
  }, 0);
  
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Group questions by topic for topic-wise performance
  const topicPerformance: Record<string, { correct: number; total: number }> = {};
  
  questions.forEach((question, index) => {
    const topic = question.topic || 'Unknown';
    if (!topicPerformance[topic]) {
      topicPerformance[topic] = { correct: 0, total: 0 };
    }
    
    topicPerformance[topic].total += 1;
    
    const isCorrect = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer.includes(answers[index])
      : question.correctAnswer === answers[index];
    
    if (isCorrect) {
      topicPerformance[topic].correct += 1;
    }
  });

  const handleShare = () => {
    toast({
      title: "Results Shared",
      description: `Your score of ${scorePercentage}% has been shared.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-6 w-6" />
              Quiz Results
            </div>
            <div className="text-2xl font-bold">
              {scorePercentage}%
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-muted rounded-md">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500 h-5 w-5" />
              <span>Correct: {correctAnswers}</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="text-red-500 h-5 w-5" />
              <span>Incorrect: {totalQuestions - correctAnswers}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Performance by Topic</h3>
            <div className="space-y-2">
              {Object.entries(topicPerformance).map(([topic, data]) => {
                const percentage = Math.round((data.correct / data.total) * 100);
                return (
                  <div key={topic} className="flex justify-between items-center">
                    <span>{topic}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onRestart}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Restart Quiz
          </Button>
          <Button onClick={handleShare}>
            Share Results
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuizResults;
