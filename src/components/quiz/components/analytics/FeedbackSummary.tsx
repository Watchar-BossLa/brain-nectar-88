import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionFeedback } from '@/components/quiz/components/results/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { SparklesIcon, ThumbsDownIcon, ThumbsUpIcon } from '@heroicons/react/24/outline';

interface FeedbackSummaryProps {
  feedbackData: QuestionFeedback[];
}

const FeedbackSummary: React.FC<FeedbackSummaryProps> = ({ feedbackData }) => {
  const totalCount = feedbackData.length;
  const positiveCount = feedbackData.filter(feedback => feedback.feedback === 'praise').length;
  const issueCount = feedbackData.filter(feedback => feedback.feedback === 'issue').length;
  const suggestionCount = feedbackData.filter(feedback => feedback.feedback === 'suggestion').length;
  const hasFeedback = feedbackData.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Summary</CardTitle>
        <CardDescription>Overview of feedback received for this question.</CardDescription>
      </CardHeader>
      <CardContent>
        {hasFeedback ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <ThumbsUpIcon className="h-6 w-6 text-green-500 mb-2" />
                  <p className="text-2xl font-bold text-green-600">{positiveCount}</p>
                  <p className="text-sm text-muted-foreground">Positive</p>
                </CardContent>
              </Card>
              <Card className="bg-red-50 border-red-200">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <ThumbsDownIcon className="h-6 w-6 text-red-500 mb-2" />
                  <p className="text-2xl font-bold text-red-600">{issueCount}</p>
                  <p className="text-sm text-muted-foreground">Issues</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <SparklesIcon className="h-6 w-6 text-blue-500 mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{suggestionCount}</p>
                  <p className="text-sm text-muted-foreground">Suggestions</p>
                </CardContent>
              </Card>
            </div>
            <h4 className="text-sm font-medium">Recent Feedback</h4>
            <ul className="list-none space-y-2">
              {feedbackData.slice(0, 3).map(feedback => (
                <li key={feedback.questionId} className="flex items-start space-x-3 py-2 border-b last:border-b-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${feedback.userId}.png`} />
                    <AvatarFallback>{feedback.userId?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{feedback.userId}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(feedback.timestamp || ''), 'MMM d, yyyy h:mm a')}</div>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-300">{feedback.feedback}</p>
                  </div>
                </li>
              ))}
            </ul>
            {feedbackData.length > 3 && (
              <p className="text-xs text-muted-foreground">Showing latest 3 of {feedbackData.length} feedback entries</p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">No feedback available for this question.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackSummary;
