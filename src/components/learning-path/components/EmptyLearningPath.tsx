
import React from 'react';
import { GraduationCap, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyLearningPathProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

const EmptyLearningPath: React.FC<EmptyLearningPathProps> = ({ onGenerate, isGenerating }) => {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>No Learning Path Available</CardTitle>
        <CardDescription>
          Generate a personalized learning path to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          Your adaptive learning path will be tailored to your progress and strengths.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>Generate Learning Path</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmptyLearningPath;
