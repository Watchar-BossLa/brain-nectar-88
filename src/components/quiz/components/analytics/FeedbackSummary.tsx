
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Flag, ThumbsUp } from 'lucide-react';
import { getAllFeedback } from '../../services/feedbackService';
import { QuestionFeedback } from '../results/types';

interface FeedbackSummaryProps {
  questionId?: string; // Optional, if provided will filter feedback for just this question
}

const FeedbackSummary: React.FC<FeedbackSummaryProps> = ({ questionId }) => {
  // In a real app, this would be state fetched from an API
  // For this demo, we'll just read from localStorage directly
  const allFeedback: QuestionFeedback[] = getAllFeedback();
  
  // Filter by questionId if provided
  const feedback = questionId 
    ? allFeedback.filter(f => f.questionId === questionId)
    : allFeedback;
  
  // Count by type
  const issueCount = feedback.filter(f => f.feedbackType === 'issue').length;
  const suggestionCount = feedback.filter(f => f.feedbackType === 'suggestion').length;
  const praiseCount = feedback.filter(f => f.feedbackType === 'praise').length;
  
  // If no feedback yet
  if (feedback.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Question Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No feedback has been provided yet. Feedback helps us improve our questions.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Question Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
            <Flag className="h-5 w-5 text-red-500 mb-1" />
            <p className="text-sm text-muted-foreground">Issues</p>
            <p className="text-2xl font-bold">{issueCount}</p>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
            <MessageSquare className="h-5 w-5 text-amber-500 mb-1" />
            <p className="text-sm text-muted-foreground">Suggestions</p>
            <p className="text-2xl font-bold">{suggestionCount}</p>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
            <ThumbsUp className="h-5 w-5 text-green-500 mb-1" />
            <p className="text-sm text-muted-foreground">Praise</p>
            <p className="text-2xl font-bold">{praiseCount}</p>
          </div>
        </div>
        
        {feedback.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Recent Feedback</h4>
            <div className="space-y-3 max-h-[300px] overflow-auto">
              {feedback.slice(0, 5).map((item, index) => (
                <div key={index} className="p-3 border rounded-md text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    {item.feedbackType === 'issue' && (
                      <Flag className="h-4 w-4 text-red-500" />
                    )}
                    {item.feedbackType === 'suggestion' && (
                      <MessageSquare className="h-4 w-4 text-amber-500" />
                    )}
                    {item.feedbackType === 'praise' && (
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                    )}
                    <span className="font-medium capitalize">{item.feedbackType}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{item.feedbackText}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackSummary;
