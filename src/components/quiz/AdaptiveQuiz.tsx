
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import LatexRenderer from '../math/LatexRenderer';
import { useToast } from '@/components/ui/use-toast';
import { useAgentOrchestration } from '@/hooks/useAgentOrchestration';
import { CircleDot, PenLine, CheckCircle2, XCircle, Compass, BrainCircuit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  tags?: string[];
  concept?: string;
  lastAnsweredCorrectly?: Date | null;
}

interface QuizPerformance {
  questionId: string;
  userAnswerId: string;
  isCorrect: boolean;
  timeSpent: number;
  difficulty: number;
  date: Date;
}

interface AdaptiveQuizProps {
  topicIds: string[];
  initialDifficulty?: number;
  maxQuestions?: number;
  className?: string;
  enableSpacedRepetition?: boolean;
  onComplete?: (score: number, performance: any) => void;
}

/**
 * Enhanced Adaptive Quiz Component with advanced difficulty adjustment algorithm
 */
const AdaptiveQuiz: React.FC<AdaptiveQuizProps> = ({
  topicIds,
  initialDifficulty = 0.5,
  maxQuestions = 10,
  className = "",
  enableSpacedRepetition = true,
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
  const [performanceHistory, setPerformanceHistory] = useState<QuizPerformance[]>([]);
  const [confidenceRating, setConfidenceRating] = useState<Record<string, number>>({});
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [conceptMastery, setConceptMastery] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Enhanced adaptive algorithm parameters
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);
  const [userSkillEstimate, setUserSkillEstimate] = useState(initialDifficulty);
  
  // Initialize with placeholder questions
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, we would call an API or agent
        // For now, we'll use placeholder questions with enhanced metadata
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
            difficulty: 0.3,
            tags: ['fundamental', 'equation'],
            concept: 'accounting_equation'
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
            difficulty: 0.5,
            tags: ['calculation', 'equation'],
            concept: 'accounting_equation_application'
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
            explanation: 'Present value = Future value / (1 + r)^n = $10,000 / (1 + 0.08)^5 ≈ $6,806',
            tags: ['time value', 'calculation', 'finance'],
            concept: 'present_value'
          },
          {
            id: '4',
            question: 'Which of the following is NOT an example of an asset?',
            options: [
              { id: 'a', text: 'Accounts Receivable' },
              { id: 'b', text: 'Inventory' },
              { id: 'c', text: 'Accounts Payable' },
              { id: 'd', text: 'Equipment' }
            ],
            correctOptionId: 'c',
            difficulty: 0.4,
            explanation: 'Accounts Payable is a liability, not an asset, as it represents money owed by the company.',
            tags: ['classification', 'fundamental'],
            concept: 'asset_classification'
          },
          {
            id: '5',
            question: 'What does the Debt-to-Equity ratio measure?',
            options: [
              { id: 'a', text: 'Profitability' },
              { id: 'b', text: 'Liquidity' },
              { id: 'c', text: 'Leverage' },
              { id: 'd', text: 'Efficiency' }
            ],
            correctOptionId: 'c',
            difficulty: 0.6,
            explanation: 'The Debt-to-Equity ratio measures a company\'s financial leverage and is calculated by dividing total liabilities by total equity.',
            tags: ['ratio', 'financial analysis'],
            concept: 'financial_ratios'
          },
          {
            id: '6',
            question: 'Under which accounting principle should revenue be recognized?',
            options: [
              { id: 'a', text: 'When cash is received' },
              { id: 'b', text: 'When performance obligations are satisfied' },
              { id: 'c', text: 'At the end of the accounting period' },
              { id: 'd', text: 'When management decides to record it' }
            ],
            correctOptionId: 'b',
            difficulty: 0.5,
            explanation: 'Under the Revenue Recognition Principle, revenue should be recognized when the performance obligation is satisfied, which typically occurs when goods are transferred or services are performed.',
            tags: ['principle', 'revenue'],
            concept: 'revenue_recognition'
          },
          {
            id: '7',
            question: 'The formula for Return on Equity (ROE) is:',
            isLatex: true,
            options: [
              { id: 'a', text: 'ROE = \\frac{\\text{Net Income}}{\\text{Total Assets}}', isLatex: true },
              { id: 'b', text: 'ROE = \\frac{\\text{Net Income}}{\\text{Shareholders\' Equity}}', isLatex: true },
              { id: 'c', text: 'ROE = \\frac{\\text{EBIT}}{\\text{Total Equity}}', isLatex: true },
              { id: 'd', text: 'ROE = \\frac{\\text{Gross Profit}}{\\text{Shareholders\' Equity}}', isLatex: true }
            ],
            correctOptionId: 'b',
            difficulty: 0.65,
            explanation: 'Return on Equity (ROE) measures a company\'s profitability by revealing how much profit a company generates with the money shareholders have invested. It is calculated by dividing Net Income by Shareholders\' Equity.',
            tags: ['ratio', 'profitability', 'formula'],
            concept: 'profitability_ratios'
          },
          {
            id: '8',
            question: 'Which financial statement reports a company\'s revenues and expenses over a specific period?',
            options: [
              { id: 'a', text: 'Balance Sheet' },
              { id: 'b', text: 'Statement of Cash Flows' },
              { id: 'c', text: 'Income Statement' },
              { id: 'd', text: 'Statement of Shareholders\' Equity' }
            ],
            correctOptionId: 'c',
            difficulty: 0.3,
            explanation: 'The Income Statement (also called Profit and Loss Statement) reports a company\'s revenues, expenses, and profits over a specific period of time.',
            tags: ['financial statements', 'fundamental'],
            concept: 'financial_statements'
          }
        ];
        
        const sortedQuestions = placeholderQuestions.sort((a, b) => a.difficulty - b.difficulty);
        setQuestions(sortedQuestions);
        
        // Initialize concept mastery
        const conceptMap: Record<string, number> = {};
        sortedQuestions.forEach(q => {
          if (q.concept && !conceptMap[q.concept]) {
            conceptMap[q.concept] = 0.5; // Initial mastery level
          }
        });
        setConceptMastery(conceptMap);
        
      } catch (error) {
        console.error('Error loading questions:', error);
        toast({
          title: 'Failed to load questions',
          description: 'Please try again later',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
        setQuestionStartTime(new Date());
      }
    };
    
    loadQuestions();
  }, [topicIds, initialDifficulty, maxQuestions]);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  // Enhanced adaptive difficulty algorithm
  const updateDifficulty = useCallback((isCorrect: boolean, confidence: number, timeSpent: number) => {
    // Base difficulty adjustment factor
    let adjustmentFactor = 0.1;
    
    // Adjust based on consecutive correct/incorrect answers
    if (isCorrect) {
      setConsecutiveCorrect(prev => prev + 1);
      setConsecutiveIncorrect(0);
      
      // Increase difficulty more quickly with consecutive correct answers
      if (consecutiveCorrect >= 2) {
        adjustmentFactor += 0.05 * (consecutiveCorrect - 1);
      }
    } else {
      setConsecutiveIncorrect(prev => prev + 1);
      setConsecutiveCorrect(0);
      
      // Decrease difficulty more quickly with consecutive incorrect answers
      if (consecutiveIncorrect >= 2) {
        adjustmentFactor += 0.05 * (consecutiveIncorrect - 1);
      }
    }
    
    // Adjust based on user's confidence
    // Low confidence correct answers → smaller difficulty increase
    // High confidence incorrect answers → larger difficulty decrease
    if (isCorrect) {
      adjustmentFactor *= (0.5 + confidence * 0.5); // Scale from 0.5x to 1.0x
    } else {
      adjustmentFactor *= (0.5 + (1 - confidence) * 0.5); // Scale from 0.5x to 1.0x
    }
    
    // Adjust based on time spent
    // Quick correct answers → larger difficulty increase
    // Slow incorrect answers → smaller difficulty decrease
    const avgTimePerQuestion = 30; // seconds
    const timeRatio = avgTimePerQuestion / timeSpent;
    if (isCorrect && timeRatio > 1) {
      // Answered correctly faster than average
      adjustmentFactor *= Math.min(timeRatio, 2); // Cap at 2x
    } else if (!isCorrect && timeRatio < 1) {
      // Answered incorrectly slower than average
      adjustmentFactor *= Math.max(timeRatio, 0.5); // Floor at 0.5x
    }
    
    // Calculate new difficulty
    const newDifficulty = isCorrect 
      ? Math.min(currentDifficulty + adjustmentFactor, 1) 
      : Math.max(currentDifficulty - adjustmentFactor, 0);
    
    setCurrentDifficulty(newDifficulty);
    
    // Update user skill estimate with Bayesian updating (simplified)
    const confidenceFactor = isCorrect ? confidence : (1 - confidence);
    const newSkillEstimate = userSkillEstimate * 0.7 + (isCorrect ? 1 : 0) * 0.3 * confidenceFactor;
    setUserSkillEstimate(newSkillEstimate);
    
    // Update concept mastery if question has a concept
    if (currentQuestion.concept) {
      setConceptMastery(prev => {
        const currentMastery = prev[currentQuestion.concept!] || 0.5;
        const masteryAdjustment = isCorrect ? 0.1 : -0.1;
        return {
          ...prev,
          [currentQuestion.concept!]: Math.min(Math.max(currentMastery + masteryAdjustment, 0), 1)
        };
      });
    }
    
    return newDifficulty;
  }, [currentDifficulty, consecutiveCorrect, consecutiveIncorrect, userSkillEstimate, currentQuestion]);
  
  // Function to select the next question based on adaptive algorithm
  const selectNextQuestion = useCallback(() => {
    // Already answered questions
    const answeredIds = Object.keys(answeredQuestions);
    
    // Find questions close to the current difficulty level
    const candidateQuestions = questions.filter(q => 
      !answeredIds.includes(q.id) && 
      Math.abs(q.difficulty - currentDifficulty) < 0.3
    );
    
    if (candidateQuestions.length === 0) {
      // If no questions match the criteria, find the closest one
      const unansweredQuestions = questions.filter(q => !answeredIds.includes(q.id));
      if (unansweredQuestions.length === 0) {
        // All questions answered
        return -1;
      }
      
      // Sort by distance to current difficulty
      unansweredQuestions.sort((a, b) => 
        Math.abs(a.difficulty - currentDifficulty) - Math.abs(b.difficulty - currentDifficulty)
      );
      
      return questions.findIndex(q => q.id === unansweredQuestions[0].id);
    }
    
    // Prioritize questions based on spaced repetition if enabled
    if (enableSpacedRepetition) {
      const now = new Date();
      const questionsWithDue = candidateQuestions.map(q => {
        if (!q.lastAnsweredCorrectly) return { ...q, dueScore: 1 }; // Never answered, highest priority
        
        // Calculate "due score" based on time since last correct answer
        const daysSince = (now.getTime() - q.lastAnsweredCorrectly.getTime()) / (1000 * 60 * 60 * 24);
        const optimalInterval = 2 ** (conceptMastery[q.concept || 'default'] * 5); // 1 to 32 days
        const dueScore = daysSince / optimalInterval;
        
        return { ...q, dueScore };
      });
      
      // Sort by due score (higher is more due)
      questionsWithDue.sort((a, b) => b.dueScore - a.dueScore);
      return questions.findIndex(q => q.id === questionsWithDue[0].id);
    }
    
    // Randomly select from candidates, weighted by closeness to target difficulty
    const weights = candidateQuestions.map(q => 1 / (Math.abs(q.difficulty - currentDifficulty) + 0.1));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const randomValue = Math.random() * totalWeight;
    
    let cumulativeWeight = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulativeWeight += weights[i];
      if (randomValue <= cumulativeWeight) {
        return questions.findIndex(q => q.id === candidateQuestions[i].id);
      }
    }
    
    // Fallback
    return questions.findIndex(q => q.id === candidateQuestions[0].id);
  }, [questions, answeredQuestions, currentDifficulty, conceptMastery, enableSpacedRepetition]);
  
  const recordPerformance = (questionId: string, userAnswerId: string, isCorrect: boolean, timeSpent: number, difficulty: number) => {
    const newPerformance: QuizPerformance = {
      questionId,
      userAnswerId,
      isCorrect,
      timeSpent,
      difficulty,
      date: new Date()
    };
    
    setPerformanceHistory(prev => [...prev, newPerformance]);
  };
  
  const handleAnswer = (optionId: string) => {
    if (answeredQuestions[currentQuestion.id]) return;
    
    // Calculate time spent
    const timeSpent = questionStartTime 
      ? (new Date().getTime() - questionStartTime.getTime()) / 1000 
      : 0;
    
    // Record the user's answer
    setAnsweredQuestions(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
    
    // Check if answer is correct
    const isCorrect = optionId === currentQuestion.correctOptionId;
    
    // Get user's confidence (default to medium if not provided)
    const confidence = confidenceRating[currentQuestion.id] || 0.5;
    
    // Update difficulty
    const newDifficulty = updateDifficulty(isCorrect, confidence, timeSpent);
    
    // Record performance
    recordPerformance(currentQuestion.id, optionId, isCorrect, timeSpent, currentQuestion.difficulty);
    
    // Update score
    if (isCorrect) {
      setScore(prev => prev + 1);
      
      // Update last answered correctly timestamp for this question
      setQuestions(prev => prev.map(q => 
        q.id === currentQuestion.id 
          ? { ...q, lastAnsweredCorrectly: new Date() } 
          : q
      ));
    }
    
    // Show answer explanation
    setShowExplanation(true);
    
    // Move to next question after explanation is shown
    setTimeout(() => {
      // Hide explanation before moving on
      setShowExplanation(false);
      
      if (Object.keys(answeredQuestions).length + 1 >= maxQuestions) {
        // Quiz complete
        setQuizComplete(true);
        if (onComplete) {
          onComplete(score + (isCorrect ? 1 : 0), {
            correct: score + (isCorrect ? 1 : 0),
            total: maxQuestions,
            finalDifficulty: newDifficulty,
            performance: [...performanceHistory, {
              questionId: currentQuestion.id,
              userAnswerId: optionId,
              isCorrect,
              timeSpent,
              difficulty: currentQuestion.difficulty,
              date: new Date()
            }],
            conceptMastery: { ...conceptMastery }
          });
        }
      } else {
        // Find next question
        const nextIndex = selectNextQuestion();
        if (nextIndex === -1) {
          // No more questions available
          setQuizComplete(true);
        } else {
          setCurrentQuestionIndex(nextIndex);
          setQuestionStartTime(new Date());
        }
      }
    }, 3000);
  };
  
  const handleConfidenceRating = (questionId: string, rating: number) => {
    setConfidenceRating(prev => ({
      ...prev,
      [questionId]: rating
    }));
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnsweredQuestions({});
    setQuizComplete(false);
    setScore(0);
    setCurrentDifficulty(initialDifficulty);
    setUserSkillEstimate(initialDifficulty);
    setConsecutiveCorrect(0);
    setConsecutiveIncorrect(0);
    setPerformanceHistory([]);
    setConfidenceRating({});
    setQuestionStartTime(new Date());
  };
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Adaptive Quiz</CardTitle>
          <CardDescription>Loading your personalized questions...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-4">
            <BrainCircuit className="h-16 w-16 text-primary/30 animate-pulse" />
            <Progress value={40} className="w-2/3" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Analyzing your knowledge patterns...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (quizComplete) {
    const difficultyLevel = currentDifficulty < 0.4 
      ? 'Beginner' 
      : currentDifficulty < 0.7 
        ? 'Intermediate' 
        : 'Advanced';
    
    // Identify strongest and weakest concepts
    const conceptEntries = Object.entries(conceptMastery);
    let strongestConcept = { name: '', mastery: 0 };
    let weakestConcept = { name: '', mastery: 1 };
    
    conceptEntries.forEach(([concept, mastery]) => {
      if (mastery > strongestConcept.mastery) {
        strongestConcept = { name: concept, mastery };
      }
      if (mastery < weakestConcept.mastery) {
        weakestConcept = { name: concept, mastery };
      }
    });
    
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Quiz Complete!</CardTitle>
              <CardDescription>You scored {score} out of {maxQuestions}</CardDescription>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-6">
          <div className="text-4xl font-bold mb-4 text-center">
            {Math.round((score / maxQuestions) * 100)}%
          </div>
          <Progress value={(score / maxQuestions) * 100} className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-background p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Estimated Skill Level</h3>
              <p className="text-lg font-semibold">{difficultyLevel}</p>
            </div>
            <div className="bg-background p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Questions Attempted</h3>
              <p className="text-lg font-semibold">{maxQuestions}</p>
            </div>
            <div className="bg-background p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Accuracy</h3>
              <p className="text-lg font-semibold">{Math.round((score / maxQuestions) * 100)}%</p>
            </div>
          </div>
          
          {conceptEntries.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Concept Mastery</h3>
              <div className="space-y-3">
                {conceptEntries.map(([concept, mastery]) => (
                  <div key={concept} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{concept.replace(/_/g, ' ')}</span>
                      <span className="text-sm font-medium">{Math.round(mastery * 100)}%</span>
                    </div>
                    <Progress value={mastery * 100} className="h-2" />
                  </div>
                ))}
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Strongest area:</span> {strongestConcept.name.replace(/_/g, ' ')}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Area for improvement:</span> {weakestConcept.name.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          )}
          
          <div className="p-4 rounded-lg bg-primary/5 border">
            <h3 className="text-lg font-medium mb-2">Assessment</h3>
            <p className="mb-4">
              {score >= maxQuestions * 0.8 
                ? 'Excellent work! You have a strong understanding of the concepts tested. Consider challenging yourself with more advanced material.' 
                : score >= maxQuestions * 0.6 
                  ? 'Good job! You understand most of the concepts, but there\'s room for improvement in some areas.' 
                  : 'Keep studying! Focus on the core concepts and try again to improve your score.'}
            </p>
            
            <h4 className="font-medium text-sm mb-1">Next Steps</h4>
            <ul className="text-sm space-y-1">
              {score >= maxQuestions * 0.8 ? (
                <>
                  <li className="flex items-center gap-2">
                    <CircleDot className="h-3 w-3 text-primary" />
                    <span>Advance to more complex topics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleDot className="h-3 w-3 text-primary" />
                    <span>Review any missed questions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleDot className="h-3 w-3 text-primary" />
                    <span>Explore practical applications of these concepts</span>
                  </li>
                </>
              ) : score >= maxQuestions * 0.6 ? (
                <>
                  <li className="flex items-center gap-2">
                    <CircleDot className="h-3 w-3 text-primary" />
                    <span>Review topics related to questions you missed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleDot className="h-3 w-3 text-primary" />
                    <span>Practice with similar questions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleDot className="h-3 w-3 text-primary" />
                    <span>Retake this quiz in a week to reinforce learning</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <CircleDot className="h-3 w-3 text-primary" />
                    <span>Focus on fundamental concepts first</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleDot className="h-3 w-3 text-primary" />
                    <span>Review study materials on {weakestConcept.name.replace(/_/g, ' ')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleDot className="h-3 w-3 text-primary" />
                    <span>Try simpler practice questions before returning to this quiz</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={resetQuiz} variant="outline">
            Restart Quiz
          </Button>
          <Button 
            onClick={() => {
              // Navigate to detailed results
              window.location.href = '/quiz-results';
            }}
          >
            Detailed Results
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (!currentQuestion) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>No questions available</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Unable to load quiz questions. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Question {currentQuestionIndex + 1} of {maxQuestions}</CardTitle>
            <CardDescription>
              Difficulty: {currentQuestion.difficulty < 0.4 ? 'Easy' : currentQuestion.difficulty < 0.7 ? 'Medium' : 'Hard'}
            </CardDescription>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <Compass className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={(Object.keys(answeredQuestions).length / maxQuestions) * 100} className="mb-6" />
        
        <div className="text-lg mb-4 bg-background p-4 rounded-lg border">
          {currentQuestion.isLatex ? (
            <LatexRenderer latex={currentQuestion.question} />
          ) : (
            currentQuestion.question
          )}
        </div>
        
        {!answeredQuestions[currentQuestion.id] && !showExplanation && (
          <div className="mb-4">
            <p className="text-sm mb-2">How confident are you about your answer?</p>
            <div className="flex gap-2">
              <Button 
                variant={confidenceRating[currentQuestion.id] === 0.25 ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleConfidenceRating(currentQuestion.id, 0.25)}
                className="flex-1"
              >
                Not Sure
              </Button>
              <Button 
                variant={confidenceRating[currentQuestion.id] === 0.5 ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleConfidenceRating(currentQuestion.id, 0.5)}
                className="flex-1"
              >
                Somewhat
              </Button>
              <Button 
                variant={confidenceRating[currentQuestion.id] === 0.75 ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleConfidenceRating(currentQuestion.id, 0.75)}
                className="flex-1"
              >
                Confident
              </Button>
              <Button 
                variant={confidenceRating[currentQuestion.id] === 1 ? "default" : "outline"} 
                size="sm" 
                onClick={() => handleConfidenceRating(currentQuestion.id, 1)}
                className="flex-1"
              >
                Very Sure
              </Button>
            </div>
          </div>
        )}
        
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
                onClick={() => {
                  if (!showResult && confidenceRating[currentQuestion.id]) {
                    handleAnswer(option.id);
                  } else if (!showResult) {
                    toast({
                      title: "Select confidence level",
                      description: "Please indicate how confident you are before answering",
                    });
                  }
                }}
                disabled={showResult}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center">
                    {option.id.toUpperCase()}
                  </div>
                  <div>
                    {option.isLatex ? (
                      <LatexRenderer latex={option.text} />
                    ) : (
                      option.text
                    )}
                  </div>
                </div>
                {showResult && isCorrect && (
                  <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle className="ml-auto h-5 w-5 text-red-500" />
                )}
              </Button>
            );
          })}
        </div>
        
        {showExplanation && currentQuestion.explanation && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg border text-sm">
            <div className="flex items-center gap-2 font-medium mb-2">
              <PenLine className="h-4 w-4" />
              Explanation
            </div>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdaptiveQuiz;
