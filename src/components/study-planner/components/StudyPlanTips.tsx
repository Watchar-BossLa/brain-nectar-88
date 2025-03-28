
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const StudyPlanTips: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Plan Tips</CardTitle>
        <CardDescription>Get the most from your study plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Effective Time Management</h3>
          <p className="text-sm text-muted-foreground">
            Break your study sessions into 25-30 minute blocks with short breaks in between for optimal focus and retention.
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="font-medium">Spaced Repetition</h3>
          <p className="text-sm text-muted-foreground">
            Review material at increasing intervals to improve long-term retention. Integrate flashcards into your study routine.
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="font-medium">Practice Tests</h3>
          <p className="text-sm text-muted-foreground">
            Take regular practice tests to identify knowledge gaps and become familiar with the exam format.
          </p>
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h3 className="font-medium mb-1">Did you know?</h3>
          <p className="text-sm text-muted-foreground">
            Studies show that students who follow a structured study plan are 65% more likely to achieve their target scores.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Study Resources
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyPlanTips;
