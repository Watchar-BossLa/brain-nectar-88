
import React from 'react';
import { QuizQuestion } from '../types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { renderLatexContent } from '@/components/flashcards/utils/latex-renderer';

interface QuestionDisplayProps {
  question: QuizQuestion;
  selectedAnswer: string;
  setSelectedAnswer: (answer: string) => void;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswer,
  setSelectedAnswer,
  isAnswerSubmitted,
  isCorrect
}) => {
  if (!question) return null;

  return (
    <div className="space-y-4">
      <div className="mb-6">
        {question.useLatex 
          ? renderLatexContent(question.text, true)
          : <p className="text-lg whitespace-pre-line">{question.text}</p>
        }
      </div>
      
      {/* Question input based on type */}
      {!isAnswerSubmitted ? (
        <>
          {(question.type === 'multiple-choice' || question.type === 'true-false') && (
            <RadioGroup 
              value={selectedAnswer} 
              onValueChange={setSelectedAnswer}
              className="space-y-2"
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {question.type === 'calculation' && (
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
          
          {question.type === 'essay' && (
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
        <QuestionFeedback 
          question={question} 
          isCorrect={isCorrect} 
          selectedAnswer={selectedAnswer} 
        />
      )}
    </div>
  );
};

interface QuestionFeedbackProps {
  question: QuizQuestion;
  isCorrect: boolean | null;
  selectedAnswer: string;
}

const QuestionFeedback: React.FC<QuestionFeedbackProps> = ({ 
  question, 
  isCorrect, 
  selectedAnswer 
}) => {
  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <h3 className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </h3>
        
        {!isCorrect && question.type !== 'essay' && (
          <div className="mt-1 text-sm">
            <span className="font-medium">Correct answer: </span>
            {typeof question.correctAnswer === 'string' 
              ? question.correctAnswer 
              : question.correctAnswer?.join(', ')}
          </div>
        )}
        
        <div className="mt-2">
          <h4 className="font-medium mb-1">Explanation:</h4>
          <p className="text-sm whitespace-pre-line">{question.explanation}</p>
        </div>
      </div>
      
      {question.type === 'essay' && (
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
  );
};

// Importing here since it's only used in this component
import { AlertTriangle } from 'lucide-react';

export default QuestionDisplay;
