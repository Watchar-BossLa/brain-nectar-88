
import React from 'react';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NoSessionsMessage: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Trophy className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
    <h3 className="text-xl font-medium mb-2">No Quiz History</h3>
    <p className="text-muted-foreground max-w-md">
      You haven't taken any quizzes yet. Start a quiz to track your progress and see your history here.
    </p>
    <Button variant="outline" className="mt-6">Take a Quiz</Button>
  </div>
);

export default NoSessionsMessage;
