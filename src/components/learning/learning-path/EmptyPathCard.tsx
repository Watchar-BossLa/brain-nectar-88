
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';

interface EmptyPathCardProps {
  onGenerate: () => void;
  isGenerating: boolean;
  isQualificationSelected: boolean;
}

const EmptyPathCard = ({ onGenerate, isGenerating, isQualificationSelected }: EmptyPathCardProps) => {
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
          disabled={isGenerating || !isQualificationSelected}
        >
          {isGenerating ? 'Generating...' : 'Generate Learning Path'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmptyPathCard;
