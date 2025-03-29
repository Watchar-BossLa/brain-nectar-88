import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Loader2 } from 'lucide-react';
import { useAssessmentGeneration } from '../hooks/useAssessmentGeneration';

interface QuizSetupCardProps {
  allTopics: string[];
  selectedTopics: string[];
  toggleTopic: (topic: string) => void;
  allSubjects: string[];
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  quizLength: number;
  setQuizLength: (length: number) => void;
  currentDifficulty: 1 | 2 | 3;
  setCurrentDifficulty: (difficulty: 1 | 2 | 3) => void;
  startQuiz: () => void;
  isProcessing?: boolean;
  processingText?: string;
}

const QuizSetupCard: React.FC<QuizSetupCardProps> = ({ 
  allTopics, 
  selectedTopics, 
  toggleTopic,
  allSubjects,
  selectedSubject,
  setSelectedSubject,
  quizLength, 
  setQuizLength, 
  currentDifficulty, 
  setCurrentDifficulty, 
  startQuiz,
  isProcessing = false,
  processingText = "Processing..."
}) => {
  const { generateQuestions, isGenerating } = useAssessmentGeneration();
  
  const handleStartQuiz = async () => {
    const questions = await generateQuestions(selectedTopics, {
      difficulty: currentDifficulty,
      questionCount: quizLength
    });
    
    if (questions) {
      startQuiz();
    }
  };
  
  // Helper to capitalize first letter of string
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5" />
          Adaptive Quiz Platform
        </CardTitle>
        <CardDescription>
          Test your knowledge with questions that adapt to your skill level
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Select Subject</h3>
          <div className="flex flex-wrap gap-2">
            {allSubjects.map(subject => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                onClick={() => setSelectedSubject(subject)}
                className="mb-1"
              >
                {capitalize(subject)}
              </Button>
            ))}
          </div>
        </div>
        
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
        <Button 
          onClick={handleStartQuiz} 
          className="w-full" 
          disabled={isGenerating || isProcessing}
        >
          {isGenerating || isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isGenerating ? "Generating Questions..." : processingText}
            </>
          ) : (
            "Start Quiz"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizSetupCard;
