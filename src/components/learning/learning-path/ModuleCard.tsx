
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';

interface ModuleCardProps {
  index: number;
  module: {
    title: string;
    topics: Array<{
      id: string;
      title: string;
      mastery: number;
    }>;
  };
}

const ModuleCard = ({ index, module }: ModuleCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover-scale subtle-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Module {index}</CardTitle>
          <CardDescription>
            {index === 1 ? 'Financial Reporting' : 
             index === 2 ? 'Audit and Assurance' : 'Taxation'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((topicIndex) => (
              <div key={`${index}-${topicIndex}`} className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">
                      Topic {topicIndex}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {Math.floor(Math.random() * 100)}% Mastery
                    </span>
                  </div>
                  <Progress value={Math.floor(Math.random() * 100)} className="h-1" />
                </div>
              </div>
            ))}
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
