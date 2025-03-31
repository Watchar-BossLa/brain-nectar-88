
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { QuestionFeedback } from '../results/types';
import { MessageCircle, Flag, ThumbsUp } from 'lucide-react';

interface FeedbackSummaryProps {
  feedbackData: QuestionFeedback[];
}

const FeedbackSummary: React.FC<FeedbackSummaryProps> = ({ feedbackData }) => {
  const [activeTab, setActiveTab] = useState('all');
  
  if (!feedbackData || feedbackData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feedback Summary</CardTitle>
          <CardDescription>No feedback data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            No feedback has been collected yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Process feedback data
  const issueCount = feedbackData.filter(item => item.feedbackType === 'issue').length;
  const suggestionCount = feedbackData.filter(item => item.feedbackType === 'suggestion').length;
  const praiseCount = feedbackData.filter(item => item.feedbackType === 'praise').length;
  
  // Calculate average rating
  const totalRating = feedbackData.reduce((sum, item) => sum + item.rating, 0);
  const averageRating = totalRating / feedbackData.length;
  
  // Filter data based on active tab
  const filteredData = activeTab === 'all' 
    ? feedbackData 
    : feedbackData.filter(item => item.feedbackType === activeTab);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" /> Feedback Summary
        </CardTitle>
        <CardDescription>
          Analysis of student feedback on questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-center">
            <p className="text-sm text-muted-foreground mb-1">Issues</p>
            <p className="text-2xl font-bold text-red-600">{issueCount}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-center">
            <p className="text-sm text-muted-foreground mb-1">Suggestions</p>
            <p className="text-2xl font-bold text-amber-600">{suggestionCount}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
            <p className="text-sm text-muted-foreground mb-1">Praise</p>
            <p className="text-2xl font-bold text-green-600">{praiseCount}</p>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="all">All Feedback</TabsTrigger>
            <TabsTrigger value="issue">Issues</TabsTrigger>
            <TabsTrigger value="suggestion">Suggestions</TabsTrigger>
            <TabsTrigger value="praise">Praise</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {filteredData.map((item, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant={
                      item.feedbackType === 'issue' ? "destructive" : 
                      item.feedbackType === 'suggestion' ? "secondary" : 
                      "outline"
                    }>
                      {item.feedbackType === 'issue' && <Flag className="h-3 w-3 mr-1" />}
                      {item.feedbackType === 'suggestion' && <MessageCircle className="h-3 w-3 mr-1" />}
                      {item.feedbackType === 'praise' && <ThumbsUp className="h-3 w-3 mr-1" />}
                      {item.feedbackType?.charAt(0).toUpperCase() + item.feedbackType?.slice(1)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp || item.createdAt || '').toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1">{item.questionText}</p>
                  <p className="text-sm text-muted-foreground">{item.feedbackText || item.feedback}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FeedbackSummary;
