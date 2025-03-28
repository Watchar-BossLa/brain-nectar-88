
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAdaptiveQuiz } from './hooks/adaptive-quiz';
import { useToast } from '@/components/ui/use-toast';
import { Brain, ChevronDown, ChevronRight, Dices, Settings, PieChart, Zap } from 'lucide-react';
import ActiveQuizCard from './components/ActiveQuizCard';
import QuizResults from './components/QuizResults';
import ConfidenceSlider from './components/ConfidenceSlider';
import { calculateQuizResults } from './hooks/quizUtils';
import FormulaDisplay from './components/FormulaDisplay';

// Mock data for now - this would come from an API or database
const mockQuestions = [
  {
    id: "q1",
    text: "What is the accounting equation?",
    type: "multiple-choice" as const,
    difficulty: 1 as const,
    options: [
      "Assets = Liabilities + Equity",
      "Assets = Liabilities - Equity",
      "Assets + Liabilities = Equity",
      "Assets + Equity = Liabilities"
    ],
    correctAnswer: "Assets = Liabilities + Equity",
    explanation: "The accounting equation forms the foundation of double-entry accounting. It states that a company's assets are equal to the sum of its liabilities and shareholders' equity.",
    topic: "Accounting Fundamentals",
    subject: "accounting" as const,
    useLatex: true
  },
  {
    id: "q2",
    text: "Calculate the present value of $1,000 to be received in 2 years, with an annual discount rate of 5%.",
    type: "calculation" as const,
    difficulty: 2 as const,
    correctAnswer: "907.03",
    explanation: "Present value is calculated using the formula PV = FV / (1 + r)^n",
    stepByStepExplanation: [
      "Identify the future value (FV): $1,000",
      "Identify the discount rate (r): 5% or 0.05",
      "Identify the time period (n): 2 years",
      "Apply the formula: PV = $1,000 / (1 + 0.05)^2",
      "PV = $1,000 / (1.05)^2",
      "PV = $1,000 / 1.1025",
      "PV = $907.03"
    ],
    topic: "Time Value of Money",
    subject: "finance" as const,
    useLatex: true
  },
  {
    id: "q3",
    text: "When preparing a balance sheet, which of the following items would be classified as a current asset?",
    type: "multiple-choice" as const,
    difficulty: 1 as const,
    options: [
      "Accounts Receivable",
      "Land",
      "Goodwill",
      "Long-term Investments"
    ],
    correctAnswer: "Accounts Receivable",
    explanation: "Current assets are assets that are expected to be converted to cash or used within one year or the operating cycle, whichever is longer. Accounts receivable are typically collected within a short period and are therefore classified as current assets.",
    topic: "Balance Sheet",
    subject: "accounting" as const
  },
  {
    id: "q4",
    text: "Calculate the depreciation expense for a machine that costs $50,000, has a salvage value of $10,000, and a useful life of 5 years using the straight-line method.",
    type: "calculation" as const,
    difficulty: 2 as const,
    correctAnswer: "8000",
    explanation: "The straight-line depreciation method allocates an equal amount of depreciation each year over the asset's useful life.",
    stepByStepExplanation: [
      "Calculate the depreciable cost: Cost - Salvage Value = $50,000 - $10,000 = $40,000",
      "Divide the depreciable cost by the useful life: $40,000 ÷ 5 years = $8,000 per year"
    ],
    topic: "Depreciation",
    subject: "accounting" as const,
    useLatex: true
  },
  {
    id: "q5",
    text: "In the context of financial statements, what does the term 'liquidity' refer to?",
    type: "multiple-choice" as const,
    difficulty: 1 as const,
    options: [
      "A company's ability to meet short-term obligations",
      "A company's ability to generate profit",
      "A company's ability to pay dividends",
      "A company's ability to raise long-term capital"
    ],
    correctAnswer: "A company's ability to meet short-term obligations",
    explanation: "Liquidity refers to a company's ability to convert assets into cash quickly to meet its short-term obligations and operational needs. It is a measure of how easily a company can pay its bills and debt obligations as they come due.",
    topic: "Financial Analysis",
    subject: "finance" as const
  },
  {
    id: "q6",
    text: "True or False: Retained earnings represent cash available to pay dividends.",
    type: "true-false" as const,
    difficulty: 2 as const,
    options: ["True", "False"],
    correctAnswer: "False",
    explanation: "Retained earnings represent the accumulated net income that has not been distributed as dividends, but it does not necessarily indicate available cash. Retained earnings can be reinvested in the business through various assets, not just held as cash.",
    topic: "Equity",
    subject: "accounting" as const
  },
  {
    id: "q7",
    text: "Calculate the Return on Assets (ROA) for a company with net income of $120,000 and average total assets of $1,500,000.",
    type: "calculation" as const,
    difficulty: 2 as const,
    correctAnswer: "0.08",
    explanation: "Return on Assets (ROA) measures how efficiently a company is using its assets to generate profit.",
    stepByStepExplanation: [
      "Identify the net income: $120,000",
      "Identify the average total assets: $1,500,000",
      "Apply the formula: ROA = Net Income / Average Total Assets",
      "ROA = $120,000 / $1,500,000",
      "ROA = 0.08 or 8%"
    ],
    topic: "Financial Ratios",
    subject: "finance" as const,
    useLatex: true
  },
  {
    id: "q8",
    text: "When a company issues stock at a price higher than its par value, where is the excess amount recorded?",
    type: "multiple-choice" as const,
    difficulty: 3 as const,
    options: [
      "Additional Paid-in Capital",
      "Retained Earnings",
      "Treasury Stock",
      "Dividends Payable"
    ],
    correctAnswer: "Additional Paid-in Capital",
    explanation: "When a company issues stock above its par value, the par value is recorded in the common stock account, and the excess amount (premium) is recorded in the Additional Paid-in Capital account.",
    topic: "Stockholders' Equity",
    subject: "accounting" as const
  },
  {
    id: "q9",
    text: "Which of the following is NOT part of the GAAP matching principle?",
    type: "multiple-choice" as const,
    difficulty: 3 as const,
    options: [
      "Recording revenues when earned regardless of cash receipt",
      "Recording expenses in the period they are paid",
      "Matching expenses to the revenues they help generate",
      "Recording expenses in the period they are incurred"
    ],
    correctAnswer: "Recording expenses in the period they are paid",
    explanation: "The matching principle states that expenses should be recorded in the same accounting period as the revenues they help generate, regardless of when the cash is paid. Recording expenses when they are paid is the cash basis of accounting, not the accrual basis required by GAAP.",
    topic: "Accounting Principles",
    subject: "accounting" as const
  },
  {
    id: "q10",
    text: "Calculate the debt-to-equity ratio for a company with total liabilities of $250,000 and total shareholders' equity of $500,000.",
    type: "calculation" as const,
    difficulty: 1 as const,
    correctAnswer: "0.5",
    explanation: "The debt-to-equity ratio measures a company's financial leverage by comparing total liabilities to shareholders' equity.",
    stepByStepExplanation: [
      "Identify total liabilities: $250,000",
      "Identify total shareholders' equity: $500,000",
      "Apply the formula: Debt-to-Equity Ratio = Total Liabilities / Total Shareholders' Equity",
      "Debt-to-Equity Ratio = $250,000 / $500,000",
      "Debt-to-Equity Ratio = 0.5"
    ],
    topic: "Financial Ratios",
    subject: "finance" as const,
    useLatex: true
  }
];

