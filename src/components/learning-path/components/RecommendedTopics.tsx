
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Module } from '@/types/learningPath';

interface RecommendedTopicsProps {
  modules: Module[];
}

const RecommendedTopics: React.FC<RecommendedTopicsProps> = ({ modules }) => {
  // Get all topics and filter recommended ones
  const allTopics = modules.flatMap(module => 
    module.topics.map(topic => ({
      ...topic,
      moduleTitle: module.title
    }))
  );
  
  const recommendedTopics = allTopics
    .filter(topic => topic.recommended)
    .sort((a, b) => a.mastery - b.mastery);
  
  if (recommendedTopics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Recommendations</CardTitle>
          <CardDescription>
            Great job! You've made good progress across all topics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-8">
            <Star className="h-16 w-16 text-yellow-500 mb-4" />
            <p className="text-center text-muted-foreground">
              Continue with your current modules or explore new content.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recommended Focus Areas</h3>
      
      <div className="divide-y">
        {recommendedTopics.slice(0, 5).map(topic => (
          <div key={topic.id} className="py-3 px-1">
            <div className="flex justify-between items-center mb-1">
              <div>
                <h4 className="font-medium">{topic.title}</h4>
                <p className="text-xs text-muted-foreground">From: {topic.moduleTitle}</p>
              </div>
              <Button size="sm">Study Now</Button>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Progress value={topic.mastery} className="h-2 flex-1" />
              <span className="text-xs whitespace-nowrap">{topic.mastery}% Mastery</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedTopics;
