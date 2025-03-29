
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Zap } from 'lucide-react';
import { AnalyticsTabProps } from '../../types/platform-types';

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ answeredQuestions, setActiveTab }) => {
  return (
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
            {answeredQuestions.length > 0 ? (
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
  );
};

export default AnalyticsTab;
