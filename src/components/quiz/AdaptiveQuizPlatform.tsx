import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Check, 
  X, 
  HelpCircle, 
  BookOpen,
  Calculator,
  BrainCircuit,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { renderLatexContent } from '../flashcards/utils/latex-renderer';

// Define question types
type QuestionType = 'multiple-choice' | 'calculation' | 'essay' | 'true-false';

interface QuizQuestion {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: 1 | 2 | 3; // 1: Easy, 2: Medium, 3: Hard
  options?: string[];
  correctAnswer?: string | string[];
  explanation: string;
  topic: string;
  useLatex?: boolean;
}

// Sample quiz questions at different difficulty levels
const quizQuestions: QuizQuestion[] = [
  // Easy questions (difficulty 1)
  {
    id: 'e1',
    text: 'Which of the following is a component of the accounting equation?',
    type: 'multiple-choice',
    difficulty: 1,
    options: ['Revenues', 'Assets', 'Dividends', 'Expenses'],
    correctAnswer: 'Assets',
    explanation: 'The accounting equation is Assets = Liabilities + Equity. Revenues and expenses affect equity through retained earnings, and dividends reduce equity, but they are not primary components of the accounting equation.',
    topic: 'Accounting Fundamentals'
  },
  {
    id: 'e2',
    text: 'In accounting, debits increase asset accounts.',
    type: 'true-false',
    difficulty: 1,
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'In the double-entry bookkeeping system, debits increase asset accounts and expense accounts, while credits increase liability accounts, equity accounts, and revenue accounts.',
    topic: 'Debits and Credits'
  },
  {
    id: 'e3',
    text: 'Calculate the ending inventory using FIFO method:\n\nBeginning inventory: 10 units at $8 each\nPurchase 1: 15 units at $10 each\nPurchase 2: 20 units at $12 each\nSold: 30 units',
    type: 'calculation',
    difficulty: 1,
    correctAnswer: '180',
    explanation: 'Using FIFO (First-In, First-Out), the first units purchased are the first sold. We sold 30 units total.\n10 units from beginning inventory + 15 units from first purchase + 5 units from second purchase = 30 units sold\nEnding inventory = 15 units from second purchase at $12 each = $180',
    topic: 'Inventory Valuation',
    useLatex: true
  },
  
  // Medium questions (difficulty 2)
  {
    id: 'm1',
    text: 'Which of the following statements about cash flow is NOT correct?',
    type: 'multiple-choice',
    difficulty: 2,
    options: [
      'A company can have positive net income but negative cash flow',
      'Purchase of equipment is an operating cash flow',
      'Payment of dividends is a financing cash flow',
      'Collection of accounts receivable is an operating cash flow'
    ],
    correctAnswer: 'Purchase of equipment is an operating cash flow',
    explanation: 'Purchase of equipment is an investing cash flow, not an operating cash flow. Operating cash flows relate to day-to-day operations, investing cash flows relate to long-term assets, and financing cash flows relate to debt and equity financing.',
    topic: 'Cash Flow'
  },
  {
    id: 'm2',
    text: 'Calculate the break-even point in units when:\n\nFixed costs = $120,000\nSelling price per unit = $50\nVariable cost per unit = $30',
    type: 'calculation',
    difficulty: 2,
    correctAnswer: '6000',
    explanation: 'Break-even point in units = Fixed costs ÷ Contribution margin per unit\nContribution margin per unit = Selling price per unit - Variable cost per unit\nContribution margin per unit = $50 - $30 = $20\nBreak-even point = $120,000 ÷ $20 = 6,000 units',
    topic: 'Cost-Volume-Profit Analysis',
    useLatex: true
  },
  {
    id: 'm3',
    text: 'Under IFRS, development costs must be capitalized when certain criteria are met.',
    type: 'true-false',
    difficulty: 2,
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Under IFRS (IAS 38), development costs must be capitalized when technical feasibility, intention to complete, ability to use or sell, generation of future economic benefits, resources to complete, and ability to measure costs reliably are all demonstrated. This differs from US GAAP, which generally expenses R&D costs as incurred.',
    topic: 'IFRS Standards'
  },
  
  // Hard questions (difficulty 3)
  {
    id: 'h1',
    text: 'Calculate the present value of a 5-year ordinary annuity with annual payments of $10,000 and a discount rate of 8%.',
    type: 'calculation',
    difficulty: 3,
    correctAnswer: '39927',
    explanation: 'The present value of an ordinary annuity can be calculated using the formula:\nPV = PMT × [(1 - (1 + r)^-n) ÷ r]\nWhere PMT = payment, r = rate, n = number of periods\nPV = $10,000 × [(1 - (1 + 0.08)^-5) ÷ 0.08]\nPV = $10,000 × [(1 - 0.6806) ÷ 0.08]\nPV = $10,000 × [0.3194 ÷ 0.08]\nPV = $10,000 × 3.9927\nPV = $39,927',
    topic: 'Time Value of Money',
    useLatex: true
  },
  {
    id: 'h2',
    text: 'Which of the following is NOT a required disclosure under ASC 842 (Leases)?',
    type: 'multiple-choice',
    difficulty: 3,
    options: [
      'Information about variable lease payments',
      'Maturity analysis of lease liabilities',
      'Weighted-average discount rate for leases',
      'Detailed information about lessor\'s residual value guarantees'
    ],
    correctAnswer: 'Detailed information about lessor\'s residual value guarantees',
    explanation: 'ASC 842 requires lessees to disclose information about variable lease payments, maturity analysis of lease liabilities, and weighted-average discount rates. While some information about residual value guarantees is required, detailed information about lessor\'s residual value guarantees is not a specific disclosure requirement for lessees under ASC 842.',
    topic: 'Lease Accounting'
  },
  {
    id: 'h3',
    text: 'Explain the concept of "substance over form" in accounting and provide an example of how it affects financial reporting.',
    type: 'essay',
    difficulty: 3,
    explanation: 'Substance over form is an accounting principle that states transactions should be recorded and presented in financial statements according to their economic substance rather than their legal form. For example, in a sale and leaseback transaction that is essentially a financing arrangement, the asset might remain on the seller\'s balance sheet despite legal transfer of ownership if the seller retains the risks and rewards of ownership. Another example is when a special purpose entity (SPE) might be consolidated in a company\'s financial statements despite being legally separate if the company effectively controls it and bears its risks and rewards.',
    topic: 'Accounting Principles'
  },
  {
    id: 'h4',
    text: 'Calculate the effective annual interest rate when the nominal rate is 12% compounded monthly.',
    type: 'calculation',
    difficulty: 3,
    correctAnswer: '12.68',
    explanation: 'The formula for effective annual rate (EAR) is:\nEAR = (1 + r/m)^m - 1\nWhere r = nominal rate and m = number of compounding periods per year\nEAR = (1 + 0.12/12)^12 - 1\nEAR = (1 + 0.01)^12 - 1\nEAR = 1.1268 - 1\nEAR = 0.1268 or 12.68%',
    topic: 'Interest Rates',
    useLatex: true
  },
];

