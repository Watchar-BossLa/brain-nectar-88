
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen } from 'lucide-react';

interface CourseCardProps {
  title: string;
  category: string;
  progress: number;
  modules: number;
  duration: string;
  image?: string;
  onClick?: () => void;
}

const CourseCard = ({
  title,
  category,
  progress,
  modules,
  duration,
  image,
  onClick
}: CourseCardProps) => {
  return (
    <motion.div
      className="rounded-xl overflow-hidden border border-border bg-card hover-scale subtle-shadow"
      whileHover={{ y: -5 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-40 w-full bg-muted overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/30">
            <BookOpen className="h-16 w-16 text-primary/80" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {category}
          </Badge>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-medium mb-3 line-clamp-2">{title}</h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{modules} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
