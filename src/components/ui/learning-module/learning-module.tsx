
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TopicItem, TopicItemProps } from './topic-item';
import { cn } from '@/lib/utils';

interface LearningModuleProps {
  id: string;
  title: string;
  topics: TopicItemProps[];
  progress: number;
  totalDuration: string;
  isActive: boolean;
}

export default function LearningModule({ 
  id, 
  title, 
  topics, 
  progress, 
  totalDuration,
  isActive
}: LearningModuleProps) {
  const [expanded, setExpanded] = useState(isActive);
  
  const handleToggle = () => {
    setExpanded(!expanded);
  };
  
  const completedTopics = topics.filter(topic => topic.isCompleted).length;
  
  return (
    <Card className={cn(
      "border transition-all duration-200",
      isActive ? "border-primary/50 shadow-md" : ""
    )}>
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 cursor-pointer" onClick={handleToggle}>
        <div className="flex items-center gap-2">
          {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          <CardTitle className="text-lg font-semibold">
            {title}
          </CardTitle>
          {isActive && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 ml-2">
              Current
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="text-sm text-muted-foreground">{totalDuration}</div>
          <div className="text-sm font-medium">
            {completedTopics}/{topics.length} topics
          </div>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pb-4 pt-0 px-6">
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="space-y-2">
            {topics.map((topic) => (
              <TopicItem
                key={topic.id}
                id={topic.id}
                title={topic.title}
                duration={topic.duration}
                isCompleted={topic.isCompleted}
                onClick={topic.onClick}
              />
            ))}
          </div>
          
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              {completedTopics === topics.length ? "Review Module" : "Continue Module"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
