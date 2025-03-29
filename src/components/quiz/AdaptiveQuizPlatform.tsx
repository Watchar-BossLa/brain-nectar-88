
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdaptiveQuiz } from './hooks/adaptive-quiz';
import { useToast } from '@/components/ui/use-toast';
import { Brain, Dices, Settings } from 'lucide-react';

// Import mockQuestions from a data file or service
import { mockQuestions, topics, subjects } from './data/mockQuizData';

// Import refactored components
import QuizSettings from './components/platform/QuizSettings';
import QuizWelcome from './components/platform/QuizWelcome';
import FormulasTab from './components/platform/FormulasTab';
import AnalyticsTab from './components/platform/AnalyticsTab';
import ActiveQuiz from './components/platform/ActiveQuiz';
import QuizResults from './components/QuizResults';

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
                    <QuizSettings
                      topics={topics}
                      selectedTopics={selectedTopics}
                      handleTopicChange={handleTopicChange}
                      subjects={subjects}
                      selectedSubjects={selectedSubjects}
                      handleSubjectChange={handleSubjectChange}
                      questionCount={questionCount}
                      handleQuestionCountChange={handleQuestionCountChange}
                      initialDifficulty={initialDifficulty}
                      handleDifficultyChange={handleDifficultyChange}
                      showSettings={showSettings}
                      setShowSettings={setShowSettings}
                      handleStartQuiz={handleStartQuiz}
                    />
                  ) : (
                    <QuizWelcome
                      setShowSettings={setShowSettings}
                      handleStartQuiz={handleStartQuiz}
                    />
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
            <ActiveQuiz
              quiz={quiz}
              filteredQuestions={filteredQuestions}
              questionCount={questionCount}
              userConfidence={userConfidence}
              handleConfidenceChange={handleConfidenceChange}
            />
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
          <FormulasTab />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsTab
            answeredQuestions={quiz.answeredQuestions}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdaptiveQuizPlatform;
