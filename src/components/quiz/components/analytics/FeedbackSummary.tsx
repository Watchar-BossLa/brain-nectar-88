
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, Flag, Calendar } from 'lucide-react';

export interface FeedbackSummaryProps {
  feedbackData: {
    total: number;
    byType: Record<string, number>;
    byRating: Record<number, number>;
    recentFeedback: any[];
  };
}

const FeedbackSummary: React.FC<FeedbackSummaryProps> = ({ feedbackData }) => {
  const { total, byType, byRating, recentFeedback } = feedbackData;
  
  const feedbackTypeIcon = (type: string) => {
    switch (type) {
      case 'issue':
        return <Flag className="h-4 w-4 text-destructive" />;
      case 'suggestion':
        return <MessageSquare className="h-4 w-4 text-amber-500" />;
      case 'praise':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const feedbackTypeBadge = (type: string) => {
    let variant: "default" | "destructive" | "outline" | "secondary" = "outline";
    
    switch (type) {
      case 'issue':
        variant = "destructive";
        break;
      case 'suggestion':
        variant = "secondary";
        break;
      case 'praise':
        variant = "default";
        break;
    }
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {feedbackTypeIcon(type)}
        <span className="capitalize">{type}</span>
      </Badge>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-7">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Feedback Summary</CardTitle>
          <CardDescription>Overview of question feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold">{total}</div>
              <p className="text-xs text-muted-foreground">Total feedback submissions</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">By Type</p>
              <div className="space-y-1">
                {Object.entries(byType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {feedbackTypeIcon(type)}
                      <span className="capitalize">{type}</span>
                    </div>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">By Rating</p>
              <div className="space-y-1">
                {Object.entries(byRating).map(([rating, count]) => (
                  <div key={rating} className="flex items-center justify-between text-sm">
                    <span>{rating} {Number(rating) === 1 ? 'Star' : 'Stars'}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-5">
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>Latest feedback from students</CardDescription>
        </CardHeader>
        <CardContent>
          {recentFeedback.length > 0 ? (
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div key={feedback.id} className="space-y-2 border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {feedbackTypeBadge(feedback.feedback_type)}
                      <span className="text-sm text-muted-foreground">
                        {Array(feedback.rating).fill('★').join('')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm">{feedback.feedback_text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No feedback submitted yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackSummary;
