
import React, { useState } from 'react';
import { QuizQuestion as QuizQuestionType } from '../../types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle, Camera } from 'lucide-react';
import QuestionDisplay from '../QuestionDisplay';
import { useToast } from '@/components/ui/use-toast';
import CameraCapture from '../media/CameraCapture';
import AITutorAssistant from '../ai-tutor/AITutorAssistant';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onSubmit: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onSubmit,
  questionNumber,
  totalQuestions
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | undefined>(undefined);
  const [showAITutor, setShowAITutor] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "You need to select an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Check if the answer is correct
    let correct = false;
    if (Array.isArray(question.correctAnswer)) {
      correct = question.correctAnswer.includes(selectedAnswer);
    } else {
      correct = selectedAnswer === question.correctAnswer;
    }
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);
    
    // Send the answer to the parent component
    onSubmit(selectedAnswer);
  };

  const handleNext = () => {
    // Reset for next question
    setSelectedAnswer('');
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
  };

  const handleCameraCapture = () => {
    setShowCamera(true);
  };

  const handleImageCaptured = (imageData: string) => {
    setCapturedImage(imageData);
    setShowCamera(false);
    setShowAITutor(true);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const handleCloseAITutor = () => {
    setShowAITutor(false);
    setCapturedImage(undefined);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCameraCapture}
            className="flex items-center gap-1"
          >
            <Camera className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Get Help</span>
          </Button>
          <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full font-medium">
            {question.difficulty === 1 ? 'Easy' : question.difficulty === 2 ? 'Medium' : 'Hard'}
          </span>
        </div>
      </div>
      
      <CardContent>
        <QuestionDisplay
          question={question}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          isAnswerSubmitted={isAnswerSubmitted}
          isCorrect={isCorrect}
        />
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 border-t">
        {isAnswerSubmitted ? (
          <Button 
            onClick={handleNext} 
            className="w-full"
          >
            Next Question <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            className="w-full" 
            disabled={!selectedAnswer}
          >
            Submit Answer
          </Button>
        )}
      </CardFooter>

      {showCamera && (
        <CameraCapture 
          onImageCaptured={handleImageCaptured}
          onClose={handleCloseCamera}
        />
      )}

      {showAITutor && (
        <AITutorAssistant
          mediaSource={capturedImage}
          mediaType="image"
          subject={question.subject}
          question={question.text}
          isOpen={showAITutor}
          onClose={handleCloseAITutor}
        />
      )}
    </Card>
  );
};

export default QuizQuestion;