interface QuizResults {
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  performanceByTopic: Record<string, { correct: number; total: number }>;
  performanceByDifficulty: Record<string, { correct: number; total: number }>;
  timeSpent: number;
}

const AdaptiveQuizPlatform = () => {
  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3>(2); // Start with medium difficulty
  const [availableQuestions, setAvailableQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [quizLength, setQuizLength] = useState(5);
  const [answeredQuestions, setAnsweredQuestions] = useState<{
    id: string;
    isCorrect: boolean;
    userAnswer: string;
    timeTaken: number;
  }[]>([]);
  
  // Get unique topics for topic selection
  const allTopics = [...new Set(quizQuestions.map(q => q.topic))];
  
  // Start a new quiz
  const startQuiz = () => {
    // Filter questions based on selected topics (if any)
    let questionsPool = selectedTopics.length > 0
      ? quizQuestions.filter(q => selectedTopics.includes(q.topic))
      : quizQuestions;
    
    // If no questions match the criteria, use all questions
    if (questionsPool.length === 0) {
      questionsPool = quizQuestions;
    }
    
    // Start with questions at the current difficulty level
    let initialQuestions = questionsPool.filter(q => q.difficulty === currentDifficulty);
    
    // If not enough questions at current difficulty, add questions from other difficulties
    if (initialQuestions.length < quizLength) {
      const remainingQuestions = questionsPool.filter(q => q.difficulty !== currentDifficulty);
      initialQuestions = [...initialQuestions, ...remainingQuestions];
    }
    
    // Shuffle and limit to quiz length
    const shuffled = initialQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, quizLength);
    
    setAvailableQuestions(selected);
    setCurrentQuestion(selected[0] || null);
    setCurrentIndex(0);
    setIsAnswerSubmitted(false);
    setSelectedAnswer('');
    setIsCorrect(null);
    setActiveQuiz(true);
    setAnsweredQuestions([]);
    setStartTime(Date.now());
    setQuizResults(null);
  };
  
  // Submit answer for current question
  const submitAnswer = () => {
    if (!currentQuestion) return;
    
    const questionStartTime = startTime || Date.now();
    const timeTaken = Date.now() - questionStartTime;
    setStartTime(Date.now()); // Reset for next question
    
    let correct = false;
    
    if (currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') {
      correct = selectedAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'calculation') {
      // For calculation questions, allow a small tolerance for rounding errors
      const userAnswer = parseFloat(selectedAnswer);
      const correctAnswer = parseFloat(currentQuestion.correctAnswer as string);
      correct = !isNaN(userAnswer) && Math.abs(userAnswer - correctAnswer) < 0.01;
    } else if (currentQuestion.type === 'essay') {
      // Essay questions are marked as "review needed" - no automatic scoring
      correct = false; // Will be manually evaluated
    }
    
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);
    
    // Update answered questions
    setAnsweredQuestions([
      ...answeredQuestions,
      {
        id: currentQuestion.id,
        isCorrect: correct,
        userAnswer: selectedAnswer,
        timeTaken: timeTaken
      }
    ]);
    
    // Adapt difficulty based on performance for the next question
    adaptDifficulty(correct);
  };
  
  // Move to the next question
  const nextQuestion = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < availableQuestions.length) {
      setCurrentQuestion(availableQuestions[nextIndex]);
      setCurrentIndex(nextIndex);
      setSelectedAnswer('');
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
    } else {
      // End of quiz, show results
      finishQuiz();
    }
  };
  
  // Move to the previous question (review mode)
  const previousQuestion = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentQuestion(availableQuestions[prevIndex]);
      setCurrentIndex(prevIndex);
      
      // Restore previous answer
      const prevAnswer = answeredQuestions.find(q => q.id === availableQuestions[prevIndex].id);
      setSelectedAnswer(prevAnswer?.userAnswer || '');
      setIsAnswerSubmitted(true);
      setIsCorrect(prevAnswer?.isCorrect || false);
    }
  };
  
  // Skip current question
  const skipQuestion = () => {
    // Mark as skipped in answered questions
    setAnsweredQuestions([
      ...answeredQuestions,
      {
        id: currentQuestion?.id || '',
        isCorrect: false,
        userAnswer: 'SKIPPED',
        timeTaken: 0
      }
    ]);
    
    nextQuestion();
  };
  
  // Adapt difficulty based on performance
  const adaptDifficulty = (isCorrect: boolean) => {
    // Get performance on recent questions (last 3 or fewer if not enough)
    const recentQuestions = [...answeredQuestions, { id: currentQuestion?.id || '', isCorrect, userAnswer: selectedAnswer, timeTaken: 0 }];
    const recentPerformance = recentQuestions.slice(-3).filter(q => q.id !== '');
    
    // Calculate success rate
    const successRate = recentPerformance.length > 0
      ? recentPerformance.filter(q => q.isCorrect).length / recentPerformance.length
      : 0.5;
    
    // Adjust difficulty based on performance
    if (successRate > 0.7 && currentDifficulty < 3) {
      // Doing well, increase difficulty
      setCurrentDifficulty((prev) => Math.min(3, prev + 1) as 1 | 2 | 3);
    } else if (successRate < 0.3 && currentDifficulty > 1) {
      // Struggling, decrease difficulty
      setCurrentDifficulty((prev) => Math.max(1, prev - 1) as 1 | 2 | 3);
    }
    // Otherwise keep current difficulty
  };
  
  // Finish quiz and calculate results
  const finishQuiz = () => {
    const results: QuizResults = {
      questionsAttempted: answeredQuestions.length,
      correctAnswers: answeredQuestions.filter(q => q.isCorrect).length,
      incorrectAnswers: answeredQuestions.filter(q => !q.isCorrect && q.userAnswer !== 'SKIPPED').length,
      skippedQuestions: answeredQuestions.filter(q => q.userAnswer === 'SKIPPED').length,
      performanceByTopic: {},
      performanceByDifficulty: {
        'Easy': { correct: 0, total: 0 },
        'Medium': { correct: 0, total: 0 },
        'Hard': { correct: 0, total: 0 }
      },
      timeSpent: answeredQuestions.reduce((total, q) => total + q.timeTaken, 0)
    };
    
    // Calculate performance by topic
    for (const answered of answeredQuestions) {
      const question = quizQuestions.find(q => q.id === answered.id);
      if (question) {
        const { topic, difficulty } = question;
        
        // Performance by topic
        if (!results.performanceByTopic[topic]) {
          results.performanceByTopic[topic] = { correct: 0, total: 0 };
        }
        results.performanceByTopic[topic].total += 1;
        if (answered.isCorrect) {
          results.performanceByTopic[topic].correct += 1;
        }
        
        // Performance by difficulty
        const difficultyLabel = difficulty === 1 ? 'Easy' : difficulty === 2 ? 'Medium' : 'Hard';
        results.performanceByDifficulty[difficultyLabel].total += 1;
        if (answered.isCorrect) {
          results.performanceByDifficulty[difficultyLabel].correct += 1;
        }
      }
    }
    
    setQuizResults(results);
    setActiveQuiz(false);
  };
  
  // Restart quiz with same settings
  const restartQuiz = () => {
    startQuiz();
  };
  
  // Toggle topic selection
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {!activeQuiz && !quizResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5" />
              Adaptive Quiz Platform
            </CardTitle>
            <CardDescription>
              Test your accounting knowledge with questions that adapt to your skill level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Select Topics</h3>
              <div className="flex flex-wrap gap-2">
                {allTopics.map(topic => (
                  <Button
                    key={topic}
                    variant={selectedTopics.includes(topic) ? "default" : "outline"}
                    onClick={() => toggleTopic(topic)}
                    className="mb-1"
                  >
                    {topic}
                  </Button>
                ))}
              </div>
              {selectedTopics.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  No topics selected. All topics will be included.
                </p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Quiz Length</h3>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={quizLength}
                  onChange={(e) => setQuizLength(Math.min(10, Math.max(1, parseInt(e.target.value) || 5)))}
                  className="w-20"
                />
                <span>questions</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Initial Difficulty</h3>
              <div className="flex space-x-2">
                <Button
                  variant={currentDifficulty === 1 ? "default" : "outline"}
                  onClick={() => setCurrentDifficulty(1)}
                >
                  Easy
                </Button>
                <Button
                  variant={currentDifficulty === 2 ? "default" : "outline"}
                  onClick={() => setCurrentDifficulty(2)}
                >
                  Medium
                </Button>
                <Button
                  variant={currentDifficulty === 3 ? "default" : "outline"}
                  onClick={() => setCurrentDifficulty(3)}
                >
                  Hard
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={startQuiz} className="w-full">Start Quiz</Button>
          </CardFooter>
        </Card>
      )}
      
      {activeQuiz && currentQuestion && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentQuestion.type === 'multiple-choice' && <HelpCircle className="h-5 w-5" />}
                  {currentQuestion.type === 'calculation' && <Calculator className="h-5 w-5" />}
                  {currentQuestion.type === 'essay' && <BookOpen className="h-5 w-5" />}
                  {currentQuestion.type === 'true-false' && <Brain className="h-5 w-5" />}
                  
                  Question {currentIndex + 1} of {availableQuestions.length}
                </CardTitle>
                <CardDescription>
                  Topic: {currentQuestion.topic} | Difficulty: {
                    currentQuestion.difficulty === 1 ? 'Easy' : 
                    currentQuestion.difficulty === 2 ? 'Medium' : 'Hard'
                  }
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {isAnswerSubmitted && (
                  isCorrect 
                    ? <Check className="h-6 w-6 text-green-500" />
                    : <X className="h-6 w-6 text-red-500" />
                )}
              </div>
            </div>
            <Progress 
              value={(currentIndex + 1) / availableQuestions.length * 100} 
              className="h-2"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-6">
              {currentQuestion.useLatex 
                ? renderLatexContent(currentQuestion.text, true)
                : <p className="text-lg whitespace-pre-line">{currentQuestion.text}</p>
              }
            </div>
            
            {/* Question input based on type */}
            {!isAnswerSubmitted ? (
              <>
                {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') && (
                  <RadioGroup 
                    value={selectedAnswer} 
                    onValueChange={setSelectedAnswer}
                    className="space-y-2"
                  >
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {currentQuestion.type === 'calculation' && (
                  <div className="space-y-2">
                    <Label htmlFor="calculation-answer">Your Answer</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">$</span>
                      <Input 
                        id="calculation-answer"
                        type="number"
                        step="0.01"
                        placeholder="Enter your answer"
                        value={selectedAnswer}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {currentQuestion.type === 'essay' && (
                  <div className="space-y-2">
                    <Label htmlFor="essay-answer">Your Answer</Label>
                    <Textarea 
                      id="essay-answer"
                      placeholder="Type your response here..."
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      rows={6}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <h3 className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h3>
                  
                  {!isCorrect && currentQuestion.type !== 'essay' && (
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Correct answer: </span>
                      {typeof currentQuestion.correctAnswer === 'string' 
                        ? currentQuestion.correctAnswer 
                        : currentQuestion.correctAnswer?.join(', ')}
                    </div>
                  )}
                  
                  <div className="mt-2">
                    <h4 className="font-medium mb-1">Explanation:</h4>
                    <p className="text-sm whitespace-pre-line">{currentQuestion.explanation}</p>
                  </div>
                </div>
                
                {currentQuestion.type === 'essay' && (
                  <div className="p-4 border rounded-md bg-amber-50">
                    <h3 className="font-medium text-amber-700 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Essay Response
                    </h3>
                    <p className="text-sm mt-1">
                      Essay responses require manual review. Your answer has been recorded.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {!isAnswerSubmitted ? (
              <div className="flex w-full gap-2">
                <Button 
                  variant="outline" 
                  onClick={skipQuestion}
                  className="mr-auto"
                >
                  Skip
                </Button>
                <Button 
                  onClick={submitAnswer}
                  disabled={!selectedAnswer}
                  className="ml-auto"
                >
                  Submit Answer
                </Button>
              </div>
            ) : (
              <div className="flex w-full gap-2">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={currentIndex === 0}
                  className="mr-auto"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button onClick={nextQuestion} className="ml-auto">
                  {currentIndex === availableQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  {currentIndex !== availableQuestions.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      )}
      
      {quizResults && (
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
                <div className="space-y-3">
                  {Object.entries(quizResults.performanceByTopic).map(([topic, { correct, total }]) => (
                    <div key={topic} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{topic}</span>
                        <span className="text-sm">{correct} / {total} ({Math.round(correct / total * 100)}%)</span>
                      </div>
                      <Progress value={correct / total * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="difficulty" className="mt-4">
                <div className="space-y-3">
                  {Object.entries(quizResults.performanceByDifficulty)
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
              </TabsContent>
              <TabsContent value="review" className="mt-4">
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
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => {
              setQuizResults(null);
              setActiveQuiz(false);
            }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              New Quiz
            </Button>
            <Button onClick={restartQuiz}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart Similar Quiz
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AdaptiveQuizPlatform;
