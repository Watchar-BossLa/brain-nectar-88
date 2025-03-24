
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizResults, AnsweredQuestion } from '../types';
import { quizQuestions } from '../data/quizQuestions';
import { 
  RotateCcw, 
  ArrowLeft,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';

interface QuizResultsCardProps {
  quizResults: QuizResults;
  answeredQuestions: AnsweredQuestion[];
  restartQuiz: () => void;
  resetQuiz: () => void;
}

const QuizResultsCard: React.FC<QuizResultsCardProps> = ({
  quizResults,
  answeredQuestions,
  restartQuiz,
  resetQuiz
}) => {
  if (!quizResults) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Results</CardTitle>
        <CardDescription>
          You completed the quiz in {Math.round(quizResults.timeSpent / 1000)} seconds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/20 rounded-md text-center">
            <div className="text-3xl font-bold">
              {quizResults.correctAnswers}
            </div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          <div className="p-4 bg-muted/20 rounded-md text-center">
            <div className="text-3xl font-bold">
              {quizResults.incorrectAnswers}
            </div>
            <div className="text-sm text-muted-foreground">Incorrect</div>
          </div>
          <div className="p-4 bg-muted/20 rounded-md text-center">
            <div className="text-3xl font-bold">
              {quizResults.skippedQuestions}
            </div>
            <div className="text-sm text-muted-foreground">Skipped</div>
          </div>
          <div className="p-4 bg-muted/20 rounded-md text-center">
            <div className="text-3xl font-bold">
              {Math.round(quizResults.correctAnswers / quizResults.questionsAttempted * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Score</div>
          </div>
        </div>
        
        <Tabs defaultValue="topics">
          <TabsList>
            <TabsTrigger value="topics">Performance by Topic</TabsTrigger>
            <TabsTrigger value="difficulty">Performance by Difficulty</TabsTrigger>
            <TabsTrigger value="review">Review Answers</TabsTrigger>
          </TabsList>
          <TabsContent value="topics" className="mt-4">
            <PerformanceByTopic topics={quizResults.performanceByTopic} />
          </TabsContent>
          <TabsContent value="difficulty" className="mt-4">
            <PerformanceByDifficulty difficulties={quizResults.performanceByDifficulty} />
          </TabsContent>
          <TabsContent value="review" className="mt-4">
            <ReviewAnswers answeredQuestions={answeredQuestions} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={resetQuiz}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          New Quiz
        </Button>
        <Button onClick={restartQuiz}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Restart Similar Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};

interface PerformanceByTopicProps {
  topics: Record<string, { correct: number; total: number }>;
}

const PerformanceByTopic: React.FC<PerformanceByTopicProps> = ({ topics }) => {
  return (
    <div className="space-y-3">
      {Object.entries(topics).map(([topic, { correct, total }]) => (
        <div key={topic} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">{topic}</span>
            <span className="text-sm">{correct} / {total} ({Math.round(correct / total * 100)}%)</span>
          </div>
          <Progress value={correct / total * 100} className="h-2" />
        </div>
      ))}
    </div>
  );
};

interface PerformanceByDifficultyProps {
  difficulties: Record<string, { correct: number; total: number }>;
}

const PerformanceByDifficulty: React.FC<PerformanceByDifficultyProps> = ({ difficulties }) => {
  return (
    <div className="space-y-3">
      {Object.entries(difficulties)
        .filter(([_, { total }]) => total > 0)
        .map(([difficulty, { correct, total }]) => (
          <div key={difficulty} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">{difficulty}</span>
              <span className="text-sm">{correct} / {total} ({Math.round(correct / total * 100)}%)</span>
            </div>
            <Progress value={correct / total * 100} className="h-2" />
          </div>
        ))}
    </div>
  );
};

interface ReviewAnswersProps {
  answeredQuestions: AnsweredQuestion[];
}

const ReviewAnswers: React.FC<ReviewAnswersProps> = ({ answeredQuestions }) => {
  return (
    <div className="space-y-4">
      {answeredQuestions.map((answered, index) => {
        const question = quizQuestions.find(q => q.id === answered.id);
        if (!question) return null;
        
        return (
          <div key={index} className={`p-3 border rounded-md ${
            answered.isCorrect ? 'border-green-200 bg-green-50' : 
            answered.userAnswer === 'SKIPPED' ? 'border-amber-200 bg-amber-50' : 
            'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium">{index + 1}. {question.text}</p>
                <div className="mt-2 space-y-1 text-sm">
                  {answered.userAnswer !== 'SKIPPED' && (
                    <div className="flex gap-2">
                      <span className="font-medium">Your answer:</span>
                      <span>{answered.userAnswer}</span>
                    </div>
                  )}
                  {!answered.isCorrect && question.type !== 'essay' && (
                    <div className="flex gap-2">
                      <span className="font-medium">Correct answer:</span>
                      <span>{
                        typeof question.correctAnswer === 'string' 
                          ? question.correctAnswer 
                          : question.correctAnswer?.join(', ')
                      }</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-3">
                {answered.isCorrect && <Check className="h-5 w-5 text-green-500" />}
                {!answered.isCorrect && answered.userAnswer !== 'SKIPPED' && <X className="h-5 w-5 text-red-500" />}
                {answered.userAnswer === 'SKIPPED' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuizResultsCard;
