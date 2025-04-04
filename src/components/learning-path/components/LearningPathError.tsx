
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LearningPathErrorProps {
  onRetry: () => void;
}

const LearningPathError: React.FC<LearningPathErrorProps> = ({ onRetry }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-500">Error Loading Learning Path</CardTitle>
        <CardDescription>
          We encountered a problem while loading your learning path.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          This could be due to a network issue or server problem.
        </p>
        <Button onClick={onRetry}>Try Again</Button>
      </CardContent>
    </Card>
  );
};

export default LearningPathError;
