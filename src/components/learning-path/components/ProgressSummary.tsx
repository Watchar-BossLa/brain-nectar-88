
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Module } from '@/types/learningPath';

interface ProgressSummaryProps {
  modules: Module[];
  onViewAllModules: () => void;
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ modules, onViewAllModules }) => {
  // Calculate module progress
  const calculateModuleProgress = (module: Module): number => {
    if (!module.topics || module.topics.length === 0) return 0;
    
    const totalMastery = module.topics.reduce((sum: number, topic: any) => sum + (topic.mastery || 0), 0);
    return Math.round(totalMastery / module.topics.length);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Summary</CardTitle>
        <CardDescription>Your learning journey at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {modules.slice(0, 3).map(module => (
            <div key={module.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{module.title}</span>
                <span>
                  {calculateModuleProgress(module)}% Complete
                </span>
              </div>
              <Progress 
                value={calculateModuleProgress(module)} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full" onClick={onViewAllModules}>
          View All Modules
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgressSummary;
