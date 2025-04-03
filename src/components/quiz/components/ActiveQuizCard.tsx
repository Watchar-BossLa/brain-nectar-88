
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ActiveQuizCardProps } from '@/types/components/quiz';

const ActiveQuizCard: React.FC<ActiveQuizCardProps> = ({
  question,
  onAnswer,
  currentQuestionIndex = 0,
  totalQuestions = 0,
  selectedAnswer,
  setSelectedAnswer,
  handleAnswerSubmit,
  isSubmitting,
  skipQuestion,
  isAnswerSubmitted
}) => {
  if (!question) {
    return null;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
          <span>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span>
            Difficulty: {question.difficulty > 0.66 ? "Hard" : question.difficulty > 0.33 ? "Medium" : "Easy"}
          </span>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">{question.content ? String(question.content) : ""}</h3>
        </div>
        
        <div className="space-y-3">
          {question.answers?.map((answer: any) => (
            <Button
              key={answer.id}
              variant={selectedAnswer === answer.id ? "default" : "outline"}
              className="w-full justify-start h-auto py-3 px-4 text-left"
              onClick={() => setSelectedAnswer && setSelectedAnswer(answer.id)}
              disabled={isSubmitting}
            >
              {String(answer.content)}
            </Button>
          ))}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={skipQuestion}
            disabled={isSubmitting}
          >
            Skip
          </Button>
          
          <Button
            onClick={handleAnswerSubmit}
            disabled={!selectedAnswer || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Submit Answer"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveQuizCard;
