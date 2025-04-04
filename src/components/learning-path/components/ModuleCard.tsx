
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Module, Topic } from '@/types/learningPath';

interface ModuleCardProps {
  module: Module;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  // Calculate module progress
  const calculateModuleProgress = (module: Module): number => {
    if (!module.topics || module.topics.length === 0) return 0;
    
    const totalMastery = module.topics.reduce((sum: number, topic: Topic) => sum + (topic.mastery || 0), 0);
    return Math.round(totalMastery / module.topics.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{module.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {module.description || 'No description available'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{calculateModuleProgress(module)}%</span>
            </div>
            <Progress value={calculateModuleProgress(module)} className="h-2 mt-1" />
          </div>
          
          <div className="space-y-3">
            {module.topics.slice(0, 3).map((topic) => (
              <div key={topic.id} className="flex items-center gap-2 text-sm">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="flex-1 truncate">{topic.title}</span>
                <span className="text-xs text-muted-foreground">{topic.mastery}%</span>
              </div>
            ))}
            {module.topics.length > 3 && (
              <div className="text-center text-xs text-muted-foreground">
                +{module.topics.length - 3} more topics
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            Start Learning
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ModuleCard;
