
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { BarChart2, CheckCircle, XCircle, Clock, Brain, BookOpen } from 'lucide-react';
import { QuizResults as QuizResultsType } from '@/types/quiz';
import ScoreDisplay from './results/ScoreDisplay';
import StatisticItem from './results/StatisticItem';
import PerformanceByDifficulty from './results/PerformanceByDifficulty';
import PerformanceByTopic from './results/PerformanceByTopic';
import { updateLearningPathFromQuizResults } from '@/services/learningPath/quizLearningPathService';
import { useAuth } from '@/context/auth';

interface QuizResultsProps {
  results: QuizResultsType;
  onRestart: () => void;
  onReview: () => void;
  sessionId?: string;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  results,
  onRestart,
  onReview,
  sessionId
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const scorePercentage = Math.round((results.correctAnswers / results.questionsAttempted) * 100);

  // Update learning path based on quiz results when component mounts
  useEffect(() => {
    if (user && results) {
      updateLearningPathFromQuizResults(user.id, results)
        .then(() => {
          console.log('Learning path updated based on quiz results');
        })
        .catch(error => {
          console.error('Error updating learning path:', error);
        });
    }
  }, [results, user]);
  
  const handleViewLearningPath = () => {
    navigate('/learning-path');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChart2 className="h-6 w-6" />
            Quiz Results
          </CardTitle>
          <CardDescription>
            {scorePercentage >= 70 
              ? "Great job! You've mastered this content." 
              : "Keep practicing to improve your knowledge."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ScoreDisplay score={scorePercentage} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <StatisticItem 
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  label="Correct"
                  value={results.correctAnswers}
                />
                <StatisticItem 
                  icon={<XCircle className="h-5 w-5 text-red-500" />}
                  label="Incorrect"
                  value={results.incorrectAnswers}
                />
                <StatisticItem 
                  icon={<Clock className="h-5 w-5 text-blue-500" />}
                  label="Time"
                  value={`${Math.round(results.timeSpent / 60000)}m ${Math.round((results.timeSpent % 60000) / 1000)}s`}
                />
                {results.averageConfidence !== undefined && (
                  <StatisticItem 
                    icon={<Brain className="h-5 w-5 text-purple-500" />}
                    label="Confidence"
                    value={`${Math.round(results.averageConfidence * 100)}%`}
                  />
                )}
              </div>

              <div>
                <h3 className="font-medium mb-3">Performance by Difficulty</h3>
                <PerformanceByDifficulty difficulties={results.performanceByDifficulty} />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Performance by Topic</h3>
              <PerformanceByTopic topics={results.performanceByTopic} />

              {results.recommendedTopics && results.recommendedTopics.length > 0 && (
                <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Recommended Study Areas
                  </h4>
                  <ul className="list-disc list-inside">
                    {results.recommendedTopics.map((topic, index) => (
                      <li key={index} className="text-sm">{topic}</li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={handleViewLearningPath} 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full"
                  >
                    View Learning Path
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onRestart}>
            Start New Quiz
          </Button>
          <Button onClick={onReview}>
            Review Answers
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuizResults;
