
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLearningPath } from '@/hooks/useLearningPath';
import { ChevronDown, ChevronRight, CheckCircle, BookOpen, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import LearningModule from '@/components/ui/learning-module';
import { TopicItemProps } from '@/components/ui/learning-module/topic-item';

const LearningPathDisplay = () => {
  const { currentPath, loading, error, refreshPath } = useLearningPath();
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };
  
  if (loading) {
    return <LearningPathSkeleton />;
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading learning path: {error.message}</p>
            <Button onClick={() => refreshPath()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentPath || !currentPath.modules || currentPath.modules.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="text-center">
            <p className="mb-4">No learning path available. Please select a qualification to begin.</p>
            <Button onClick={() => window.location.href = '/qualifications'}>
              Browse Qualifications
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalTopics = currentPath.modules.reduce((acc, module) => acc + module.topics.length, 0);
  const completedTopics = currentPath.modules.reduce((acc, module) => 
    acc + module.topics.filter(topic => topic.status === 'completed').length, 0);
  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Journey</CardTitle>
          <CardDescription>Track your progress through the qualification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <span className="text-sm font-medium">{completedTopics}/{totalTopics} topics completed</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 border rounded-md">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Modules</p>
                <p className="text-xl font-bold">
                  {currentPath.modules.filter(m => m.status === 'completed').length}/{currentPath.modules.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-md">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Time Remaining</p>
                <p className="text-xl font-bold">
                  {Math.round((totalTopics - completedTopics) * 0.5)} hours
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {currentPath.modules.map((module, index) => {
          // Convert module topics to the format expected by LearningModule
          const topicItems: TopicItemProps[] = module.topics.map(topic => ({
            id: topic.id,
            title: topic.title,
            duration: '30 min',
            isCompleted: topic.status === 'completed'
          }));
          
          // Calculate module progress
          const moduleProgress = module.topics.length > 0 
            ? Math.round((module.topics.filter(t => t.status === 'completed').length / module.topics.length) * 100) 
            : 0;
            
          return (
            <LearningModule
              key={module.id}
              id={module.id}
              title={module.title}
              topics={topicItems}
              progress={moduleProgress}
              totalDuration={`${module.topics.length * 0.5} hours`}
              isActive={index === 0 || module.status === 'in_progress'}
            />
          );
        })}
      </div>
    </div>
  );
};

const LearningPathSkeleton = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-2 w-full mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
};

export default LearningPathDisplay;
