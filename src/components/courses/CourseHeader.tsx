
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface CourseMetaType {
  title: string;
  description: string;
  category: string;
  progress: number;
  modules: number;
  completed: number;
  totalDuration: string;
}

interface CourseHeaderProps {
  courseMeta: CourseMetaType;
}

const CourseHeader = ({ courseMeta }: CourseHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Badge className="mb-2">{courseMeta.category}</Badge>
          <h1 className="text-2xl md:text-3xl font-semibold">{courseMeta.title}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">{courseMeta.description}</p>
        </div>
        <Button className="w-full md:w-auto">Continue Learning</Button>
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-8">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
          <div className="flex items-center gap-2">
            <Progress value={courseMeta.progress} className="w-40 h-2" />
            <span className="text-sm font-medium">{courseMeta.progress}%</span>
          </div>
        </div>
        
        <div className="flex gap-4 sm:gap-8">
          <div>
            <p className="text-sm text-muted-foreground">Modules</p>
            <p className="font-medium">{courseMeta.completed}/{courseMeta.modules} completed</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Duration</p>
            <p className="font-medium">{courseMeta.totalDuration}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
