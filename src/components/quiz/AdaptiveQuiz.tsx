
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import LatexRenderer from '../math/LatexRenderer';
import { useToast } from '@/components/ui/use-toast';
import { useAgentOrchestration } from '@/hooks/useAgentOrchestration';

interface QuizOption {
  id: string;
  text: string;
  isLatex?: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  isLatex?: boolean;
  options: QuizOption[];
  correctOptionId: string;
  difficulty: number;
  explanation?: string;
}

interface AdaptiveQuizProps {
  topicIds: string[];
  initialDifficulty?: number;
  maxQuestions?: number;
  className?: string;
  onComplete?: (score: number, performance: any) => void;
}

/**
 * Adaptive Quiz Component that adjusts difficulty based on user performance
 */
const AdaptiveQuiz: React.FC<AdaptiveQuizProps> = ({
  topicIds,
  initialDifficulty = 0.5,
  maxQuestions = 10,
  className = "",
  onComplete
}) => {
  const { toast } = useToast();
  const { createAdaptiveAssessment, isPending } = useAgentOrchestration();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, string>>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState(initialDifficulty);
  const [isLoading, setIsLoading] = useState(true);
  
  // Start with a basic set of questions
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      
      // Here we would call the assessment agent to generate questions
      try {
        await createAdaptiveAssessment(topicIds, {
          initialDifficulty: initialDifficulty,
          questionCount: maxQuestions
        });
        
        // In a real implementation, we would listen for the result
        // For now, we'll use placeholder questions
        const placeholderQuestions: QuizQuestion[] = [
          {
            id: '1',
            question: 'What is the accounting equation?',
            options: [
              { id: 'a', text: 'Assets = Liabilities + Equity' },
              { id: 'b', text: 'Assets = Liabilities - Equity' },
              { id: 'c', text: 'Assets + Liabilities = Equity' },
              { id: 'd', text: 'Assets - Liabilities = Equity' }
            ],
            correctOptionId: 'a',
            difficulty: 0.3
          },
          {
            id: '2',
            question: 'If a company has assets of $500,000 and liabilities of $300,000, what is the equity?',
            options: [
              { id: 'a', text: '$200,000' },
              { id: 'b', text: '$800,000' },
              { id: 'c', text: '$300,000' },
              { id: 'd', text: '$500,000' }
            ],
            correctOptionId: 'a',
            difficulty: 0.5
          },
          {
            id: '3',
            question: 'Calculate the present value of $10,000 to be received in 5 years with an annual interest rate of 8%.',
            isLatex: true,
            options: [
              { id: 'a', text: '\\$6,806', isLatex: true },
              { id: 'b', text: '\\$7,350', isLatex: true },
              { id: 'c', text: '\\$8,500', isLatex: true },
              { id: 'd', text: '\\$9,259', isLatex: true }
            ],
            correctOptionId: 'a',
            difficulty: 0.7,
            explanation: 'Present value = Future value / (1 + r)^n = $10,000 / (1 + 0.08)^5 ≈ $6,806'
          }
        ];
        
        setQuestions(placeholderQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
        toast({
          title: 'Failed to load questions',
          description: 'Please try again later',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [topicIds, initialDifficulty, maxQuestions]);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleAnswer = (optionId: string) => {
    if (answeredQuestions[currentQuestion.id]) return;
    
    // Record the user's answer
    setAnsweredQuestions(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
    
    // Check if answer is correct
    const isCorrect = optionId === currentQuestion.correctOptionId;
    
    // Update score
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // In a real adaptive system, we would adjust difficulty based on performance
    setCurrentDifficulty(prev => {
      const step = 0.1;
      return isCorrect ? Math.min(prev + step, 1) : Math.max(prev - step, 0);
    });
    
    // Show toast for feedback
    toast({
      title: isCorrect ? 'Correct!' : 'Incorrect',
      description: currentQuestion.explanation || (isCorrect ? 'Great job!' : 'Try again next time.'),
      variant: isCorrect ? 'default' : 'destructive'
    });
    
    // Move to next question after a slight delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setQuizComplete(true);
        if (onComplete) {
          onComplete(score, {
            correct: score,
            total: questions.length,
            finalDifficulty: currentDifficulty
          });
        }
      }
    }, 1500);
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnsweredQuestions({});
    setQuizComplete(false);
    setScore(0);
    setCurrentDifficulty(initialDifficulty);
  };
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Adaptive Quiz</CardTitle>
          <CardDescription>Loading your personalized questions...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Progress value={40} className="w-2/3" />
        </CardContent>
      </Card>
    );
  }
  
  if (quizComplete) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
          <CardDescription>You scored {score} out of {questions.length}</CardDescription>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <div className="text-4xl font-bold mb-4">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <Progress value={(score / questions.length) * 100} className="mb-6" />
          <p className="mb-6">
            {score >= questions.length * 0.8 
              ? 'Excellent work! You have a strong understanding of this topic.' 
              : score >= questions.length * 0.6 
                ? 'Good job! You understand most of the concepts, but there\'s room for improvement.' 
                : 'Keep studying! You\'ll get better with practice.'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={resetQuiz}>Restart Quiz</Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
        <CardDescription>
          Difficulty: {currentDifficulty < 0.4 ? 'Easy' : currentDifficulty < 0.7 ? 'Medium' : 'Hard'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={(currentQuestionIndex / questions.length) * 100} className="mb-6" />
        
        <div className="text-lg font-medium mb-4">
          {currentQuestion.isLatex ? (
            <LatexRenderer latex={currentQuestion.question} />
          ) : (
            currentQuestion.question
          )}
        </div>
        
        <div className="space-y-2">
          {currentQuestion.options.map(option => {
            const isSelected = answeredQuestions[currentQuestion.id] === option.id;
            const isCorrect = option.id === currentQuestion.correctOptionId;
            const showResult = answeredQuestions[currentQuestion.id] !== undefined;
            
            let buttonVariant: 'default' | 'outline' | 'destructive' | 'secondary' = 'outline';
            if (showResult) {
              if (isCorrect) {
                buttonVariant = 'default'; // correct answer
              } else if (isSelected) {
                buttonVariant = 'destructive'; // incorrect selected answer
              }
            }
            
            return (
              <Button
                key={option.id}
                variant={buttonVariant}
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => handleAnswer(option.id)}
                disabled={showResult}
              >
                {option.isLatex ? (
                  <LatexRenderer latex={option.text} />
                ) : (
                  option.text
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdaptiveQuiz;
