
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, BookOpen, Clock, BarChart } from 'lucide-react';

interface CognitiveProfileCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: 'brain' | 'book' | 'clock' | 'chart';
  progress?: number;
}

const CognitiveProfileCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  progress 
}: CognitiveProfileCardProps) => {
  const renderIcon = () => {
    switch (icon) {
      case 'brain':
        return <Brain className="h-5 w-5 text-primary" />;
      case 'book':
        return <BookOpen className="h-5 w-5 text-primary" />;
      case 'clock':
        return <Clock className="h-5 w-5 text-primary" />;
      case 'chart':
        return <BarChart className="h-5 w-5 text-primary" />;
      default:
        return <Brain className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            {renderIcon()}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{value}</div>
        {progress !== undefined && (
          <>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CognitiveProfileCard;