const topics = [
  "Accounting Fundamentals",
  "Balance Sheet",
  "Depreciation",
  "Financial Analysis",
  "Equity",
  "Financial Ratios",
  "Stockholders' Equity",
  "Accounting Principles",
  "Time Value of Money"
];

const subjects = [
  "accounting",
  "finance",
  "mathematics",
  "economics"
];

const AdaptiveQuizPlatform: React.FC = () => {
  const { toast } = useToast();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(5);
  const [initialDifficulty, setInitialDifficulty] = useState<1 | 2 | 3>(2);
  const [showSettings, setShowSettings] = useState(false);
  const [userConfidence, setUserConfidence] = useState(0.5);
  const [activeTab, setActiveTab] = useState("quiz");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["accounting", "finance"]);
  const [filteredQuestions, setFilteredQuestions] = useState(mockQuestions);
  
  const quiz = useAdaptiveQuiz(filteredQuestions, initialDifficulty, questionCount);
  
  // Filter questions based on selected topics and subjects
  useEffect(() => {
    let filtered = mockQuestions;
    
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(q => selectedTopics.includes(q.topic));
    }
    
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter(q => q.subject && selectedSubjects.includes(q.subject));
    }
    
    setFilteredQuestions(filtered);
  }, [selectedTopics, selectedSubjects]);
  
  const handleTopicChange = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    );
  };
  
  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };
  
  const handleQuestionCountChange = (value: string) => {
    setQuestionCount(parseInt(value));
  };
  
  const handleDifficultyChange = (value: string) => {
    setInitialDifficulty(parseInt(value) as 1 | 2 | 3);
  };
  
  const handleStartQuiz = () => {
    if (filteredQuestions.length < questionCount) {
      toast({
        title: "Not enough questions",
        description: `Only ${filteredQuestions.length} questions available with current filters. Please adjust your settings.`,
        variant: "destructive"
      });
      return;
    }
    
    quiz.startQuiz();
    setShowSettings(false);
  };
  
  const handleRandomQuiz = () => {
    // Randomly select topics and difficulty
    const randomTopicCount = Math.floor(Math.random() * 3) + 1;
    const shuffledTopics = [...topics].sort(() => 0.5 - Math.random());
    const randomTopics = shuffledTopics.slice(0, randomTopicCount);
    
    const randomDifficulty = Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3;
    
    setSelectedTopics(randomTopics);
    setInitialDifficulty(randomDifficulty);
    setTimeout(() => {
      handleStartQuiz();
    }, 100);
  };
  
  const handleConfidenceChange = (value: number) => {
    setUserConfidence(value);
    quiz.setConfidence(value);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="formulas">Key Formulas</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          {!quiz.activeQuiz && !quiz.quizResults && (
            <div className="flex items-center gap-2">
              <Button 
                variant={showSettings ? "secondary" : "outline"} 
                onClick={() => setShowSettings(!showSettings)}
                size="sm"
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
              <Button 
                onClick={handleRandomQuiz}
                size="sm"
                variant="outline"
              >
                <Dices className="h-4 w-4 mr-1" />
                Random Quiz
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="quiz">
          {!quiz.activeQuiz && !quiz.quizResults && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Adaptive Quiz System
                  </CardTitle>
                  <CardDescription>
                    Test your knowledge with questions that adapt to your skill level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showSettings ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Select Topics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {topics.map(topic => (
                            <div key={topic} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`topic-${topic}`} 
                                checked={selectedTopics.includes(topic)}
                                onCheckedChange={() => handleTopicChange(topic)}
                              />
                              <Label htmlFor={`topic-${topic}`}>{topic}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Select Subjects</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {subjects.map(subject => (
                            <div key={subject} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`subject-${subject}`} 
                                checked={selectedSubjects.includes(subject)}
                                onCheckedChange={() => handleSubjectChange(subject)}
                              />
                              <Label htmlFor={`subject-${subject}`} className="capitalize">{subject}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="question-count">Number of Questions</Label>
                          <Select 
                            value={questionCount.toString()} 
                            onValueChange={handleQuestionCountChange}
                          >
                            <SelectTrigger id="question-count">
                              <SelectValue placeholder="Select number of questions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 Questions</SelectItem>
                              <SelectItem value="5">5 Questions</SelectItem>
                              <SelectItem value="10">10 Questions</SelectItem>
                              <SelectItem value="15">15 Questions</SelectItem>
                              <SelectItem value="20">20 Questions</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="difficulty">Initial Difficulty</Label>
                          <Select 
                            value={initialDifficulty.toString()} 
                            onValueChange={handleDifficultyChange}
                          >
                            <SelectTrigger id="difficulty">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Easy</SelectItem>
                              <SelectItem value="2">Medium</SelectItem>
                              <SelectItem value="3">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="text-center space-y-2 mb-6">
                        <h2 className="text-xl font-semibold">Ready to test your knowledge?</h2>
                        <p className="text-muted-foreground">
                          This adaptive quiz will adjust to your skill level as you progress.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                        <Button 
                          className="w-full"
                          onClick={handleStartQuiz}
                        >
                          Start Quiz
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setShowSettings(true)}
                        >
                          Customize
                          <Settings className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                {showSettings && (
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowSettings(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleStartQuiz}>
                      Start Quiz
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          )}
          
          {quiz.activeQuiz && quiz.currentQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ActiveQuizCard
                currentQuestion={quiz.currentQuestion}
                currentIndex={quiz.currentIndex}
                availableQuestions={filteredQuestions.slice(0, questionCount)}
                selectedAnswer={quiz.selectedAnswer}
                setSelectedAnswer={quiz.setSelectedAnswer}
                isAnswerSubmitted={quiz.isAnswerSubmitted}
                isCorrect={quiz.isCorrect}
                submitAnswer={quiz.submitAnswer}
                nextQuestion={quiz.nextQuestion}
                previousQuestion={quiz.previousQuestion}
                skipQuestion={quiz.skipQuestion}
              />
              
              {!quiz.isAnswerSubmitted && (
                <div className="mt-4">
                  <ConfidenceSlider
                    value={userConfidence}
                    onChange={handleConfidenceChange}
                    disabled={quiz.isAnswerSubmitted}
                  />
                </div>
              )}
            </motion.div>
          )}
          
          {quiz.quizResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <QuizResults 
                results={quiz.quizResults}
                onRestart={quiz.restartQuiz}
              />
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="formulas">
          <Card>
            <CardHeader>
              <CardTitle>Key Accounting & Finance Formulas</CardTitle>
              <CardDescription>Reference these formulas during your studies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormulaDisplay 
                formula="\\text{Assets} = \\text{Liabilities} + \\text{Equity}"
                explanation="The fundamental accounting equation that forms the basis of double-entry bookkeeping."
                isHighlighted
              />
              
              <FormulaDisplay 
                formula="\\text{ROA} = \\frac{\\text{Net Income}}{\\text{Average Total Assets}}"
                explanation="Return on Assets measures how efficiently a company is using its assets to generate profit."
              />
              
              <FormulaDisplay 
                formula="\\text{PV} = \\frac{\\text{FV}}{(1 + r)^n}"
                explanation="Present Value formula calculates the current value of a future sum of money."
              />
              
              <FormulaDisplay 
                formula="\\text{Debt-to-Equity} = \\frac{\\text{Total Liabilities}}{\\text{Total Equity}}"
                explanation="Measures a company's financial leverage by comparing debt financing to equity financing."
              />
              
              <FormulaDisplay 
                formula="\\text{Annual Depreciation} = \\frac{\\text{Cost} - \\text{Salvage Value}}{\\text{Useful Life}}"
                explanation="Straight-line depreciation allocates the cost of an asset evenly over its useful life."
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Your Performance Analytics
              </CardTitle>
              <CardDescription>
                Track your progress and identify areas for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-muted-foreground py-12">
                  {quiz.answeredQuestions.length > 0 ? (
                    "Complete more quizzes to see detailed analytics here."
                  ) : (
                    "You haven't taken any quizzes yet. Start a quiz to see your analytics."
                  )}
                </p>
                
                {/* Placeholder for future analytics charts */}
                <div className="flex justify-center">
                  <Button onClick={() => setActiveTab("quiz")} className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Take a Quiz
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdaptiveQuizPlatform;
